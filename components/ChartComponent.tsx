import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataPoint } from '../types';

interface ChartProps {
  data: DataPoint[];
  dataKey1: string;
  dataKey2?: string;
  color1?: string;
  color2?: string;
  height?: number;
  syncId?: string;
}

const ChartComponent: React.FC<ChartProps> = ({ 
  data, 
  dataKey1 = "value", 
  dataKey2,
  color1 = "#2563EB", // Blue-600
  color2 = "#DC2626", // Red-600
  height = 300,
  syncId
}) => {
  return (
    <div style={{ width: '100%', height: height }} className="bg-white rounded-lg p-2 border border-gray-100">
      <ResponsiveContainer>
        <LineChart
          data={data}
          syncId={syncId}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 11, fill: '#6B7280'}} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{fontSize: 11, fill: '#6B7280'}} 
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          {dataKey2 && (
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{fontSize: 11, fill: '#6B7280'}} 
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
          )}
          <Tooltip 
            contentStyle={{ borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '12px' }}
            itemStyle={{ padding: 0 }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="value" 
            name={dataKey1}
            stroke={color1} 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }}
          />
          {dataKey2 && (
             <Line 
             yAxisId="right"
             type="monotone" 
             dataKey="value2" 
             name={dataKey2}
             stroke={color2} 
             strokeWidth={2} 
             dot={false} 
             strokeDasharray="4 4"
             activeDot={{ r: 4 }}
           />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;