const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  // Regular login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate JWT token
      const token = jwt.sign(
        { 
          UserId: user.id,
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user data and token
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          photoURL: user.photo_url
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Regular registration
  static async register(req, res) {
    try {
      const { name, email, password, address } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await User.hashPassword(password);

      // Create new user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        address,
        role: 'Customer',
        auth_provider: 'email'
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          UserId: user.id,
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Google Sign-in
  static async googleSignIn(req, res) {
    try {
      const { idToken, email, name, photoURL } = req.body;

      if (!idToken) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID token is required' 
        });
      }

      // Verify the Google ID token
      let ticket;
      try {
        ticket = await googleClient.verifyIdToken({
          idToken: idToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
      } catch (verifyError) {
        console.error('Google token verification failed:', verifyError);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid Google token' 
        });
      }

      const payload = ticket.getPayload();
      const googleUserId = payload['sub'];
      const verifiedEmail = payload['email'];
      const verifiedName = payload['name'];
      const verifiedPhotoURL = payload['picture'];

      // Security check: ensure the email matches
      if (email && email !== verifiedEmail) {
        return res.status(401).json({ 
          success: false, 
          message: 'Email mismatch in token verification' 
        });
      }

      // Check if user already exists
      let user = await User.findByEmailOrGoogleId(verifiedEmail, googleUserId);

      if (user) {
        // User exists - update Google info if needed
        const updateData = {};
        
        if (!user.google_id) {
          updateData.google_id = googleUserId;
        }
        
        if (!user.photo_url && verifiedPhotoURL) {
          updateData.photo_url = verifiedPhotoURL;
        }

        if (!user.auth_provider || user.auth_provider === 'email') {
          updateData.auth_provider = 'google';
        }

        if (Object.keys(updateData).length > 0) {
          await user.update(updateData);
        }

        // Update last login
        await user.updateLastLogin();
      } else {
        // Create new user
        user = await User.create({
          name: verifiedName || name,
          email: verifiedEmail,
          google_id: googleUserId,
          photo_url: verifiedPhotoURL || photoURL,
          role: 'Customer',
          auth_provider: 'google',
          email_verified: true, // Google accounts are pre-verified
          // No password needed for Google users
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          UserId: user.id,
          userId: user.id, 
          email: user.email, 
          role: user.role,
          authProvider: user.auth_provider
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return success response
      res.json({
        success: true,
        message: 'Google sign-in successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          photoURL: user.photo_url,
          authProvider: user.auth_provider
        },
        token
      });

    } catch (error) {
      console.error('Google sign-in error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error during Google sign-in' 
      });
    }
  }

  // Logout (optional - mainly for token blacklisting if implemented)
  static async logout(req, res) {
    try {
      // In a stateless JWT setup, logout is handled client-side
      // You could implement token blacklisting here if needed
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Refresh token (optional)
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      // Verify refresh token and generate new access token
      // Implementation depends on your refresh token strategy
      
      res.json({
        success: true,
        token: 'new-access-token'
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;