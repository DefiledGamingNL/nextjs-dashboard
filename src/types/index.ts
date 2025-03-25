export type Data = {
  email: string | null;
};

export type Profile = {
  full_name: string;
  role: string;
  id: string;
  position: string;
  phone: string;
  username: string;
  online_status?: boolean;
};

export type Vacancy = {
  id: number;
  user_full_name: string;
  audience: string;
  title: string;
  location: string;
  payment: string;
  description: string;
  created_at: Date;
};

export interface Vacancies {
  vacancies: Vacancy[];
}
