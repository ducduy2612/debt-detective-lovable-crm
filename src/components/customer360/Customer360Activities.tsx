
import React from 'react';
import { useCrm } from '@/context/CrmContext';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, Mail, MessageSquare, MapPin, FileText } from 'lucide-react';
import { ActionType } from '@/types/crm';

interface Customer360ActivitiesProps {
  customerId: string;
}

const Customer360Activities: React.FC<Customer360ActivitiesProps> = ({ customerId }) => {
  const { loans, cases, actions } = useCrm();
  
  // Get all loans for this customer
  const customerLoans = loans.filter(loan => loan.customerId === customerId);
  const loanIds = customerLoans.map(loan => loan.id);
  
  // Get all cases for these loans
  const customerCases = cases.filter(c => loanIds.includes(c.loanId));
  const caseIds = customerCases.map(c => c.id);
  
  // Get all actions related to these cases
  const customerActions = actions.filter(action => caseIds.includes(action.caseId));

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case ActionType.CALL:
      // Remove CALL_FOLLOWUP since it doesn't exist in the enum
        return <PhoneCall className="h-4 w-4" />;
      case ActionType.EMAIL:
        return <Mail className="h-4 w-4" />;
      case ActionType.SMS:
        return <MessageSquare className="h-4 w-4" />;
      case ActionType.VISIT:
        return <MapPin className="h-4 w-4" />;
      case ActionType.LEGAL_FILING:
      case ActionType.LEGAL_NOTICE:
        return <FileText className="h-4 w-4" />;
      default:
        return <PhoneCall className="h-4 w-4" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'CONTACTED':
        return 'bg-green-500';
      case 'PROMISE_TO_PAY':
        return 'bg-blue-500';
      case 'NOT_CONTACTED':
        return 'bg-red-500';
      case 'LEFT_MESSAGE':
        return 'bg-yellow-500';
      case 'DISPUTE':
        return 'bg-orange-500';
      case 'HARDSHIP_CLAIM':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
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
                    {format(action.actionDate, 'MMM dd, yyyy')}
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
    </div>
  );
};

export default Customer360Activities;
