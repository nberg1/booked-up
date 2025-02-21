import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Optional: Define an interface for an authenticated request if needed elsewhere.
export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Signup Controller
 * - Registers a new user
 * - Hashes the password
 * - Creates a JWT token and returns it along with the user data
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    // Sign a JWT token with the new user's id and email
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: newUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login Controller
 * - Verifies user's credentials
 * - On success, signs a JWT token and returns it along with the user data
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    // Sign a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get Profile Controller
 * - Returns profile information for the authenticated user.
 * - Assumes the authentication middleware attaches the decoded JWT payload to req.user.
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  // Since our authentication middleware ensures req.user is set,
  // we can simply return that information.
  res.json({ user: (req as AuthenticatedRequest).user });
};
