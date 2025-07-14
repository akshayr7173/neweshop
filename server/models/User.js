const { getConnection } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.address = userData.address;
    this.phone = userData.phone;
    this.role = userData.role || 'Customer';
    this.google_id = userData.google_id;
    this.photo_url = userData.photo_url;
    this.auth_provider = userData.auth_provider || 'email';
    this.email_verified = userData.email_verified || false;
    this.shop_name = userData.shop_name;
    this.shop_address = userData.shop_address;
    this.gst_number = userData.gst_number;
    this.bank_account = userData.bank_account;
    this.is_active = userData.is_active !== undefined ? userData.is_active : true;
    this.is_blocked = userData.is_blocked || false;
    this.last_login = userData.last_login;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(
        `INSERT INTO users (
          name, email, password, address, phone, role, google_id, 
          photo_url, auth_provider, email_verified, last_login
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userData.name,
          userData.email,
          userData.password,
          userData.address || null,
          userData.phone || null,
          userData.role || 'Customer',
          userData.google_id || null,
          userData.photo_url || null,
          userData.auth_provider || 'email',
          userData.email_verified || false
        ]
      );

      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );

      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const connection = getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
      );

      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by Google ID
  static async findByGoogleId(googleId) {
    const connection = getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE google_id = ? LIMIT 1',
        [googleId]
      );

      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email or Google ID
  static async findByEmailOrGoogleId(email, googleId) {
    const connection = getConnection();
    
    try {
      let query = 'SELECT * FROM users WHERE ';
      let params = [];

      if (email && googleId) {
        query += '(email = ? OR google_id = ?) LIMIT 1';
        params = [email, googleId];
      } else if (email) {
        query += 'email = ? LIMIT 1';
        params = [email];
      } else if (googleId) {
        query += 'google_id = ? LIMIT 1';
        params = [googleId];
      } else {
        return null;
      }

      const [rows] = await connection.execute(query, params);
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const connection = getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [id]
      );

      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    const connection = getConnection();
    
    try {
      const fields = [];
      const values = [];

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) {
        return this;
      }

      values.push(this.id);

      await connection.execute(
        `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );

      // Refresh user data
      const updatedUser = await User.findById(this.id);
      Object.assign(this, updatedUser);
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  async updateLastLogin() {
    const connection = getConnection();
    
    try {
      await connection.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [this.id]
      );
      
      this.last_login = new Date();
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Check if user can become seller
  canBecomeSeller() {
    return this.role === 'Customer' && this.is_active && !this.is_blocked;
  }

  // Promote to seller
  async promoteToSeller(sellerData) {
    if (!this.canBecomeSeller()) {
      throw new Error('User cannot become a seller');
    }

    return await this.update({
      role: 'Seller',
      shop_name: sellerData.shopName,
      shop_address: sellerData.shopAddress,
      gst_number: sellerData.gstNumber,
      bank_account: sellerData.bankAccount
    });
  }

  // Hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  // Compare password
  async comparePassword(password) {
    if (!this.password) {
      return false;
    }
    return await bcrypt.compare(password, this.password);
  }

  // Convert to JSON (remove sensitive fields)
  toJSON() {
    const userObj = { ...this };
    delete userObj.password;
    delete userObj.password_reset_token;
    delete userObj.password_reset_expires;
    return userObj;
  }

  // Get all users (Admin only)
  static async findAll(limit = 100, offset = 0) {
    const connection = getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      return rows.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }

  // Get users by role
  static async findByRole(role, limit = 100, offset = 0) {
    const connection = getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [role, limit, offset]
      );

      return rows.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async delete() {
    const connection = getConnection();
    
    try {
      await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [this.id]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;