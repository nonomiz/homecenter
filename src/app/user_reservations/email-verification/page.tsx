"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageDialog } from "@/components/ui/message-dialog";
import { Mail, ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/inc/constants";

interface EmailForm {
  email: string;
  confirmEmail: string;
}

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');
  
  const [form, setForm] = useState<EmailForm>({
    email: "",
    confirmEmail: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessageDialog({
        isOpen: true,
        title: 'エラー',
        message: '正しいメールアドレスを入力してください。',
        type: 'error'
      });
      return;
    }

    // 이메일 일치 확인
    if (form.email !== form.confirmEmail) {
      setMessageDialog({
        isOpen: true,
        title: 'エラー',
        message: 'メールアドレスが一致しません。',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // 여기에 실제 메일 전송 로직을 구현
      // 예: API 호출로 인증 메일 발송
      // await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이

      const res = await fetch(`${API_URL}/user_email_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키 포함 필수!!!
        body: JSON.stringify({ email: form.email, shop_id: storeId })
      });

      if (res.ok) {
        setMessageDialog({
          isOpen: true,
          title: '送信完了',
          message: 'メールアドレスに確認メールを送信しました。メールを確認してから予約を続行してください。',
          type: 'success'
        });
      }
      else {
        setMessageDialog({
          isOpen: true,
          title: 'エラー',
          message: 'メール送信に失敗しました。もう一度お試しください。',
          type: 'error'
        });  
      }
    } catch (error) {
      setMessageDialog({
        isOpen: true,
        title: 'エラー',
        message: 'メール送信に失敗しました。もう一度お試しください。',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (storeId) {
      router.push(`/user_reservations/${storeId}`);
    } else {
      router.push('/');
    }
  };

  const handleConfirm = () => {
    setMessageDialog({ ...messageDialog, isOpen: false });
    if (messageDialog.type === 'success' && storeId) {
      router.push(`/user_reservations/${storeId}`);
    }
  };

  return (
    <main className="container mx-auto py-8 px-2 sm:px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            {/* <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button> */}
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>メール確認</span>
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmEmail">メールアドレス（確認）</Label>
              <Input
                id="confirmEmail"
                type="email"
                value={form.confirmEmail}
                onChange={(e) => setForm({ ...form, confirmEmail: e.target.value })}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2 pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? '送信中...' : '確認メール送信'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleBack}
              >
                戻る
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* MessageDialog */}
      <MessageDialog
        open={messageDialog.isOpen}
        onOpenChange={(open) => {
          setMessageDialog({ ...messageDialog, isOpen: open })
        }}
        title={messageDialog.title}
        message={messageDialog.message}
        onConfirm={handleConfirm}
        confirmText="確認"
      />
    </main>
  );
}