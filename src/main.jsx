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
import ProductPage from './Layout/ProductPage.jsx';
import ProductPage2 from './Layout/ProductPage2.jsx';
import ShoppingCart from './Layout/ShoppingCart.jsx';
import Step1 from './Layout/Step1.jsx';
import Step3 from './Layout/Step3.jsx';
import PageProduct from './Pages/PageProduct.jsx';
import PhonePage from './Pages/PhonePage.jsx';
import Cart from './Layout/Cart.jsx';
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
  },
  {
    path: "/ProductPage",
    Component: ProductPage,
  },
  {
    path: "/ProductPage2",
    Component: ProductPage2,
  },
  {
    path: "/ShoppingCart",
    Component: ShoppingCart,
  },
  {
    path: "/Step1",
    Component: Step1,
  },
  {
    path: "/Step3",
    Component: Step3,
  },
  {
    path: "/PageProduct",
    Component: PageProduct,
  },
  {
    path: "/PhonePage",
    Component: PhonePage,
  },
  {
    path: "/Cart",
    Component: Cart,
  }


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
