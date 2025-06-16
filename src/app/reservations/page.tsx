"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ReservationsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">예약하기</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>점포 검색</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="점포명 또는 지역으로 검색..."
                  className="pl-8"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="gyeonggi">경기</SelectItem>
                  <SelectItem value="incheon">인천</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* 점포 카드 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">스타벅스 강남점</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    서울시 강남구 테헤란로 123
                  </p>
                  <Button className="mt-4 w-full">예약하기</Button>
                </CardContent>
              </Card>
              {/* 더 많은 점포 카드 추가 예정 */}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>예약 가능 일정</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium">예약 가능 시간</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">10:00</Button>
                <Button variant="outline" size="sm">11:00</Button>
                <Button variant="outline" size="sm">12:00</Button>
                <Button variant="outline" size="sm">13:00</Button>
                <Button variant="outline" size="sm">14:00</Button>
                <Button variant="outline" size="sm">15:00</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 