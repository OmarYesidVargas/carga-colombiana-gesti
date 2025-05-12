
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Send } from 'lucide-react';

// Esquema de validación para el formulario
const formSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  // Esta función simula una solicitud de restablecimiento de contraseña
  const handleSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulación de envío (en una app real, esto sería una llamada a la API)
    setTimeout(() => {
      toast.success('Se ha enviado un enlace de restablecimiento a tu correo.');
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p className="font-medium">¡Correo enviado!</p>
                <p className="text-sm mt-2">
                  Hemos enviado un enlace de recuperación a tu correo electrónico.
                  Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
                </p>
              </div>
              
              <Link to="/login">
                <Button variant="outline" className="mt-4 w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Iniciar sesión
                </Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="tu@correo.com" 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">○</span> 
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" /> 
                      Enviar instrucciones
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        
        {!submitted && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              <Link 
                to="/login" 
                className="text-primary font-medium hover:underline"
              >
                Volver a Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
