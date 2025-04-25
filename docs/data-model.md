# Data Model

This document outlines the data model for the Collection CRM system, including entity relationships, attributes, and access patterns.

## Entity Relationship Diagram

```mermaid
erDiagram
    Customer ||--o{ Phone : has
    Customer ||--o{ Address : has
    Customer ||--o{ Email : has
    Customer ||--o{ Loan : has
    Customer ||--o{ Collateral : owns
    Customer ||--o{ CustomerCase : has
    Customer ||--o{ ReferenceCustomer : has
    
    Loan ||--o{ Case : has
    Loan }o--o{ Collateral : secured_by
    
    Case ||--o{ ActionRecord : has
    Case ||--o{ Payment : receives
    
    Agent ||--o{ ActionRecord : performs
    Agent ||--o{ Case : assigned_to
    
    CustomerCase ||--o{ CustomerCaseAction : has
    
    LoanCollateral }|--|| Loan : references
    LoanCollateral }|--|| Collateral : references
```

## Entity Definitions

### 0. DataSourceTracking

Base interface for all entities to track data origin and permissions:

```typescript
interface DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  sourceSystem: 'T24'|'W4'|'OTHER'|'CRM'; // Origin system
  sourceId?: string;          // Original ID in source system
  createdBy: string;          // User/system that created
  updatedBy: string;          // User/system that last updated
  createdAt: Date;            // Creation timestamp
  updatedAt: Date;            // Last update timestamp
  isEditable: boolean;        // Whether record can be modified
}
```

### 1. Customer

Represents individuals or organizations with loans.

```typescript
interface Customer extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  cif: string;         // VPBANK CIF (read-only)
  type: 'INDIVIDUAL' | 'ORGANIZATION'; // Customer type (read-only)
  
  // For individuals
  name?: string;         // Name (read-only)
  dateOfBirth?: Date;         // Date of birth (read-only)
  nationalId?: string;        // National ID number (read-only)
  gender?: string;            // Gender(read-only)
  
  // For organizations
  companyName?: string;       // Company name (read-only)
  registrationNumber?: string; // Registration number (read-only)
  taxId?: string;             // Tax ID (read-only)
  
  segment: string;            // Customer segment (read-only)
  status: 'ACTIVE' | 'INACTIVE'; // Status (read-only)
  
  // Relationships
  phoneNumbers: Phone[]; // Phone numbers (1:N)
  addresses: Address[]; // Addresses (1:N)
  emails: Email[]; // Email (1:N)
  loans: Loan[];              // Associated loans (1:N)
  
}
```

### 2. Phone

Represents phone numbers associated with customers.

```typescript
interface Phone extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  customerId: string;         // Reference to customer (read-only)
  
  type: 'MOBILE' | 'HOME' | 'WORK' | 'OTHER'; // Phone type (editable)
  number: string;             // Phone number (editable)
  isPrimary: boolean;         // Whether this is the primary phone (editable)
  isVerified: boolean;        // Whether this phone is verified (editable)
  verificationDate?: Date;    // When the phone was verified (editable)
  
}
```

### 3. Address

Represents physical addresses associated with customers.

```typescript
interface Address extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  customerId: string;         // Reference to customer (read-only)
  
  type: 'HOME' | 'WORK' | 'BILLING' | 'OTHER'; // Address type (editable)
  addressLine1: string;       // Address line 1 (editable)
  addressLine2?: string;      // Address line 2 (editable)
  city: string;               // City (editable)
  state: string;              // State/Province (editable)
  district: string;         // Postal code (editable)
  country: string;            // Country (editable)
  isPrimary: boolean;         // Whether this is the primary address (editable)
  isVerified: boolean;        // Whether this address is verified (editable)
  verificationDate?: Date;    // When the address was verified (editable)
  
}
```

### 4. Email

Represents email addresses associated with customers.

```typescript
interface Email extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  customerId: string;         // Reference to customer (read-only)
  
  address: string;            // Email address (editable)
  isPrimary: boolean;         // Whether this is the primary email (editable)
  isVerified: boolean;        // Whether this email is verified (editable)
  verificationDate?: Date;    // When the email was verified (editable)
  
}
```

### 5. Loan

