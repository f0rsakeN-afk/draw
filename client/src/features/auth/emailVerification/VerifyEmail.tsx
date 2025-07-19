import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  type verifyEmailData,
  verifyEmailSchema,
} from "@/schema/auth/verifyEmail/verifyEmai.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LogoImage } from "@/utils/ImageExports";

const VerifyEmail: React.FC = () => {
  const form = useForm<verifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = (data: verifyEmailData) => {
    console.log(data);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md rounded-2xl border-none shadow-2xl bg-white/90 backdrop-blur">
        <CardContent className="p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <img
              src={LogoImage}
              alt="logo image"
              className="h-20 dark:invert"
            />
          </div>

          <h2 className="text-3xl font-extrabold text-center text-foreground mb-2">
            Verify Your Email
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Enter the 6-digit OTP sent to your email address.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col items-center"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormLabel className="text-sm font-medium mb-2">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground mt-2">
                      Check your inbox for the OTP. It expires in 10 minutes.
                    </FormDescription>
                    <FormMessage className="text-red-500 mt-1 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full text-base py-2.5 rounded-xl shadow-sm"
                type="submit"
              >
                Verify Email
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Didn’t receive the code?{" "}
            <button
              type="button"
              className="text-primary font-medium hover:underline transition"
              onClick={() => console.log("resend code")}
            >
              Resend
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
