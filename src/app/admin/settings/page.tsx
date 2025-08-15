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
import { API_ADMIN_URL, API_URL } from "@/lib/inc/constants"

interface AdminInfo {
  name: string;
  email: string;
  address: string;
  phone1: string;
  password: string;
  descriptions: string;
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'warning';

export default function SettingsPage() {
  const [adminInfo, setAdminInfo] = useState<AdminInfo>({
    name: "",
    email: "",
    address: "",
    phone1: "",
    password: "",
    descriptions: ""
  });
  const [adminId, setAdminId] = useState<string | null>(null);

  const [checkEmailMessage, setCheckEmailMessage] = useState<string>('');

  const [checkPasswordStatus, setCheckPasswordStatus] = useState<CheckStatus>('idle');
  const [checkNameStatus, setCheckNameStatus] = useState<CheckStatus>('idle');
  const [checkEmailStatus, setCheckEmailStatus] = useState<CheckStatus>('idle');
  const [checkPhoneStatus, setCheckPhoneStatus] = useState<CheckStatus>('idle');

  useEffect(() => {
    // 클라이언트 사이드에서만 sessionStorage 접근
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem("adminId");
      setAdminId(id);
    }
  }, []);

  useEffect(() => {
    // TODO: 管理者情報を取得する。
    const fetchStoreInfo = async () => {      
      if (!adminId) return;
      const response = await fetch(`${API_ADMIN_URL}/admin_detail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminId })
      });
      if (response.ok) {
        const jsonData = await response.json();
        // console.log(jsonData);
        setAdminInfo(jsonData.data || {});
      }
    };
    if (adminId) {
      fetchStoreInfo();
    }
  }, [adminId]);

  const handleSave = async () => {
    // console.log("Save...")

    let status = true;
    if (!adminInfo.password) {
      setCheckPasswordStatus('warning');
      status = false;
    }

    if (!adminInfo.name) {
      setCheckNameStatus('warning');
      status = false;
    }

    if (!adminInfo.email) {
      setCheckEmailStatus('warning');
      setCheckEmailMessage('メールを入力してください。')
      status = false;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminInfo.email)) {
      setCheckEmailStatus('warning');
      setCheckEmailMessage('メールアドレスの形式が無効です。')
      status = false;
    }

    if (!adminInfo.phone1) {
      setCheckPhoneStatus('warning');
      status = false;
    }

    if (!status) {
      return;
    }

    if (!adminId) {
      alert("Store ID is missing.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/shop_edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: adminId,
          name: adminInfo.name,
          password: adminInfo.password,
          address: adminInfo.address,
          phone: adminInfo.phone1,
          email: adminInfo.email,
          desc: adminInfo.descriptions
        })
      });
      if (response.ok) {
        alert("保存しました。");
      } else {
        alert("保存に失敗しました。");
      }
    } catch (error) {
      alert("エラーが発生しました。");
      console.error(error);
    }
  };

  const handleChange = (field: keyof AdminInfo, value: string) => {
    setAdminInfo((prev) => ({...prev, [field]: value}))

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
            <span className="text-sm">管理者名を入力してください。</span>
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

      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="storeId">管理者ID</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="storeId"
                  value={adminId || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="password">パスワード</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="パスワードを入力"
                  value={adminInfo.password}
                  onChange={e => handleChange("password", e.target.value)}
                />
              </div>
              {renderCheckPasswordResult()}
            </div>
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="name">管理者名</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="name"
                  placeholder="管理者名を入力"
                  value={adminInfo.name}
                  onChange={e => handleChange("name", e.target.value)}
                />
              </div>
              {renderCheckNameResult()}
            </div>
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="email">メール</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="メールを入力"
                  value={adminInfo.email}
                  onChange={e => handleChange("email", e.target.value)}
                />
              </div>
              {renderCheckEmailResult()}
            </div>
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="phone">電話番号</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="phone"
                  placeholder="電話番号を入力"
                  value={adminInfo.phone1}
                  onChange={e => handleChange("phone1", e.target.value)}
                />
              </div>
              {renderCheckPhoneResult()}
            </div>
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="address">住所</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  id="address"
                  placeholder="住所を入力"
                  value={adminInfo.address}
                  onChange={e => handleChange("address", e.target.value)}
                />
              </div>
            </div>
          </div>          
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="description">説明</Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Textarea id="description" placeholder="管理者の説明を入力" 
                  value={adminInfo.descriptions}
                  onChange={e => handleChange("descriptions", e.target.value)}
                
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSave}>保存</Button>
        </CardContent>
      </Card>
    </div>
  )
} 