import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { API_ADMIN_URL } from "@/lib/inc/constants";

export interface StoreEditData {
  shop_id: string;
  name: string;
  email: string;
  address: string;
  phone1: string;
  password: string;
  charger: string;
  descriptions: string;
}

interface StoreEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: StoreEditData | null;
  onSave: (data: StoreEditData) => void;
  onCancel: () => void;
  title?: string;
}

interface StoreInfo {
  shop_id: string;
  name: string;
  email: string;
  address: string;
  phone1: string;
  password: string;
  charger: string;
  descriptions: string;
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'warning';

export function StoreEditDialog({ open, onOpenChange, store, onSave, onCancel, title }: StoreEditDialogProps) {
  const [form, setForm] = useState<StoreInfo>({
    shop_id: "",
    password: "",
    name: "",
    email: "",
    address: "",
    phone1: "",
    charger: "",
    descriptions: "",
  });

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    shop_id: "",
    name: "",
    email: "",
    address: "",
    phone1: "",
    password: "",
    charger: "",
    descriptions: ""
  });

  const [checkEmailMessage, setCheckEmailMessage] = useState<string>('');

  const [checkPasswordStatus, setCheckPasswordStatus] = useState<CheckStatus>('idle');
  const [checkNameStatus, setCheckNameStatus] = useState<CheckStatus>('idle');
  const [checkEmailStatus, setCheckEmailStatus] = useState<CheckStatus>('idle');
  const [checkPhoneStatus, setCheckPhoneStatus] = useState<CheckStatus>('idle');


  const fetchStore = async () => {
    if (store) {
      const response = await fetch(`${API_ADMIN_URL}/shop_detail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: store.shop_id })
      });
      if (response.ok) {
        const jsonData = await response.json();
        // console.log(jsonData);
        jsonData.data.charger = jsonData.data.charger || "";
        jsonData.data.descriptions = jsonData.data.descriptions || "";
        setStoreInfo(jsonData.data);
        setForm(jsonData.data);
      }
    }
  }

  useEffect(() => {
    // if (store) setForm(store);
    if (open) {
      fetchStore();

      setCheckPasswordStatus('idle');
      setCheckNameStatus('idle');
      setCheckEmailStatus('idle');
      setCheckPhoneStatus('idle');

      setCheckEmailMessage('');
    }
  }, [store, open]);

  const handleChange = (field: keyof StoreEditData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === 'password' || field === 'name' || field === 'email' || field === 'phone1') {
      setCheckPasswordStatus('idle');
      setCheckNameStatus('idle');
      setCheckEmailStatus('idle');
      setCheckPhoneStatus('idle');

      setCheckEmailMessage('');
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

    if (!form.phone1) {
      setCheckPhoneStatus('warning');
      status = false;
    }

    if (!status) {
      return;
    }

    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader className="border-b pb-2 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle>{title || "店舗編集"}</DialogTitle>
           
          </div>
        </DialogHeader>
        <DialogDescription>
        </DialogDescription>
        <form
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4 mb-2">
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">店舗ID</label>
              <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.shop_id} onChange={e => handleChange("shop_id", e.target.value)} readOnly maxLength={50}/>
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
                  <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.email} onChange={e => handleChange("email", e.target.value)} />
                </div>
                {renderCheckEmailResult()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">電話</label>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input className="bg-white text-black text-left flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.phone1} onChange={e => handleChange("phone1", e.target.value)} />
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
              <Textarea className="bg-white text-black min-h-[100px] flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.descriptions} onChange={e => handleChange("descriptions", e.target.value)} style={{maxWidth: "358px"}} />
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