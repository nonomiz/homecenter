"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">설정</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">일반 설정</TabsTrigger>
          <TabsTrigger value="notifications">알림 설정</TabsTrigger>
          <TabsTrigger value="security">보안 설정</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>사이트 이름</Label>
                <Input defaultValue="예약 관리 시스템" />
              </div>
              <div className="grid gap-2">
                <Label>관리자 이메일</Label>
                <Input type="email" defaultValue="admin@example.com" />
              </div>
              <div className="grid gap-2">
                <Label>시간대</Label>
                <Input defaultValue="Asia/Seoul" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance">유지보수 모드</Label>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>예약 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>최소 예약 시간 (분)</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="grid gap-2">
                <Label>최대 예약 인원</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <div className="grid gap-2">
                <Label>예약 가능 기간 (일)</Label>
                <Input type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    새로운 예약이나 취소 시 이메일로 알림을 받습니다.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    중요한 알림을 SMS로 받습니다.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>푸시 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    실시간 푸시 알림을 받습니다.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>현재 비밀번호</Label>
                <Input type="password" />
              </div>
              <div className="grid gap-2">
                <Label>새 비밀번호</Label>
                <Input type="password" />
              </div>
              <div className="grid gap-2">
                <Label>새 비밀번호 확인</Label>
                <Input type="password" />
              </div>
              <Button>비밀번호 변경</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2단계 인증</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>2단계 인증 활성화</Label>
                  <p className="text-sm text-muted-foreground">
                    로그인 시 추가 인증을 요구합니다.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 