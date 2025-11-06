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

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Header />
    <div className="h-10" />
    <MainSection />
    <CampaignsComponent />
    <TrustSection />
    <TestimonialsSection />
    <LiveUpdatesSection />
    <AdminPanel />
  </React.StrictMode>
)
