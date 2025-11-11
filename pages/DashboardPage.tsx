
import React, { useState, useMemo } from 'react';
import { useTickets } from '../context/TicketsContext';
import type { Ticket } from '../types';
import { Priority } from '../types';
import { Search } from 'lucide-react';

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
    const colorClasses = {
        [Priority.HIGH]: 'bg-red-500/20 text-red-300 border-red-500/30',
        [Priority.MEDIUM]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        [Priority.LOW]: 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colorClasses[priority]}`}>
            {priority}
        </span>
    );
};

const DashboardPage: React.FC = () => {
    const { tickets } = useTickets();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTickets = useMemo(() => {
        if (!searchTerm) return tickets;
        const lowercasedFilter = searchTerm.toLowerCase();
        return tickets.filter(ticket =>
            ticket.name.toLowerCase().includes(lowercasedFilter) ||
            ticket.email.toLowerCase().includes(lowercasedFilter) ||
            ticket.description.toLowerCase().includes(lowercasedFilter) ||
            ticket.category.toLowerCase().includes(lowercasedFilter) ||
            ticket.assignedAgent.toLowerCase().includes(lowercasedFilter) ||
            ticket.id.toLowerCase().includes(lowercasedFilter)
        );
    }, [tickets, searchTerm]);
    
    const highPriorityCount = useMemo(() => tickets.filter(t => t.priority === Priority.HIGH).length, [tickets]);

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-white">Support Dashboard</h1>
                    <p className="text-slate-400 mt-1">{tickets.length} total tickets</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-bold text-lg text-red-400 animate-pulse">{highPriorityCount}</p>
                        <p className="text-sm text-slate-400">High-Priority Tickets</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl shadow-black/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ticket ID</th>
                                <th scope="col" className="px-6 py-3">Customer</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Priority</th>
                                <th scope="col" className="px-6 py-3">Agent</th>
                                <th scope="col" className="px-6 py-3">Est. Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket: Ticket, index) => (
                                <tr key={ticket.id} className="bg-slate-800/50 border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200" style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}>
                                    <th scope="row" className="px-6 py-4 font-mono text-xs text-blue-400 whitespace-nowrap">{ticket.id}</th>
                                    <td className="px-6 py-4">
                                        <div>{ticket.name}</div>
                                        <div className="text-slate-400 text-xs">{ticket.email}</div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={ticket.description}>{ticket.description}</td>
                                    <td className="px-6 py-4">{ticket.category}</td>
                                    <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                                    <td className="px-6 py-4">{ticket.assignedAgent}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{ticket.estimatedTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredTickets.length === 0 && (
                        <div className="text-center py-16 text-slate-400">
                            <h3 className="text-lg font-semibold">No tickets found</h3>
                            <p>There are no tickets matching your search, or no tickets have been submitted yet.</p>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
