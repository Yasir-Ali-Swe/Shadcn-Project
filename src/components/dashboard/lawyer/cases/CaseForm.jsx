"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";

// Schema
const caseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.enum(
    [
      "Civil",
      "Criminal",
      "Family",
      "Corporate",
      "Labor",
      "Property",
      "Political",
      "Tax",
    ],
    { required_error: "Please select a case type" },
  ),
  description: z.string().min(20, "Description must be at least 20 characters"),
  parties: z
    .array(
      z.object({
        role: z.enum(["PLAINTIFF", "DEFENDANT"]),
        name: z.string().min(2, "Name required"),
      }),
    )
    .min(2, "At least one plaintiff and one defendant required") // Logical min?
    .refine(
      (parties) =>
        parties.some((p) => p.role === "PLAINTIFF") &&
        parties.some((p) => p.role === "DEFENDANT"),
      {
        message: "Must have at least one Plaintiff and one Defendant",
        path: ["parties"], // Attach error to field
      },
    ),
});

export function CaseForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode = "create",
}) {
  const form = useForm({
    resolver: zodResolver(caseSchema),
    defaultValues: defaultValues || {
      title: "",
      type: undefined,
      description: "",
      parties: [
        { role: "PLAINTIFF", name: "" },
        { role: "DEFENDANT", name: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parties",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Contract Dispute vs. Acme Corp"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Civil",
                            "Criminal",
                            "Family",
                            "Corporate",
                            "Labor",
                            "Property",
                            "Political",
                            "Tax",
                          ].map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the case..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Parties */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <FormLabel>Parties involved</FormLabel>
                  <FormDescription>
                    Add all plaintiffs and defendants involved in this case.
                  </FormDescription>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <FormField
                        control={form.control}
                        name={`parties.${index}.role`}
                        render={({ field }) => (
                          <FormItem className="w-[140px]">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PLAINTIFF">
                                  Plaintiff
                                </SelectItem>
                                <SelectItem value="DEFENDANT">
                                  Defendant
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`parties.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-500"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 2} // Prevent removing initial required fields logic slightly
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {form.formState.errors.parties?.root && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.parties.root.message}
                  </p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => append({ role: "PLAINTIFF", name: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Party
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Draft Case" : "Update Draft"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
