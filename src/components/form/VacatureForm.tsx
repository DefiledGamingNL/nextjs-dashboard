"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import { toast } from "sonner";

const formSchema = z.object({
  user_full_name: z.string().nonempty({ message: "Name is mandatory" }),
  title: z.string().nonempty({ message: "Title is mandatory" }),
  location: z.string().nonempty({ message: "Location is mandatory" }),
  payment: z.string().nonempty({ message: "Payment is mandatory" }),
  description: z.string().nonempty({ message: "Description is mandatory" }),
});

interface UserProps {
  user: string;
}

const VacatureForm = ({ user }: UserProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  console.log(user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_full_name: user,
      title: "",
      location: "",
      payment: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBHOOK_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Vacancy submitted successfully.");

        form.reset();
      } else {
        toast.error(`Error! ${response.statusText}`);
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("An error occurred. Please try again.");
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="user_full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Textarea placeholder="Description" rows={8} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Verzenden</Button>
        </form>
      </Form>
    </>
  );
};

export default VacatureForm;
