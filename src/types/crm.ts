
// Customer
export interface CustomerReference {
  id: string;
  name: string;
  relationship: string;
  phoneNumbers: string[];
  email?: string;
  address?: string;
}

export interface CustomerContact {
  phoneNumber: string;
  type: 'primary' | 'secondary' | 'work' | 'other';
  isValid: boolean;
  addedBy?: string;
  addedOn?: Date;
}

export interface CustomerAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isVerified: boolean;
  addedBy?: string;
  addedOn?: Date;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumbers: CustomerContact[];
  email?: string;
  addresses: CustomerAddress[];
  occupation?: string;
  income?: number;
  references: CustomerReference[];
}

// Loan
export type ProductType = 'loan' | 'credit card' | 'overdraft';
export type LoanStatus = 'current' | 'overdue' | 'default' | 'legal notice' | 'closed';

export interface LoanStatusHistory {
  status: LoanStatus;
  changedOn: Date;
  daysOverdue?: number;
}

export interface Collateral {
  id: string;
  type: string;
  description: string;
  valuations: {
    amount: number;
    date: Date;
    appraiser?: string;
  }[];
}

export interface DueAmount {
  id: string;
  dueDate: Date;
  totalAmount: number;
  principal: number;
  interest: number;
  fines?: number;
  isPaid: boolean;
  paidOn?: Date;
}

export interface Loan {
  id: string;
  customerId: string;
  productType: ProductType;
  interestRate: number;
  outstandingAmount: number;
  status: LoanStatus;
  statusHistory: LoanStatusHistory[];
  dueAmounts: DueAmount[];
  collaterals: Collateral[];
  createdOn: Date;
}

// Collection
export type ActionType = 'call' | 'email' | 'SMS' | 'visit' | 'legal filing';
export type ActionOutcome = 'successful' | 'unsuccessful' | 'no answer' | 'promise to pay' | 'dispute' | 'cannot pay';

export interface CollectionAction {
  id: string;
  loanId: string;
  customerId: string;
  type: ActionType;
  date: Date;
  agentId: string;
  agentName: string;
  outcome: ActionOutcome;
  notes?: string;
  followUpDate?: Date;
  gpsLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface CollectionStrategy {
  id: string;
  name: string;
  description: string;
  allowedActions: ActionType[];
  priorityLevel: number;
  criteria: {
    minOverdueDays?: number;
    maxOverdueDays?: number;
    minAmount?: number;
    maxAmount?: number;
    productTypes?: ProductType[];
  };
  createdBy: string;
  createdOn: Date;
  isActive: boolean;
}

export interface Task {
  id: string;
  loanId: string;
  customerId: string;
  assignedTo: string;
  taskType: ActionType;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in progress' | 'completed' | 'cancelled';
  notes?: string;
  strategyId?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'bank transfer' | 'check' | 'direct debit' | 'credit card';
  referenceNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'team_lead' | 'admin';
  team?: string;
}
