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
import Checkout from './Layout/Checkout.jsx';
import ProductsApi from './Layout/ProductsApi.jsx';
import ProductsApiPage from './Pages/ProductsApiPage.jsx';
import Contact from './Layout/Contact.jsx'
import ContactPage from './Pages/ContactPage.jsx';
import AdminUserPage from './Pages/AdminUserPage.jsx';
import AdminProductPage from './Pages/AdminProductPage.jsx';
import AdminDashboardPage from './Pages/AdminDashboardPage.jsx';
import AdminSetupPage from './Pages/AdminSetupPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import DataUserPage from './Pages/DataUserPage.jsx';
import 'antd/dist/reset.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ImOpt } from 'react-icons/im'
import { ToastProvider } from './context/ToastContext'


const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/home",
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
  ,
  {
    path: "/checkout",
    Component: Checkout,
  }

  ,
  {
    path: "/products-api",
    Component: ProductsApiPage,
  },
  {
    path: "/ContactPage",
    Component: ContactPage,
  },
  {
    path: "/AdminPage",
    Component: AdminUserPage,
  },
  {
    path: "/ProductAdmin",
    Component: AdminProductPage,
  },
  {
    path: "/admin-setup",
    Component: AdminSetupPage,
  },
  {
    path: "/admin",
    Component: AdminDashboardPage,
  },
  {
    path: "/admin/users",
    Component: AdminDashboardPage,
  },
  {
    path: "/admin/products",
    Component: AdminDashboardPage,
  },
  {
    path: "/admin/orders",
    Component: AdminDashboardPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/data-user",
    Component: DataUserPage,
  },



]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>,
)
