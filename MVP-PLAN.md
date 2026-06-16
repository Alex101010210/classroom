# 🎯 Plan MVP - Classroom Polling & Analytics (3 Semanas)

## 📋 Resumen Ejecutivo

**Objetivo:** Crear un MVP funcional de sistema de polling en tiempo real con analytics básico para presentación en 3 semanas.

**Alcance:** Sistema simplificado enfocado en funcionalidad core - polling en tiempo real y visualización de resultados.

**Stack Tecnológico:**
- **Backend:** Node.js + Express + Socket.io
- **Frontend:** React + TypeScript + Vite
- **Base de Datos:** PostgreSQL
- **Visualización:** Chart.js
- **Tiempo Real:** Socket.io

---

## 🗄️ Base de Datos MVP (Usar tablas del database-design-plan.md)

**IMPORTANTE:** Usar las tablas completas definidas en [`database-design-plan.md`](database-design-plan.md:1) para el MVP.

### Tablas Core para MVP (8 tablas mínimas):
1. **usuarios** - Sistema de autenticación
2. **clases** - Gestión de clases
3. **inscripciones** - Relación alumnos-clases
4. **polls** - Encuestas/quizzes
5. **preguntas_poll** - Preguntas de cada poll
6. **respuestas_poll** - Respuestas de alumnos
7. **sesiones_poll** - Tracking de participación
8. **analytics_poll** - Métricas y estadísticas

### Tablas Opcionales (agregar si hay tiempo):
- notificaciones
- calificaciones

**Ver esquema completo en:** [`database-design-plan.md`](database-design-plan.md:18)

---

## 🔧 Backend Simplificado (22 Archivos)

### Estructura de Carpetas

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                    # Conexión PostgreSQL
│   │   ├── socket.js                # Configuración Socket.io
│   │   └── env.js                   # Variables de entorno
│   │
│   ├── models/
│   │   ├── User.js                  # Modelo usuarios
│   │   ├── Class.js                 # Modelo clases
│   │   ├── Poll.js                  # Modelo polls
│   │   └── index.js                 # Exportador
│   │
│   ├── controllers/
│   │   ├── authController.js        # Login/Register
│   │   ├── classController.js       # CRUD clases
│   │   ├── pollController.js        # CRUD polls
│   │   └── analyticsController.js   # Resultados y stats
│   │
│   ├── routes/
│   │   ├── auth.routes.js           # Rutas auth
│   │   ├── class.routes.js          # Rutas clases
│   │   ├── poll.routes.js           # Rutas polls
│   │   ├── analytics.routes.js      # Rutas analytics
│   │   └── index.js                 # Agregador rutas
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js       # Verificación JWT
│   │   └── error.middleware.js      # Manejo errores
│   │
│   ├── socket/
│   │   └── pollSocket.js            # Eventos tiempo real
│   │
│   ├── utils/
│   │   ├── jwt.js                   # JWT helpers
│   │   └── csvExport.js             # Exportar CSV
│   │
│   ├── app.js                       # Configuración Express
│   └── server.js                    # Punto de entrada
│
├── .env.example
├── package.json
└── README.md
```

### Archivos Clave

#### `server.js` (Punto de entrada)
```javascript
const app = require('./app');
const { initSocket } = require('./socket/pollSocket');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Conectar a base de datos
connectDB();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Inicializar Socket.io
initSocket(server);
```

#### `app.js` (Configuración Express)
```javascript
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1', routes);

// Error handling
app.use(errorMiddleware);

