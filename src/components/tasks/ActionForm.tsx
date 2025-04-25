
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCrm } from '@/context/CrmContext';
import { ActionRecord, ActionType, Case } from '@/types/crm';
import { toast } from '@/components/ui/sonner';

type ActionSubType = 'inbound' | 'outbound' | 'missed' | 'scheduled';

interface ActionFormProps {
  caseId: string;
  onActionAdded?: () => void;
  triggerLabel?: string;
}

const ActionForm: React.FC<ActionFormProps> = ({
  caseId,
  onActionAdded,
  triggerLabel = 'Add Action',
}) => {
  const { addAction, currentAgent, cases } = useCrm();
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(ActionType.CALL);
  const [subType, setSubType] = useState<ActionSubType>('outbound');
  const [notes, setNotes] = useState('');
  const [actionResult, setActionResult] = useState('CONTACTED');
  
  // Find the related case and its loan/customer info
  const currentCase = cases.find(c => c.id === caseId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAgent) {
      toast.error('User not authenticated');
      return;
    }

    if (!notes.trim()) {
      toast.error('Please add notes for this action');
      return;
    }

    try {
      addAction({
        caseId,
        type: actionType,
        actionSubtype: subType,
        actionDate: new Date(),
        actionResult,
        notes,
        createdBy: currentAgent.id,
        updatedBy: currentAgent.id,
      });
      
      toast.success('Action added successfully');
      
      // Reset form
      setActionType(ActionType.CALL);
      setSubType('outbound');
      setNotes('');
      setActionResult('CONTACTED');
      
      // Close dialog
      setOpen(false);
      
      // Call onActionAdded callback if provided
      if (onActionAdded) {
        onActionAdded();
      }
    } catch (error) {
      toast.error('Failed to add action', {
        description: (error as Error).message
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Action</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action-type">Action Type</Label>
                <Select
                  value={actionType}
                  onValueChange={(value) => setActionType(value as ActionType)}
                >
                  <SelectTrigger id="action-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ActionType.CALL}>Call</SelectItem>
                    <SelectItem value={ActionType.EMAIL}>Email</SelectItem>
                    <SelectItem value={ActionType.SMS}>SMS</SelectItem>
                    <SelectItem value={ActionType.VISIT}>Visit</SelectItem>
                    <SelectItem value={ActionType.LEGAL_FILING}>Legal Filing</SelectItem>
                    <SelectItem value={ActionType.LEGAL_NOTICE}>Legal Notice</SelectItem>
                    <SelectItem value={ActionType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-type">Sub Type</Label>
                <Select
                  value={subType}
                  onValueChange={(value) => setSubType(value as ActionSubType)}
                >
                  <SelectTrigger id="sub-type">
                    <SelectValue placeholder="Select sub-type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <Select
                value={actionResult}
                onValueChange={setActionResult}
              >
                <SelectTrigger id="result">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="NOT_CONTACTED">Not Contacted</SelectItem>
                  <SelectItem value="LEFT_MESSAGE">Left Message</SelectItem>
                  <SelectItem value="PROMISE_TO_PAY">Promise to Pay</SelectItem>
                  <SelectItem value="DISPUTE">Dispute</SelectItem>
                  <SelectItem value="HARDSHIP_CLAIM">Hardship Claim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter details about this action..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Action</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActionForm;
