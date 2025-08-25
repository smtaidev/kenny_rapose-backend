# 🔐 Kenny Rappose Backend - Authentication System

A robust Node.js backend built with Express.js, TypeScript, and modern authentication practices.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **CORS**: Enabled for cross-origin requests
- **Package Manager**: pnpm

## 📋 Project Todo

### 🔐 Authentication System

#### User Management
- [x] **User Registration**
  - [x] Create user registration endpoint (`POST /api/v1/auth/signup`)
  - [x] Handle existing user reactivation for soft-deleted accounts
  - [x] Generate JWT access and refresh tokens
  - [x] Input validation with Zod schemas

- [x] **User Login**
  - [x] Create user login endpoint (`POST /api/v1/auth/login`)
  - [x] Password verification with bcrypt
  - [x] JWT token generation and refresh token storage
  - [x] Account status validation

- [x] **User Profile Management**
  - [x] Get user profile endpoint (`GET /api/v1/users/profile`)
  - [x] Update user profile endpoint (`PATCH /api/v1/users/profile`)
  - [x] Verify user profile endpoint (`PATCH /api/v1/users/verify-profile`)

- [x] **Password Management**
  - [x] **Change Password**
    - [x] Create change password endpoint (`POST /api/v1/users/change-password`)
    - [x] Old password verification required
    - [x] Secure password hashing with bcrypt
    - [x] Admin-only access control
  
  - [x] **Forgot Password**
    - [x] Request reset OTP endpoint (`POST /api/v1/users/request-reset-password-otp`)
    - [x] Verify reset OTP endpoint (`POST /api/v1/users/verify-reset-password-otp`)
    - [x] Reset password endpoint (`POST /api/v1/users/reset-password`)
    - [x] OTP generation and email delivery
    - [x] OTP expiration handling (10 minutes)

- [x] **Account Management**
  - [x] Soft delete user endpoint (`DELETE /api/v1/users/:email`)
  - [x] Account reactivation support
  - [x] Refresh token management
  - [x] Logout functionality

#### AI Credit Package Management

- [x] **AI Credit Package System**
  - [x] **Database Schema**
    - [x] `ai_credit_packages` table with proper structure
    - [x] Package fields: id, name, credits, price, status, timestamps
    - [x] `AIPackageStatus` enum (ACTIVE, INACTIVE)
    - [x] Proper Prisma migrations and client generation

  - [x] **Public Read Operations**
    - [x] Get all packages endpoint (`GET /api/v1/ai-credit-packages`)
    - [x] Get package by ID endpoint (`GET /api/v1/ai-credit-packages/:id`)
    - [x] No authentication required for viewing packages
    - [x] Packages ordered by creation date (newest first)

  - [x] **Admin-Only Operations**
    - [x] Create package endpoint (`POST /api/v1/ai-credit-packages`)
    - [x] Update package endpoint (`PATCH /api/v1/ai-credit-packages/:id`)
    - [x] Delete package endpoint (`DELETE /api/v1/ai-credit-packages/:id`)
    - [x] Admin and Super Admin role-based access control

  - [x] **Business Logic & Validation**
    - [x] Package name uniqueness validation
    - [x] Credits validation (positive integers only)
    - [x] Price validation (positive numbers only)
    - [x] Status validation (ACTIVE/INACTIVE only)
    - [x] Zod schema validation for all inputs
    - [x] Duplicate name prevention in create/update operations

  - [x] **Security Features**
    - [x] JWT authentication required for admin operations
    - [x] Role-based authorization (ADMIN/SUPER_ADMIN only)
    - [x] Input sanitization and validation
    - [x] Proper error handling and HTTP status codes

  - [x] **Data Management**
    - [x] Permanent delete functionality (no soft delete)
    - [x] Proper error handling for non-existent packages
    - [x] Transaction-based operations for data integrity
    - [x] Comprehensive response formatting

#### Tour Package Management

- [x] **Tour Package System**
  - [x] **Database Schema**
    - [x] `tour_packages` table with comprehensive structure
    - [x] Package fields: id, packageName, totalMembers, pricePerPerson, startDay, endDay, citiesVisited, tourType, activities, dailyActivity, highlights, description, photos, status, timestamps
    - [x] `TourPackageStatus` enum (ACTIVE, INACTIVE)
    - [x] Soft delete support with `deletedAt` timestamp

  - [x] **Public Read Operations**
    - [x] Get all packages endpoint (`GET /api/v1/tour-packages`)
    - [x] Get package by ID endpoint (`GET /api/v1/tour-packages/:id`)
    - [x] No authentication required for viewing packages
    - [x] Packages ordered by creation date (newest first)
    - [x] Soft-deleted packages automatically excluded

  - [x] **Admin-Only Operations**
    - [x] Create package endpoint (`POST /api/v1/tour-packages`)
    - [x] Update package endpoint (`PATCH /api/v1/tour-packages/:id`)
    - [x] Delete package endpoint (`DELETE /api/v1/tour-packages/:id`) - Soft Delete
    - [x] Admin and Super Admin role-based access control

  - [x] **Business Logic & Validation**
    - [x] Package name uniqueness validation
    - [x] Date validation (end date must be after start date)
    - [x] Array field validation (cities, activities, photos)
    - [x] Daily activity structure validation (day1, day2, etc.)
    - [x] Zod schema validation for all inputs
    - [x] Comprehensive business rule enforcement

  - [x] **Advanced Features**
    - [x] Flexible daily activity structure with day-by-day itineraries
    - [x] Multiple photo support for rich visual content
    - [x] City and activity arrays for comprehensive tour details
    - [x] Status management (ACTIVE, INACTIVE)
    - [x] Soft delete functionality for data preservation

  - [x] **Security Features**
    - [x] JWT authentication required for admin operations
    - [x] Role-based authorization (ADMIN/SUPER_ADMIN only)
    - [x] Input sanitization and validation
    - [x] Proper error handling and HTTP status codes

  - [x] **Data Management**
    - [x] Soft delete functionality (data preservation)
    - [x] Proper error handling for non-existent packages
    - [x] Transaction-based operations for data integrity
    - [x] Comprehensive response formatting


