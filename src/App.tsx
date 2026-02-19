// App.tsx
import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage, FAQPage, ContactPage } from './pages/InfoPages';
import { AdminPage } from './pages/AdminPage';
import { WatchCoursePage } from './pages/WatchCoursePage';
import { supabase } from './lib/supabaseClient';

type Page = 'home' | 'courses' | 'course' | 'checkout' | 'login' | 'dashboard' | 'about' | 'faq' | 'contact' | 'terms' | 'privacy' | 'cookies' | 'watch-course' | 'admin';

interface PageData {
  slug?: string;
  courseId?: string;
}

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<PageData>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const adminEmail = 'informacion.comeback@gmail.com';
  const isAdmin = userEmail === adminEmail;

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        setIsLoggedIn(true);
        setUserEmail(data.session.user.email);
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    });

    loadSession();
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const navigate = (page: string, data?: any) => {
    setCurrentPage(page as Page);
    if (data) setPageData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'courses':
        return <CoursesPage onNavigate={navigate} />;
      case 'course':
        return <CourseDetailPage slug={pageData.slug || ''} onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutPage courseId={pageData.courseId || ''} onNavigate={navigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'dashboard':
        return isLoggedIn ? (
          <DashboardPage userEmail={userEmail} onNavigate={navigate} onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} onNavigate={navigate} />
        );
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'faq':
        return <FAQPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return isAdmin ? (
          <AdminPage onNavigate={navigate} />
        ) : (
          <LoginPage onLogin={handleLogin} onNavigate={navigate} />
        );
      case 'watch-course':
        return isLoggedIn ? (
          <WatchCoursePage courseId={pageData.courseId || ''} onNavigate={navigate} />
        ) : (
          <LoginPage onLogin={handleLogin} onNavigate={navigate} />
        );
      case 'terms':
        return <LegalPage title="Términos y Condiciones" onNavigate={navigate} />;
      case 'privacy':
        return <LegalPage title="Política de Privacidad" onNavigate={navigate} />;
      case 'cookies':
        return <LegalPage title="Política de Cookies" onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onNavigate={navigate}
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      {/* ← AQUÍ ESTÁ EL FIX: pt-20 agrega padding-top de 80px para compensar el navbar fijo */}
      <main className="flex-1 pt-20">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

function LegalPage({ title, onNavigate }: { title: string; onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          
          <h2>1. Introducción</h2>
          <p>
            Bienvenido a Chef Karolain Rondon Academia Online. Al acceder y utilizar nuestros servicios, 
            aceptas cumplir con estos términos y condiciones.
          </p>

          <h2>2. Uso de la Plataforma</h2>
          <p>
            El acceso a los cursos es personal e intransferible. No está permitido compartir 
            credenciales ni contenido de los cursos con terceros.
          </p>

          <h2>3. Pagos y Reembolsos</h2>
          <p>
            Los pagos se procesan de forma manual en un plazo de 24-48 horas. Una vez confirmado 
            el pago y otorgado el acceso, no se realizan reembolsos excepto en casos excepcionales 
            sujetos a evaluación.
          </p>

          <h2>4. Propiedad Intelectual</h2>
          <p>
            Todo el contenido (videos, recetas, materiales) es propiedad de Chef Karolain Rondon y 
            está protegido por derechos de autor. Queda prohibida su reproducción sin autorización.
          </p>

          <h2>5. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con estos términos, puedes contactarnos a través 
            de nuestra{' '}
            <button onClick={() => onNavigate('contact')} className="text-[#FF6B6B] hover:underline">
              página de contacto
            </button>.
          </p>
        </div>
      </div>
    </div>
  );
}