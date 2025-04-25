
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActionRecord } from '@/types/crm';
import { FileText, Mail, MessageSquare, PhoneCall } from 'lucide-react';

interface ActionTableProps {
  actions: ActionRecord[];
}

const ActionTable: React.FC<ActionTableProps> = ({ actions }) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return <PhoneCall className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'SMS':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'CONTACTED':
        return 'bg-green-500';
      case 'PROMISE_TO_PAY':
        return 'bg-blue-500';
      case 'NOT_CONTACTED':
        return 'bg-red-500';
      case 'LEFT_MESSAGE':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No actions found
              </TableCell>
            </TableRow>
          ) : (
            actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getActionIcon(action.type)}
                    {action.type}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(action.actionDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{action.createdBy}</TableCell>
                <TableCell>{action.caseId}</TableCell>
                <TableCell>
                  <Badge className={getResultColor(action.actionResult)}>
                    {action.actionResult.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {action.notes}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActionTable;
