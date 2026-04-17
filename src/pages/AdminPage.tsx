import { useEffect, useMemo, useState } from 'react';
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
  pagomovil: '📱 Pago Móvil (Venezuela)',
  usdt: '💲 USDT (Binance)',
  zelle: '🏦 Zelle (USA)',
};

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus>('pending');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const filtered = useMemo(
    () => purchases.filter((p) => (p.status ?? 'pending') === selectedStatus),
    [purchases, selectedStatus]
  );

  const counts = useMemo(() => ({
    pending: purchases.filter(p => p.status === 'pending').length,
    approved: purchases.filter(p => p.status === 'approved').length,
    rejected: purchases.filter(p => p.status === 'rejected').length,
  }), [purchases]);

  const loadPurchases = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('No pudimos cargar las compras: ' + fetchError.message);
    } else {
      setPurchases((data ?? []) as PurchaseRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const updateStatus = async (purchaseId: number, status: PurchaseStatus) => {
    setUpdating(purchaseId);
    setError('');
    setSuccessMessage('');

    const { error: updateError } = await supabase
      .from('purchases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', purchaseId);

    if (updateError) {
      setError('No pudimos actualizar el estado: ' + updateError.message);
    } else {
      const action = status === 'approved' ? 'aprobado' : 'rechazado';
      setSuccessMessage(`✅ Pago ${action} correctamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadPurchases();
    }

    setUpdating(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">🔐 Panel Administrador</h1>
              <p className="text-gray-300 mt-1">Gestiona pagos y accesos de estudiantes</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-semibold"
            >
              ← Volver al inicio
            </button>
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-300">{counts.pending}</div>
              <div className="text-amber-200 text-sm mt-1">Pendientes</div>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-300">{counts.approved}</div>
              <div className="text-emerald-200 text-sm mt-1">Aprobados</div>
            </div>
            <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-rose-300">{counts.rejected}</div>
              <div className="text-rose-200 text-sm mt-1">Rechazados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Mensajes */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 font-semibold">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          {/* Filtros */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex gap-3 flex-wrap">
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
                  {statusLabels[status]} ({counts[status]})
                </button>
              ))}
            </div>
            <button
              onClick={loadPurchases}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              🔄 Actualizar
            </button>
          </div>

          {/* Lista de compras */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando compras...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-semibold">No hay compras {selectedStatus === 'pending' ? 'pendientes' : selectedStatus === 'approved' ? 'aprobadas' : 'rechazadas'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((purchase) => {
                const nombre = purchase.payment_reference?.split('-')[0]?.trim() ?? 'Sin nombre';
                const emailUsuario = purchase.payment_reference?.split('-').pop()?.trim() ?? 'Sin email';
                const metodo = purchase.payment_method ? (methodLabels[purchase.payment_method] ?? purchase.payment_method) : 'N/D';
                const fecha = purchase.created_at ? new Date(purchase.created_at).toLocaleString('es-ES') : 'Sin fecha';
                const cursoTitulo = courseTitleById[purchase.course_id] ?? 'Curso desconocido';

                return (
                  <div key={purchase.id} className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">

                    {/* Header de la tarjeta */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[(purchase.status ?? 'pending') as PurchaseStatus]}`}>
                        {statusLabels[(purchase.status ?? 'pending') as PurchaseStatus]}
                      </span>
                      <span className="text-xs text-gray-400">{fecha}</span>
                      <span className="text-xs text-gray-400">ID: #{purchase.id}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                      {/* Info del estudiante */}
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">👤 Estudiante</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-20">Nombre:</span>
                            <span className="font-semibold text-gray-800">{nombre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-20">Email:</span>
                            <span className="font-semibold text-gray-800">{emailUsuario}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-20">Curso:</span>
                            <span className="font-semibold text-gray-800">{cursoTitulo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Info del pago */}
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">💳 Pago</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-20">Método:</span>
                            <span className="font-semibold text-gray-800">{metodo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 w-20">Monto:</span>
                            <span className="font-bold text-lg text-gray-900">
                              {purchase.currency ?? 'USD'} {purchase.amount ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comprobante y acciones */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">

                      {/* Ver comprobante */}
                      {purchase.payment_proof_url ? (
                        <a
                          href={purchase.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-semibold transition-colors"
                        >
                          📄 Ver Comprobante PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">Sin comprobante</span>
                      )}

                      {/* Botones de acción */}
                      <div className="flex gap-3">
                        {purchase.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(purchase.id, 'approved')}
                            disabled={updating === purchase.id}
                            className="px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                          >
                            {updating === purchase.id ? '⏳' : '✅'} Aprobar
                          </button>
                        )}
                        {purchase.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(purchase.id, 'rejected')}
                            disabled={updating === purchase.id}
                            className="px-5 py-2 rounded-full bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center gap-2"
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