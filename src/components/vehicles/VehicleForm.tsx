
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Car, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import DocumentUpload from './DocumentUpload';
import { useAuth } from '@/context/AuthContext';

const vehicleSchema = z.object({
  plate: z.string().min(1, 'La placa es obligatoria'),
  brand: z.string().min(1, 'La marca es obligatoria'),
  model: z.string().min(1, 'El modelo es obligatorio'),
  year: z.number().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  color: z.string().optional(),
  fuelType: z.enum(['gasolina', 'diesel', 'electrico', 'hibrido', 'gas']).optional(),
  capacity: z.string().optional(),
  soatExpiryDate: z.date().optional(),
  technoExpiryDate: z.date().optional(),
  soatInsuranceCompany: z.string().optional(),
  technoCenter: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  initialData?: Vehicle;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const { user } = useAuth();
  const [soatDocumentUrl, setSoatDocumentUrl] = useState<string | undefined>(initialData?.soatDocumentUrl);
  const [technoDocumentUrl, setTechnoDocumentUrl] = useState<string | undefined>(initialData?.technoDocumentUrl);

  console.log('🚗 VehicleForm inicializado:', {
    isEdit: !!initialData,
    vehicleId: initialData?.id,
    initialSoatUrl: initialData?.soatDocumentUrl,
    initialTechnoUrl: initialData?.technoDocumentUrl,
    currentSoatUrl: soatDocumentUrl,
    currentTechnoUrl: technoDocumentUrl
  });

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: initialData?.plate || '',
      brand: initialData?.brand || '',
      model: initialData?.model || '',
      year: initialData?.year || new Date().getFullYear(),
      color: initialData?.color || '',
      fuelType: initialData?.fuelType || undefined,
      capacity: initialData?.capacity || '',
      soatExpiryDate: initialData?.soatExpiryDate || undefined,
      technoExpiryDate: initialData?.technoExpiryDate || undefined,
      soatInsuranceCompany: initialData?.soatInsuranceCompany || '',
      technoCenter: initialData?.technoCenter || '',
    },
  });

  const handleFormSubmit = (data: VehicleFormData) => {
    console.log('📤 Enviando formulario con datos:', {
      ...data,
      soatDocumentUrl,
      technoDocumentUrl
    });

    const formDataWithDocuments = {
      ...data,
      soatDocumentUrl: soatDocumentUrl || null,
      technoDocumentUrl: technoDocumentUrl || null,
    };

    console.log('📋 URLs de documentos a enviar:', {
      soatDocumentUrl: formDataWithDocuments.soatDocumentUrl,
      technoDocumentUrl: formDataWithDocuments.technoDocumentUrl
    });

    onSubmit(formDataWithDocuments);
  };

  const handleSoatUpload = (url: string) => {
    console.log('📄 SOAT documento subido:', url);
    setSoatDocumentUrl(url);
  };

  const handleTechnoUpload = (url: string) => {
    console.log('📄 Tecnomecánica documento subido:', url);
    setTechnoDocumentUrl(url);
  };

  const handleSoatRemove = () => {
    console.log('🗑️ Removiendo documento SOAT');
    setSoatDocumentUrl(undefined);
  };

  const handleTechnoRemove = () => {
    console.log('🗑️ Removiendo documento Tecnomecánica');
    setTechnoDocumentUrl(undefined);
  };

  if (!user) {
    return <div>Usuario no autenticado</div>;
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic" className="flex items-center gap-1 text-xs sm:text-sm">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Información</span>
                  <span className="xs:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-1 text-xs sm:text-sm">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Documentación</span>
                  <span className="xs:hidden">Docs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Datos del Vehículo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="plate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Placa *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="ABC123" 
                                className="h-9"
                                {...field} 
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Año *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="2024"
                                className="h-9"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Marca *</FormLabel>
                            <FormControl>
                              <Input placeholder="Toyota" className="h-9" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Modelo *</FormLabel>
                            <FormControl>
                              <Input placeholder="Corolla" className="h-9" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Color</FormLabel>
                            <FormControl>
                              <Input placeholder="Blanco" className="h-9" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Combustible</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gasolina">Gasolina</SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="electrico">Eléctrico</SelectItem>
                                <SelectItem value="hibrido">Híbrido</SelectItem>
                                <SelectItem value="gas">Gas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel className="text-sm">Capacidad</FormLabel>
                            <FormControl>
                              <Input placeholder="5 pasajeros" className="h-9" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-4 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">SOAT</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="soatExpiryDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm">Vencimiento</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                      "w-full justify-start text-left font-normal h-9",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: es })
                                    ) : (
                                      <span>Fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="soatInsuranceCompany"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Aseguradora</FormLabel>
                            <FormControl>
                              <Input placeholder="Aseguradora" className="h-9" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DocumentUpload
                      label="Documento SOAT"
                      documentType="soat"
                      currentUrl={soatDocumentUrl}
                      vehicleId={initialData?.id}
                      userId={user.id}
                      onUploadComplete={handleSoatUpload}
                      onRemove={handleSoatRemove}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tecnomecánica</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="technoExpiryDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm">Vencimiento</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                      "w-full justify-start text-left font-normal h-9",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: es })
                                    ) : (
                                      <span>Fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="technoCenter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Centro de Revisión</FormLabel>
                            <FormControl>
                              <Input placeholder="Centro" className="h-9" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DocumentUpload
                      label="Documento Tecnomecánica"
                      documentType="techno"
                      currentUrl={technoDocumentUrl}
                      vehicleId={initialData?.id}
                      userId={user.id}
                      onUploadComplete={handleTechnoUpload}
                      onRemove={handleTechnoRemove}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-4 pt-4 border-t bg-background">
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="h-9"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-9"
              >
                {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VehicleForm;
