"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function StoreReportPage() {
  const storeId = sessionStorage.getItem("storeId");
  console.log("Report => ", storeId);
  const storeName = "店舗本店";
  const reportData = [
    { month: "2025-06", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-05", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-04", total: 100, completed: 70, pending: 10, cancelled: 20 },
  ];

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <Card className="flex-1 max-w-md bg-transparent border-none shadow-none">
          <CardContent className="flex items-center gap-2 p-4 bg-transparent border-none shadow-none">
            <span className="bg-muted px-4 py-2 rounded-tl-md rounded-bl-md font-semibold text-sm text-muted-foreground border border-r-0 border-border">店舗名</span>
            <span className="border px-4 py-2 rounded-tr-md rounded-br-md font-medium text-sm border-border">{storeName}</span>
          </CardContent>
        </Card>
        <div className="flex-1" />
        <Button className="h-9 px-6">更新</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>月間予約通計</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>年月</TableHead>
                <TableHead>予約件数</TableHead>
                <TableHead>完了件数</TableHead>
                <TableHead>予約中件数</TableHead>
                <TableHead>取消件数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.completed}</TableCell>
                  <TableCell>{row.pending}</TableCell>
                  <TableCell>{row.cancelled}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 