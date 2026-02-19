// Payment Methods Components

// Tasa de cambio USD a Bs (en producción vendría de una API)
const EXCHANGE_RATE = 378.46;

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod | null;
  coursePriceUSD: number;
}

export type PaymentMethod = 'debit-ven' | 'c2p' | 'usdt' | 'zelle';

export function PaymentMethodSelector({ onSelectMethod, selectedMethod, coursePriceUSD }: PaymentMethodSelectorProps) {
  const priceVES = (coursePriceUSD * EXCHANGE_RATE).toFixed(2);
  const priceUSDT = coursePriceUSD.toFixed(2);

  const methods = [
    {
      id: 'debit-ven' as PaymentMethod,
      icon: '💳',
      name: 'Tarjeta de Débito',
      subtitle: 'Venezuela',
      currency: 'VES',
      amount: priceVES,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Transferencia P2P entre bancos'
    },
    {
      id: 'c2p' as PaymentMethod,
      icon: '📱',
      name: 'C2P',
      subtitle: 'Comercios a Personas',
      currency: 'VES',
      amount: priceVES,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Pago desde tu app bancaria'
    },
    {
      id: 'usdt' as PaymentMethod,
      icon: '₿',
      name: 'USDT',
      subtitle: 'Binance',
      currency: 'USDT',
      amount: priceUSDT,
      gradient: 'from-green-500 to-emerald-600',
      description: 'Red TRC20 (Tron)'
    },
    {
      id: 'zelle' as PaymentMethod,
      icon: '💵',
      name: 'Zelle',
      subtitle: 'USA',
      currency: 'USD',
      amount: coursePriceUSD.toFixed(2),
      gradient: 'from-amber-500 to-orange-600',
      description: 'Transferencia instantánea'
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Selecciona tu Método de Pago
      </h3>
      
      {/* Exchange Rate Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Tasa de cambio actual</p>
            <p className="text-blue-700">
              1 USD = <span className="font-bold">Bs. {EXCHANGE_RATE.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`relative group text-left p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
              selectedMethod === method.id
                ? 'border-[#FF6B6B] bg-gradient-to-br ' + method.gradient + ' text-white shadow-xl'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            {/* Icon */}
            <div className={`text-4xl mb-3 ${selectedMethod === method.id ? 'opacity-100' : 'opacity-70'}`}>
              {method.icon}
            </div>

            {/* Name */}
            <h4 className={`font-bold text-lg mb-1 ${selectedMethod === method.id ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {method.name}
            </h4>
            <p className={`text-sm mb-3 ${selectedMethod === method.id ? 'text-white/80' : 'text-gray-500'}`}>
              {method.subtitle}
            </p>

            {/* Price */}
            <div className={`text-2xl font-bold mb-2 ${selectedMethod === method.id ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {method.currency === 'VES' && 'Bs. '}
              {method.amount}
              {method.currency === 'USDT' && ' USDT'}
              {method.currency === 'USD' && ' USD'}
            </div>

            {/* Description */}
            <p className={`text-xs ${selectedMethod === method.id ? 'text-white/70' : 'text-gray-500'}`}>
              {method.description}
            </p>

            {/* Selected Badge */}
            {selectedMethod === method.id && (
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente para pago con Tarjeta de Débito VEN
export function DebitVenPayment({ amount }: { amount: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
          💳
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Pago con Tarjeta de Débito
          </h4>
          <p className="text-sm text-gray-600">Transferencia P2P entre bancos</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm text-gray-600 mb-4 font-semibold">Datos para la transferencia:</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Banco:</span>
            <span className="font-bold text-gray-900">BANCAMIGA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Teléfono:</span>
            <span className="font-mono font-bold text-gray-900">0424-1055470</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Titular:</span>
            <span className="font-bold text-gray-900">Yulia Rondon</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">C.I:</span>
            <span className="font-mono font-bold text-gray-900">V-21106264</span>
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Monto a pagar:</span>
              <span className="text-2xl font-bold text-blue-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bs. {amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InstructionSteps steps={[
        'Realiza la transferencia P2P desde tu app bancaria',
        'Toma captura de pantalla del comprobante',
        'Sube el comprobante en el formulario de abajo'
      ]} />
    </div>
  );
}

// Componente para pago C2P
export function C2PPayment({ amount }: { amount: number }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
          📱
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Pago C2P
          </h4>
          <p className="text-sm text-gray-600">Comercios a Personas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm text-gray-600 mb-4 font-semibold">Datos C2P:</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Teléfono:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-gray-900">0424-1055470</span>
              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition-colors">
                Copiar
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Titular:</span>
            <span className="font-bold text-gray-900">Yulia Rondon</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Banco:</span>
            <span className="font-bold text-gray-900">BANCAMIGA</span>
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Monto a pagar:</span>
              <span className="text-2xl font-bold text-purple-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bs. {amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InstructionSteps steps={[
        'Abre tu app bancaria y ve a "C2P" o "Pagar con QR"',
        'Ingresa el teléfono: 0424-XXX-XXXX',
        'Monto: Bs. ' + amount.toFixed(2),
        'Confirma la transferencia y toma captura',
        'Sube el comprobante abajo'
      ]} />
    </div>
  );
}

// Componente para pago USDT
export function USDTPayment({ amount }: { amount: number }) {
  const walletAddress = 'TXs7hD9kL2example...'; // Placeholder

  return (
    <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
          ₿
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Pago con USDT
          </h4>
          <p className="text-sm text-gray-600">Red TRC20 (Tron)</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-amber-900">
            <p className="font-bold mb-1">IMPORTANTE:</p>
            <p>Solo envía por RED <span className="font-bold">TRC20</span>. Si usas otra red (ERC20, BEP20) perderás tus fondos.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm text-gray-600 mb-4 font-semibold">Dirección de Wallet (TRC20):</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Red</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">TRC20</span>
          </div>
          <div className="font-mono text-sm text-gray-900 break-all mb-3">
            {walletAddress}
          </div>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copiar Dirección</span>
          </button>
        </div>

        <div className="text-center py-4 border-t">
          <p className="text-sm text-gray-600 mb-3">O escanea el código QR:</p>
          <div className="w-48 h-48 bg-gray-200 rounded-xl mx-auto flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Monto a enviar:</span>
            <span className="text-2xl font-bold text-green-600" style={{ fontFamily: "'Playfair Display', serif" }}>
              {amount} USDT
            </span>
          </div>
        </div>
      </div>

      <InstructionSteps steps={[
        'Abre Binance App y ve a "Enviar"',
        'Selecciona USDT',
        'Escanea el QR o pega la dirección',
        'IMPORTANTE: Selecciona RED TRC20',
        'Monto: ' + amount + ' USDT',
        'Confirma y copia el TxHash',
        'Pega el TxHash o sube captura abajo'
      ]} />
    </div>
  );
}

// Componente para pago Zelle
export function ZellePayment({ amount }: { amount: number }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
          💵
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Pago con Zelle
          </h4>
          <p className="text-sm text-gray-600">Transferencia instantánea (USA)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm text-gray-600 mb-4 font-semibold">Datos Zelle:</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Email:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm">mariangeles.sanchez.concepcion@gmail.com</span>
              <button className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-200 transition-colors flex-shrink-0">
                Copiar
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">A nombre de:</span>
            <span className="font-bold text-gray-900">Maria Sanchez Concepcion</span>
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Monto exacto:</span>
              <span className="text-2xl font-bold text-amber-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                ${amount.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>
      </div>

      <InstructionSteps steps={[
        'Abre tu app de Zelle',
        'Envía $' + amount.toFixed(2) + ' a yulia.rondon@email.com',
        'En el concepto escribe: CURSO-[nombre]',
        'Toma captura del comprobante',
        'Sube la captura abajo'
      ]} />
    </div>
  );
}

// Componente auxiliar para instrucciones
function InstructionSteps({ steps }: { steps: string[] }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <p className="text-sm font-semibold text-gray-900 mb-3">Instrucciones paso a paso:</p>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#FF6B6B] to-[#F59E0B] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {index + 1}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
