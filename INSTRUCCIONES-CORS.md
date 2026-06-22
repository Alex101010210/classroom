# 🔧 Solución al Error de CORS

## Problema
Error: "Solicitud de origen cruzado bloqueada: La política de mismo origen no permite la lectura de recursos remotos"

## Cambios Realizados

### 1. Backend - Configuración de CORS (`backend/src/app.js`)
✅ Configurado CORS con opciones específicas para permitir peticiones desde el frontend
✅ Cambiada la ruta base de `/api/v1` a `/api`
✅ Agregado soporte para `credentials: true`

### 2. Backend - Puerto del Servidor (`backend/src/server.js`)
✅ Configurado para usar el puerto 3000 (por defecto)
✅ Agregados logs informativos

### 3. Variables de Entorno
✅ Creado archivo `.env.example` con las variables necesarias

## 📋 Pasos para Solucionar

### 1. Verificar/Crear archivo .env en backend
```bash
cd backend
cp .env.example .env
```

### 2. Editar el archivo .env con tus credenciales:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=Classroom
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres

JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d
```

### 3. Reiniciar el Servidor Backend
```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar:
cd backend
npm run dev
# o
node src/server.js
```

### 4. Verificar que el servidor esté corriendo
Deberías ver en la consola:
```
🚀 Server running on port 3000
📡 API available at http://localhost:3000/api
✓ Ahuevo si se conecto (conexión a la base de datos)
```

### 5. Verificar el Frontend
El frontend debe estar corriendo en:
- `http://localhost:5173` (Vite por defecto)

### 6. Probar la Creación de Clases
1. Abre el navegador en `http://localhost:5173`
2. Navega a la página de crear clases
3. Completa el formulario:
   - Nombre de la clase
   - Descripción
   - **Selecciona un color** (nuevo campo)
4. Click en "Crear"

## 🔍 Verificación de la API

Puedes probar la API directamente con:

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Crear Clase (requiere token JWT)
```bash
curl -X POST http://localhost:3000/api/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "nombre_class": "Matemáticas",
    "descrip_class": "Clase de matemáticas avanzadas",
    "color_class": "#3b82f6"
  }'
```

## ⚠️ Notas Importantes

1. **El servidor DEBE estar corriendo en el puerto 3000**
2. **El frontend DEBE estar corriendo en el puerto 5173**
3. **Debes tener un token JWT válido** para crear clases (requiere login)
4. **La base de datos PostgreSQL debe estar corriendo** y accesible
5. **La tabla `clases` debe existir** en la base de datos

## 🐛 Si Aún Tienes Problemas

### Error: "Network Error"
- Verifica que el backend esté corriendo
- Verifica que el puerto sea 3000
- Revisa la consola del backend para errores

### Error: "401 Unauthorized"
- Necesitas hacer login primero
- Verifica que el token JWT esté en localStorage
- El token debe ser válido y no estar expirado

### Error: "500 Internal Server Error"
- Revisa los logs del backend
- Verifica la conexión a la base de datos
- Asegúrate de que la tabla `clases` exista

## 📊 Estructura de la Tabla `clases`

Si la tabla no existe, créala con:

```sql
CREATE TABLE clases (
  id SERIAL PRIMARY KEY,
  maestro_id INTEGER NOT NULL,
  nombre_class TEXT NOT NULL,
  descrip_class TEXT,
  color_class TEXT,
  activa_class BOOLEAN DEFAULT true
);
```

## ✅ Checklist Final

- [ ] Archivo `.env` creado y configurado
- [ ] Backend reiniciado y corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Base de datos PostgreSQL corriendo
- [ ] Tabla `clases` existe en la base de datos
- [ ] Usuario logueado (token JWT válido)
- [ ] CORS configurado correctamente