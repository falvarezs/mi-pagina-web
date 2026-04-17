import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);

    // Solo acepta PDF
    if (selectedFile.type !== 'application/pdf') {
      setError('❌ Solo se aceptan archivos PDF. Por favor convierte tu comprobante a PDF.');
      return;
    }

    // Máximo 10MB
    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > 10) {
      setError('❌ El archivo es muy grande. Máximo 10MB.');
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Comprobante de Pago (PDF) *
      </label>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-[#FF6B6B] bg-red-50'
              : 'border-gray-300 hover:border-[#FF6B6B] hover:bg-gray-50'
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            {/* Ícono PDF */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                Haz clic o arrastra tu comprobante aquí
              </p>
              <p className="text-xs text-gray-500">
                Solo se aceptan archivos <strong>PDF</strong> · Máximo 10MB
              </p>
            </div>

            <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
              📄 PDF únicamente
            </span>
          </div>
        </div>
      ) : (
        /* Archivo PDF cargado */
        <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ícono PDF */}
              <div className="w-14 h-14 bg-red-100 rounded-xl flex flex-col items-center justify-center border border-red-200 flex-shrink-0">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-bold text-red-600">PDF</span>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-bold text-green-900">¡PDF cargado correctamente!</p>
                </div>
                <p className="text-sm text-gray-700 break-all">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {/* Botón eliminar */}
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError(null);
              }}
              className="text-gray-400 hover:text-red-600 transition-colors ml-2"
              title="Eliminar archivo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        💡 Tip: Toma una captura de tu comprobante y conviértela a PDF antes de subirla
      </p>
    </div>
  );
}