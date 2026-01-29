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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
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
  const tooglePassword = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "",
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
    router.push("/login");
  };
  return (
    <>
      <Card className={"w-full max-w-sm"}>
        <CardHeader>
          <CardTitle>Registration</CardTitle>
          <CardDescription>
            Please enter your credentials to register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label htmlFor="fullName">Username</Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Enter your username"
                className="mt-1"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
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
            <div className="my-3 relative">
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
              <Button
                variant="icon"
                onClick={tooglePassword}
                className="absolute top-4.5 right-1"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </Button>
            </div>
            <div className="mt-3">
              <Label htmlFor="role">Select Role</Label>
              <Select
                className="w-full"
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="lawyer">Lawyer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button type="submit" className="w-full mt-4">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full ">
            <Link href={"/login"}>Already have an account? Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default page;
