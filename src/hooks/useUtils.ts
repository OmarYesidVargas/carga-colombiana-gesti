import { toast } from 'sonner';
import * as XLSX from 'xlsx';

/**
 * Hook con utilidades generales para la aplicación
 * @returns {Object} Funciones utilitarias
 */
export const useUtils = () => {
  
  /**
   * Exporta datos a un archivo XLSX con máxima compatibilidad
   * @param {any[]} data - Datos a exportar
   * @param {string} filename - Nombre del archivo
   */
  const exportToXLSX = (data: any[], filename: string) => {
    // Validar datos
    if (!data || data.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    try {
      console.log('🔄 Iniciando exportación de datos:', data.length, 'registros');
      
      // Limpiar y preparar datos de forma simple
      const cleanedData = data.map((row, index) => {
        const cleanedRow: any = {};
        
        Object.keys(row).forEach(key => {
          let value = row[key];
          
          // Convertir todo a string de forma segura
          if (value === null || value === undefined) {
            cleanedRow[key] = '';
          } else {
            // Convertir a string y limpiar caracteres problemáticos
            let stringValue = String(value)
              .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remover caracteres de control
              .replace(/[\r\n\t]/g, ' ') // Reemplazar saltos de línea
              .trim();
            
            cleanedRow[key] = stringValue;
          }
        });
        
        console.log(`📝 Procesado registro ${index + 1}/${data.length}`);
        return cleanedRow;
      });
      
      console.log('✅ Datos limpiados correctamente');
      
      // Crear worksheet
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      
      // Crear workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      
      console.log('📊 Workbook creado correctamente');
      
      // Escribir archivo
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      
      console.log('💾 Archivo generado correctamente');
      
      // Crear blob y descargar
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Crear nombre de archivo seguro
      const safeFilename = filename
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 50) || 'reporte';
      
      // Descargar archivo
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
      console.error('❌ Error en exportación:', error);
      toast.error('Error al exportar archivo');
    }
  };
  
  return {
    exportToXLSX,
    // Mantener compatibilidad con código existente
    exportToCSV: exportToXLSX
  };
};
