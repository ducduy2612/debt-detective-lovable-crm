
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
  
  // State for filters and pagination
  const [selectedLoanId, setSelectedLoanId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'valuation'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;
  
  // Collect all collaterals from customer loans
  const allCollaterals: Array<Collateral & { loanId: string }> = [];
  customerLoans.forEach(loan => {
    const loanCollaterals = loan.collaterals.map(collateral => ({
      ...collateral,
      loanId: loan.id
    }));
    allCollaterals.push(...loanCollaterals);
  });
  
  // Get unique collateral types
  const collateralTypes = Array.from(new Set(allCollaterals.map(c => c.type)));
  
  // Filter collaterals
  const filteredCollaterals = allCollaterals.filter(collateral => {
    if (selectedLoanId !== 'all' && collateral.loanId !== selectedLoanId) return false;
    if (selectedType !== 'all' && collateral.type !== selectedType) return false;
    return true;
  });
  
  // Sort collaterals
  const sortedCollaterals = [...filteredCollaterals].sort((a, b) => {
    if (sortBy === 'date') {
      // Get the latest valuation date for each collateral
      const lastValuationDateA = a.valuations.length > 0 
        ? new Date(a.valuations[a.valuations.length - 1].date).getTime() 
        : 0;
      const lastValuationDateB = b.valuations.length > 0 
        ? new Date(b.valuations[b.valuations.length - 1].date).getTime() 
        : 0;
      return sortOrder === 'asc' ? lastValuationDateA - lastValuationDateB : lastValuationDateB - lastValuationDateA;
    } else {
      // Get the latest valuation amount for each collateral
      const lastValuationA = a.valuations.length > 0 
        ? a.valuations[a.valuations.length - 1].amount 
        : 0;
      const lastValuationB = b.valuations.length > 0 
        ? b.valuations[b.valuations.length - 1].amount 
        : 0;
      return sortOrder === 'asc' ? lastValuationA - lastValuationB : lastValuationB - lastValuationA;
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
  
  // Get the latest valuation for a collateral
  const getLatestValuation = (collateral: Collateral) => {
    if (collateral.valuations.length === 0) return null;
    return collateral.valuations[collateral.valuations.length - 1];
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
                        const latestValuation = getLatestValuation(collateral);
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
                              {latestValuation
                                ? `$${latestValuation.amount.toLocaleString()}`
                                : "No valuation"
                              }
                            </TableCell>
                            <TableCell>
                              {latestValuation
                                ? format(new Date(latestValuation.date), 'MMM dd, yyyy')
                                : "N/A"
                              }
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
                  const latestValuation = getLatestValuation(collateral);
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
                          {latestValuation
                            ? `$${latestValuation.amount.toLocaleString()}`
                            : "No valuation"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Date:</span>
                        <span>
                          {latestValuation
                            ? format(new Date(latestValuation.date), 'MMM dd, yyyy')
                            : "N/A"
                          }
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
      
      {/* Collateral valuation history section */}
      {paginatedCollaterals.length > 0 && paginatedCollaterals.some(c => c.valuations.length > 1) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Valuation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedCollaterals
                .filter(c => c.valuations.length > 1)
                .map(collateral => (
                  <div key={`history-${collateral.id}`} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{collateral.description}</h4>
                      <Badge variant="outline" className="capitalize">{collateral.type}</Badge>
                    </div>
                    <div className="space-y-3">
                      {[...collateral.valuations]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((valuation, index) => (
                          <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <div className="text-muted-foreground">
                              {format(new Date(valuation.date), 'MMM dd, yyyy')}
                              {valuation.appraiser && ` • ${valuation.appraiser}`}
                            </div>
                            <div className="font-medium">${valuation.amount.toLocaleString()}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Customer360Collaterals;
