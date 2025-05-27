
/**
 * Página de Registro de Usuarios Internacional para TransporegistrosPlus
 * 
 * Formulario completo de registro con validaciones internacionales:
 * - Soporte para múltiples países y documentos
 * - Validaciones específicas por región
 * - Información de contacto internacional
 * - Datos de ubicación flexibles
 * - Validaciones en tiempo real con Zod
 * - Diseño responsive y accesible
 * - Soporte multiidioma
 * 
 * @author TransporegistrosPlus Team
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from '@/context/AuthContext';
import { 
  validateEmail, 
  validateInternationalPhone, 
  validateInternationalDocument 
} from '@/utils/validators';
import { 
  SUPPORTED_COUNTRIES, 
  DOCUMENT_TYPES, 
  GENDER_OPTIONS 
} from '@/lib/constants';

// Componentes UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Mail, Lock, Phone, MapPin, Calendar, CreditCard, Globe } from 'lucide-react';

/**
 * Esquema de validación con Zod para el formulario de registro internacional
 * Incluye validaciones flexibles para múltiples países
 */
const registerSchema = z.object({
  // Datos básicos
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ\s'-]+$/, "El nombre contiene caracteres inválidos"),
  
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .refine((email) => validateEmail(email), "Formato de email inválido"),
  
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una mayúscula, una minúscula y un número"),
  
  confirmPassword: z
    .string()
    .min(8, "Confirma tu contraseña"),
  
  // Información de país
  country: z
    .string()
    .min(1, "Selecciona tu país"),
  
  // Datos de contacto
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos"),
  
  // Datos de documento
  documentType: z
    .string()
    .min(1, "Selecciona un tipo de documento"),
  
  documentNumber: z
    .string()
    .min(6, "El número de documento debe tener al menos 6 caracteres")
    .max(20, "El número de documento es demasiado largo"),
  
  // Datos de ubicación
  state: z
    .string()
    .min(2, "El estado/provincia debe tener al menos 2 caracteres")
    .max(100, "El nombre del estado/provincia es demasiado largo"),
  
  city: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "El nombre de la ciudad es demasiado largo"),
  
  postalCode: z
    .string()
    .optional(),
  
  // Datos opcionales
  birthDate: z
    .string()
    .optional(),
  
  gender: z
    .string()
    .optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

/**
 * Tipo inferido del esquema de validación
 */
type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Componente principal de la página de registro internacional
 */
const Register = () => {
  // Hooks de autenticación y navegación
  const { register, isAuthenticated, isLoading } = useAuth();
  
  // Estado local para manejo de errores específicos
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('CO');

  // Configuración del formulario con react-hook-form y validación Zod
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "CO",
      phone: "",
      documentType: "",
      documentNumber: "",
      state: "",
      city: "",
      postalCode: "",
      birthDate: "",
      gender: ""
    },
    mode: "onChange" // Validación en tiempo real
  });

  // Obtener información del país seleccionado
  const countryInfo = SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry);
  
  // Filtrar tipos de documento según el país
  const availableDocumentTypes = DOCUMENT_TYPES.filter(
    doc => doc.country === selectedCountry || doc.country === 'INTERNATIONAL'
  );

  /**
   * Maneja el cambio de país
   */
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    form.setValue('country', countryCode);
    form.setValue('documentType', ''); // Reset document type when country changes
    form.setValue('documentNumber', ''); // Reset document number
  };

  /**
   * Validación personalizada de teléfono según país
   */
  const validatePhoneForCountry = (phone: string) => {
    return validateInternationalPhone(phone, selectedCountry);
  };

  /**
   * Validación personalizada de documento según país y tipo
   */
  const validateDocumentForCountry = (documentNumber: string, documentType: string) => {
    return validateInternationalDocument(documentNumber, documentType, selectedCountry);
  };

  /**
   * Maneja el envío del formulario
   * Procesa los datos y llama al servicio de registro
   * 
   * @param {RegisterFormData} values - Datos del formulario validados
   */
  const onSubmit = async (values: RegisterFormData) => {
    try {
      setSubmitError(null);
      
      // Validaciones adicionales específicas por país
      if (!validatePhoneForCountry(values.phone)) {
        setSubmitError(`Formato de teléfono inválido para ${countryInfo?.name || selectedCountry}`);
        return;
      }
      
      if (!validateDocumentForCountry(values.documentNumber, values.documentType)) {
        setSubmitError(`Número de documento inválido para el tipo seleccionado en ${countryInfo?.name || selectedCountry}`);
        return;
      }
      
      console.log('Iniciando proceso de registro internacional con datos:', {
        ...values,
        password: '[OCULTA]',
        confirmPassword: '[OCULTA]'
      });
      
      // Preparar metadatos adicionales para Supabase
      const metadata = {
        phone: values.phone,
        country: values.country,
        document_type: values.documentType,
        document_number: values.documentNumber,
        state: values.state,
        city: values.city,
        postal_code: values.postalCode || null,
        birth_date: values.birthDate || null,
        gender: values.gender || null,
        locale: countryInfo?.locale || 'es-CO',
        currency: countryInfo?.currency || 'COP',
        time_zone: countryInfo?.timeZone || 'America/Bogota'
      };
      
      // Llamar al servicio de registro
      await register(values.name, values.email, values.password, metadata);
      
      console.log('Registro internacional completado exitosamente');
    } catch (error: any) {
      console.error("Error durante el registro:", error);
      setSubmitError(error.message || 'Error inesperado durante el registro');
    }
  };

  // Redirigir si el usuario ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl shadow-xl">
        {/* Encabezado del formulario */}
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Globe className="h-6 w-6" />
            Crear Cuenta Internacional
          </CardTitle>
          <CardDescription className="text-green-100">
            Únete a TransporegistrosPlus desde cualquier país
          </CardDescription>
        </CardHeader>

        {/* Contenido del formulario */}
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Sección: Selección de País */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  País y Región
                </h3>
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">País *</FormLabel>
                      <Select 
                        onValueChange={handleCountryChange} 
                        defaultValue={field.value} 
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                            <SelectValue placeholder="Selecciona tu país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUPPORTED_COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({country.currency})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {countryInfo && (
                        <p className="text-sm text-gray-500 mt-1">
                          Moneda: {countryInfo.currency} | Zona horaria: {countryInfo.timeZone}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Sección: Datos Personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Datos Personales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre completo */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Nombre Completo *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="Ingresa tu nombre completo" 
                              {...field} 
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha de nacimiento */}
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Fecha de Nacimiento</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="date" 
                              {...field} 
                              disabled={isLoading}
                              max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de documento */}
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Tipo de Documento *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                              <SelectValue placeholder="Selecciona tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDocumentTypes.map((type) => (
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

                  {/* Número de documento */}
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Número de Documento *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="Número de documento" 
                              {...field} 
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Género */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Género</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500">
                            <SelectValue placeholder="Selecciona tu género (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER_OPTIONS.map((gender) => (
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

              {/* Sección: Información de Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Información de Contacto
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Correo Electrónico *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="email" 
                              placeholder="tu@ejemplo.com" 
                              {...field} 
                              autoComplete="email"
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teléfono */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Teléfono *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="tel" 
                              placeholder={countryInfo ? `Ej: ${countryInfo.phonePrefix}1234567890` : "Número de teléfono"} 
                              {...field} 
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        {countryInfo && (
                          <p className="text-sm text-gray-500 mt-1">
                            Formato: {countryInfo.phonePrefix} + número local
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Estado/Provincia */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Estado/Provincia *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="Estado o provincia" 
                              {...field} 
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ciudad */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Ciudad *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="Tu ciudad" 
                              {...field} 
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Código postal */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Código Postal</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Código postal" 
                            {...field} 
                            disabled={isLoading}
                            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Sección: Seguridad */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Configuración de Seguridad
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contraseña */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Contraseña *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              autoComplete="new-password"
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirmar contraseña */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Confirmar Contraseña *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              autoComplete="new-password"
                              disabled={isLoading}
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Mostrar errores de envío si existen */}
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {/* Botón de registro */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                disabled={isLoading}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Crear Cuenta Internacional
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* Pie del formulario */}
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <div className="text-center text-sm text-gray-600 w-full">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
