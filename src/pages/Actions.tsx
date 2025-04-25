
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ActionTable from '@/components/actions/ActionTable';
import { ActionType } from '@/types/crm';
import { useCrm } from '@/context/CrmContext';

const Actions = () => {
  const { actions } = useCrm();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredActions = React.useMemo(() => {
    let filtered = actions;

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(action => action.type === typeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(action => 
        action.caseId.toLowerCase().includes(query) ||
        action.createdBy.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [actions, searchQuery, typeFilter]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Actions</h1>
          <p className="text-muted-foreground">
            View and manage collection actions.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-[200px]">
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(ActionType).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ActionTable actions={filteredActions} />
      </div>
    </MainLayout>
  );
};

export default Actions;
