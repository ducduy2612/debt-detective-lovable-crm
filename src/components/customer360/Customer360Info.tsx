
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/types/crm';
import { Phone, Mail, MapPin, Users } from 'lucide-react';
import { formatAddress, formatPhoneNumber } from '@/lib/adapters';

interface Customer360InfoProps {
  customer: Customer;
}

const Customer360Info: React.FC<Customer360InfoProps> = ({ customer }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            {customer.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  {phone.type}:
                </dt>
                <dd className="text-sm">{formatPhoneNumber(phone)}</dd>
              </div>
            ))}
            {customer.emails.map((email, index) => (
              <div key={index} className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">
                  {email.isPrimary ? "Primary Email:" : "Email:"}
                </dt>
                <dd className="text-sm">{email.address}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {customer.addresses.map((address) => (
              <div key={address.id} className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  {address.type} Address:
                </dt>
                <dd className="text-sm">
                  {formatAddress(address)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Customer ID</dt>
              <dd className="text-sm">{customer.cif}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Type</dt>
              <dd className="text-sm capitalize">{customer.type.toLowerCase()}</dd>
            </div>
            {customer.dateOfBirth && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                <dd className="text-sm">{customer.dateOfBirth.toLocaleDateString()}</dd>
              </div>
            )}
            {customer.nationalId && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">National ID</dt>
                <dd className="text-sm">{customer.nationalId}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="text-sm">{customer.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Segment</dt>
              <dd className="text-sm">{customer.segment}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customer360Info;
