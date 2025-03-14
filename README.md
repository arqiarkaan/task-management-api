# Task Management API Documentation

## Ringkasan

API ini digunakan untuk mengelola tugas, proyek, dan pengguna dalam aplikasi manajemen tugas. API ini dikembangkan menggunakan Express.js dan MongoDB.

## Base URL

```
http://localhost:3000/api
```

## Autentikasi

API ini menggunakan JWT (JSON Web Token) untuk autentikasi. Token harus disertakan dalam header Authorization untuk mengakses endpoint yang dilindungi.

Format header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. User API

#### 1.1 Register User

- **URL**: `/users`
- **Method**: `POST`
- **Auth Required**: No
- **Content-Type**: `multipart/form-data` (untuk upload avatar)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "avatar": [File]
}
```

**Success Response:**

- **Code**: 201 Created

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60a1e2c05c2c1a2d3456789a",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "uploads/1621234567890-avatar.jpg",
    "role": "user"
  }
}
```

**Error Responses:**

- **Code**: 400 Bad Request

```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendaftarkan pengguna",
  "error": "Error message"
}
```

#### 1.2 Login User

- **URL**: `/users/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60a1e2c05c2c1a2d3456789a",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "uploads/1621234567890-avatar.jpg",
    "role": "user"
  }
}
```

**Error Responses:**

- **Code**: 400 Bad Request

```json
{
  "success": false,
  "message": "Email dan password wajib diisi"
}
```

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal login",
  "error": "Error message"
}
```

#### 1.3 Get Current User

- **URL**: `/users/me`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789a",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "uploads/1621234567890-avatar.jpg",
    "role": "user",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan profil",
  "error": "Error message"
}
```

#### 1.4 Update User Details

- **URL**: `/users/me`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data` (untuk upload avatar)

**Request Body:**

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "avatar": [File]
}
```

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789a",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "avatar": "uploads/1621234567890-updated-avatar.jpg",
    "role": "user",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal memperbarui profil",
  "error": "Error message"
}
```

#### 1.5 Delete User

- **URL**: `/users/me`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "message": "Akun berhasil dihapus"
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal menghapus akun",
  "error": "Error message"
}
```

#### 1.6 Get All Users (Admin Only)

- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60a1e2c05c2c1a2d3456789a",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "uploads/1621234567890-avatar.jpg",
      "role": "user",
      "createdAt": "2023-05-17T12:00:00.000Z"
    },
    {
      "_id": "60a1e2c05c2c1a2d3456789b",
      "name": "Admin User",
      "email": "admin@example.com",
      "avatar": "uploads/1621234567891-avatar.jpg",
      "role": "admin",
      "createdAt": "2023-05-17T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Role user tidak diizinkan untuk akses ini"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan daftar pengguna",
  "error": "Error message"
}
```

#### 1.7 Get User by ID (Admin Only)

- **URL**: `/users/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789a",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "uploads/1621234567890-avatar.jpg",
    "role": "user",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Role user tidak diizinkan untuk akses ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Pengguna tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan pengguna",
  "error": "Error message"
}
```

### 2. Project API

#### 2.1 Create Project

- **URL**: `/projects`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body:**

```json
{
  "name": "Website Redesign",
  "description": "Redesign company website with modern UI",
  "startDate": "2023-05-20T00:00:00.000Z",
  "endDate": "2023-06-20T00:00:00.000Z",
  "status": "planning"
}
```

**Success Response:**

- **Code**: 201 Created

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789c",
    "name": "Website Redesign",
    "description": "Redesign company website with modern UI",
    "startDate": "2023-05-20T00:00:00.000Z",
    "endDate": "2023-06-20T00:00:00.000Z",
    "status": "planning",
    "createdBy": "60a1e2c05c2c1a2d3456789a",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal membuat proyek",
  "error": "Error message"
}
```

#### 2.2 Get All Projects

- **URL**: `/projects`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60a1e2c05c2c1a2d3456789c",
      "name": "Website Redesign",
      "description": "Redesign company website with modern UI",
      "startDate": "2023-05-20T00:00:00.000Z",
      "endDate": "2023-06-20T00:00:00.000Z",
      "status": "planning",
      "createdBy": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdAt": "2023-05-17T12:00:00.000Z"
    },
    {
      "_id": "60a1e2c05c2c1a2d3456789d",
      "name": "Mobile App Development",
      "description": "Develop a mobile app for the company",
      "startDate": "2023-06-01T00:00:00.000Z",
      "endDate": "2023-07-30T00:00:00.000Z",
      "status": "planning",
      "createdBy": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdAt": "2023-05-17T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan daftar proyek",
  "error": "Error message"
}
```

#### 2.3 Get Project by ID

- **URL**: `/projects/:id`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "project": {
      "_id": "60a1e2c05c2c1a2d3456789c",
      "name": "Website Redesign",
      "description": "Redesign company website with modern UI",
      "startDate": "2023-05-20T00:00:00.000Z",
      "endDate": "2023-06-20T00:00:00.000Z",
      "status": "planning",
      "createdBy": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdAt": "2023-05-17T12:00:00.000Z"
    },
    "tasks": [
      {
        "_id": "60a1e2c05c2c1a2d3456789e",
        "title": "Design Homepage",
        "description": "Create a modern design for the homepage",
        "priority": "high",
        "status": "todo",
        "dueDate": "2023-05-25T00:00:00.000Z",
        "project": "60a1e2c05c2c1a2d3456789c",
        "assignedTo": {
          "_id": "60a1e2c05c2c1a2d3456789a",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "uploads/1621234567890-avatar.jpg"
        },
        "createdAt": "2023-05-17T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses (continued):**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk melihat proyek ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Proyek tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan proyek",
  "error": "Error message"
}
```

