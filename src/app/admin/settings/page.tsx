"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Bell, Shield, Image as ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { API_ADMIN_URL, API_URL } from "@/lib/inc/constants"

export default function SettingsPage() {
  const [adminInfo, setAdminInfo] = useState({
    shop_id: "",
    email: "",
    name: "",
    address: "",
    phone1: "",
    password: "",
    descriptions: ""
  });

  useEffect(() => {
    // TODO: 管理者情報を取得する。
    const fetchStoreInfo = async () => {      
      const adminId = sessionStorage.getItem("adminId");
      if (!adminId) return;
      const response = await fetch(`${API_ADMIN_URL}/admin_detail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminId })
      });
      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);
        setAdminInfo(jsonData.data || {});
      }
    };
    fetchStoreInfo();
  }, []);

  const handleSave = async () => {
    console.log("Save...")

    const storeId = sessionStorage.getItem("adminId");
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
            <Input
              id="storeId"
              value={sessionStorage.getItem("adminId") || ""}
              readOnly
            />
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder="パスワードを入力"
              value={adminInfo.password}
              onChange={e => setAdminInfo({ ...adminInfo, password: e.target.value })}
            />
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="name">管理者名</Label>
            <Input
              id="name"
              placeholder="管理者名を入力"
              value={adminInfo.name}
              onChange={e => setAdminInfo({ ...adminInfo, name: e.target.value })}
            />
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="email">メール</Label>
            <Input
              id="email"
              type="email"
              placeholder="メールを入力"
              value={adminInfo.email}
              onChange={e => setAdminInfo({ ...adminInfo, email: e.target.value })}
            />
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="address">住所</Label>
            <Input
              id="address"
              placeholder="住所を入力"
              value={adminInfo.address}
              onChange={e => setAdminInfo({ ...adminInfo, address: e.target.value })}
            />
              {/* <Button variant="outline" size="icon">
                <MapPin className="h-4 w-4" />
              </Button> */}
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              placeholder="電話番号を入力"
              value={adminInfo.phone1}
              onChange={e => setAdminInfo({ ...adminInfo, phone1: e.target.value })}
            />
          </div>
          <div className="flex space-x-2 align-middle">
            <Label className="w-[140px] text-right" htmlFor="description">説明</Label>
            <Textarea id="description" placeholder="管理者の説明を入力" 
              value={adminInfo.descriptions}
              onChange={e => setAdminInfo({ ...adminInfo, descriptions: e.target.value })}
            
            />
          </div>
          <Button onClick={handleSave}>保存</Button>
        </CardContent>
      </Card>
    </div>
  )
} 