import { User } from "./user";

export interface Appointment {
  id: string;
  buyer: User;
  seller: User;
  start: string;
  end: string;
  summary: string;
  description?: string;
  meetLink?: string;
}
