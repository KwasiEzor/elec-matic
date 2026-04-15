import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import LegalPage from './pages/LegalPage';
import Layout from './components/Layout';

// Admin
import LoginPage from './admin/pages/LoginPage';
import RegisterPage from './admin/pages/RegisterPage';
import AuthGuard from './admin/components/AuthGuard';
import AdminLayout from './admin/components/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import CompanyPage from './admin/pages/CompanyPage';
import ServicesPage from './admin/pages/ServicesPage';
import RealisationsPage from './admin/pages/RealisationsPage';
import TestimonialsPage from './admin/pages/TestimonialsPage';
import FAQAdminPage from './admin/pages/FAQAdminPage';
import AboutPage from './admin/pages/AboutPage';
import SEOPage from './admin/pages/SEOPage';
import LegalAdminPage from './admin/pages/LegalAdminPage';
import SettingsPage from './admin/pages/SettingsPage';
import InvoicesPage from './admin/pages/InvoicesPage';
import InvoiceEditorPage from './admin/pages/InvoiceEditorPage';
import InvoiceSendPage from './admin/pages/InvoiceSendPage';
import ClientsPage from './admin/pages/ClientsPage';
import InvoiceSettingsPage from './admin/pages/InvoiceSettingsPage';

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/mentions-legales" element={<LegalPage />} />
        </Route>

        {/* Admin auth (no guard) */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/register" element={<RegisterPage />} />

        {/* Admin protected */}
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="realisations" element={<RealisationsPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="faq" element={<FAQAdminPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="seo" element={<SEOPage />} />
          <Route path="legal" element={<LegalAdminPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/new" element={<InvoiceEditorPage />} />
          <Route path="invoices/clients" element={<ClientsPage />} />
          <Route path="invoices/settings" element={<InvoiceSettingsPage />} />
          <Route path="invoices/:id" element={<InvoiceEditorPage />} />
          <Route path="invoices/:id/send" element={<InvoiceSendPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}
