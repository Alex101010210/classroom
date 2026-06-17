# 📦 Configuración de package.json para el Proyecto

## Backend package.json

Crear el archivo `backend/package.json` con el siguiente contenido:

```json
{
  "name": "classroom-polling-backend",
  "version": "1.0.0",
  "description": "Backend para sistema de polling en tiempo real",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["polling", "classroom", "education", "realtime"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "socket.io": "^4.6.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Frontend package.json

Crear el archivo `frontend/package.json` con el siguiente contenido:

```json
{
  "name": "classroom-polling-frontend",
  "version": "1.0.0",
  "type": "module",
  "description": "Frontend para sistema de polling en tiempo real",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "socket.io-client": "^4.6.1",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

## Root package.json (Opcional - para scripts globales)

Crear el archivo `package.json` en la raíz con el siguiente contenido:

```json
{
  "name": "classroom-polling-analytics",
  "version": "1.0.0",
  "description": "Sistema de polling en tiempo real con analytics",
  "private": true,
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "start:backend": "cd backend && npm start",
    "build:frontend": "cd frontend && npm run build"
  },
  "keywords": ["polling", "classroom", "education", "analytics"],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

## 📝 Instrucciones de Instalación

### 1. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 2. Instalar dependencias del Frontend

```bash
cd frontend
npm install
```

### 3. O instalar todo desde la raíz (si usas el root package.json)

```bash
npm install
npm run install:all
```

## 🚀 Scripts Disponibles

### Backend

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción

### Frontend

- `npm run dev` - Inicia el servidor de desarrollo de Vite
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

### Root (si usas package.json raíz)

- `npm run install:all` - Instala todas las dependencias
- `npm run dev` - Inicia backend y frontend simultáneamente
- `npm run dev:backend` - Solo backend
- `npm run dev:frontend` - Solo frontend

## 📦 Dependencias Principales Explicadas

### Backend

- **express**: Framework web para Node.js
- **cors**: Middleware para habilitar CORS
- **dotenv**: Carga variables de entorno desde .env
- **pg**: Cliente PostgreSQL para Node.js
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación con JWT
- **socket.io**: WebSocket para tiempo real
- **uuid**: Generación de UUIDs
- **nodemon**: Reinicio automático en desarrollo

### Frontend

- **react**: Librería UI
- **react-dom**: Renderizado de React
- **react-router-dom**: Enrutamiento
- **axios**: Cliente HTTP
- **socket.io-client**: Cliente WebSocket
- **chart.js**: Librería de gráficas
- **react-chartjs-2**: Wrapper de Chart.js para React
- **typescript**: Tipado estático
- **vite**: Build tool y dev server
- **@vitejs/plugin-react**: Plugin de React para Vite

## ⚠️ Notas Importantes

1. **Node.js**: Asegúrate de tener Node.js v18+ instalado
2. **PostgreSQL**: Debe estar instalado y corriendo
3. **Variables de entorno**: Crea el archivo `.env` en backend antes de iniciar
4. **Puertos**: Backend usa puerto 5000, Frontend usa puerto 5173 por defecto

## 🔧 Solución de Problemas

### Error: Cannot find module

```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript en Frontend

```bash
# Verifica que tsconfig.json existe
# Si no, créalo con la configuración básica
```

### Error de conexión Socket.io

```bash
# Verifica que las URLs en frontend/src/services/api.ts sean correctas
# Backend: http://localhost:5000
# Socket: http://localhost:5000
```

## 📋 Próximos Pasos

1. Crear los archivos package.json según las configuraciones arriba
2. Ejecutar `npm install` en cada carpeta
3. Configurar el archivo `.env` en backend
4. Iniciar el backend: `cd backend && npm run dev`
5. Iniciar el frontend: `cd frontend && npm run dev`
6. Abrir http://localhost:5173 en el navegador

---

**Fecha:** 2026-06-17  
**Versión:** 1.0