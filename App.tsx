import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { User, AppRoute } from './types';
import ScrollToTop from './components/ScrollToTop';
import { getUser, setUser, removeUser, getToken } from './services/api';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Developer from './pages/Developer';
import Quiz from './pages/Quiz';
import History from './pages/History';
import NotFound from './pages/NotFound';
import SimplePage from './pages/SimplePage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Tips from './pages/Tips';

const App: React.FC = () => {
  // Real Auth State with JWT
  const [user, setUserState] = useState<User>(() => {
    const savedUser = getUser();
    const token = getToken();
    if (savedUser && token) {
      return { ...savedUser, isLoggedIn: true };
    }
    return { username: '', email: '', isLoggedIn: false };
  });

  useEffect(() => {
    // Check if user is still logged in (token exists)
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setUserState({ ...savedUser, isLoggedIn: true });
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (userData: any, token: string) => {
    const userObj: User = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      isLoggedIn: true,
    };
    setUser(userObj);
    setUserState(userObj);
  };

  const handleLogout = () => {
    removeUser();
    setUserState({ username: '', email: '', isLoggedIn: false });
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path={AppRoute.HOME} element={<Home user={user} />} />
          <Route path={AppRoute.LOGIN} element={!user.isLoggedIn ? <Auth mode="signin" onAuth={handleLogin} /> : <Navigate to={AppRoute.DASHBOARD} />} />
          <Route path={AppRoute.SIGNUP} element={!user.isLoggedIn ? <Auth mode="signup" onAuth={handleLogin} /> : <Navigate to={AppRoute.DASHBOARD} />} />
          
          <Route path={AppRoute.DASHBOARD} element={user.isLoggedIn ? <Dashboard /> : <Navigate to={AppRoute.LOGIN} />} />
          <Route path={AppRoute.HISTORY} element={user.isLoggedIn ? <History /> : <Navigate to={AppRoute.LOGIN} />} />
          <Route path={AppRoute.PROFILE} element={user.isLoggedIn ? <Profile user={user} /> : <Navigate to={AppRoute.LOGIN} />} />
          
          <Route path={AppRoute.QUIZ} element={<Quiz />} />
          <Route path={AppRoute.DEVELOPER} element={<Developer />} />
          
          <Route path={AppRoute.TERMS} element={<Terms />} />
          <Route path={AppRoute.PRIVACY} element={<Privacy />} />
          <Route path={AppRoute.CONTACT} element={<Contact />} />
          <Route path={AppRoute.TIPS} element={<Tips />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;