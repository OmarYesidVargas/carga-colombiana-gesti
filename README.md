
# TransporegistrosPlus 🚛

Sistema integral de gestión de transportes para Colombia. Una aplicación web moderna y responsiva para el control de vehículos, viajes, gastos y peajes.

## 🌟 Características

- **Gestión de Vehículos**: Registro y control completo de la flota
- **Control de Viajes**: Planificación y seguimiento de rutas
- **Gestión de Gastos**: Categorización y control de costos operativos
- **Registro de Peajes**: Control detallado de costos de peajes
- **Reportes Avanzados**: Análisis y estadísticas de la operación
- **Auditoría Completa**: Histórico de todas las operaciones del sistema
- **Responsive Design**: Optimizado para dispositivos móviles y escritorio

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Gráficos**: Recharts
- **Formularios**: React Hook Form + Zod
- **Fechas**: date-fns
- **Iconos**: Lucide React

## 🚀 Despliegue

### Producción (GitHub Pages)
La aplicación está desplegada en: https://omaryesidvargas.github.io/transporegistrosplus/

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

### 🛣️ Control de Viajes
- Planificación de rutas y horarios
- Seguimiento de origen y destino
- Asignación de vehículos y conductores

### 💰 Gestión de Gastos
- Categorización automática de gastos
- Control por viaje y vehículo
- Reportes de costos operativos

### 🛣️ Registro de Peajes
- Base de datos de peajes colombianos
- Registro automático de costos
- Control por ruta y vehículo

### 📊 Reportes y Analytics
- Dashboards interactivos
- Gráficos de tendencias
- Exportación a Excel
- Análisis de rentabilidad

### 🔒 Seguridad y Auditoría
- Autenticación segura con Supabase
- Row Level Security (RLS)
- Registro completo de auditoría
- Control de acceso por usuario

## 🗄️ Base de Datos

### Estructura Principal
- `vehicles`: Información de vehículos
- `trips`: Registro de viajes
- `expenses`: Control de gastos
- `tolls`: Catálogo de peajes
- `toll_records`: Registros de paso por peajes
- `audit_logs`: Histórico de operaciones

### Características de Seguridad
- Row Level Security (RLS) habilitado
- Políticas de acceso por usuario
- Auditoría completa de operaciones
- Encriptación de datos sensibles

## 🎨 Diseño y UX

- **Responsive**: Optimizado para móviles, tablets y escritorio
- **Tema Oscuro/Claro**: Soporte para preferencias del usuario
- **Accesibilidad**: Cumple estándares WCAG 2.1
- **PWA Ready**: Preparado para instalación como app nativa

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Desarrollado por

**TransporegistrosPlus Team**
- Email: contact@transporegistrosplus.com
- GitHub: [@omaryesidvargas](https://github.com/omaryesidvargas)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- 📧 Email: support@transporegistrosplus.com
- 🐛 Issues: [GitHub Issues](https://github.com/omaryesidvargas/transporegistrosplus/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/omaryesidvargas/transporegistrosplus/wiki)

---

⭐ Si este proyecto te resulta útil, ¡dale una estrella en GitHub!
