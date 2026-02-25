# 🚗 WHEELIFY – Vehicle Rental System API

🔗 **Live API URL:*https://wheelify-smoky.vercel.app/*  
🔗 **GitHub Repository:**  

---

## 🎯 Project Overview

The **Vehicle Rental System API** is a secure and modular backend application built to manage a vehicle rental business.

It provides complete functionality for:

- 🚘 Vehicle inventory management  
- 👤 Customer account management  
- 📅 Booking and rental processing  
- 🔐 Role-based authentication & authorization  

### 👥 Supported Roles

- **Admin** – Full access to manage vehicles, users, and bookings  
- **Customer** – Can register, view vehicles, and manage their own bookings  

---

## 🛠️ Technology Stack

- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **bcrypt** (Password hashing)
- **jsonwebtoken (JWT)** (Authentication & Authorization)
- **Node.js**

---

# 📊 Database Schema

## 👥 Users Table

| Field | Description |
|-------|------------|
| id | Auto-generated |
| name | Required |
| email | Required, unique, lowercase |
| password | Required, min 6 characters |
| phone | Required |
| role | admin or customer |

---

## 🚗 Vehicles Table

| Field | Description |
|-------|------------|
| id | Auto-generated |
| vehicle_name | Required |
| type | car, bike, van, SUV |
| registration_number | Required, unique |
| daily_rent_price | Required, positive |
| availability_status | available or booked |

---

## 📅 Bookings Table

| Field | Description |
|-------|------------|
| id | Auto-generated |
| customer_id | References Users table |
| vehicle_id | References Vehicles table |
| rent_start_date | Required |
| rent_end_date | Required (must be after start date) |
| total_price | Calculated automatically |
| status | active, cancelled, returned |

---

# 🔐 Authentication & Authorization

## 🔑 Authentication Flow

1. Passwords are hashed using **bcrypt** before saving.
2. User logs in via:

```bash
POST /api/v1/auth/signin
```

3. A JWT token is returned.
4. Protected routes require:

```bash
Authorization: Bearer <token>
```

5. Middleware validates:
   - Token authenticity
   - User role permissions

---

## 🚦 Access Control

| Role | Permissions |
|------|------------|
| Admin | Full access |
| Customer | Manage own bookings & profile |

---

# 🌐 API Endpoints Overview

## 🔐 Auth

```bash
POST   /api/v1/auth/signup
POST   /api/v1/auth/signin
```

## 🚗 Vehicles

```bash
POST   /api/v1/vehicles              (Admin)
GET    /api/v1/vehicles
GET    /api/v1/vehicles/:vehicleId
PUT    /api/v1/vehicles/:vehicleId   (Admin)
DELETE /api/v1/vehicles/:vehicleId   (Admin)
```

## 👥 Users

```bash
GET    /api/v1/users                 (Admin)
PUT    /api/v1/users/:userId
DELETE /api/v1/users/:userId         (Admin)
```

## 📅 Bookings

```bash
POST   /api/v1/bookings
GET    /api/v1/bookings
PUT    /api/v1/bookings/:bookingId
```

---

# 💡 Business Logic Highlights

## 💰 Booking Price Calculation

```bash
total_price = daily_rent_price × number_of_days
number_of_days = rent_end_date - rent_start_date
```

---

## 🔄 Vehicle Availability Rules

| Action | Vehicle Status |
|--------|----------------|
| Booking Created | booked |
| Booking Cancelled | available |
| Booking Returned | available |

---

## ⏳ Auto-Return Logic

- Bookings automatically change to `returned` after `rent_end_date`
- Vehicle availability updates accordingly

---

## ❌ Deletion Constraints

- Users cannot be deleted if they have active bookings
- Vehicles cannot be deleted if they have active bookings
- Active booking = `status = "active"`

---

# ⚙️ Setup & Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/vehicle-rental-system.git
cd vehicle-rental-system
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
CONNECTION_STRING=your_postgresql_connection_string
SECRET=your_jwt_secret
```

⚠️ Never expose your real database credentials publicly.

---

## 4️⃣ Run Database

Ensure PostgreSQL is running and required tables are created.

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5000
```

---

# 🧪 Testing the API

You can test using:

- Postman
- Thunder Client
- Insomnia

Include JWT token in protected routes:

```bash
Authorization: Bearer <token>
```

---

# 📦 Deployment

### Recommended Platforms

- Vercel
- Render
- Railway

### Ensure:

- Environment variables are configured
- PostgreSQL production database is connected
- Production build is used

---

# 👨‍💻 Author

**Faisal Mahmud Akash**  
Backend Developer  
WHEELIFY – Vehicle Rental System API