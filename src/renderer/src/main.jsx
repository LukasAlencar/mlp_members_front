import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './components/screens/Home';
import RegisterMember from './components/screens/RegisterMember';
import ProtectedRoute from './components/screens/ProtectedRoute';
import ListMembers from './components/screens/ListMembers';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index path="/" element={<App />} />
      <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home />} />
        <Route path="/registerMember" element={<RegisterMember />} />
        <Route path="/listMembers" element={<ListMembers />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
