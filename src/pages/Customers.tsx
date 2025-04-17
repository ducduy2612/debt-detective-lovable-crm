
import React from 'react';
import { Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { useCrm } from '@/context/CrmContext';

const Customers = () => {
  const { customers } = useCrm();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.phoneNumbers.some(phone => phone.phoneNumber.includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage and view customer information.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <CustomerTable customers={filteredCustomers} />
      </div>
    </MainLayout>
  );
};

export default Customers;
