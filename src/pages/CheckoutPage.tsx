import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import {
  PaymentMethodSelector,
  type PaymentMethod,
  PagoMovilPayment,
  USDTPayment,
  ZellePayment
} from '../components/PaymentMethods';
import { FileUpload } from '../components/FileUpload';
import { supabase } from '../lib/supabaseClient';

interface CheckoutPageProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

const EXCHANGE_RATE = 378.46;

type PageState = 'form' | 'loading' | 'success' | 'error' | 'already-purchased';

export function CheckoutPage({ courseId, onNavigate }: CheckoutPageProps) {
  const course = courses.find(c => c.id === Number(courseId));
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          setEmail(data.session.user.email);
          setIsLoggedIn(true);

          const userId = data.session.user.id;

          // Verificar si ya tiene compra
          const { data: existingPurchase } = await supabase
            .from('purchases')
            .select('id, status')
            .eq('user_id', userId)
            .eq('course_id', Number(courseId))
            .maybeSingle();

          if (existingPurchase) {
            // Aprobado o pendiente → no puede comprar
            if (
              existingPurchase.status === 'approved' ||
              existingPurchase.status === 'pending'
            ) {
              setPageState('already-purchased');
              return;
            }
            // Rechazado → borrar compra vieja y dejar comprar de nuevo
            if (existingPurchase.status === 'rejected') {
              await supabase
                .from('purchases')
                .delete()
                .eq('id', existingPurchase.id);
            }
          }
        } else {
          setIsLoggedIn(false);
        }
        setPageState('form');
      } catch {
        setPageState('form');
      }
    };

    loadSession();
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
          <button
            onClick={() => onNavigate('courses')}
            className="cursor-pointer text-[#FF6B6B] hover:underline font-semibold"
          >
            Ver todos los cursos
          </button>
        </div>
      </div>
    );
  }

  const uploadProof = async (selectedFile: File, userId: string) => {
    const filePath = `${course.id}_${Date.now()}_${userId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('comprobantes')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('comprobantes').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !file) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id ?? null;

      if (!userId) {
        setErrorMessage('Debes iniciar sesión para completar la compra.');
        setPageState('error');
        setSubmitting(false);
        return;
      }

      // Verificar compra duplicada
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id, status')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .maybeSingle();

      if (existingPurchase) {
        // Aprobado o pendiente → no puede comprar
        if (
          existingPurchase.status === 'approved' ||
          existingPurchase.status === 'pending'
        ) {
          setPageState('already-purchased');
          setSubmitting(false);
          return;
        }
        // Rechazado → borrar compra vieja
        if (existingPurchase.status === 'rejected') {
          await supabase
            .from('purchases')
            .delete()
            .eq('id', existingPurchase.id);
        }
      }

      // Subir PDF
      const proofUrl = await uploadProof(file, userId);

      // Guardar compra
      const { error: insertError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          course_id: course.id,
          payment_method: selectedMethod,
          payment_reference: `${name} - ${email}`,
          payment_proof_url: proofUrl,
          amount: course.price,
          currency: 'USD',
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setPageState('success');

    } catch (err) {
      console.error('Error en checkout:', err);
      let mensaje = 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes('storage') || msg.includes('upload')) {
          mensaje = 'No pudimos subir tu comprobante PDF. Verifica que el archivo no esté dañado e intenta de nuevo.';
        } else if (msg.includes('network') || msg.includes('fetch')) {
          mensaje = 'Error de conexión a internet. Verifica tu conexión e intenta de nuevo.';
        } else if (msg.includes('jwt') || msg.includes('auth')) {
          mensaje = 'Tu sesión expiró. Por favor inicia sesión de nuevo.';
        } else if (msg.includes('duplicate') || msg.includes('unique')) {
          mensaje = 'Ya existe una solicitud para este curso.';
        } else {
          mensaje = err.message;
        }
      }
      setErrorMessage(mensaje);
      setPageState('error');
    } finally {
      setSubmitting(false);
    }
  };

  const amountVES = course.price * EXCHANGE_RATE;

  // ── Cargando ──
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando tu cuenta...</p>
        </div>
      </div>
    );
  }

  // ── Ya tiene el curso (aprobado o pendiente) ──
  if (pageState === 'already-purchased') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Ya tienes este curso!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Ya enviaste un comprobante de pago para <strong>{course.title}</strong>. No es necesario pagar dos veces.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">¿Qué puedes hacer?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold mt-0.5">→</span>
                  <span>Si tu pago ya fue <strong>aprobado</strong>, puedes acceder al curso desde tu panel.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold mt-0.5">→</span>
                  <span>Si tu pago está <strong>pendiente</strong>, espera entre 24-48 horas hábiles.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold mt-0.5">→</span>
                  <span>Si tienes algún problema contáctanos por WhatsApp o email.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Ir a Mi Panel
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="cursor-pointer px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Éxito ──
  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Comprobante Enviado con Éxito!
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              Hola <strong>{name}</strong>, hemos recibido tu comprobante de pago.
            </p>
            <p className="text-gray-600 mb-6">
              Verificaremos tu pago en las próximas <strong>24-48 horas hábiles</strong> y te notificaremos a <strong>{email}</strong>.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">¿Qué sigue?</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Revisaremos tu comprobante PDF</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Te enviaremos una confirmación a <strong>{email}</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Podrás acceder al curso desde <strong>"Mi Panel"</strong> inmediatamente después de la aprobación</span>
                </li>
              </ol>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-amber-800">
                📧 Revisa también tu carpeta de <strong>spam</strong> por si el email de confirmación llega ahí.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Ir a Mi Panel
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="cursor-pointer px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              No pudimos enviar tu comprobante
            </h2>
            <p className="text-gray-600 mb-6">
              Ocurrió un problema al procesar tu solicitud.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-left">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">Detalle del error:</p>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">¿Qué puedes hacer?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-gray-400 font-bold mt-0.5">→</span>
                  <span>Verifica que tu archivo sea un <strong>PDF válido</strong> y no esté dañado.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-400 font-bold mt-0.5">→</span>
                  <span>Asegúrate de tener <strong>buena conexión a internet</strong>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-400 font-bold mt-0.5">→</span>
                  <span>Si el error persiste, contáctanos directamente por <strong>WhatsApp</strong>.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setPageState('form');
                  setErrorMessage('');
                  setFile(null);
                }}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                🔄 Volver a Intentar
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="cursor-pointer px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario ──
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Botón volver */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('course', { slug: course.slug })}
            className="cursor-pointer flex items-center text-gray-600 hover:text-[#FF6B6B] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al curso
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Finalizar Compra
              </h1>
              <p className="text-gray-600 mb-8">
                Selecciona tu método de pago y sube tu comprobante en PDF
              </p>

              {/* Aviso no logueado */}
              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-4 rounded-lg text-sm mb-6">
                  <p className="font-semibold mb-1">⚠️ Debes iniciar sesión para continuar</p>
                  <p className="mb-2">Para completar la compra necesitas una cuenta registrada.</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="cursor-pointer font-bold text-amber-900 underline"
                  >
                    Iniciar sesión →
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Datos personales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tus Datos</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none"
                      placeholder="tu@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Te enviaremos la confirmación de pago a este email
                    </p>
                  </div>
                </div>

                {/* Selector método de pago */}
                <PaymentMethodSelector
                  onSelectMethod={setSelectedMethod}
                  selectedMethod={selectedMethod}
                  coursePriceUSD={course.price}
                />

                {/* Instrucciones del método */}
                {selectedMethod === 'pagomovil' && <PagoMovilPayment amount={course.price} />}
                {selectedMethod === 'usdt' && <USDTPayment amount={course.price} />}
                {selectedMethod === 'zelle' && <ZellePayment amount={course.price} />}

                {/* Subir PDF */}
                {selectedMethod && (
                  <FileUpload onFileSelect={setFile} />
                )}

                {/* Botón enviar */}
                <button
                  type="submit"
                  disabled={!selectedMethod || !file || !email || !name || submitting || !isLoggedIn}
                  className="cursor-pointer w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {submitting
                    ? '⏳ Enviando comprobante...'
                    : !isLoggedIn
                    ? '🔒 Inicia sesión para continuar'
                    : !selectedMethod
                    ? 'Selecciona un método de pago'
                    : !file
                    ? 'Sube tu comprobante PDF'
                    : '✅ Enviar Comprobante de Pago'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar aceptas nuestros{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('terms')}
                    className="cursor-pointer text-[#FF6B6B] hover:underline"
                  >
                    Términos y Condiciones
                  </button>
                </p>
              </form>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Resumen de Compra
              </h3>
              <div className="border-b pb-4 mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900">{course.title}</h4>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio del curso:</span>
                  <span className="font-semibold">${course.price} USD</span>
                </div>
                {selectedMethod === 'pagomovil' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">En Bolívares:</span>
                    <span className="font-semibold">Bs. {amountVES.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comisión:</span>
                  <span className="font-semibold text-green-600">$0</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total:</span>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-[#FF6B6B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${course.price} USD
                    </div>
                    {selectedMethod === 'pagomovil' && (
                      <div className="text-sm text-gray-600">
                        ≈ Bs. {amountVES.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-xs text-green-800 leading-relaxed">
                  ✔ Acceso de por vida<br />
                  ✔ Todas las actualizaciones<br />
                  ✔ Certificado incluido<br />
                  ✔ Recursos descargables<br />
                  ✔ Soporte via email
                </p>
              </div>
              <p className="text-xs text-gray-500 text-center">
                🔒 Pago seguro · Confirmación en 24-48h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}