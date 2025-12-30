export type UserRole = "user" | "admin";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // only for input, never send to fe
  role: UserRole;
}

// DB row -> User model
export function mapUserRow(row: any): User {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role as UserRole,
  };
}
