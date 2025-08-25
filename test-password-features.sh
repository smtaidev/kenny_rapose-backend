#!/bin/bash

# Test Password Features Script
# Make sure your server is running on localhost:3000

echo "🔐 Testing Password Features"
echo "================================"

# Base URL
BASE_URL="http://localhost:3000/api/v1"

echo "📝 Step 1: Login to get JWT token"
echo "Replace email/password with your actual user credentials:"
echo ""
echo "curl -X POST $BASE_URL/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"user@example.com\", \"password\": \"currentPassword\"}'"
echo ""

echo "📝 Step 2: Copy the accessToken from login response"
echo "📝 Step 3: Test Change Password"
echo ""
echo "curl -X POST $BASE_URL/users/change-password \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \\"
echo "  -d '{\"oldPassword\": \"currentPassword\", \"newPassword\": \"newPassword123\"}'"
echo ""

echo "🔄 Testing Reset Password Feature"
echo "================================"

echo "📝 Step 1: Request Reset OTP"
echo ""
echo "curl -X POST $BASE_URL/users/request-reset-password-otp \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"user@example.com\"}'"
echo ""

echo "📝 Step 2: Check email for OTP, then verify it"
echo ""
echo "curl -X POST $BASE_URL/users/verify-reset-password-otp \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"user@example.com\", \"otp\": \"123456\"}'"
echo ""

echo "📝 Step 3: Reset password"
echo ""
echo "curl -X POST $BASE_URL/users/reset-password \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"user@example.com\", \"newPassword\": \"resetPassword789\"}'"
echo ""

echo "✅ Testing completed!"
echo ""
echo "📋 Error Scenarios to Test:"
echo "- Wrong old password in change password"
echo "- Invalid JWT token"
echo "- Expired OTP"
echo "- Invalid OTP"
echo "- Missing required fields"
