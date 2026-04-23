import express from 'express';
import supabase from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all products with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort = 'created_at' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, count, error } = await query
      .eq('status', 'active')
      .order(sort, { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Get products error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Get variants
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id);

    res.json({ ...product, variants });
  } catch (error) {
    logger.error(`Get product error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, category, description, price, mrp, stock_quantity, image_url, images, status, variants } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const priceNum = parseFloat(price);
    const mrpNum = mrp ? parseFloat(mrp) : priceNum;
    const stockNum = stock_quantity ? parseInt(stock_quantity, 10) : 0;

    const payload = {
      name,
      category,
      price: priceNum,
      mrp: mrpNum,
      stock_quantity: stockNum,
    };
    
    if (description !== undefined) payload.description = description;
    if (image_url !== undefined) payload.image_url = image_url;
    if (images !== undefined) payload.images = images;
    if (status !== undefined) payload.status = status;

    const { data: product, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    // Handle variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantsPayload = variants.map(v => ({
        product_id: product.id,
        variant_name: v.variant_name,
        price: parseFloat(v.price) || product.price,
        stock: parseInt(v.stock, 10) || 0,
        image_url: v.image_url || null
      }));

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantsPayload);
      
      if (variantError) logger.error(`Error inserting variants: ${variantError.message}`);
    }

    logger.info(`Product created: ${name}`);
    res.status(201).json(product);
  } catch (error) {
    logger.error(`Create product error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { variants, ...updates } = req.body;

    // Sanitize numeric fields to prevent empty string cast errors
    if (updates.price !== undefined) updates.price = parseFloat(updates.price) || 0;
    if (updates.mrp === "") updates.mrp = updates.price || null;
    else if (updates.mrp !== undefined) updates.mrp = parseFloat(updates.mrp);
    
    if (updates.stock_quantity === "") updates.stock_quantity = 0;
    else if (updates.stock_quantity !== undefined) updates.stock_quantity = parseInt(updates.stock_quantity, 10) || 0;

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Handle variants update (simple delete and re-insert approach)
    if (variants !== undefined && Array.isArray(variants)) {
      // Delete existing variants
      await supabase.from('product_variants').delete().eq('product_id', id);

      // Insert new variants if any
      if (variants.length > 0) {
        const variantsPayload = variants.map(v => ({
          product_id: id,
          variant_name: v.variant_name,
          price: parseFloat(v.price) || product.price,
          stock: parseInt(v.stock, 10) || 0,
          image_url: v.image_url || null
        }));

        await supabase.from('product_variants').insert(variantsPayload);
      }
    }

    logger.info(`Product updated: ${id}`);
    res.json(product);
  } catch (error) {
    logger.error(`Update product error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    logger.info(`Product deleted: ${id}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error(`Delete product error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
