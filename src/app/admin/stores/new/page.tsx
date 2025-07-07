"use client"

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminStoreNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    id: "Store1",
    password: "1234",
    name: "스토어 본점",
    email: "store1@exam.com",
    address: "",
    phone: "000-0000-0000",
    desc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 저장 로직 추가 가능
    router.push("/admin/stores");
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">점포 추가</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>점포 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-medium">아이디</label>
                <Input name="id" value={form.id} onChange={handleChange} className="flex-1" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-medium">Password</label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} className="flex-1" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-medium">스토어명</label>
                <Input name="name" value={form.name} onChange={handleChange} className="flex-1" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-medium">이메일</label>
                <Input name="email" value={form.email} onChange={handleChange} className="flex-1" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-medium">주소</label>
                <Input name="address" value={form.address} onChange={handleChange} className="flex-1" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-right text-sm font-medium">전화번호</label>
                <Input name="phone" value={form.phone} onChange={handleChange} className="flex-1" />
              </div>
              <div className="flex items-start gap-4">
                <label className="w-24 text-right text-sm font-medium pt-2">설명</label>
                <Textarea name="desc" value={form.desc} onChange={handleChange} className="flex-1 min-h-[100px]" style={{maxWidth: "466px"}}/>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="submit">저장</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/stores")}>취소</Button>
        </div>
      </form>
    </div>
  );
} 