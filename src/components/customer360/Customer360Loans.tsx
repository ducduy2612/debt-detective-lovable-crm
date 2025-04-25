
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrm } from '@/context/CrmContext';
import { formatDistanceToNow } from 'date-fns';
import { getDelinquencyStatusColor } from '@/lib/adapters';

interface Customer360LoansProps {
  customerId: string;
}

const Customer360Loans: React.FC<Customer360LoansProps> = ({ customerId }) => {
  const { loans } = useCrm();
  const customerLoans = loans.filter(loan => loan.customerId === customerId);

  return (
    <div className="space-y-4">
      {customerLoans.map((loan) => (
        <Card key={loan.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Loan {loan.accountNumber}</CardTitle>
              <Badge className={getDelinquencyStatusColor(loan.delinquencyStatus)}>
                {loan.delinquencyStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Product Type</dt>
                <dd className="text-sm capitalize">{loan.productType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Original Amount</dt>
                <dd className="text-sm">${loan.originalAmount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Current Balance</dt>
                <dd className="text-sm">${loan.currentBalance.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Interest Rate</dt>
                <dd className="text-sm">{loan.interestRate}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Term</dt>
                <dd className="text-sm">{loan.term} months</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Payment Frequency</dt>
                <dd className="text-sm capitalize">{loan.paymentFrequency}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Due Amount</dt>
                <dd className="text-sm">${loan.dueAmount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Minimum Payment</dt>
                <dd className="text-sm">${loan.minPay.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Next Payment Date</dt>
                <dd className="text-sm">{loan.nextPaymentDate.toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">DPD</dt>
                <dd className="text-sm">{loan.dpd} days</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Disbursement Date</dt>
                <dd className="text-sm">{loan.disbursementDate.toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Maturity Date</dt>
                <dd className="text-sm">{loan.maturityDate.toLocaleDateString()}</dd>
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
