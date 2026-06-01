import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { courses } from '../data/courses';

const courseTitleById = courses.reduce<Record<number, string>>((acc, course) => {
  acc[course.id] = course.title;
  return acc;
}, {});

interface AdminPageProps {
  onNavigate: (page: string, data?: any) => void;
}

type PurchaseStatus = 'pending' | 'approved' | 'rejected';

interface PurchaseRow {
  id: number;
  user_id: string | null;
  course_id: number;
  payment_method: string | null;
  payment_reference: string | null;
  payment_proof_url: string | null;
  amount: number | null;
  currency: string | null;
  status: PurchaseStatus | null;
  created_at: string | null;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

const statusStyles: Record<PurchaseStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const statusLabels: Record<PurchaseStatus, string> = {
  pending: '⏳ Pendiente',
  approved: '✅ Aprobado',
  rejected: '❌ Rechazado',
};

const methodLabels: Record<string, string> = {
  pagomovil: '📱 Pago Móvil',
  usdt: '💰 USDT / Binance',
  zelle: '🏦 Zelle',
  whatsapp: '💬 WhatsApp',
};

// ── Estilos inline de respaldo para Safari iOS ──────────────────────
const baseButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: 700,
  borderRadius: '9999px',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s',
  fontSize: '14px',
  minHeight: '44px',
  lineHeight: 1.2,
  textAlign: 'center',
  WebkitAppearance: 'none',
  appearance: 'none',
  WebkitTapHighlightColor: 'transparent',
  userSelect: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const headerBackButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  padding: '10px 20px',
  backgroundColor: '#374151',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  textDecoration: 'none',
};

const cardToggleButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '16px',
  backgroundColor: '#ffffff',
  color: '#111827',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  WebkitAppearance: 'none',
  appearance: 'none',
  WebkitTapHighlightColor: 'transparent',
  fontFamily: "'Montserrat', sans-serif",
};

const greenButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  width: '100%',
  padding: '16px 24px',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  borderRadius: '12px',
  fontSize: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const approveButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  padding: '10px 20px',
  backgroundColor: '#059669',
  color: '#ffffff',
};

const rejectButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  padding: '10px 20px',
  backgroundColor: '#e11d48',
  color: '#ffffff',
};

const grayButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  padding: '10px 18px',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #e5e7eb',
};

const darkButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  padding: '10px 18px',
  backgroundColor: '#111827',
  color: '#ffffff',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  minHeight: '48px',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '16px',
  backgroundColor: '#ffffff',
  color: '#111827',
  WebkitAppearance: 'none',
  appearance: 'none',
  fontFamily: "'Montserrat', sans-serif",
};

const selectStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  minHeight: '48px',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '16px',
  backgroundColor: '#ffffff',
  color: '#111827',
  cursor: 'pointer',
  fontFamily: "'Montserrat', sans-serif",
};

