import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface AuthModalProps {
  onClose?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Login');
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');

  interface AuthActionEvent extends React.FormEvent<HTMLFormElement> {}

  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (e: AuthActionEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

  const Username = username.trim();
    const Password = password;

    try {
      const endpoint = activeTab === 'Sign Up' ? '/api/users/register' : '/api/users/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ Username, Password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
  const successMessage = data.message || `${activeTab} successful.`;
  setMessage(successMessage);
  setUsername('');
        setPassword('');

        if (activeTab === 'Sign Up') {
          try {
            const loginRes = await fetch('/api/users/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ Username, Password })
            });
            const loginData = await loginRes.json().catch(() => ({}));
            if (loginRes.ok && loginData.user) {
              try { setUser(loginData.user); } catch (err) {}
            }
          } catch (err) {
            console.warn('Auto-login after signup failed', err);
          }
        } else {
          if (data.user) {
            try { setUser(data.user); } catch (err) {}
          }
        }
        setTimeout(() => {
          setMessage('');
          handleClose();
        }, 1000);
      } else {
        if (res.status === 409) {
          setMessage(data.error || 'Username already exists.');
        } else if (res.status === 401 || res.status === 403) {
          setMessage(data.error || 'Invalid credentials.');
        } else {
          setMessage(data.error || 'An error occurred.');
        }
      }
    } catch (err: any) {
      console.error('Auth request failed', err);
      setMessage('Network error — please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleClose = () => {
    console.log("Modal closed. State reset.");
    setActiveTab('Login');
    setUsername('');
    setPassword('');
    setMessage('');
    if (onClose) onClose();
  };

  const isFormValid = username.length > 0 && password.length >= 6;

  return (
    <div onClick={handleClose} style={{ zIndex: 99999 }} className="fixed inset-0 bg-black bg-opacity-60 font-sans antialiased flex items-center justify-center p-4">
    {message && (
      <div style={{ zIndex: 100000 }} className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-xl transition-opacity duration-300 animate-slide-in">
        {message}
      </div>
    )}
        
  <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-sm mx-auto rounded-xl shadow-2xl transform transition-all duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-900">Welcome to Disaster Response Network</h3>
            <p className="text-sm text-gray-500 mt-1">Join our community of donors making a real difference</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition ml-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="px-6 pt-6">
          <div className="flex p-1 bg-gray-100 rounded-full mb-6 shadow-inner">
            <button
              onClick={() => setActiveTab('Login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                activeTab === 'Login'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('Sign Up')}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                activeTab === 'Sign Up'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-4">
            
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="choose a username"
                    className="block w-full pl-10 pr-4 py-3 border-0 bg-gray-50 rounded-lg text-sm transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-6v2m10-2v2m-6 4h.01M6 16h.01M16 16h.01M12 11V9m0 2a2 2 0 100-4 2 2 0 000 4zm-6 8h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path></svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 border-0 bg-gray-50 rounded-lg text-sm transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {activeTab === 'Sign Up' ? 'Minimum 6 characters.' : 'Enter your password.'}
              </p>
            </div>
            
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg text-white font-semibold tracking-wide transition-all duration-200 ${
                isFormValid && !loading
                  ? 'bg-indigo-900 hover:bg-indigo-700 shadow-md'
                  : 'bg-gray-500 cursor-not-allowed opacity-75'
              }`}
            >
              {loading ? 'Please wait...' : activeTab}
            </button>
          </form>

          {activeTab === 'Login' && (
            <div className="mt-4 text-center pb-6">
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
                Forgot password?
              </a>
            </div>
          )}
        </div>
      </div>
        <style>{`
            @keyframes slide-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in {
                animation: slide-in 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};


export default AuthModal;