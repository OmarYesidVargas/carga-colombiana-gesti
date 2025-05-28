// export.ts
// Utilidad para exportar datos a formato CSV/Excel
// Utiliza la librería XLSX para la conversión y exportación de datos

import * as XLSX from 'xlsx';

/**
 * Exporta datos a un archivo CSV/Excel
 * @param data - Array de objetos a exportar
 * @param filename - Nombre del archivo sin extensión
 * @throws Error si la exportación falla
 */
export const exportToCSVUtil = (data: any[], filename: string): void => {
  try {
    // Convertir los datos a una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Guardar el archivo
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    Logger.error('Error al exportar a CSV:', error);
    throw new Error('Error al exportar los datos');
  }
};
