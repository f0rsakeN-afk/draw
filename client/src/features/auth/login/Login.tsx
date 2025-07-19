import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Wrapper from "../Wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  loginSchema,
  type loginFormData,
} from "@/schema/auth/login/login.schema";
import { LogoImage } from "@/utils/ImageExports";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: loginFormData) => {
    console.log(data);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-none">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <img
              src={LogoImage}
              alt="logo image"
              className="h-20 dark:invert"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Please log in to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Forgot your password?{" "}
            <Link
              to="/forgotpassword"
              className="text-primary font-medium hover:underline"
            >
              Forgot password
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
