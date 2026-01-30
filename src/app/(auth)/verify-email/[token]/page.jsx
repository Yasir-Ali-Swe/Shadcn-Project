"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage({ params }) {
  const { token } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email...");

  const verifyMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message || "Email verified successfully!");
    },
    onError: (err) => {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Verification failed. Invalid or expired token.",
      );
    },
  });

  const effectRan = useRef(false);

  useEffect(() => {
    if (token && !effectRan.current) {
      verifyMutation.mutate(token);
      effectRan.current = true;
    }
  }, [token]);

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          {status === "verifying" &&
            "Please wait while we verify your email address."}
          {status === "success" && "Your email has been successfully verified."}
          {status === "error" && "There was an issue verifying your email."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className={`mb-4 text-sm ${status === "error" ? "text-red-500" : "text-gray-600"}`}
        >
          {message}
        </p>

        {status === "success" && (
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        )}

        {status === "error" && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
