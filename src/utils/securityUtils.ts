
/**
 * Utilidades de seguridad para TransporegistrosPlus
 * Implementa validaciones adicionales y sanitización de datos
 */

/**
 * Sanitiza texto para prevenir XSS
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remover caracteres peligrosos
    .trim()
    .substring(0, 1000); // Limitar longitud
};

/**
 * Valida que un ID sea un UUID válido
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Valida fortaleza de contraseña
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe incluir al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting simple para requests
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Filtrar requests dentro de la ventana de tiempo
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const authRateLimiter = new RateLimiter(5, 300000); // 5 intentos por 5 minutos
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests por minuto

/**
 * Valida archivos de upload de forma segura
 */
export const validateFileUpload = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  // Tipos permitidos para documentos de vehículos
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];
  
  // Tamaño máximo: 5MB
  const maxSize = 5 * 1024 * 1024;
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de archivo no permitido. Solo se permiten PDF e imágenes (JPG, PNG, WebP)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'El archivo es demasiado grande. Máximo 5MB permitido'
    };
  }
  
  // Validar nombre del archivo
  const fileName = file.name;
  if (fileName.length > 100 || !/^[a-zA-Z0-9._-]+$/.test(fileName)) {
    return {
      isValid: false,
      error: 'Nombre de archivo inválido. Solo se permiten letras, números, puntos, guiones y guiones bajos'
    };
  }
  
  return { isValid: true };
};

/**
 * Genera nombres de archivo seguros
 */
export const generateSecureFileName = (originalName: string, userId: string): string => {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${userId}/${timestamp}-${random}.${extension}`;
};

/**
 * Valida URLs de forma segura
 */
export const isValidHttpUrl = (string: string): boolean => {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  
  return url.protocol === "http:" || url.protocol === "https:";
};

/**
 * Limpia datos sensibles de logs
 */
export const sanitizeForLogging = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'key'];
  const cleaned = { ...data };
  
  for (const field of sensitiveFields) {
    if (field in cleaned) {
      cleaned[field] = '[REDACTED]';
    }
  }
  
  return cleaned;
};