Represents a loan issued to a customer.

```typescript
interface Loan extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  customerId: string;         // Reference to customer (read-only)
  
  accountNumber: string;      // Loan account number (read-only)
  productType: string;        // Loan product type (read-only)
  originalAmount: number;     // Original loan amount (read-only)
  currency: string;           // Currency code (read-only)
  disbursementDate: Date;     // Disbursement date (read-only)
  maturityDate: Date;         // Maturity date (read-only)
  interestRate: number;       // Interest rate (read-only)
  term: number;               // Loan term in months (read-only)
  paymentFrequency: string;   // Payment frequency (read-only)
  limit: number; // Limit of OD & Cards
  
  currentBalance: number;     // Current outstanding balance (read-only)
  dueAmount: number;          // Current due amount (read-only)
  minPay: number; // For cards product
  nextPaymentDate: Date;      // Next payment date (read-only)
  dpd: number;        // Days overdue (read-only)
  delinquencyStatus: string;  // Delinquency status (read-only)
  
  // Relationships
  cases: Case[];              // Collection cases (1:N)
  
}
```

### 6. Collateral

Represents assets used as collateral for loans.

```typescript
interface Collateral extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  collateralNumber: string;   // VPBANK collateral number
  customerId: string;         // Reference to customer (read-only)
  
  type: string;               // Collateral type (read-only)
  description: string;        // Description (read-only)
  value: number;              // Assessed value (read-only)
  valuationDate: Date;        // Valuation date (read-only)
  
  // For vehicles
  make?: string;              // Vehicle make (read-only)
  model?: string;             // Vehicle model (read-only)
  year?: number;              // Vehicle year (read-only)
  vin?: string;               // Vehicle identification number (read-only)
  licensePlate?: string;      // License plate (read-only)
  
  // For real estate
  propertyType?: string;      // Property type (read-only)
  address?: string;           // Property address (read-only)
  size?: number;              // Property size (read-only)
  titleNumber?: string;       // Title number (read-only)
  
}
```

### 7. Case

Represents a collection case for a delinquent loan.

```typescript
interface Case {
  id: string;                 // Unique identifier (read-only)
  loanId: string;             // Reference to loan (read-only)
  
  caseNumber: string;         // Case number (read-only)
  status: 'OPEN' | 'CLOSED'   // Case status (read-only)
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Priority (read-only)
  
  openDate: Date;             // Case open date (read-only)
  closeDate?: Date;           // Case close date (read-only)
  resolutionCode?: string;    // Resolution code (read-only)
  resolutionNotes?: string;   // Resolution notes (read-only)
  
  // Relationships
  actions: ActionRecord[];    // Action records (1:N)
  payments: Payment[];        // Payments made (1:N)
  
}
```

### 8. ActionRecord

Represents actions taken by collection agents.

```typescript
interface ActionRecord {
  id: string;                 // Unique identifier (read-only)
  caseId: string;             // Reference to case (read-only)
  
  type: string;               // Action type (editable)
  subtype: string;           // Action subtype (editable)
  actionResult: string;       // Action result (editable)
  actionDate: Date;           // When the action occurred (editable)
  notes: string;              // Action notes (editable)
  
  // For calls
  callTraceId?: number;      // Call traceid in Callcenters
  
  // For visits
  visitLocation?: {           // Visit location (editable)
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  // Metadata
  createdAt: Date;            // Creation timestamp (read-only)
  updatedAt: Date;            // Last update timestamp (read-only)
  createdBy: string;          // User who created this action (read-only)
  updatedBy: string;          // User who last updated this action (read-only)
}
```

### 9. Agent

Represents collection agents and their teams.

```typescript
interface Agent {
  id: string;                 // Unique identifier (read-only)
  employeeId: string;         // Employee ID (read-only)
  name: string;               // Agent name (read-only)
  email: string;              // Work email (read-only)
  phone: string;              // Work phone (read-only)
  
  type: 'AGENT' | 'SUPERVISOR' | 'ADMIN'; // Agent type (read-only)
  team: string;               // Team assignment (read-only)
  isActive: boolean;          // Whether agent is active (editable)
  
  // Relationships
  cases: Case[];              // Assigned cases (1:N)
  actions: ActionRecord[];    // Performed actions (1:N)
  
  // Metadata
  createdAt: Date;            // Creation timestamp (read-only)
  updatedAt: Date;            // Last update timestamp (read-only)
}
```

