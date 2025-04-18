
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCrm } from '@/context/CrmContext';
import { useToast } from '@/hooks/use-toast';
import { ActionType, ActionOutcome } from '@/types/crm';

const formSchema = z.object({
  actionType: z.enum(['call', 'email', 'SMS', 'visit', 'legal filing'] as const),
  outcome: z.enum(['successful', 'unsuccessful', 'no answer', 'promise to pay', 'dispute', 'cannot pay'] as const),
  notes: z.string().min(1, 'Notes are required'),
});

interface ActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  customerId: string;
  loanId: string;
  predefinedActionType?: ActionType;
}

const ActionForm: React.FC<ActionFormProps> = ({
  isOpen,
  onClose,
  taskId,
  customerId,
  loanId,
  predefinedActionType
}) => {
  const { addAction } = useCrm();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actionType: predefinedActionType || 'call',
      outcome: undefined,
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const currentDate = new Date();
      await addAction({
        type: values.actionType,
        date: currentDate,
        customerId,
        loanId,
        agentId: 'current-user', // This would come from auth context in a real app
        agentName: 'Current User', // This would come from auth context in a real app
        outcome: values.outcome,
        notes: values.notes,
      });
      
      toast({
        title: "Action logged successfully",
        description: "The action has been recorded in the system.",
      });
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save action",
        description: "Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Action</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="actionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!!predefinedActionType}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="visit">Visit</SelectItem>
                      <SelectItem value="legal filing">Legal Filing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="unsuccessful">Unsuccessful</SelectItem>
                      <SelectItem value="no answer">No Answer</SelectItem>
                      <SelectItem value="promise to pay">Promise to Pay</SelectItem>
                      <SelectItem value="dispute">Dispute</SelectItem>
                      <SelectItem value="cannot pay">Cannot Pay</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter action notes..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActionForm;
