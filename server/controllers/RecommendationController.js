const { getConnection } = require('../config/database');

class RecommendationController {
  // Track user search activity
  static async trackSearch(req, res) {
    try {
      const { searchQuery, category, productId, actionType = 'search' } = req.body;
      const userId = req.userId || null;

      if (!searchQuery && !productId) {
        return res.status(400).json({
          success: false,
          message: 'Search query or product ID is required'
        });
      }

      const connection = getConnection();
      
      await connection.execute(
        `INSERT INTO search_activity (user_id, search_query, category, product_id, action_type) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, searchQuery || null, category || null, productId || null, actionType]
      );

      res.json({
        success: true,
        message: 'Search activity tracked'
      });
    } catch (error) {
      console.error('Track search error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track search activity'
      });
    }
  }

  // Get personalized product suggestions
  static async getSuggestions(req, res) {
    try {
      const userId = req.userId;
      const connection = getConnection();
      
      let suggestions = [];

      if (userId) {
        // Get personalized suggestions based on user's search history
        const [searchHistory] = await connection.execute(`
          SELECT DISTINCT category, search_query, COUNT(*) as frequency
          FROM search_activity 
          WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY category, search_query
          ORDER BY frequency DESC, created_at DESC
          LIMIT 10
        `, [userId]);

        if (searchHistory.length > 0) {
          // Get products based on user's search patterns
          const categories = [...new Set(searchHistory.map(h => h.category).filter(Boolean))];
          const searchTerms = searchHistory.map(h => h.search_query).filter(Boolean);

          let whereConditions = [];
          let params = [];

          if (categories.length > 0) {
            whereConditions.push(`category IN (${categories.map(() => '?').join(',')})`);
            params.push(...categories);
          }

          if (searchTerms.length > 0) {
            const searchConditions = searchTerms.map(() => 'title LIKE ? OR description LIKE ?').join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            searchTerms.forEach(term => {
              params.push(`%${term}%`, `%${term}%`);
            });
          }

          if (whereConditions.length > 0) {
            const [personalizedProducts] = await connection.execute(`
              SELECT p.*, u.name as seller_name
              FROM products p
              LEFT JOIN users u ON p.seller_id = u.id
              WHERE p.status = 'approved' AND (${whereConditions.join(' OR ')})
              ORDER BY p.created_at DESC
              LIMIT 8
            `, params);

            suggestions = personalizedProducts;
          }
        }
      }

      // If no personalized suggestions or user not logged in, get trending products
      if (suggestions.length < 4) {
        const [trendingProducts] = await connection.execute(`
          SELECT p.*, u.name as seller_name, COUNT(sa.id) as search_count
          FROM products p
          LEFT JOIN users u ON p.seller_id = u.id
          LEFT JOIN search_activity sa ON p.id = sa.product_id 
            AND sa.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          WHERE p.status = 'approved'
          GROUP BY p.id
          ORDER BY search_count DESC, p.created_at DESC
          LIMIT ${8 - suggestions.length}
        `);

        suggestions = [...suggestions, ...trendingProducts];
      }

      // If still not enough, get random popular products
      if (suggestions.length < 4) {
        const [randomProducts] = await connection.execute(`
          SELECT p.*, u.name as seller_name
          FROM products p
          LEFT JOIN users u ON p.seller_id = u.id
          WHERE p.status = 'approved'
          ORDER BY RAND()
          LIMIT ${8 - suggestions.length}
        `);

        suggestions = [...suggestions, ...randomProducts];
      }

      res.json({
        success: true,
        suggestions: suggestions.slice(0, 8),
        personalized: userId ? true : false
      });
    } catch (error) {
      console.error('Get suggestions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get suggestions'
      });
    }
  }

  // Get search trends for analytics
  static async getSearchTrends(req, res) {
    try {
      const connection = getConnection();
      
      const [trends] = await connection.execute(`
        SELECT search_query, category, COUNT(*) as frequency
        FROM search_activity 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND search_query IS NOT NULL
        GROUP BY search_query, category
        ORDER BY frequency DESC
        LIMIT 20
      `);

      res.json({
        success: true,
        trends
      });
    } catch (error) {
      console.error('Get search trends error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get search trends'
      });
    }
  }
}

module.exports = RecommendationController;