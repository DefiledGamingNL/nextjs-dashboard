"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const UpdateProfileFormSchema = z.object({
  full_name: z.string(),
  email: z.string(),
  position: z.string(),
  phone: z.string(),
});

interface ProfileFormProps {
  user: User;
  profile: Profile;
}

function UpdateProfileForm({ profile, user }: ProfileFormProps) {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: user?.email || "",
      position: profile?.position || "",
      phone: profile?.phone || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateProfileFormSchema>) => {
    const supabase = await createClient();
    try {
      setLoading(true);

      // Update the profile
      const { error } = await supabase.from("profiles").upsert({
        id: profile.id,
        full_name: values.full_name,
        position: values.position,
        phone: values.phone,
      });

      if (error) {
        throw error;
      }

      // also update the vacancy table where user is the owner of the vacancy to change the name

      const { error: vacancyError } = await supabase
        .from("vacancies")
        .update({
          user_full_name: values.full_name,
        })
        .eq("user_id", profile.id);

      if (vacancyError) {
        throw vacancyError;
      }

      // only update the email if it has changed
      if (values.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        });

        if (emailError) {
          throw emailError;
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      toast.success(
        "Profile updated successfully, if email has changed also check your inbox for verification email."
      );
      setLoading(false);
      redirect("/account");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your first and last name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Developer" {...field} />
                </FormControl>
                <FormDescription>This is your job function</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="+31 6 12 34 56 78" {...field} />
                </FormControl>
                <FormDescription>This is your phone number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">{loading ? "Updating..." : "Update"}</Button>
      </form>
    </Form>
  );
}

export default UpdateProfileForm;
