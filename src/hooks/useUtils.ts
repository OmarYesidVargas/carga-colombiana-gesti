
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/**
 * Hook con utilidades generales para la aplicación
 * @returns {Object} Funciones utilitarias
 */
export const useUtils = () => {
  
  /**
   * Exporta datos a un archivo XLSX con codificación UTF-8 para caracteres especiales
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
      // Crear una nueva hoja de trabajo con los datos
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Crear un nuevo libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Añadir la hoja al libro con nombre descriptivo
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
      
      // Configurar el ancho de las columnas automáticamente
      const cols = Object.keys(data[0] || {}).map(() => ({ width: 20 }));
      worksheet['!cols'] = cols;
      
      // Escribir el archivo con configuración para UTF-8
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true
      });
      
      // Crear blob con tipo MIME correcto para XLSX
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      
      // Crear enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.xlsx`);
      link.style.visibility = 'hidden';
      
      // Añadir al DOM, simular clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Datos exportados a ${filename}.xlsx`);
    } catch (error) {
      console.error('Error al exportar a XLSX:', error);
      toast.error('Error al exportar datos');
    }
  };
  
  return {
    exportToCSV
  };
};
