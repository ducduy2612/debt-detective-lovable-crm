
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ActionRecord, Customer } from '@/types/crm';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';
import { PhoneCall, Mail, MessageSquare, MapPin, FileText } from 'lucide-react';

interface RecentActivitiesProps {
  activities: ActionRecord[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const { customers } = useCrm();

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
      case 'CONTACTED': return 'text-green-600';
      case 'PROMISE_TO_PAY': return 'text-blue-600';
      case 'NOT_CONTACTED': return 'text-red-600';
      case 'LEFT_MESSAGE': return 'text-yellow-600';
      case 'DISPUTE': return 'text-orange-600';
      case 'HARDSHIP_CLAIM': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  // Function to find customer by matching loan and case
  const findCustomerForAction = (action: ActionRecord, customers: Customer[]): Customer | undefined => {
    // First get all loans that might be related to this case
    for (const customer of customers) {
      // Get all cases for customer's loans
      for (const loan of customer.loans) {
        for (const caseItem of loan.cases) {
          if (caseItem.id === action.caseId) {
            return customer;
          }
        }
      }
    }
    return undefined;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const customer = findCustomerForAction(activity, customers);
              return (
                <div key={activity.id} className="p-4 flex items-start space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activity.createdBy}`} />
                    <AvatarFallback>{activity.createdBy.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{activity.createdBy}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(activity.actionDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="p-1 rounded-md bg-gray-100">
                        {getActionIcon(activity.type)}
                      </div>
                      <span className="text-sm">
                        {activity.type} with {customer?.name || 'Unknown Customer'}
                      </span>
                    </div>
                    <div className={`text-xs ${getOutcomeColor(activity.actionResult)}`}>
                      Outcome: {activity.actionResult.replace(/_/g, ' ')}
                    </div>
                    {activity.notes && (
                      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        {activity.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No recent activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
