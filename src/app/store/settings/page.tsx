"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Bell, Shield, Image as ImageIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">設定</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">基本情報</TabsTrigger>
          <TabsTrigger value="hours">営業時間</TabsTrigger>
          <TabsTrigger value="images">画像</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>店舗の基本情報を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">店舗名</Label>
                <Input id="name" placeholder="店舗名を入力" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea id="description" placeholder="店舗の説明を入力" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">住所</Label>
                <div className="flex gap-2">
                  <Input id="address" placeholder="住所を入力" />
                  <Button variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input id="phone" placeholder="電話番号を入力" />
              </div>
              <Button>保存</Button>
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
    </div>
  )
} 