
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/**
 * Hook con utilidades generales para la aplicación
 * @returns {Object} Funciones utilitarias
 */
export const useUtils = () => {
  
  /**
   * Exporta datos a un archivo XLSX con máxima compatibilidad y sin errores de validación
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
      console.log('🔄 Iniciando exportación de datos:', data.length, 'registros');
      
      // Limpiar y preparar datos de forma más estricta
      const cleanedData = data.map((row, index) => {
        const cleanedRow: any = {};
        
        Object.keys(row).forEach(key => {
          let value = row[key];
          
          // Manejar valores nulos, undefined o vacíos
          if (value === null || value === undefined || value === '') {
            cleanedRow[key] = '';
            return;
          }
          
          // Convertir todo a string de forma segura
          let stringValue = String(value);
          
          // Limpiar caracteres problemáticos de forma más agresiva
          stringValue = stringValue
            // Remover caracteres de control y no imprimibles
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
            // Remover saltos de línea y retornos de carro
            .replace(/[\r\n\t]/g, ' ')
            // Remover comillas dobles problemáticas
            .replace(/"/g, "'")
            // Limpiar espacios múltiples
            .replace(/\s+/g, ' ')
            // Trim espacios
            .trim();
          
          // Limitar longitud para evitar problemas
          if (stringValue.length > 500) {
            stringValue = stringValue.substring(0, 500) + '...';
          }
          
          cleanedRow[key] = stringValue;
        });
        
        console.log(`📝 Procesado registro ${index + 1}/${data.length}`);
        return cleanedRow;
      });
      
      console.log('✅ Datos limpiados correctamente');
      
      // Crear worksheet con configuración básica y segura
      const worksheet = XLSX.utils.json_to_sheet(cleanedData, {
        header: Object.keys(cleanedData[0] || {}),
        skipHeader: false
      });
      
      // Configurar anchos de columna de forma conservadora
      const maxColWidth = 30; // Ancho máximo seguro
      const minColWidth = 10; // Ancho mínimo
      
      if (cleanedData.length > 0) {
        const columnWidths = Object.keys(cleanedData[0]).map(key => {
          // Calcular ancho basado en contenido pero limitado
          const headerLength = key.length;
          const maxContentLength = Math.max(
            ...cleanedData.slice(0, 100).map(row => String(row[key] || '').length)
          );
          const width = Math.max(Math.min(Math.max(headerLength, maxContentLength) + 2, maxColWidth), minColWidth);
          return { width };
        });
        
        worksheet['!cols'] = columnWidths;
      }
      
      // Crear workbook con configuración mínima y segura
      const workbook = XLSX.utils.book_new();
      
      // Añadir worksheet con nombre simple
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
      
      console.log('📊 Workbook creado correctamente');
      
      // Escribir archivo con configuración optimizada para compatibilidad
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      
      console.log('💾 Archivo generado correctamente');
      
      // Crear blob con tipo MIME correcto
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Crear nombre de archivo seguro (solo caracteres alfanuméricos)
      const safeFilename = filename
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 50) || 'reporte';
      
      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFilename}.xlsx`;
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('✅ Descarga iniciada correctamente');
      toast.success(`Archivo exportado: ${safeFilename}.xlsx`);
      
    } catch (error) {
      console.error('❌ Error completo en exportación:', error);
      console.error('📊 Datos que causaron el error:', data);
      toast.error('Error al exportar. Revisa la consola para más detalles.');
    }
  };
  
  return {
    exportToCSV
  };
};