#### 2.4 Update Project

- **URL**: `/projects/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body:**

```json
{
  "name": "Website Redesign Updated",
  "description": "Redesign company website with modern UI and better UX",
  "status": "ongoing"
}
```

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789c",
    "name": "Website Redesign Updated",
    "description": "Redesign company website with modern UI and better UX",
    "startDate": "2023-05-20T00:00:00.000Z",
    "endDate": "2023-06-20T00:00:00.000Z",
    "status": "ongoing",
    "createdBy": "60a1e2c05c2c1a2d3456789a",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk mengubah proyek ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Proyek tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal memperbarui proyek",
  "error": "Error message"
}
```

#### 2.5 Delete Project

- **URL**: `/projects/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "message": "Proyek berhasil dihapus"
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk menghapus proyek ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Proyek tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal menghapus proyek",
  "error": "Error message"
}
```

### 3. Task API

#### 3.1 Create Task

- **URL**: `/tasks`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body:**

```json
{
  "title": "Design Homepage",
  "description": "Create a modern design for the homepage",
  "priority": "high",
  "status": "todo",
  "dueDate": "2023-05-25T00:00:00.000Z",
  "project": "60a1e2c05c2c1a2d3456789c",
  "assignedTo": "60a1e2c05c2c1a2d3456789a"
}
```

**Success Response:**

- **Code**: 201 Created

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789e",
    "title": "Design Homepage",
    "description": "Create a modern design for the homepage",
    "priority": "high",
    "status": "todo",
    "dueDate": "2023-05-25T00:00:00.000Z",
    "project": "60a1e2c05c2c1a2d3456789c",
    "assignedTo": "60a1e2c05c2c1a2d3456789a",
    "createdBy": "60a1e2c05c2c1a2d3456789a",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk menambahkan tugas ke proyek ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Proyek tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal membuat tugas",
  "error": "Error message"
}
```

#### 3.2 Get All Tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `project`: Filter tugas berdasarkan ID proyek

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60a1e2c05c2c1a2d3456789e",
      "title": "Design Homepage",
      "description": "Create a modern design for the homepage",
      "priority": "high",
      "status": "todo",
      "dueDate": "2023-05-25T00:00:00.000Z",
      "project": {
        "_id": "60a1e2c05c2c1a2d3456789c",
        "name": "Website Redesign",
        "description": "Redesign company website with modern UI"
      },
      "assignedTo": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdBy": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdAt": "2023-05-17T12:00:00.000Z"
    },
    {
      "_id": "60a1e2c05c2c1a2d3456789f",
      "title": "Implement Frontend",
      "description": "Implement the frontend using React",
      "priority": "medium",
      "status": "todo",
      "dueDate": "2023-06-05T00:00:00.000Z",
      "project": {
        "_id": "60a1e2c05c2c1a2d3456789c",
        "name": "Website Redesign",
        "description": "Redesign company website with modern UI"
      },
      "assignedTo": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdBy": {
        "_id": "60a1e2c05c2c1a2d3456789a",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "uploads/1621234567890-avatar.jpg"
      },
      "createdAt": "2023-05-17T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan daftar tugas",
  "error": "Error message"
}
```

#### 3.3 Get Task by ID

- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789e",
    "title": "Design Homepage",
    "description": "Create a modern design for the homepage",
    "priority": "high",
    "status": "todo",
    "dueDate": "2023-05-25T00:00:00.000Z",
    "project": {
      "_id": "60a1e2c05c2c1a2d3456789c",
      "name": "Website Redesign",
      "description": "Redesign company website with modern UI"
    },
    "assignedTo": {
      "_id": "60a1e2c05c2c1a2d3456789a",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "uploads/1621234567890-avatar.jpg"
    },
    "createdBy": {
      "_id": "60a1e2c05c2c1a2d3456789a",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "uploads/1621234567890-avatar.jpg"
    },
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk melihat tugas ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Tugas tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal mendapatkan tugas",
  "error": "Error message"
}
```

#### 3.4 Update Task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body:**

```json
{
  "title": "Design Homepage Updated",
  "description": "Create a modern design for the homepage with better UX",
  "status": "in-progress"
}
```

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "60a1e2c05c2c1a2d3456789e",
    "title": "Design Homepage Updated",
    "description": "Create a modern design for the homepage with better UX",
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2023-05-25T00:00:00.000Z",
    "project": "60a1e2c05c2c1a2d3456789c",
    "assignedTo": "60a1e2c05c2c1a2d3456789a",
    "createdBy": "60a1e2c05c2c1a2d3456789a",
    "createdAt": "2023-05-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk mengubah tugas ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Tugas tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal memperbarui tugas",
  "error": "Error message"
}
```

#### 3.5 Delete Task

- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Success Response:**

- **Code**: 200 OK

```json
{
  "success": true,
  "message": "Tugas berhasil dihapus"
}
```

**Error Responses:**

- **Code**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Akses tidak diizinkan, token tidak ditemukan"
}
```

- **Code**: 403 Forbidden

```json
{
  "success": false,
  "message": "Tidak diizinkan untuk menghapus tugas ini"
}
```

- **Code**: 404 Not Found

```json
{
  "success": false,
  "message": "Tugas tidak ditemukan"
}
```

- **Code**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Gagal menghapus tugas",
  "error": "Error message"
}
```