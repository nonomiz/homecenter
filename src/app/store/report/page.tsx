"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { API_URL } from "@/lib/inc/constants";
import { useEffect, useState } from "react";

export default function StoreReportPage() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const storeName = "店舗本店";

  const [resMonths, setResMonths] = useState([]) as any;
  const [shopReportsDatas, setShopReportsDatas] = useState({}) as any;

  useEffect(() => {
    // 클라이언트 사이드에서만 sessionStorage 접근
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem("storeId");
      console.log("Report => ", id);
      setStoreId(id);
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchReports();
    }
  }, [storeId]);

  const fetchReports = async () => {
    if (!storeId) return;
    
    try {
      const response = await fetch(`${API_URL}/shop_reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({
          shop_id: storeId
        })
      });

      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);

        let reportDatas: any = {};
        let resDatas: any[] = jsonData.data;
        resDatas.map((data: any) => {
          if (!reportDatas[data.res_month]) {
            reportDatas[data.res_month] = {
              '0': 0,
              '1': 0,
              '9': 0
            };
          }

          reportDatas[data.res_month][data.reservation_status] = Number(data.count || 0);
        });

        console.log("reportDatas", reportDatas);
        setShopReportsDatas(reportDatas);

        let objKeys = Object.keys(reportDatas);
        console.log("objKeys", objKeys);
        setResMonths(objKeys);
        
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      
    }
  };

  const showReportDatas = () => {
    if (resMonths.length < 1) {
      return (
      <TableRow>
        <TableCell colSpan={5}>
          <div className="text-center">データがありません。</div>
        </TableCell>
      </TableRow>
      );
    }

    return (
      resMonths.map((month: any) => (
        <TableRow key={month}>
          <TableCell>{month}</TableCell>
          <TableCell>{(shopReportsDatas[month]?.['0'] || 0) + (shopReportsDatas[month]?.['1'] || 0) + (shopReportsDatas[month]?.['9'] || 0)}</TableCell>
          <TableCell>{(shopReportsDatas[month]?.['9'] || 0)}</TableCell>
          <TableCell>{(shopReportsDatas[month]?.['0'] || 0)}</TableCell>
          <TableCell>{(shopReportsDatas[month]?.['1'] || 0)}</TableCell>
        </TableRow>
      ))
    );
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        {/* <Card className="flex-1 max-w-md bg-transparent border-none shadow-none">
          <CardContent className="flex items-center p-4 bg-transparent border-none shadow-none">
            <span className="bg-muted px-4 py-2 rounded-tl-md rounded-bl-md font-semibold text-sm text-muted-foreground border border-r-0 border-border">店舗名</span>
            <span className="border px-4 py-2 rounded-tr-md rounded-br-md font-medium text-sm border-border">{storeName}</span>
          </CardContent>
        </Card> */}
        <div className="flex-1" />
        <Button onClick={() => fetchReports() } className="h-9 px-6">
          <RefreshCcw className="mr-2 h-4 w-4" />
          更新
        </Button>
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
              {showReportDatas()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 