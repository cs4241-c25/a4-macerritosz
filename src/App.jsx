import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'
import Homepage from "./components/Homepage.jsx";
import LoginPage from "./components/login.jsx";
import Layout from "./components/Layout.jsx";
import SignupPage from "./components/SignUp.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Homepage/>}/>
                    <Route path="/Login" element={<LoginPage/>}/>
                    <Route path="/SignUp" element={<SignupPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
