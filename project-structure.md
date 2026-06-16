# 📁 Estructura de Carpetas y Archivos - Classroom Polling & Analytics

## Visión General del Proyecto

Este documento detalla la estructura completa de carpetas y archivos para el proyecto **Classroom Polling & Analytics Dashboard**, un sistema full-stack con React, Node.js, PostgreSQL y WebSocket para polling en tiempo real.

---

## 🏗️ Estructura General del Proyecto

```
classroom-polling-analytics/
├── backend/                      # Servidor Node.js + Express + Socket.io
├── frontend/                     # Aplicación React + TypeScript + Vite
├── database/                     # Scripts SQL y migraciones
├── docs/                         # Documentación del proyecto
├── .gitignore                    # Archivos ignorados por Git
├── README.md                     # Documentación principal
├── docker-compose.yml            # Configuración Docker (opcional)
└── package.json                  # Scripts del proyecto raíz
```

---

## 🔧 Backend - Node.js + Express + Socket.io

### Estructura Completa del Backend

```
backend/
├── src/
│   ├── config/                   # Configuraciones
│   │   ├── db.js                 # Configuración PostgreSQL
│   │   ├── socket.js             # Configuración Socket.io
│   │   ├── cors.js               # Configuración CORS
│   │   └── env.js                # Variables de entorno
│   │
│   ├── models/                   # Modelos de datos (ORM/Query builders)
│   │   ├── User.js               # Modelo de usuarios
│   │   ├── Class.js              # Modelo de clases
│   │   ├── Poll.js               # Modelo de polls
│   │   ├── Question.js           # Modelo de preguntas
│   │   ├── Answer.js             # Modelo de respuestas
│   │   ├── Session.js            # Modelo de sesiones
│   │   ├── Analytics.js          # Modelo de analytics
│   │   ├── Task.js               # Modelo de tareas
│   │   ├── Project.js            # Modelo de proyectos
│   │   ├── Exam.js               # Modelo de exámenes
│   │   ├── Grade.js              # Modelo de calificaciones
│   │   ├── Announcement.js       # Modelo de avisos
│   │   ├── Forum.js              # Modelo de foros
│   │   ├── Attendance.js         # Modelo de asistencia
│   │   ├── Notification.js       # Modelo de notificaciones
│   │   └── index.js              # Exportación de modelos
│   │
│   ├── controllers/              # Lógica de negocio
│   │   ├── authController.js     # Autenticación y registro
│   │   ├── userController.js     # Gestión de usuarios
│   │   ├── classController.js    # Gestión de clases
│   │   ├── pollController.js     # Gestión de polls
│   │   ├── questionController.js # Gestión de preguntas
│   │   ├── answerController.js   # Gestión de respuestas
│   │   ├── analyticsController.js # Analytics y reportes
│   │   ├── taskController.js     # Gestión de tareas
│   │   ├── projectController.js  # Gestión de proyectos
│   │   ├── examController.js     # Gestión de exámenes
│   │   ├── gradeController.js    # Gestión de calificaciones
│   │   ├── announcementController.js # Gestión de avisos
│   │   ├── forumController.js    # Gestión de foros
│   │   ├── attendanceController.js # Gestión de asistencia
│   │   ├── notificationController.js # Gestión de notificaciones
│   │   └── exportController.js   # Exportación CSV
│   │
│   ├── routes/                   # Definición de rutas API
│   │   ├── auth.routes.js        # Rutas de autenticación
│   │   ├── user.routes.js        # Rutas de usuarios
│   │   ├── class.routes.js       # Rutas de clases
│   │   ├── poll.routes.js        # Rutas de polls
│   │   ├── question.routes.js    # Rutas de preguntas
│   │   ├── answer.routes.js      # Rutas de respuestas
│   │   ├── analytics.routes.js   # Rutas de analytics
│   │   ├── task.routes.js        # Rutas de tareas
│   │   ├── project.routes.js     # Rutas de proyectos
│   │   ├── exam.routes.js        # Rutas de exámenes
│   │   ├── grade.routes.js       # Rutas de calificaciones
│   │   ├── announcement.routes.js # Rutas de avisos
│   │   ├── forum.routes.js       # Rutas de foros
│   │   ├── attendance.routes.js  # Rutas de asistencia
│   │   ├── notification.routes.js # Rutas de notificaciones
│   │   ├── export.routes.js      # Rutas de exportación
│   │   └── index.js              # Agregador de rutas
│   │
│   ├── middleware/               # Middlewares
│   │   ├── auth.middleware.js    # Verificación JWT
│   │   ├── role.middleware.js    # Verificación de roles
│   │   ├── validation.middleware.js # Validación de datos
│   │   ├── error.middleware.js   # Manejo de errores
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   └── logger.middleware.js  # Logging de requests
│   │
│   ├── services/                 # Servicios de negocio
│   │   ├── authService.js        # Lógica de autenticación
│   │   ├── pollService.js        # Lógica de polls
│   │   ├── analyticsService.js   # Cálculo de analytics
│   │   ├── notificationService.js # Envío de notificaciones
│   │   ├── emailService.js       # Envío de emails
│   │   ├── csvService.js         # Generación de CSV
│   │   └── gradeService.js       # Cálculo de calificaciones
│   │
│   ├── socket/                   # Manejo de WebSocket
│   │   ├── pollSocket.js         # Eventos de polls en tiempo real
│   │   ├── notificationSocket.js # Notificaciones en tiempo real
│   │   ├── sessionSocket.js      # Gestión de sesiones
│   │   └── index.js              # Configuración Socket.io
│   │
│   ├── utils/                    # Utilidades
│   │   ├── jwt.js                # Generación y verificación JWT
│   │   ├── bcrypt.js             # Hash de contraseñas
│   │   ├── validators.js         # Validadores personalizados
│   │   ├── formatters.js         # Formateadores de datos
│   │   ├── dateUtils.js          # Utilidades de fechas
│   │   └── errorHandler.js       # Manejo de errores
│   │
│   ├── database/                 # Queries y migraciones
│   │   ├── queries/              # Queries SQL complejas
│   │   │   ├── pollQueries.js
│   │   │   ├── analyticsQueries.js
│   │   │   └── reportQueries.js
│   │   └── seeds/                # Datos de prueba
│   │       ├── users.seed.js
│   │       ├── classes.seed.js
│   │       └── polls.seed.js
│   │
│   ├── tests/                    # Tests
│   │   ├── unit/                 # Tests unitarios
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/          # Tests de integración
│   │   │   ├── api/
│   │   │   └── socket/
│   │   └── setup.js              # Configuración de tests
│   │
│   ├── app.js                    # Configuración Express
│   └── server.js                 # Punto de entrada
│
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Lock de dependencias
├── nodemon.json                  # Configuración nodemon
├── jest.config.js                # Configuración Jest
└── README.md                     # Documentación del backend
```

