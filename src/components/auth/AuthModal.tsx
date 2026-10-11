import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Droplets,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalDefaultMode,
    login,
    signup,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [role, setRole] = useState<'citizen' | 'volunteer'>('citizen');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalDefaultMode);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isAuthModalOpen, authModalDefaultMode]);

  if (!isAuthModalOpen) return null;

  const validateForm = (): boolean => {
    setErrorMessage(null);
    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return false;
    }
    if (mode === 'signup') {
      if (!name || name.trim().length < 2) {
        setErrorMessage('Full name must be at least 2 characters.');
        return false;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('Successfully signed in!');
          setTimeout(() => {
            closeAuthModal();
          }, 600);
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      } else {
        const res = await signup({
          email,
          password,
          name: name.trim(),
          city,
          state,
          role,
          bio: bio.trim(),
        });
        if (res.success) {
          setSuccessMessage('Account registered successfully! Welcome to Jal-Dharani.');
          setTimeout(() => {
            closeAuthModal();
          }, 700);
        } else {
          setErrorMessage(res.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleUp">
        {/* BRANDED HEADER */}
        <div className="bg-gradient-to-r from-teal-800 to-cyan-900 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-teal-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
              <Droplets className="w-5 h-5 text-teal-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Jal-Dharani Platform
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join Citizen Water Network'}
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            {mode === 'login'
              ? 'Sign in to record water observations and join community cooling drives.'
              : 'Create your account to safeguard India’s aquifers and urban catchments.'}
          </p>

          {/* TABS SWITCHER */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-teal-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-teal-100 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* NOTIFICATION MESSAGES */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGNUP EXTRA FIELDS */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900"
                />
              </div>
            </div>
          )}

          {/* EMAIL FIELD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@jal-dharani.org"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900"
              />
            </div>
          </div>

          {/* PASSWORD FIELD WITH VISIBILITY TOGGLE */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-slate-400">Min 8 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SIGNUP: ROLE & LOCATION */}
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Pune"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Community Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      role === 'citizen'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">Citizen Monitor</div>
                    <div className="text-[10px] text-slate-500">Document local lakes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('volunteer')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      role === 'volunteer'
                        ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">Field Volunteer</div>
                    <div className="text-[10px] text-slate-500">Join cleanup drives</div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Citizen Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* FOOTER SWITCH */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                New to Jal-Dharani?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Create free account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
