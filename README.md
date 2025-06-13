
# TransporegistrosPlus 🚛

Sistema integral de gestión de transportes. Una aplicación web moderna y responsiva para el control de vehículos, viajes, gastos y peajes.

## 🌟 Características

- **Gestión de Vehículos**: Registro y control completo de la flota
- **Control de Viajes**: Planificación y seguimiento de rutas
- **Gestión de Gastos**: Categorización y control de costos operativos
- **Registro de Peajes**: Control detallado de costos de peajes
- **Reportes Avanzados**: Análisis y estadísticas de la operación
- **Auditoría Completa**: Histórico de todas las operaciones del sistema
- **Responsive Design**: Optimizado para dispositivos móviles y escritorio
- **Debugging Avanzado**: Sistema completo de logs y monitoreo de rendimiento

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Gráficos**: Recharts
- **Formularios**: React Hook Form + Zod
- **Fechas**: date-fns
- **Iconos**: Lucide React
- **Optimización**: Performance monitoring y caching inteligente

## 🚀 Despliegue

### Producción (GitHub Pages)
La aplicación está desplegada en: https://transporegistrosplus.vercel.app/

### Variables de Entorno Requeridas

```bash
VITE_SUPABASE_URL=https://pwieabhoqzstiglmjmod.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/omaryesidvargas/transporegistrosplus.git

# Instalar dependencias
cd transporegistrosplus
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📱 Funcionalidades Principales

### 🚗 Gestión de Vehículos
- Registro de vehículos con información completa
- Control de documentación y mantenimiento
- Visualización de estado y disponibilidad
- Notificaciones de vencimientos automáticas

### 🛣️ Control de Viajes
- Planificación de rutas y horarios
- Seguimiento de origen y destino
- Asignación de vehículos y conductores
- Validación avanzada de fechas

### 💰 Gestión de Gastos
- Categorización automática de gastos
- Control por viaje y vehículo
- Reportes de costos operativos
- Análisis de rentabilidad en tiempo real

### 🛣️ Registro de Peajes
- Base de datos de peajes colombianos
- Registro automático de costos
- Control por ruta y vehículo
- Optimización de rutas

### 📊 Reportes y Analytics
- Dashboards interactivos optimizados
- Gráficos de tendencias con Recharts
- Exportación a Excel
- Análisis de rentabilidad avanzado
- Métricas de rendimiento en tiempo real

### 🔒 Seguridad y Auditoría
- Autenticación segura con Supabase
- Row Level Security (RLS)
- Registro completo de auditoría
- Control de acceso por usuario
- Manejo avanzado de errores

### 🔧 Características Técnicas Avanzadas
- **Performance Monitoring**: Seguimiento de métricas de rendimiento
- **Caching Inteligente**: Sistema de cache optimizado para mejor UX
- **Debugging Avanzado**: Logs detallados y herramientas de desarrollo
- **Validación Robusta**: Validación de formularios y datos mejorada
- **Error Handling**: Manejo de errores comprehensivo
- **Optimistic Updates**: Actualizaciones optimistas para mejor UX

## 🗄️ Base de Datos

### Estructura Principal
- `profiles`: Perfiles de usuario con información completa
- `vehicles`: Información de vehículos con validaciones
- `trips`: Registro de viajes con fechas validadas
- `expenses`: Control de gastos categorizado
- `tolls`: Catálogo de peajes colombianos
- `toll_records`: Registros de paso por peajes
- `audit_logs`: Histórico de operaciones

### Características de Seguridad
- Row Level Security (RLS) habilitado
- Políticas de acceso por usuario
- Auditoría completa de operaciones
- Encriptación de datos sensibles
- Triggers automatizados para notificaciones

## 🎨 Diseño y UX

- **Responsive**: Optimizado para móviles, tablets y escritorio
- **Tema Oscuro/Claro**: Soporte para preferencias del usuario
- **Accesibilidad**: Cumple estándares WCAG 2.1
- **PWA Ready**: Preparado para instalación como app nativa
- **Componentes Optimizados**: UI components con mejor rendimiento
- **Loading States**: Estados de carga mejorados y consistentes

## 📊 Rendimiento y Optimización

- **Code Splitting**: Carga de código bajo demanda
- **Lazy Loading**: Carga perezosa de componentes
- **Memoización**: Optimización de re-renders
- **Cache Strategy**: Estrategia de cache inteligente
- **Bundle Optimization**: Optimización del bundle para producción

## 🔧 Configuración Avanzada

### Feature Flags
```typescript
ENABLE_ADVANCED_DEBUGGING: false    // Debugging avanzado
ENABLE_PERFORMANCE_MONITORING: true // Monitoreo de rendimiento
ENABLE_ERROR_TRACKING: true         // Tracking de errores
ENABLE_ANALYTICS: true              // Analytics
```

### Límites del Sistema
- Máximo 50 vehículos por usuario
- Máximo 1000 viajes por mes
- Máximo 100 gastos por viaje
- Archivos máximo 10MB

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Desarrollado por

**TransporegistrosPlus Team**
- Email: transporegistrosplus@gmail.com
- GitHub: [@omaryesidvargas](https://github.com/omaryesidvargas)



## 🏆 Estado del Proyecto

✅ **VERSIÓN 1.0.0 COMPLETADA**

- [x] Sistema de autenticación completo
- [x] Gestión de vehículos optimizada
- [x] Control de viajes con validaciones
- [x] Gestión de gastos categorizada
- [x] Reportes y analytics avanzados
- [x] Sistema de perfiles completo
- [x] Debugging y monitoreo avanzado
- [x] Optimizaciones de rendimiento
- [x] UI/UX pulida y responsiva
- [x] Documentación completa
