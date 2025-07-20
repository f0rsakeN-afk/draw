import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type forgotPasswordData,
  forgotPasswordSchema,
} from "@/schema/auth/forgotPassword/forgotPassword.schema";
import { Card, CardContent } from "@/components/ui/card";
import Wrapper from "../Wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoImage } from "@/utils/ImageExports";

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: forgotPasswordData) => {
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
            Forgot Password
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Enter your email address to reset your password
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Wrapper>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                {...register("email")}
                placeholder="test@gmail.com"
              />
              {errors?.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </Wrapper>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
