import { StrictMode } from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/index.css'
import App from './App.jsx'
import HomePage from './Pages/HomePage.jsx';
import Header from './Components/Header.jsx'
import Home from './Layout/Home.jsx'
import Footer from './Components/Footer.jsx'
import 'antd/dist/reset.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ImOpt } from 'react-icons/im'


const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/Header",
    Component: Header,
  },
  {
    path: "/Home",
    Component: Home,
  },
  {
    path: "/Footer",
    Component: Footer,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
