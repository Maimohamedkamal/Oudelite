
import React from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Mainlayout from "./Layout/Mainlayout";
import Authlayout from "./Layout/Authlayout";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

import ProtectedroutesApp from "./Components/ProtectedRoutes/ProtectedroutesApp";

import ProductDetailes from "./Pages/ProductDetailes/ProductDetailes";


import BestSellers from "./Pages/BestSellers/BestSellers";

import WomansFragmanceRoute from "./Components/WomanFragroute/WomanFragroute";
import MenFragmanceRoute from "./Components/MenFragmanceRoute/MenFragmanceRoute";
import UnisexFragmanceRoute from "./Components/UnisexFragmanceRoute/UnisexFragmanceRoute";

import Profile from "./Pages/Profile/Profile";
import GetCart from "./Components/Cart/GetCart";
import CartCountProvider from "./Components/CartCount";

import AboutUs from "./Pages/About";
import ContactMessage from "./Pages/ContactMessage";
import FindStore from "./Pages/Findstore";
import ContactUs from "./Pages/Contact-us";
import GetWishlist from "./Components/Wishlist/GetWishlist";
import Editprofile from "./Pages/Edit-profile/Edit-profile";

import Portrait from "./Components/Portrait/Portrait";
import Addresses from "./Pages/Addresses/Addresses";
import MyOrders from "./Pages/Orders/Orders";
import CheckOut from "./Pages/Orders/CheckOut";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Mainlayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />,
        },

        {
          path: "home",
          element: <Home />,
        },

        {
          path: "home/:slug",
          element: <ProductDetailes />,
        },

     

        {
          path: "category/womens-collection",
          element: <WomansFragmanceRoute />,
        },

        {
          path: "category/mens-collection",
          element: <MenFragmanceRoute />,
        },

        {
          path: "category/unisex",
          element: <UnisexFragmanceRoute />,
        },

    
        {
          path: "category/best-sellers",
          element: <BestSellers />,
        },

       
        {
          path: "category/portrait",
          element: <Portrait/>,
        },

  

        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "find-store",
          element: <FindStore/>,
        },

        {
          path: "contact-us",
          element: <ContactUs />,
        },
        {
          path: "contact-message",
          element: <ContactMessage/>,
        },
      ],
    },

    // Protected routes
    {
      element: <ProtectedroutesApp />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
        },

        {
          path: "/edit-profile",
          element: <Editprofile />,
        },
        {
          path: "/address",
          element: <Addresses />,
        },
        {
          path: "/checkout",
          element: <CheckOut/>,
        },
        {
          path: "/orders",
          element: <MyOrders/>,
        },

        {
          path: "/cart",
          element: <GetCart />,
        },

        {
          path: "/wishlist",
          element: <GetWishlist />,
        },
      ],
    },

    // Authentication routes
    {
      path: "/",
      element: <Authlayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },

        {
          path: "register",
          element: <Register />,
        },
      ],
    },
  ]);

  return (
    <CartCountProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </CartCountProvider>
  );
}