### 10. Payment

Represents payments made toward a loan.

```typescript
interface Payment extends DataSourceTracking {
  id: string;                 // Unique identifier (read-only)
  loanId: string;             // Reference to loan (read-only)
  caseId?: string;            // Reference to case (read-only)
  
  amount: number;             // Payment amount (read-only)
  currency: string;           // Currency code (read-only)
  paymentDate: Date;          // Payment date (read-only)
  paymentMethod: string;      // Payment method (read-only)
  referenceNumber: string;    // Reference number (read-only)
  
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED'; // Payment status (read-only)
  statusReason?: string;      // Status reason (read-only)
  
  // Allocation
  principalAmount: number;    // Amount allocated to principal (read-only)
  interestAmount: number;     // Amount allocated to interest (read-only)
  feesAmount: number;         // Amount allocated to fees (read-only)
  penaltyAmount: number;      // Amount allocated to penalties (read-only)
  
}
```

### 11. LoanCollateral

Represents the many-to-many relationship between loans and collaterals.

```typescript
interface LoanCollateral {
  id: string;                 // Unique identifier (read-only)
  loanId: string;             // Reference to loan (read-only)
  collateralId: string;       // Reference to collateral (read-only)
  
  // Metadata
  createdAt: Date;            // Creation timestamp (read-only)
  updatedAt: Date;            // Last update timestamp (read-only)
  sourceSystem: string;       // Source system identifier (read-only)
}
```

### 12. CustomerCase

Represents collection status tracking at the customer level.

```typescript
interface CustomerCase {
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
  actions: CustomerCaseAction[]; // Customer case actions (1:N)
  
  // Metadata
  createdAt: Date;            // Creation timestamp (read-only)
  updatedAt: Date;            // Last update timestamp (read-only)
}
```

### 13. CustomerCaseAction

Represents actions and status inputs from agents at the customer level.

```typescript
interface CustomerCaseAction {
  id: string;                 // Unique identifier (read-only)
  customerCaseId: string;     // Reference to customer case (read-only)
  
  actionDate: Date;           // When the action occurred (editable)
  actionType: string;         // Type of action (editable)
  notes: string;              // Action notes (editable)
  
  // Status inputs
  customerStatus: string;        // Customer status (editable)
  collateralStatus: string;      // Collateral status (editable)
  processingStateStatus: string; // Processing state status (editable)
  lendingViolationStatus: string; // Lending violation status (editable)
  recoveryAbilityStatus: string; // Recovery ability status (editable)
  
  // Metadata
  createdAt: Date;            // Creation timestamp (read-only)
  updatedAt: Date;            // Last update timestamp (read-only)
  createdBy: string;          // User who created this action (read-only)
  updatedBy: string;          // User who last updated this action (read-only)
}
```

### 14. ReferenceCustomer

Represents related contacts to a customer.

```typescript
interface ReferenceCustomer extends DataSourceTracking {
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
```

## Access Patterns

### 1. Customer Management

- Retrieve customer by ID
- Search customers by name, national ID, or company registration
- List customers by segment or risk category
- Update customer contact information
- View customer's loans and collection history
- Manage reference customers

### 2. Loan Management

- Retrieve loan by ID or account number
- List loans by customer
- List loans by delinquency status
- View loan payment history
- View loan collateral information
- Manage loan-collateral associations

### 3. Case Management

- Retrieve case by ID or case number
- List cases by assigned agent or team
- List cases by status or priority
- Create and update action records for a case
- Track case resolution and outcomes

### 4. Collection Workflow

- Assign cases to agents
- Record collection actions and outcomes
- Track agent performance metrics
- Generate collection reports

### 5. Customer Case Management

- Retrieve customer case by ID
- List customer cases by assigned agent
- Update customer case status
- Create and update customer case actions
- Track customer-level collection status

### 6. Payment Tracking

- Record and track payments
- View payment history by loan or customer
- Generate payment reports
- Reconcile payments with collection actions

## Data Access Control

