import './index.scss'
import '@fortawesome/fontawesome-free/js/all';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page404 from './pages/page404';
import PageLayout from './pages/pageLayout';
import PageExport from './pages/PageExport';


export default function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route element={<PageLayout />}>
                    {/* =============== Main Pages =============== */}
                    <Route index element={<PageExport />} />
                    <Route path="export" element={<PageExport />} />
                    {/* =============== Other Pages =============== */}
                    <Route path="*" element={<Page404 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}