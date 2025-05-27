
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/**
 * Hook con utilidades generales para la aplicación
 * @returns {Object} Funciones utilitarias
 */
export const useUtils = () => {
  
  /**
   * Exporta datos a un archivo XLSX con mejor compatibilidad y codificación mejorada
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
      // Limpiar y sanitizar los datos para mejor compatibilidad con Excel
      const cleanedData = data.map(row => {
        const cleanedRow: any = {};
        Object.keys(row).forEach(key => {
          let value = row[key];
          
          // Manejar valores nulos o undefined
          if (value === null || value === undefined) {
            cleanedRow[key] = '';
            return;
          }
          
          // Convertir a string y limpiar caracteres problemáticos
          value = String(value);
          
          // Reemplazar caracteres que pueden causar problemas en Excel
          value = value
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Caracteres de control
            .replace(/\r\n/g, ' ') // Saltos de línea Windows
            .replace(/\n/g, ' ')   // Saltos de línea Unix
            .replace(/\r/g, ' ')   // Retornos de carro
            .trim();
          
          cleanedRow[key] = value;
        });
        return cleanedRow;
      });
      
      // Crear una nueva hoja de trabajo con los datos limpios
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      
      // Configurar el ancho de las columnas de manera más conservadora
      const columnWidths = Object.keys(cleanedData[0] || {}).map(key => {
        // Calcular ancho basado en el contenido más largo
        const maxLength = Math.max(
          key.length, // Longitud del encabezado
          ...cleanedData.map(row => String(row[key] || '').length)
        );
        return { width: Math.min(Math.max(maxLength + 2, 10), 50) };
      });
      worksheet['!cols'] = columnWidths;
      
      // Crear un nuevo libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Configurar propiedades del libro para mejor compatibilidad
      workbook.Props = {
        Title: filename,
        Subject: 'Reporte generado por TransporegistrosPlus',
        Author: 'TransporegistrosPlus',
        CreatedDate: new Date()
      };
      
      // Añadir la hoja al libro con nombre descriptivo
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      
      // Escribir el archivo con configuración optimizada para Excel
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: false, // Desactivar compresión para mayor compatibilidad
        bookSST: false,     // Desactivar tabla de strings compartidos
        cellStyles: false   // Desactivar estilos para mayor compatibilidad
      });
      
      // Crear blob con tipo MIME específico para XLSX
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Crear enlace de descarga con nombre seguro
      const safeFilename = filename
        .replace(/[^a-zA-Z0-9\-_]/g, '_') // Reemplazar caracteres especiales
        .replace(/_+/g, '_') // Reducir múltiples guiones bajos a uno
        .substring(0, 100); // Limitar longitud
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${safeFilename}.xlsx`);
      link.style.visibility = 'hidden';
      
      // Añadir al DOM, simular clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL después de un retraso para asegurar la descarga
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      toast.success(`Archivo exportado correctamente: ${safeFilename}.xlsx`);
    } catch (error) {
      console.error('Error al exportar a XLSX:', error);
      toast.error('Error al exportar datos. Intente nuevamente.');
    }
  };
  
  return {
    exportToCSV
  };
};