| Entity              | Collection Agent | Team Lead | Administrator |
|---------------------|------------------|-----------|--------------|
| Customer            | Read             | Read      | Read/Write   |
| Phone               | Read/Write       | Read/Write| Read/Write   |
| Address             | Read/Write       | Read/Write| Read/Write   |
| Email               | Read/Write       | Read/Write| Read/Write   |
| Loan                | Read             | Read      | Read/Write   |
| Collateral          | Read             | Read      | Read/Write   |
| Case                | Read             | Read/Write| Read/Write   |
| Action Record       | Read/Write       | Read/Write| Read/Write   |
| Agent               | Read             | Read/Write| Read/Write   |
| Payment             | Read             | Read      | Read/Write   |
| LoanCollateral      | Read             | Read      | Read/Write   |
| CustomerCase        | Read             | Read/Write| Read/Write   |
| CustomerCaseAction  | Read/Write       | Read/Write| Read/Write   |
| ReferenceCustomer   | Read/Write       | Read/Write| Read/Write   |

## Data Synchronization

1. **Customer Data**:
   - Synchronized daily from core bank systems
   - Read-only in Collection CRM when sourced from core bank systems
   - Contact information can be updated in CRM but not synced back

2. **Loan Data**:
   - Synchronized daily from core bank systems
   - Read-only in Collection CRM when sourced from core bank systems
   - Payment information updated in real-time

3. **Case Data**:
   - Synchronized daily in CRM after core bank data finished sync
   - Read-only in Collection CRM when sourced from W4

4. **Payment Data**:
   - Real-time updates from payment processing system
   - Read-only in Collection CRM

5. **Action Records**:
   - Created and managed within Collection CRM
   - Fully editable by authorized users

6. **CustomerCase Data**:
   - Created and managed within Collection CRM
   - Fully editable by authorized users

7. **CustomerCaseAction Data**:
   - Created and managed within Collection CRM
   - Fully editable by authorized users

8. **ReferenceCustomer Data**:
   - Synchronized daily from T24 or created within Collection CRM
   - Basic information read-only when synchronized from T24
   - Contact information can be updated in CRM but not synced back

9. **LoanCollateral Data**:
   - Created and managed within Collection CRM
   - Represents the many-to-many relationship between loans and collaterals

## Data Source Tracking

To implement the requirement that data imported from external sources (T24, W4, LOS) should be read-only while allowing agents to add new data and edit their own entries, the system will implement the following approach:

1. **Source Tracking**:
   - Applied only to entities that can be imported from external systems: Customer, ReferenceCustomer, Phone, Address, Email, Loan, Collateral, Payment
   - Each tracked entity extends the DataSourceTracking interface
   - Values for `sourceSystem` include: "T24", "W4", "LOS", "CRM"
   - The `isEditable` flag determines if a record can be modified

2. **Edit Permissions Logic**:
   - Records with `sourceSystem` values of "T24", "W4", or "LOS" will be read-only for core fields
   - Records with `sourceSystem` value of "CRM" will be editable by the user who created them (`createdBy` matches current user) or by users with appropriate permissions
   - Supplementary information can be added to external records without modifying the core data

3. **Implementation Approach**:
   ```typescript
   interface DataSourceTracking {
     id: string;                 // Unique identifier (read-only)
     sourceSystem: 'T24'|'W4'|'LOS'|'CRM'; // Origin system
     sourceId?: string;          // Original ID in source system
     createdBy: string;          // User/system that created
     updatedBy: string;          // User/system that last updated
     createdAt: Date;            // Creation timestamp
     updatedAt: Date;            // Last update timestamp
     isEditable: boolean;        // Whether record can be modified
   }
   ```

4. **Extending Records**:
   - For records from external systems that need additional information, the system will use extension tables rather than modifying the original records
   - Example: CustomerExtension table to store additional information about customers without modifying the original Customer record

5. **UI Presentation**:
   - Read-only fields from external systems will be visually distinguished in the UI
   - Editable fields created within the CRM will be clearly indicated
   - The source of each record will be displayed to users

## Data Dictionaries

This section defines standardized value sets for various field types used throughout the system.

### PhoneType Dictionary

Defines the types of phone numbers associated with customers.

