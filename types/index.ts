export interface Job {
  id: string;
  title: string;
  description: string;
  client_name: string;
  amount: number;
  is_paid: boolean;
  payment_date?: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyProgress {
  id: string;
  job_id: string;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export interface CreateJobInput {
  title: string;
  description: string;
  client_name: string;
  amount: number;
}

export interface UpdateJobPaymentInput {
  is_paid: boolean;
  payment_date?: string;
  payment_reference?: string;
}
