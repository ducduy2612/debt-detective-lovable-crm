
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useCrm } from '@/context/CrmContext';
import { getLoanStatus } from '@/lib/adapters';

const OverdueLoansChart: React.FC = () => {
  const { loans } = useCrm();
  
  // Group loans by delinquencyStatus using the helper function
  const groupedLoans = loans.reduce((acc, loan) => {
    const status = getLoanStatus(loan);
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status] += 1;
    return acc;
  }, {} as Record<string, number>);
  
  const data = Object.entries(groupedLoans).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Loan Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} loans`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverdueLoansChart;