```typescript
enum PhoneType {
 MOBILE = 'MOBILE',       // Mobile/cell phone
 HOME = 'HOME',           // Home landline
 WORK = 'WORK',           // Work/office phone
 EMERGENCY = 'EMERGENCY', // Emergency contact
 FAX = 'FAX',             // Fax number
 OTHER = 'OTHER'          // Other phone types
}
```

### AddressType Dictionary

Defines the types of addresses associated with customers.

```typescript
enum AddressType {
 HOME = 'HOME',             // Residential address
 WORK = 'WORK',             // Work/office address
 BILLING = 'BILLING',       // Billing address
 MAILING = 'MAILING',       // Mailing address
 PROPERTY = 'PROPERTY',     // Property address (for collateral)
 TEMPORARY = 'TEMPORARY',   // Temporary address
 OTHER = 'OTHER'            // Other address types
}
```

### LoanProductType Dictionary

Defines the types of loan products offered.

```typescript
enum LoanProductType {
 // Secured loans
 MORTGAGE = 'MORTGAGE',                 // Home mortgage loan
 AUTO = 'AUTO',                         // Auto/vehicle loan
 SECURED_PERSONAL = 'SECURED_PERSONAL', // Secured personal loan
 
 // Unsecured loans
 PERSONAL = 'PERSONAL',                 // Unsecured personal loan
 EDUCATION = 'EDUCATION',               // Education/student loan
 BUSINESS = 'BUSINESS',                 // Business loan
 
 // Credit facilities
 CREDIT_CARD = 'CREDIT_CARD',           // Credit card
 OVERDRAFT = 'OVERDRAFT',               // Overdraft facility
 LINE_OF_CREDIT = 'LINE_OF_CREDIT',     // Line of credit
 
 // Other
 REFINANCE = 'REFINANCE',               // Refinance loan
 CONSOLIDATION = 'CONSOLIDATION',       // Debt consolidation loan
 OTHER = 'OTHER'                        // Other loan types
}
```

### ActionType Dictionary

Defines the types of actions performed by collection agents.

```typescript
enum ActionType {
 // Communication actions
 CALL = 'CALL',                     // Phone call to customer
 SMS = 'SMS',                       // SMS message to customer
 EMAIL = 'EMAIL',                   // Email to customer
 LETTER = 'LETTER',                 // Physical letter to customer
 
 // In-person actions
 VISIT = 'VISIT',                   // In-person visit
 MEETING = 'MEETING',               // Scheduled meeting
 
 // Case management actions
 CASE_REVIEW = 'CASE_REVIEW',       // Review of case details
 CASE_ESCALATION = 'CASE_ESCALATION', // Escalation to higher authority
 CASE_TRANSFER = 'CASE_TRANSFER',   // Transfer to another agent/team
 
 // Payment actions
 PAYMENT_ARRANGEMENT = 'PAYMENT_ARRANGEMENT', // Setting up payment plan
 PAYMENT_REMINDER = 'PAYMENT_REMINDER',       // Reminder about payment
 PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION', // Confirming received payment
 
 // Legal actions
 LEGAL_NOTICE = 'LEGAL_NOTICE',     // Legal notice issuance
 LEGAL_FILING = 'LEGAL_FILING',     // Legal case filing
 
 // Other
 NOTE = 'NOTE',                     // General note/comment
 OTHER = 'OTHER'                    // Other action types
}
```

### ActionSubType Dictionary

Defines subtypes for the main action types.

