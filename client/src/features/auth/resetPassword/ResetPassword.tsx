import React from "react";
import { useForm } from "react-hook-form";
import {
  resetPasswordSchema,
  type resetPasswordData,
} from "@/schema/auth/resetPassword/resetPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Wrapper from "../Wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogoImage } from "@/utils/ImageExports";

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: resetPasswordData) => {
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
            Set a New Password
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Just one step away! Enter your new password below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="Enter a new password"
                {...register("password")}
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
                Password Confirm
              </Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="Please confirm your password"
                {...register("passwordConfirm")}
              />
              {errors.passwordConfirm && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.passwordConfirm.message}
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

export default ResetPassword;
