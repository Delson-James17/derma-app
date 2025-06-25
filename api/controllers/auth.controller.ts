import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../src/models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  user.isloggedin = 1;
  await user.save();

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isloggedin: user.isloggedin
    }
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email already in use' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashedPassword, role });
  res.status(201).json({ message: 'User registered successfully', user: newUser });
};
export const updateProfile = async (req: Request, res: Response) => {
  const { id, token } = req.body;
  const { name, email, password, role } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.destroy();
  res.json({ message: 'Account deleted' });
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isloggedin = 0;
    await user.save();

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

