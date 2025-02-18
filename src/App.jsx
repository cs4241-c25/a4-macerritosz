import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Homepage from "./components/Homepage.jsx";
import LoginPage from "./components/login.jsx";
import Layout from "./components/Layout.jsx";
import SignupPage from "./components/SignUp.jsx";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<LoginPage />} />
                <Route path="/SignUp" element={<SignupPage />} />
                <Route path="/Home" element={<Homepage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
