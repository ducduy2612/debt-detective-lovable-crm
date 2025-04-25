import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Customer, Loan, Payment, Case, ActionRecord, Task,
  Phone, Address, Email, Agent, Collateral
} from '@/types/crm';
import { mockData } from '@/services/mockData';
import { getCurrentAgent } from '@/lib/adapters';

interface CrmContextType {
  customers: Customer[];
  loans: Loan[];
  cases: Case[];
  actions: ActionRecord[];
  tasks: Task[];
  payments: Payment[];
  agents: Agent[];
  collaterals: Collateral[];
  currentAgent: Agent | null;
  selectedCustomer: Customer | null;
  selectedLoan: Loan | null;
  
  setCurrentAgent: (agent: Agent | null) => void;
  selectCustomer: (customer: Customer | null) => void;
  selectLoan: (loan: Loan | null) => void;
  addAction: (action: Omit<ActionRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addCustomerContact: (customerId: string, phoneData: Partial<Phone>) => void;
  addCustomerAddress: (customerId: string, addressData: Partial<Address>) => void;
  addCustomerEmail: (customerId: string, emailData: Partial<Email>) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockData.customers);
  const [loans, setLoans] = useState<Loan[]>(mockData.loans);
  const [cases, setCases] = useState<Case[]>(mockData.cases);
  const [actions, setActions] = useState<ActionRecord[]>(mockData.actions);
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks);
  const [payments, setPayments] = useState<Payment[]>(mockData.payments);
  const [agents, setAgents] = useState<Agent[]>(mockData.agents);
  const [collaterals, setCollaterals] = useState<Collateral[]>(mockData.collaterals);
  
  const defaultAgent = getCurrentAgent();
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(defaultAgent);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  
  const selectCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    setSelectedLoan(null);
  };
  
  const selectLoan = (loan: Loan | null) => {
    setSelectedLoan(loan);
    if (loan) {
      const customer = customers.find(c => c.id === loan.customerId);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  };
  
  const addAction = (actionData: Omit<ActionRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAction: ActionRecord = {
      ...actionData,
      id: `action-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setActions(prev => [newAction, ...prev]);
  };
  
  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };
  
  const addCustomerContact = async (customerId: string, phoneData: Partial<Phone>) => {
    const newPhone: Phone = {
      id: `phone-${Date.now()}`,
      customerId,
      type: phoneData.type || 'MOBILE',
      number: phoneData.number || '',
      isPrimary: phoneData.isPrimary || false,
      isVerified: false,
      sourceSystem: 'CRM',
      createdBy: currentAgent?.id || 'SYSTEM',
      updatedBy: currentAgent?.id || 'SYSTEM',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEditable: true
    };
    
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          phoneNumbers: [...customer.phoneNumbers, newPhone]
        };
      }
      return customer;
    }));
  };
  
  const addCustomerAddress = async (customerId: string, addressData: Partial<Address>) => {
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      customerId,
      type: addressData.type || 'HOME',
      addressLine1: addressData.addressLine1 || '',
      addressLine2: addressData.addressLine2,
      city: addressData.city || '',
      state: addressData.state || '',
      district: addressData.district || '',
      country: addressData.country || 'US',
      isPrimary: addressData.isPrimary || false,
      isVerified: false,
      sourceSystem: 'CRM',
      createdBy: currentAgent?.id || 'SYSTEM',
      updatedBy: currentAgent?.id || 'SYSTEM',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEditable: true
    };
    
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          addresses: [...customer.addresses, newAddress]
        };
      }
      return customer;
    }));
  };
  
  const addCustomerEmail = async (customerId: string, emailData: Partial<Email>) => {
    const newEmail: Email = {
      id: `email-${Date.now()}`,
      customerId,
      address: emailData.address || '',
      isPrimary: emailData.isPrimary || false,
      isVerified: false,
      sourceSystem: 'CRM',
      createdBy: currentAgent?.id || 'SYSTEM',
      updatedBy: currentAgent?.id || 'SYSTEM',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEditable: true
    };
    
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          emails: [...customer.emails, newEmail]
        };
      }
      return customer;
    }));
  };
  
  const value: CrmContextType = {
    customers,
    loans,
    cases,
    actions,
    tasks,
    payments,
    agents,
    collaterals,
    currentAgent,
    selectedCustomer,
    selectedLoan,
    setCurrentAgent,
    selectCustomer,
    selectLoan,
    addAction,
    updateTaskStatus,
    addCustomerContact,
    addCustomerAddress,
    addCustomerEmail
  };
  
  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (context === undefined) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
