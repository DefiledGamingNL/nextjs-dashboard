'use client'
import React from 'react'
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
import {useModal} from "@/hooks/useModal";
import { Modal } from '../ui/modal';

const formSchema = z.object({
    user_full_name: z.string().nonempty({message: 'Naam is verplicht.'}),
    title: z.string().nonempty({message: 'Titel is verplicht.'}),
    location: z.string().nonempty({message: 'Locatie is verplicht'}),
    payment: z.string().nonempty({message: 'Betaling is verplicht'}),
    description: z.string().nonempty({message: 'Beschrijving is verplicht'}),
    })

    interface UserProps  {
        user: string
    }

const VacatureForm = ({user}: UserProps) => {

  const {isOpen, openModal, closeModal} = useModal()
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
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
            });
        
            if (response.ok) {
                console.log("Vacature is succesvol ingediend.");
                openModal();

                form.reset();
            } else {
                console.error("Error sending data:", response.statusText);
            }

        } catch(err: any) {
            console.error(err.message);
           alert("Er is een fout opgetreden bij het verzenden van de vacature.");
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
                  <FormLabel>Gebruikersnaam</FormLabel>
                  <FormControl>
                    <Input {...field} disabled/>
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
                  <FormLabel>Titel</FormLabel>
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
                  <FormLabel>Locatie</FormLabel>
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
                  <FormLabel>Betaling</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
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
                  <FormLabel>Bericht</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Beschrijving" rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Verzenden</Button>
          </form>
        </Form>


        <Modal className='max-w-[600px]' isOpen={isOpen} onClose={closeModal}>
          <div className="p-6 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Vacature is succesvol ingediend.
            </h3>
          </div>
        </Modal>
        </>
      )
}

export default VacatureForm