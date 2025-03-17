import {createClient} from "@/utils/supabase/server";


export default async function GET_VACANCIES() {
    const supabase = await createClient()

    const { data: vacancies, error: vacanciesError } = await supabase
    .from('vacancies')
    .select('*')
    .order('created_at', { ascending: false })

const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('full_name')
    .single()


if (vacanciesError || vacanciesError) {
    throw vacanciesError || userError;
}

return { vacancies, user };
}