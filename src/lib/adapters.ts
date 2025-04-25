import {
  Customer, Loan, Payment, Phone, Address, Email,
  ActionType, ActionSubType, ActionResultType, ActionRecord, Agent, Team
} from '@/types/crm';

export const formatPhoneNumber = (phone: Phone): string => {
  return phone.number;
};

export const getDelinquencyStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'current':
      return 'bg-green-500';
    case 'overdue':
      return 'bg-yellow-500';
    case 'default':
      return 'bg-red-500';
    case 'legal notice':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const formatAddress = (address: Address): string => {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.district,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatPaymentDate = (payment: Payment): Date => {
  return payment.paymentDate;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const isPrimaryEmail = (email: Email): boolean => {
  return email.isPrimary;
};

export const getEmailAddress = (customer: Customer): string | undefined => {
  const primaryEmail = customer.emails.find(isPrimaryEmail);
  return primaryEmail?.address;
};

export const getPrimaryPhone = (customer: Customer): Phone | undefined => {
  return customer.phoneNumbers.find(p => p.isPrimary);
};

export const getPrimaryAddress = (customer: Customer): Address | undefined => {
  return customer.addresses.find(a => a.isPrimary);
};

// New helper functions
export const getLoanStatus = (loan: Loan): string => {
  return loan.delinquencyStatus || 'unknown';
};

export const getLoanOutstandingAmount = (loan: Loan): number => {
  return loan.currentBalance;
};

export const getActionDate = (action: ActionRecord): Date => {
  return action.actionDate;
};

export const getPaymentMethod = (payment: Payment): string => {
  return payment.paymentMethod;
};

export const getAgentName = (action: ActionRecord): string => {
  return action.createdBy;
};

export const getAgentId = (action: ActionRecord): string => {
  return action.createdBy;
};

export const getActionOutcome = (action: ActionRecord): string => {
  return action.actionResult;
};

// Add a default implementation for "currentUser" in the context
export const getCurrentAgent = (): Agent => {
  return {
    id: "current-agent",
    employeeId: "EMP001",
    name: "Current Agent",
    email: "current@example.com",
    phone: "123-456-7890",
    type: "AGENT",
    team: Team.EARLY_STAGE_CALL,
    isActive: true,
    cases: [],
    actions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
