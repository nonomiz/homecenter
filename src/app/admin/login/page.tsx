"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { API_ADMIN_URL } from "@/lib/inc/constants"

export default function AdminLoginPage() {
  const router = useRouter()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // TODO: 실제 로그인 API 연동
    const res = await fetch(`${API_ADMIN_URL}/admin_login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 쿠키 포함 필수!!!
      body: JSON.stringify({ adminId: id, password: password })
    });

    const jsonBody = await res.json(); // 응답을 JSON으로 변환
    // console.log(jsonBody); // 응답 JSON 확인

    if (res.ok) {
      // 로그인 성공 시 세션 저장
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("adminLoggedIn", "true")
        sessionStorage.setItem("adminToken", jsonBody.data.token)
        sessionStorage.setItem("adminId", id)
      }
      router.push("/admin/stores")
    } else {
      setError("IDまたはパスワードが正しくありません。")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>管理者ログイン</CardTitle>
          <CardDescription>
            
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ID</Label>
              <Input
                id="id"
                type="text"
                placeholder="admin"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 