import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User ,Role } from '../src/models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email }, include:[{ model: Role, as:'role'}] 
  });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.isActive){
    return res.status(403).json({message: 'Account is inactive. Contact admin.'});
  }
  if (user.failedAttempts >= 5) {
  console.log("Blocking login due to failedAttempts:", user.failedAttempts);
  return res.status(403).json({ message: 'Account is locked due to multiple failed login attempts.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid){
    user.failedAttempts +=1;
    await user.save();
    return res.status(401).json({ message: 'Invalid credentials' });
  } 

  user.failedAttempts = 0;
  user.isloggedin = 1;
  await user.save();

  const token = jwt.sign({ id: user.id, role: user.role?.rolename }, JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.rolename ,
      isloggedin: user.isloggedin
    }
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, roleid } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email already in use' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashedPassword, roleid });
  res.status(201).json({ message: 'User registered successfully', user: newUser });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id, token } = req.body;
  const { name, email, password, roleid  } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.roleid  = roleid  || user.roleid ;
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

export const manageUserStatus = async (req: Request, res: Response) => {
  const { userId, isActive, lockUser } = req.body;

  if ((req as any).user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (typeof isActive === 'boolean') {
    user.isActive = isActive;
  }

  if (lockUser === true) {
    user.failedAttempts = 5;
  } else if (lockUser === false) {
    user.failedAttempts = 0;
  }

  await user.save();

  res.json({
    message: 'User status updated successfully',
    user: {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      failedAttempts: user.failedAttempts
    }
  });
};

export const createRole = async( req: Request, res: Response) =>{
  const {rolename} = req.body;

  if(!rolename){
    return res.status(400).json({message:'Role name is required'});
  }
  try{
    const existing = await Role.findOne({where:{rolename}});
    if(existing){
      return res.status(400).json({message:'Role already exists'});
    }
    const role = await Role.create({rolename});
    res.status(201).json({message:'Role Created', role})
  }catch (err){
    console.error('Error creating role',err);
    res.status(500).json({message:'Server error'})
  }
}
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
};


