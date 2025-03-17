"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "../Form";
import Input from "../input/InputField";
import Button from "@/components/ui/button/Button";

export default function BasicForm() {


    const onSubmit = async (formData: FormData) => {
    
           console.log(formData)
          };


    return (
        <ComponentCard title="Basic Form">
            <Form>
                <form action={onSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Input type="text" placeholder="Titel" />
                        </div>
                        <div>
                            <Input type="text" placeholder="Locatie" />
                        </div>
                        <div className="col-span-full">
                            <Input type="text" placeholder="Betaling" />
                        </div>
                        <div className="col-span-full">
                            <Input type="text" placeholder="Beschrijving" />
                        </div>
                        <div className="col-span-full">
                            <Button className="w-full" size="sm">
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </ComponentCard>
    );
}