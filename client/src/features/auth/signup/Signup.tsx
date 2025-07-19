import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Wrapper from "../Wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  registerSchema,
  type registerSchemaData,
} from "@/schema/auth/signup/signup.schema";
import { LogoImage } from "@/utils/ImageExports";

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerSchemaData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: registerSchemaData) => {
    console.log(data);
  };
  return (
    <div className="min-h-dvh flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-none">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <img src={LogoImage} alt="logo image"  className="h-20 dark:invert"/>
          </div>

          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            Create an Account
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Sign up to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Wrapper>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register("username")}
                placeholder="Naresh"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </Wrapper>

            <Wrapper>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </Wrapper>

            <Wrapper>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </Wrapper>

            <Wrapper>
              <Label
                htmlFor="passwordConfirm"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("passwordConfirm")}
                placeholder="••••••••"
              />
              {errors.passwordConfirm && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </Wrapper>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