### Archivos Clave del Backend

#### `backend/src/server.js`
```javascript
// Punto de entrada del servidor
// - Inicializa Express
// - Configura Socket.io
// - Conecta a PostgreSQL
// - Inicia el servidor HTTP
```

#### `backend/src/app.js`
```javascript
// Configuración de Express
// - Middlewares globales
// - Rutas
// - Manejo de errores
```

#### `backend/src/config/db.js`
```javascript
// Configuración de PostgreSQL
// - Pool de conexiones
// - Queries helpers
```

#### `backend/src/socket/index.js`
```javascript
// Configuración Socket.io
// - Autenticación de sockets
// - Rooms por clase/poll
// - Eventos en tiempo real
```

#### `backend/.env.example`
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=classroom_polling
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Socket.io
SOCKET_PORT=5001

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
```

---

## ⚛️ Frontend - React + TypeScript + Vite

### Estructura Completa del Frontend

```
frontend/
├── public/                       # Archivos estáticos
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
│
├── src/
│   ├── assets/                   # Recursos estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── global.css
│   │       ├── variables.css
│   │       └── animations.css
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── common/               # Componentes comunes
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Loader/
│   │   │   ├── Alert/
│   │   │   ├── Dropdown/
│   │   │   └── Avatar/
│   │   │
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Header.module.css
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── Navigation/
│   │   │
│   │   ├── auth/                 # Componentes de autenticación
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ProtectedRoute/
│   │   │
│   │   ├── polls/                # Componentes de polls
│   │   │   ├── PollCard/
│   │   │   ├── PollList/
│   │   │   ├── PollCreator/
│   │   │   ├── PollViewer/
│   │   │   ├── QuestionCard/
│   │   │   ├── AnswerOption/
│   │   │   ├── PollResults/
│   │   │   └── LivePollIndicator/
│   │   │
│   │   ├── analytics/            # Componentes de analytics
│   │   │   ├── DashboardCard/
│   │   │   ├── ChartWrapper/
│   │   │   ├── BarChart/
│   │   │   ├── PieChart/
│   │   │   ├── LineChart/
│   │   │   ├── MetricCard/
│   │   │   └── ExportButton/
│   │   │
│   │   ├── classes/              # Componentes de clases
│   │   │   ├── ClassCard/
│   │   │   ├── ClassList/
│   │   │   ├── ClassCreator/
│   │   │   └── StudentList/
│   │   │
│   │   ├── tasks/                # Componentes de tareas
│   │   │   ├── TaskCard/
│   │   │   ├── TaskList/
│   │   │   ├── TaskCreator/
│   │   │   └── TaskSubmission/
│   │   │
│   │   ├── projects/             # Componentes de proyectos
│   │   │   ├── ProjectCard/
│   │   │   ├── ProjectList/
│   │   │   └── ProjectSubmission/
│   │   │
│   │   ├── exams/                # Componentes de exámenes
│   │   │   ├── ExamCard/
│   │   │   ├── ExamList/
│   │   │   └── ExamViewer/
│   │   │
│   │   ├── grades/               # Componentes de calificaciones
│   │   │   ├── GradeTable/
│   │   │   ├── GradeCard/
│   │   │   └── GradeInput/
│   │   │
│   │   ├── announcements/        # Componentes de avisos
│   │   │   ├── AnnouncementCard/
│   │   │   └── AnnouncementList/
│   │   │
│   │   ├── forums/               # Componentes de foros
│   │   │   ├── ForumCard/
│   │   │   ├── PostCard/
│   │   │   └── ReplyCard/
│   │   │
│   │   └── notifications/        # Componentes de notificaciones
│   │       ├── NotificationBell/
│   │       ├── NotificationList/
│   │       └── NotificationCard/
│   │
│   ├── pages/                    # Páginas/Vistas
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   │
│   │   ├── teacher/              # Páginas del maestro
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Classes.tsx
│   │   │   ├── ClassDetail.tsx
│   │   │   ├── CreatePoll.tsx
│   │   │   ├── PollResults.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Grades.tsx
│   │   │   └── Students.tsx
│   │   │
│   │   ├── student/              # Páginas del alumno
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MyClasses.tsx
│   │   │   ├── ClassView.tsx
│   │   │   ├── TakePoll.tsx
│   │   │   ├── MyGrades.tsx
│   │   │   ├── Assignments.tsx
│   │   │   └── Forums.tsx
│   │   │
│   │   ├── shared/               # Páginas compartidas
│   │   │   ├── Profile.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   └── Home.tsx              # Página principal
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts            # Hook de autenticación
│   │   ├── useSocket.ts          # Hook de Socket.io
│   │   ├── usePoll.ts            # Hook de polls
│   │   ├── useAnalytics.ts       # Hook de analytics
│   │   ├── useNotifications.ts   # Hook de notificaciones
│   │   ├── useDebounce.ts        # Hook de debounce
│   │   └── useLocalStorage.ts    # Hook de localStorage
│   │
│   ├── context/                  # Context API
│   │   ├── AuthContext.tsx       # Contexto de autenticación
│   │   ├── SocketContext.tsx     # Contexto de Socket.io
│   │   ├── ThemeContext.tsx      # Contexto de tema
│   │   └── NotificationContext.tsx # Contexto de notificaciones
│   │
│   ├── services/                 # Servicios API
│   │   ├── api.ts                # Configuración Axios
│   │   ├── authService.ts        # Servicios de auth
│   │   ├── pollService.ts        # Servicios de polls
│   │   ├── classService.ts       # Servicios de clases
│   │   ├── analyticsService.ts   # Servicios de analytics
│   │   ├── taskService.ts        # Servicios de tareas
│   │   ├── projectService.ts     # Servicios de proyectos
│   │   ├── examService.ts        # Servicios de exámenes
│   │   ├── gradeService.ts       # Servicios de calificaciones
│   │   ├── announcementService.ts # Servicios de avisos
│   │   ├── forumService.ts       # Servicios de foros
│   │   ├── attendanceService.ts  # Servicios de asistencia
│   │   ├── notificationService.ts # Servicios de notificaciones
│   │   └── exportService.ts      # Servicios de exportación
│   │
│   ├── utils/                    # Utilidades
│   │   ├── formatters.ts         # Formateadores
│   │   ├── validators.ts         # Validadores
│   │   ├── constants.ts          # Constantes
│   │   ├── helpers.ts            # Funciones helper
│   │   └── chartConfig.ts        # Configuración Chart.js
│   │
│   ├── types/                    # TypeScript types
│   │   ├── user.types.ts
│   │   ├── class.types.ts
│   │   ├── poll.types.ts
│   │   ├── question.types.ts
│   │   ├── answer.types.ts
│   │   ├── analytics.types.ts
│   │   ├── task.types.ts
│   │   ├── project.types.ts
│   │   ├── exam.types.ts
│   │   ├── grade.types.ts
│   │   ├── announcement.types.ts
│   │   ├── forum.types.ts
│   │   ├── notification.types.ts
│   │   └── index.ts
│   │
│   ├── routes/                   # Configuración de rutas
│   │   ├── AppRoutes.tsx         # Rutas principales
│   │   ├── TeacherRoutes.tsx     # Rutas del maestro
│   │   └── StudentRoutes.tsx     # Rutas del alumno
│   │
│   ├── store/                    # Estado global (opcional - Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── pollSlice.ts
│   │   │   └── notificationSlice.ts
│   │   └── store.ts
│   │
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Punto de entrada
│   └── vite-env.d.ts             # Types de Vite
│
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados
├── index.html                    # HTML principal
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Lock de dependencias
├── tsconfig.json                 # Configuración TypeScript
├── tsconfig.node.json            # TypeScript para Node
├── vite.config.ts                # Configuración Vite
├── tailwind.config.js            # Configuración Tailwind (opcional)
├── postcss.config.js             # Configuración PostCSS (opcional)
└── README.md                     # Documentación del frontend
```

### Archivos Clave del Frontend

#### `frontend/src/main.tsx`
```typescript
// Punto de entrada
// - Renderiza App
// - Configura providers
```

#### `frontend/src/App.tsx`
```typescript
// Componente principal
// - Router
// - Context providers
// - Layout global
```

#### `frontend/src/services/api.ts`
```typescript
// Configuración Axios
// - Base URL
// - Interceptors
// - Headers
```

#### `frontend/src/hooks/useSocket.ts`
```typescript
// Hook personalizado para Socket.io
// - Conexión
// - Eventos
// - Desconexión
```

#### `frontend/.env.example`
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5001
VITE_APP_NAME=Classroom Polling
```

