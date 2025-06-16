"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2,
  Clock,
  Image as ImageIcon,
  Bell,
  Shield,
  CreditCard
} from "lucide-react"

export default function StoreSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">점포 설정</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">기본 정보</TabsTrigger>
          <TabsTrigger value="business">영업 정보</TabsTrigger>
          <TabsTrigger value="images">이미지</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">점포명</Label>
                  <Input id="name" placeholder="점포명을 입력하세요" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">주소</Label>
                  <Input id="address" placeholder="주소를 입력하세요" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input id="phone" placeholder="연락처를 입력하세요" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">점포 소개</Label>
                  <Textarea
                    id="description"
                    placeholder="점포 소개를 입력하세요"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                영업 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>영업 시간</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="open-time">영업 시작</Label>
                      <Input id="open-time" type="time" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="close-time">영업 종료</Label>
                      <Input id="close-time" type="time" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>휴무일</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="monday" />
                      <Label htmlFor="monday">월요일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="tuesday" />
                      <Label htmlFor="tuesday">화요일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="wednesday" />
                      <Label htmlFor="wednesday">수요일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="thursday" />
                      <Label htmlFor="thursday">목요일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="friday" />
                      <Label htmlFor="friday">금요일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="saturday" />
                      <Label htmlFor="saturday">토요일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sunday" />
                      <Label htmlFor="sunday">일요일</Label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>예약 정책</Label>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="min-guests">최소 예약 인원</Label>
                        <Input id="min-guests" type="number" min="1" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="max-guests">최대 예약 인원</Label>
                        <Input id="max-guests" type="number" min="1" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="interval">예약 간격 (분)</Label>
                      <Input id="interval" type="number" min="15" step="15" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                이미지 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>대표 이미지</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭</span>하여 이미지 업로드
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>갤러리 이미지</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {/* 이미지 갤러리 컴포넌트 추가 예정 */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>새로운 예약 알림</Label>
                    <p className="text-sm text-muted-foreground">
                      새로운 예약이 들어올 때 알림을 받습니다.
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>예약 취소 알림</Label>
                    <p className="text-sm text-muted-foreground">
                      예약이 취소될 때 알림을 받습니다.
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>리뷰 등록 알림</Label>
                    <p className="text-sm text-muted-foreground">
                      새로운 리뷰가 등록될 때 알림을 받습니다.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                보안 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">현재 비밀번호</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>비밀번호 변경</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 