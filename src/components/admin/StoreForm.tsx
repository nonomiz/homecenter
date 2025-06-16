"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const storeFormSchema = z.object({
  name: z.string().min(2, {
    message: "점포명은 2자 이상이어야 합니다.",
  }),
  address: z.string().min(5, {
    message: "주소를 정확히 입력해주세요.",
  }),
  phone: z.string().regex(/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/, {
    message: "올바른 전화번호 형식이 아닙니다.",
  }),
  status: z.enum(["active", "inactive"]),
  businessHours: z.object({
    open: z.string(),
    close: z.string(),
  }),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

export function StoreForm() {
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      status: "active",
      businessHours: {
        open: "09:00",
        close: "18:00",
      },
    },
  });

  function onSubmit(data: StoreFormValues) {
    console.log(data);
    // API 호출 로직 추가 예정
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>점포명</FormLabel>
              <FormControl>
                <Input placeholder="점포명을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주소</FormLabel>
              <FormControl>
                <Input placeholder="주소를 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연락처</FormLabel>
              <FormControl>
                <Input placeholder="02-123-4567" {...field} />
              </FormControl>
              <FormDescription>
                하이픈(-)을 포함하여 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>운영 상태</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="운영 상태를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">운영중</SelectItem>
                  <SelectItem value="inactive">운영중지</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessHours.open"
            render={({ field }) => (
              <FormItem>
                <FormLabel>영업 시작 시간</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessHours.close"
            render={({ field }) => (
              <FormItem>
                <FormLabel>영업 종료 시간</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">점포 등록</Button>
      </form>
    </Form>
  );
} 