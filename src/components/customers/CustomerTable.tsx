import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
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
            <TableHead>Address</TableHead>
            <TableHead>Occupation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell 
                className="font-medium cursor-pointer hover:text-primary"
                onClick={() => handleCustomerClick(customer.id)}
              >
                {customer.name}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {customer.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{phone.phoneNumber}</span>
                      <span className="text-xs text-muted-foreground ml-1">({phone.type})</span>
                    </div>
                  ))}
                  {customer.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {customer.addresses.map((address, index) => (
                  <div key={index} className="flex items-center text-sm mb-1">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {address.address}, {address.city}, {address.state} {address.zipCode}
                      <span className="text-xs text-muted-foreground ml-1">({address.type})</span>
                    </span>
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {customer.occupation || 'Not specified'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
