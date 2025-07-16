@@ .. @@
 const express = require('express');
 const { body, validationResult } = require('express-validator');
 const rateLimit = require('express-rate-limit');
 const AuthController = require('../controllers/AuthController');
+const RecommendationController = require('../controllers/RecommendationController');
+const { authenticateToken, optionalAuth } = require('../middleware/auth');

 const router = express.Router();

@@ .. @@
 // Routes
 router.post('/register', registerValidation, authLimiter, AuthController.register);
 router.post('/login', loginValidation, authLimiter, AuthController.login);
 router.post('/google-signin', googleSignInValidation, authLimiter, AuthController.googleSignIn);
 router.post('/logout', AuthController.logout);
 router.post('/refresh-token', AuthController.refreshToken);

+// Search activity tracking
+router.post('/track-search', optionalAuth, RecommendationController.trackSearch);
+router.get('/suggestions', optionalAuth, RecommendationController.getSuggestions);

 module.exports = router;