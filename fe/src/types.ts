export type Role = "user" | "admin";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Vacation {
  id: number;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageName: string;
  followersCount: number;
  isFollowed: boolean;
}