---

## 🗄️ Database - Scripts SQL

### Estructura de la Carpeta Database

```
database/
├── migrations/                   # Migraciones de base de datos
│   ├── 001_create_users_table.sql
│   ├── 002_create_classes_table.sql
│   ├── 003_create_inscriptions_table.sql
│   ├── 004_create_tasks_table.sql
│   ├── 005_create_projects_table.sql
│   ├── 006_create_exams_table.sql
│   ├── 007_create_polls_table.sql
│   ├── 008_create_questions_poll_table.sql
│   ├── 009_create_answers_poll_table.sql
│   ├── 010_create_sessions_poll_table.sql
│   ├── 011_create_submissions_tables.sql
│   ├── 012_create_grades_table.sql
│   ├── 013_create_announcements_table.sql
│   ├── 014_create_forums_table.sql
│   ├── 015_create_forum_posts_table.sql
│   ├── 016_create_forum_replies_table.sql
│   ├── 017_create_attendance_table.sql
│   ├── 018_create_notifications_table.sql
│   ├── 019_create_analytics_poll_table.sql
│   ├── 020_create_indexes.sql
│   └── 021_create_triggers.sql
│
├── seeds/                        # Datos de prueba
│   ├── 001_seed_users.sql
│   ├── 002_seed_classes.sql
│   ├── 003_seed_inscriptions.sql
│   ├── 004_seed_polls.sql
│   └── 005_seed_questions.sql
│
├── functions/                    # Funciones y procedimientos
│   ├── calculate_poll_analytics.sql
│   ├── auto_grade_quiz.sql
│   └── generate_class_report.sql
│
├── views/                        # Vistas SQL
│   ├── student_grades_view.sql
│   ├── class_analytics_view.sql
│   └── poll_results_view.sql
│
├── schema.sql                    # Schema completo
├── init.sql                      # Script de inicialización
└── README.md                     # Documentación de la BD
```

