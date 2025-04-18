
import React, { useState, useMemo } from 'react';
import { Download, FileType2, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrm } from '@/context/CrmContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Report types
const REPORT_TYPES = [
  { id: 'daily-collections', name: 'Daily Collections' },
  { id: 'agent-productivity', name: 'Agent Productivity' },
  { id: 'loan-status', name: 'Loan Status Distribution' },
  { id: 'overdue-aging', name: 'Overdue Loan Aging' },
  { id: 'collection-success', name: 'Collection Success Rate' },
  { id: 'compliance-audit', name: 'Compliance Audit' },
];

// Loan product filters
const LOAN_PRODUCTS = [
  { id: 'all', name: 'All Products' },
  { id: 'loan', name: 'Loans' },
  { id: 'credit-card', name: 'Credit Cards' },
  { id: 'overdraft', name: 'Overdrafts' },
];

// Loan stage filters
const LOAN_STAGES = [
  { id: 'all', name: 'All Stages' },
  { id: 'current', name: 'Current' },
  { id: 'overdue', name: 'Overdue' },
  { id: 'defaulted', name: 'Defaulted' },
  { id: 'closed', name: 'Closed' },
];

// Export options
const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', icon: FileType2 },
  { id: 'csv', name: 'CSV', icon: FileType2 },
  { id: 'png', name: 'PNG', icon: FileType2 },
];

// Colors for charts
const CHART_COLORS = [
  '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', '#EAB308'
];

