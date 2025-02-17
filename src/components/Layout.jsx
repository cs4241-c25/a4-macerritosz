import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./Header.jsx";
import '../index.css'

function Layout({children}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="App">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;