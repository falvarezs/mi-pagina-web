// CheckoutPage.tsx
import { useEffect, useState } from 'react';
import { courses } from '../data/courses';
import {
  PaymentMethodSelector,
  type PaymentMethod,
  DebitVenPayment,
  C2PPayment,
  USDTPayment,
  ZellePayment
} from '../components/PaymentMethods';
import { FileUpload } from '../components/FileUpload';
import { supabase } from '../lib/supabaseClient';
import { sendPaymentReceivedEmail } from '../lib/emailService';

interface CheckoutPageProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

// Tasa de cambio (en producción vendría de una API)
const EXCHANGE_RATE = 378.46;

export function CheckoutPage({ courseId, onNavigate }: CheckoutPageProps) {
  const course = courses.find(c => c.id === Number(courseId));  // ← CAMBIADO: Convertir courseId a number
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        setEmail(data.session.user.email);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    loadSession();
  }, []);

  if (!course) {
    return <div>Curso no encontrado</div>;
  }

  const uploadProof = async (selectedFile: File, userId: string) => {
    const extension = selectedFile.name.split('.').pop() || 'jpg';
    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filePath = `${course.id}_${Date.now()}_${userId}.${safeExtension || 'jpg'}`;

    const { error: uploadError } = await supabase.storage
      .from('comprobantes')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('comprobantes').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !file) return;

    setSubmitting(true);
    setError('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id ?? null;

      if (!userId) {
        setError('Debes iniciar sesión para completar la compra.');
        setSubmitting(false);
        return;
      }

      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', course.id)  // ← CAMBIADO: Ya no usa Number() porque course.id ya es number
        .maybeSingle();

      if (existingPurchase) {
        setError('Ya enviaste un comprobante para este curso.');
        setSubmitting(false);
        return;
      }

      const proofUrl = await uploadProof(file, userId);

      const { data: purchaseData, error: insertError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          course_id: course.id,  // ← CAMBIADO: Ya no usa Number()
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

      await sendPaymentReceivedEmail({
        to: email,
        name,
        courseTitle: course.title,
        amount: `$${course.price} USD`,
        paymentMethod: selectedMethod,
      });

      setSubmitted(true);
      return purchaseData;
    } catch (err) {
      const fallbackMessage = 'No pudimos enviar tu comprobante. Intenta de nuevo.';
      const message = err instanceof Error ? err.message : fallbackMessage;
      console.error('Error en checkout:', err);
      setError(message || fallbackMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const amountVES = course.price * EXCHANGE_RATE;

  if (submitted) {
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
              ¡Solicitud Enviada con Éxito!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Hemos recibido tu comprobante de pago. Verificaremos tu pago en las próximas <strong>24-48 horas hábiles</strong>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">¿Qué sigue?</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Revisaremos tu comprobante de pago</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Te enviaremos un email a <strong>{email}</strong> cuando tu pago sea confirmado</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Podrás acceder al curso inmediatamente desde "Mi Panel"</span>
                </li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate('home')}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Volver al Inicio
              </button>
              <button 
                onClick={() => onNavigate('courses')}
                className="px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Explorar Más Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => onNavigate('course', { slug: course.slug })}
            className="flex items-center text-gray-600 hover:text-[#FF6B6B] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al curso
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Finalizar Compra
              </h1>
              <p className="text-gray-600 mb-8">
                Selecciona tu método de pago preferido y sube tu comprobante
              </p>

              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm mb-6">
                  Para completar la compra, primero debes iniciar sesión con tu cuenta.
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="ml-2 font-semibold text-amber-900 underline"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {/* Personal Info */}
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
                    <p className="text-sm text-gray-500 mt-1">
                      Te enviaremos el acceso al curso a este email
                    </p>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <PaymentMethodSelector 
                    onSelectMethod={setSelectedMethod}
                    selectedMethod={selectedMethod}
                    coursePriceUSD={course.price}
                  />
                </div>

                {/* Payment Instructions */}
                {selectedMethod === 'debit-ven' && <DebitVenPayment amount={amountVES} />}
                {selectedMethod === 'c2p' && <C2PPayment amount={amountVES} />}
                {selectedMethod === 'usdt' && <USDTPayment amount={course.price} />}
                {selectedMethod === 'zelle' && <ZellePayment amount={course.price} />}

                {/* File Upload */}
                {selectedMethod && (
                  <FileUpload onFileSelect={setFile} />
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={!selectedMethod || !file || !email || !name || submitting}
                  className="w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B] text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {submitting ? 'Enviando...' : !selectedMethod ? 'Selecciona un método de pago' : !file ? 'Sube tu comprobante' : 'Enviar Solicitud de Compra'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar aceptas nuestros{' '}
                  <button type="button" onClick={() => onNavigate('terms')} className="text-[#FF6B6B] hover:underline">
                    Términos y Condiciones
                  </button>
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary - Sticky */}
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
                {selectedMethod && (selectedMethod === 'debit-ven' || selectedMethod === 'c2p') && (
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
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">Total:</span>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-[#FF6B6B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${course.price}
                    </div>
                    {selectedMethod && (selectedMethod === 'debit-ven' || selectedMethod === 'c2p') && (
                      <div className="text-sm text-gray-600">
                        ≈ Bs. {amountVES.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-800 leading-relaxed">
                  ✓ Acceso de por vida<br/>
                  ✓ Todas las actualizaciones<br/>
                  ✓ Certificado incluido<br/>
                  ✓ Recursos descargables<br/>
                  ✓ Soporte via email
                </p>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Pago seguro · Confirmación en 24-48h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}