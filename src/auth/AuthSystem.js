// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode'; // You'll need to install this package

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('shopper-token');
    const userData = localStorage.getItem('shopper-user');
    
    if (!token) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    
    try {
      // Verify token hasn't expired
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token has expired
        logout();
        return;
      }
      
      // Token is valid
      let user = null;
      if (userData) {
        user = JSON.parse(userData);
      }
      
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Authentication error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data
      localStorage.setItem('shopper-token', data.token);
      localStorage.setItem('shopper-user', JSON.stringify(data.user));
      
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('shopper-token');
    localStorage.removeItem('shopper-user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const authValues = {
    currentUser,
    isLoggedIn,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced AuthDebugger that leverages the auth context
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

export const AuthDebugger = () => {
  const { isLoggedIn, currentUser, checkAuthStatus } = useAuth();
  
  useEffect(() => {
    // Add this to check what's in localStorage and auth context
    const debugAuth = () => {
      const token = localStorage.getItem('shopper-token');
      const user = localStorage.getItem('shopper-user');
      
      console.log('---- Auth Debug Info ----');
      console.log('Auth context - isLoggedIn:', isLoggedIn);
      console.log('Auth context - currentUser exists:', !!currentUser);
      
      console.log('Token exists:', !!token);
      if (token) {
        // Don't log the full token for security, just a hint
        console.log('Token hint:', token.substring(0, 10) + '...');
        
        try {
          const decoded = jwt_decode(token);
          console.log('Token expiration:', new Date(decoded.exp * 1000).toLocaleString());
          console.log('Token is expired:', decoded.exp < Date.now() / 1000);
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }
      
      console.log('User data exists:', !!user);
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log('User data keys:', Object.keys(parsedUser));
          console.log('Username:', parsedUser.username);
          console.log('Created at:', parsedUser.created_at);
        } catch (err) {
          console.error('Error parsing user data:', err);
          console.log('Raw user data:', user);
        }
      }
      console.log('------------------------');
    };
    
    debugAuth();
  }, [isLoggedIn, currentUser]);
  
  return null; // This component doesn't render anything
};

// withAuth HOC for protected routes
export const withAuth = (Component) => {
  const WithAuth = (props) => {
    const { isLoggedIn, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isLoggedIn) {
      // You could redirect here using React Router
      // Example: navigate('/login');
      return <div>Please log in to access this page</div>;
    }
    
    return <Component {...props} />;
  };
  
  return WithAuth;
};

// Example usage:
// 1. Wrap your app with AuthProvider
// import { AuthProvider } from './path/to/AuthContext';
// 
// function App() {
//   return (
//     <AuthProvider>
//       <AuthDebugger /> {/* Add the debugger */}
//       <Router>
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/dashboard" element={<ProtectedRoute />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }
//
// 2. Create protected route components
// import { withAuth } from './path/to/AuthContext';
// 
// const Dashboard = () => {
//   return <div>Protected Dashboard</div>;
// };
// 
// const ProtectedDashboard = withAuth(Dashboard);