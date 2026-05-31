import express from 'express';
import { supabaseAdmin } from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

const TABLE_NOT_FOUND_MSG = {
  error: "Database table 'blogs' is not set up yet.",
  details: "Please go to your Supabase Dashboard, open the SQL Editor, and execute the following query to create the table:\n\n" +
    "CREATE TABLE IF NOT EXISTS blogs (\n" +
    "  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n" +
    "  title TEXT NOT NULL,\n" +
    "  category TEXT NOT NULL,\n" +
    "  excerpt TEXT,\n" +
    "  content TEXT NOT NULL,\n" +
    "  image_url TEXT,\n" +
    "  read_time TEXT DEFAULT '5 min read',\n" +
    "  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),\n" +
    "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n" +
    "  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n" +
    ");"
};

// Check if error is related to missing table
const isTableMissingError = (error) => {
  return error.message?.includes('relation "blogs" does not exist') || 
         error.message?.includes('Could not find the table') ||
         error.code === 'PGRST116';
};

// Get all blogs (for both user and admin)
router.get('/', async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('blogs').select('*', { count: 'exact' });

    if (category && category !== 'All') query = query.eq('category', category);
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      if (isTableMissingError(error)) {
        return res.status(503).json(TABLE_NOT_FOUND_MSG);
      }
      throw error;
    }

    res.json({
      blogs: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Get blogs error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        return res.status(503).json(TABLE_NOT_FOUND_MSG);
      }
      throw error;
    }
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json(blog);
  } catch (error) {
    logger.error(`Get blog by id error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create blog post (admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { title, category, excerpt, content, image_url, read_time, status } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .insert([{
        title,
        category,
        excerpt: excerpt || '',
        content,
        image_url: image_url || '',
        read_time: read_time || '5 min read',
        status: status || 'published',
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        return res.status(503).json(TABLE_NOT_FOUND_MSG);
      }
      throw error;
    }

    logger.info(`Blog post created: ${title}`);
    res.status(201).json(blog);
  } catch (error) {
    logger.error(`Create blog error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update blog post (admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: blog, error } = await supabaseAdmin
      .from('blogs')
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        return res.status(503).json(TABLE_NOT_FOUND_MSG);
      }
      throw error;
    }

    logger.info(`Blog post updated: ${id}`);
    res.json(blog);
  } catch (error) {
    logger.error(`Update blog error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      if (isTableMissingError(error)) {
        return res.status(503).json(TABLE_NOT_FOUND_MSG);
      }
      throw error;
    }

    logger.info(`Blog post deleted: ${id}`);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    logger.error(`Delete blog error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
