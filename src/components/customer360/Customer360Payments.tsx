
import React, { useState } from 'react';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, CreditCard, Banknote, Filter, ChevronDown, ChevronUp, SortDesc, SortAsc } from 'lucide-react';

interface Customer360PaymentsProps {
  customerId: string;
}

const Customer360Payments: React.FC<Customer360PaymentsProps> = ({ customerId }) => {
  const { loans, payments } = useCrm();
  const customerLoans = loans.filter(loan => loan.customerId === customerId);
  const loanIds = customerLoans.map(loan => loan.id);
  
  // State for filters and pagination
  const [selectedLoanId, setSelectedLoanId] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 25;
  
  // Filter payments
  const customerPayments = payments.filter(payment => {
    if (!loanIds.includes(payment.loanId)) return false;
    if (selectedLoanId !== 'all' && payment.loanId !== selectedLoanId) return false;
    
    if (startDate && endDate) {
      const paymentDate = new Date(payment.paymentDate);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      return paymentDate >= filterStartDate && paymentDate <= filterEndDate;
    }
    
    return true;
  });
  
  // Sort payments
  const sortedPayments = [...customerPayments].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.paymentDate).getTime();
      const dateB = new Date(b.paymentDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  
  // Paginate
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = sortedPayments.slice(startIndex, startIndex + itemsPerPage);
  
  // Toggle sort order
  const toggleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Payment ID', 'Loan ID', 'Date', 'Amount', 'Method', 'Reference Number'];
    const csvContent = [
      headers.join(','),
      ...sortedPayments.map(payment => [
        payment.id,
        payment.loanId,
        format(new Date(payment.paymentDate), 'yyyy-MM-dd'),
        payment.amount,
        payment.paymentMethod,
        payment.referenceNumber || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${customerId}_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
      case 'direct debit':
      case 'bank transfer':
        return <Banknote className="h-4 w-4" />;
      case 'check':
        return <FileText className="h-4 w-4" />;
      default:
        return <Banknote className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment History
            </span>
            <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 flex-grow">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <div className="grid md:grid-cols-3 gap-2 flex-grow">
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
                
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  className="w-full"
                  aria-label="Start Date"
                />
                
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  className="w-full"
                  aria-label="End Date"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {paginatedPayments.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden mb-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Loan ID</TableHead>
                        <TableHead 
                          className="cursor-pointer" 
                          onClick={() => toggleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Date
                            {sortBy === 'date' && (
                              sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer" 
                          onClick={() => toggleSort('amount')}
                        >
                          <div className="flex items-center gap-1">
                            Amount
                            {sortBy === 'amount' && (
                              sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.loanId}</TableCell>
                          <TableCell>{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="capitalize">{payment.paymentMethod}</span>
                            </div>
                          </TableCell>
                          <TableCell>{payment.referenceNumber || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Card view for mobile */}
              <div className="md:hidden space-y-3">
                {paginatedPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">Payment {payment.id}</span>
                      <Badge variant="outline">{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Loan:</span>
                      <span>{payment.loanId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${payment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Method:</span>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="capitalize">{payment.paymentMethod}</span>
                      </div>
                    </div>
                    {payment.referenceNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Reference:</span>
                        <span>{payment.referenceNumber}</span>
                      </div>
                    )}
                  </div>
                ))}
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
              No payments found for the selected filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customer360Payments;