const Reports = () => {
  const { loans, actions, activities, tasks, currentUser } = useCrm();
  const [reportType, setReportType] = useState('daily-collections');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [loanProduct, setLoanProduct] = useState('all');
  const [loanStage, setLoanStage] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');

  // Prepare filtered data for reports
  const reportData = useMemo(() => {
    // Filter loans based on selected filters
    const filteredLoans = loans.filter(loan => {
      const matchesProduct = loanProduct === 'all' || loan.type === loanProduct;
      const matchesStage = loanStage === 'all' || loan.status === loanStage;
      return matchesProduct && matchesStage;
    });

    // Filter actions based on date range and agent filter
    const filteredActions = actions.filter(action => {
      const actionDate = new Date(action.timestamp);
      const isInDateRange = (!startDate || actionDate >= startDate) && 
                            (!endDate || actionDate <= endDate);
      const matchesAgent = agentFilter === 'all' || action.agentId === agentFilter;
      return isInDateRange && matchesAgent;
    });

    // Generate report data based on selected report type
    switch (reportType) {
      case 'daily-collections':
        return generateDailyCollectionsData(filteredActions);
      
      case 'agent-productivity':
        return generateAgentProductivityData(filteredActions);
      
      case 'loan-status':
        return generateLoanStatusData(filteredLoans);
      
      case 'overdue-aging':
        return generateOverdueAgingData(filteredLoans);
      
      case 'collection-success':
        return generateCollectionSuccessData(filteredActions);
      
      case 'compliance-audit':
        return generateComplianceAuditData(filteredActions);
      
      default:
        return [];
    }
  }, [reportType, startDate, endDate, loanProduct, loanStage, agentFilter, loans, actions]);

  // Generate daily collections data
  const generateDailyCollectionsData = (filteredActions: any[]) => {
    // Group payments by day
    const paymentsByDay: Record<string, {
      date: string,
      total: number,
      principal: number,
      interest: number,
      fines: number
    }> = {};

    filteredActions.forEach(action => {
      if (action.type === 'payment') {
        const date = format(new Date(action.timestamp), 'yyyy-MM-dd');
        
        if (!paymentsByDay[date]) {
          paymentsByDay[date] = {
            date,
            total: 0,
            principal: 0,
            interest: 0,
            fines: 0
          };
        }
        
        paymentsByDay[date].total += action.amount || 0;
        paymentsByDay[date].principal += action.principalAmount || 0;
        paymentsByDay[date].interest += action.interestAmount || 0;
        paymentsByDay[date].fines += action.fineAmount || 0;
      }
    });

    // Convert to array and sort by date
    return Object.values(paymentsByDay).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Generate agent productivity data
  const generateAgentProductivityData = (filteredActions: any[]) => {
    // Group actions by agent
    const actionsByAgent: Record<string, { agent: string, count: number }> = {};

    filteredActions.forEach(action => {
      const agentId = action.agentId || 'unknown';
      if (!actionsByAgent[agentId]) {
        actionsByAgent[agentId] = {
          agent: agentId,
          count: 0
        };
      }
      actionsByAgent[agentId].count += 1;
    });

    return Object.values(actionsByAgent).sort((a, b) => b.count - a.count);
  };

  // Generate loan status distribution data
  const generateLoanStatusData = (filteredLoans: any[]) => {
    // Group loans by status
    const loansByStatus: Record<string, { status: string, count: number }> = {};

    filteredLoans.forEach(loan => {
      const status = loan.status || 'unknown';
      if (!loansByStatus[status]) {
        loansByStatus[status] = {
          status,
          count: 0
        };
      }
      loansByStatus[status].count += 1;
    });

    return Object.values(loansByStatus).sort((a, b) => b.count - a.count);
  };

  // Generate overdue aging data
  const generateOverdueAgingData = (filteredLoans: any[]) => {
    // Define age buckets
    const ageBuckets = [
      { range: '1-30 days', min: 1, max: 30, count: 0 },
      { range: '31-60 days', min: 31, max: 60, count: 0 },
      { range: '61-90 days', min: 61, max: 90, count: 0 },
      { range: '91-180 days', min: 91, max: 180, count: 0 },
      { range: '181+ days', min: 181, max: Infinity, count: 0 }
    ];

    // Count loans in each age bucket
    filteredLoans.forEach(loan => {
      if (loan.status === 'overdue' && loan.daysPastDue) {
        const bucket = ageBuckets.find(b => 
          loan.daysPastDue >= b.min && loan.daysPastDue <= b.max
        );
        if (bucket) bucket.count += 1;
      }
    });

    return ageBuckets;
  };

  // Generate collection success rate data
  const generateCollectionSuccessData = (filteredActions: any[]) => {
    // Group actions by type and count successful vs unsuccessful
    const successByType: Record<string, { 
      type: string, 
      total: number, 
      successful: number,
      rate: number 
    }> = {};

    filteredActions.forEach(action => {
      const type = action.type || 'other';
      if (!successByType[type]) {
        successByType[type] = {
          type,
          total: 0,
          successful: 0,
          rate: 0
        };
      }
      
      successByType[type].total += 1;
      if (action.outcome === 'successful' || action.status === 'completed') {
        successByType[type].successful += 1;
      }
    });

    // Calculate success rates
    Object.values(successByType).forEach(item => {
      item.rate = item.total > 0 ? (item.successful / item.total) * 100 : 0;
    });

    return Object.values(successByType)
      .filter(item => item.total > 0)
      .sort((a, b) => b.rate - a.rate);
  };

  // Generate compliance audit data
  const generateComplianceAuditData = (filteredActions: any[]) => {
    // Simulate compliance issues (in a real app, this would come from actual data)
    const complainceData = filteredActions.map(action => ({
      ...action,
      compliant: Math.random() > 0.2, // 80% compliant for demo purposes
      complianceIssue: Math.random() > 0.8 ? 'Missing documentation' : 
                      Math.random() > 0.5 ? 'Unauthorized contact' : 
                      'Protocol violation'
    }));

    return complainceData;
  };

  // Get the current report's chart data
  const getPaymentDistributionData = () => {
    if (reportType !== 'daily-collections' || !reportData.length) return [];
    
    // Aggregate all payment data for pie chart
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalFines = 0;
    
    reportData.forEach((day: any) => {
      totalPrincipal += day.principal || 0;
      totalInterest += day.interest || 0;
      totalFines += day.fines || 0;
    });
    
    return [
      { name: 'Principal', value: totalPrincipal },
      { name: 'Interest', value: totalInterest },
      { name: 'Fines', value: totalFines }
    ].filter(item => item.value > 0);
  };

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle export
  const handleExport = (format: string) => {
    // In a real app, this would connect to a PDF/CSV/PNG generation service
    console.log(`Exporting report in ${format} format`);
    alert(`Export in ${format} format is not implemented in this demo.`);
  };

  // Render appropriate chart based on report type
  const renderReportChart = () => {
    if (!reportData || reportData.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">No data available for the selected filters</p>
        </div>
      );
    }

    switch (reportType) {
      case 'daily-collections':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      total: { label: "Total Collections" },
                      principal: { label: "Principal" },
                      interest: { label: "Interest" },
                      fines: { label: "Fines" }
                    }}
                  >
                    <LineChart
                      data={reportData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">{label}</div>
                                  <div className="text-right font-medium">{formatCurrency(payload[0].value)}</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      Principal: { label: "Principal" },
                      Interest: { label: "Interest" },
                      Fines: { label: "Fines" }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={getPaymentDistributionData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getPaymentDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'agent-productivity':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Agent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    count: { label: "Actions" }
                  }}
                >
                  <BarChart
                    data={reportData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" name="Actions" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'loan-status':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      count: { label: "Loans" }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={reportData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                        label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {reportData.map((_entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Loan Status by Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      count: { label: "Loans" }
                    }}
                  >
                    <BarChart
                      data={reportData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="count" fill="#8B5CF6" name="Loans" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'overdue-aging':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Overdue Loan Aging</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    count: { label: "Loans" }
                  }}
                >
                  <BarChart
                    data={reportData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#F97316" name="Overdue Loans" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'collection-success':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Success Rate by Action Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      rate: { label: "Success Rate (%)" }
                    }}
                  >
                    <BarChart
                      data={reportData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                      <Legend />
                      <Bar dataKey="rate" fill="#0EA5E9" name="Success Rate (%)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Success vs. Total Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      successful: { label: "Successful" },
                      total: { label: "Total" }
                    }}
                  >
                    <BarChart
                      data={reportData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="successful" fill="#22C55E" name="Successful" />
                      <Bar dataKey="total" fill="#94A3B8" name="Total" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'compliance-audit':
        return (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Agent</th>
                        <th className="p-2 text-left">Action Type</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.filter((item: any) => !item.compliant).map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.agentId}</td>
                          <td className="p-2">{item.type}</td>
                          <td className="p-2">{format(new Date(item.timestamp), 'yyyy-MM-dd')}</td>
                          <td className="p-2">
                            <Badge variant="destructive">Non-compliant</Badge>
                          </td>
                          <td className="p-2">{item.complianceIssue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ChartContainer
                    config={{
                      value: { label: "Actions" }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Compliant', value: reportData.filter((i: any) => i.compliant).length },
                          { name: 'Non-compliant', value: reportData.filter((i: any) => !i.compliant).length }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        <Cell fill="#22C55E" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze collection performance metrics
          </p>
        </div>

        {/* Filter panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Report Type</label>
            <Select 
              value={reportType} 
              onValueChange={setReportType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Loan Product</label>
            <Select 
              value={loanProduct} 
              onValueChange={setLoanProduct}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan product" />
              </SelectTrigger>
              <SelectContent>
                {LOAN_PRODUCTS.map(product => (
                  <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Actions</label>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Loan Stage</p>
                    <Select 
                      value={loanStage} 
                      onValueChange={setLoanStage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_STAGES.map(stage => (
                          <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <p className="text-sm font-medium mt-4 mb-2">Agent</p>
                    <Select 
                      value={agentFilter} 
                      onValueChange={setAgentFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Agents</SelectItem>
                        <SelectItem value="agent1">Agent 1</SelectItem>
                        <SelectItem value="agent2">Agent 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {EXPORT_FORMATS.map(format => (
                    <DropdownMenuItem 
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                    >
                      <format.icon className="mr-2 h-4 w-4" />
                      <span>{format.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Report content */}
        <div className="space-y-6">
          {renderReportChart()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
