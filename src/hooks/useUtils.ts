
import { toast } from 'sonner';

/**
 * Hook con utilidades generales para la aplicación
 * @returns {Object} Funciones utilitarias
 */
export const useUtils = () => {
  
  /**
   * Exporta datos a un archivo CSV
   * @param {any[]} data - Datos a exportar
   * @param {string} filename - Nombre del archivo
   */
  const exportToCSV = (data: any[], filename: string) => {
    // Validar datos
    if (!data || data.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    try {
      // Obtener encabezados (claves del primer objeto)
      const headers = Object.keys(data[0]);
      
      // Crear contenido CSV
      const csvRows = [];
      
      // Añadir encabezados
      csvRows.push(headers.join(','));
      
      // Añadir filas de datos
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          // Manejar valores especiales (cadenas con comas, nulos, etc.)
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') {
            // Escapar comillas y envolver en comillas si contiene comas
            const escaped = value.replace(/"/g, '""');
            return escaped.includes(',') ? `"${escaped}"` : escaped;
          }
          return value;
        });
        csvRows.push(values.join(','));
      }
      
      // Unir filas con saltos de línea
      const csvContent = csvRows.join('\n');
      
      // Crear blob y link para descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      
      // Añadir al DOM, simular clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Datos exportados a ${filename}.csv`);
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      toast.error('Error al exportar datos');
    }
  };
  
  return {
    exportToCSV
  };
};
