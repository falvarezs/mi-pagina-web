// Payment Methods Components

const EXCHANGE_RATE = 378.46;

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: PaymentMethod) => void;
  selectedMethod: PaymentMethod | null;
  coursePriceUSD: number;
}

export type PaymentMethod = 'pagomovil' | 'usdt' | 'zelle';

export function PaymentMethodSelector({ onSelectMethod, selectedMethod, coursePriceUSD }: PaymentMethodSelectorProps) {
  const priceVES = (coursePriceUSD * EXCHANGE_RATE).toFixed(2);

  const methods = [
    {
      id: 'pagomovil' as PaymentMethod,
      icon: '📱',
      name: 'Pago Móvil',
      subtitle: 'Solo válido para Venezuela',
      currency: 'VES',
      amount: `Bs. ${priceVES}`,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Transferencia desde tu app bancaria'
    },
    {
      id: 'usdt' as PaymentMethod,
      icon: '💲',
      name: 'USDT',
      subtitle: 'Binance · Red TRC20',
      currency: 'USDT',
      amount: `${coursePriceUSD.toFixed(2)} USDT`,
      gradient: 'from-green-500 to-emerald-600',
      description: 'Pago internacional con crypto'
    },
    {
      id: 'zelle' as PaymentMethod,
      icon: '🏦',
      name: 'Zelle',
      subtitle: 'Solo válido desde USA',
      currency: 'USD',
      amount: `$${coursePriceUSD.toFixed(2)} USD`,
      gradient: 'from-amber-500 to-orange-600',
      description: 'Transferencia instantánea'
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Selecciona tu Método de Pago
      </h3>

      {/* Tasa de cambio */}
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

      {/* Grid de métodos */}
      <div className="grid md:grid-cols-3 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
              selectedMethod === method.id
                ? 'border-[#FF6B6B] bg-gradient-to-br ' + method.gradient + ' text-white shadow-xl'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            {/* Ícono */}
            <div className="text-4xl mb-3">{method.icon}</div>

            {/* Nombre */}
            <h4 className={`font-bold text-lg mb-1 ${selectedMethod === method.id ? 'text-white' : 'text-gray-900'}`}>
              {method.name}
            </h4>

            {/* Subtítulo */}
            <p className={`text-xs mb-3 font-semibold ${selectedMethod === method.id ? 'text-white/80' : 'text-gray-500'}`}>
              {method.subtitle}
            </p>

            {/* Monto */}
            <div className={`text-xl font-bold mb-2 ${selectedMethod === method.id ? 'text-white' : 'text-gray-900'}`}>
              {method.amount}
            </div>

            {/* Descripción */}
            <p className={`text-xs ${selectedMethod === method.id ? 'text-white/70' : 'text-gray-500'}`}>
              {method.description}
            </p>

            {/* Badge seleccionado */}
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

// ─── PAGO MÓVIL ───────────────────────────────────────────
export function PagoMovilPayment({ amount }: { amount: number }) {
  const amountVES = (amount * EXCHANGE_RATE).toFixed(2);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 mb-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
          📱
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900">Pago Móvil</h4>
          <p className="text-xs font-semibold text-blue-600">⚠️ Solo válido para Venezuela</p>
        </div>
      </div>

      {/* Aviso Venezuela */}
      <div className="bg-blue-100 border border-blue-300 rounded-xl p-3 mb-5">
        <p className="text-xs text-blue-800 font-medium">
          🇻🇪 Este método de pago es exclusivo para usuarios en Venezuela. 
          Si estás fuera del país usa <strong>Zelle</strong> o <strong>USDT</strong>.
        </p>
      </div>

      {/* Datos de pago */}
      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm font-bold text-gray-900 mb-4">Datos para el Pago Móvil:</p>
        <div className="space-y-3">

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Banco:</span>
            <span className="font-bold text-gray-900">(0172) BANCAMIGA</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Teléfono:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-gray-900">0424-1055470</span>
              <button
                type="button"
                onClick={() => copyText('04241055470')}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Cédula:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-gray-900">V-21106264</span>
              <button
                type="button"
                onClick={() => copyText('21106264')}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Titular:</span>
            <span className="font-bold text-gray-900">Yulia Rondon</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-500 text-sm">Monto a pagar:</span>
            <span className="text-2xl font-bold text-blue-600">Bs. {amountVES}</span>
          </div>

        </div>
      </div>

      <InstructionSteps steps={[
        'Abre tu app bancaria y busca "Pago Móvil"',
        'Ingresa el teléfono: 0424-1055470',
        'Selecciona banco: BANCAMIGA (0172)',
        'Ingresa el monto exacto: Bs. ' + amountVES,
        'Confirma el pago',
        'Descarga o guarda el comprobante en PDF',
        'Sube el PDF del comprobante abajo'
      ]} />
    </div>
  );
}

// ─── USDT BINANCE ─────────────────────────────────────────
export function USDTPayment({ amount }: { amount: number }) {
  const walletAddress = 'TXs7hD9kL2XXXXXXXXXXXXXXXXXXXXXXXXXX';

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 mb-6">

      {/* Header */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
          💲
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900">USDT · Binance</h4>
          <p className="text-sm text-gray-600">Red TRC20 (Tron)</p>
        </div>
      </div>

      {/* Aviso importante */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-amber-900">
            <p className="font-bold mb-1">⚠️ MUY IMPORTANTE:</p>
            <p>Solo envía por red <strong>TRC20</strong>. Si usas otra red (ERC20, BEP20) <strong>perderás tus fondos</strong>.</p>
          </div>
        </div>
      </div>

      {/* Dirección wallet */}
      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm font-bold text-gray-900 mb-3">Dirección Wallet USDT (TRC20):</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Red</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">TRC20</span>
          </div>
          <p className="font-mono text-sm text-gray-900 break-all mb-3">{walletAddress}</p>
          <button
            type="button"
            onClick={() => copyText(walletAddress)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copiar Dirección</span>
          </button>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-gray-500 text-sm">Monto a enviar:</span>
          <span className="text-2xl font-bold text-green-600">{amount} USDT</span>
        </div>
      </div>

      <InstructionSteps steps={[
        'Abre Binance App y ve a "Enviar"',
        'Selecciona la moneda: USDT',
        'Pega la dirección de la wallet',
        '⚠️ Selecciona RED: TRC20 (obligatorio)',
        'Monto: ' + amount + ' USDT',
        'Confirma la transacción',
        'Descarga el comprobante en PDF y súbelo abajo'
      ]} />
    </div>
  );
}

// ─── ZELLE ────────────────────────────────────────────────
export function ZellePayment({ amount }: { amount: number }) {
  const zelleEmail = 'mariangeles.sanchez.concepcion@gmail.com';

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-2xl p-6 mb-6">

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
          🏦
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900">Zelle</h4>
          <p className="text-xs font-semibold text-amber-600">⚠️ Solo válido desde USA</p>
        </div>
      </div>

      {/* Aviso USA */}
      <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 mb-5">
        <p className="text-xs text-amber-800 font-medium">
          🇺🇸 Este método de pago es exclusivo para usuarios en Estados Unidos. 
          Si estás en Venezuela usa <strong>Pago Móvil</strong>. 
          Si estás en otro país usa <strong>USDT</strong>.
        </p>
      </div>

      {/* Datos Zelle */}
      <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
        <p className="text-sm font-bold text-gray-900 mb-4">Datos para Zelle:</p>
        <div className="space-y-3">

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Email:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-gray-900 text-xs">
                {zelleEmail}
              </span>
              <button
                type="button"
                onClick={() => copyText(zelleEmail)}
                className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold hover:bg-amber-200 transition-colors flex-shrink-0"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">A nombre de:</span>
            <span className="font-bold text-gray-900">Maria Sanchez</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-500 text-sm">Monto exacto:</span>
            <span className="text-2xl font-bold text-amber-600">${amount.toFixed(2)} USD</span>
          </div>

        </div>
      </div>

      <InstructionSteps steps={[
        'Abre tu app bancaria y ve a Zelle',
        'Envía $' + amount.toFixed(2) + ' al email: ' + zelleEmail,
        'En el concepto escribe tu nombre completo',
        'Confirma la transferencia',
        'Descarga el comprobante en PDF',
        'Sube el PDF del comprobante abajo'
      ]} />
    </div>
  );
}

// ─── INSTRUCCIONES PASO A PASO ────────────────────────────
function InstructionSteps({ steps }: { steps: string[] }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <p className="text-sm font-bold text-gray-900 mb-3">📋 Instrucciones paso a paso:</p>
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