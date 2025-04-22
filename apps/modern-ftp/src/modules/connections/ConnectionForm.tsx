"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UIConnection } from "@/types/connections";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.coerce.number().min(1),
  username: z.string().min(1),
  password: z.string().optional(),
  privateKey: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export default function ConnectionForm({
  onSaved,
  defaultValues,
}: {
  onSaved: () => void;
  defaultValues?: Partial<UIConnection>;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: undefined,
      name: "",
      host: "",
      port: 22,
      username: "",
      password: "",
      privateKey: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        id: defaultValues.id,
        name: defaultValues.name || "",
        host: defaultValues.host || "",
        port: defaultValues.port || 22,
        username: defaultValues.username || "",
        password: defaultValues.password || "",
        privateKey: defaultValues.privateKey || "",
      });
    }
  }, [defaultValues, form]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: Values) => {
    setLoading(true);
    const res = await fetch("/api/connections/save", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);

    if (res.ok) onSaved();
    else alert("Failed to save connection");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. My VPS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input placeholder="example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="22" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="root" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (optional)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privateKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Private Key (optional)</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Paste your SSH private key..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : "Save Connection"}
        </Button>
      </form>
    </Form>
  );
}