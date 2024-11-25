# User Upload and Validation Project

This project is a RESTful API developed in **Node.js** with **Express** and **TypeScript**. It enables user authentication and CSV file uploads to create user records in a **PostgreSQL** database. The application allows only administrators to upload CSV files to create new users, and provides data validation to ensure the consistency and quality of the entered data.

## Tecnologías utilizadas

- **Node.js**: Runtime environment for the backend.
- **Express**: Framework for building APIs and handling routes.
- **TypeScript**: Superset of JavaScript that adds static types.
- **PostgreSQL**: Relational database used to store users.
- **Sequelize**: ORM to interact with PostgreSQL.
- **JWT**: JSON Web Tokens for authentication and authorization.
- **Zod**: Library for validation and handling data schemas.
- **Vitest**: Testing tool to run and verify unit tests.
- **Multer**: Middleware for file upload management.
- **csv-parser**: For reading and processing CSV files.
- **bcrypt**: For secure password hashing.
- **sequelize-cli**: For running database structure migrations.

## Project Setup

1. **Clone the repository**:
```bash
git clone <URL_DEL_REPOSITORIO>
cd repository-name
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root of the project with the following variables:

```plaintext
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nombre_base_datos
JWT_SECRET=tu_secreto_jwt
```

4. Run database structure migration:

```bash
npx sequelize-cli db:migrate
```

5. Run seed to insert the `admin` user into the database:

```bash
npm run seed
```

6. Run the development server:

```bash
npm run dev
```

7. Run tests:

Run tests with Vitest to verify that the system works as expected.

```bash
npm run test
```

## Endpoints

### Authentication

`POST /login`

- **Description**: Allows a user to authenticate and generate a JWT token.

- **Body**: 

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**

`200 OK`

```json
{
  "ok": true,
  "message": "User authenticated successfully.",
  "data": {
    "token": "jwt-token"
  }
}
```

- **400 Bad Request**: Error in input data.

### User Upload

`POST /upload`

- **Description**: Allows an administrator to upload a CSV file to create multiple users in the database.

- **Headers**: 

    - `Authorization`: JWT token of the administrator.

- **Form Data**: 

    - `file`: CSV file with user data (name, email, age).

- **Response**

`200 OK`

```json
{
  "ok": true,
  "message": "Users uploaded successfully.",
  "data": {
    "success": [
      {
        "row": 1,
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
      }
    ],
    "errors": []
  }
}
```

- **400 Bad Request**: Data validation errors in the CSV file.
- **401 Unauthorized**: If the JWT token is invalid or missing.

### Retry User Upload

`POST /upload/retry`

- **Description**: Allows retrying the upload of an individual user, sending the name, email and age data of a user to save them in the database. This endpoint is designed to be used when errors are found during bulk user uploads.

- **Headers**: 

    - `Authorization`: JWT token of the administrator.

- **Body**: 

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": "30"
}
```
- **Response**

`200 OK`

```json
{
  "ok": true,
  "message": "User uploaded successfully.",
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

- **400 Bad Request**: If the data does not meet the validations (for example, a required field is empty or a format is incorrect).

- **401 Unauthorized**: If the JWT token is invalid or missing.

- **500 Internal Server Error**: If an error occurs on the server during processing.

## Project Structure
- **controllers**: Controllers of each endpoint, where the logic of each route is defined.

- **models**: Definitions of data models and Sequelize schemas.

- **services**: Business logic, such as authentication and CSV file processing.

- **schemas**: Data validations with Zod to ensure the structure of the input data.

- **tests**: Unit and integration tests to ensure the system functionality.
