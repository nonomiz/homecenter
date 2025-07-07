import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

interface ReportRow {
  month: string;
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
}

interface StoreReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  reportData: ReportRow[];
  onRefresh: () => void;
  onClose: () => void;
}

export function StoreReportDialog({ open, onOpenChange, storeName, reportData, onRefresh, onClose }: StoreReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-full bg-white dark:bg-[#181818]" style={{ maxWidth: '1200px' }} onInteractOutside={e => e.preventDefault()}>
        <DialogHeader className="border-b pb-2 mb-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-900 dark:text-white">店舗レポート</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex justify-between items-center mb-8">
          <div className="w-1/2">
            <table className="w-full rounded-lg overflow-hidden bg-white text-gray-900 shadow border border-gray-200 dark:bg-[#181818] dark:text-white dark:border-neutral-800">
              <tbody>
                <tr>
                  <td className="px-6 py-3 text-center bg-gray-100 text-gray-900 border-r border-gray-200 w-1/3 whitespace-nowrap font-semibold dark:bg-neutral-900 dark:text-white dark:border-neutral-800">店舗名</td>
                  <td className="px-6 py-3 text-center bg-white text-gray-900 whitespace-nowrap dark:bg-[#181818] dark:text-white">{storeName}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button className="w-24" variant="secondary" onClick={onRefresh}>更新</Button>
        </div>
        <div className="overflow-x-auto min-w-[900px]">
          <table className="w-full rounded-lg overflow-hidden bg-white text-gray-900 shadow border border-gray-200 min-w-[900px] dark:bg-[#181818] dark:text-white dark:border-neutral-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-center bg-gray-100 text-gray-900 border-b border-gray-200 whitespace-nowrap font-semibold dark:bg-neutral-900 dark:text-white dark:border-neutral-800">年月</th>
                <th className="px-6 py-3 text-center bg-gray-100 text-gray-900 border-b border-gray-200 whitespace-nowrap font-semibold dark:bg-neutral-900 dark:text-white dark:border-neutral-800">予約件数</th>
                <th className="px-6 py-3 text-center bg-gray-100 text-gray-900 border-b border-gray-200 whitespace-nowrap font-semibold dark:bg-neutral-900 dark:text-white dark:border-neutral-800">完了件数</th>
                <th className="px-6 py-3 text-center bg-gray-100 text-gray-900 border-b border-gray-200 whitespace-nowrap font-semibold dark:bg-neutral-900 dark:text-white dark:border-neutral-800">予約中件数</th>
                <th className="px-6 py-3 text-center bg-gray-100 text-gray-900 border-b border-gray-200 whitespace-nowrap font-semibold dark:bg-neutral-900 dark:text-white dark:border-neutral-800">取消件数</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-center bg-white text-gray-900 border-t border-gray-200 whitespace-nowrap dark:bg-[#181818] dark:text-white dark:border-neutral-800">{row.month}</td>
                  <td className="px-6 py-3 text-center bg-white text-gray-900 border-t border-gray-200 whitespace-nowrap dark:bg-[#181818] dark:text-white dark:border-neutral-800">{row.total}</td>
                  <td className="px-6 py-3 text-center bg-white text-gray-900 border-t border-gray-200 whitespace-nowrap dark:bg-[#181818] dark:text-white dark:border-neutral-800">{row.completed}</td>
                  <td className="px-6 py-3 text-center bg-white text-gray-900 border-t border-gray-200 whitespace-nowrap dark:bg-[#181818] dark:text-white dark:border-neutral-800">{row.pending}</td>
                  <td className="px-6 py-3 text-center bg-white text-gray-900 border-t border-gray-200 whitespace-nowrap dark:bg-[#181818] dark:text-white dark:border-neutral-800">{row.cancelled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
} 