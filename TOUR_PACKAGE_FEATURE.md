# 🏖️ Tour Package Management Feature

## 📋 Overview

The Tour Package Management feature allows administrators to create, manage, and showcase comprehensive tour packages for the tourism booking platform. This feature supports rich content including daily itineraries, multiple photos, and detailed activity descriptions.

## 🏗️ Database Schema

### **TourPackage Model**
```prisma
model TourPackage {
  id            String @id @default(uuid())
  packageName   String
  totalMembers  Int
  pricePerPerson Float
  startDay      DateTime
  endDay        DateTime
  citiesVisited String[] // Array of cities
  tourType      String
  activities    String[] // Array of activities
  dailyActivity Json     // Daily activity object with day1, day2, etc.
  highlights    String
  description  String
  photos       String[] // Array of photo URLs
  status       TourPackageStatus @default(ACTIVE)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  deletedAt    DateTime? // Soft delete

  @@map("tour_packages")
}

enum TourPackageStatus {
  ACTIVE
  INACTIVE
}
```

### **Field Descriptions**
- **`packageName`**: Unique name for the tour package
- **`totalMembers`**: Maximum number of participants allowed
- **`pricePerPerson`**: Cost per person for the tour
- **`startDay`**: Tour start date and time
- **`endDay`**: Tour end date and time
- **`citiesVisited`**: Array of cities included in the tour
- **`tourType`**: Category of tour (Adventure, Cultural, Luxury, etc.)
- **`activities`**: Array of activities included in the tour
- **`dailyActivity`**: JSON object containing day-by-day itinerary
- **`highlights`**: Key features and selling points
- **`description`**: Detailed tour description
- **`photos`**: Array of photo URLs showcasing the tour
- **`status`**: Package status (ACTIVE, INACTIVE)

## 🚀 API Endpoints

### **1. Create Tour Package**
- **Endpoint**: `POST /api/v1/tour-packages`
- **Access**: Admin & Super Admin only
- **Description**: Create a new tour package
- **Validation**: Comprehensive input validation with Zod schemas

### **2. Update Tour Package**
- **Endpoint**: `PATCH /api/v1/tour-packages/:id`
- **Access**: Admin & Super Admin only
- **Description**: Update existing tour package details
- **Validation**: Partial update support with validation

### **3. Delete Tour Package (Soft Delete)**
- **Endpoint**: `DELETE /api/v1/tour-packages/:id`
- **Access**: Admin & Super Admin only
- **Description**: Soft delete tour package (marks as deleted but preserves data)
- **Note**: Uses `deletedAt` timestamp for soft delete functionality

### **4. Get All Tour Packages**
- **Endpoint**: `GET /api/v1/tour-packages`
- **Access**: Public (no authentication required)
- **Description**: Retrieve all active tour packages
- **Features**: Ordered by creation date (newest first), excludes soft-deleted packages

### **5. Get Tour Package by ID**
- **Endpoint**: `GET /api/v1/tour-packages/:id`
- **Access**: Public (no authentication required)
- **Description**: Retrieve specific tour package by ID
- **Features**: Returns detailed package information

## 🔐 Security & Access Control

### **Authentication Required**
- **Create, Update, Delete**: JWT token required
- **Read Operations**: No authentication required (public access)

### **Role-Based Authorization**
- **Admin Operations**: Only ADMIN and SUPER_ADMIN roles can create, update, or delete
- **Public Access**: Anyone can view tour packages

### **Input Validation**
- **Zod Schemas**: Comprehensive validation for all inputs
- **Data Sanitization**: Proper handling of arrays, dates, and JSON data
- **Business Rules**: Date validation (end date must be after start date)

## 📊 Business Logic

### **Package Name Uniqueness**
- Prevents duplicate package names
- Checks existing packages before creation/update
- Excludes soft-deleted packages from uniqueness check

### **Date Validation**
- Ensures end date is after start date
- Supports ISO date string format
- Automatic date conversion and validation

