import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const [loginMutation, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            login(data.login.token, data.login.user);
        },
        onError: (err) => {
            setError(err.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        loginMutation({ variables: { email, password } });
    };

    const quickLogin = (role) => {
        if (role === 'admin') {
            setEmail('admin@company.com');
            setPassword('admin123');
        } else {
            setEmail('employee@company.com');
            setPassword('employee123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block relative mb-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl blur-2xl opacity-50 animate-float"></div>
                            <div className="relative bg-gradient-to-br from-primary-600 to-secondary-600 p-4 rounded-3xl shadow-lg">
                                <span className="text-5xl">🏢</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                            EmployeeHub
                        </h1>
                        <p className="text-gray-400">Sign in to manage your workforce</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-slide-down">
                                <span>⚠️</span>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@company.com"
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary-500/50 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900/50 text-gray-400">Quick Login</span>
                        </div>
                    </div>

                    {/* Quick Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => quickLogin('admin')}
                            className="flex flex-col items-center space-y-2 p-4 glass hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <span className="text-3xl">👑</span>
                            <span className="text-sm font-medium text-gray-300">Admin Demo</span>
                        </button>
                        <button
                            onClick={() => quickLogin('employee')}
                            className="flex flex-col items-center space-y-2 p-4 glass hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <span className="text-3xl">👤</span>
                            <span className="text-sm font-medium text-gray-300">Employee Demo</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-1">
                        <p className="text-xs text-gray-500">Demo Credentials:</p>
                        <p className="text-xs font-mono text-primary-400">Admin: admin@company.com / admin123</p>
                        <p className="text-xs font-mono text-blue-400">Employee: employee@company.com / employee123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
