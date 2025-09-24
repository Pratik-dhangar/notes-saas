import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import ThemeToggle from '../components/ui/ThemeToggle';
import wallpaperImg from '../assets/wallpaper.png';
import type { LoginForm } from '../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(data);
      login(response.token, response.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-black relative overflow-hidden">

      {/* Theme toggle button */}
      <div className="absolute top-4 right-8 z-20 bg-transparent">
        <ThemeToggle />
      </div>

    

      <div className="flex min-h-screen">
        {/* Left side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
          <div className="w-full max-w-sm space-y-6">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/logo-1.svg" 
                  alt="Logo" 
                  className="h-12 w-12 mr-3"
                />
                <h1 className="text-2xl font-bold text-white">Notes App</h1>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                  Sign in to your account to continue
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email address
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      autoComplete="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-sm"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-10 transition-colors text-sm"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Sign in
                </button>

                <div className="text-center">
                  <Link
                    to="/register"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                  >
                    Don't have an account? Sign up
                  </Link>
                </div>
              </form>

              {/* Demo accounts */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-2">Demo Accounts:</h3>
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <p>• admin@acme.test / password123 (Admin)</p>
                  <p>• user@acme.test / password123 (Member)</p>
                  <p>• admin@globex.test / password123 (Admin)</p>
                  <p>• user@globex.test / password123 (Member)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Wallpaper with smaller logo */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src={wallpaperImg}
            alt="Login wallpaper"
            className="object-cover w-full h-full"
          />
         
        </div>
      </div>
    </div>
  );
};

export default LoginPage;