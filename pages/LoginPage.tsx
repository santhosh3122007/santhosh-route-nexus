
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlowingButton from '../components/GlowingButton';
import AnimatedInput from '../components/AnimatedInput';
import { Loader2, AlertTriangle, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('agent@routenexus.io');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(username, password);
        
        setIsLoading(false);
        if (success) {
            navigate(from, { replace: true });
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 animate-fade-in-up">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/30">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Agent Portal</h2>
                    <p className="mt-2 text-slate-400">Sign in to access the dashboard.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <AnimatedInput
                        id="username"
                        label="Username"
                        type="email"
                        autoComplete="email"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <AnimatedInput
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && (
                        <div className="flex items-center text-sm text-red-400 animate-shake">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <div>
                        <GlowingButton type="submit" disabled={isLoading} className="w-full py-3">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Sign In
                                </>
                            )}
                        </GlowingButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
