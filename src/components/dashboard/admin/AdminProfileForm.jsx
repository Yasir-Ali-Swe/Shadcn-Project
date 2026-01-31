"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  dob: z.string().min(1, "Date of Birth is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  // country: z.string().min(2, "Country is required"), // Admin controller doesn't ask for country explicitly in destructuring?
  // Controller: const { dob, city, province, profileImageUrl } = req.body;
  // It effectively ignores country. I'll omit it to be safe or include it if schema allows strictness.
  // Let's include it in UI but it might not be saved if backend ignores it.
  profileImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export function AdminProfileForm({ defaultValues, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues || {
      dob: "",
      city: "",
      province: "",
      profileImageUrl: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Islamabad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Federal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="profileImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </form>
    </Form>
  );
}
