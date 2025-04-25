
import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Customer } from '@/types/crm';
import { formatPhoneNumber, getEmailAddress } from '@/lib/adapters';

interface CustomerTableProps {
  customers: Customer[];
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const navigate = useNavigate();

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Information</TableHead>
            <TableHead>Customer ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell 
                className="font-medium cursor-pointer hover:text-primary"
                onClick={() => handleCustomerClick(customer.id)}
              >
                {customer.name || customer.companyName}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {customer.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{formatPhoneNumber(phone)}</span>
                      <span className="text-xs text-muted-foreground ml-1">({phone.type})</span>
                    </div>
                  ))}
                  {customer.emails.length > 0 && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{getEmailAddress(customer)}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {customer.cif}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {customer.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