---

## 📚 Docs - Documentación

### Estructura de Documentación

```
docs/
├── api/                          # Documentación API
│   ├── authentication.md
│   ├── polls.md
│   ├── analytics.md
│   ├── classes.md
│   ├── tasks.md
│   ├── exams.md
│   └── websocket.md
│
├── database/                     # Documentación BD
│   ├── schema.md
│   ├── relationships.md
│   └── queries.md
│
├── frontend/                     # Documentación Frontend
│   ├── components.md
│   ├── routing.md
│   └── state-management.md
│
├── deployment/                   # Guías de deployment
│   ├── docker.md
│   ├── heroku.md
│   └── aws.md
│
├── architecture.md               # Arquitectura del sistema
├── setup.md                      # Guía de instalación
└── contributing.md               # Guía de contribución
```

---

## 🐳 Docker (Opcional)

### Archivos Docker

```
classroom-polling-analytics/
├── docker-compose.yml            # Orquestación de servicios
├── Dockerfile.backend            # Dockerfile del backend
├── Dockerfile.frontend           # Dockerfile del frontend
└── .dockerignore                 # Archivos ignorados por Docker
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: classroom_polling
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
      - "5001:5001"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5000/api/v1
      - VITE_SOCKET_URL=http://localhost:5001
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## 📦 Dependencias Principales

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express-validator": "^7.0.1",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.7.0",
    "csv-writer": "^1.6.0",
    "nodemailer": "^6.9.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.40.0"
  }
}
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.0",
    "axios": "^1.4.0",
    "socket.io-client": "^4.6.1",
    "chart.js": "^4.3.0",
    "react-chartjs-2": "^5.2.0",
    "zustand": "^4.3.8",
    "@tanstack/react-query": "^4.29.5",
    "react-hook-form": "^7.43.9",
    "zod": "^3.21.4",
    "date-fns": "^2.30.0",
    "clsx": "^1.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.6",
    "@types/react-dom": "^18.2.4",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.4",
    "vite": "^4.3.5",
    "eslint": "^8.40.0",
    "prettier": "^2.8.8",
    "tailwindcss": "^3.3.2"
  }
}
```

