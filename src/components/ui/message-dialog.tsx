import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  cancelText?: string;
}

export function MessageDialog({
  open,
  onOpenChange,
  title = "お知らせ",
  message,
  onConfirm,
  confirmText = "確認",
  showCancel = false,
  onCancel,
  cancelText = "キャンセル",
}: MessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
        </DialogDescription>
        <div className="py-4 text-center text-base whitespace-pre-line">{message}</div>
        <DialogFooter>
          {showCancel && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onCancel?.();
              }}
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 