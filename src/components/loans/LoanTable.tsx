
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loan } from '@/types/crm';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { getDelinquencyStatusColor } from '@/lib/adapters';

interface LoanTableProps {
  loans: Loan[];
}

const LoanTable: React.FC<LoanTableProps> = ({ loans }) => {
  const navigate = useNavigate();

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer ID</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Outstanding Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell 
                className="cursor-pointer hover:text-primary"
                onClick={() => handleCustomerClick(loan.customerId)}
              >
                {loan.customerId}
              </TableCell>
              <TableCell className="capitalize">{loan.productType}</TableCell>
              <TableCell>${loan.currentBalance.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getDelinquencyStatusColor(loan.delinquencyStatus)}>
                  {loan.delinquencyStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(loan.createdAt, { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LoanTable;
