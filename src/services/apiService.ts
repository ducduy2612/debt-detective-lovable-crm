
import { supabase } from "@/integrations/supabase/client";
import { 
  Customer, Loan, Collateral, Payment, 
  ActionType, ActionSubType, ActionResultType
} from '@/types/crm';
import {
  CustomerWithLegacyFields,
  LoanWithLegacyFields,
  PaymentWithLegacyFields,
  CollateralWithLegacyFields,
  CollectionAction,
  Task,
  mapToLegacyCustomer,
  mapToLegacyLoan,
  mapToLegacyPayment
} from '@/types/legacyTypes';

// Mock data for placeholder API service
const mockCustomers: CustomerWithLegacyFields[] = [
  {
    id: "C001",
    cif: "CIF001",
    type: "INDIVIDUAL",
    name: "John Doe",
    dateOfBirth: new Date("1985-05-15"),
    nationalId: "ABC123456",
    gender: "M",
    segment: "RETAIL",
    status: "ACTIVE",
    
    // Legacy fields for compatibility
    email: "john.doe@example.com",
    occupation: "Software Engineer",
    income: 85000,
    references: [
      {
        id: "REF001",
        name: "Jane Smith",
        relationship: "Spouse",
        phoneNumbers: ["555-123-4567"],
        email: "jane.smith@example.com"
      }
    ],
    
    // Relationship fields
    phoneNumbers: [
      {
        id: "P001",
        customerId: "C001",
        type: "MOBILE",
        number: "555-123-4567",
        isPrimary: true,
        isVerified: true,
        verificationDate: new Date("2023-01-15"),
        phoneNumber: "555-123-4567",
        isValid: true,
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    addresses: [
      {
        id: "A001",
        customerId: "C001",
        type: "HOME",
        addressLine1: "123 Main St",
        city: "Boston",
        state: "MA",
        district: "02108",
        country: "US",
        isPrimary: true,
        isVerified: true,
        verificationDate: new Date("2023-01-15"),
        address: "123 Main St",
        zipCode: "02108",
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    emails: [
      {
        id: "E001",
        customerId: "C001",
        address: "john.doe@example.com",
        isPrimary: true,
        isVerified: true,
        verificationDate: new Date("2023-01-15"),
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date(),
    isEditable: true
  },
  {
    id: "C002",
    cif: "CIF002",
    type: "INDIVIDUAL",
    name: "Alice Johnson",
    dateOfBirth: new Date("1990-08-20"),
    nationalId: "DEF789012",
    gender: "F",
    segment: "RETAIL",
    status: "ACTIVE",
    
    // Legacy fields for compatibility
    email: "alice.johnson@example.com",
    occupation: "Marketing Manager",
    income: 72000,
    
    // Relationship fields
    phoneNumbers: [
      {
        id: "P002",
        customerId: "C002",
        type: "MOBILE",
        number: "555-987-6543",
        isPrimary: true,
        isVerified: true,
        verificationDate: new Date("2023-02-10"),
        phoneNumber: "555-987-6543",
        isValid: true,
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    addresses: [
      {
        id: "A002",
        customerId: "C002",
        type: "HOME",
        addressLine1: "456 Oak Ave",
        city: "New York",
        state: "NY",
        district: "10001",
        country: "US",
        isPrimary: true,
        isVerified: true,
        verificationDate: new Date("2023-02-10"),
        address: "456 Oak Ave",
        zipCode: "10001",
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    emails: [
      {
        id: "E002",
        customerId: "C002",
        address: "alice.johnson@example.com",
        isPrimary: true,
        isVerified: true,
        verificationDate: new Date("2023-02-10"),
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date(),
    isEditable: true
  }
];

const mockLoans: LoanWithLegacyFields[] = [
  {
    id: "L001",
    customerId: "C001",
    accountNumber: "LOAN12345",
    productType: "MORTGAGE",
    originalAmount: 350000,
    currency: "USD",
    disbursementDate: new Date("2022-01-15"),
    maturityDate: new Date("2052-01-15"),
    interestRate: 3.5,
    term: 360,
    paymentFrequency: "MONTHLY",
    limit: 350000,
    
    currentBalance: 335000,
    dueAmount: 1200,
    minPay: 1200,
    nextPaymentDate: new Date("2023-03-15"),
    dpd: 0,
    delinquencyStatus: "current",
    
    // Legacy fields
    status: "current",
    outstandingAmount: 335000,
    createdOn: new Date("2022-01-15"),
    collaterals: [
      {
        id: "COL001",
        collateralNumber: "CLT12345",
        customerId: "C001",
        loanId: "L001",
        type: "PROPERTY",
        description: "Single family home at 123 Main St",
        value: 450000,
        valuationDate: new Date("2022-01-10"),
        propertyType: "SINGLE_FAMILY",
        address: "123 Main St, Boston, MA",
        size: 2200,
        titleNumber: "TL123456",
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true,
        valuations: [
          {
            amount: 450000,
            date: new Date("2022-01-10"),
            appraiser: "ABC Appraisal Co."
          },
          {
            amount: 475000,
            date: new Date("2023-01-15"),
            appraiser: "ABC Appraisal Co."
          }
        ]
      }
    ],
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date(),
    isEditable: false,
    cases: []
  },
  {
    id: "L002",
    customerId: "C002",
    accountNumber: "LOAN67890",
    productType: "AUTO",
    originalAmount: 35000,
    currency: "USD",
    disbursementDate: new Date("2022-03-20"),
    maturityDate: new Date("2027-03-20"),
    interestRate: 4.2,
    term: 60,
    paymentFrequency: "MONTHLY",
    limit: 35000,
    
    currentBalance: 28000,
    dueAmount: 650,
    minPay: 650,
    nextPaymentDate: new Date("2023-03-20"),
    dpd: 15,
    delinquencyStatus: "overdue",
    
    // Legacy fields
    status: "overdue",
    outstandingAmount: 28000,
    createdOn: new Date("2022-03-20"),
    collaterals: [
      {
        id: "COL002",
        collateralNumber: "CLT67890",
        customerId: "C002",
        loanId: "L002",
        type: "VEHICLE",
        description: "2022 Toyota Camry",
        value: 32000,
        valuationDate: new Date("2022-03-15"),
        make: "Toyota",
        model: "Camry",
        year: 2022,
        vin: "ABC123DEF456GHI78",
        licensePlate: "ABC1234",
        sourceSystem: "CRM",
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true,
        valuations: [
          {
            amount: 32000,
            date: new Date("2022-03-15"),
            appraiser: "XYZ Auto Appraisal"
          },
          {
            amount: 28500,
            date: new Date("2023-02-20"),
            appraiser: "XYZ Auto Appraisal"
          }
        ]
      }
    ],
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date("2022-03-20"),
    updatedAt: new Date(),
    isEditable: false,
    cases: []
  }
];

const mockPayments: PaymentWithLegacyFields[] = [
  {
    id: "PMT001",
    loanId: "L001",
    amount: 1200,
    currency: "USD",
    paymentDate: new Date("2023-02-15"),
    paymentMethod: "direct debit",
    referenceNumber: "REF12345",
    status: "COMPLETED",
    principalAmount: 300,
    interestAmount: 900,
    feesAmount: 0,
    penaltyAmount: 0,
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date(),
    isEditable: false,
    // Legacy fields
    date: new Date("2023-02-15"),
    method: "direct debit"
  },
  {
    id: "PMT002",
    loanId: "L001",
    amount: 1200,
    currency: "USD",
    paymentDate: new Date("2023-01-15"),
    paymentMethod: "credit card",
    referenceNumber: "REF67890",
    status: "COMPLETED",
    principalAmount: 295,
    interestAmount: 905,
    feesAmount: 0,
    penaltyAmount: 0,
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date(),
    isEditable: false,
    // Legacy fields
    date: new Date("2023-01-15"),
    method: "credit card"
  },
  {
    id: "PMT003",
    loanId: "L002",
    amount: 650,
    currency: "USD",
    paymentDate: new Date("2023-02-20"),
    paymentMethod: "bank transfer",
    referenceNumber: "REF24680",
    status: "COMPLETED",
    principalAmount: 485,
    interestAmount: 165,
    feesAmount: 0,
    penaltyAmount: 0,
    sourceSystem: "CRM",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date(),
    isEditable: false,
    // Legacy fields
    date: new Date("2023-02-20"),
    method: "bank transfer"
  }
];

const mockActions: CollectionAction[] = [
  {
    id: "ACT001",
    customerId: "C002",
    loanId: "L002",
    agentId: "A001",
    agentName: "Sarah Wilson",
    type: "call",
    outcome: "promise to pay",
    date: new Date("2023-03-05"),
    notes: "Customer promised to pay the overdue amount by March 10."
  },
  {
    id: "ACT002",
    customerId: "C002",
    loanId: "L002",
    agentId: "A001",
    agentName: "Sarah Wilson",
    type: "SMS",
    outcome: "successful",
    date: new Date("2023-03-06"),
    notes: "Payment reminder SMS sent."
  }
];

const mockTasks: Task[] = [
  {
    id: "T001",
    customerId: "C002",
    loanId: "L002",
    taskType: "call",
    dueDate: new Date("2023-03-10"),
    priority: "high",
    status: "pending",
    assignedTo: "A001",
    notes: "Follow up on payment promise."
  }
];

// API service methods
export const fetchCustomers = async (): Promise<CustomerWithLegacyFields[]> => {
  console.info('Fetching customers from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers);
    }, 500);
  });
};

export const fetchLoans = async (): Promise<LoanWithLegacyFields[]> => {
  console.info('Fetching loans from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLoans);
    }, 500);
  });
};

export const fetchCollaterals = async (loanId?: string): Promise<CollateralWithLegacyFields[]> => {
  console.info('Fetching collaterals from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      let result: CollateralWithLegacyFields[] = [];
      
      mockLoans.forEach(loan => {
        if (!loanId || loan.id === loanId) {
          result = result.concat(loan.collaterals || []);
        }
      });
      
      resolve(result);
    }, 500);
  });
};

export const fetchPayments = async (loanId?: string): Promise<PaymentWithLegacyFields[]> => {
  console.info('Fetching payments from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loanId) {
        resolve(mockPayments.filter(payment => payment.loanId === loanId));
      } else {
        resolve(mockPayments);
      }
    }, 500);
  });
};

