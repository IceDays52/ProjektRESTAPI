import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import Wspolpraca from './Wspolpraca';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logowanie from "./Logowanie";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/wspolpraca" element={<Wspolpraca />} />
                <Route path="/logowanie" element={<Logowanie />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);