module.exports = app;
```

---

## ⚛️ Frontend Simplificado (25 Archivos)

### Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── polls/
│   │   │   ├── PollCard.tsx
│   │   │   ├── PollCreator.tsx
│   │   │   ├── PollViewer.tsx
│   │   │   └── QuestionCard.tsx
│   │   │
│   │   └── analytics/
│   │       ├── ResultsChart.tsx
│   │       └── StatsCard.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── teacher/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreatePoll.tsx
│   │   │   └── Results.tsx
│   │   └── student/
│   │       ├── Dashboard.tsx
│   │       └── TakePoll.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useSocket.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── pollService.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   └── chartConfig.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Roadmap de 3 Semanas

### **Semana 1: Fundamentos y Autenticación**

#### Días 1-2: Setup Inicial
- [x] Configurar repositorio Git
- [x] Inicializar proyecto backend (Node.js + Express)
- [x] Inicializar proyecto frontend (React + Vite + TypeScript)
- [x] Configurar PostgreSQL local
- [x] Crear archivo `.env` con variables
- [x] Instalar dependencias esenciales

**Dependencias Backend:**
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.0",
  "socket.io": "^4.6.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

**Dependencias Frontend:**
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.11.0",
  "axios": "^1.4.0",
  "socket.io-client": "^4.6.1",
  "chart.js": "^4.3.0",
  "react-chartjs-2": "^5.2.0"
}
```

#### Días 3-4: Base de Datos
- [x] Crear script SQL con las 6-7 tablas
- [x] Ejecutar migraciones
- [x] Crear datos de prueba (seeds)
- [x] Probar conexión desde backend

#### Días 5-7: Sistema de Autenticación
- [x] Implementar registro de usuarios
- [x] Implementar login con JWT
- [x] Crear middleware de autenticación
- [x] Páginas de Login/Register en frontend
- [x] Context de autenticación
- [x] Protección de rutas

**Entregable Semana 1:** Sistema de login funcional con roles (maestro/alumno)

---

### **Semana 2: Core Polling System**

#### Días 8-9: Gestión de Clases
- [x] CRUD de clases (backend)
- [x] Dashboard maestro - lista de clases
- [x] Crear/editar clase
- [x] Sistema de códigos de inscripción
- [x] Inscripción de alumnos
- [x] Dashboard alumno - mis clases

#### Días 10-12: Sistema de Polls
- [x] Modelo y controlador de polls
- [x] Crear poll con preguntas (maestro)
- [x] Tipos de preguntas: opción múltiple y verdadero/falso
- [x] Activar/cerrar polls
- [x] Vista de poll activo (alumno)
- [x] Responder preguntas
- [x] Guardar respuestas en BD

#### Días 13-14: Tiempo Real con Socket.io
- [x] Configurar Socket.io en backend
- [x] Eventos de polling en tiempo real
- [x] Hook `useSocket` en frontend
- [x] Actualización automática de resultados
- [x] Notificaciones de nuevos polls

**Entregable Semana 2:** Sistema de polling funcional con tiempo real

---

### **Semana 3: Analytics y Pulido**

#### Días 15-16: Dashboard de Analytics
- [x] Endpoint para obtener resultados agregados
- [x] Cálculo de estadísticas básicas:
  - Total de participantes
  - Porcentaje de respuestas correctas
  - Distribución de respuestas
- [x] Integrar Chart.js
- [x] Gráfica de barras (distribución respuestas)
- [x] Gráfica de pastel (correctas vs incorrectas)
- [x] Tabla de resultados por alumno

#### Día 17: Exportación CSV
- [x] Función de exportación en backend
- [x] Botón de exportar en frontend
- [x] Formato CSV con:
  - Información del poll
  - Respuestas por alumno
  - Estadísticas generales

#### Días 18-19: Testing y Fixes
- [x] Probar flujo completo maestro
- [x] Probar flujo completo alumno
- [x] Corregir bugs encontrados
- [x] Mejorar UI/UX básico
- [x] Validaciones de formularios

#### Días 20-21: Preparación de Presentación
- [x] Crear datos de demostración
- [x] Documentar funcionalidades
- [x] Preparar README con instrucciones
- [x] Screenshots/video demo
- [x] Ensayar presentación

**Entregable Semana 3:** MVP completo listo para presentación

---

## ✅ Funcionalidades MVP (Incluidas)

### Maestro
- ✅ Registro e inicio de sesión
- ✅ Crear y gestionar clases
- ✅ Generar código de inscripción
- ✅ Crear polls con preguntas múltiples
- ✅ Activar/cerrar polls
- ✅ Ver resultados en tiempo real
- ✅ Dashboard con gráficas básicas
- ✅ Exportar resultados a CSV
- ✅ Ver lista de alumnos inscritos

