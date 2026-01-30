"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { lawyerApi } from "@/lib/api/lawyer";
import { setUser } from "@/store/slices/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState, useEffect } from "react";

const formSchema = z.object({
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  city: z.string().min(2, { message: "City is required" }),
  province: z.enum(["Punjab", "Sindh", "KPK", "Balochistan"], {
    required_error: "Select a province",
  }),
  profileImageUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
});

export default function CompleteProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dob: "",
      city: "",
      province: undefined,
      profileImageUrl: "https://github.com/shadcn.png", // Default placeholder
    },
  });

  // Fetch existing info to pre-fill if editing
  const { data: infoResult } = useQuery({
    queryKey: ["lawyerInfo"],
    queryFn: lawyerApi.getInfo,
    enabled: !!user?.isProfileComplete, // Only fetch if we think there is data
  });

  useEffect(() => {
    if (infoResult?.data) {
      const info = infoResult.data;
      form.reset({
        dob: info.dob ? new Date(info.dob).toISOString().split("T")[0] : "",
        city: info.city || "",
        province: info.province || undefined,
        profileImageUrl: info.profileImageUrl || "",
      });
    }
  }, [infoResult, form]);

  const completeProfileMutation = useMutation({
    mutationFn: lawyerApi.completeProfile,
    onSuccess: (data) => {
      // Update redux with new user state (isProfileComplete: true)
      if (data.user) {
        dispatch(setUser(data.user));
      }
      router.push("/dashboard/lawyer");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Profile completion failed");
    },
  });

  function onSubmit(values) {
    setError("");
    completeProfileMutation.mutate(values);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide your details to access the Lawyer Dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Lahore" {...field} />
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Punjab">Punjab</SelectItem>
                          <SelectItem value="Sindh">Sindh</SelectItem>
                          <SelectItem value="KPK">
                            Khyber Pakhtunkhwa
                          </SelectItem>
                          <SelectItem value="Balochistan">
                            Balochistan
                          </SelectItem>
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
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={completeProfileMutation.isPending}
              >
                {completeProfileMutation.isPending
                  ? "Saving..."
                  : "Complete Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
