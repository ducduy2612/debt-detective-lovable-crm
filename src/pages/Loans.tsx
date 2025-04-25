
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import LoanTable from '@/components/loans/LoanTable';
import { toast } from '@/components/ui/sonner';
import { fetchLoans } from '@/services/apiService';
import { LoanWithLegacyFields } from '@/types/legacyTypes';

const Loans = () => {
  const [loans, setLoans] = useState<LoanWithLegacyFields[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoans = async () => {
      try {
        setLoading(true);
        const loansData = await fetchLoans();
        setLoans(loansData);
      } catch (error) {
        toast.error('Failed to fetch loans', {
          description: (error as Error).message
        });
      } finally {
        setLoading(false);
      }
    };

    getLoans();
  }, []);

  const filteredLoans = React.useMemo(() => {
    if (!searchQuery.trim()) return loans;
    
    const query = searchQuery.toLowerCase();
    return loans.filter(loan => 
      loan.customerId.toLowerCase().includes(query) ||
      loan.accountNumber.toLowerCase().includes(query) ||
      loan.productType.toLowerCase().includes(query)
    );
  }, [loans, searchQuery]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Loading loans...</div>
      </MainLayout>
    );
  }

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
