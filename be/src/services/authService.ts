import { runQuery } from "../dal/dal";
import { User, UserRole, mapUserRow } from "../models/UserModel";


export async function registerUser(
  // TODO needs a post router  ~ done 
// defining the input types for the user 
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise <User> {

  // if one of the field are missing or empty , if any field is missing or empty -> throw error
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  // checking the email format (using a regex) , if it doesn’t match -> throw error
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email is not valid");
  }

  // checking if the password is not long enough (minimum 4 characters) , if not -> throw error 
  if (password.length < 4) {
    throw new Error("Password must be at least 4 characters");
  }

  // checking if a user already exists with that email 
  const existing = (await runQuery(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )) as any[];

  // if any row (user) comes back then  -> throw error 
  if (existing.length > 0) {
    throw new Error("Email already in use");
  }

  // inserting the new user to the db , and setting a role to it 
  await runQuery(
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, 'user')",
    [firstName, lastName, email, password]
  );

  // fetching the uesr back from db (without the password) ,
  const rows = (await runQuery(
    "SELECT id, first_name, last_name, email, role FROM users WHERE email = ?",
    [email]
  )) as any[];
  
  //  returning a clean user object with id and other fields exactly as stored 
  return mapUserRow(rows[0]);
}


export async function loginUser(
  // TODO needs a post router ~ done 
// defining the input types for the user 
  email: string,
  password: string
): Promise<User> {
  // checking if the email and password were sent , if missing -> throw error
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  // fetching the user by email 
  const rows = (await runQuery(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )) as any[];

  // taking the first matched user (there should only be one res so take the first one)
  const row = rows[0];
  // if user not found or password doesn’t match -> throw error
  if (!row || row.password !== password) {
    throw new Error("Wrong email or password");
  }

// if the user was not found after inserting -> throw error
  if (rows.length === 0) {
    throw new Error("User was not created");
  }

  // returning a user object 
  return mapUserRow(row);
}
