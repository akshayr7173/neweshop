# E-commerce Backend API (MySQL)

A Node.js/Express backend API with Google OAuth integration and MySQL database for the e-commerce application.

## Features

- **Authentication & Authorization**
  - Email/Password registration and login
  - Google OAuth 2.0 integration
  - JWT token-based authentication
  - Role-based access control (Customer, Seller, Admin)

- **Database**
  - MySQL with connection pooling
  - Structured relational database design
  - Auto-creation of tables on startup
  - Proper indexing for performance

- **Security**
  - Rate limiting
  - Input validation and sanitization
  - CORS protection
  - Helmet security headers
  - Password hashing with bcrypt

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  address TEXT NULL,
  phone VARCHAR(20) NULL,
  role ENUM('Customer', 'Seller', 'Admin') DEFAULT 'Customer',
  google_id VARCHAR(255) NULL UNIQUE,
  photo_url TEXT NULL,
  auth_provider ENUM('email', 'google', 'facebook', 'github') DEFAULT 'email',
  email_verified BOOLEAN DEFAULT FALSE,
  shop_name VARCHAR(100) NULL,
  shop_address TEXT NULL,
  gst_number VARCHAR(50) NULL,
  bank_account VARCHAR(50) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_blocked BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. MySQL Setup

1. Install MySQL Server
2. Create a database:
```sql
CREATE DATABASE ecommerce;
```

3. Create a MySQL user (optional):
```sql
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
NODE_ENV=development
PORT=7040
FRONTEND_URL=http://localhost:5173

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Add authorized origins:
   - `http://localhost:5173` (frontend)
   - `http://localhost:7040` (backend)
7. Copy the Client ID and Client Secret to your `.env` file

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will automatically create all necessary database tables on startup.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google-signin` | Google OAuth sign-in |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh-token` | Refresh JWT token |

### Request/Response Examples

#### Google Sign-in Request
```json
{
  "idToken": "google-id-token-here",
  "email": "user@example.com",
  "name": "John Doe",
  "photoURL": "https://example.com/photo.jpg"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Google sign-in successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Customer",
    "photoURL": "https://example.com/photo.jpg",
    "authProvider": "google"
  },
  "token": "jwt-token-here"
}
```

## Database Tables Created Automatically

- **users** - User accounts and profiles
- **products** - Product catalog
- **cart** - Shopping cart items
- **wishlist** - User wishlists
- **orders** - Order records
- **order_items** - Order line items
- **coupons** - Discount coupons

## Security Features

- **Rate Limiting**: 10 requests per 15 minutes for auth endpoints
- **Input Validation**: Express-validator for request validation
- **Password Security**: Bcrypt with salt rounds
- **JWT Security**: Secure token generation and verification
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers protection
- **SQL Injection Protection**: Parameterized queries

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No (default: 7040) |
| `DB_HOST` | MySQL host | Yes |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | MySQL database name | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Production Deployment

1. Set environment variables in production
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Enable SSL/TLS certificates
5. Use MySQL with proper configuration for production
6. Set up database backups
7. Configure monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License