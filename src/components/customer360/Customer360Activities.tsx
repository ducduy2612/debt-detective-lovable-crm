
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
  const { actions, tasks } = useCrm();
  
  const customerActions = actions.filter(action => action.customerId === customerId);
  const customerTasks = tasks.filter(task => task.customerId === customerId);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'visit': return <MapPin className="h-4 w-4" />;
      case 'legal filing': return <FileText className="h-4 w-4" />;
      default: return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'successful': return 'bg-green-500';
      case 'promise to pay': return 'bg-blue-500';
      case 'unsuccessful': return 'bg-red-500';
      case 'no answer': return 'bg-yellow-500';
      case 'dispute': return 'bg-orange-500';
      case 'cannot pay': return 'bg-purple-500';
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
                    {format(new Date(action.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Agent: {action.agentName}
                </div>
                <div className="mt-1">
                  <Badge className={getOutcomeColor(action.outcome)}>
                    {action.outcome}
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
                {getActionIcon(task.taskType)}
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
