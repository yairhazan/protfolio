import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { AlertTriangle, Info, AlertOctagon } from "lucide-react";

const LOG_LEVEL_ICONS = {
  info: <Info className="w-4 h-4 text-blue-500" />,
  warn: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  error: <AlertOctagon className="w-4 h-4 text-red-500" />
};

interface Log {
  id: number;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  source: string;
  message: string;
  metadata?: Record<string, any>;
  userId?: number;
}

export default function DiagnosticsPage() {
  const { data: logs = [], isLoading } = useQuery<Log[]>({
    queryKey: ["/api/logs"],
  });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">System Diagnostics</h1>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Level</TableHead>
                  <TableHead className="text-gray-300">Timestamp</TableHead>
                  <TableHead className="text-gray-300">Source</TableHead>
                  <TableHead className="text-gray-300">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {LOG_LEVEL_ICONS[log.level as keyof typeof LOG_LEVEL_ICONS]}
                        <span className={`
                          ${log.level === 'error' ? 'text-red-500' : ''}
                          ${log.level === 'warn' ? 'text-yellow-500' : ''}
                          ${log.level === 'info' ? 'text-blue-500' : ''}
                        `}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {format(new Date(log.timestamp), 'PPpp')}
                    </TableCell>
                    <TableCell className="text-gray-300">{log.source}</TableCell>
                    <TableCell className="text-gray-300">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
