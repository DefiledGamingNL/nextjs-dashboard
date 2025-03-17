import RichTextEditor from "@/components/RichTextEditor";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/server";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import { EditVacatureForm } from "@/components/form/EditVacatureForm";

interface VacaturePageProps {
  params: { id: string };
}

export default async function VacaturePage({ params }: VacaturePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vacancies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
  }
  const vacancy = data;
  return (
    <ComponentCard title={`Vacature: ${vacancy?.title}`}>
      <EditVacatureForm vacancy={vacancy} />
    </ComponentCard>
  );
}
