import { useState, useEffect } from 'react';
import { UserIcon } from './Icons';

// ── Iconos ──────────────────────────────────────────────────────
const HomeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const InfoIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const QuestionIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MailIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export function Navbar({ onNavigate, currentPage, isLoggedIn, isAdmin, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquear scroll del body cuando menú móvil está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Cerrar menú al cambiar tamaño de ventana a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  const navItems = [
    { id: 'home',     label: 'Inicio',    Icon: HomeIcon },
    { id: 'courses',  label: 'Cursos',    Icon: BookIcon },
    { id: 'about',    label: 'Sobre Mí',  Icon: InfoIcon },
    { id: 'faq',      label: 'FAQ',       Icon: QuestionIcon },
    { id: 'contact',  label: 'Contacto',  Icon: MailIcon },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════
          NAVBAR PRINCIPAL
          Móvil/Tablet (< 1280px): Logo + Ingresar + Hamburguesa
          Desktop (≥ 1280px): Todo visible
      ══════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 gap-2">

            {/* ══════════════════════════════════════════
                LOGO - Siempre visible, adaptable
            ══════════════════════════════════════════ */}
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer flex-shrink-0 min-w-0"
              aria-label="Ir al inicio"
            >
              {/* Círculo con KR */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white border-2 border-[#F59E0B] flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all transform group-hover:scale-105 flex-shrink-0">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <span 
                    className="text-[#F59E0B] text-sm sm:text-base md:text-lg font-bold leading-none" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    K
                  </span>
                  <span className="w-px h-3 sm:h-4 md:h-5 bg-[#F59E0B]/70" />
                  <span 
                    className="text-[#F59E0B] text-sm sm:text-base md:text-lg font-bold leading-none" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    R
                  </span>
                </div>
              </div>

              {/* Texto del logo - Visible desde sm (640px+) */}
              <div className="hidden sm:flex flex-col min-w-0">
                <h1 
                  className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-gray-900 tracking-tight leading-tight truncate" 
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Chef Karolain Rondón
                </h1>
                <p 
                  className="text-[9px] md:text-[10px] lg:text-xs text-gray-600 font-light tracking-widest uppercase truncate" 
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Academia de Repostería
                </p>
              </div>
            </button>

            {/* ══════════════════════════════════════════
                NAVEGACIÓN DESKTOP (xl+ : ≥1280px)
                Todos los íconos con texto
            ══════════════════════════════════════════ */}
            <div className="hidden xl:flex items-center gap-1">
              {navItems.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={`cursor-pointer flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all min-w-[60px] ${
                    currentPage === id
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={label}
                  aria-label={label}
                  aria-current={currentPage === id ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  <span 
                    className="text-[10px] mt-0.5 font-medium" 
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {label}
                  </span>
                </button>
              ))}

              {/* Login/Dashboard Desktop */}
              <div className="ml-3 pl-3 border-l border-gray-200 flex items-center gap-2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleNavigate('dashboard')}
                      className="cursor-pointer flex items-center gap-2 bg-gradient-secondary text-white px-4 py-2.5 rounded-full hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-sm whitespace-nowrap"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Mi Panel</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="cursor-pointer inline-flex items-center px-4 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Salir
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigate('login')}
                    className="cursor-pointer flex items-center gap-2 bg-gradient-primary text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-sm whitespace-nowrap"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Ingresar</span>
                  </button>
                )}
              </div>

              {/* Admin Desktop */}
              {isAdmin && (
                <button
                  onClick={() => handleNavigate('admin')}
                  className="cursor-pointer ml-2 flex items-center px-3 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  🔐 Admin
                </button>
              )}
            </div>

            {/* ══════════════════════════════════════════
                NAVEGACIÓN MÓVIL/TABLET (< 1280px)
                Solo Ingresar + Hamburguesa
            ══════════════════════════════════════════ */}
            <div className="flex xl:hidden items-center gap-2 flex-shrink-0">

              {/* Botón Login/Panel */}
              {isLoggedIn ? (
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-secondary text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  aria-label="Mi Panel"
                  title="Mi Panel"
                >
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleNavigate('login')}
                  className="cursor-pointer flex items-center gap-1 sm:gap-1.5 bg-gradient-primary text-white px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all font-semibold text-xs sm:text-sm whitespace-nowrap"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  aria-label="Iniciar sesión"
                >
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* Botón hamburguesa */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex-shrink-0"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          MENÚ MÓVIL DESPLEGABLE (< 1280px)
      ══════════════════════════════════════════════════ */}
      {menuOpen && (
        <>
          {/* Overlay oscuro - cierra menú al tocar */}
          <div
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel del menú */}
          <div
            id="mobile-menu"
            className="fixed top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 xl:hidden overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto"
            role="navigation"
            aria-label="Menú principal"
          >
            <div className="p-3 sm:p-4 space-y-1">

              {/* Items de navegación */}
              {navItems.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentPage === id
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  aria-current={currentPage === id ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{label}</span>
                </button>
              ))}

              {/* Sección si está logueado */}
              {isLoggedIn && (
                <>
                  <div className="border-t border-gray-100 my-2" />

                  {isAdmin && (
                    <button
                      onClick={() => handleNavigate('admin')}
                      className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <span className="text-lg flex-shrink-0">🔐</span>
                      <span className="font-medium text-sm sm:text-base">Panel Admin</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium text-sm sm:text-base">Cerrar sesión</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}