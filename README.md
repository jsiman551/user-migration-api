# Proyecto de Carga y Validación de Usuarios

Este proyecto es una API RESTful desarrollada en **Node.js** con **Express** y **TypeScript**. Permite la autenticación de usuarios y la carga de archivos CSV para crear registros de usuarios en una base de datos **PostgreSQL**. La aplicación permite que solo los administradores puedan cargar archivos CSV para crear nuevos usuarios, y proporciona validación de datos para garantizar la consistencia y calidad de los datos ingresados.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para el backend.
- **Express**: Framework para construir APIs y manejar rutas.
- **TypeScript**: Superset de JavaScript que añade tipos estáticos.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar usuarios.
- **Sequelize**: ORM para interactuar con PostgreSQL.
- **JWT**: JSON Web Tokens para la autenticación y autorización.
- **Zod**: Biblioteca para la validación y el manejo de esquemas de datos.
- **Vitest**: Herramienta de pruebas para ejecutar y verificar los tests de unidad.
- **Multer**: Middleware para la gestión de cargas de archivos.
- **csv-parser**: Para leer y procesar archivos CSV.
- **bcrypt**: Para el hashing seguro de contraseñas.
- **sequelize-cli**: Para ejecutar migraciones de la estructura de base de datos.

## Configuración del Proyecto

1. **Clonar el repositorio**:
```bash
git clone <URL_DEL_REPOSITORIO>
cd nombre-del-repositorio
```

2. Instalar dependencias:

```bash
npm install
```

3. Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```plaintext
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nombre_base_datos
JWT_SECRET=tu_secreto_jwt
```

4. Correr migracion de estructura de base de datos:

```bash
npx sequelize-cli db:migrate
```

5. Correr seed para introducir al usuario `admin` a base de datos:

```bash
npm run seed
```

6. Correr el servidor de desarrollo:

```bash
npm run dev
```

7. Ejecutar pruebas:

Ejecuta las pruebas con Vitest para verificar que el sistema funcione como se espera.

```bash
npm run test
```

## Endpoints

### Autenticación

`POST /login`

- **Descripción**: Permite autenticar a un usuario y generar un token JWT.

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

- **400 Bad Request**: Error en los datos de entrada.

### Carga de Usuarios

`POST /upload`

- **Descripción**: Permite a un administrador cargar un archivo CSV para crear múltiples usuarios en la base de datos.

- **Headers**: 

    - `Authorization`: Token JWT del administrador.

- **Form Data**: 

    - `file`: Archivo CSV con datos de los usuarios (name, email, age).

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

- **400 Bad Request**: Errores de validación de datos en el archivo CSV.
- **401 Unauthorized**: Si el token JWT es inválido o falta.

### Reintento de Carga de Usuario

`POST /upload/retry`

- **Descripción**: Descripción: Permite reintentar la carga de un usuario individual, enviando los datos name, email y age de un usuario para guardarlos en la base de datos. Este endpoint está diseñado para ser utilizado cuando se encuentran errores durante la carga masiva de usuarios.

- **Headers**: 

    - `Authorization`: Token JWT del administrador.

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

- **400 Bad Request**: Si los datos no cumplen con las validaciones (por ejemplo, un campo obligatorio está vacío o un formato es incorrecto).

- **401 Unauthorized**: Si el token JWT es inválido o falta.

- **500 Internal Server Error**: Si ocurre un error en el servidor durante el procesamiento.

## Estructura del Proyecto
- **controllers**: Controladores de cada endpoint, donde se define la lógica de cada ruta.

- **models**: Definiciones de modelos de datos y esquemas Sequelize.

- **services**: Lógica de negocio, como autenticación y procesamiento de archivos CSV.

- **schemas**: Validaciones de datos con Zod para asegurar la estructura de los datos de entrada.

- **tests**: Pruebas de unidad y de integración para asegurar la funcionalidad del sistema.
