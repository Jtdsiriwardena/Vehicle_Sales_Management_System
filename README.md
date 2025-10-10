# CarvanaX - Vehicle Sales Management System

A modern, AI-powered vehicle sales management system built with **React.js**, **Node.js**, **Express**, **TypeScript**, and **MySQL**, and **Jest**. This platform provides **vehicle management** for administrators and a **user-friendly browsing experience** for customers.

&nbsp;
# ⚙️ Setup Instructions

## 1. Prerequisites
Before setting up the project, ensure you have the following installed on your system:

- **Node.js** (v16 or higher)  
- **MySQL Server**  
- **npm** or **yarn**  

## 2. Clone the Repository
```bash
git clone https://github.com/Jtdsiriwardena/vehicle-sales-management-system.git
cd vehicle-sales-management-system
```

## 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 4. Backend Setup (Node.js + Express + TypeScript)
```bash
cd backend
npm install
```

## 5. Environment Configuration
Create a `.env` file in the backend root directory:
```env
PORT=your_port
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=vehicle_management_db
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 6. Database Setup
```sql
CREATE DATABASE vehicle_management_db;
```

## 7. Database Migrations
If using TypeORM:
```bash
npm run typeorm migration:run
```

## 8. Start the Application

### Backend Server:
```bash
cd backend
npm run dev
```

### Frontend Server:
```bash
cd frontend
npm run dev
```

&nbsp;
## ✨ Features Implemented

### 1. Authentication
- Admin login with JWT-based authentication (username/password)
- Secure password hashing using bcrypt

### 2. Vehicle Management (Admin)
- Add new vehicles with comprehensive details
- Edit vehicle details with option to regenerate AI description
- Delete vehicles permanently from the system
- View all vehicles with advanced sorting and pagination
- Generate vehicle description via OpenAI API

### 3. Admin Dashboard Stats
- Total Vehicles count at a glance
- Total Value (sum of all vehicle prices)
- Average Price calculation
- Latest Added Vehicles overview

### 4. Analytics (Admin)
- Growth Rate over month
- Top Brand by vehicle count
- Popular Vehicle Type by count
- Monthly Growth trends

### 5. AI-Powered Vehicle Description
- ChatGPT integration for automatic description generation
- Editable AI descriptions before saving to database
- Regeneration option for updated descriptions

### 6. Customer Features
- Browse Vehicles in list and grid view
- Advanced Search & Filter by brand, model, year, price range, and vehicle type
- Smart Filtering by color and engine size
- Multiple Sort Options by date added, price, or year
- Detailed Vehicle Pages with images, specifications, and AI-generated descriptions

&nbsp;
## ⚠️ Assumptions & Limitations

### Assumptions
1. The system assumes only admins can add, edit, or delete vehicles.
2. Each vehicle has at least brand and model to generate an AI-powered description.
3. Vehicle images uploaded are valid image files (PNG, JPG, GIF) and do not exceed 5MB per file.
4. The backend server runs on Node.js with MySQL as the database.
5. JWT tokens are required for accessing admin-only APIs.
6. AI-generated descriptions are suggestions and can be edited by the admin before saving.
7. Customers can only browse vehicles; they do not have accounts or login functionality yet.

### Limitations
1. The system does not support multiple user roles beyond admin at the moment.
2. AI description generation requires an OpenAI API key; if unavailable, descriptions must be manually entered.
3. No real-time notifications or chat features for customer inquiries yet.

&nbsp;
## 📡 API Endpoints

### 1. Authentication (Admin)

| Method | Endpoint | Description | Request Body |
| --- | --- | --- | --- |
| POST | /api/auth/login | Admin login, returns JWT token | `{ "username": "admin", "password": "secret" }` |

### 2. Vehicle Management (Admin)

| Method | Endpoint | Description | Request Body |
| --- | --- | --- | --- |
| POST | /api/vehicles | Add new vehicle with optional AI description | `{ type, brand, model, color, engineSize?, year?, price?, description?, images[] }` |
| GET | /api/vehicles | Get all vehicles with optional filters | Query params: `brand, model, type, year, minPrice, maxPrice` |
| GET | /api/vehicles/:id | Get a single vehicle by ID | – |
| PUT | /api/vehicles/:id | Update vehicle with optional AI regeneration | `{ type?, brand?, model?, color?, engineSize?, year?, price?, description?, regenerate?, keepImages? }` |
| DELETE | /api/vehicles/:id | Delete a vehicle | – |
| POST | /api/vehicles/generate-description | Generate vehicle description via OpenAI | `{ brand, model, type?, color?, engineSize?, year? }` |

&nbsp;
### 3. Analytics (Admin)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/analytics/vehicles-added | Vehicles added per week |
| GET | /api/analytics/count-by-brand | Total vehicle count grouped by brand |
| GET | /api/analytics/count-by-type | Total vehicle count grouped by type |
| GET | /api/analytics/count-by-price-range | Vehicle count per price range |

&nbsp;
### 4. Customer Features

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/vehicles | Browse all vehicles (with filters & sorting) |
| GET | /api/vehicles/:id | Vehicle details including images, specifications, AI description |

&nbsp;
## 📸 Screenshots

### Customer Home Page
![Customer Page](https://github.com/user-attachments/assets/55f5ff81-cadd-45f6-9599-3b0e13181dfe)

&nbsp;
### Vehicle Details Page
<img width="1920" height="1305" alt="Image" src="https://github.com/user-attachments/assets/ed49cbf6-6e95-4b20-8bb6-d038f57fea50" />

&nbsp;
### Admin Dashboard with statistics and vehicle management
![Admin Dashboard](https://github.com/user-attachments/assets/752ff2c5-1fdd-4fa6-bbd6-cc13e52d24f1)

&nbsp;
### Analytics Dashboard 
<img width="1592" height="2072" alt="Image" src="https://github.com/user-attachments/assets/115a35ab-812a-4244-a468-992c7793ec32" />

&nbsp;
## 📂 More Screenshots & Demo Video

You can view all the **UI Screenshots**, **Testing Screenshots**, and the **Demo Video** in the following Google Drive folder:

[👉 View More Screenshots & Demo](https://drive.google.com/drive/folders/1ooytqgpmWBUpYWqk37ox5iwncPmUy9zR?usp=sharing)


