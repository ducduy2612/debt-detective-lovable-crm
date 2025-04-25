
import React, { useState } from 'react';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortDesc, SortAsc } from 'lucide-react';
import { Collateral } from '@/types/crm'; 

interface Customer360CollateralsProps {
  customerId: string;
}

const Customer360Collaterals: React.FC<Customer360CollateralsProps> = ({ customerId }) => {
  const { loans } = useCrm();
  const customerLoans = loans.filter(loan => loan.customerId === customerId);
  
  // For demonstration, create mock collaterals based on loans
  const mockCollaterals: Collateral[] = customerLoans.map(loan => ({
    id: `collateral-${loan.id}`,
    customerId: loan.customerId,
    loanId: loan.id,
    type: loan.productType.toLowerCase() === 'mortgage' ? 'real estate' : 
          loan.productType.toLowerCase() === 'auto' ? 'vehicle' : 'other',
    description: `${loan.productType} collateral for loan ${loan.id}`,
    value: loan.originalAmount * 1.2,
    valuationDate: new Date(loan.disbursementDate),
    propertyType: loan.productType.toLowerCase() === 'mortgage' ? 'Residential' : undefined,
    make: loan.productType.toLowerCase() === 'auto' ? 'Toyota' : undefined,
    model: loan.productType.toLowerCase() === 'auto' ? 'Camry' : undefined,
    year: loan.productType.toLowerCase() === 'auto' ? 2020 : undefined,
    address: loan.productType.toLowerCase() === 'mortgage' ? '123 Main St, Anytown, CA' : undefined,
    size: loan.productType.toLowerCase() === 'mortgage' ? 2000 : undefined
  }));
  
  // State for filters and pagination
  const [selectedLoanId, setSelectedLoanId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'valuation'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;
  
  // Get all relevant collaterals
  const customerCollaterals = mockCollaterals;
  
  // Get unique collateral types as strings
  const collateralTypes = Array.from(new Set(customerCollaterals.map(c => c.type)));
  
  // Filter collaterals
  const filteredCollaterals = customerCollaterals.filter(collateral => {
    if (selectedLoanId !== 'all' && collateral.loanId !== selectedLoanId) return false;
    if (selectedType !== 'all' && collateral.type !== selectedType) return false;
    return true;
  });
  
  // Sort collaterals
  const sortedCollaterals = [...filteredCollaterals].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.valuationDate).getTime() - new Date(b.valuationDate).getTime() 
        : new Date(b.valuationDate).getTime() - new Date(a.valuationDate).getTime();
    } else {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    }
  });
  
  // Paginate
  const totalPages = Math.ceil(sortedCollaterals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollaterals = sortedCollaterals.slice(startIndex, startIndex + itemsPerPage);
  
  // Toggle sort order
  const toggleSort = (column: 'date' | 'valuation') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <span className="flex items-center gap-2">
              Collateral Information
            </span>
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-2 flex-grow">
                <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Loans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Loans</SelectItem>
                    {customerLoans.map(loan => (
                      <SelectItem key={loan.id} value={loan.id}>
                        Loan {loan.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {collateralTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {paginatedCollaterals.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden mb-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Collateral ID</TableHead>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead 
                          className="cursor-pointer" 
                          onClick={() => toggleSort('valuation')}
                        >
                          <div className="flex items-center gap-1">
                            Valuation
                            {sortBy === 'valuation' && (
                              sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer" 
                          onClick={() => toggleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Valuation Date
                            {sortBy === 'date' && (
                              sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCollaterals.map((collateral) => {
                        return (
                          <TableRow key={collateral.id}>
                            <TableCell className="font-medium">{collateral.id}</TableCell>
                            <TableCell>{collateral.loanId}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {collateral.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              ${collateral.value.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {format(new Date(collateral.valuationDate), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>{collateral.description}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Card view for mobile */}
              <div className="md:hidden space-y-3">
                {paginatedCollaterals.map((collateral) => {
                  return (
                    <div key={collateral.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">Collateral {collateral.id}</span>
                        <Badge variant="outline" className="capitalize">
                          {collateral.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Loan:</span>
                        <span>{collateral.loanId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valuation:</span>
                        <span className="font-medium">
                          ${collateral.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Date:</span>
                        <span>
                          {format(new Date(collateral.valuationDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Description:</span>
                        <span className="text-right max-w-[65%]">{collateral.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No collaterals found for the selected filters
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* More detailed collateral information */}
      {paginatedCollaterals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Collateral Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedCollaterals.map(collateral => (
                <div key={`details-${collateral.id}`} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{collateral.description}</h4>
                    <Badge variant="outline" className="capitalize">{collateral.type}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collateral.make && (
                      <div>
                        <span className="text-sm text-muted-foreground">Make/Model:</span>
                        <p className="text-sm">{collateral.make} {collateral.model}, {collateral.year}</p>
                      </div>
                    )}
                    {collateral.vin && (
                      <div>
                        <span className="text-sm text-muted-foreground">VIN:</span>
                        <p className="text-sm">{collateral.vin}</p>
                      </div>
                    )}
                    {collateral.propertyType && (
                      <div>
                        <span className="text-sm text-muted-foreground">Property Type:</span>
                        <p className="text-sm">{collateral.propertyType}</p>
                      </div>
                    )}
                    {collateral.address && (
                      <div>
                        <span className="text-sm text-muted-foreground">Address:</span>
                        <p className="text-sm">{collateral.address}</p>
                      </div>
                    )}
                    {collateral.size && (
                      <div>
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <p className="text-sm">{collateral.size} sq ft</p>
                      </div>
                    )}
                    {collateral.titleNumber && (
                      <div>
                        <span className="text-sm text-muted-foreground">Title Number:</span>
                        <p className="text-sm">{collateral.titleNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Customer360Collaterals;
