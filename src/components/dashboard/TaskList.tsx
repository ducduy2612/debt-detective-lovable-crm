
import React from 'react';
import { MoreHorizontal, ArrowRight, PhoneCall, Mail, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/crm';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';

interface TaskListProps {
  title: string;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks }) => {
  const { customers, updateTaskStatus } = useCrm();

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <Mail className="h-4 w-4" />;
      case 'visit': return <MapPin className="h-4 w-4" />;
      case 'legal filing': return <FileText className="h-4 w-4" />;
      default: return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkComplete = (taskId: string) => {
    updateTaskStatus(taskId, 'completed');
  };

  const handleMarkInProgress = (taskId: string) => {
    updateTaskStatus(taskId, 'in progress');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const customer = customers.find(c => c.id === task.customerId);
              return (
                <div key={task.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-2 rounded-md">
                      {getTaskIcon(task.taskType)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {customer?.name || 'Unknown Customer'} - {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                        {task.status === 'in progress' && (
                          <Badge variant="outline">In Progress</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleMarkInProgress(task.id)}
                      >
                        Start
                      </Button>
                    )}
                    {(task.status === 'pending' || task.status === 'in progress') && (
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkComplete(task.id)}
                      >
                        Complete
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Reassign Task</DropdownMenuItem>
                        <DropdownMenuItem>Cancel Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No tasks found
            </div>
          )}
        </div>
        {tasks.length > 5 && (
          <div className="p-4 flex justify-center">
            <Button variant="ghost" className="text-sm">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
