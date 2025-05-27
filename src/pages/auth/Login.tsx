
import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from '@/context/AuthContext';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mail, Lock } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa una dirección de correo válida.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Obtener la ruta desde donde vino el usuario
  const from = location.state?.from || '/dashboard';

  console.log('Login - estado actual:', { isAuthenticated, isLoading, from });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Intentando iniciar sesión...');
      await login(values.email, values.password);
      console.log('Login exitoso');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Si el usuario ya está autenticado, redirigir
  if (isAuthenticated) {
    console.log('Usuario autenticado, redirigiendo a:', from);
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-blue-100">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Correo electrónico</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="email" 
                          placeholder="tu@ejemplo.com" 
                          {...field} 
                          autoComplete="email"
                          disabled={isLoading}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700">Contraseña</FormLabel>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          autoComplete="current-password"
                          disabled={isLoading}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                disabled={isLoading}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Iniciar sesión
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="bg-gray-50 rounded-b-lg">
          <div className="text-center text-sm text-gray-600 w-full">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">
              Regístrate gratis
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
