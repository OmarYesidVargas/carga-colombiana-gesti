
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from '@/context/AuthContext';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

// Esquema de validación mejorado para el mercado colombiano
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: "El nombre solo puede contener letras y espacios.",
  }),
  email: z.string().email({
    message: "Por favor ingresa una dirección de correo válida.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe tener al menos 10 dígitos.",
  }).regex(/^[+]?[0-9\s\-()]+$/, {
    message: "El teléfono solo puede contener números, espacios, guiones y paréntesis.",
  }),
  document_type: z.string().min(1, {
    message: "Selecciona el tipo de documento.",
  }),
  document_number: z.string().min(6, {
    message: "El número de documento debe tener al menos 6 caracteres.",
  }).regex(/^[0-9]+$/, {
    message: "El número de documento solo puede contener números.",
  }),
  city: z.string().min(2, {
    message: "La ciudad debe tener al menos 2 caracteres.",
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: "La ciudad solo puede contener letras y espacios.",
  }),
  department: z.string().min(1, {
    message: "Selecciona el departamento.",
  }),
  birth_date: z.string().min(1, {
    message: "La fecha de nacimiento es requerida.",
  }).refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 100;
  }, {
    message: "Debes ser mayor de 18 años.",
  }),
  gender: z.string().min(1, {
    message: "Selecciona el género.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Datos específicos para Colombia
const DOCUMENT_TYPES = [
  { value: 'cedula', label: 'Cédula de Ciudadanía' },
  { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'tarjeta_identidad', label: 'Tarjeta de Identidad' },
];

const DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 
  'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 
  'Vaupés', 'Vichada', 'Bogotá D.C.'
];

const GENDERS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
];

const Register = () => {
  const { register, isAuthenticated, isLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document_type: "",
      document_number: "",
      city: "",
      department: "",
      birth_date: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Preparar metadata del usuario para Colombia
      const userMetadata = {
        name: values.name,
        phone: values.phone,
        document_type: values.document_type,
        document_number: values.document_number,
        city: values.city,
        department: values.department,
        birth_date: values.birth_date,
        gender: values.gender,
      };
      
      await register(values.name, values.email, values.password, userMetadata);
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  };

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Crear una cuenta</CardTitle>
          <CardDescription className="text-blue-100">
            Únete a TransporegistrosPlus y gestiona tu transporte de manera eficiente
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información personal básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Juan Carlos Pérez" 
                            {...field} 
                            autoComplete="name"
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="juan@ejemplo.com" 
                            {...field} 
                            autoComplete="email"
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono *</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Ej: +57 300 123 4567 o 3001234567" 
                          {...field} 
                          autoComplete="tel"
                          disabled={isLoading}
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Documentación e identificación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Documentación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="document_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de documento *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DOCUMENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="document_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de documento *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: 12345678" 
                            {...field} 
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Ubicación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona el departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Bogotá, Medellín, Cali" 
                            {...field} 
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Información Adicional
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de nacimiento *</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            disabled={isLoading}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona el género" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GENDERS.map((gender) => (
                              <SelectItem key={gender.value} value={gender.value}>
                                {gender.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seguridad */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Seguridad
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          Mínimo 8 caracteres, incluye mayúscula, minúscula y número
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Crear mi cuenta
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="bg-gray-50 rounded-b-lg">
          <div className="text-center text-sm text-gray-600 w-full">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">
              Iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
