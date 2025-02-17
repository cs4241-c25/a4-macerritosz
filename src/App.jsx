import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Homepage from "./components/Homepage.jsx";
import LoginPage from "./components/login.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<LoginPage />} />
                <Route path="/Home" element={<Homepage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
