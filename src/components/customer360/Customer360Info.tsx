
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/types/crm';
import { Phone, Mail, MapPin, Users, User, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatAddress, formatPhoneNumber } from '@/lib/adapters';

interface Customer360InfoProps {
  customer: Customer;
}

const Customer360Info: React.FC<Customer360InfoProps> = ({ customer }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">CIF:</dt>
              <dd className="text-sm">{customer.cif}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Type:</dt>
              <dd className="text-sm">{customer.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Status:</dt>
              <Badge variant={customer.status === 'ACTIVE' ? 'default' : 'destructive'}>
                {customer.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Segment:</dt>
              <dd className="text-sm">{customer.segment}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Personal/Organization Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {customer.type === 'INDIVIDUAL' ? (
              <User className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
            {customer.type === 'INDIVIDUAL' ? 'Personal Details' : 'Organization Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            {customer.type === 'INDIVIDUAL' ? (
              <>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Name:</dt>
                  <dd className="text-sm">{customer.name}</dd>
                </div>
                {customer.dateOfBirth && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Date of Birth:</dt>
                    <dd className="text-sm">{customer.dateOfBirth.toLocaleDateString()}</dd>
                  </div>
                )}
                {customer.nationalId && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">National ID:</dt>
                    <dd className="text-sm">{customer.nationalId}</dd>
                  </div>
                )}
                {customer.gender && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Gender:</dt>
                    <dd className="text-sm">{customer.gender}</dd>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Company Name:</dt>
                  <dd className="text-sm">{customer.companyName}</dd>
                </div>
                {customer.registrationNumber && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Registration No:</dt>
                    <dd className="text-sm">{customer.registrationNumber}</dd>
                  </div>
                )}
                {customer.taxId && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Tax ID:</dt>
                    <dd className="text-sm">{customer.taxId}</dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {customer.phoneNumbers.map((phone) => (
              <div key={phone.id}>
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  {phone.type.toLowerCase()} Phone:
                </dt>
                <dd className="text-sm flex items-center gap-2">
                  {formatPhoneNumber(phone)}
                  {phone.isPrimary && <Badge variant="secondary">Primary</Badge>}
                  {phone.isVerified && <Badge variant="outline">Verified</Badge>}
                </dd>
              </div>
            ))}
            {customer.emails.map((email) => (
              <div key={email.id}>
                <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                <dd className="text-sm flex items-center gap-2">
                  {email.address}
                  {email.isPrimary && <Badge variant="secondary">Primary</Badge>}
                  {email.isVerified && <Badge variant="outline">Verified</Badge>}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Addresses */}
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
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="capitalize">{address.type.toLowerCase()} Address:</span>
                  {address.isPrimary && <Badge variant="secondary">Primary</Badge>}
                </dt>
                <dd className="text-sm">
                  {formatAddress(address)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Reference Customers */}
      {customer.referenceCustomers.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reference Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.referenceCustomers.map((ref) => (
                <div key={ref.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">
                        {ref.type === 'INDIVIDUAL' ? ref.name : ref.companyName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Relationship: {ref.relationshipType}
                      </p>
                    </div>
                    <Badge variant="outline">{ref.type}</Badge>
                  </div>
                  {ref.phoneNumbers.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Contact:</span>
                      <span className="text-sm ml-2">
                        {formatPhoneNumber(ref.phoneNumbers[0])}
                      </span>
                    </div>
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
