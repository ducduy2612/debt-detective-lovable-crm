
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Customer, Loan, CollectionAction, CollectionStrategy, Task, Payment, User 
} from '@/types/crm';
import { mockData } from '@/services/mockData';

interface CrmContextType {
  users: User[];
  customers: Customer[];
  loans: Loan[];
  strategies: CollectionStrategy[];
  tasks: Task[];
  actions: CollectionAction[];
  payments: Payment[];
  currentUser: User | null;
  selectedCustomer: Customer | null;
  selectedLoan: Loan | null;
  
  // Methods
  setCurrentUser: (user: User) => void;
  selectCustomer: (customer: Customer | null) => void;
  selectLoan: (loan: Loan | null) => void;
  addAction: (action: Omit<CollectionAction, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addCustomerContact: (customerId: string, phoneNumber: string, type: string) => void;
  addCustomerAddress: (customerId: string, address: string, city: string, state: string, zipCode: string, type: string) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [customers, setCustomers] = useState<Customer[]>(mockData.customers);
  const [loans, setLoans] = useState<Loan[]>(mockData.loans);
  const [strategies, setStrategies] = useState<CollectionStrategy[]>(mockData.strategies);
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks);
  const [actions, setActions] = useState<CollectionAction[]>(mockData.actions);
  const [payments, setPayments] = useState<Payment[]>(mockData.payments);
  
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
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
  
  const addAction = (actionData: Omit<CollectionAction, 'id'>) => {
    const newAction: CollectionAction = {
      ...actionData,
      id: `action-${Date.now()}`,
    };
    
    setActions(prev => [newAction, ...prev]);
    
    // Update task status if this action is linked to a task
    const relatedTask = tasks.find(t => 
      t.loanId === newAction.loanId && 
      t.taskType === newAction.type && 
      t.status !== 'completed' &&
      t.assignedTo === newAction.agentId
    );
    
    if (relatedTask) {
      updateTaskStatus(relatedTask.id, 'completed');
    }
  };
  
  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };
  
  const addCustomerContact = (customerId: string, phoneNumber: string, type: string) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          phoneNumbers: [
            ...customer.phoneNumbers,
            {
              phoneNumber,
              type: type as 'primary' | 'secondary' | 'work' | 'other',
              isValid: true,
              addedBy: currentUser?.id,
              addedOn: new Date(),
            }
          ]
        };
      }
      return customer;
    }));
  };
  
  const addCustomerAddress = (
    customerId: string, 
    address: string, 
    city: string, 
    state: string, 
    zipCode: string, 
    type: string
  ) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          addresses: [
            ...customer.addresses,
            {
              id: `addr-${customerId}-${Date.now()}`,
              type: type as 'home' | 'work' | 'other',
              address,
              city,
              state,
              zipCode,
              isVerified: false,
              addedBy: currentUser?.id,
              addedOn: new Date(),
            }
          ]
        };
      }
      return customer;
    }));
  };
  
  const value: CrmContextType = {
    users,
    customers,
    loans,
    strategies,
    tasks,
    actions,
    payments,
    currentUser,
    selectedCustomer,
    selectedLoan,
    setCurrentUser,
    selectCustomer,
    selectLoan,
    addAction,
    updateTaskStatus,
    addCustomerContact,
    addCustomerAddress,
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
