import React from 'react';
import { Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { useCrm } from '@/context/CrmContext';
import LoanTable from '@/components/loans/LoanTable';

const Loans = () => {
  const { loans } = useCrm();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredLoans = React.useMemo(() => {
    if (!searchQuery.trim()) return loans;
    
    const query = searchQuery.toLowerCase();
    return loans.filter(loan => 
      loan.customerId.toLowerCase().includes(query) ||
      loan.productType.toLowerCase().includes(query)
    );
  }, [loans, searchQuery]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">
            Manage and track loan information.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search loans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <LoanTable loans={filteredLoans} />
      </div>
    </MainLayout>
  );
};

export default Loans;
