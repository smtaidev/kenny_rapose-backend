# 🧪 Testing Tour Package Feature

## 📋 Overview

This guide provides comprehensive testing instructions for the Tour Package Management feature. The feature includes 5 main endpoints with different access levels and validation requirements.

## 🚀 Prerequisites

### **Required Setup**
- ✅ Backend server running on `http://localhost:5000`
- ✅ Database connected and migrations applied
- ✅ Admin user account with valid JWT token
- ✅ Postman or HTTP client for testing

### **Admin Authentication**
- **Endpoint**: `POST /api/v1/auth/login`
- **Credentials**: Use admin account (ADMIN or SUPER_ADMIN role)
- **Token**: Copy the `accessToken` from the response

## 🧪 Test Scenarios

### **1. Create Tour Package (Admin Only)**

#### **Test Case**: Create Valid Tour Package
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/tour-packages`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "packageName": "Bali Adventure Package",
    "totalMembers": 15,
    "pricePerPerson": 1299.99,
    "startDay": "2024-09-15T00:00:00.000Z",
    "endDay": "2024-09-22T00:00:00.000Z",
    "citiesVisited": ["Denpasar", "Ubud", "Seminyak", "Nusa Penida"],
    "tourType": "Adventure",
    "activities": ["Temple Visit", "Rice Terrace Trek", "Beach Activities", "Water Sports", "Cultural Show"],
    "dailyActivity": {
      "day1": {
        "title": "Arrival & Welcome Dinner",
        "description": "Arrive in Bali, transfer to hotel, welcome dinner with traditional Balinese cuisine"
      },
      "day2": {
        "title": "Temple Tour & Cultural Experience",
        "description": "Visit Tanah Lot Temple, Uluwatu Temple, and traditional dance performance"
      }
    },
    "highlights": "Experience the best of Bali with adventure activities, cultural immersion, and stunning landscapes",
    "description": "This comprehensive 7-day Bali adventure package offers a perfect blend of cultural experiences, adventure activities, and relaxation.",
    "photos": [
      "https://example.com/bali-temple.jpg",
      "https://example.com/bali-rice-terraces.jpg"
    ],
    "status": "ACTIVE"
  }
  ```

#### **Expected Response**:
- **Status Code**: `201 Created`
- **Response**: New tour package with generated ID
- **Validation**: All fields properly saved and formatted

#### **Test Case**: Create Package Without Authentication
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/tour-packages`
- **Headers**: `Content-Type: application/json` (No Authorization)
- **Expected Response**: `401 Unauthorized`

#### **Test Case**: Create Package with Invalid Data
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/tour-packages`
- **Headers**: Include valid admin token
- **Body**: Invalid data (e.g., end date before start date)
- **Expected Response**: `400 Bad Request` with validation errors

### **2. Get All Tour Packages (Public)**

#### **Test Case**: Get All Packages
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/tour-packages`
- **Headers**: None required
- **Expected Response**: `200 OK` with array of tour packages

#### **Test Case**: Verify Soft-Deleted Packages Hidden
- **Steps**:
  1. Create a tour package
  2. Soft delete the package
  3. Get all packages
- **Expected Result**: Deleted package should not appear in the list

### **3. Get Tour Package by ID (Public)**

#### **Test Case**: Get Valid Package
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/tour-packages/{PACKAGE_ID}`
- **Headers**: None required
- **Expected Response**: `200 OK` with package details

#### **Test Case**: Get Non-Existent Package
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/tour-packages/invalid-id`
- **Expected Response**: `404 Not Found`

#### **Test Case**: Get Soft-Deleted Package
- **Steps**:
  1. Create a tour package
  2. Soft delete the package
  3. Try to get the package by ID
- **Expected Response**: `404 Not Found`

### **4. Update Tour Package (Admin Only)**

#### **Test Case**: Update Valid Package
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/tour-packages/{PACKAGE_ID}`
- **Headers**:
  ```
  Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "pricePerPerson": 1199.99,
    "status": "ACTIVE",
    "totalMembers": 20
  }
  ```
- **Expected Response**: `200 OK` with updated package

#### **Test Case**: Update Non-Existent Package
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/tour-packages/invalid-id`
- **Expected Response**: `404 Not Found`

#### **Test Case**: Update Package Name to Duplicate
- **Steps**:
  1. Create two packages with different names
  2. Try to update second package name to match first
- **Expected Response**: `409 Conflict` - Package name already exists

#### **Test Case**: Update Without Authentication
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/tour-packages/{PACKAGE_ID}`
- **Headers**: `Content-Type: application/json` (No Authorization)
- **Expected Response**: `401 Unauthorized`

### **5. Delete Tour Package (Admin Only) - Soft Delete**

#### **Test Case**: Delete Valid Package
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/tour-packages/{PACKAGE_ID}`
- **Headers**: `Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN`
- **Expected Response**: `200 OK` with success message

#### **Test Case**: Delete Non-Existent Package
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/tour-packages/invalid-id`
- **Expected Response**: `404 Not Found`

#### **Test Case**: Delete Already Deleted Package
- **Steps**:
  1. Create a tour package
  2. Delete the package (soft delete)
  3. Try to delete the same package again
- **Expected Response**: `404 Not Found`

