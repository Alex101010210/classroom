# 🔌 API Documentation - Classroom Polling & Analytics

## Información General

**Base URL:** `http://localhost:5000/api/v1`  
**Autenticación:** JWT Bearer Token  
**Formato:** JSON  
**WebSocket URL:** `http://localhost:5001`

---

## 📑 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Clases](#clases)
4. [Polls (Encuestas/Quizzes)](#polls)
5. [Preguntas de Poll](#preguntas-de-poll)
6. [Respuestas de Poll](#respuestas-de-poll)
7. [Analytics](#analytics)
8. [Tareas](#tareas)
9. [Proyectos](#proyectos)
10. [Exámenes](#exámenes)
11. [Calificaciones](#calificaciones)
12. [Avisos](#avisos)
13. [Foros](#foros)
14. [Asistencia](#asistencia)
15. [Notificaciones](#notificaciones)
16. [Exportación](#exportación)
17. [WebSocket Events](#websocket-events)

---

## 🔐 Autenticación

### Registro de Usuario

```http
POST /api/v1/auth/register
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "alumno" // o "maestro"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "alumno"
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```http
POST /api/v1/auth/login
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "alumno"
    },
    "token": "jwt_token_here"
  }
}
```

### Obtener Usuario Actual

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "alumno",
    "avatar_url": "https://...",
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

---

## 👥 Usuarios

### Obtener Perfil de Usuario

```http
GET /api/v1/users/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "alumno",
    "avatar_url": "https://...",
    "activo": true
  }
}
```

### Actualizar Perfil

```http
PUT /api/v1/users/:id
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "avatar_url": "https://..."
}
```

---

## 📚 Clases

### Crear Clase (Solo Maestros)

```http
POST /api/v1/classes
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Matemáticas Avanzadas",
  "descripcion": "Curso de cálculo diferencial e integral",
  "color": "#4CAF50"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "maestro_id": "uuid",
    "nombre": "Matemáticas Avanzadas",
    "descripcion": "Curso de cálculo diferencial e integral",
    "codigo_clase": "ABC123",
    "color": "#4CAF50",
    "activa": true,
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### Listar Clases del Usuario

```http
GET /api/v1/classes
Authorization: Bearer {token}
```

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 10)
- `activa` (opcional): Filtrar por estado (true/false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "uuid",
        "nombre": "Matemáticas Avanzadas",
        "descripcion": "...",
        "codigo_clase": "ABC123",
        "color": "#4CAF50",
        "maestro": {
          "id": "uuid",
          "nombre": "Prof. García"
        },
        "total_alumnos": 25
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

### Obtener Detalle de Clase

```http
GET /api/v1/classes/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Matemáticas Avanzadas",
    "descripcion": "...",
    "codigo_clase": "ABC123",
    "color": "#4CAF50",
    "maestro": {
      "id": "uuid",
      "nombre": "Prof. García",
      "email": "garcia@example.com"
    },
    "alumnos": [
      {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      }
    ],
    "estadisticas": {
      "total_alumnos": 25,
      "total_tareas": 10,
      "total_polls": 5,
      "promedio_asistencia": 92.5
    }
  }
}
```

### Inscribirse a Clase (Alumnos)

```http
POST /api/v1/classes/enroll
Authorization: Bearer {token}
```

**Body:**
```json
{
  "codigo_clase": "ABC123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inscripción exitosa",
  "data": {
    "clase_id": "uuid",
    "alumno_id": "uuid",
    "fecha_inscripcion": "2026-01-15T10:00:00Z"
  }
}
```

---

## 📊 Polls (Encuestas/Quizzes)

### Crear Poll (Solo Maestros)

```http
POST /api/v1/polls
Authorization: Bearer {token}
```

**Body:**
```json
{
  "clase_id": "uuid",
  "titulo": "Quiz de Cálculo - Derivadas",
  "descripcion": "Evaluación rápida sobre derivadas",
  "tipo": "quiz", // "quiz", "encuesta", "pregunta_rapida"
  "duracion_segundos": 600,
  "permite_respuestas_multiples": false,
  "muestra_resultados_tiempo_real": true,
  "preguntas": [
    {
      "orden": 1,
      "texto_pregunta": "¿Cuál es la derivada de x²?",
      "tipo_pregunta": "opcion_multiple",
      "opciones": [
        { "id": "a", "texto": "2x" },
        { "id": "b", "texto": "x" },
        { "id": "c", "texto": "2" },
        { "id": "d", "texto": "x²" }
      ],
      "respuesta_correcta": "a",
      "puntos": 10,
      "tiempo_limite_segundos": 60
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clase_id": "uuid",
    "titulo": "Quiz de Cálculo - Derivadas",
    "tipo": "quiz",
    "estado": "borrador",
    "total_preguntas": 1,
    "puntos_maximos": 10,
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### Listar Polls de una Clase

```http
GET /api/v1/classes/:clase_id/polls
Authorization: Bearer {token}
```

**Query Params:**
- `estado` (opcional): "borrador", "activo", "cerrado", "archivado"
- `tipo` (opcional): "quiz", "encuesta", "pregunta_rapida"

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "titulo": "Quiz de Cálculo - Derivadas",
      "tipo": "quiz",
      "estado": "activo",
      "total_preguntas": 5,
      "duracion_segundos": 600,
      "fecha_inicio": "2026-01-15T10:00:00Z",
      "participantes": 18,
      "completados": 15
    }
  ]
}
```

### Obtener Detalle de Poll

```http
GET /api/v1/polls/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clase_id": "uuid",
    "titulo": "Quiz de Cálculo - Derivadas",
    "descripcion": "...",
    "tipo": "quiz",
    "estado": "activo",
    "duracion_segundos": 600,
    "fecha_inicio": "2026-01-15T10:00:00Z",
    "fecha_cierre": null,
    "preguntas": [
      {
        "id": "uuid",
        "orden": 1,
        "texto_pregunta": "¿Cuál es la derivada de x²?",
        "tipo_pregunta": "opcion_multiple",
        "opciones": [
          { "id": "a", "texto": "2x" },
          { "id": "b", "texto": "x" }
        ],
        "puntos": 10,
        "tiempo_limite_segundos": 60
      }
    ],
    "estadisticas": {
      "total_participantes": 18,
      "total_completados": 15,
      "promedio_puntuacion": 8.5,
      "tiempo_promedio": 450
    }
  }
}
```

### Activar Poll (Solo Maestros)

```http
POST /api/v1/polls/:id/activate
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Poll activado exitosamente",
  "data": {
    "id": "uuid",
    "estado": "activo",
    "fecha_inicio": "2026-01-15T10:00:00Z"
  }
}
```

### Cerrar Poll (Solo Maestros)

```http
POST /api/v1/polls/:id/close
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Poll cerrado exitosamente",
  "data": {
    "id": "uuid",
    "estado": "cerrado",
    "fecha_cierre": "2026-01-15T11:00:00Z",
    "analytics_calculados": true
  }
}
```

---

## ❓ Preguntas de Poll

### Agregar Pregunta a Poll

```http
POST /api/v1/polls/:poll_id/questions
Authorization: Bearer {token}
```

**Body:**
```json
{
  "orden": 2,
  "texto_pregunta": "¿Qué es una integral?",
  "tipo_pregunta": "opcion_multiple",
  "opciones": [
    { "id": "a", "texto": "Suma infinita" },
    { "id": "b", "texto": "Área bajo la curva" },
    { "id": "c", "texto": "Derivada inversa" },
    { "id": "d", "texto": "Todas las anteriores" }
  ],
  "respuesta_correcta": "d",
  "puntos": 15,
  "tiempo_limite_segundos": 90
}
```

### Actualizar Pregunta

```http
PUT /api/v1/questions/:id
Authorization: Bearer {token}
```

### Eliminar Pregunta

```http
DELETE /api/v1/questions/:id
Authorization: Bearer {token}
```

---

## ✅ Respuestas de Poll

### Iniciar Sesión de Poll (Alumnos)

```http
POST /api/v1/polls/:poll_id/sessions
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "poll_id": "uuid",
    "alumno_id": "uuid",
    "fecha_inicio": "2026-01-15T10:00:00Z",
    "estado": "en_progreso",
    "tiempo_restante": 600
  }
}
```

### Responder Pregunta

```http
POST /api/v1/polls/:poll_id/answers
Authorization: Bearer {token}
```

**Body:**
```json
{
  "session_id": "uuid",
  "pregunta_id": "uuid",
  "respuesta": "a", // o ["a", "b"] para múltiples opciones
  "tiempo_respuesta_segundos": 45
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pregunta_id": "uuid",
    "es_correcta": true,
    "puntos_obtenidos": 10,
    "feedback": "¡Correcto! La derivada de x² es 2x"
  }
}
```

### Finalizar Sesión de Poll

```http
POST /api/v1/sessions/:session_id/complete
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "estado": "completado",
    "puntuacion_total": 85,
    "puntos_maximos": 100,
    "porcentaje": 85,
    "tiempo_total": 480,
    "respuestas_correctas": 8,
    "respuestas_incorrectas": 2
  }
}
```

---

## 📈 Analytics

### Obtener Analytics de Poll (Solo Maestros)

```http
GET /api/v1/polls/:poll_id/analytics
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "poll_id": "uuid",
    "titulo": "Quiz de Cálculo - Derivadas",
    "metricas_generales": {
      "total_participantes": 25,
      "total_completados": 22,
      "tasa_completacion": 88,
      "promedio_puntuacion": 82.5,
      "tiempo_promedio_respuesta": 450,
      "mejor_puntuacion": 100,
      "peor_puntuacion": 45
    },
    "distribucion_puntuaciones": {
      "90-100": 8,
      "80-89": 7,
      "70-79": 4,
      "60-69": 2,
      "0-59": 1
    },
    "preguntas_analytics": [
      {
        "pregunta_id": "uuid",
        "texto": "¿Cuál es la derivada de x²?",
        "total_respuestas": 22,
        "respuestas_correctas": 20,
        "tasa_acierto": 90.9,
        "tiempo_promedio": 35,
        "distribucion_respuestas": {
          "a": 20,
          "b": 1,
          "c": 1,
          "d": 0
        }
      }
    ],
    "participacion_por_tiempo": [
      {
        "hora": "10:00",
        "participantes": 5
      },
      {
        "hora": "10:15",
        "participantes": 12
      }
    ]
  }
}
```

### Obtener Analytics de Clase (Solo Maestros)

```http
GET /api/v1/classes/:clase_id/analytics
Authorization: Bearer {token}
```

**Query Params:**
- `fecha_inicio` (opcional): Fecha inicio del rango
- `fecha_fin` (opcional): Fecha fin del rango

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clase_id": "uuid",
    "nombre": "Matemáticas Avanzadas",
    "periodo": {
      "inicio": "2026-01-01",
      "fin": "2026-06-15"
    },
    "metricas_generales": {
      "total_alumnos": 25,
      "promedio_asistencia": 92.5,
      "promedio_calificaciones": 85.3,
      "total_polls": 15,
      "total_tareas": 20,
      "tasa_entrega": 88.5
    },
    "participacion_polls": {
      "total_polls": 15,
      "promedio_participacion": 90.5,
      "polls_completados": 13
    },
    "rendimiento_alumnos": [
      {
        "alumno_id": "uuid",
        "nombre": "Juan Pérez",
        "promedio_general": 88.5,
        "asistencia": 95,
        "participacion_polls": 100,
        "tareas_entregadas": 18
      }
    ],
    "tendencias": {
      "participacion_mensual": [
        { "mes": "Enero", "participacion": 85 },
        { "mes": "Febrero", "participacion": 90 }
      ],
      "calificaciones_mensuales": [
        { "mes": "Enero", "promedio": 82 },
        { "mes": "Febrero", "promedio": 85 }
      ]
    }
  }
}
```

### Obtener Resultados del Alumno

```http
GET /api/v1/students/me/results
Authorization: Bearer {token}
```

**Query Params:**
- `clase_id` (opcional): Filtrar por clase

**Response (200):**
```json
{
  "success": true,
  "data": {
    "alumno_id": "uuid",
    "nombre": "Juan Pérez",
    "resumen_general": {
      "promedio_general": 85.5,
      "total_polls_completados": 12,
      "total_tareas_entregadas": 18,
      "asistencia_promedio": 95
    },
    "resultados_por_clase": [
      {
        "clase_id": "uuid",
        "nombre_clase": "Matemáticas Avanzadas",
        "promedio": 88.5,
        "polls_completados": 5,
        "mejor_poll": {
          "titulo": "Quiz Final",
          "puntuacion": 95
        },
        "areas_mejora": ["Integrales", "Límites"]
      }
    ],
    "historial_polls": [
      {
        "poll_id": "uuid",
        "titulo": "Quiz de Derivadas",
        "fecha": "2026-01-15",
        "puntuacion": 85,
        "tiempo": 450,
        "estado": "completado"
      }
    ]
  }
}
```

---

## 📝 Tareas

### Crear Tarea (Solo Maestros)

```http
POST /api/v1/tasks
Authorization: Bearer {token}
```

**Body:**
```json
{
  "clase_id": "uuid",
  "titulo": "Ejercicios de Derivadas",
  "descripcion": "Resolver los ejercicios del capítulo 3",
  "fecha_limite": "2026-01-20T23:59:59Z",
  "puntos_maximos": 100,
  "permite_entregas_tardias": true,
  "archivos_adjuntos": ["url1", "url2"]
}
```

### Listar Tareas de una Clase

```http
GET /api/v1/classes/:clase_id/tasks
Authorization: Bearer {token}
```

### Entregar Tarea (Alumnos)

```http
POST /api/v1/tasks/:task_id/submit
Authorization: Bearer {token}
```

**Body:**
```json
{
  "contenido": "Respuestas a los ejercicios...",
  "archivos_adjuntos": ["url1", "url2"]
}
```

---

## 🎯 Proyectos

### Crear Proyecto (Solo Maestros)

```http
POST /api/v1/projects
Authorization: Bearer {token}
```

### Listar Proyectos

```http
GET /api/v1/classes/:clase_id/projects
Authorization: Bearer {token}
```

### Entregar Proyecto (Alumnos)

```http
POST /api/v1/projects/:project_id/submit
Authorization: Bearer {token}
```

---

## 📋 Exámenes

### Crear Examen (Solo Maestros)

```http
POST /api/v1/exams
Authorization: Bearer {token}
```

### Listar Exámenes

```http
GET /api/v1/classes/:clase_id/exams
Authorization: Bearer {token}
```

### Entregar Examen (Alumnos)

```http
POST /api/v1/exams/:exam_id/submit
Authorization: Bearer {token}
```

---

## 🎓 Calificaciones

### Calificar Entrega (Solo Maestros)

```http
POST /api/v1/grades
Authorization: Bearer {token}
```

**Body:**
```json
{
  "entrega_id": "uuid",
  "tipo_entrega": "tarea", // "tarea", "proyecto", "examen", "poll"
  "puntos_obtenidos": 85,
  "puntos_maximos": 100,
  "comentarios": "Buen trabajo, pero falta profundizar en..."
}
```

### Obtener Calificaciones de Alumno

```http
GET /api/v1/students/:student_id/grades
Authorization: Bearer {token}
```

**Query Params:**
- `clase_id` (opcional): Filtrar por clase

---

## 📢 Avisos

### Crear Aviso (Solo Maestros)

```http
POST /api/v1/announcements
Authorization: Bearer {token}
```

**Body:**
```json
{
  "clase_id": "uuid",
  "titulo": "Cambio de horario",
  "contenido": "La clase del viernes se moverá a las 10:00 AM",
  "importante": true
}
```

### Listar Avisos de una Clase

```http
GET /api/v1/classes/:clase_id/announcements
Authorization: Bearer {token}
```

---

## 💬 Foros

### Crear Foro (Solo Maestros)

```http
POST /api/v1/forums
Authorization: Bearer {token}
```

### Crear Post en Foro

```http
POST /api/v1/forums/:forum_id/posts
Authorization: Bearer {token}
```

### Responder a Post

```http
POST /api/v1/posts/:post_id/replies
Authorization: Bearer {token}
```

---

## 📅 Asistencia

### Registrar Asistencia (Solo Maestros)

```http
POST /api/v1/attendance
Authorization: Bearer {token}
```

**Body:**
```json
{
  "clase_id": "uuid",
  "fecha": "2026-01-15",
  "registros": [
    {
      "alumno_id": "uuid",
      "estado": "presente" // "presente", "ausente", "tardanza", "justificado"
    }
  ]
}
```

### Obtener Asistencia de Clase

```http
GET /api/v1/classes/:clase_id/attendance
Authorization: Bearer {token}
```

**Query Params:**
- `fecha_inicio` (opcional)
- `fecha_fin` (opcional)

---

## 🔔 Notificaciones

### Obtener Notificaciones del Usuario

```http
GET /api/v1/notifications
Authorization: Bearer {token}
```

**Query Params:**
- `leida` (opcional): true/false
- `tipo` (opcional): "tarea", "poll", "aviso", etc.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tipo": "poll",
      "titulo": "Nuevo poll disponible",
      "mensaje": "El profesor ha activado un nuevo quiz",
      "referencia_id": "uuid",
      "fecha_creacion": "2026-01-15T10:00:00Z",
      "leida": false
    }
  ]
}
```

### Marcar Notificación como Leída

```http
PUT /api/v1/notifications/:id/read
Authorization: Bearer {token}
```

---

## 📤 Exportación

### Exportar Resultados de Poll a CSV

```http
GET /api/v1/polls/:poll_id/export/csv
Authorization: Bearer {token}
```

**Response:** Archivo CSV descargable

**Contenido del CSV:**
```csv
Alumno,Email,Puntuación,Porcentaje,Tiempo (seg),Estado,Fecha
Juan Pérez,juan@example.com,85,85%,450,Completado,2026-01-15 10:30:00
María García,maria@example.com,92,92%,380,Completado,2026-01-15 10:25:00
```

### Exportar Analytics de Clase a CSV

```http
GET /api/v1/classes/:clase_id/export/csv
Authorization: Bearer {token}
```

**Query Params:**
- `tipo`: "asistencia", "calificaciones", "participacion"
- `fecha_inicio` (opcional)
- `fecha_fin` (opcional)

---

## 🔌 WebSocket Events

### Conexión

```javascript
const socket = io('http://localhost:5001', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Eventos del Cliente (Emit)

#### Unirse a Sala de Clase

```javascript
socket.emit('join:class', {
  clase_id: 'uuid'
});
```

#### Unirse a Poll Activo

```javascript
socket.emit('join:poll', {
  poll_id: 'uuid'
});
```

#### Enviar Respuesta en Tiempo Real

```javascript
socket.emit('poll:answer', {
  poll_id: 'uuid',
  pregunta_id: 'uuid',
  respuesta: 'a',
  tiempo_respuesta: 45
});
```

### Eventos del Servidor (On)

#### Poll Activado

```javascript
socket.on('poll:activated', (data) => {
  console.log('Nuevo poll activo:', data);
  // data: { poll_id, titulo, duracion_segundos }
});
```

#### Actualización de Resultados en Tiempo Real

```javascript
socket.on('poll:results:update', (data) => {
  console.log('Resultados actualizados:', data);
  // data: { poll_id, total_respuestas, distribucion, ... }
});
```

#### Nueva Respuesta Recibida (Solo Maestros)

```javascript
socket.on('poll:new_answer', (data) => {
  console.log('Nueva respuesta:', data);
  // data: { alumno_id, pregunta_id, es_correcta, timestamp }
});
```

#### Poll Cerrado

```javascript
socket.on('poll:closed', (data) => {
  console.log('Poll cerrado:', data);
  // data: { poll_id, resultados_finales }
});
```

#### Nueva Notificación

```javascript
socket.on('notification:new', (data) => {
  console.log('Nueva notificación:', data);
  // data: { id, tipo, titulo, mensaje }
});
```

#### Alumno Conectado/Desconectado (Solo Maestros)

```javascript
socket.on('student:connected', (data) => {
  console.log('Alumno conectado:', data);
  // data: { alumno_id, nombre }
});

socket.on('student:disconnected', (data) => {
  console.log('Alumno desconectado:', data);
  // data: { alumno_id, nombre }
});
```

---

## 🚨 Códigos de Error

### Códigos HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

### Formato de Error

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contraseña incorrectos",
    "details": {}
  }
}
```

### Códigos de Error Comunes

- `INVALID_CREDENTIALS` - Credenciales inválidas
- `TOKEN_EXPIRED` - Token JWT expirado
- `UNAUTHORIZED` - No autorizado
- `FORBIDDEN` - Acceso denegado
- `NOT_FOUND` - Recurso no encontrado
- `VALIDATION_ERROR` - Error de validación
- `POLL_NOT_ACTIVE` - Poll no está activo
- `POLL_ALREADY_COMPLETED` - Poll ya completado
- `CLASS_NOT_FOUND` - Clase no encontrada
- `ALREADY_ENROLLED` - Ya inscrito en la clase
- `INVALID_CLASS_CODE` - Código de clase inválido

---

## 📊 Rate Limiting

- **Límite general:** 100 requests por 15 minutos
- **Login:** 5 intentos por 15 minutos
- **Exportación CSV:** 10 requests por hora

**Headers de respuesta:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642345678
```

---

## 🔒 Seguridad

### Headers Requeridos

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### CORS

Orígenes permitidos:
- `http://localhost:5173` (desarrollo)
- `https://tu-dominio.com` (producción)

---

## 📝 Notas Importantes

1. **Autenticación:** Todos los endpoints (excepto `/auth/login` y `/auth/register`) requieren token JWT
2. **Roles:** Algunos endpoints están restringidos por rol (maestro/alumno)
3. **WebSocket:** Requiere autenticación JWT en el handshake
4. **Paginación:** Endpoints de listado soportan paginación
5. **Timestamps:** Todas las fechas están en formato ISO 8601 UTC
6. **IDs:** Todos los IDs son UUIDs v4

---

**Última actualización:** 2026-06-16  
**Versión API:** v1  
**Documentación generada por:** Bob AI Assistant