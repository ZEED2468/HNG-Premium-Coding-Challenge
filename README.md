 **API Mastery: Build a Scalable RESTful API** 

---

# Task Management API

## Overview

The Task Management API is a scalable RESTful API that enables users to manage tasks with full CRUD functionality. Key features include authentication, robust error handling, and optimizations for handling a large number of users and tasks efficiently. The API is built using NestJS, TypeORM, PostgreSQL, and JWT for secure user management.

## Features

- **User Authentication**: User registration and login, with JWT token-based access control.
- **Task Management**: CRUD operations for tasks, with task ownership and assignment.
- **Task Filtering and Pagination**: Efficiently handles large task lists with filtering options.
- **Scalability**: Optimized to manage growing user and task data.
- **Error Handling**: Meaningful error messages and standardized HTTP responses.
- **Swagger Documentation**: API documentation with endpoint details, parameters, and response formats.

---

## Project Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** database
- **Git** (for cloning the repository)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <the-repository-url>
   cd task-management-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   - Create a `.env` file in the root directory and copy the contents from `.env.sample`.
   - Fill in the required values:
     ```plaintext
     DATABASE_HOST=<your-database-host>
     DATABASE_PORT=<your-database-port>
     DATABASE_USER=<your-database-username>
     DATABASE_PASSWORD=<your-database-password>
     DATABASE_NAME=<your-database-name>
     ```

4. **Run Database Migrations** (if applicable):
   ```bash
   npm run typeorm:migration:run
   ```

5. **Start the Server**:
   ```bash
   npm run start
   ```
   The API will be accessible at `http://localhost:3000`.

---

## API Documentation

Comprehensive API documentation is available via Swagger:

- **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This documentation covers all endpoints, required parameters, and expected responses.

---

## Endpoints

### User Authentication

- **Register a New User**
  - **POST** `/users/register`
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "username": "user123",
      "password": "password123"
    }
    ```
  - **Response**: JSON object with user details.

- **User Login**
  - **POST** `/users/login`
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**: JWT token for authenticated access.

- **JWT Authentication**: Add the generated token to the `Authorization` header as `Bearer <token>` to access protected routes.

### Task Management

- **Create a Task**
  - **POST** `/tasks`
  - **Request Body** (authenticated):
    ```json
    {
      "title": "Finish project report",
      "description": "Complete and submit the report",
      "dueDate": "2024-12-31",
      "status": "pending",
      "priority": "medium"
    }
    ```

- **Retrieve All Tasks (with Pagination and Filtering)**
  - **GET** `/tasks`
  - **Optional Query Parameters**:
    - `status`, `priority`, `tags`, `page`, `limit`
  - **Example**: `/tasks?status=pending&priority=high&page=1&limit=10`

- **Retrieve Task by ID**
  - **GET** `/tasks/:id`

- **Update Task by ID**
  - **PUT** `/tasks/:id`

- **Delete Task by ID**
  - **DELETE** `/tasks/:id`

---

## Error Handling

The API provides structured error messages and standard HTTP status codes:

- **400**: Bad request or validation error.
- **401**: Unauthorized (authentication error).
- **403**: Forbidden (access error).
- **404**: Not found.
- **500**: Internal server error.

---

## Project Structure

```plaintext
task-management-api/
src/
├── app.module.ts           # Main application module
├── main.ts                 # Main entry file
├── users/                  # User module (authentication)
│   ├── entities/
│   │   └── user.entity.ts  # User model definition
│   ├── users.controller.ts # User registration and login
│   └── users.service.ts    # User service logic
└── tasks/                  # Task module (task management)
    ├── entities/
    │   └── task.entity.ts  # Task model definition
    ├── tasks.controller.ts # CRUD API for tasks
    └── tasks.service.ts    # Task service logic
```

---

## Running Tests

1. **Unit Tests**:
   ```bash
   npm run test
   ```

2. **End-to-End Tests** (Optional for full feature testing):
   ```bash
   npm run test:e2e
   ```

Testing includes validation of all API endpoints and business logic.

---

## Scalability and Optimization

To ensure efficient handling of large datasets:

- **Pagination**: Implemented on the `/tasks` endpoint to manage large task lists.
- **Filtering**: Allows users to filter tasks by `status`, `priority`, or `tags`.
- **Database Indexing**: Optimize queries by indexing frequently queried fields like `status` and `dueDate`.
- **Caching (Optional)**: Redis or similar caching solutions can be used to cache frequent responses.

---

## Contribution Guidelines

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/new-feature`.
3. **Commit your changes**: `git commit -m 'Add new feature'`.
4. **Push** to the branch: `git push origin feature/new-feature`.
5. **Submit a pull request** for review.

---


This project is open-source and available under the [MIT License](LICENSE).

---

This README is structured to accommodate the entire challenge requirements, including setup, features, API usage, error handling, and bonus features. Let me know if you need further customizations!