
import { Customer, Loan, CollectionAction, Task, Payment, User } from "@/types/crm";
import { toast } from "@/components/ui/sonner";

// This file contains placeholder API functions that will be implemented later
// to fetch data from your external API backend

// Mock data - will be replaced by actual API calls later
const mockData = {
  customers: [] as Customer[],
  loans: [] as Loan[],
  actions: [] as CollectionAction[],
  tasks: [] as Task[],
  payments: [] as Payment[],
  users: [] as User[]
};

// Placeholder API functions
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    // TODO: Replace with actual API call
    console.log('Fetching customers from API (placeholder)');
    return mockData.customers;
  } catch (error) {
    toast.error('Failed to fetch customers');
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const fetchLoans = async (): Promise<Loan[]> => {
  try {
    // TODO: Replace with actual API call
    console.log('Fetching loans from API (placeholder)');
    return mockData.loans;
  } catch (error) {
    toast.error('Failed to fetch loans');
    console.error('Error fetching loans:', error);
    return [];
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    // TODO: Replace with actual API call
    console.log('Fetching tasks from API (placeholder)');
    return mockData.tasks;
  } catch (error) {
    toast.error('Failed to fetch tasks');
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const fetchActions = async (): Promise<CollectionAction[]> => {
  try {
    // TODO: Replace with actual API call
    console.log('Fetching actions from API (placeholder)');
    return mockData.actions;
  } catch (error) {
    toast.error('Failed to fetch actions');
    console.error('Error fetching actions:', error);
    return [];
  }
};

export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    // TODO: Replace with actual API call
    console.log('Fetching payments from API (placeholder)');
    return mockData.payments;
  } catch (error) {
    toast.error('Failed to fetch payments');
    console.error('Error fetching payments:', error);
    return [];
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // TODO: Replace with actual API call
    console.log('Fetching users from API (placeholder)');
    return mockData.users;
  } catch (error) {
    toast.error('Failed to fetch users');
    console.error('Error fetching users:', error);
    return [];
  }
};
