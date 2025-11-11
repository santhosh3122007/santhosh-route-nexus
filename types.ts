
export enum Category {
  BILLING = 'Billing',
  TECHNICAL = 'Technical',
  REFUND = 'Refund',
  ORDER = 'Order',
  ACCOUNT = 'Account',
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface Ticket {
  id: string;
  name: string;
  email: string;
  description: string;
  category: Category;
  priority: Priority;
  assignedAgent: string;
  estimatedTime: string;
  createdAt: string;
}

export interface AnalyzedTicketData {
  category: Category;
  priority: Priority;
  estimatedTime: string;
  assignedAgent: string;
}
