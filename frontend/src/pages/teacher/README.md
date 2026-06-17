# Teacher Dashboard & Clases

## Descripción

Sistema de gestión para maestros con dos páginas principales:

## 1. Dashboard (Dashboard.tsx)

Dashboard principal para maestros con las siguientes características:

### Componentes Principales

1. **Header (Barra Superior Azul)**
   - Logo en la esquina izquierda
   - Botón "Add" - Navega a la página de gestión de materias
   - Botón "Users" - Para gestionar usuarios

2. **Sección de Bienvenida**
   - Muestra el mensaje de bienvenida con el nombre del maestro
   - Ocupa el área principal izquierda

3. **Sidebar Derecho (Azul Claro)**
   - **Foros** - Botón para acceder a foros
   - **Avisos** - Botón para gestionar avisos
   - **Materias** - Lista desplegable con las materias agregadas
   - **Salir** - Botón para cerrar sesión

## Funcionalidades del Dashboard

### Navegación a Gestión de Materias
1. Click en el botón "Add" en el header
2. Navega automáticamente a la página de Clases (/teacher/clases)

### Lista Desplegable de Materias
- Click en "Materias ↓" para abrir/cerrar la lista
- Las materias agregadas aparecen en la lista
- Click en una materia para seleccionarla
- Si no hay materias, muestra "No hay materias agregadas"

### Persistencia de Datos
- Las materias se guardan en localStorage
- Se cargan automáticamente al abrir el dashboard

## 2. Clases (Clases.tsx)

Página dedicada a la gestión completa de materias.

### Características

1. **Header con navegación**
   - Botón "Volver" - Regresa al Dashboard
   - Título de la página
   - Botón "Nueva Materia" - Abre modal para agregar

2. **Grid de Materias**
   - Tarjetas con información de cada materia
   - Nombre y descripción
   - Fecha de creación
   - Botones de editar y eliminar

3. **Modal de Gestión**
   - Agregar nueva materia
   - Editar materia existente
   - Campos: Nombre (requerido) y Descripción (opcional)

### Funcionalidades de Clases

#### Agregar Materia
1. Click en "Nueva Materia" o botón "+"
2. Completa el formulario en el modal
3. Click en "Agregar"
4. La materia se guarda en localStorage

#### Editar Materia
1. Click en el icono de editar (lápiz) en la tarjeta
2. Modifica los datos en el modal
3. Click en "Actualizar"

#### Eliminar Materia
1. Click en el icono de eliminar (papelera)
2. Confirma la eliminación
3. La materia se elimina de localStorage

## Uso en la Aplicación

La aplicación usa React Router para la navegación:

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/Dashboard';
import Clases from './pages/teacher/Clases';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/clases" element={<Clases />} />
      </Routes>
    </Router>
  );
}
```

## Estilos

Los estilos están en `Dashboard.css` y utilizan las variables CSS definidas en:
- `frontend/src/styles/variables.css`
- `frontend/src/styles/global.css`

### Colores Principales
- Header: Azul degradado (#4A7C9E - #5A8CAE)
- Sidebar: Azul claro degradado (#A8D5E2 - #B8E5F2)
- Botones: Blanco con hover effects
- Botón Salir: Rojo con borde

## Responsive Design

El dashboard es completamente responsive:
- **Desktop**: Layout de dos columnas (contenido + sidebar)
- **Tablet**: Sidebar más estrecho
- **Mobile**: Layout vertical (contenido arriba, sidebar abajo)

## Próximas Implementaciones

Las siguientes funcionalidades están preparadas para ser implementadas:
- Integración con API de usuarios
- Sistema de foros completo
- Gestión de avisos
- Navegación a páginas de materias específicas
- Autenticación y gestión de sesión

## Estructura de Archivos

```
frontend/src/pages/teacher/
├── Dashboard.tsx       # Dashboard principal
├── Dashboard.css       # Estilos del dashboard
├── Clases.tsx         # Gestión de materias
├── Clases.css         # Estilos de clases
└── README.md          # Esta documentación
```

## Navegación

- **/** → Redirige a `/teacher/dashboard`
- **/teacher/dashboard** → Dashboard principal
- **/teacher/clases** → Gestión de materias

## Iconos FontAwesome Utilizados

### Dashboard
- `faPlus` - Botón Add
- `faUser` - Botón Users
- `faRightFromBracket` - Botón Salir

### Clases
- `faArrowLeft` - Botón Volver
- `faPlus` - Nueva Materia
- `faEdit` - Editar Materia
- `faTrash` - Eliminar Materia

## Made with Bob