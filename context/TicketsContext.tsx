
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { Ticket } from '../types';

interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const item = window.localStorage.getItem('routenexus-tickets');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('routenexus-tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error(error);
    }
  }, [tickets]);

  const addTicket = (ticket: Ticket) => {
    setTickets(prevTickets => [ticket, ...prevTickets]);
  };

  return (
    <TicketsContext.Provider value={{ tickets, addTicket }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = (): TicketsContextType => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
};