### **Array Field Handling**
- **Cities Visited**: Minimum 1, maximum 50 cities
- **Activities**: Minimum 1, maximum 100 activities
- **Photos**: Minimum 1, maximum 20 photo URLs
- **Daily Activity**: Flexible day structure (day1, day2, day3, etc.)

### **Status Management**
- **ACTIVE**: Package is available for booking
- **INACTIVE**: Package is temporarily unavailable

## 🗄️ Data Management

### **Soft Delete Implementation**
- Uses `deletedAt` timestamp field
- Deleted packages don't appear in public listings
- Data preservation for potential restoration
- No permanent data loss

### **Response Formatting**
- Consistent response structure across all endpoints
- Proper error handling with HTTP status codes
- Comprehensive data selection for optimal performance

### **Database Operations**
- Efficient queries with proper indexing
- Transaction support for data integrity
- Optimized select statements for performance

## 📝 Usage Examples

### **Creating a Tour Package**
```json
{
  "packageName": "Bali Adventure Package",
  "totalMembers": 15,
  "pricePerPerson": 1299.99,
  "startDay": "2024-09-15T00:00:00.000Z",
  "endDay": "2024-09-22T00:00:00.000Z",
  "citiesVisited": ["Denpasar", "Ubud", "Seminyak"],
  "tourType": "Adventure",
  "activities": ["Temple Visit", "Rice Terrace Trek", "Beach Activities"],
  "dailyActivity": {
    "day1": {
      "title": "Arrival & Welcome",
      "description": "Arrive in Bali, transfer to hotel, welcome dinner"
    }
  },
  "highlights": "Experience the best of Bali with adventure activities",
  "description": "Comprehensive 7-day Bali adventure package",
  "photos": ["https://example.com/photo1.jpg"],
  "status": "ACTIVE"
}
```

### **Updating a Tour Package**
```json
{
  "pricePerPerson": 1199.99,
  "status": "ACTIVE",
  "totalMembers": 20
}
```

## 🧪 Testing

### **Test File**
- **File**: `test-tour-packages.http`
- **Contains**: Examples for all endpoints
- **Data**: Realistic tour package examples
- **Format**: HTTP client compatible (Postman, VS Code, etc.)

### **Test Scenarios**
- Create new tour packages
- Update existing packages
- Soft delete packages
- Retrieve packages (all and by ID)
- Error handling and validation

## 🔧 Technical Implementation

### **File Structure**
```
src/app/modules/TourPackage/
├── tourPackage.controller.ts    # HTTP request handlers
├── tourPackage.service.ts       # Business logic
├── tourPackage.validation.ts    # Zod validation schemas
└── tourPackage.route.ts         # API route definitions
```

### **Dependencies**
- **Prisma**: Database operations and schema management
- **Zod**: Input validation and schema definition
- **Express**: HTTP routing and middleware
- **JWT**: Authentication and authorization

### **Integration**
- **Routes**: Integrated into main application routes
- **Middleware**: Uses existing auth and validation middleware
- **Database**: Follows established Prisma patterns
- **Error Handling**: Consistent with application error handling

## 🚀 Future Enhancements

### **Potential Features**
- **Package Categories**: Organize packages by type, region, or duration
- **Search & Filtering**: Advanced search with multiple criteria
- **Booking Integration**: Connect with booking system
- **Review System**: Customer reviews and ratings
- **Photo Management**: Image upload and storage
- **Pricing Tiers**: Different pricing for different group sizes
- **Seasonal Pricing**: Dynamic pricing based on dates
- **Package Templates**: Reusable package structures

### **Performance Optimizations**
- **Caching**: Redis caching for frequently accessed packages
- **Pagination**: Large result set handling
- **Image Optimization**: Compressed photo delivery
- **CDN Integration**: Global content delivery

---

**Status**: ✅ **Complete and Ready for Production**

The Tour Package Management feature is fully implemented with comprehensive CRUD operations, proper validation, security measures, and extensive testing support. The feature follows established patterns and integrates seamlessly with the existing application architecture.
