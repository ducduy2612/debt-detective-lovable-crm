
// Base interfaces
export interface DataSourceTracking {
  id: string;
  sourceSystem: 'T24' | 'W4' | 'OTHER' | 'CRM';
  sourceId?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isEditable: boolean;
}

// Customer interfaces
export interface Customer extends DataSourceTracking {
  id: string;
  cif: string;
  type: 'INDIVIDUAL' | 'ORGANIZATION';
  
  // For individuals
  name?: string;
  dateOfBirth?: Date;
  nationalId?: string;
  gender?: string;
  
  // For organizations
  companyName?: string;
  registrationNumber?: string;
  taxId?: string;
  
  segment: string;
  status: 'ACTIVE' | 'INACTIVE';
  
  // Relationships
  phoneNumbers: Phone[];
  addresses: Address[];
  emails: Email[];
  loans: Loan[];
}

export interface Phone extends DataSourceTracking {
  id: string;
  customerId: string;
  
  type: 'MOBILE' | 'HOME' | 'WORK' | 'OTHER';
  number: string;
  isPrimary: boolean;
  isVerified: boolean;
  verificationDate?: Date;
}

export interface Address extends DataSourceTracking {
  id: string;
  customerId: string;
  
  type: 'HOME' | 'WORK' | 'BILLING' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  district: string;
  country: string;
  isPrimary: boolean;
  isVerified: boolean;
  verificationDate?: Date;
}

export interface Email extends DataSourceTracking {
  id: string;
  customerId: string;
  
  address: string;
  isPrimary: boolean;
  isVerified: boolean;
  verificationDate?: Date;
}

// Loan interfaces
export interface Loan extends DataSourceTracking {
  id: string;
  customerId: string;
  
  accountNumber: string;
  productType: string;
  originalAmount: number;
  currency: string;
  disbursementDate: Date;
  maturityDate: Date;
  interestRate: number;
  term: number;
  paymentFrequency: string;
  limit: number;
  
  currentBalance: number;
  dueAmount: number;
  minPay: number;
  nextPaymentDate: Date;
  dpd: number;
  delinquencyStatus: string;
  
  // Relationships
  cases: Case[];
}

export interface Collateral extends DataSourceTracking {
  id: string;
  collateralNumber: string;
  customerId: string;
  
  type: string;
  description: string;
  value: number;
  valuationDate: Date;
  
  // For vehicles
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  licensePlate?: string;
  
  // For real estate
  propertyType?: string;
  address?: string;
  size?: number;
  titleNumber?: string;
}

// Case interfaces
export interface Case {
  id: string;
  loanId: string;
  
  caseNumber: string;
  status: 'OPEN' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  openDate: Date;
  closeDate?: Date;
  resolutionCode?: string;
  resolutionNotes?: string;
  
  // Relationships
  actions: ActionRecord[];
  payments: Payment[];
}

export interface ActionRecord {
  id: string;
  caseId: string;
  
  type: string;
  subtype: string;
  actionResult: string;
  actionDate: Date;
  notes: string;
  
  // For calls
  callTraceId?: number;
  
