interface Event {
  id: number;
  created_at: string;
  name: string;
  description: string;
  rules: string[];
  venue: string;
  datetime: string;
  fee: number;
  prizes: Prize[];
  max_participants: number;
  min_participants: number;
  slots: number;
  student_coordinators: Studentcoordinator[];
  faculty_coordinators: Studentcoordinator[];
  department: string;
  banner: string;
  event_type: string;
  organized_by: string;
  hidden: boolean;
  site_url?: string;
}

interface Studentcoordinator {
  name: string;
  contact: string;
}

interface Prize {
  title: string;
  description: string;
}

type EventType =
  | "technical_event"
  | "non_technical_event"
  | "workshop"
  | "hackathon";

interface UserProfile {
  created_at: string;
  user_auth_id: string;
  texus_id: string;
  college: string;
  contact_number: number;
  register_number: string;
  department: string;
  year: number;
  name: string;
  email: string;
  profile_pic: string;
}

interface PaymentResponse extends Record<string, string> {
  order_id: string;
  tracking_id: string;
  bank_ref_no: string;
  order_status: string;
  failure_message: string;
  payment_mode: string;
  card_name: string;
  status_code: string;
  status_message: string;
  currency: string;
  amount: string;
  billing_name: string;
  billing_tel: string;
  billing_email: string;
  merchant_param1: string;
  merchant_param2: string;
  merchant_param3: string;
  merchant_param4: string;
  merchant_param5: string;
  vault: string;
  offer_type: string;
  offer_code: string;
  discount_value: string;
  mer_amount: string;
  eci_value: string;
  retry: string;
  response_code: string;
  billing_notes: string;
  trans_date: string;
  bin_country: string;
  auth_ref_num: string;
  trans_fee: string;
  service_tax: string;
}

interface Registration extends PaymentResponse {
  id: number;
  created_at: string;
  event_id: number;
  team: string[];
  amount: number;
  payment_status: paymentStatus;
  attended: boolean;
}

type paymentStatus = "pending" | "success" | "failed";

interface SupportTicket {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  status: string;
  category: string;
  event_id: number;
  user_id: number;
  payment_issue_type: string;
  registration_issue_type: string;
  payment_proof_url: string;
  admin_notes: string;
}
