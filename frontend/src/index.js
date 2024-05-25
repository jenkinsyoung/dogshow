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
import ProfilePage from './pages/user/ProfilePage';
import ExpertHomePage from './pages/expert/ExpertHomePage';
import AdminRingPage from './pages/admin/AdminRingPage';
import Forbidden from './pages/Forbidden';
import AdminParticipantPage from './pages/admin/AdminParticipantPage';
import AdminExpertPage from './pages/admin/AdminExpertPage';
import ExpertParticipantPage from './pages/expert/ExpertParticipantPage';
import ExpertsPage from './pages/user/ExpertsPage';
import ExpertRingPage from './pages/expert/ExpertRingPage';
import ExpertProfilePage from './pages/expert/ExpertProfilepage';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<MainPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/admin/rings" element={<AdminRingPage />} />
    <Route path="/admin/participants" element={<AdminParticipantPage />} />
    <Route path="/admin/experts" element={<AdminExpertPage />} />
    <Route path="/expert" element={<ExpertHomePage />} />
    <Route path="/expert/participants" element={<ExpertParticipantPage />} />
    <Route path="/expert/rings" element={<ExpertRingPage />} />
    <Route path="/expert/profile" element={<ExpertProfilePage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/home/pets" element={<MyPetsPage />} />
    {/* <Route path="/home/rings" element={<RingsPage />} /> */}
    <Route path="/home/experts" element={<ExpertsPage />} />

    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/forbidden" element={<Forbidden />} />
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