  // For visits
  visitLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Agent {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  
  type: 'AGENT' | 'SUPERVISOR' | 'ADMIN';
  team: string;
  isActive: boolean;
  
  // Relationships
  cases: Case[];
  actions: ActionRecord[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment extends DataSourceTracking {
  id: string;
  loanId: string;
  caseId?: string;
  
  amount: number;
  currency: string;
  paymentDate: Date;
  paymentMethod: string;
  referenceNumber: string;
  
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  statusReason?: string;
  
  // Allocation
  principalAmount: number;
  interestAmount: number;
  feesAmount: number;
  penaltyAmount: number;
}

export interface LoanCollateral {
  id: string;
  loanId: string;
  collateralId: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  sourceSystem: string;
}

// Customer case interfaces
export interface CustomerCase {
  id: string;
  customerId: string;
  
  assignedCallAgentId?: string;
  assignedFieldAgentId?: string;
  
  // Status fields derived from latest CustomerCaseAction
  customerStatus: string;
  collateralStatus: string;
  processingStateStatus: string;
  lendingViolationStatus: string;
  recoveryAbilityStatus: string;
  
  // Relationships
  actions: CustomerCaseAction[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerCaseAction {
  id: string;
  customerCaseId: string;
  
  actionDate: Date;
  actionType: string;
  notes: string;
  
  // Status inputs
  customerStatus: string;
  collateralStatus: string;
  processingStateStatus: string;
  lendingViolationStatus: string;
  recoveryAbilityStatus: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReferenceCustomer extends DataSourceTracking {
  id: string;
  customerId: string;
  relationshipType: string;
  
  cif: string;
  type: 'INDIVIDUAL' | 'ORGANIZATION';
  
  // For individuals
  name?: string;
  dateOfBirth?: Date;
  nationalId?: string;
  gender?: string;
  
  // For organizations
  companyName?: string;
  registrationNumber?: string;
  taxId?: string;
  
  // Relationships
  phoneNumbers: Phone[];
  addresses: Address[];
  emails: Email[];
}

// Enums for dictionaries
export enum PhoneType {
  MOBILE = 'MOBILE',
  HOME = 'HOME',
  WORK = 'WORK',
  EMERGENCY = 'EMERGENCY',
  FAX = 'FAX',
  OTHER = 'OTHER'
}

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  BILLING = 'BILLING',
  MAILING = 'MAILING',
  PROPERTY = 'PROPERTY',
  TEMPORARY = 'TEMPORARY',
  OTHER = 'OTHER'
}

export enum LoanProductType {
  MORTGAGE = 'MORTGAGE',
  AUTO = 'AUTO',
  SECURED_PERSONAL = 'SECURED_PERSONAL',
  PERSONAL = 'PERSONAL',
  EDUCATION = 'EDUCATION',
  BUSINESS = 'BUSINESS',
  CREDIT_CARD = 'CREDIT_CARD',
  OVERDRAFT = 'OVERDRAFT',
  LINE_OF_CREDIT = 'LINE_OF_CREDIT',
  REFINANCE = 'REFINANCE',
  CONSOLIDATION = 'CONSOLIDATION',
  OTHER = 'OTHER'
}

export enum ActionType {
  CALL = 'CALL',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  LETTER = 'LETTER',
  VISIT = 'VISIT',
  MEETING = 'MEETING',
  CASE_REVIEW = 'CASE_REVIEW',
  CASE_ESCALATION = 'CASE_ESCALATION',
  CASE_TRANSFER = 'CASE_TRANSFER',
  PAYMENT_ARRANGEMENT = 'PAYMENT_ARRANGEMENT',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  LEGAL_NOTICE = 'LEGAL_NOTICE',
  LEGAL_FILING = 'LEGAL_FILING',
  NOTE = 'NOTE',
  OTHER = 'OTHER'
}

export enum ActionSubType {
  CALL_OUTBOUND = 'CALL_OUTBOUND',
  CALL_INBOUND = 'CALL_INBOUND',
  CALL_FOLLOWUP = 'CALL_FOLLOWUP',
  SMS_REMINDER = 'SMS_REMINDER',
  SMS_CONFIRMATION = 'SMS_CONFIRMATION',
  SMS_INFORMATION = 'SMS_INFORMATION',
  EMAIL_REMINDER = 'EMAIL_REMINDER',
  EMAIL_STATEMENT = 'EMAIL_STATEMENT',
  EMAIL_LEGAL = 'EMAIL_LEGAL',
  VISIT_SCHEDULED = 'VISIT_SCHEDULED',
  VISIT_UNSCHEDULED = 'VISIT_UNSCHEDULED',
  ARRANGEMENT_NEW = 'ARRANGEMENT_NEW',
  ARRANGEMENT_REVISED = 'ARRANGEMENT_REVISED',
  LEGAL_WARNING = 'LEGAL_WARNING',
  LEGAL_DEMAND = 'LEGAL_DEMAND',
  LEGAL_COURT = 'LEGAL_COURT',
  OTHER = 'OTHER'
}

export enum ActionResultType {
  CONTACTED = 'CONTACTED',
  NOT_CONTACTED = 'NOT_CONTACTED',
  LEFT_MESSAGE = 'LEFT_MESSAGE',
  PROMISE_TO_PAY = 'PROMISE_TO_PAY',
  PAYMENT_MADE = 'PAYMENT_MADE',
  DISPUTE = 'DISPUTE',
  HARDSHIP_CLAIM = 'HARDSHIP_CLAIM',
  REFUSED = 'REFUSED',
  DISCONNECTED = 'DISCONNECTED',
  WRONG_CONTACT = 'WRONG_CONTACT',
  NO_RESPONSE = 'NO_RESPONSE',
  NOT_HOME = 'NOT_HOME',
  ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  OTHER = 'OTHER'
}

export enum Team {
  EARLY_STAGE_CALL = 'EARLY_STAGE_CALL',
  EARLY_STAGE_FIELD = 'EARLY_STAGE_FIELD',
  MID_STAGE_CALL = 'MID_STAGE_CALL',
  MID_STAGE_FIELD = 'MID_STAGE_FIELD',
  LATE_STAGE_CALL = 'LATE_STAGE_CALL',
  LATE_STAGE_FIELD = 'LATE_STAGE_FIELD',
  LEGAL = 'LEGAL',
  RESTRUCTURING = 'RESTRUCTURING',
  SPECIAL_ASSETS = 'SPECIAL_ASSETS',
  HIGH_VALUE = 'HIGH_VALUE',
  SUPERVISOR = 'SUPERVISOR',
  MANAGEMENT = 'MANAGEMENT',
  OTHER = 'OTHER'
}

export enum CustomerStatusType {
  COOPERATIVE = 'COOPERATIVE',
  PARTIALLY_COOPERATIVE = 'PARTIALLY_COOPERATIVE',
  UNCOOPERATIVE = 'UNCOOPERATIVE',
  UNREACHABLE = 'UNREACHABLE',
  DISPUTED = 'DISPUTED',
  BANKRUPT = 'BANKRUPT',
  DECEASED = 'DECEASED',
  LEGAL_REPRESENTATION = 'LEGAL_REPRESENTATION',
  UNKNOWN = 'UNKNOWN'
}

export enum CollateralStatusType {
  SECURED = 'SECURED',
  PARTIALLY_SECURED = 'PARTIALLY_SECURED',
  AT_RISK = 'AT_RISK',
  DAMAGED = 'DAMAGED',
  MISSING = 'MISSING',
  SEIZED = 'SEIZED',
  IN_LIQUIDATION = 'IN_LIQUIDATION',
  LIQUIDATED = 'LIQUIDATED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  UNKNOWN = 'UNKNOWN'
}

export enum ProcessingStateStatusType {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_CUSTOMER = 'PENDING_CUSTOMER',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PENDING_LEGAL = 'PENDING_LEGAL',
  ON_HOLD = 'ON_HOLD',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED'
}

export enum LendingViolationStatusType {
  NONE = 'NONE',
  PAYMENT_DELAY = 'PAYMENT_DELAY',
  COVENANT_BREACH = 'COVENANT_BREACH',
  COLLATERAL_ISSUE = 'COLLATERAL_ISSUE',
  FINANCIAL_REPORTING = 'FINANCIAL_REPORTING',
  MULTIPLE = 'MULTIPLE',
  SEVERE = 'SEVERE',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  RESOLVED = 'RESOLVED',
  UNKNOWN = 'UNKNOWN'
}

export enum RecoveryAbilityStatusType {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  VERY_LOW = 'VERY_LOW',
  REQUIRES_RESTRUCTURING = 'REQUIRES_RESTRUCTURING',
  REQUIRES_LEGAL = 'REQUIRES_LEGAL',
  WRITE_OFF_RECOMMENDED = 'WRITE_OFF_RECOMMENDED',
  UNKNOWN = 'UNKNOWN'
}

// Legacy types for backward compatibility
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

export type ProductType = 'loan' | 'credit card' | 'overdraft';
export type LoanStatus = 'current' | 'overdue' | 'default' | 'legal notice' | 'closed';

export interface CustomerView {
  id: string;
  name: string;
  occupation?: string;
  income?: number;
  phone_numbers: string; // This comes as a JSON string from the view
}
