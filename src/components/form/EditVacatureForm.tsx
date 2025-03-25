"use client";

import { PDFDocument, rgb } from "pdf-lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "./input/InputField";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import TextArea from "./input/TextArea";
import DeleteButton from "../tables/DeleteButton";

const formSchema = z.object({
  user_full_name: z
    .string()
    .min(3, { message: "Name is too short" })
    .optional(),
  title: z.string().min(3, { message: "Title is too short" }),
  audience: z.string().min(3, { message: "Audience is too short" }),
  description: z.string().min(10, { message: "Description is too short" }),
  location: z.string().min(3, { message: "Location is too short" }),
  payment: z.string().min(1, { message: "Payment is too low" }),
});

interface VacancyProps {
  vacancy: {
    id: string;
    user_full_name?: string;
    title: string;
    audience: string;
    description: string;
    location: string;
    payment: string;
  };
}

export function EditVacatureForm({ vacancy }: VacancyProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_full_name: vacancy?.user_full_name || "",
      title: vacancy?.title || "",
      audience: vacancy?.audience || "",
      description: vacancy?.description || "",
      location: vacancy?.location || "",
      payment: vacancy?.payment || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log("Updated values:", values);

      const supabase = await createClient();

      const { error } = await supabase
        .from("vacancies")
        .update({
          audience: values?.audience,
          title: values?.title,
          description: values?.description,
          location: values?.location,
          payment: values?.payment,
        })
        .eq("id", vacancy?.id);

      if (error) {
        toast.error("An error occurred. Please try again.");
        return;
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      redirect(`/vacatures/${vacancy.id}`);
    } finally {
      toast.success("Vacancy updated successfully");
      setLoading(false);
      redirect(`/vacatures/${vacancy.id}`);
    }
  }

  async function exportToPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]); // Breedte x hoogte in punten
    const { height } = page.getSize();

    // Formuliergegevens ophalen
    const formData = form.getValues();

    const text = `
    Title: ${formData.title}
    Location: ${formData.location}
    Payment: ${formData.payment}
    Description: ${formData.description}
  `;

    // Tekst toevoegen aan de PDF
    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // PDF downloaden
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `vacature-${formData.title}.pdf`;
    link.click();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="user_full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is the user who created the vacancy.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audience</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter audience" />
                </FormControl>
                <FormDescription>
                  Set the audience of the vacancy.
                </FormDescription>
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
                  <Input {...field} placeholder="Enter title" />
                </FormControl>
                <FormDescription>Set the title of the vacancy.</FormDescription>
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
                  <Input {...field} placeholder="Enter location" />
                </FormControl>
                <FormDescription>Set the location of the job.</FormDescription>
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
                  <Input {...field} placeholder="Enter payment" />
                </FormControl>
                <FormDescription>Set the amount of salary paid</FormDescription>
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
                  <TextArea
                    rows={12}
                    {...field}
                    placeholder="Enter description"
                  />
                </FormControl>
                <FormDescription>Describe the job in detail.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <Button size="md" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
              <DeleteButton vacancy={vacancy} />
            </div>

            <div className="flex flex-col lg:flex-row space-x-4">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white "
                size="md"
                type="button"
                onClick={() => redirect(`/vacatures/${vacancy.id}`)}
                disabled
              >
                Website
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white"
                size="md"
                type="button"
                onClick={() => redirect(`/vacatures/${vacancy.id}`)}
              >
                LinkedIn
              </Button>

              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white"
                size="md"
                type="button"
                onClick={exportToPDF}
              >
                Exporteer naar PDF
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
