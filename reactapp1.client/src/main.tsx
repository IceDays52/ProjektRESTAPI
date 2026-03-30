import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import Wspolpraca from './Wspolpraca';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logowanie from "./Logowanie";
import ProfilKonta from "./ProfilKonta";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Faktury from "./Faktury";
import NowaFaktura from "./NowaFaktura";
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/wspolpraca" element={<Wspolpraca />} />
                <Route path="/logowanie" element={<Logowanie />} />
                <Route path="/profil-konta" element={<ProfilKonta />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/faktury" element={<Faktury />} />
                <Route path="/faktury/nowa" element={<NowaFaktura />} />
                <Route path="/faktury/:id" element={<div>Szczegó³y faktury</div>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);