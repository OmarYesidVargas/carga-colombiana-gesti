
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export type Vehicle = {
  id: string;
  userId: string;
  plate: string; // Placa del vehículo
  brand: string; // Marca
  model: string; // Modelo
  year: number; // Año
  color?: string; // Color (opcional)
  fuelType?: string; // Tipo de combustible (opcional)
  capacity?: string; // Capacidad de carga (opcional)
  imageUrl?: string; // URL de la imagen (opcional)
  createdAt: Date;
  updatedAt: Date;
};

export type Trip = {
  id: string;
  vehicleId: string; // ID del vehículo asociado
  userId: string;
  startDate: Date; // Fecha de inicio
  endDate: Date; // Fecha de fin
  origin: string; // Lugar de origen
  destination: string; // Lugar de destino
  distance: number; // Distancia en kilómetros
  notes?: string; // Notas adicionales (opcional)
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseCategory =
  | "fuel"        // Combustible
  | "toll"        // Peaje
  | "maintenance" // Mantenimiento
  | "lodging"     // Alojamiento
  | "food"        // Comida
  | "other";      // Otros

// Colores para las categorías de gastos
export const expenseCategoryColors = {
  fuel: "#3b82f6",        // blue-500
  toll: "#10b981",        // emerald-500
  maintenance: "#f59e0b", // amber-500
  lodging: "#8b5cf6",     // violet-500
  food: "#ec4899",        // pink-500
  other: "#6b7280",       // gray-500
};

export type Expense = {
  id: string;
  tripId: string; // ID del viaje asociado
  userId: string;
  vehicleId: string; // ID del vehículo (para facilitar consultas)
  category: ExpenseCategory; // Categoría del gasto
  date: Date; // Fecha del gasto
  amount: number; // Monto en pesos colombianos
  description?: string; // Descripción (opcional)
  receiptUrl?: string; // URL del comprobante (opcional)
  createdAt: Date;
  updatedAt: Date;
};

// Nuevo tipo para peajes
export type Toll = {
  id: string;
  userId: string;
  name: string;          // Nombre del peaje
  location: string;      // Ubicación del peaje
  category: string;      // Categoría (1, 2, 3, 4, 5, 6, 7, etc.)
  price: number;         // Precio actual en pesos colombianos
  route: string;         // Ruta en la que se encuentra (ej: "Bogotá-Medellín")
  coordinates?: string;  // Coordenadas geográficas (opcional)
  description?: string;  // Descripción adicional (opcional)
  createdAt: Date;
  updatedAt: Date;
};

// Registro de paso por peaje
export type TollRecord = {
  id: string;
  userId: string;
  tripId: string;        // ID del viaje asociado
  vehicleId: string;     // ID del vehículo
  tollId: string;        // ID del peaje
  date: Date;            // Fecha y hora del paso por el peaje
  price: number;         // Precio pagado (puede variar del precio actual)
  paymentMethod: string; // Método de pago (efectivo, electrónico, tag, etc.)
  receipt?: string;      // Número de recibo o comprobante (opcional)
  notes?: string;        // Notas adicionales (opcional)
  createdAt: Date;
  updatedAt: Date;
};