### Alumno
- ✅ Registro e inicio de sesión
- ✅ Inscribirse a clases con código
- ✅ Ver clases inscritas
- ✅ Recibir notificación de poll activo
- ✅ Responder polls en tiempo real
- ✅ Ver resultados (si el maestro lo permite)
- ✅ Ver historial de participación

---

## ❌ Funcionalidades Excluidas (Fuera del MVP)

### NO Incluir:
- ❌ Tareas y entregas
- ❌ Proyectos colaborativos
- ❌ Exámenes completos
- ❌ Sistema de calificaciones complejo
- ❌ Foros de discusión
- ❌ Control de asistencia
- ❌ Avisos/anuncios
- ❌ Sistema de notificaciones por email
- ❌ Recuperación de contraseña
- ❌ Edición de perfil avanzada
- ❌ Temas/personalización
- ❌ Modo oscuro
- ❌ Aplicación móvil
- ❌ Tests automatizados extensivos
- ❌ Deployment en producción

---

## 📊 Métricas de Éxito del MVP

### Funcionales
- [x] Usuario puede registrarse y hacer login
- [x] Maestro puede crear clase y poll
- [x] Alumno puede inscribirse y responder
- [x] Resultados se actualizan en tiempo real
- [x] Gráficas muestran datos correctamente
- [x] CSV se exporta con datos completos

### Técnicas
- [x] Tiempo de respuesta < 2 segundos
- [x] Socket.io conecta sin errores
- [x] Base de datos maneja 50+ usuarios
- [x] Sin errores críticos en consola

### Presentación
- [x] Demo fluida de 5-10 minutos
- [x] Mostrar flujo maestro completo
- [x] Mostrar flujo alumno completo
- [x] Demostrar tiempo real funcionando

---

## 🎨 Diseño UI Simplificado

### Paleta de Colores
```css
:root {
  --primary: #4F46E5;      /* Indigo */
  --secondary: #10B981;    /* Green */
  --danger: #EF4444;       /* Red */
  --warning: #F59E0B;      /* Amber */
  --background: #F9FAFB;   /* Gray 50 */
  --text: #111827;         /* Gray 900 */
}
```

### Componentes Básicos
- Botones: Primary, Secondary, Danger
- Inputs: Text, Email, Password, Select
- Cards: Para polls, clases, resultados
- Modal: Para crear poll
- Toast: Para notificaciones

### Páginas Principales
1. **Login/Register** - Formulario simple
2. **Dashboard Maestro** - Lista de clases + botón crear
3. **Dashboard Alumno** - Lista de clases inscritas
4. **Crear Poll** - Formulario con preguntas dinámicas
5. **Responder Poll** - Vista de preguntas una por una
6. **Resultados** - Gráficas + tabla + exportar

---

## 🔒 Consideraciones de Seguridad Básicas

### Implementar:
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Validación de entrada en backend
- ✅ CORS configurado correctamente
- ✅ Variables sensibles en `.env`
- ✅ Sanitización básica de datos

### NO Implementar (por tiempo):
- ❌ Rate limiting
- ❌ HTTPS (usar HTTP en desarrollo)
- ❌ Refresh tokens
- ❌ 2FA
- ❌ Auditoría de logs

---

## 📝 Scripts de Desarrollo

