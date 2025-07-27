# To-Do API

A comprehensive Task Management API built with NestJS, TypeORM, PostgreSQL, and JWT authentication.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📝 **Task Management** - Complete CRUD operations for tasks
- 👥 **User Roles** - Admin and regular user permissions
- 📊 **Task Priorities** - High, Medium, Low, and None priority levels
- 📅 **Task Status Tracking** - Not Started, In Progress, Completed
- 📖 **API Documentation** - Interactive Swagger documentation
- ✅ **Unit Testing** - Comprehensive Jest test coverage
- 🗄️ **Database** - PostgreSQL with TypeORM

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest
- **Validation:** class-validator
- **Password Hashing:** bcrypt

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd todo-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todo_api
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Start the application:

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the interactive API documentation at:

**Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user

### Tasks (Protected Routes)

- `GET /tasks` - Get all tasks (users see their own, admins see all)
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Data Models

### User

```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  isActive: boolean
  isAdmin: boolean
  tasks: Task[]
}
```

### Task

```typescript
{
  id: string (UUID)
  title: string
  description?: string
  status: TaskStatus (NOT_STARTED | IN_PROGRESS | COMPLETED)
  priority: TaskPriority (NONE | LOW | MEDIUM | HIGH)
  createdAt: Date
  updatedAt: Date
  user: User
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── config/
│   ├── jwt.config.ts
│   └── typeorm.config.ts
├── modules/
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   └── strategies/
│   └── tasks/
│       ├── dto/
│       ├── entities/
│       ├── enum/
│       └── ...
├── app.module.ts
└── main.ts
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with class-validator
- Role-based access control
- Protected routes with guards

## Database Schema

The application uses PostgreSQL with the following tables:

- **users** - User accounts and authentication
- **tasks** - Task management with user relationships

## Development

### Code Style

- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Submit a pull request

## Support

For support, please create an issue in the repository or contact the development team.
