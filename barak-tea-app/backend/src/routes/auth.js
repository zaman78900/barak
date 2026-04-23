import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateToken } from '../utils/auth.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: hashedPassword,
        full_name,
        phone,
      }])
      .select()
      .single();

    if (userError) throw userError;

    // Create customer record
    await supabase.from('customers').insert([{
      user_id: user.id,
      phone: phone || '',
    }]);

    logger.info(`User registered: ${email}`);

    const token = generateToken(user.id, user.email, 'user');
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name },
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    logger.info(`User logged in: ${email}`);

    const token = generateToken(user.id, user.email, user.role);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    const { full_name, phone } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name,
        phone,
        updated_at: new Date(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`User profile updated: ${userId}`);
    res.json(user);
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