## 🏗️ Project Structure

```
src/
├── app/
│   ├── errors/           # Error handling classes
│   ├── interface/        # TypeScript interfaces
│   ├── middlewares/      # Custom middleware (auth, validation)
│   ├── modules/          # Feature modules
│   │   ├── Auth/         # Authentication module
│   │   ├── User/         # User management module
│   │   ├── AI-Credit/    # AI Credit Package module
│   │   └── TourPackage/  # Tour Package module
│   ├── routes/           # API route definitions
│   ├── utils/            # Helper functions
│   └── app.ts            # Main application file
├── config/               # Configuration files
├── generated/            # Generated Prisma client
├── prisma/               # Database schema and migrations
└── server.ts             # Server entry point
```

## 📡 API Endpoints Summary

### **🔐 Authentication & User Management**
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### **👤 User Operations**
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile
- `PATCH /api/v1/users/verify-profile` - Verify user profile
- `POST /api/v1/users/change-password` - Change password
- `POST /api/v1/users/request-reset-password-otp` - Request password reset OTP
- `POST /api/v1/users/verify-reset-password-otp` - Verify reset OTP
- `POST /api/v1/users/reset-password` - Reset password
- `DELETE /api/v1/users/:email` - Soft delete user

### **🤖 AI Credit Package Management**
- `GET /api/v1/ai-credit-packages` - Get all packages (Public)
- `GET /api/v1/ai-credit-packages/:id` - Get package by ID (Public)
- `POST /api/v1/ai-credit-packages` - Create package (Admin Only)
- `PATCH /api/v1/ai-credit-packages/:id` - Update package (Admin Only)
- `DELETE /api/v1/ai-credit-packages/:id` - Delete package (Admin Only)

### **🏖️ Tour Package Management**
- `GET /api/v1/tour-packages` - Get all packages (Public)
- `GET /api/v1/tour-packages/:id` - Get package by ID (Public)
- `POST /api/v1/tour-packages` - Create package (Admin Only)
- `PATCH /api/v1/tour-packages/:id` - Update package (Admin Only)
- `DELETE /api/v1/tour-packages/:id` - Delete package (Admin Only) - Soft Delete

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

## 📝 Progress Tracking

- **Started**: August 2024
- **Last Updated**: August 24, 2024
- **Completed Features**: 3/3 Major Features
- **Current Status**: Tour Package Management Complete ✅

### **🎯 Feature Completion Status**
- ✅ **User Management System** - 100% Complete
- ✅ **AI Credit Package Management** - 100% Complete
- ✅ **Tour Package Management** - 100% Complete

### **📊 Implementation Details**
- **Total API Endpoints**: 22 endpoints implemented
- **Database Tables**: 3 tables (users, ai_credit_packages, tour_packages)
- **Authentication**: JWT-based with role-based access control
- **Validation**: Zod schemas for all inputs
- **Error Handling**: Comprehensive error management
- **Security**: Admin-only operations properly secured

## 🧪 Testing & Documentation

### **Testing**
- **Postman Collections**: 
  - `test-ai-credit-packages.http` - AI Credit Package endpoints
  - `test-tour-packages.http` - Tour Package endpoints
- **Build Status**: ✅ TypeScript compilation successful
- **Database**: ✅ All migrations applied successfully
- **API Testing**: Ready for Postman/HTTP client testing

### **Documentation**
- **API Documentation**: Complete endpoint documentation with examples
- **Testing Guide**: Step-by-step testing instructions
- **Database Schema**: Prisma schema with proper relationships
- **Error Handling**: Comprehensive error response documentation

## 🚀 Next Steps & Future Enhancements

### **Potential Features**
- **User Management**: Bulk user operations, user analytics
- **AI Credit Packages**: Package categories, bulk operations, audit logs
- **Payment Integration**: Stripe/PayPal integration for package purchases
- **Notification System**: Email/SMS notifications for users
- **Admin Dashboard**: Web-based admin interface
- **API Rate Limiting**: Request throttling and monitoring
- **Logging & Monitoring**: Application performance monitoring

---

**Note**: All major features are now complete! The backend is production-ready with comprehensive user management, AI credit package, and tour package management systems. 🎉✅
