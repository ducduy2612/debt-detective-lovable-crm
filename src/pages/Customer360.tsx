
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import Customer360Info from '@/components/customer360/Customer360Info';
import Customer360Loans from '@/components/customer360/Customer360Loans';
import Customer360Activities from '@/components/customer360/Customer360Activities';
import Customer360Payments from '@/components/customer360/Customer360Payments';
import Customer360Collaterals from '@/components/customer360/Customer360Collaterals';
import { fetchCustomers } from '@/services/apiService';
import { Customer } from '@/types/crm';
import { toast } from '@/components/ui/sonner';

const Customer360 = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getCustomer = async () => {
      try {
        setLoading(true);
        const customers = await fetchCustomers();
        const foundCustomer = customers.find(c => c.id === customerId);
        setCustomer(foundCustomer || null);
      } catch (error) {
        toast.error('Failed to fetch customer details', {
          description: (error as Error).message
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (customerId) {
      getCustomer();
    }
  }, [customerId]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Loading customer details...</div>
      </MainLayout>
    );
  }
  
  if (!customer) {
    return <Navigate to="/not-found" />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">Customer ID: {customer.id}</p>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="flex flex-wrap w-full overflow-x-auto gap-1 md:gap-0">
            <TabsTrigger value="info">Customer Info</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="collaterals">Collaterals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <Customer360Info customer={customer} />
          </TabsContent>
          
          <TabsContent value="loans" className="space-y-4">
            <Customer360Loans customerId={customer.id} />
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            <Customer360Activities customerId={customer.id} />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Customer360Payments customerId={customer.id} />
          </TabsContent>
          
          <TabsContent value="collaterals" className="space-y-4">
            <Customer360Collaterals customerId={customer.id} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Customer360;
