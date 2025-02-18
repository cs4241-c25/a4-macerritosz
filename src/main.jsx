import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {CredentialsProvider} from "./components/CredentialsContext.jsx";

createRoot(document.getElementById('root')).render(
    <CredentialsProvider>
        <StrictMode>
            <App/>
        </StrictMode>
    </CredentialsProvider>,
)