#### **Test Case**: Delete Without Authentication
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/tour-packages/{PACKAGE_ID}`
- **Headers**: None
- **Expected Response**: `401 Unauthorized`

## 🔍 Validation Testing

### **Package Name Validation**
- **Test**: Empty package name
- **Expected**: `400 Bad Request` - "Package name is required"

- **Test**: Package name too long (>100 characters)
- **Expected**: `400 Bad Request` - "Package name too long"

- **Test**: Duplicate package name
- **Expected**: `409 Conflict` - "Tour package with this name already exists"

### **Date Validation**
- **Test**: End date before start date
- **Expected**: `400 Bad Request` - "End day must be after start day"

- **Test**: Invalid date format
- **Expected**: `400 Bad Request` - "Start day must be a valid date"

### **Array Field Validation**
- **Test**: Empty cities array
- **Expected**: `400 Bad Request` - "At least one city must be specified"

- **Test**: Too many cities (>50)
- **Expected**: `400 Bad Request` - "Cannot exceed 50 cities"

- **Test**: Empty activities array
- **Expected**: `400 Bad Request` - "At least one activity must be specified"

- **Test**: Too many photos (>20)
- **Expected**: `400 Bad Request` - "Cannot exceed 20 photos"

### **Daily Activity Validation**
- **Test**: Invalid day key format (not day1, day2, etc.)
- **Expected**: `400 Bad Request` - "Day key must be in format: day1, day2, day3, etc."

- **Test**: Missing title or description in daily activity
- **Expected**: `400 Bad Request` - "Day title is required" or "Day description is required"

## 📊 Performance Testing

### **Load Testing**
- **Test**: Get all packages with many records
- **Expected**: Response time < 500ms for 100+ packages

- **Test**: Create multiple packages rapidly
- **Expected**: No duplicate name conflicts

### **Data Integrity**
- **Test**: Verify soft delete doesn't affect other operations
- **Test**: Ensure package name uniqueness across active packages only

## 🚨 Error Handling Testing

### **Authentication Errors**
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient role permissions

### **Validation Errors**
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Package doesn't exist or is soft-deleted
- **409 Conflict**: Duplicate package name

### **Server Errors**
- **500 Internal Server Error**: Database connection issues or unexpected errors

## 📝 Test Data Examples

### **Sample Tour Package 1 - Adventure**
```json
{
  "packageName": "Himalayan Trek",
  "totalMembers": 12,
  "pricePerPerson": 899.99,
  "startDay": "2024-10-01T00:00:00.000Z",
  "endDay": "2024-10-08T00:00:00.000Z",
  "citiesVisited": ["Kathmandu", "Pokhara", "Annapurna Base Camp"],
  "tourType": "Trekking",
  "activities": ["Mountain Climbing", "Camping", "Local Village Visits"],
  "dailyActivity": {
    "day1": {
      "title": "Arrival in Kathmandu",
      "description": "Arrive in Kathmandu, welcome dinner, trek briefing"
    }
  },
  "highlights": "Experience the majestic Himalayas with expert guides",
  "description": "8-day trek to Annapurna Base Camp with stunning mountain views",
  "photos": ["https://example.com/himalayas.jpg"],
  "status": "ACTIVE"
}
```

### **Sample Tour Package 2 - Cultural**
```json
{
  "packageName": "Japanese Heritage Tour",
  "totalMembers": 18,
  "pricePerPerson": 1899.99,
  "startDay": "2024-11-01T00:00:00.000Z",
  "endDay": "2024-11-10T00:00:00.000Z",
  "citiesVisited": ["Tokyo", "Kyoto", "Osaka", "Nara"],
  "tourType": "Cultural",
  "activities": ["Temple Visits", "Tea Ceremony", "Traditional Crafts", "Cherry Blossom Viewing"],
  "dailyActivity": {
    "day1": {
      "title": "Tokyo Arrival",
      "description": "Arrive in Tokyo, visit Senso-ji Temple, welcome dinner"
    }
  },
  "highlights": "Immerse yourself in traditional Japanese culture and history",
  "description": "10-day cultural journey through Japan's most historic cities",
  "photos": ["https://example.com/japan-temple.jpg"],
  "status": "ACTIVE"
}
```

## ✅ Success Criteria

### **Functional Requirements**
- ✅ All CRUD operations work correctly
- ✅ Authentication and authorization properly enforced
- ✅ Validation rules correctly applied
- ✅ Soft delete functionality working
- ✅ Public read access working
- ✅ Admin-only operations secured

### **Performance Requirements**
- ✅ Response times under 500ms for standard operations
- ✅ No memory leaks or performance degradation
- ✅ Proper error handling without crashes

### **Security Requirements**
- ✅ JWT authentication enforced for admin operations
- ✅ Role-based access control working
- ✅ Input validation prevents malicious data
- ✅ No unauthorized access to admin functions

## 🔧 Troubleshooting

### **Common Issues**
1. **Permission Denied**: Ensure admin role and valid JWT token
2. **Validation Errors**: Check all required fields and data formats
3. **Package Not Found**: Verify package ID and soft delete status
4. **Duplicate Name**: Ensure package name is unique among active packages

### **Debug Steps**
1. Check JWT token expiration
2. Verify database connection
3. Review validation schema requirements
4. Check soft delete implementation

---

**Status**: ✅ **Ready for Comprehensive Testing**

This testing guide covers all aspects of the Tour Package feature. Use the provided test cases and examples to thoroughly validate the functionality before production deployment.
