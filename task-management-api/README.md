## API Documentation

Comprehensive API documentation is available via Swagger:

- **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This documentation covers all endpoints, required parameters, and expected responses.

---

## Endpoints

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