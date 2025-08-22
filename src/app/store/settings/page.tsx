"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Bell, Shield, Image as ImageIcon, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { API_URL } from "@/lib/inc/constants"
import { MessageDialog } from "@/components/ui/message-dialog"

interface StoreInfo {
  name: string;
  email: string;
  address: string;
  phone1: string;
  password: string;
  charger: string;
  descriptions: string;
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'warning';

export default function SettingsPage() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "",
    email: "",
    address: "",
    phone1: "",
    password: "",
    charger: "",
    descriptions: ""
  });
  const [storeId, setStoreId] = useState<string | null>(null);
  const [messageDialog, setMessageDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const [checkEmailMessage, setCheckEmailMessage] = useState<string>('');

  const [checkPasswordStatus, setCheckPasswordStatus] = useState<CheckStatus>('idle');
  const [checkNameStatus, setCheckNameStatus] = useState<CheckStatus>('idle');
  const [checkEmailStatus, setCheckEmailStatus] = useState<CheckStatus>('idle');
  const [checkPhoneStatus, setCheckPhoneStatus] = useState<CheckStatus>('idle');

  useEffect(() => {
    // 클라이언트 사이드에서만 sessionStorage 접근
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem("storeId");
      setStoreId(id);
    }
  }, []);

  useEffect(() => {
    const fetchStoreInfo = async () => {      
      if (!storeId) return;
      const response = await fetch(`${API_URL}/shop_detail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: storeId })
      });
      if (response.ok) {
        const jsonData = await response.json();
        // console.log(jsonData);
        setStoreInfo(jsonData.data);
      }
    };
    if (storeId) {
      fetchStoreInfo();
    }
  }, [storeId]);

  const handleSave = async () => {
    // console.log("Save...", storeInfo)

    let status = true;
    if (!storeInfo.password) {
      setCheckPasswordStatus('warning');
      status = false;
    }

    if (!storeInfo.name) {
      setCheckNameStatus('warning');
      status = false;
    }

    if (!storeInfo.email) {
      setCheckEmailStatus('warning');
      setCheckEmailMessage('メールを入力してください。')
      status = false;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeInfo.email)) {
      setCheckEmailStatus('warning');
      setCheckEmailMessage('メールアドレスの形式が無効です。')
      status = false;
    }

    if (!storeInfo.phone1) {
      setCheckPhoneStatus('warning');
      status = false;
    }

    if (!status) {
      return;
    }

    if (!storeId) {
      alert("Store ID is missing.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/shop_edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: storeId,
          name: storeInfo.name,
          password: storeInfo.password,
          address: storeInfo.address,
          phone: storeInfo.phone1,
          email: storeInfo.email,
          charger: storeInfo.charger,
          desc: storeInfo.descriptions
        })
      });
      if (response.ok) {
        setMessageDialog({
          isOpen: true,
          title: "",
          message: "保存しました。"
        });
      } else {
        setMessageDialog({
          isOpen: true,
          title: "",
          message: "保存に失敗しました。"
        });
      }
    } catch (error) {
      alert("エラーが発生しました。");
      console.error(error);
    }
  };

  const handleChange = (field: keyof StoreInfo, value: string) => {
    setStoreInfo((prev) => ({...prev, [field]: value}))

    if (field === 'password' || field === 'name' || field === 'email' || field === 'phone1') {
      setCheckPasswordStatus('idle');
      setCheckNameStatus('idle');
      setCheckEmailStatus('idle');
      setCheckPhoneStatus('idle');

      setCheckEmailMessage('');
    }
  }

  const renderCheckPasswordResult = () => {
    switch (checkPasswordStatus) {
      case 'warning':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">パスワードを入力してください。</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCheckNameResult = () => {
    switch (checkNameStatus) {
      case 'warning':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">店舗名を入力してください。</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCheckEmailResult = () => {
    switch (checkEmailStatus) {
      case 'warning':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{checkEmailMessage}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCheckPhoneResult = () => {
    switch (checkPhoneStatus) {
      case 'warning':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">電話番号を入力してください。</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">設定</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        {/* <TabsList>
          <TabsTrigger value="general">基本情報</TabsTrigger>
          <TabsTrigger value="hours">営業時間</TabsTrigger>
          <TabsTrigger value="images">画像</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
        </TabsList> */}

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>店舗の基本情報を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="storeId">店舗ID</Label>
                <Input
                  id="storeId"
                  value={storeId || ""}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="パスワードを入力"
                      value={storeInfo.password}
                      onChange={e => handleChange("password", e.target.value)}
                    />
                  </div>
                  {renderCheckPasswordResult()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">店舗名</Label>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      placeholder="店舗名を入力"
                      value={storeInfo.name}
                      onChange={e => handleChange("name", e.target.value) /*setStoreInfo({ ...storeInfo, name: e.target.value })*/}
                    />
                  </div>
                  {renderCheckNameResult()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メール</Label>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="メールを入力"
                      value={storeInfo.email}
                      onChange={e => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  {renderCheckEmailResult()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      placeholder="電話番号を入力"
                      value={storeInfo.phone1}
                      onChange={e => handleChange("phone1", e.target.value)}
                    />
                  </div>
                  {renderCheckPhoneResult()}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">住所</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="住所を入力"
                    value={storeInfo.address}
                    onChange={e => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="charger">充電器</Label>
                <div className="flex gap-2">
                  <Input
                    id="charger"
                    placeholder="充電器情報を入力"
                    value={storeInfo.charger}
                    onChange={e => handleChange("charger", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea id="description" placeholder="店舗の説明を入力"
                  value={storeInfo.descriptions}
                  onChange={e => handleChange("descriptions", e.target.value)}
                />
              </div>
              <Button onClick={handleSave}>保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>営業時間</CardTitle>
              <CardDescription>店舗の営業時間を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{day}曜日</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="time" className="w-[120px]" />
                    <span>〜</span>
                    <Input type="time" className="w-[120px]" />
                  </div>
                </div>
              ))}
              <Button>保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>画像管理</CardTitle>
              <CardDescription>店舗の画像を管理します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>メイン画像</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">画像をアップロード</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (最大10MB)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>サブ画像</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">画像をアップロード</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (最大10MB)</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button>保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>予約通知の設定を行います</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>予約通知</Label>
                  <p className="text-sm text-muted-foreground">新しい予約があった場合に通知を受け取ります</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>キャンセル通知</Label>
                  <p className="text-sm text-muted-foreground">予約がキャンセルされた場合に通知を受け取ります</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>リマインダー通知</Label>
                  <p className="text-sm text-muted-foreground">予約の前日にリマインダー通知を受け取ります</p>
                </div>
                <Switch />
              </div>
              <Button>保存</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>アカウントのセキュリティ設定を行います</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">現在のパスワード</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">新しいパスワード</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>パスワードを変更</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


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