```typescript
enum ActionSubType {
 // Call subtypes
 CALL_OUTBOUND = 'CALL_OUTBOUND',       // Outbound call initiated by agent
 CALL_INBOUND = 'CALL_INBOUND',         // Inbound call from customer
 CALL_FOLLOWUP = 'CALL_FOLLOWUP',       // Follow-up call
 
 // SMS subtypes
 SMS_REMINDER = 'SMS_REMINDER',         // Payment reminder SMS
 SMS_CONFIRMATION = 'SMS_CONFIRMATION', // Confirmation SMS
 SMS_INFORMATION = 'SMS_INFORMATION',   // Informational SMS
 
 // Email subtypes
 EMAIL_REMINDER = 'EMAIL_REMINDER',     // Payment reminder email
 EMAIL_STATEMENT = 'EMAIL_STATEMENT',   // Statement email
 EMAIL_LEGAL = 'EMAIL_LEGAL',           // Legal notice email
 
 // Visit subtypes
 VISIT_SCHEDULED = 'VISIT_SCHEDULED',   // Scheduled visit
 VISIT_UNSCHEDULED = 'VISIT_UNSCHEDULED', // Unscheduled visit
 
 // Payment arrangement subtypes
 ARRANGEMENT_NEW = 'ARRANGEMENT_NEW',   // New payment arrangement
 ARRANGEMENT_REVISED = 'ARRANGEMENT_REVISED', // Revised payment arrangement
 
 // Legal subtypes
 LEGAL_WARNING = 'LEGAL_WARNING',       // Legal warning
 LEGAL_DEMAND = 'LEGAL_DEMAND',         // Demand letter
 LEGAL_COURT = 'LEGAL_COURT',           // Court proceedings
 
 // Other
 OTHER = 'OTHER'                        // Other subtypes
}
```

### ActionResultType Dictionary

Defines the possible outcomes of collection actions.

```typescript
enum ActionResultType {
 // Contact results
 CONTACTED = 'CONTACTED',               // Successfully contacted customer
 NOT_CONTACTED = 'NOT_CONTACTED',       // Could not contact customer
 LEFT_MESSAGE = 'LEFT_MESSAGE',         // Left message/voicemail
 
 // Response results
 PROMISE_TO_PAY = 'PROMISE_TO_PAY',     // Customer promised to pay
 PAYMENT_MADE = 'PAYMENT_MADE',         // Payment was made
 DISPUTE = 'DISPUTE',                   // Customer disputed the debt
 HARDSHIP_CLAIM = 'HARDSHIP_CLAIM',     // Customer claimed financial hardship
 
 // Negative results
 REFUSED = 'REFUSED',                   // Customer refused to pay
 DISCONNECTED = 'DISCONNECTED',         // Phone disconnected/invalid
 WRONG_CONTACT = 'WRONG_CONTACT',       // Wrong contact information
 NO_RESPONSE = 'NO_RESPONSE',           // No response from customer
 
 // Visit results
 NOT_HOME = 'NOT_HOME',                 // Customer not at home
 ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND', // Address could not be found
 
 // Other
 PENDING = 'PENDING',                   // Action pending completion
 COMPLETED = 'COMPLETED',               // Action completed
 FAILED = 'FAILED',                     // Action failed
 OTHER = 'OTHER'                        // Other result types
}
```

### Team Dictionary

Defines the collection teams within the organization.

```typescript
enum Team {
 // Early-stage collection teams
 EARLY_STAGE_CALL = 'EARLY_STAGE_CALL',   // Early-stage call center team
 EARLY_STAGE_FIELD = 'EARLY_STAGE_FIELD', // Early-stage field team
 
 // Mid-stage collection teams
 MID_STAGE_CALL = 'MID_STAGE_CALL',       // Mid-stage call center team
 MID_STAGE_FIELD = 'MID_STAGE_FIELD',     // Mid-stage field team
 
 // Late-stage collection teams
 LATE_STAGE_CALL = 'LATE_STAGE_CALL',     // Late-stage call center team
 LATE_STAGE_FIELD = 'LATE_STAGE_FIELD',   // Late-stage field team
 
 // Specialized teams
 LEGAL = 'LEGAL',                         // Legal team
 RESTRUCTURING = 'RESTRUCTURING',         // Loan restructuring team
 SPECIAL_ASSETS = 'SPECIAL_ASSETS',       // Special assets team
 HIGH_VALUE = 'HIGH_VALUE',               // High-value accounts team
 
 // Management
 SUPERVISOR = 'SUPERVISOR',               // Supervisory team
 MANAGEMENT = 'MANAGEMENT',               // Management team
 
 // Other
 OTHER = 'OTHER'                          // Other teams
}
```

### CustomerStatusType Dictionary

Defines the possible status types for customers in collection.

