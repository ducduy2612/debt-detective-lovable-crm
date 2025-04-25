
// Base interfaces
export interface DataSourceTracking {
  id: string;                 
  sourceSystem: 'T24'|'W4'|'OTHER'|'CRM';
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
  referenceCustomers: ReferenceCustomer[];
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
  loanId: string;
  
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
  
  // Track collateral valuations
  valuations: CollateralValuation[];
}

export interface CollateralValuation {
  amount: number;
  date: Date;
  appraiser?: string;
}

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
  
  actions: ActionRecord[];    
  payments: Payment[];        
}

export interface ActionRecord {
  id: string;                 
  caseId: string;             
  
  type: ActionType;               
  subtype: ActionSubType;           
  actionResult: ActionResultType;       
  actionDate: Date;           
  notes: string;              
  
  callTraceId?: number;      
  
  visitLocation?: {           
    latitude: number;
    longitude: number;
    address?: string;
  };
  
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
  team: Team;               
  isActive: boolean;          
  
  cases: Case[];              
  actions: ActionRecord[];    
  
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
  
  principalAmount: number;    
  interestAmount: number;     
  feesAmount: number;         
  penaltyAmount: number;      
}

export interface CustomerCase {
  id: string;                 // Unique identifier (read-only)
  customerId: string;         // Reference to customer (read-only)
  
  assignedCallAgentId?: string;  // Assigned call agent ID (editable)
  assignedFieldAgentId?: string; // Assigned field agent ID (editable)
  
  // Status fields derived from latest CustomerCaseAction
  customerStatus: string;        // Customer status (read-only)
  collateralStatus: string;      // Collateral status (read-only)
  processingStateStatus: string; // Processing state status (read-only)
  lendingViolationStatus: string; // Lending violation status (read-only)
  recoveryAbilityStatus: string; // Recovery ability status (read-only)
  
  // Relationships
  actions: ActionRecord[]; // Fixed: Changed CustomerCaseAction to ActionRecord
  
  // Metadata
  createdAt: Date;            // Creation timestamp (read-only)
  updatedAt: Date;            // Last update timestamp (read-only)
}

export interface ReferenceCustomer extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  customerId: string;         // Reference to primary customer (read-only)
  relationshipType: string;   // Relationship to primary customer (editable)
  
  cif: string;                // VPBANK CIF (read-only)
  type: 'INDIVIDUAL' | 'ORGANIZATION'; // Customer type (read-only)
  
  // For individuals
  name?: string;              // Name (read-only)
  dateOfBirth?: Date;         // Date of birth (read-only)
  nationalId?: string;        // National ID number (read-only)
  gender?: string;            // Gender (read-only)
  
  // For organizations
  companyName?: string;       // Company name (read-only)
  registrationNumber?: string; // Registration number (read-only)
  taxId?: string;             // Tax ID (read-only)
  
  // Relationships
  phoneNumbers: Phone[];      // Phone numbers (1:N)
  addresses: Address[];       // Addresses (1:N)
  emails: Email[];            // Email (1:N)
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

// Enums
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
