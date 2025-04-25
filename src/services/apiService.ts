
import { 
  Customer, Loan, Case, ActionRecord, Collateral, Payment, 
  Agent, CustomerCase, CustomerCaseAction, ReferenceCustomer,
  Phone, Address, Email, LoanCollateral, CustomerView
} from "@/types/crm";
import { toast } from "@/components/ui/sonner";

// Base URL for API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic API error handler
const handleApiError = (error: any, defaultMessage: string): never => {
  console.error('API Error:', error);
  const message = error.message || defaultMessage;
  toast.error(message);
  throw new Error(message);
};

// API Request Headers
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };
};

// Generic fetch function
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: getHeaders(),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch data from API');
  }
}

// Customer API functions
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    console.log('Fetching customers from API');
    // Currently using mock data until API is available
    return mockData.customers;
    // When API is implemented:
    // return await fetchApi<Customer[]>('/customers');
  } catch (error) {
    toast.error('Failed to fetch customers');
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const fetchCustomer = async (id: string): Promise<Customer | null> => {
  try {
    console.log(`Fetching customer ${id} from API`);
    // Currently using mock data until API is available
    const customer = mockData.customers.find(c => c.id === id);
    return customer || null;
    // When API is implemented:
    // return await fetchApi<Customer>(`/customers/${id}`);
  } catch (error) {
    toast.error('Failed to fetch customer details');
    console.error('Error fetching customer:', error);
    return null;
  }
};

export const updateCustomerPhone = async (customerId: string, phoneId: string, phone: Partial<Phone>): Promise<Phone | null> => {
  try {
    console.log(`Updating phone ${phoneId} for customer ${customerId}`);
    // Mock implementation
    return null;
    // When API is implemented:
    // return await fetchApi<Phone>(`/customers/${customerId}/phones/${phoneId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(phone),
    // });
  } catch (error) {
    toast.error('Failed to update phone');
    console.error('Error updating phone:', error);
    return null;
  }
};

export const addCustomerPhone = async (customerId: string, phone: Omit<Phone, 'id' | 'customerId'>): Promise<Phone | null> => {
  try {
    console.log(`Adding phone for customer ${customerId}`);
    // Mock implementation
    return null;
    // When API is implemented:
    // return await fetchApi<Phone>(`/customers/${customerId}/phones`, {
    //   method: 'POST',
    //   body: JSON.stringify(phone),
    // });
  } catch (error) {
    toast.error('Failed to add phone');
    console.error('Error adding phone:', error);
    return null;
  }
};

// Loan API functions
export const fetchLoans = async (): Promise<Loan[]> => {
  try {
    console.log('Fetching loans from API');
    // Currently using mock data until API is available
    return mockData.loans;
    // When API is implemented:
    // return await fetchApi<Loan[]>('/loans');
  } catch (error) {
    toast.error('Failed to fetch loans');
    console.error('Error fetching loans:', error);
    return [];
  }
};

export const fetchLoan = async (id: string): Promise<Loan | null> => {
  try {
    console.log(`Fetching loan ${id} from API`);
    // Currently using mock data until API is available
    const loan = mockData.loans.find(l => l.id === id);
    return loan || null;
    // When API is implemented:
    // return await fetchApi<Loan>(`/loans/${id}`);
  } catch (error) {
    toast.error('Failed to fetch loan details');
    console.error('Error fetching loan:', error);
    return null;
  }
};

export const fetchLoansByCustomer = async (customerId: string): Promise<Loan[]> => {
  try {
    console.log(`Fetching loans for customer ${customerId}`);
    // Currently using mock data until API is available
    return mockData.loans.filter(l => l.customerId === customerId);
    // When API is implemented:
    // return await fetchApi<Loan[]>(`/customers/${customerId}/loans`);
  } catch (error) {
    toast.error('Failed to fetch customer loans');
    console.error('Error fetching customer loans:', error);
    return [];
  }
};

// Case API functions
export const fetchCases = async (): Promise<Case[]> => {
  try {
    console.log('Fetching cases from API');
    // Currently using mock data until API is available
    return mockData.cases;
    // When API is implemented:
    // return await fetchApi<Case[]>('/cases');
  } catch (error) {
    toast.error('Failed to fetch cases');
    console.error('Error fetching cases:', error);
    return [];
  }
};

export const fetchCase = async (id: string): Promise<Case | null> => {
  try {
    console.log(`Fetching case ${id} from API`);
    // Currently using mock data until API is available
    const caseItem = mockData.cases.find(c => c.id === id);
    return caseItem || null;
    // When API is implemented:
    // return await fetchApi<Case>(`/cases/${id}`);
  } catch (error) {
    toast.error('Failed to fetch case details');
    console.error('Error fetching case:', error);
    return null;
  }
};

// Action API functions
export const fetchActions = async (): Promise<ActionRecord[]> => {
  try {
    console.log('Fetching actions from API');
    // Currently using mock data until API is available
    return mockData.actions;
    // When API is implemented:
    // return await fetchApi<ActionRecord[]>('/actions');
  } catch (error) {
    toast.error('Failed to fetch actions');
    console.error('Error fetching actions:', error);
    return [];
  }
};

export const createAction = async (action: Omit<ActionRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<ActionRecord | null> => {
  try {
    console.log('Creating new action');
    // Mock implementation
    return null;
    // When API is implemented:
    // return await fetchApi<ActionRecord>('/actions', {
    //   method: 'POST',
    //   body: JSON.stringify(action),
    // });
  } catch (error) {
    toast.error('Failed to create action');
    console.error('Error creating action:', error);
    return null;
  }
};

// Payment API functions
export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    console.log('Fetching payments from API');
    // Currently using mock data until API is available
    return mockData.payments;
    // When API is implemented:
    // return await fetchApi<Payment[]>('/payments');
  } catch (error) {
    toast.error('Failed to fetch payments');
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const fetchPaymentsByLoan = async (loanId: string): Promise<Payment[]> => {
  try {
    console.log(`Fetching payments for loan ${loanId}`);
    // Currently using mock data until API is available
    return mockData.payments.filter(p => p.loanId === loanId);
    // When API is implemented:
    // return await fetchApi<Payment[]>(`/loans/${loanId}/payments`);
  } catch (error) {
    toast.error('Failed to fetch loan payments');
    console.error('Error fetching loan payments:', error);
    return [];
  }
};

// Agent API functions
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    console.log('Fetching agents from API');
    // Currently using mock data until API is available
    return mockData.agents;
    // When API is implemented:
    // return await fetchApi<Agent[]>('/agents');
  } catch (error) {
    toast.error('Failed to fetch agents');
    console.error('Error fetching agents:', error);
    return [];
  }
};

