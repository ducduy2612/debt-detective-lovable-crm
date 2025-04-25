
import { 
  Customer, Loan, Payment, Case, ActionRecord, Agent, Task,
  Phone, Address, Email, Collateral, ActionType, ActionSubType, ActionResultType, Team
} from '@/types/crm';

// Generate today's date and some relative dates
const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(today.getMonth() - 1);

const twoMonthsAgo = new Date(today);
twoMonthsAgo.setMonth(today.getMonth() - 2);

const threeMonthsAgo = new Date(today);
threeMonthsAgo.setMonth(today.getMonth() - 3);

const sixMonthsAgo = new Date(today);
sixMonthsAgo.setMonth(today.getMonth() - 6);

const oneYearAgo = new Date(today);
oneYearAgo.setFullYear(today.getFullYear() - 1);

const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);

// Sample data that follows our new type definitions
export const mockData = {
  customers: [
    {
      id: 'cust-001',
      cif: 'CIF001',
      type: 'INDIVIDUAL' as const,
      name: 'John Smith',
      dateOfBirth: new Date('1980-05-15'),
      nationalId: '123-45-6789',
      gender: 'MALE',
      segment: 'RETAIL',
      status: 'ACTIVE' as const,
      phoneNumbers: [
        {
          id: 'phone-001',
          customerId: 'cust-001',
          type: 'MOBILE' as const,
          number: '+1234567890',
          isPrimary: true,
          isVerified: true,
          verificationDate: oneMonthAgo,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: oneMonthAgo,
          isEditable: true
        },
        {
          id: 'phone-002',
          customerId: 'cust-001',
          type: 'HOME' as const,
          number: '+1987654321',
          isPrimary: false,
          isVerified: false,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: oneYearAgo,
          isEditable: true
        }
      ],
      addresses: [
        {
          id: 'addr-001',
          customerId: 'cust-001',
          type: 'HOME' as const,
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          district: '10001',
          country: 'US',
          isPrimary: true,
          isVerified: true,
          verificationDate: sixMonthsAgo,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: sixMonthsAgo,
          isEditable: true
        }
      ],
      emails: [
        {
          id: 'email-001',
          customerId: 'cust-001',
          address: 'john.smith@example.com',
          isPrimary: true,
          isVerified: true,
          verificationDate: oneMonthAgo,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: oneMonthAgo,
          isEditable: true
        }
      ],
      loans: [],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: oneYearAgo,
      updatedAt: oneYearAgo,
      isEditable: true
    },
    {
      id: 'cust-002',
      cif: 'CIF002',
      type: 'INDIVIDUAL' as const,
      name: 'Jane Doe',
      dateOfBirth: new Date('1985-02-20'),
      nationalId: '987-65-4321',
      gender: 'FEMALE',
      segment: 'RETAIL',
      status: 'ACTIVE' as const,
      phoneNumbers: [
        {
          id: 'phone-003',
          customerId: 'cust-002',
          type: 'MOBILE' as const,
          number: '+1555123456',
          isPrimary: true,
          isVerified: true,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: oneMonthAgo,
          isEditable: true
        }
      ],
      addresses: [
        {
          id: 'addr-002',
          customerId: 'cust-002',
          type: 'HOME' as const,
          addressLine1: '456 Oak Ave',
          city: 'Chicago',
          state: 'IL',
          district: '60601',
          country: 'US',
          isPrimary: true,
          isVerified: false,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: oneYearAgo,
          isEditable: true
        }
      ],
      emails: [
        {
          id: 'email-002',
          customerId: 'cust-002',
          address: 'jane.doe@example.com',
          isPrimary: true,
          isVerified: true,
          sourceSystem: 'CRM',
          createdBy: 'SYSTEM',
          updatedBy: 'SYSTEM',
          createdAt: oneYearAgo,
          updatedAt: oneYearAgo,
          isEditable: true
        }
      ],
      loans: [],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: oneYearAgo,
      updatedAt: twoMonthsAgo,
      isEditable: true
    }
  ] as Customer[],

  loans: [
    {
      id: 'loan-001',
      customerId: 'cust-001',
      accountNumber: 'ACCT001',
      productType: 'personal loan',
      originalAmount: 15000,
      currency: 'USD',
      disbursementDate: oneYearAgo,
      maturityDate: new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()),
      interestRate: 5.75,
      term: 36,
      paymentFrequency: 'monthly',
      limit: 15000,
      currentBalance: 10200,
      dueAmount: 450,
      minPay: 450,
      nextPaymentDate: nextMonth,
      dpd: 0,
      delinquencyStatus: 'current',
      cases: [],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: oneYearAgo,
      updatedAt: oneMonthAgo,
      isEditable: true
    },
    {
      id: 'loan-002',
      customerId: 'cust-001',
      accountNumber: 'ACCT002',
      productType: 'credit card',
      originalAmount: 5000,
      currency: 'USD',
      disbursementDate: sixMonthsAgo,
      maturityDate: new Date(today.getFullYear() + 4, today.getMonth(), today.getDate()),
      interestRate: 18.99,
      term: 0,
      paymentFrequency: 'monthly',
      limit: 5000,
      currentBalance: 3500,
      dueAmount: 350,
      minPay: 150,
      nextPaymentDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      dpd: 30,
      delinquencyStatus: 'overdue',
      cases: [],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: sixMonthsAgo,
      updatedAt: oneMonthAgo,
      isEditable: true
    },
    {
      id: 'loan-003',
      customerId: 'cust-002',
      accountNumber: 'ACCT003',
      productType: 'mortgage',
      originalAmount: 250000,
      currency: 'USD',
      disbursementDate: twoMonthsAgo,
      maturityDate: new Date(today.getFullYear() + 30, today.getMonth(), today.getDate()),
      interestRate: 3.5,
      term: 360,
      paymentFrequency: 'monthly',
      limit: 250000,
      currentBalance: 248000,
      dueAmount: 1100,
      minPay: 1100,
      nextPaymentDate: nextMonth,
      dpd: 0,
      delinquencyStatus: 'current',
      cases: [],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      isEditable: true
    }
  ] as Loan[],

  collaterals: [
    {
      id: 'coll-001',
      collateralNumber: 'COL001',
      customerId: 'cust-002',
      loanId: 'loan-003',
      type: 'real estate',
      description: 'Residential property at 456 Oak Ave, Chicago',
      value: 300000,
      valuationDate: twoMonthsAgo,
      propertyType: 'Single family home',
      address: '456 Oak Ave, Chicago, IL 60601',
      size: 2000,
      titleNumber: 'T123456',
      valuations: [
        {
          amount: 300000,
          date: twoMonthsAgo,
          appraiser: 'City Appraisers Inc.'
        }
      ],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      isEditable: true
    },
    {
      id: 'coll-002',
      collateralNumber: 'COL002',
      customerId: 'cust-001',
      loanId: 'loan-001',
      type: 'vehicle',
      description: '2021 Toyota Camry',
      value: 25000,
      valuationDate: oneYearAgo,
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      vin: 'ABC123456DEF78901',
      licensePlate: 'XYZ-123',
      valuations: [
        {
          amount: 27000,
          date: oneYearAgo,
          appraiser: 'Auto Valuations LLC'
        },
        {
          amount: 25000,
          date: sixMonthsAgo,
          appraiser: 'Auto Valuations LLC'
        }
      ],
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: oneYearAgo,
      updatedAt: sixMonthsAgo,
      isEditable: true
    }
  ] as Collateral[],

  cases: [
    {
      id: 'case-001',
      loanId: 'loan-002',
      caseNumber: 'CS001',
      status: 'OPEN',
      priority: 'MEDIUM',
      openDate: oneMonthAgo,
      actions: [],
      payments: []
    },
  ] as Case[],

  actions: [
    {
      id: 'action-001',
      caseId: 'case-001',
      type: ActionType.CALL,
      subtype: ActionSubType.CALL_OUTBOUND,
      actionResult: ActionResultType.PROMISE_TO_PAY,
      actionDate: oneMonthAgo,
      notes: 'Customer promised to pay by next Friday',
      createdAt: oneMonthAgo,
      updatedAt: oneMonthAgo,
      createdBy: 'agent-001',
      updatedBy: 'agent-001'
    },
    {
      id: 'action-002',
      caseId: 'case-001',
      type: ActionType.SMS,
      subtype: ActionSubType.SMS_REMINDER,
      actionResult: ActionResultType.COMPLETED,
      actionDate: new Date(oneMonthAgo.getTime() + 2 * 24 * 60 * 60 * 1000),
      notes: 'Payment reminder sent',
      createdAt: new Date(oneMonthAgo.getTime() + 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(oneMonthAgo.getTime() + 2 * 24 * 60 * 60 * 1000),
      createdBy: 'agent-001',
      updatedBy: 'agent-001'
    }
  ] as ActionRecord[],

  payments: [
    {
      id: 'payment-001',
      loanId: 'loan-001',
      amount: 450,
      currency: 'USD',
      paymentDate: threeMonthsAgo,
      paymentMethod: 'bank transfer',
      referenceNumber: 'TRX12345',
      status: 'COMPLETED',
      principalAmount: 350,
      interestAmount: 100,
      feesAmount: 0,
      penaltyAmount: 0,
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: threeMonthsAgo,
      updatedAt: threeMonthsAgo,
      isEditable: false
    },
    {
      id: 'payment-002',
      loanId: 'loan-001',
      amount: 450,
      currency: 'USD',
      paymentDate: twoMonthsAgo,
      paymentMethod: 'credit card',
      referenceNumber: 'TRX12346',
      status: 'COMPLETED',
      principalAmount: 355,
      interestAmount: 95,
      feesAmount: 0,
      penaltyAmount: 0,
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: twoMonthsAgo,
      updatedAt: twoMonthsAgo,
      isEditable: false
    },
    {
      id: 'payment-003',
      loanId: 'loan-001',
      amount: 450,
      currency: 'USD',
      paymentDate: oneMonthAgo,
      paymentMethod: 'bank transfer',
      referenceNumber: 'TRX12347',
      status: 'COMPLETED',
      principalAmount: 360,
      interestAmount: 90,
      feesAmount: 0,
      penaltyAmount: 0,
      sourceSystem: 'CRM',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
      createdAt: oneMonthAgo,
      updatedAt: oneMonthAgo,
      isEditable: false
    }
  ] as Payment[],

  agents: [
    {
      id: 'agent-001',
      employeeId: 'EMP001',
      name: 'Michael Rodriguez',
      email: 'michael.r@collect.com',
      phone: '+1234567000',
      type: 'AGENT',
      team: Team.EARLY_STAGE_CALL,
      isActive: true,
      cases: [],
      actions: [],
      createdAt: oneYearAgo,
      updatedAt: oneMonthAgo
    },
    {
      id: 'agent-002',
      employeeId: 'EMP002',
      name: 'Sarah Johnson',
      email: 'sarah.j@collect.com',
      phone: '+1234567001',
      type: 'SUPERVISOR',
      team: Team.SUPERVISOR,
      isActive: true,
      cases: [],
      actions: [],
      createdAt: oneYearAgo,
      updatedAt: threeMonthsAgo
    }
  ] as Agent[],

  tasks: [
    {
      id: 'task-001',
      customerId: 'cust-001',
      loanId: 'loan-002',
      taskType: 'call',
      dueDate: nextMonth,
      priority: 'high',
      status: 'pending',
      assignedTo: 'agent-001',
      notes: 'Follow up on payment promise'
    },
    {
      id: 'task-002',
      customerId: 'cust-002',
      taskType: 'visit',
      dueDate: new Date(nextMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      status: 'pending',
      assignedTo: 'agent-001',
      notes: 'Verification of residential address'
    }
  ] as Task[]
};
