import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Page/Login";
import { Admin } from "./Page/Admin";

import Singup from "./Singup";
import LoginU from "./Page/UserLogins/LoginU";
import SignupU from "./Page/UserLogins/SignupU";
import Employee from "./Page/Employee";
import Home from "./Page/Home";
import About from "./Page/About";
import Contect from "./Page/Contect";
import Privacy from "./Page/Privacy";
import Chating from "./Page/Chating";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },

    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/admin/login",
      element: <Login />,
    },
    {
      path: "/admin/signup",
      element: <Singup />,
    },
    {
      path: "/employee",
      element: <Employee />,
    },
    {
      path: "/user/login",
      element: <LoginU />,
    },
    {
      path: "/user/signup",
      element: <SignupU />,
    },
    {
      path: "/About",
      element: <About />,
    },
    {
      path: "/Contect",
      element: <Contect />,
    },
    {
      path: "/Privacy",
      element: <Privacy />,
    },
    {
      path: "/Chating",
      element: <Chating />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