const getPurchaseStatus = (status: PurchaseStatus | null): PurchaseStatus => {
  return status ?? 'pending';
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const isValidExternalUrl = (url: string | null): boolean => {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
};

const formatDate = (value: string | null): string => {
  if (!value) return 'Sin fecha';

  try {
    return new Date(value).toLocaleString('es-ES');
  } catch {
    return 'Sin fecha';
  }
};

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [profilesById, setProfilesById] = useState<Record<string, ProfileRow>>({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus>('pending');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState({
    email: '',
    courseId: '1',
    method: 'whatsapp',
    amount: '40',
    reference: '',
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');

  const filtered = useMemo(
    () => purchases.filter((p) => getPurchaseStatus(p.status) === selectedStatus),
    [purchases, selectedStatus]
  );

  const counts = useMemo(() => ({
    pending: purchases.filter(p => getPurchaseStatus(p.status) === 'pending').length,
    approved: purchases.filter(p => getPurchaseStatus(p.status) === 'approved').length,
    rejected: purchases.filter(p => getPurchaseStatus(p.status) === 'rejected').length,
  }), [purchases]);

  const loadPurchases = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('No pudimos cargar las compras: ' + fetchError.message);
        setPurchases([]);
        setProfilesById({});
        return;
      }

      const purchaseRows = (data ?? []) as PurchaseRow[];
      setPurchases(purchaseRows);

      const userIds = Array.from(
        new Set(
          purchaseRows
            .map((purchase) => purchase.user_id)
            .filter((id): id is string => Boolean(id))
        )
      );

      if (userIds.length === 0) {
        setProfilesById({});
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', userIds);

      if (profileError) {
        console.warn('No pudimos cargar perfiles:', profileError.message);
        setProfilesById({});
        return;
      }

      const profileMap = ((profileData ?? []) as ProfileRow[]).reduce<Record<string, ProfileRow>>(
        (acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        },
        {}
      );

      setProfilesById(profileMap);
    } catch (err) {
      console.error('Error cargando compras:', err);
      setError('No pudimos cargar las compras. Revisa la conexión e intenta de nuevo.');
      setPurchases([]);
      setProfilesById({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const updateStatus = async (purchaseId: number, status: PurchaseStatus) => {
    if (updating !== null) return;

    setUpdating(purchaseId);
    setError('');
    setSuccessMessage('');

    try {
      const { error: updateError } = await supabase
        .from('purchases')
        .update({ status })
        .eq('id', purchaseId);

      if (updateError) {
        setError('No pudimos actualizar el estado: ' + updateError.message);
        return;
      }

      const action = status === 'approved' ? 'aprobado' : 'rechazado';
      setSuccessMessage(`✅ Pago ${action} correctamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadPurchases();
    } catch (err) {
      console.error('Error actualizando estado:', err);
      setError('No pudimos actualizar el estado. Intenta de nuevo.');
    } finally {
      setUpdating(null);
    }
  };

  const handleManualPurchase = async (e: FormEvent) => {
    e.preventDefault();

    if (manualLoading) return;

    setManualLoading(true);
    setManualError('');
    setManualSuccess('');
    setError('');
    setSuccessMessage('');

    try {
      const email = normalizeEmail(manualForm.email);
      const amount = Number(manualForm.amount);
      const courseId = Number(manualForm.courseId);
      const selectedCourse = courses.find((course) => course.id === courseId);

      if (!email || !email.includes('@')) {
        throw new Error('Escribe un email válido del estudiante.');
      }

      if (!selectedCourse) {
        throw new Error('Selecciona un curso válido.');
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('El monto debe ser mayor a 0.');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        throw new Error('Error al buscar el perfil: ' + profileError.message);
      }

      if (!profile) {
        throw new Error(`No se encontró ninguna cuenta con el email: ${email}`);
      }

      const { data: existing, error: existingError } = await supabase
        .from('purchases')
        .select('id, status')
        .eq('user_id', profile.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existingError) {
        throw new Error('Error revisando compras anteriores: ' + existingError.message);
      }

      if (existing && existing.status === 'approved') {
        throw new Error('Este estudiante ya tiene el curso aprobado.');
      }

      if (existing) {
        const { error: deleteError } = await supabase
          .from('purchases')
          .delete()
          .eq('id', existing.id);

        if (deleteError) {
          throw new Error('No se pudo reemplazar la compra anterior: ' + deleteError.message);
        }
      }

      const referenceText = manualForm.reference.trim();
      const finalReference = referenceText
        ? `${profile.full_name || 'Estudiante'} - ${email} - ${referenceText}`
        : `${profile.full_name || 'Estudiante'} - ${email}`;

      const { error: insertError } = await supabase
        .from('purchases')
        .insert({
          user_id: profile.id,
          course_id: courseId,
          payment_method: manualForm.method,
          payment_reference: finalReference,
          payment_proof_url: null,
          amount,
          currency: 'USD',
          status: 'approved',
        });

      if (insertError) {
        throw new Error('Error al registrar: ' + insertError.message);
      }

      setManualSuccess(`✅ ¡Listo! ${profile.full_name || email} ahora tiene acceso a "${selectedCourse.title}"`);
      setManualForm({
        email: '',
        courseId: '1',
        method: 'whatsapp',
        amount: '40',
        reference: '',
      });
      setSelectedStatus('approved');
      await loadPurchases();
    } catch (err) {
      setManualError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* Header */}
      <div className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
                🔐 Panel Administrador
              </h1>
              <p className="text-gray-300 mt-1 text-sm sm:text-base break-words">
                Gestiona pagos y accesos de estudiantes
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto"
              style={headerBackButtonStyle}
            >
              ← Volver al inicio
            </button>
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300">{counts.pending}</div>
              <div className="text-amber-200 text-xs sm:text-sm mt-1">Pendientes</div>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-300">{counts.approved}</div>
              <div className="text-emerald-200 text-xs sm:text-sm mt-1">Aprobados</div>
            </div>
            <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-rose-300">{counts.rejected}</div>
              <div className="text-rose-200 text-xs sm:text-sm mt-1">Rechazados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* SECCIÓN: Registrar pago manual */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

          <button
            type="button"
            onClick={() => setShowManualForm(!showManualForm)}
            className="group"
            style={{
              ...cardToggleButtonStyle,
              backgroundColor: showManualForm ? '#f9fafb' : '#ffffff',
            }}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>

              <div className="text-left min-w-0 flex-1">
                <h2 className="font-bold text-gray-900 text-base sm:text-lg break-words">
                  Activar Acceso por WhatsApp
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm break-words">
                  Registra y aprueba el pago de un estudiante
                </p>
              </div>
            </div>

            <svg
              className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${showManualForm ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showManualForm && (
            <div className="border-t border-gray-100 p-4 sm:p-6">

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 font-semibold mb-1">📋 ¿Cuándo usar esto?</p>
                <p className="text-sm text-blue-700">
                  Cuando un estudiante te haya pagado por WhatsApp y confirmaste el pago.
                  El estudiante debe tener cuenta creada en la plataforma con ese email.
                  Al registrar, el acceso se activa <strong>inmediatamente</strong>.
                </p>
              </div>

              {manualSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-4 font-semibold break-words">
                  {manualSuccess}
                </div>
              )}

              {manualError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-4 break-words">
                  ⚠️ {manualError}
                </div>
              )}

              <form onSubmit={handleManualPurchase} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📧 Email del estudiante *
                    </label>
                    <input
                      type="email"
                      required
                      value={manualForm.email}
                      onChange={e => setManualForm({ ...manualForm, email: e.target.value })}
                      placeholder="email@ejemplo.com"
                      disabled={manualLoading}
                      autoComplete="email"
                      style={{
                        ...inputStyle,
                        opacity: manualLoading ? 0.6 : 1,
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-1 break-words">
                      Debe coincidir exactamente con el email de su cuenta
                    </p>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📚 Curso *
                    </label>
                    <select
                      value={manualForm.courseId}
                      onChange={e => setManualForm({ ...manualForm, courseId: e.target.value })}
                      disabled={manualLoading}
                      style={{
                        ...selectStyle,
                        opacity: manualLoading ? 0.6 : 1,
                      }}
                    >
                      {courses.map(c => (
                        <option key={c.id} value={String(c.id)}>
                          {c.title} (${c.price} USD)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💳 Método de pago *
                    </label>
                    <select
                      value={manualForm.method}
                      onChange={e => setManualForm({ ...manualForm, method: e.target.value })}
                      disabled={manualLoading}
                      style={{
                        ...selectStyle,
                        opacity: manualLoading ? 0.6 : 1,
                      }}
                    >
                      <option value="whatsapp">💬 WhatsApp</option>
                      <option value="pagomovil">📱 Pago Móvil</option>
                      <option value="zelle">🏦 Zelle</option>
                      <option value="usdt">💰 USDT / Binance</option>
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💵 Monto recibido (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={manualForm.amount}
                      onChange={e => setManualForm({ ...manualForm, amount: e.target.value })}
                      disabled={manualLoading}
                      inputMode="decimal"
                      style={{
                        ...inputStyle,
                        opacity: manualLoading ? 0.6 : 1,
                      }}
                    />
                  </div>

                </div>

                <div className="min-w-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Referencia / Nota (opcional)
                  </label>
                  <input
                    type="text"
                    value={manualForm.reference}
                    onChange={e => setManualForm({ ...manualForm, reference: e.target.value })}
                    placeholder="Ej: Pagó por Zelle el 15/01, referencia #12345"
                    disabled={manualLoading}
                    style={{
                      ...inputStyle,
                      opacity: manualLoading ? 0.6 : 1,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={manualLoading}
                  style={{
                    ...greenButtonStyle,
                    backgroundColor: manualLoading ? '#86efac' : '#16a34a',
                    cursor: manualLoading ? 'not-allowed' : 'pointer',
                    opacity: manualLoading ? 0.9 : 1,
                  }}
                >
                  {manualLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Activando acceso...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Confirmar y Activar Acceso Ahora</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  ⚡ El acceso se activa de forma inmediata al confirmar
                </p>
              </form>
            </div>
          )}
        </div>

        {/* Mensajes globales */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold break-words">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm break-words">
            {error}
          </div>
        )}

        {/* SECCIÓN: Lista de compras */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:flex gap-2 sm:gap-3 w-full md:w-auto">
              {(['pending', 'approved', 'rejected'] as PurchaseStatus[]).map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    ...(selectedStatus === status ? darkButtonStyle : grayButtonStyle),
                    fontSize: '13px',
                  }}
                >
                  {statusLabels[status]} ({counts[status]})
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={loadPurchases}
              disabled={loading}
              className="w-full md:w-auto"
              style={{
                ...grayButtonStyle,
                backgroundColor: loading ? '#e5e7eb' : '#ffffff',
                color: '#374151',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              🔄 {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando compras...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-semibold break-words">
                No hay compras {selectedStatus === 'pending' ? 'pendientes' : selectedStatus === 'approved' ? 'aprobadas' : 'rechazadas'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((purchase) => {
                const profile = purchase.user_id ? profilesById[purchase.user_id] : undefined;
                const referenceParts = purchase.payment_reference?.split('-') ?? [];
                const derivedNombre = referenceParts[0]?.trim() || 'Sin nombre';
                const derivedEmail = referenceParts.length > 1
                  ? referenceParts[1]?.trim()
                  : 'Sin email';

                const nombre = profile?.full_name || derivedNombre;
                const emailUsuario = profile?.email || derivedEmail;
                const telefonoUsuario = profile?.phone || '';
                const metodo = purchase.payment_method
                  ? (methodLabels[purchase.payment_method] ?? purchase.payment_method)
                  : 'N/D';
                const fecha = formatDate(purchase.created_at);
                const cursoTitulo = courseTitleById[purchase.course_id] ?? 'Curso desconocido';
                const esWhatsapp = purchase.payment_method === 'whatsapp';
                const status = getPurchaseStatus(purchase.status);
                const proofUrl = purchase.payment_proof_url?.trim() || '';
                const hasValidProofUrl = isValidExternalUrl(proofUrl);

                return (
                  <div
                    key={purchase.id}
                    className={`border rounded-2xl p-4 sm:p-5 hover:border-gray-300 transition-colors min-w-0 ${
                      esWhatsapp ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 min-w-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}>
                        {statusLabels[status]}
                      </span>

                      {esWhatsapp && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          💬 WhatsApp
                        </span>
                      )}

                      <span className="text-xs text-gray-400 break-words">{fecha}</span>
                      <span className="text-xs text-gray-400">ID: #{purchase.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                          👤 Estudiante
                        </h3>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-gray-500 min-w-[70px] flex-shrink-0">Nombre:</span>
                            <span className="font-semibold text-gray-800 break-words min-w-0">{nombre}</span>
                          </div>

                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-gray-500 min-w-[70px] flex-shrink-0">Email:</span>
                            <span className="font-semibold text-gray-800 break-all min-w-0">{emailUsuario}</span>
                          </div>

                          {telefonoUsuario && (
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="text-gray-500 min-w-[70px] flex-shrink-0">Teléfono:</span>
                              <span className="font-semibold text-gray-800 break-words min-w-0">{telefonoUsuario}</span>
                            </div>
                          )}

                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-gray-500 min-w-[70px] flex-shrink-0">Curso:</span>
                            <span className="font-semibold text-gray-800 break-words min-w-0">{cursoTitulo}</span>
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                          💳 Pago
                        </h3>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-gray-500 min-w-[80px] flex-shrink-0">Método:</span>
                            <span className="font-semibold text-gray-800 break-words min-w-0">{metodo}</span>
                          </div>

                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-gray-500 min-w-[80px] flex-shrink-0">Monto:</span>
                            <span className="font-bold text-base sm:text-lg text-gray-900 break-words min-w-0">
                              {purchase.currency ?? 'USD'} {purchase.amount ?? 0}
                            </span>
                          </div>

                          {purchase.payment_reference && (
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="text-gray-500 min-w-[80px] flex-shrink-0">Ref:</span>
                              <span className="font-semibold text-gray-800 break-words min-w-0">
                                {purchase.payment_reference}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
                      {hasValidProofUrl ? (
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto"
                          style={{
                            ...grayButtonStyle,
                            textDecoration: 'none',
                          }}
                        >
                          📄 Ver Comprobante PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400 italic break-words">
                          {purchase.payment_proof_url
                            ? '⚠️ Comprobante con enlace inválido'
                            : esWhatsapp
                              ? '💬 Pago coordinado por WhatsApp'
                              : 'Sin comprobante'}
                        </span>
                      )}

                      <div className="grid grid-cols-1 sm:flex gap-2 sm:gap-3 w-full sm:w-auto">
                        {purchase.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(purchase.id, 'approved')}
                            disabled={updating === purchase.id}
                            style={{
                              ...approveButtonStyle,
                              opacity: updating === purchase.id ? 0.6 : 1,
                              cursor: updating === purchase.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {updating === purchase.id ? '⏳' : '✅'} Aprobar
                          </button>
                        )}

                        {purchase.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => updateStatus(purchase.id, 'rejected')}
                            disabled={updating === purchase.id}
                            style={{
                              ...rejectButtonStyle,
                              opacity: updating === purchase.id ? 0.6 : 1,
                              cursor: updating === purchase.id ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {updating === purchase.id ? '⏳' : '❌'} Rechazar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}