"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { StoreEditDialog, StoreEditData } from "@/components/admin/StoreEditDialog"
import { StoreAddDialog, StoreAddData } from "@/components/admin/StoreAddDialog"
import { useEffect, useState } from "react"
import { StoreReportDialog } from "@/components/admin/StoreReportDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { API_ADMIN_URL, API_URL } from "@/lib/inc/constants"
import { MessageDialog } from "@/components/ui/message-dialog"

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editStore, setEditStore] = useState<StoreEditData | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportStoreName, setReportStoreName] = useState("");
  const [reportStoreId, setReportStoreId] = useState("");
  const [reportData, setReportData] = useState([
    { month: "2025-06", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-05", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-04", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-03", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-02", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-01", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-04", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-04", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-04", total: 100, completed: 70, pending: 10, cancelled: 20 },
    { month: "2025-04", total: 100, completed: 70, pending: 10, cancelled: 20 },
  ]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoreEditData | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [messageDialog, setMessageDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const handleEdit = (store: StoreEditData) => {
    setEditStore(store);
    setEditOpen(true);
  };
  const handleSave = async (data: StoreEditData) => {
    setEditOpen(false);
    // 저장 로직 추가 가능

    const response = await fetch(`${API_ADMIN_URL}/shop_edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop_id: data.shop_id,
        name: data.name,
        password: data.password,
        address: data.address,
        phone: data.phone1,
        email: data.email,
        desc: data.descriptions
      })
    });

    if (response.ok) {
      setMessageDialog({
        isOpen: true,
        title: "店舗編集",
        message: "保存しました。"
      });

      fetchShopList();
    }
    else {
      setMessageDialog({
        isOpen: true,
        title: "店舗編集",
        message: "保存できませんでした。"
      });
    }
  };
  const handleCancel = () => {
    setEditOpen(false);
  };
  
  const handleReport = async (store: StoreEditData) => {
    // store
    await handleReportRefresh(store.shop_id);

    setReportStoreName(store.name);
    setReportStoreId(store.shop_id);
    setReportOpen(true);
  };
  const handleReportRefresh = async (storeId: string) => {
    const response = await fetch(`${API_ADMIN_URL}/shop_reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        shop_id: storeId
      })
    });

    if (response.ok) {
      const jsonData = await response.json();
      // console.log(jsonData);

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

      // console.log("reportDatas", reportDatas);
      // setShopReportsDatas(reportDatas);

      let objKeys = Object.keys(reportDatas);
      // console.log("objKeys", objKeys);
      // setResMonths(objKeys);
      
      let storeReportData: any[] = [];
      objKeys.forEach((month) => {
        let srdData: any = {};
        srdData["month"] = month;
        let total = 0;
        srdData["completed"] = Number(reportDatas[month]["9"] || "0");
        srdData["pending"] = Number(reportDatas[month]["0"] || "0");
        srdData["cancelled"] = Number(reportDatas[month]["1"] || "0");
        srdData["total"] = srdData["completed"] + srdData["pending"] + srdData["cancelled"];
        storeReportData.push(srdData);
      });

      setReportData(storeReportData);
    }
  };
  const handleReportClose = () => {
    setReportOpen(false);
  };
  const handleDelete = (store: StoreEditData) => {
    setDeleteTarget(store);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    // 실제 삭제 로직 추가 가능
    const response = await fetch(`${API_ADMIN_URL}/shop_delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        shop_id : deleteTarget?.shop_id,
      })
    });

    await fetchShopList();

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };
  const handleAdd = () => {
    setAddOpen(true);
  };
  const handleAddSave = async(data: StoreAddData) => {
    const bodyData = JSON.stringify(data);
    // console.log(bodyData);
    
    setAddOpen(false);
    // 신규 등록 로직 추가 가능

    const response = await fetch(`${API_ADMIN_URL}/shop_add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    });

    if (response.ok) {
      const jsonBody = await response.json();
      // console.log(jsonBody);
      setMessageDialog({
        isOpen: true,
        title: '店舗追加成功',
        message: "店舗追加が完了しました。",
      });

      fetchShopList();
    }
    else {
      const jsonBody = await response.json();
      // console.log(jsonBody);
      setMessageDialog({
        isOpen: true,
        title: '店舗追加失敗',
        message: jsonBody.message,
      });
    }
  };
  const handleAddCancel = () => {
    setAddOpen(false);
  };

  /**
   * ショップリスト情報を取得する。
   */
  const fetchShopList = async () => {
    const response = await fetch(`${API_ADMIN_URL}/admin_shop_list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonBody = await response.json();
    // console.log(jsonBody);

    setStores(jsonBody.data);
  }

  useEffect(() => {
    fetchShopList();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6" style={{minWidth: "1180px"}}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight"></h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            店舗追加
          </Button>
        </div>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 점포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">운영중인 점포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">휴점중인 점포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 예약률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div> */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>店舗リスト</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="店舗名で検索"
                  className="pl-8"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  placeholder="電話番号で検索"
                  className="pl-8"
                  value={phoneSearch}
                  onChange={e => setPhoneSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  placeholder="メールで検索"
                  className="pl-8"
                  value={emailSearch}
                  onChange={e => setEmailSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Button onClick={fetchShopList}>
                  <RefreshCcw className="mr-2 h-4 w-4"/>
                  更新
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 헤더 테이블 (고정) */}
          <div className="max-h-[500px] overflow-y-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">店舗名</TableHead>
                <TableHead className="w-64">住所</TableHead>
                <TableHead className="w-32">電話</TableHead>
                <TableHead className="w-40">メール</TableHead>
                <TableHead className="w-24 text-center">予約件数</TableHead>
                <TableHead className="w-24 text-center">完了件数</TableHead>
                <TableHead className="w-24 text-center">予約中件数</TableHead>
                <TableHead className="w-24 text-center">取消件数</TableHead>
                <TableHead className="text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
          {/* </Table> */}
          {/* 바디 테이블 (스크롤) */}
            {/* <Table className="w-full table-fixed"> */}
              <TableBody>
                {stores
                  .filter((row: any) => row.name.includes(search) && row.phone1.includes(phoneSearch) && row.email.includes(emailSearch))
                  .map((row: any, i) => (
                  <TableRow key={i}>
                    <TableCell className="w-32">{row.name}</TableCell>
                    <TableCell className="w-64">{row.address}</TableCell>
                    <TableCell className="w-32">{row.phone1}</TableCell>
                    <TableCell className="w-40">{row.email}</TableCell>
                    <TableCell className="w-24 text-center">{row.res_total}</TableCell>
                    <TableCell className="w-24 text-center">{row.res_completed}</TableCell>
                    <TableCell className="w-24 text-center">{row.res_ing}</TableCell>
                    <TableCell className="w-24 text-center">{row.res_canceled}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>編集</Button>
                      <Button variant="outline" size="sm" onClick={() => handleReport(row)}>レポート</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(row)}>削除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <StoreEditDialog open={editOpen} onOpenChange={setEditOpen} store={editStore} onSave={handleSave} onCancel={handleCancel} title="店舗編集" />
      <StoreReportDialog open={reportOpen} onOpenChange={setReportOpen} storeName={reportStoreName} storeId={reportStoreId} reportData={reportData} onRefresh={handleReportRefresh} onClose={handleReportClose} />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[350px] max-w-[90vw]" onInteractOutside={e => e.preventDefault()}>
          <DialogHeader className="text-center">
            <DialogTitle>削除しますか？</DialogTitle>
          </DialogHeader>
          <DialogDescription>
          </DialogDescription>
          <div className="flex justify-evenly gap-4 mt-6">
            <Button onClick={handleDeleteConfirm}>確認</Button>
            <Button variant="outline" onClick={handleDeleteCancel}>キャンセル</Button>
          </div>
        </DialogContent>
      </Dialog>
      <StoreAddDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleAddSave} onCancel={handleAddCancel} />
      {/* MessageDialog */}
      <MessageDialog
        open={messageDialog.isOpen}
        onOpenChange={(open) => {
          setMessageDialog({ ...messageDialog, isOpen: open })
        }}
        title={messageDialog.title}
        message={messageDialog.message}
        onConfirm={() => {
          setMessageDialog({ ...messageDialog, isOpen: false })
        }}
        confirmText="確認"
      />
    </div>
  )
} 