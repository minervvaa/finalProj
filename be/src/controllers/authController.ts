import { Router, Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";

const router = Router();
router.post("/register", async (req: Request, res: Response) => {
  //TODO check it in postman  ~ done // (POST http://localhost:3030/auth/register)
  try {
    //getting the user data from request body
    const { firstName, lastName, email, password } = req.body;

    // call (registerUser from service) to create a new user in the db
    const user = await registerUser(firstName, lastName, email, password);

    // sending the user (that we created) back as a JSON response
    res.json({ user });

    // catching any problems during registration, if there is a problem -> send error 
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  //TODO check it in postman ~ done //(POST http://localhost:3030/auth/login)
  try {

    //getting the email and password from the request body
    const { email, password } = req.body;

    // call (loginUser from the service) for validation
    const user = await loginUser(email, password);

    // sending the logged-in user back as a JSON response
    res.json({ user });

    // catching any problems during login, if there is a problem -> send error 
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Login failed" });
  }
});

export default router;
