
import React, { useMemo } from 'react';
import { BarChart, CreditCard, DollarSign, Users } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import TaskList from '@/components/dashboard/TaskList';
import OverdueLoansChart from '@/components/dashboard/OverdueLoansChart';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { useCrm } from '@/context/CrmContext';
import { getLoanStatus, getLoanOutstandingAmount, getActionDate } from '@/lib/adapters';

const Dashboard = () => {
  const { loans, tasks, actions, payments, currentAgent } = useCrm();
  const agent = currentAgent;

  // Filter to only show tasks assigned to current user and active (not completed/cancelled)
  const myTasks = useMemo(() => {
    if (!agent) return [];
    return tasks
      .filter(task => task.assignedTo === agent.id && 
               (task.status === 'pending' || task.status === 'in progress'))
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder] - 
                            priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by due date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);
  }, [tasks, agent]);

  // Calculate total overdue amount
  const totalOverdueAmount = useMemo(() => {
    return loans
      .filter(loan => getLoanStatus(loan) === 'overdue' || getLoanStatus(loan) === 'default')
      .reduce((sum, loan) => sum + getLoanOutstandingAmount(loan), 0);
  }, [loans]);

  // Calculate collection rate (payments last 30 days / overdue amounts)
  const collectionRate = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPayments = payments
      .filter(payment => new Date(payment.paymentDate) >= thirtyDaysAgo)
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return totalOverdueAmount > 0 
      ? Math.round((recentPayments / totalOverdueAmount) * 100) 
      : 0;
  }, [payments, totalOverdueAmount]);

  // Get recent activities
  const recentActivities = useMemo(() => {
    return actions
      .sort((a, b) => getActionDate(b).getTime() - getActionDate(a).getTime())
      .slice(0, 5);
  }, [actions]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your collection activities and performance overview.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Customers" 
            value="3,240"
            icon={<Users className="h-4 w-4" />}
            description="Active accounts"
            trend={{ value: 2.5, isPositive: true }}
          />
          <StatCard 
            title="Active Loans" 
            value="6,518"
            icon={<CreditCard className="h-4 w-4" />}
            description="Across all products"
          />
          <StatCard 
            title="Overdue Amount" 
            value={`$${(totalOverdueAmount / 1000000).toFixed(1)}M`}
            icon={<BarChart className="h-4 w-4" />}
            description="Total outstanding"
            trend={{ value: 0.8, isPositive: false }}
          />
          <StatCard 
            title="Collection Rate" 
            value={`${collectionRate}%`}
            icon={<DollarSign className="h-4 w-4" />}
            description="Last 30 days"
            trend={{ value: 1.2, isPositive: true }}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <TaskList title="My Tasks" tasks={myTasks} />
          <OverdueLoansChart />
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
