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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Provinces enum from backend
const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan"];

const profileSchema = z.object({
  dob: z.string().min(1, "Date of Birth is required"), // handling as string from date input
  city: z.string().min(2, "City is required"),
  province: z.enum(PROVINCES, {
    errorMap: () => ({ message: "Please select a valid province" }),
  }),
  // Country removed as it wasn't in list of required fields for "Profile Completion" in prompt,
  // but let's keep it if backend expects it or just hide it?
  // Backend model UserInfo has country in createClientProfile destructuring but schema doesn't show it explicitly in the snippet I saw?
  // Wait, backend/controllers/client-controller.js line 8: const { ..., country, ... } = req.body;
  // But backend/models/user-info-model.js lines 1-35 DO NOT have 'country'.
  // So 'country' is likely ignored by Mongoose if not in schema. I will remove it from UI to be safe/clean.
  profileImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export function ClientProfileForm({ defaultValues, onSubmit, isSubmitting }) {
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
                  <Input placeholder="e.g. Lahore" {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCES.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a direct link to your profile image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Personal Info
        </Button>
      </form>
    </Form>
  );
}
