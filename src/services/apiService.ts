
import { supabase } from "@/integrations/supabase/client";
import { 
  Customer, Loan, Collateral, Payment,
  Case, ActionRecord, Agent, Task, Phone, Address, Email
} from '@/types/crm';
// Mock data for development
import {mockData} from "@/services/mockData";

// API service methods with typed responses
export const fetchCustomers = async (): Promise<Customer[]> => {
  console.info('Fetching customers from API');
  
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.customers);
    }, 500);
  });
};

export const fetchLoans = async (): Promise<Loan[]> => {
  console.info('Fetching loans from API');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.loans);
    }, 500);
  });
};

export const fetchCollaterals = async (loanId?: string): Promise<Collateral[]> => {
  console.info('Fetching collaterals from API');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loanId) {
        resolve(mockData.collaterals.filter(col => col.loanId === loanId));
      } else {
        resolve(mockData.collaterals);
      }
    }, 500);
  });
};

export const fetchPayments = async (loanId?: string): Promise<Payment[]> => {
  console.info('Fetching payments from API');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loanId) {
        resolve(mockData.payments.filter(payment => payment.loanId === loanId));
      } else {
        resolve(mockData.payments);
      }
    }, 500);
  });
};

export const fetchCases = async (loanId?: string): Promise<Case[]> => {
  console.info('Fetching cases from API');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loanId) {
        resolve(mockData.cases.filter(c => c.loanId === loanId));
      } else {
        resolve(mockData.cases);
      }
    }, 500);
  });
};

export const fetchActions = async (caseId?: string): Promise<ActionRecord[]> => {
  console.info('Fetching actions from API');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (caseId) {
        resolve(mockData.actions.filter(action => action.caseId === caseId));
      } else {
        resolve(mockData.actions);
      }
    }, 500);
  });
};

export const fetchTasks = async (assignedTo?: string): Promise<Task[]> => {
  console.info('Fetching tasks from API');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (assignedTo) {
        resolve(mockData.tasks.filter(task => task.assignedTo === assignedTo));
      } else {
        resolve(mockData.tasks);
      }
    }, 500);
  });
};

export const addCustomerContact = async (
  customerId: string,
  phoneData: Partial<Phone>
): Promise<Phone> => {
  console.info('Adding phone contact to customer:', customerId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPhone: Phone = {
        id: `phone-${Date.now()}`,
        customerId,
        type: phoneData.type || 'MOBILE',
        number: phoneData.number || '',
        isPrimary: false,
        isVerified: false,
        sourceSystem: 'CRM',
        createdBy: 'USER',
        updatedBy: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      };
      
      mockData.customers = mockData.customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            phoneNumbers: [...customer.phoneNumbers, newPhone]
          };
        }
        return customer;
      });
      
      resolve(newPhone);
    }, 500);
  });
};

export const addCustomerAddress = async (
  customerId: string,
  addressData: Partial<Address>
): Promise<Address> => {
  console.info('Adding address to customer:', customerId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        customerId,
        type: addressData.type || 'HOME',
        addressLine1: addressData.addressLine1 || '',
        addressLine2: addressData.addressLine2,
        city: addressData.city || '',
        state: addressData.state || '',
        district: addressData.district || '',
        country: addressData.country || 'US',
        isPrimary: false,
        isVerified: false,
        sourceSystem: 'CRM',
        createdBy: 'USER',
        updatedBy: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      };
      
      mockData.customers = mockData.customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            addresses: [...customer.addresses, newAddress]
          };
        }
        return customer;
      });
      
      resolve(newAddress);
    }, 500);
  });
};

export const addCustomerEmail = async (
  customerId: string,
  emailData: Partial<Email>
): Promise<Email> => {
  console.info('Adding email to customer:', customerId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmail: Email = {
        id: `email-${Date.now()}`,
        customerId,
        address: emailData.address || '',
        isPrimary: false,
        isVerified: false,
        sourceSystem: 'CRM',
        createdBy: 'USER',
        updatedBy: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        isEditable: true
      };
      
      mockData.customers = mockData.customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            emails: [...customer.emails, newEmail]
          };
        }
        return customer;
      });
      
      resolve(newEmail);
    }, 500);
  });
};
