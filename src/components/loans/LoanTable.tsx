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

interface LoanTableProps {
  loans: Loan[];
}

const LoanTable: React.FC<LoanTableProps> = ({ loans }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'current':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-yellow-500';
      case 'default':
        return 'bg-red-500';
      case 'legal notice':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

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
              <TableCell>${loan.outstandingAmount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(loan.status)}>
                  {loan.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(loan.createdOn, { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LoanTable;
