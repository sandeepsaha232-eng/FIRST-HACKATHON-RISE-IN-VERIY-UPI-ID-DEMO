import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Ensure root exists before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("❌ Fatal Error: 'root' element not found in DOM.");
    document.body.innerHTML += "<h2 style='color:red'>Fatal Error: id='root' missing.</h2>";
} else {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}
