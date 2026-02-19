// AdminPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail } from '../lib/emailService';
import { courses } from '../data/courses';

const courseTitleById = courses.reduce<Record<number, string>>((acc, course) => {
  acc[course.id] = course.title;  // ← CAMBIADO: Ya no usa Number() porque course.id ya es number
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
  courses?: {
    title?: string | null;
  } | null;
}

const statusStyles: Record<PurchaseStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const methodLabels: Record<string, string> = {
  'debit-ven': 'Débito VEN',
  c2p: 'C2P',
  usdt: 'USDT',
  zelle: 'Zelle',
};

const methodEmailLabels: Record<string, string> = {
  'debit-ven': 'Tarjeta de Débito (Venezuela)',
  c2p: 'C2P (Venezuela)',
  usdt: 'USDT (Binance)',
  zelle: 'Zelle (USA)',
};

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus>('pending');
  const [error, setError] = useState('');

  const filtered = useMemo(
    () => purchases.filter((purchase) => (purchase.status ?? 'pending') === selectedStatus),
    [purchases, selectedStatus]
  );

  const loadPurchases = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('purchases')
      .select('id, user_id, course_id, payment_method, payment_reference, payment_proof_url, amount, currency, status, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('No pudimos cargar las compras.');
    } else {
      setPurchases((data ?? []) as PurchaseRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const updateStatus = async (purchaseId: number, status: PurchaseStatus) => {
    setError('');
    const current = purchases.find((purchase) => purchase.id === purchaseId);

    const { error: updateError } = await supabase
      .from('purchases')
      .update({ status })
      .eq('id', purchaseId);

    if (updateError) {
      setError(`No pudimos actualizar el estado. ${updateError.message}`);
      return;
    }

    if (current) {
      const recipient = current.payment_reference?.split('-').pop()?.trim() ?? '';
      const name = current.payment_reference?.split('-')[0]?.trim() ?? 'Estudiante';
      const courseTitle = courseTitleById[current.course_id] ?? 'tu curso';
      const methodLabel = current.payment_method ? (methodEmailLabels[current.payment_method] ?? current.payment_method) : 'método de pago';

      if (status === 'approved' && recipient) {
        await sendPaymentApprovedEmail({ to: recipient, name, courseTitle });
      }

      if (status === 'rejected' && recipient) {
        await sendPaymentRejectedEmail({ to: recipient, name, courseTitle });
      }

      if (status === 'pending' && recipient) {
        await sendPaymentApprovedEmail({ to: recipient, name, courseTitle: `${courseTitle} (en revisión: ${methodLabel})` });
      }
    }

    await loadPurchases();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Panel Admin</h1>
              <p className="text-gray-300">Gestiona pagos y accesos de estudiantes</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex gap-3">
              {(['pending', 'approved', 'rejected'] as PurchaseStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedStatus === status
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'pending' && 'Pendientes'}
                  {status === 'approved' && 'Aprobados'}
                  {status === 'rejected' && 'Rechazados'}
                </button>
              ))}
            </div>
            <button
              onClick={loadPurchases}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Actualizar
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-600">Cargando pagos...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No hay pagos en esta categoría todavía.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((purchase) => (
                <div key={purchase.id} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[(purchase.status ?? 'pending') as PurchaseStatus]}`}>
                          {(purchase.status ?? 'pending').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {purchase.created_at ? new Date(purchase.created_at).toLocaleString() : ''}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {courseTitleById[purchase.course_id] ?? 'Curso'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Método: {purchase.payment_method ? (methodLabels[purchase.payment_method] ?? purchase.payment_method) : 'N/D'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Referencia: {purchase.payment_reference ?? 'Sin referencia'}
                      </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <div className="text-lg font-bold text-gray-900">
                        {purchase.currency ?? 'USD'} {purchase.amount ?? 0}
                      </div>
                      {purchase.payment_proof_url && (
                        <a
                          href={purchase.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#FF6B6B] font-semibold hover:underline"
                        >
                          Ver comprobante
                        </a>
                      )}
                    </div>
                  </div>

                  {selectedStatus === 'pending' && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateStatus(purchase.id, 'approved')}
                        className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => updateStatus(purchase.id, 'rejected')}
                        className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}