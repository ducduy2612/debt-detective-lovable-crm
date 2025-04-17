
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import { useCrm } from '@/context/CrmContext';
import Customer360Info from '@/components/customer360/Customer360Info';
import Customer360Loans from '@/components/customer360/Customer360Loans';
import Customer360Activities from '@/components/customer360/Customer360Activities';
import { notFound } from '@/lib/utils';

const Customer360 = () => {
  const { customerId } = useParams();
  const { customers } = useCrm();
  
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) {
    return notFound();
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">Customer ID: {customer.id}</p>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Customer Info</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Customer360;
