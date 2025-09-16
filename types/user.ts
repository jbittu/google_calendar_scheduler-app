export interface User {
  id: string;
  name?: string;
  email: string;
  role: "BUYER" | "SELLER";
  image?: string;
}
