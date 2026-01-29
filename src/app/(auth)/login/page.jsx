"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const tooglePassword=()=>{
    setShowPassword(!showPassword)
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/home");
  };
  return (
    <>
      <Card className={"w-full max-w-sm"}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Please enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="my-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="mt-1"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button variant="icon" onClick={tooglePassword} className="absolute top-4.5 right-1">
                {
                    showPassword ? <EyeOff className="size-5"/> : <Eye className="size-5" />
                }
              </Button>
            </div>
            <div>
              <Button type="submit" className="w-full mt-4">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full ">
            <Link href={"/registeration"}>Don't have an account? Register</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default page;
