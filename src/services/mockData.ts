
import { 
  Customer, Loan, CollectionAction, CollectionStrategy, Task, Payment, User, 
  CustomerReference, CustomerContact, CustomerAddress, Collateral, DueAmount,
  LoanStatusHistory, ProductType, LoanStatus, ActionType, ActionOutcome
} from '@/types/crm';

// Helper to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to get random enum value
const randomEnum = <T>(anEnum: T): T[keyof T] => {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
};

// Generate random users
export const generateUsers = (count: number): User[] => {
  const roles: ('agent' | 'team_lead' | 'admin')[] = ['agent', 'team_lead', 'admin'];
  const teams = ['East', 'West', 'North', 'South', 'Central'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@debtdetective.com`,
    role: roles[Math.floor(Math.random() * (roles.length - (i === 0 ? 0 : 1)))], // Ensure at least one admin
    team: teams[Math.floor(Math.random() * teams.length)]
  }));
};

// Generate random customers
export const generateCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }, (_, i) => {
    const phoneNumbers: CustomerContact[] = [
      {
        phoneNumber: `555-${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
        type: 'primary',
        isValid: Math.random() > 0.1,
      },
      {
        phoneNumber: `555-${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
        type: 'secondary',
        isValid: Math.random() > 0.2,
        addedBy: `user-${Math.floor(Math.random() * 5) + 1}`,
        addedOn: randomDate(new Date(2023, 0, 1), new Date()),
      }
    ];

    const addresses: CustomerAddress[] = [
      {
        id: `addr-${i}-1`,
        type: 'home',
        address: `${1000 + Math.floor(Math.random() * 9000)} Main St`,
        city: 'Metropolis',
        state: 'NY',
        zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
        isVerified: Math.random() > 0.2,
      }
    ];

    if (Math.random() > 0.7) {
      addresses.push({
        id: `addr-${i}-2`,
        type: 'work',
        address: `${100 + Math.floor(Math.random() * 900)} Business Ave`,
        city: 'Metropolis',
        state: 'NY',
        zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
        isVerified: Math.random() > 0.5,
        addedBy: `user-${Math.floor(Math.random() * 5) + 1}`,
        addedOn: randomDate(new Date(2023, 0, 1), new Date()),
      });
    }

    const references: CustomerReference[] = [];
    const relationships = ['spouse', 'parent', 'sibling', 'child', 'friend'];
    
    if (Math.random() > 0.3) {
      references.push({
        id: `ref-${i}-1`,
        name: `Reference ${i}-1`,
        relationship: relationships[Math.floor(Math.random() * relationships.length)],
        phoneNumbers: [`555-${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`],
        email: Math.random() > 0.5 ? `reference${i}1@example.com` : undefined,
      });
    }

    return {
      id: `cust-${i + 1}`,
      name: `Customer ${i + 1}`,
      phoneNumbers,
      email: Math.random() > 0.2 ? `customer${i + 1}@example.com` : undefined,
      addresses,
      occupation: Math.random() > 0.3 ? ['Teacher', 'Engineer', 'Doctor', 'Sales', 'Manager'][Math.floor(Math.random() * 5)] : undefined,
      income: Math.random() > 0.3 ? Math.floor(Math.random() * 100000) + 30000 : undefined,
      references,
    };
  });
};

// Generate random loans
export const generateLoans = (customers: Customer[]): Loan[] => {
  const productTypes: ProductType[] = ['loan', 'credit card', 'overdraft'];
  const statuses: LoanStatus[] = ['current', 'overdue', 'default', 'legal notice', 'closed'];
  
  return customers.flatMap((customer, i) => {
    // Each customer has 1-3 loans
    const loanCount = Math.floor(Math.random() * 3) + 1;
    
    return Array.from({ length: loanCount }, (_, j) => {
      const createdOn = randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1));
      const status = statuses[Math.floor(Math.random() * (statuses.length - 1))]; // Exclude 'closed' more often
      
      // Generate status history
      const statusHistory: LoanStatusHistory[] = [];
      statusHistory.push({
        status: 'current',
        changedOn: createdOn,
      });
      
      if (status !== 'current') {
        const overdueDays = Math.floor(Math.random() * 120) + 1;
        statusHistory.push({
          status: 'overdue',
          changedOn: new Date(createdOn.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000),
          daysOverdue: overdueDays,
        });
        
        if (status === 'default' || status === 'legal notice') {
          statusHistory.push({
            status: 'default',
            changedOn: new Date(statusHistory[1].changedOn.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000),
            daysOverdue: overdueDays + Math.floor(Math.random() * 60) + 30,
          });
          
          if (status === 'legal notice') {
            statusHistory.push({
              status: 'legal notice',
              changedOn: new Date(statusHistory[2].changedOn.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
              daysOverdue: overdueDays + Math.floor(Math.random() * 90) + 60,
            });
          }
        }
      }
      
      // Generate due amounts (3-12 payment periods)
      const dueAmountCount = Math.floor(Math.random() * 10) + 3;
      const dueAmounts: DueAmount[] = Array.from({ length: dueAmountCount }, (_, k) => {
        const dueDate = new Date(createdOn.getTime() + k * 30 * 24 * 60 * 60 * 1000);
        const totalAmount = Math.floor(Math.random() * 1000) + 200;
        const principal = Math.floor(totalAmount * 0.7);
        const interest = totalAmount - principal;
        const isPaid = dueDate < new Date() && (k < dueAmountCount - (status === 'current' ? 0 : 3));
        
        return {
          id: `due-${i}-${j}-${k}`,
          dueDate,
          totalAmount,
          principal,
          interest,
          fines: !isPaid && dueDate < new Date() ? Math.floor(Math.random() * 50) + 10 : 0,
          isPaid,
          paidOn: isPaid ? new Date(dueDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000) : undefined,
        };
      });
      
      // Generate collaterals (0-2 per loan)
      const collateralCount = Math.floor(Math.random() * 3);
      const collaterals: Collateral[] = Array.from({ length: collateralCount }, (_, k) => {
        const collateralTypes = ['vehicle', 'property', 'jewelry', 'savings', 'guarantor'];
        const collateralType = collateralTypes[Math.floor(Math.random() * collateralTypes.length)];
        
        return {
          id: `coll-${i}-${j}-${k}`,
          type: collateralType,
          description: `${collateralType.charAt(0).toUpperCase() + collateralType.slice(1)} collateral for loan`,
          valuations: [
            {
              amount: Math.floor(Math.random() * 50000) + 5000,
              date: new Date(createdOn.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              appraiser: `Appraiser ${Math.floor(Math.random() * 5) + 1}`,
            }
          ],
        };
      });
      
      // Calculate outstanding amount based on due amounts and status
      const outstandingAmount = dueAmounts.reduce((sum, due) => {
        if (!due.isPaid) {
          return sum + due.totalAmount + (due.fines || 0);
        }
        return sum;
      }, 0);
      
      return {
        id: `loan-${i + 1}-${j + 1}`,
        customerId: customer.id,
        productType: productTypes[Math.floor(Math.random() * productTypes.length)],
        interestRate: Math.floor(Math.random() * 15) + 5,
        outstandingAmount,
        status,
        statusHistory,
        dueAmounts,
        collaterals,
        createdOn,
      };
    });
  });
};

// Generate collection strategies
export const generateStrategies = (users: User[]): CollectionStrategy[] => {
  const teamLeads = users.filter(user => user.role === 'team_lead');
  
  return [
    {
      id: 'strategy-1',
      name: 'Early Stage Collection',
      description: 'Gentle approach for accounts 1-30 days overdue',
      allowedActions: ['call', 'email', 'SMS'],
      priorityLevel: 1,
      criteria: {
        minOverdueDays: 1,
        maxOverdueDays: 30,
        productTypes: ['loan', 'credit card', 'overdraft'],
      },
      createdBy: teamLeads[0]?.id || 'user-1',
      createdOn: new Date(2023, 0, 15),
      isActive: true,
    },
    {
      id: 'strategy-2',
      name: 'Mid Stage Collection',
      description: 'More direct approach for accounts 31-60 days overdue',
      allowedActions: ['call', 'email', 'SMS', 'visit'],
      priorityLevel: 2,
      criteria: {
        minOverdueDays: 31,
        maxOverdueDays: 60,
        productTypes: ['loan', 'credit card', 'overdraft'],
      },
      createdBy: teamLeads[0]?.id || 'user-1',
      createdOn: new Date(2023, 0, 15),
      isActive: true,
    },
    {
      id: 'strategy-3',
      name: 'Late Stage Collection',
      description: 'Intensive approach for accounts 61-90 days overdue',
      allowedActions: ['call', 'visit', 'legal filing'],
      priorityLevel: 3,
      criteria: {
        minOverdueDays: 61,
        maxOverdueDays: 90,
        minAmount: 1000,
        productTypes: ['loan', 'overdraft'],
      },
      createdBy: teamLeads[1]?.id || 'user-2',
      createdOn: new Date(2023, 0, 20),
      isActive: true,
    },
    {
      id: 'strategy-4',
      name: 'High-Value Default',
      description: 'Strategy for high-value loans in default',
      allowedActions: ['visit', 'legal filing'],
      priorityLevel: 4,
      criteria: {
        minOverdueDays: 91,
        minAmount: 10000,
        productTypes: ['loan'],
      },
      createdBy: teamLeads[1]?.id || 'user-2',
      createdOn: new Date(2023, 1, 5),
      isActive: true,
    },
  ];
};

// Generate tasks based on loans and strategies
export const generateTasks = (loans: Loan[], users: User[], strategies: CollectionStrategy[]): Task[] => {
  const agents = users.filter(user => user.role === 'agent');
  const tasks: Task[] = [];
  
  loans.forEach(loan => {
    if (loan.status === 'overdue' || loan.status === 'default') {
      // Find applicable strategy
      const overdueDays = loan.statusHistory
        .filter(h => h.status === 'overdue' || h.status === 'default')
        .reduce((max, h) => Math.max(max, h.daysOverdue || 0), 0);
      
      const strategy = strategies.find(s => {
        return (!s.criteria.minOverdueDays || overdueDays >= s.criteria.minOverdueDays) &&
               (!s.criteria.maxOverdueDays || overdueDays <= s.criteria.maxOverdueDays) &&
               (!s.criteria.minAmount || loan.outstandingAmount >= s.criteria.minAmount) &&
               (!s.criteria.maxAmount || loan.outstandingAmount <= s.criteria.maxAmount) &&
               (!s.criteria.productTypes || s.criteria.productTypes.includes(loan.productType));
      });
      
      if (strategy) {
        // Create 1-3 tasks per loan
        const taskCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < taskCount; i++) {
          const actionType = strategy.allowedActions[Math.floor(Math.random() * strategy.allowedActions.length)];
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7) + 1);
          
          tasks.push({
            id: `task-${loan.id}-${i}`,
            loanId: loan.id,
            customerId: loan.customerId,
            assignedTo: agents[Math.floor(Math.random() * agents.length)].id,
            taskType: actionType,
            dueDate,
            priority: ['low', 'medium', 'high', 'urgent'][Math.min(Math.floor(overdueDays / 30), 3) as number] as 'low' | 'medium' | 'high' | 'urgent',
            status: Math.random() > 0.7 ? 'completed' : (Math.random() > 0.5 ? 'in progress' : 'pending'),
            notes: `Follow up on ${actionType} for loan ${loan.id}`,
            strategyId: strategy.id,
          });
        }
      }
    }
  });
  
  return tasks;
};

// Generate collection actions
export const generateActions = (loans: Loan[], users: User[], tasks: Task[]): CollectionAction[] => {
  const agents = users.filter(user => user.role === 'agent');
  const actionTypes: ActionType[] = ['call', 'email', 'SMS', 'visit', 'legal filing'];
  const outcomes: ActionOutcome[] = ['successful', 'unsuccessful', 'no answer', 'promise to pay', 'dispute', 'cannot pay'];
  
  const actions: CollectionAction[] = [];
  
  // First, create actions for completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  completedTasks.forEach(task => {
    const loan = loans.find(l => l.id === task.loanId);
    if (loan) {
      const agent = users.find(u => u.id === task.assignedTo) || agents[Math.floor(Math.random() * agents.length)];
      
      actions.push({
        id: `action-task-${task.id}`,
        loanId: task.loanId,
        customerId: task.customerId,
        type: task.taskType,
        date: task.dueDate,
        agentId: agent.id,
        agentName: agent.name,
        outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
        notes: Math.random() > 0.3 ? `Completed task: ${task.notes}` : undefined,
        followUpDate: Math.random() > 0.7 ? new Date(task.dueDate.getTime() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000) : undefined,
        gpsLocation: task.taskType === 'visit' ? {
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.006 + (Math.random() - 0.5) * 0.1,
        } : undefined,
      });
    }
  });
  
  // Then add some random historical actions
  loans.forEach(loan => {
    if (loan.status !== 'current' && loan.status !== 'closed') {
      const actionCount = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < actionCount; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const actionType = actionTypes[Math.floor(Math.random() * (actionTypes.length - (Math.random() > 0.8 ? 0 : 1)))]; // Less legal filings
        const date = new Date(new Date().getTime() - (Math.floor(Math.random() * 60) + 1) * 24 * 60 * 60 * 1000);
        
        actions.push({
          id: `action-rand-${loan.id}-${i}`,
          loanId: loan.id,
          customerId: loan.customerId,
          type: actionType,
          date,
          agentId: agent.id,
          agentName: agent.name,
          outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
          notes: Math.random() > 0.5 ? `Follow-up on ${loan.productType}. Customer ${Math.random() > 0.5 ? 'was cooperative' : 'refused to cooperate'}.` : undefined,
          followUpDate: Math.random() > 0.7 ? new Date(date.getTime() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000) : undefined,
          gpsLocation: actionType === 'visit' ? {
            latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: -74.006 + (Math.random() - 0.5) * 0.1,
          } : undefined,
        });
      }
    }
  });
  
  return actions;
};

// Generate payments
export const generatePayments = (loans: Loan[]): Payment[] => {
  const payments: Payment[] = [];
  const paymentMethods = ['cash', 'bank transfer', 'check', 'direct debit', 'credit card'];
  
  loans.forEach(loan => {
    // Create payments for paid due amounts
    loan.dueAmounts.filter(due => due.isPaid).forEach(due => {
      payments.push({
        id: `payment-${due.id}`,
        loanId: loan.id,
        amount: due.totalAmount,
        date: due.paidOn!,
        method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)] as 'cash' | 'bank transfer' | 'check' | 'direct debit' | 'credit card',
        referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`,
      });
    });
    
    // Add some partial payments for overdue amounts
    if (loan.status === 'overdue' || loan.status === 'default') {
      const unpaidDues = loan.dueAmounts.filter(due => !due.isPaid);
      
      if (unpaidDues.length > 0 && Math.random() > 0.5) {
        const due = unpaidDues[0];
        const partialAmount = Math.floor(due.totalAmount * (Math.random() * 0.5 + 0.1));
        
        payments.push({
          id: `payment-partial-${due.id}`,
          loanId: loan.id,
          amount: partialAmount,
          date: new Date(due.dueDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)] as 'cash' | 'bank transfer' | 'check' | 'direct debit' | 'credit card',
          referenceNumber: `REF-PARTIAL-${Math.floor(Math.random() * 1000000)}`,
        });
      }
    }
  });
  
  return payments;
};

// Generate all mock data
export const generateMockData = () => {
  const users = generateUsers(10);
  const customers = generateCustomers(20);
  const loans = generateLoans(customers);
  const strategies = generateStrategies(users);
  const tasks = generateTasks(loans, users, strategies);
  const actions = generateActions(loans, users, tasks);
  const payments = generatePayments(loans);
  
  return { users, customers, loans, strategies, tasks, actions, payments };
};

// Initialize mock data
export const mockData = generateMockData();
