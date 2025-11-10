import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import MainSection from './MainSection.tsx'
import Header from './Header.tsx'
import CampaignsComponent from './Campains.tsx'
import TrustSection from './TrustSection.tsx'
import TestimonialsSection from './Testimonies.tsx'
import LiveUpdatesSection from './LiveUpdates.tsx'
import AdminPanel from "./AdminPanel.tsx";
import { AuthProvider, useAuth } from './auth/AuthContext';
import DisasterResponseFooter from "./footer.tsx";

const App = () => {
  const { user } = useAuth();
  if (user?.isAdmin) {
    return <AdminPanel />;
  }
  return (
    <>
      <Header />
      <div className="h-10" />
      <MainSection />
      <CampaignsComponent />
      <TrustSection />
      <TestimonialsSection />
      <LiveUpdatesSection />
      <DisasterResponseFooter />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
