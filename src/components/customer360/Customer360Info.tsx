
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/types/crm';
import { Phone, Mail, MapPin, Users } from 'lucide-react';

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
                <dd className="text-sm">{phone.phoneNumber}</dd>
              </div>
            ))}
            {customer.email && (
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                <dd className="text-sm">{customer.email}</dd>
              </div>
            )}
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
                  {address.address}, {address.city}, {address.state} {address.zipCode}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {customer.references.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {customer.references.map((reference) => (
                <div key={reference.id} className="space-y-2 p-4 border rounded-lg">
                  <div className="font-medium">{reference.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Relationship: {reference.relationship}
                  </div>
                  <div className="text-sm">
                    Phone: {reference.phoneNumbers.join(', ')}
                  </div>
                  {reference.email && (
                    <div className="text-sm">Email: {reference.email}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Customer360Info;
