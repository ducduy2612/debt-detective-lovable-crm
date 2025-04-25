
// Legacy types for backward compatibility with existing components
import { 
  Customer, Loan, Collateral, Payment, 
  Phone, Address, Email,
  DataSourceTracking
} from './crm';

// Legacy interfaces for CustomerTable component
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

export interface CustomerReference {
  id: string;
  name: string;
  relationship: string;
  phoneNumbers: string[];
  email?: string;
  address?: string;
}

export type ProductType = 'loan' | 'credit card' | 'overdraft';
export type LoanStatus = 'current' | 'overdue' | 'default' | 'legal notice' | 'closed';

// Types for dashboard components
export interface CollectionAction {
  id: string;
  customerId: string;
  loanId: string;
  agentId: string;
  agentName: string;
  type: string;
  outcome: string;
  date: Date;
  notes: string;
}

export interface Task {
  id: string;
  customerId: string;
  loanId?: string;
  taskType: string;
  dueDate: Date;
  priority: string;
  status: 'pending' | 'in progress' | 'completed';
  assignedTo: string;
  notes?: string;
}

export interface CollectionStrategy {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

// Extension interfaces to support legacy component fields
export interface LoanWithLegacyFields extends Loan {
  status?: LoanStatus;
  outstandingAmount?: number;
  createdOn?: Date;
  collaterals?: Array<Collateral & { valuations: CollateralValuation[] }>;
}

export interface CustomerWithLegacyFields extends Customer {
  email?: string;
  occupation?: string;
  income?: number;
  references?: CustomerReference[];
}

export interface PhoneWithLegacyFields extends Phone {
  phoneNumber?: string;
}

export interface AddressWithLegacyFields extends Address {
  address?: string;
  zipCode?: string;
}

export interface PaymentWithLegacyFields extends Payment {
  date?: Date;
  method?: string;
}

export interface CollateralWithLegacyFields extends Collateral {
  valuations: CollateralValuation[];
}

export interface CollateralValuation {
  amount: number;
  date: Date;
  appraiser?: string;
}

// Helper functions to map between types
export function mapToLegacyCustomer(customer: Customer): CustomerWithLegacyFields {
  return {
    ...customer,
    email: customer.emails && customer.emails.length > 0 ? customer.emails[0].address : undefined,
    occupation: undefined,
    income: undefined,
    references: []
  };
}

export function mapToLegacyLoan(loan: Loan): LoanWithLegacyFields {
  return {
    ...loan,
    status: loan.delinquencyStatus as LoanStatus,
    outstandingAmount: loan.currentBalance,
    createdOn: loan.createdAt,
    collaterals: []
  };
}

export function mapToLegacyPhone(phone: Phone): PhoneWithLegacyFields {
  return {
    ...phone,
    phoneNumber: phone.number
  };
}

export function mapToLegacyAddress(address: Address): AddressWithLegacyFields {
  return {
    ...address,
    address: address.addressLine1,
    zipCode: address.district
  };
}

export function mapToLegacyPayment(payment: Payment): PaymentWithLegacyFields {
  return {
    ...payment,
    date: payment.paymentDate,
    method: payment.paymentMethod
  };
}
