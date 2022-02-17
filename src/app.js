import './index.scss'
import '@fortawesome/fontawesome-free/js/all';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page404 from './pages/page404';
import PageLayout from './pages/pageLayout';
import PageExport from './pages/PageExport';


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PageLayout />}>
                    {/* =============== Main Pages =============== */}
                    <Route path="/" element={<PageExport />} />
                    {/* =============== Other Pages =============== */}
                    <Route path="*" element={<Page404 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}