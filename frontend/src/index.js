import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainPage from './pages/MainPage';
import HomePage from './pages/user/HomePage';
import MyPetsPage from './pages/user/MyPetsPage';
import AdminPage from './pages/admin/AdminHomePage';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<MainPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/home/pets" element={<MyPetsPage />} />
    
    </>
  )
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