---

## 🚀 Scripts NPM

### Backend Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --watchAll",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "migrate": "node database/migrate.js",
    "seed": "node database/seed.js"
  }
}
```

### Frontend Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest"
  }
}
```

### Root Scripts (Monorepo)

```json
{
  "scripts": {
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "test": "cd backend && npm test && cd ../frontend && npm test"
  }
}
```

---

## 📋 Checklist de Archivos Esenciales

### Backend Esenciales
- [x] `server.js` - Punto de entrada
- [x] `app.js` - Configuración Express
- [x] `config/db.js` - Conexión PostgreSQL
- [x] `socket/index.js` - Configuración Socket.io
- [x] `routes/index.js` - Rutas API
- [x] `middleware/auth.middleware.js` - Autenticación
- [x] `.env.example` - Variables de entorno

### Frontend Esenciales
- [x] `main.tsx` - Punto de entrada
- [x] `App.tsx` - Componente principal
- [x] `services/api.ts` - Configuración API
- [x] `hooks/useSocket.ts` - Hook Socket.io
- [x] `context/AuthContext.tsx` - Contexto auth
- [x] `routes/AppRoutes.tsx` - Rutas
- [x] `.env.example` - Variables de entorno

### Database Esenciales
- [x] `schema.sql` - Schema completo
- [x] `init.sql` - Inicialización
- [x] `migrations/` - Migraciones
- [x] `seeds/` - Datos de prueba

---

## 🎯 Resumen de Organización

### Por Funcionalidad

**Autenticación:**
- Backend: `controllers/authController.js`, `routes/auth.routes.js`
- Frontend: `pages/auth/`, `context/AuthContext.tsx`

**Polls en Tiempo Real:**
- Backend: `controllers/pollController.js`, `socket/pollSocket.js`
- Frontend: `components/polls/`, `hooks/usePoll.ts`

**Analytics Dashboard:**
- Backend: `controllers/analyticsController.js`, `services/analyticsService.js`
- Frontend: `pages/teacher/Analytics.tsx`, `components/analytics/`

**Exportación CSV:**
- Backend: `controllers/exportController.js`, `services/csvService.js`
- Frontend: `components/analytics/ExportButton/`

---

## 📝 Notas Importantes

1. **Separación de Responsabilidades:** Backend y Frontend completamente separados
2. **TypeScript:** Frontend usa TypeScript para type safety
3. **Modularidad:** Componentes y servicios reutilizables
4. **Testing:** Estructura preparada para tests unitarios e integración
5. **Escalabilidad:** Arquitectura preparada para crecer
6. **Documentación:** Cada módulo debe tener su README
7. **Git:** Usar `.gitignore` apropiado para cada parte
8. **Seguridad:** Variables sensibles en `.env` (no commitear)

---

**Última actualización:** 2026-06-16
**Versión:** 1.0