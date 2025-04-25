
import React from 'react';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, Mail, MessageSquare, MapPin, FileText } from 'lucide-react';

interface Customer360ActivitiesProps {
  customerId: string;
}

const Customer360Activities: React.FC<Customer360ActivitiesProps> = ({ customerId }) => {
  const { loans, cases, actions, tasks } = useCrm();
  
  // Get all loans for this customer
  const customerLoans = loans.filter(loan => loan.customerId === customerId);
  const loanIds = customerLoans.map(loan => loan.id);
  
  // Get all cases for these loans
  const customerCases = cases.filter(c => loanIds.includes(c.loanId));
  const caseIds = customerCases.map(c => c.id);
  
  // Get all actions related to these cases
  const customerActions = actions.filter(action => caseIds.includes(action.caseId));
  
  // Get all tasks for this customer
  const customerTasks = tasks.filter(task => task.customerId === customerId);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'CALL': return <PhoneCall className="h-4 w-4" />;
      case 'EMAIL': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'VISIT': return <MapPin className="h-4 w-4" />;
      case 'LEGAL_FILING': return <FileText className="h-4 w-4" />;
      default: return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'CONTACTED': return 'bg-green-500';
      case 'PROMISE_TO_PAY': return 'bg-blue-500';
      case 'NOT_CONTACTED': return 'bg-red-500';
      case 'LEFT_MESSAGE': return 'bg-yellow-500';
      case 'DISPUTE': return 'bg-orange-500';
      case 'HARDSHIP_CLAIM': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Activities</h3>
        {customerActions.map((action) => (
          <Card key={action.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-2 rounded-md">
                {getActionIcon(action.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium capitalize">{action.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(action.actionDate), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Agent: {action.createdBy}
                </div>
                <div className="mt-1">
                  <Badge className={getOutcomeColor(action.actionResult)}>
                    {action.actionResult.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {action.notes && (
                  <div className="mt-2 text-sm bg-muted p-2 rounded">
                    {action.notes}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {customerActions.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No activities found
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tasks</h3>
        {customerTasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-2 rounded-md">
                {getActionIcon(task.taskType.toUpperCase())}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium capitalize">{task.taskType}</div>
                  <Badge variant="outline">
                    Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Assigned to: {task.assignedTo}
                </div>
                <div className="mt-1 space-x-2">
                  <Badge variant="secondary">
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">
                    {task.status}
                  </Badge>
                </div>
                {task.notes && (
                  <div className="mt-2 text-sm bg-muted p-2 rounded">
                    {task.notes}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {customerTasks.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer360Activities;