### Backend
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "db:migrate": "node database/migrate.js",
    "db:seed": "node database/seed.js"
  }
}
```

### Frontend
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 🐛 Plan de Testing Simplificado

### Testing Manual (Prioridad)
- [x] Flujo completo de registro/login
- [x] Crear clase y generar código
- [x] Inscripción con código
- [x] Crear poll con 3-5 preguntas
- [x] Activar poll y responder
- [x] Ver resultados en tiempo real
- [x] Exportar CSV y verificar datos

### Testing Automatizado (Opcional)
- [ ] Tests unitarios de funciones críticas
- [ ] Tests de integración de API
- [ ] Tests E2E con Playwright (si hay tiempo)

---

## 📦 Entregables Finales

### Código
1. ✅ Repositorio Git con código completo
2. ✅ README con instrucciones de instalación
3. ✅ Scripts SQL de base de datos
4. ✅ Archivo `.env.example`

### Documentación
1. ✅ Este documento (MVP-PLAN.md)
2. ✅ Diagrama de base de datos
3. ✅ Lista de endpoints API
4. ✅ Guía de usuario básica

### Demo
1. ✅ Base de datos con datos de prueba
2. ✅ Video/screenshots de funcionalidades
3. ✅ Presentación de 10 minutos
4. ✅ Script de demostración

---

## 🚨 Riesgos y Mitigaciones

### Riesgo 1: Tiempo Real No Funciona
**Mitigación:** Tener fallback con polling HTTP cada 3 segundos

### Riesgo 2: Problemas con PostgreSQL
**Mitigación:** Documentar bien setup, tener script de instalación

### Riesgo 3: Bugs de Última Hora
**Mitigación:** Dejar días 18-19 para testing y fixes

### Riesgo 4: Scope Creep
**Mitigación:** Seguir estrictamente la lista de funcionalidades incluidas

---

## 💡 Tips para Desarrollo Rápido

### Backend
1. Usar generadores de código para modelos
2. Copiar/adaptar código de ejemplos
3. No sobre-optimizar, enfocarse en funcionalidad
4. Usar console.log para debugging rápido

### Frontend
1. Usar componentes de UI library (opcional: shadcn/ui)
2. No perder tiempo en animaciones complejas
3. CSS simple, sin frameworks pesados
4. Reutilizar componentes al máximo

### Base de Datos
1. Mantener queries simples
2. No crear índices innecesarios al inicio
3. Usar UUIDs para facilitar desarrollo
4. Seeds con datos realistas pero simples

---

## 📅 Checklist Diario

### Cada Día:
- [ ] Commit de código al final del día
- [ ] Actualizar este documento con progreso
- [ ] Probar funcionalidad implementada
- [ ] Documentar problemas encontrados

### Cada Semana:
- [ ] Review de código
- [ ] Testing de integración
- [ ] Actualizar README
- [ ] Backup de base de datos

---

## 🎯 Criterios de Aceptación

### Para Considerar el MVP Completo:

#### Funcionalidad Core
- [x] Sistema de autenticación funciona
- [x] Maestro puede crear y activar polls
- [x] Alumno puede responder polls
- [x] Resultados se muestran en tiempo real
- [x] Gráficas se generan correctamente
- [x] CSV se exporta con datos completos

#### Calidad Mínima
- [x] Sin errores críticos en consola
- [x] UI es usable y clara
- [x] Flujo es intuitivo
- [x] Datos se persisten correctamente

#### Presentación
- [x] Demo funciona sin fallos
- [x] Documentación está completa
- [x] Código está en repositorio
- [x] Instrucciones de instalación funcionan

---

## 📞 Recursos y Referencias

### Documentación
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/docs/)
- [React](https://react.dev/)
- [Chart.js](https://www.chartjs.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Tutoriales Útiles
- Socket.io con React: [Tutorial](https://socket.io/get-started/chat)
- JWT Authentication: [Tutorial](https://jwt.io/introduction)
- Chart.js con React: [Tutorial](https://react-chartjs-2.js.org/)

---

## ✨ Conclusión

Este plan MVP está diseñado para ser **realista y alcanzable en 3 semanas**. Se enfoca en:

1. **Funcionalidad Core:** Polling en tiempo real
2. **Simplicidad:** Solo lo esencial
3. **Demostrable:** Listo para presentación
4. **Escalable:** Base sólida para futuras mejoras

**Recuerda:** Es mejor tener un MVP simple que funcione perfectamente, que un sistema complejo lleno de bugs.

---

**Fecha de Creación:** 2026-06-16  
**Versión:** 1.0  
**Duración:** 3 semanas (21 días)  
**Complejidad:** Baja-Media  
**Prioridad:** Alta