import express from 'express';
import { supabaseAdmin } from '../utils/supabase.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Log a page view hit (Public)
router.post('/hit', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    const { error } = await supabaseAdmin
      .from('page_views')
      .insert([{ url, created_at: new Date() }]);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('Could not find the table') || error.message?.includes('relation "page_views" does not exist')) { // relation does not exist
        return res.status(503).json({ error: 'page_views table does not exist', table_missing: true });
      }
      throw error;
    }

    res.json({ success: true });
  } catch (error) {
    logger.error(`Log page view hit error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get analytics statistics (Admin only)
router.get('/stats', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { data: viewsData, error } = await supabaseAdmin
      .from('page_views')
      .select('url, created_at');

    if (error) {
      if (error.code === '42P01' || error.message?.includes('Could not find the table') || error.message?.includes('relation "page_views" does not exist')) {
        return res.status(503).json({ 
          error: 'page_views table does not exist', 
          table_missing: true,
          sql: `CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
        });
      }
      throw error;
    }

    const totalViews = viewsData.length;

    // Process Page Views Breakdown
    const urlMap = {};
    viewsData.forEach(row => {
      urlMap[row.url] = (urlMap[row.url] || 0) + 1;
    });

    const pageLabels = {
      '/': 'Home Page',
      '/shop': 'Shop Store',
      '/wholesale': 'Wholesale Info',
      '/our-story': 'Brand Story',
      '/blog': 'Tea Journal'
    };

    const pageViews = Object.entries(urlMap).map(([url, count]) => {
      const label = pageLabels[url] || `Path: ${url}`;
      const pct = totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : '0.0';
      return { url, label, views: count, pct };
    }).sort((a, b) => b.views - a.views);

    // Process Weekly Traffic (Last 7 Days)
    const weeklyData = [
      { day: 'Sun', count: 0 },
      { day: 'Mon', count: 0 },
      { day: 'Tue', count: 0 },
      { day: 'Wed', count: 0 },
      { day: 'Thu', count: 0 },
      { day: 'Fri', count: 0 },
      { day: 'Sat', count: 0 }
    ];

    viewsData.forEach(row => {
      const date = new Date(row.created_at);
      const dayIndex = date.getDay();
      weeklyData[dayIndex].count++;
    });

    // Reorder so it ends with Mon-Sun
    const monToSun = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const reorderedWeekly = monToSun.map(dayName => {
      const found = weeklyData.find(d => d.day === dayName);
      return { day: dayName, count: found ? found.count : 0 };
    });

    res.json({
      totalViews,
      pageViews,
      weeklyTraffic: reorderedWeekly
    });
  } catch (error) {
    logger.error(`Get analytics stats error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;
