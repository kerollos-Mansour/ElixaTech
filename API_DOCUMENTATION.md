# 🚀 Easy Learn Backend API Documentation

Welcome to the **Easy Learn** Backend API documentation. This API is built with **Fastify** and uses **Prisma** for database management.

## 📌 Base URL
All API requests should be made to:
`http://localhost:3000/api`

---

## 🔐 Authentication
This API uses **JWT (JSON Web Tokens)** for authentication.
- To access protected routes, include the token in the `Authorization` header:
  `Authorization: Bearer <your_token>`

---

## 📂 Table of Contents
1. [Auth](#-auth)
2. [Categories](#-categories)
3. [Products](#-products)
4. [Cart](#-cart)
5. [Address](#-address)
6. [Orders](#-orders)
7. [Favorites](#-favorites)
8. [Reviews](#-reviews)
9. [Upload](#-upload)

---

## 🔑 Auth
Authentication and user management.

### 1. Register
`POST /auth/register`
Creates a new unverified user and sends an OTP email.

**Request Body (JSON):**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phoneNumber": "+1234567890",
  "role": "CUSTOMER" // or "ADMIN"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "email": "john@example.com"
}
```

### 2. Verify OTP
`POST /auth/verify-otp`
Confirms the OTP code and returns a JWT token.

**Request Body (JSON):**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER",
    "isVerified": true,
    "createdAt": "iso-date",
    "updatedAt": "iso-date"
  },
  "token": "jwt-token-string"
}
```

### 3. Login
`POST /auth/login`
Logs in a verified user.

**Request Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):** Same as Verify OTP.

### 4. Get Current User
`GET /auth/me`
Returns the authenticated user's profile. (Requires JWT)

**Response (200 OK):** Safe user object.

---

## 📁 Categories
Manage product categories.

### 1. Get All Categories
`GET /categories`
**Response (200 OK):** `Array<Category>`

### 2. Get Category By ID
`GET /categories/:id`
**Response (200 OK):** `Category`

### 3. Create Category (Admin Only)
`POST /categories`
**Request Body (JSON):**
```json
{
  "name": "Electronics",
  "imageUrl": "http://link-to-image.com/img.jpg"
}
```

---

## 📦 Products
Product management and discovery.

### 1. Get All Products
`GET /products`
**Response (200 OK):** `Array<Product>`

### 2. Search Products
`GET /products/search?q=query`
**Response (200 OK):** `Array<Product>`

### 3. Filter Products
`GET /products/filter?type=hottest`
Type can be: `hottest`, `popular`, `new`, `top`.

### 4. Get Recommended Products
`GET /products/recommended`

### 5. Get Product By ID
`GET /products/:id`

### 6. Create Product (Admin Only)
`POST /products`
**Content-Type:** `multipart/form-data` or `application/json`

**Fields:**
- `name` (String)
- `description` (String)
- `price` (Number)
- `stockQuantity` (Integer)
- `categoryId` (UUID)
- `isRecommended` (Boolean)
- `images` (File(s) - if multipart)

---

## 🛒 Cart
Manage user shopping cart. (Requires JWT)

### 1. Get User Cart
`GET /cart`
**Response (200 OK):**
```json
{
  "items": [],
  "totalAmount": 0
}
```

### 2. Add Item to Cart
`POST /cart`
**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

### 3. Update Cart Item Quantity
`PATCH /cart/:itemId`
**Request Body:** `{"quantity": 2}`

### 4. Remove Item from Cart
`DELETE /cart/:itemId`

---

## 📍 Address
User shipping addresses. (Requires JWT)

### 1. Get My Addresses
`GET /address`

### 2. Create Address
`POST /address`
**Request Body:**
```json
{
  "addressDetails": "123 Main St, Apt 4B",
  "phoneNumber": "+1234567890",
  "isDefault": true
}
```

---

## 🧾 Orders
Order placement and tracking. (Requires JWT)

### 1. Create Order
`POST /orders`
**Request Body:**
```json
{
  "addressId": "uuid",
  "contactNumber": "+1234567890",
  "paymentMethod": "CASH_ON_DELIVERY" // or "CREDIT_CARD"
}
```

### 2. Get My Orders
`GET /orders`

### 3. Track Order
`GET /orders/:id/track`

---

## ❤️ Favorites
Manage user favorite products. (Requires JWT)

### 1. Get My Favorites
`GET /favorites`

### 2. Add to Favorites
`POST /favorites/:productId`

### 3. Remove from Favorites
`DELETE /favorites/:productId`

---

## ⭐ Reviews
Product ratings and reviews.

### 1. Get Product Reviews
`GET /products/:id/reviews`

### 2. Add Review (Requires JWT)
`POST /products/:id/reviews`
**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

---

## 📤 Upload
Generic file upload utility. (Admin Only)

### 1. Upload File
`POST /upload?folder=products`
**Content-Type:** `multipart/form-data`
**Field:** `file`

### 2. Delete File
`DELETE /upload`
**Request Body:** `{"url": "file-url-to-delete"}`
