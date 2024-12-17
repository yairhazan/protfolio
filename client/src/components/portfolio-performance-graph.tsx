import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Function to generate data for different time ranges
const generateData = (range: string) => {
  const data = [];
  const now = new Date();
  const startValue = 65000;

  const getRangeConfig = (range: string) => {
    switch (range) {
      case '1D':
        return { days: 1, interval: 1, growth: 0.001 }; // Hourly for 1 day
      case '5D':
        return { days: 5, interval: 1, growth: 0.002 }; // Daily for 5 days
      case '1M':
        return { days: 30, interval: 1, growth: 0.005 }; // Daily for 1 month
      case '6M':
        return { days: 180, interval: 7, growth: 0.01 }; // Weekly for 6 months
      case 'YTD':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        return { days: daysSinceStart, interval: 7, growth: 0.01 };
      case '1Y':
        return { days: 365, interval: 14, growth: 0.02 }; // Bi-weekly for 1 year
      case '5Y':
        return { days: 1825, interval: 30, growth: 0.05 }; // Monthly for 5 years
      case 'MAX':
        return { days: 3650, interval: 90, growth: 0.1 }; // Quarterly for 10 years
      default:
        return { days: 30, interval: 1, growth: 0.005 };
    }
  };

  const { days, interval, growth } = getRangeConfig(range);
  let currentValue = startValue;

  for (let i = days; i >= 0; i -= interval) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the growth
    const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
    currentValue *= (1 + growth * randomFactor);

    data.push({
      date: range === '1D' 
        ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
      value: Math.round(currentValue),
    });
  }

  // Calculate return percentage
  const totalReturn = ((currentValue - startValue) / startValue) * 100;
  return { data, totalReturn: totalReturn.toFixed(2) };
};

export function PortfolioPerformanceGraph() {
  const [timeRange, setTimeRange] = useState('1M');
  const { data, totalReturn } = generateData(timeRange);

  const mainTimeRanges = ['1D', '5D', '1M', '6M', 'YTD'];
  const moreTimeRanges = ['1Y', '5Y', 'MAX'];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col">
          <CardTitle className="text-gray-100 text-lg sm:text-xl">Portfolio Performance</CardTitle>
          <p className={`text-sm font-medium ${
            parseFloat(totalReturn) >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {parseFloat(totalReturn) >= 0 ? '+' : ''}{totalReturn}% Return
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {mainTimeRanges.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              className={`
                px-2 sm:px-3
                ${timeRange === range 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950'}
              `}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950"
              >
                More
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              {moreTimeRanges.map((range) => (
                <DropdownMenuItem
                  key={range}
                  className={`
                    text-gray-300 hover:text-green-500 focus:text-green-500
                    hover:bg-gray-700 focus:bg-gray-700
                    ${timeRange === range ? 'bg-gray-700 text-green-500' : ''}
                  `}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data}
              margin={{ 
                top: 5,
                right: 5,
                left: 0,
                bottom: 5 
              }}
            >
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickLine={{ stroke: '#4B5563' }}
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 