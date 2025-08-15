import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ADMIN_URL } from "@/lib/inc/constants";

export interface StoreAddData {
  shop_id: string;
  password: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  charger: string;
  desc: string;
}

interface StoreAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StoreAddData) => void;
  onCancel: () => void;
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'warning';

export function StoreAddDialog({ open, onOpenChange, onSave, onCancel }: StoreAddDialogProps) {
  const [form, setForm] = useState<StoreAddData>({
    shop_id: "",
    password: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    charger: "",
    desc: "",
  });

  useEffect(() => {
    setForm({
      shop_id: "",
      password: "",
      name: "",
      email: "",
      address: "",
      phone: "",
      charger: "",
      desc: "",
    })
    setCheckStatus('idle');
    setCheckMessage('');
    setCheckPasswordStatus('idle');
    setCheckNameStatus('idle');
    setCheckEmailStatus('idle');
    setCheckPhoneStatus('idle');

    setCheckEmailMessage('');
  }, [open]);

  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [checkMessage, setCheckMessage] = useState<string>('');

  const [checkEmailMessage, setCheckEmailMessage] = useState<string>('');

  const [checkPasswordStatus, setCheckPasswordStatus] = useState<CheckStatus>('idle');
  const [checkNameStatus, setCheckNameStatus] = useState<CheckStatus>('idle');
  const [checkEmailStatus, setCheckEmailStatus] = useState<CheckStatus>('idle');
  const [checkPhoneStatus, setCheckPhoneStatus] = useState<CheckStatus>('idle');

  const handleChange = (field: keyof StoreAddData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    // shop_id가 변경되면 체크 상태를 초기화
    if (field === 'shop_id') {
      setCheckStatus('idle');
      setCheckMessage('');

      setCheckPasswordStatus('idle');
      setCheckNameStatus('idle');
      setCheckEmailStatus('idle');
      setCheckPhoneStatus('idle');

      setCheckEmailMessage('');
    }
    else if (field === 'password' || field === 'name' || field === 'email' || field === 'phone') {
      setCheckPasswordStatus('idle');
      setCheckNameStatus('idle');
      setCheckEmailStatus('idle');
      setCheckPhoneStatus('idle');

      setCheckEmailMessage('');
    }
  };

  const checkShopIdDuplicate = async () => {
    if (!form.shop_id.trim()) {
      setCheckStatus('warning');
      setCheckMessage('店舗IDを入力してください。');
      return;
    }

    setCheckStatus('checking');
    setCheckMessage('');

    try {
      // TODO: 백엔드 API 구현 후 실제 API 호출로 변경
      // const response = await apiClient.get(`/stores/check-id/${form.shop_id}`);
      // const { isAvailable } = response.data;
      const response = await fetch(`${API_ADMIN_URL}/shop_id_exist_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_id: form.shop_id
        })
      });
      
      if (response.ok) {
        const jsonData = await response.json();
        const isAvailable = jsonData.data.isExist ? false : true;
      
        if (isAvailable) {
          setCheckStatus('available');
          setCheckMessage('使用可能なIDです。');
        } else {
          setCheckStatus('duplicate');
          setCheckMessage('すでに使用中のIDです。');
        }
      }
      else {
        setCheckStatus('warning');
        setCheckMessage('確認中エラーが発生しました。');  
      }
    } catch (error) {
      setCheckStatus('warning');
      setCheckMessage('確認中エラーが発生しました。');
    }
  };

  const renderCheckResult = () => {
    switch (checkStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">確認中...</span>
          </div>
        );
      case 'available':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm">{checkMessage}</span>
          </div>
        );
      case 'duplicate':
      case 'warning':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{checkMessage}</span>
          </div>
        );
      default:
        return null;
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let status = true;
    if (!form.shop_id) {
      setCheckStatus('warning');
      setCheckMessage('店舗IDを入力してください。');
      status = false;
    }
    else if (!/^[a-zA-Z0-9]+$/.test(form.shop_id)) {
      setCheckStatus('warning');
      setCheckMessage('店舗IDは半角英数字のみ使用可能です。');
      status = false;
    }

    if (!form.password) {
      setCheckPasswordStatus('warning');
      status = false;
    }

    if (!form.name) {
      setCheckNameStatus('warning');
      status = false;
    }

    if (!form.email) {
      setCheckEmailStatus('warning');
      setCheckEmailMessage('メールを入力してください。')
      status = false;
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setCheckEmailStatus('warning');
      setCheckEmailMessage('メールアドレスの形式が無効です。')
      status = false;
    }

    if (!form.phone) {
      setCheckPhoneStatus('warning');
      status = false;
    }

    if (!status) {
      return;
    }

    // 중복체크가 완료되지 않았거나 중복인 경우 제출 방지
    if (checkStatus !== 'available') {
      // console.log('使用可能なIDなのか確認してください。')
      setCheckStatus('duplicate');
      setCheckMessage('使用可能なIDなのか確認してください。');
      return;
    }
    
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader className="border-b pb-2 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>店舗追加</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription>
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-2">
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">店舗ID</label>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input 
                    className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" 
                    value={form.shop_id} 
                    onChange={e => handleChange("shop_id", e.target.value)}
                    placeholder=""
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={checkShopIdDuplicate}
                    disabled={checkStatus === 'checking'}
                    className="whitespace-nowrap"
                  >
                    ID確認
                  </Button>
                </div>
                {renderCheckResult()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">パスワード</label>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} />
                </div>
                {renderCheckPasswordResult()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">店舗名</label>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.name} onChange={e => handleChange("name", e.target.value)} />
                </div>
                {renderCheckNameResult()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">メール</label>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.email} onChange={e => handleChange("email", e.target.value)}
                    placeholder="youremail@sample.com"
                  />
                </div>
                {renderCheckEmailResult()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">電話</label>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
                </div>
                {renderCheckPhoneResult()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">住所</label>
              <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.address} onChange={e => handleChange("address", e.target.value)} />
            </div>
            
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">充電器</label>
              <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.charger} onChange={e => handleChange("charger", e.target.value)} />
            </div>
            <div className="flex items-start gap-4">
              <label className="w-32 text-right pr-2 pt-2 text-gray-900 dark:text-gray-300">説明</label>
              <Textarea className="bg-white text-black min-h-[100px] flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.desc} onChange={e => handleChange("desc", e.target.value)} style={{maxWidth: "358px"}} />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button type="submit" className="w-24">保存</Button>
            <Button type="button" variant="secondary" className="w-24" onClick={onCancel}>キャンセル</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 