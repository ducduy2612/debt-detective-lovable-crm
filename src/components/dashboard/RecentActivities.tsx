
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CollectionAction } from '@/types/crm';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';
import { PhoneCall, Mail, MessageSquare, MapPin, FileText } from 'lucide-react';

interface RecentActivitiesProps {
  activities: CollectionAction[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const { customers } = useCrm();

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
      case 'successful': return 'text-green-600';
      case 'promise to pay': return 'text-blue-600';
      case 'unsuccessful': return 'text-red-600';
      case 'no answer': return 'text-yellow-600';
      case 'dispute': return 'text-orange-600';
      case 'cannot pay': return 'text-purple-600';
      default: return 'text-gray-600';
    }
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
              const customer = customers.find(c => c.id === activity.customerId);
              return (
                <div key={activity.id} className="p-4 flex items-start space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activity.agentName}`} />
                    <AvatarFallback>{activity.agentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{activity.agentName}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(activity.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="p-1 rounded-md bg-gray-100">
                        {getActionIcon(activity.type)}
                      </div>
                      <span className="text-sm">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} with {customer?.name || 'Unknown Customer'}
                      </span>
                    </div>
                    <div className={`text-xs ${getOutcomeColor(activity.outcome)}`}>
                      Outcome: {activity.outcome.charAt(0).toUpperCase() + activity.outcome.slice(1)}
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
