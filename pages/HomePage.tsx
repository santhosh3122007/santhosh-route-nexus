
import React, { useState, useEffect } from 'react';
import { analyzeTicket } from '../services/geminiService';
import type { AnalyzedTicketData, Ticket } from '../types';
import { useTickets } from '../context/TicketsContext';
import GlowingButton from '../components/GlowingButton';
import { Loader2, Send, CheckCircle, AlertTriangle, FileText, User, Mail } from 'lucide-react';

const AnimatedResultCard: React.FC<{ data: AnalyzedTicketData }> = ({ data }) => {
    return (
        <div className="animate-fade-in-up mt-8 p-6 bg-slate-800/50 border border-blue-500/50 rounded-xl shadow-2xl shadow-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Ticket Submitted Successfully!</h3>
            </div>
            <p className="text-slate-300 mb-6">Our AI has analyzed your request and routed it accordingly.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400">Category</p>
                    <p className="font-semibold text-white">{data.category}</p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400">Priority</p>
                    <p className={`font-semibold ${data.priority === 'High' ? 'text-red-400' : data.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{data.priority}</p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400">Assigned Agent</p>
                    <p className="font-semibold text-white">{data.assignedAgent}</p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-slate-400">Estimated Resolution</p>
                    <p className="font-semibold text-white">{data.estimatedTime}</p>
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzedTicketData | null>(null);
    const { addTicket } = useTickets();

    const [animatedText, setAnimatedText] = useState('');
    const bannerText = "Welcome to RouteNexus – Smarter Support Starts Here!";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setAnimatedText(bannerText.slice(0, i + 1));
            i++;
            if (i === bannerText.length) {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !description) {
            setError('Please fill out all fields.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setResult(null);

        try {
            const analysis = await analyzeTicket(description);
            setResult(analysis);
            const newTicket: Ticket = {
                id: `TIX-${Date.now()}`,
                name,
                email,
                description,
                createdAt: new Date().toISOString(),
                ...analysis
            };
            addTicket(newTicket);
            setName('');
            setEmail('');
            setDescription('');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300 mb-4">
               {animatedText}<span className="inline-block animate-pulse">|</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8">
                Submit a support ticket and our AI will instantly classify, prioritize, and assign it to the right agent.
            </p>

            <div className="w-full p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/30">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <User className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" size={20} />
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                     <div className="relative">
                        <Mail className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" size={20} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                     <div className="relative">
                        <FileText className="absolute top-5 left-4 text-slate-400" size={20} />
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your issue..." rows={5} className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                    </div>
                    
                    <GlowingButton type="submit" disabled={isLoading} className="w-full py-3 text-lg">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-5 w-5" />
                                Submit Ticket
                            </>
                        )}
                    </GlowingButton>
                </form>

                {error && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-red-400 animate-shake">
                        <AlertTriangle size={16} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {result && <AnimatedResultCard data={result} />}
        </div>
    );
};

export default HomePage;
