export interface PaymentData {
  first_name: string;
  last_name: string;
  email: string;
  amount: number;
  currency: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  "customization[title]": string;
  "customization[description]": string;
}

export interface User {
  name: string;
  role: "parent" | "school";
  email: string;
  uid: string;
  credit: string;
}

export interface Student {
  userId: string;
  name: string;
  classroom: string;
  email: string;
  courses?: string[];
}

export interface Classroom {
  uid: string;
  name: string;
  courses: string[];
}

export interface School {
  name: string;
  uid: string;
}

export interface StudentCourse {}

export type Role = "Parent" | "School" | "Student";
