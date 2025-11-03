import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import MainSection from './MainSection.tsx'
import Header from './Header.tsx'
import Campains from './Campains.tsx'


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Header />
    <div className="h-10" />
    <MainSection />
    <Campains />
  </React.StrictMode>
)
