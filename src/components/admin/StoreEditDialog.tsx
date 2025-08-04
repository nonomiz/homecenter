import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export interface StoreEditData {
  id: string;
  password: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  description: string;
}

interface StoreEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: StoreEditData | null;
  onSave: (data: StoreEditData) => void;
  onCancel: () => void;
  title?: string;
}

export function StoreEditDialog({ open, onOpenChange, store, onSave, onCancel, title }: StoreEditDialogProps) {
  const [form, setForm] = useState<StoreEditData>({
    id: "",
    password: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    description: "",
  });

  const fetchStore = () => {

  }

  useEffect(() => {
    if (store) setForm(store);
  }, [store]);

  const handleChange = (field: keyof StoreEditData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <div className="flex flex-col gap-4 mb-2">
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">店舗ID</label>
              <Input className="bg-white text-black text-center font-semibold flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.id} onChange={e => handleChange("id", e.target.value)} readOnly maxLength={50}/>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">パスワード</label>
              <Input className="bg-white text-black text-center font-semibold flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">店舗名</label>
              <Input className="bg-white text-black text-center font-semibold flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.name} onChange={e => handleChange("name", e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">メール</label>
              <Input className="bg-white text-black text-center font-semibold flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.email} onChange={e => handleChange("email", e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">住所</label>
              <Input className="bg-white text-black text-center font-semibold flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.address} onChange={e => handleChange("address", e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right pr-2 text-gray-900 dark:text-gray-300">電話</label>
              <Input className="bg-white text-black text-center font-semibold flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
            </div>
            <div className="flex items-start gap-4">
              <label className="w-32 text-right pr-2 pt-2 text-gray-900 dark:text-gray-300">説明</label>
              <Textarea className="bg-white text-black font-semibold min-h-[100px] flex-1 border border-gray-300 shadow-sm rounded-lg placeholder-gray-400 dark:bg-[#181818] dark:text-white dark:border-neutral-800 dark:placeholder-gray-500" value={form.description} onChange={e => handleChange("description", e.target.value)} style={{maxWidth: "358px"}} />
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