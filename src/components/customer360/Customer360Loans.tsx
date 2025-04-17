
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrm } from '@/context/CrmContext';
import { formatDistanceToNow } from 'date-fns';

interface Customer360LoansProps {
  customerId: string;
}

const Customer360Loans: React.FC<Customer360LoansProps> = ({ customerId }) => {
  const { loans } = useCrm();
  const customerLoans = loans.filter(loan => loan.customerId === customerId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500';
      case 'overdue': return 'bg-yellow-500';
      case 'default': return 'bg-red-500';
      case 'legal notice': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {customerLoans.map((loan) => (
        <Card key={loan.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Loan {loan.id}</CardTitle>
              <Badge className={getStatusColor(loan.status)}>
                {loan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Product Type</dt>
                <dd className="text-sm capitalize">{loan.productType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Interest Rate</dt>
                <dd className="text-sm">{loan.interestRate}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Outstanding Amount</dt>
                <dd className="text-sm">${loan.outstandingAmount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm">{formatDistanceToNow(loan.createdOn, { addSuffix: true })}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}
      
      {customerLoans.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No loans found for this customer
        </div>
      )}
    </div>
  );
};

export default Customer360Loans;