// Task API functions
export const fetchTasks = async (): Promise<any[]> => {
  try {
    console.log('Fetching tasks from API');
    // Currently using mock data until API is available
    return mockData.tasks;
    // When API is implemented:
    // return await fetchApi<any[]>('/tasks');
  } catch (error) {
    toast.error('Failed to fetch tasks');
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Collateral API functions
export const fetchCollaterals = async (): Promise<Collateral[]> => {
  try {
    console.log('Fetching collaterals from API');
    // Currently using mock data until API is available
    return mockData.collaterals;
    // When API is implemented:
    // return await fetchApi<Collateral[]>('/collaterals');
  } catch (error) {
    toast.error('Failed to fetch collaterals');
    console.error('Error fetching collaterals:', error);
    return [];
  }
};

export const fetchCollateralsByCustomer = async (customerId: string): Promise<Collateral[]> => {
  try {
    console.log(`Fetching collaterals for customer ${customerId}`);
    // Currently using mock data until API is available
    return mockData.collaterals.filter(c => c.customerId === customerId);
    // When API is implemented:
    // return await fetchApi<Collateral[]>(`/customers/${customerId}/collaterals`);
  } catch (error) {
    toast.error('Failed to fetch customer collaterals');
    console.error('Error fetching customer collaterals:', error);
    return [];
  }
};

// Customer Case API functions
export const fetchCustomerCases = async (): Promise<CustomerCase[]> => {
  try {
    console.log('Fetching customer cases from API');
    // Currently using mock data until API is available
    return mockData.customerCases;
    // When API is implemented:
    // return await fetchApi<CustomerCase[]>('/customer-cases');
  } catch (error) {
    toast.error('Failed to fetch customer cases');
    console.error('Error fetching customer cases:', error);
    return [];
  }
};

export const fetchCustomerCasesByCustomer = async (customerId: string): Promise<CustomerCase[]> => {
  try {
    console.log(`Fetching cases for customer ${customerId}`);
    // Currently using mock data until API is available
    return mockData.customerCases.filter(cc => cc.customerId === customerId);
    // When API is implemented:
    // return await fetchApi<CustomerCase[]>(`/customers/${customerId}/customer-cases`);
  } catch (error) {
    toast.error('Failed to fetch customer cases');
    console.error('Error fetching customer cases:', error);
    return [];
  }
};

// Reference Customer API functions
export const fetchReferenceCustomers = async (customerId: string): Promise<ReferenceCustomer[]> => {
  try {
    console.log(`Fetching reference customers for customer ${customerId}`);
    // Currently using mock data until API is available
    return mockData.referenceCustomers.filter(rc => rc.customerId === customerId);
    // When API is implemented:
    // return await fetchApi<ReferenceCustomer[]>(`/customers/${customerId}/references`);
  } catch (error) {
    toast.error('Failed to fetch reference customers');
    console.error('Error fetching reference customers:', error);
    return [];
  }
};

// Users API functions
export const fetchUsers = async (): Promise<any[]> => {
  try {
    console.log('Fetching users from API');
    // Currently using mock data until API is available
    return mockData.users;
    // When API is implemented:
    // return await fetchApi<any[]>('/users');
  } catch (error) {
    toast.error('Failed to fetch users');
    console.error('Error fetching users:', error);
    return [];
  }
};

// Mock data for development (will be removed when real API is available)
export const mockData = {
  customers: [] as Customer[],
  loans: [] as Loan[],
  cases: [] as Case[],
  actions: [] as ActionRecord[],
  payments: [] as Payment[],
  agents: [] as Agent[],
  tasks: [] as any[],
  users: [] as any[],
  collaterals: [] as Collateral[],
  customerCases: [] as CustomerCase[],
  referenceCustomers: [] as ReferenceCustomer[]
};

// Initialize some basic mock data
// This function would be called during app initialization
export const initMockData = () => {
  // Create mock customers
  mockData.customers = Array(10).fill(null).map((_, index) => ({
    id: `cust-${index + 1}`,
    cif: `CIF${100000 + index}`,
    type: index % 5 === 0 ? 'ORGANIZATION' : 'INDIVIDUAL',
    name: index % 5 === 0 ? undefined : `Customer ${index + 1}`,
    companyName: index % 5 === 0 ? `Company ${index + 1}` : undefined,
    segment: ['Premium', 'Standard', 'Business'][index % 3],
    status: 'ACTIVE',
    sourceSystem: 'T24',
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: new Date(2023, 0, 1),
    updatedAt: new Date(),
    isEditable: false,
    phoneNumbers: [
      {
        id: `phone-${index}-1`,
        customerId: `cust-${index + 1}`,
        type: 'MOBILE',
        number: `+84 ${900000000 + index * 10}`,
        isPrimary: true,
        isVerified: true,
        sourceSystem: 'T24',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(2023, 0, 1),
        updatedAt: new Date(),
        isEditable: true
      },
      {
        id: `phone-${index}-2`,
        customerId: `cust-${index + 1}`,
        type: 'HOME',
        number: `+84 ${800000000 + index * 10}`,
        isPrimary: false,
        isVerified: false,
        sourceSystem: 'CRM',
        createdBy: 'agent-1',
        updatedBy: 'agent-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      }
    ],
    addresses: [
      {
        id: `addr-${index}-1`,
        customerId: `cust-${index + 1}`,
        type: 'HOME',
        addressLine1: `${index + 1} Main Street`,
        city: 'Hanoi',
        state: 'Hanoi',
        district: 'Dong Da',
        country: 'Vietnam',
        isPrimary: true,
        isVerified: true,
        sourceSystem: 'T24',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(2023, 0, 1),
        updatedAt: new Date(),
        isEditable: false
      }
    ],
    emails: [
      {
        id: `email-${index}-1`,
        customerId: `cust-${index + 1}`,
        address: `customer${index + 1}@example.com`,
        isPrimary: true,
        isVerified: true,
        sourceSystem: 'T24',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(2023, 0, 1),
        updatedAt: new Date(),
        isEditable: false
      }
    ],
    loans: []
  }));

  // Create mock loans
  mockData.loans = Array(20).fill(null).map((_, index) => {
    const customerId = `cust-${(index % 10) + 1}`;
    const loan: Loan = {
      id: `loan-${index + 1}`,
      customerId,
      accountNumber: `LOAN${200000 + index}`,
      productType: ['MORTGAGE', 'PERSONAL', 'AUTO', 'CREDIT_CARD', 'BUSINESS'][index % 5],
      originalAmount: 50000000 + (index * 10000000),
      currency: 'VND',
      disbursementDate: new Date(2022, 0, 1),
      maturityDate: new Date(2027, 0, 1),
      interestRate: 8 + (index % 5),
      term: 60,
      paymentFrequency: 'MONTHLY',
      limit: index % 2 === 0 ? 100000000 : 0,
      currentBalance: 40000000 - (index * 2000000),
      dueAmount: 2000000,
      minPay: 1000000,
      nextPaymentDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      dpd: index % 30,
      delinquencyStatus: index % 30 > 15 ? 'OVERDUE' : 'CURRENT',
      sourceSystem: 'T24',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(2022, 0, 1),
      updatedAt: new Date(),
      isEditable: false,
      cases: []
    };
    return loan;
  });

  // Link loans to customers
  mockData.customers.forEach(customer => {
    customer.loans = mockData.loans.filter(loan => loan.customerId === customer.id);
  });

  // Create mock cases
  mockData.cases = Array(15).fill(null).map((_, index) => {
    const loanId = `loan-${(index % 20) + 1}`;
    return {
      id: `case-${index + 1}`,
      loanId,
      caseNumber: `CASE${300000 + index}`,
      status: index % 4 === 0 ? 'CLOSED' : 'OPEN',
      priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][index % 4],
      openDate: new Date(2023, 0, 1),
      closeDate: index % 4 === 0 ? new Date() : undefined,
      actions: [],
      payments: []
    };
  });

  // Link cases to loans
  mockData.loans.forEach(loan => {
    loan.cases = mockData.cases.filter(c => c.loanId === loan.id);
  });

  // Create mock agents
  mockData.agents = Array(5).fill(null).map((_, index) => ({
    id: `agent-${index + 1}`,
    employeeId: `EMP${100 + index}`,
    name: `Agent ${index + 1}`,
    email: `agent${index + 1}@vpbank.com.vn`,
    phone: `+84 ${900100000 + index}`,
    type: index === 0 ? 'ADMIN' : (index === 1 ? 'SUPERVISOR' : 'AGENT'),
    team: ['EARLY_STAGE_CALL', 'MID_STAGE_FIELD', 'LATE_STAGE_CALL'][index % 3],
    isActive: true,
    createdAt: new Date(2022, 0, 1),
    updatedAt: new Date(),
    cases: [],
    actions: []
  }));

  // Create mock actions
  mockData.actions = Array(30).fill(null).map((_, index) => {
    const caseId = `case-${(index % 15) + 1}`;
    const agentId = `agent-${(index % 5) + 1}`;
    const agent = mockData.agents.find(a => a.id === agentId)!;
    return {
      id: `action-${index + 1}`,
      caseId,
      type: ['CALL', 'SMS', 'EMAIL', 'VISIT'][index % 4],
      subtype: index % 2 === 0 ? 'CALL_OUTBOUND' : 'CALL_INBOUND',
      actionResult: index % 3 === 0 ? 'PROMISE_TO_PAY' : (index % 3 === 1 ? 'LEFT_MESSAGE' : 'NO_RESPONSE'),
      actionDate: new Date(new Date().setDate(new Date().getDate() - index)),
      notes: `Action notes for action ${index + 1}`,
      createdAt: new Date(new Date().setDate(new Date().getDate() - index)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - index)),
      createdBy: agentId,
      updatedBy: agentId
    };
  });

  // Link actions to agents and cases
  mockData.agents.forEach(agent => {
    agent.actions = mockData.actions.filter(a => a.createdBy === agent.id);
  });

  mockData.cases.forEach(caseItem => {
    caseItem.actions = mockData.actions.filter(a => a.caseId === caseItem.id);
  });

  // Create mock payments
  mockData.payments = Array(25).fill(null).map((_, index) => {
    const loanId = `loan-${(index % 20) + 1}`;
    const caseId = index % 3 === 0 ? `case-${(index % 15) + 1}` : undefined;
    return {
      id: `payment-${index + 1}`,
      loanId,
      caseId,
      amount: 2000000 + (index * 100000),
      currency: 'VND',
      paymentDate: new Date(new Date().setDate(new Date().getDate() - (index * 30))),
      paymentMethod: ['bank transfer', 'cash', 'credit card'][index % 3],
      referenceNumber: `REF${400000 + index}`,
      status: 'COMPLETED',
      principalAmount: 1500000 + (index * 80000),
      interestAmount: 400000 + (index * 15000),
      feesAmount: 100000,
      penaltyAmount: 0,
      sourceSystem: 'T24',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(new Date().setDate(new Date().getDate() - (index * 30))),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - (index * 30))),
      isEditable: false
    };
  });

  // Link payments to cases
  mockData.cases.forEach(caseItem => {
    caseItem.payments = mockData.payments.filter(p => p.caseId === caseItem.id);
  });

  // Create mock collaterals
  mockData.collaterals = Array(15).fill(null).map((_, index) => {
    const customerId = `cust-${(index % 10) + 1}`;
    return {
      id: `collateral-${index + 1}`,
      collateralNumber: `COLL${500000 + index}`,
      customerId,
      type: index % 2 === 0 ? 'REAL_ESTATE' : 'VEHICLE',
      description: index % 2 === 0 ? 'Residential property' : 'Personal vehicle',
      value: 500000000 + (index * 100000000),
      valuationDate: new Date(2022, 6, 1),
      propertyType: index % 2 === 0 ? 'APARTMENT' : undefined,
      address: index % 2 === 0 ? `${index + 1} Property Street, Hanoi` : undefined,
      make: index % 2 !== 0 ? 'Toyota' : undefined,
      model: index % 2 !== 0 ? 'Camry' : undefined,
      year: index % 2 !== 0 ? 2020 : undefined,
      sourceSystem: 'T24',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(2022, 0, 1),
      updatedAt: new Date(),
      isEditable: false
    };
  });

  // Create mock loan-collateral relationships
  mockData.loanCollaterals = Array(10).fill(null).map((_, index) => {
    const loanId = `loan-${(index * 2) + 1}`; // Only even indexed loans have collateral
    const collateralId = `collateral-${index + 1}`;
    return {
      id: `loan-collateral-${index + 1}`,
      loanId,
      collateralId,
      createdAt: new Date(2022, 0, 1),
      updatedAt: new Date(),
      sourceSystem: 'T24'
    };
  });

  // Mock customer cases
  mockData.customerCases = Array(10).fill(null).map((_, index) => {
    const customerId = `cust-${index + 1}`;
    return {
      id: `customer-case-${index + 1}`,
      customerId,
      assignedCallAgentId: index % 3 === 0 ? undefined : `agent-${(index % 3) + 1}`,
      assignedFieldAgentId: index % 4 === 0 ? undefined : `agent-${(index % 3) + 2}`,
      customerStatus: ['COOPERATIVE', 'PARTIALLY_COOPERATIVE', 'UNCOOPERATIVE'][index % 3],
      collateralStatus: ['SECURED', 'AT_RISK', 'NOT_APPLICABLE'][index % 3],
      processingStateStatus: ['NEW', 'IN_PROGRESS', 'PENDING_CUSTOMER'][index % 3],
      lendingViolationStatus: ['NONE', 'PAYMENT_DELAY', 'MULTIPLE'][index % 3],
      recoveryAbilityStatus: ['HIGH', 'MEDIUM', 'LOW'][index % 3],
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(),
      actions: []
    };
  });

  // Mock customer case actions
  let customerCaseActions: CustomerCaseAction[] = [];
  mockData.customerCases.forEach((customerCase, index) => {
    const actions = Array(3).fill(null).map((_, actionIndex) => ({
      id: `customer-case-action-${index}-${actionIndex + 1}`,
      customerCaseId: customerCase.id,
      actionDate: new Date(new Date().setDate(new Date().getDate() - (actionIndex * 7))),
      actionType: ['CALL', 'VISIT', 'PAYMENT_ARRANGEMENT'][actionIndex % 3],
      notes: `Action notes for customer case ${index + 1}, action ${actionIndex + 1}`,
      customerStatus: ['COOPERATIVE', 'PARTIALLY_COOPERATIVE', 'UNCOOPERATIVE'][actionIndex % 3],
      collateralStatus: ['SECURED', 'AT_RISK', 'NOT_APPLICABLE'][actionIndex % 3],
      processingStateStatus: ['NEW', 'IN_PROGRESS', 'PENDING_CUSTOMER'][actionIndex % 3],
      lendingViolationStatus: ['NONE', 'PAYMENT_DELAY', 'MULTIPLE'][actionIndex % 3],
      recoveryAbilityStatus: ['HIGH', 'MEDIUM', 'LOW'][actionIndex % 3],
      createdAt: new Date(new Date().setDate(new Date().getDate() - (actionIndex * 7))),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - (actionIndex * 7))),
      createdBy: `agent-${(actionIndex % 3) + 1}`,
      updatedBy: `agent-${(actionIndex % 3) + 1}`
    }));
    customerCaseActions = [...customerCaseActions, ...actions];
    customerCase.actions = actions;
  });

  // Mock reference customers
  mockData.referenceCustomers = Array(15).fill(null).map((_, index) => {
    const customerId = `cust-${(index % 10) + 1}`;
    return {
      id: `reference-${index + 1}`,
      customerId,
      relationshipType: ['SPOUSE', 'PARENT', 'SIBLING', 'CHILD', 'COLLEAGUE'][index % 5],
      cif: `CIF${900000 + index}`,
      type: 'INDIVIDUAL',
      name: `Reference ${index + 1}`,
      dateOfBirth: new Date(1980, 0, 1),
      gender: index % 2 === 0 ? 'MALE' : 'FEMALE',
      sourceSystem: index % 3 === 0 ? 'CRM' : 'T24',
      createdBy: index % 3 === 0 ? 'agent-1' : 'system',
      updatedBy: index % 3 === 0 ? 'agent-1' : 'system',
      createdAt: new Date(2022, 0, 1),
      updatedAt: new Date(),
      isEditable: index % 3 === 0,
      phoneNumbers: [
        {
          id: `ref-phone-${index}-1`,
          customerId: `reference-${index + 1}`,
          type: 'MOBILE',
          number: `+84 ${700000000 + index * 10}`,
          isPrimary: true,
          isVerified: true,
          sourceSystem: index % 3 === 0 ? 'CRM' : 'T24',
          createdBy: index % 3 === 0 ? 'agent-1' : 'system',
          updatedBy: index % 3 === 0 ? 'agent-1' : 'system',
          createdAt: new Date(2022, 0, 1),
          updatedAt: new Date(),
          isEditable: index % 3 === 0
        }
      ],
      addresses: [],
      emails: []
    };
  });

  // Initialize mock tasks and users for backward compatibility
  mockData.tasks = Array(10).fill(null).map((_, index) => ({
    id: `task-${index + 1}`,
    loanId: `loan-${(index % 20) + 1}`,
    customerId: `cust-${(index % 10) + 1}`,
    assignedTo: `agent-${(index % 5) + 1}`,
    taskType: ['call', 'email', 'SMS', 'visit'][index % 4],
    dueDate: new Date(new Date().setDate(new Date().getDate() + (index % 14))),
    priority: ['low', 'medium', 'high', 'urgent'][index % 4],
    status: ['pending', 'in progress', 'completed', 'cancelled'][index % 4],
    notes: `Task notes ${index + 1}`
  }));

  mockData.users = Array(5).fill(null).map((_, index) => ({
    id: `user-${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@vpbank.com.vn`,
    role: index === 0 ? 'admin' : (index === 1 ? 'team_lead' : 'agent'),
    team: ['East', 'West', 'North', 'South', 'Central'][index % 5]
  }));
};

// Initialize mock data
initMockData();