export const fetchActions = async (customerId?: string): Promise<CollectionAction[]> => {
  console.info('Fetching actions from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      if (customerId) {
        resolve(mockActions.filter(action => action.customerId === customerId));
      } else {
        resolve(mockActions);
      }
    }, 500);
  });
};

export const fetchTasks = async (assignedTo?: string): Promise<Task[]> => {
  console.info('Fetching tasks from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      if (assignedTo) {
        resolve(mockTasks.filter(task => task.assignedTo === assignedTo));
      } else {
        resolve(mockTasks);
      }
    }, 500);
  });
};

export const createAction = async (action: Omit<CollectionAction, 'id'>): Promise<CollectionAction> => {
  console.info('Creating new action in API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAction: CollectionAction = {
        ...action,
        id: `ACT${Date.now()}`
      };
      
      mockActions.push(newAction);
      resolve(newAction);
    }, 500);
  });
};

export const updateTaskStatus = async (taskId: string, status: Task['status']): Promise<Task> => {
  console.info(`Updating task ${taskId} status to ${status}`);
  
  // This would be replaced with actual API call in production
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = mockTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        reject(new Error(`Task with ID ${taskId} not found`));
        return;
      }
      
      mockTasks[taskIndex] = {
        ...mockTasks[taskIndex],
        status
      };
      
      resolve(mockTasks[taskIndex]);
    }, 500);
  });
};

// Add customer contact information
export const addCustomerContact = async (
  customerId: string,
  phoneNumber: string,
  type: string
): Promise<CustomerWithLegacyFields> => {
  console.info(`Adding phone ${phoneNumber} to customer ${customerId}`);
  
  // This would be replaced with actual API call in production
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
      
      if (customerIndex === -1) {
        reject(new Error(`Customer with ID ${customerId} not found`));
        return;
      }
      
      const newPhone = {
        id: `P${Date.now()}`,
        customerId,
        type: type.toUpperCase(),
        number: phoneNumber,
        isPrimary: mockCustomers[customerIndex].phoneNumbers.length === 0,
        isVerified: false,
        sourceSystem: 'CRM',
        createdBy: 'USER',
        updatedBy: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true,
        // Legacy field
        phoneNumber,
        isValid: true
      };
      
      mockCustomers[customerIndex].phoneNumbers.push(newPhone);
      
      resolve(mockCustomers[customerIndex]);
    }, 500);
  });
};