```typescript
enum CustomerStatusType {
 COOPERATIVE = 'COOPERATIVE',           // Customer is cooperative
 PARTIALLY_COOPERATIVE = 'PARTIALLY_COOPERATIVE', // Customer is somewhat cooperative
 UNCOOPERATIVE = 'UNCOOPERATIVE',       // Customer is uncooperative
 UNREACHABLE = 'UNREACHABLE',           // Cannot reach customer
 DISPUTED = 'DISPUTED',                 // Customer disputes the debt
 BANKRUPT = 'BANKRUPT',                 // Customer has declared bankruptcy
 DECEASED = 'DECEASED',                 // Customer is deceased
 LEGAL_REPRESENTATION = 'LEGAL_REPRESENTATION', // Customer has legal representation
 UNKNOWN = 'UNKNOWN'                    // Status unknown
}
```

### CollateralStatusType Dictionary

Defines the status types for collateral assets.

```typescript
enum CollateralStatusType {
 SECURED = 'SECURED',                   // Collateral is secured
 PARTIALLY_SECURED = 'PARTIALLY_SECURED', // Collateral is partially secured
 AT_RISK = 'AT_RISK',                   // Collateral is at risk
 DAMAGED = 'DAMAGED',                   // Collateral is damaged
 MISSING = 'MISSING',                   // Collateral is missing
 SEIZED = 'SEIZED',                     // Collateral has been seized
 IN_LIQUIDATION = 'IN_LIQUIDATION',     // Collateral is being liquidated
 LIQUIDATED = 'LIQUIDATED',             // Collateral has been liquidated
 NOT_APPLICABLE = 'NOT_APPLICABLE',     // No collateral or not applicable
 UNKNOWN = 'UNKNOWN'                    // Status unknown
}
```

### ProcessingStateStatusType Dictionary

Defines the processing state of collection cases.

```typescript
enum ProcessingStateStatusType {
 NEW = 'NEW',                           // New case
 IN_PROGRESS = 'IN_PROGRESS',           // Case in progress
 PENDING_CUSTOMER = 'PENDING_CUSTOMER', // Waiting for customer action
 PENDING_APPROVAL = 'PENDING_APPROVAL', // Waiting for internal approval
 PENDING_LEGAL = 'PENDING_LEGAL',       // Waiting for legal action
 ON_HOLD = 'ON_HOLD',                   // Case temporarily on hold
 ESCALATED = 'ESCALATED',               // Case has been escalated
 RESOLVED = 'RESOLVED',                 // Case has been resolved
 CLOSED = 'CLOSED',                     // Case is closed
 REOPENED = 'REOPENED'                  // Previously closed case reopened
}
```

### LendingViolationStatusType Dictionary

Defines the status of lending violations.

```typescript
enum LendingViolationStatusType {
 NONE = 'NONE',                         // No violations
 PAYMENT_DELAY = 'PAYMENT_DELAY',       // Payment delay violation
 COVENANT_BREACH = 'COVENANT_BREACH',   // Covenant breach
 COLLATERAL_ISSUE = 'COLLATERAL_ISSUE', // Collateral-related violation
 FINANCIAL_REPORTING = 'FINANCIAL_REPORTING', // Financial reporting violation
 MULTIPLE = 'MULTIPLE',                 // Multiple violations
 SEVERE = 'SEVERE',                     // Severe violations
 UNDER_INVESTIGATION = 'UNDER_INVESTIGATION', // Violations under investigation
 RESOLVED = 'RESOLVED',                 // Violations resolved
 UNKNOWN = 'UNKNOWN'                    // Status unknown
}
```

### RecoveryAbilityStatusType Dictionary

Defines the assessment of recovery ability.

```typescript
enum RecoveryAbilityStatusType {
 HIGH = 'HIGH',                         // High recovery probability
 MEDIUM = 'MEDIUM',                     // Medium recovery probability
 LOW = 'LOW',                           // Low recovery probability
 VERY_LOW = 'VERY_LOW',                 // Very low recovery probability
 REQUIRES_RESTRUCTURING = 'REQUIRES_RESTRUCTURING', // Requires loan restructuring
 REQUIRES_LEGAL = 'REQUIRES_LEGAL',     // Requires legal action
 WRITE_OFF_RECOMMENDED = 'WRITE_OFF_RECOMMENDED', // Write-off recommended
 UNKNOWN = 'UNKNOWN'                    // Recovery ability unknown
}
```
