import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Vehicle } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocumentUpload from './DocumentUpload';

// Esquema de validación para el formulario
const formSchema = z.object({
  plate: z.string().min(6, 'La placa debe tener al menos 6 caracteres').max(7, 'La placa no debe exceder 7 caracteres'),
  brand: z.string().min(2, 'La marca es requerida'),
  model: z.string().min(2, 'El modelo es requerido'),
  year: z.string()
    .refine(
      (val) => !isNaN(Number(val)),
      { message: 'El año debe ser un número' }
    )
    .refine(
      (val) => {
        const year = Number(val);
        return year >= 1950 && year <= new Date().getFullYear() + 1;
      },
      { message: `El año debe estar entre 1950 y ${new Date().getFullYear() + 1}` }
    ),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  capacity: z.string().optional(),
  // Nuevos campos para Colombia
  soatExpiryDate: z.string().optional(),
  technoExpiryDate: z.string().optional(),
  soatInsuranceCompany: z.string().optional(),
  technoCenter: z.string().optional(),
});

type FormData = z.infer<typeof formSchema> & {
  soatDocumentUrl?: string;
  technoDocumentUrl?: string;
};

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const fuelTypes = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'gas', label: 'Gas Natural' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'electric', label: 'Eléctrico' },
];

const colombianInsurers = [
  { value: 'sura', label: 'Seguros SURA' },
  { value: 'bolivar', label: 'Seguros Bolívar' },
  { value: 'estado', label: 'Seguros del Estado' },
  { value: 'mapfre', label: 'MAPFRE' },
  { value: 'liberty', label: 'Liberty Seguros' },
  { value: 'allianz', label: 'Allianz' },
  { value: 'axa', label: 'AXA Colpatria' },
  { value: 'previsora', label: 'La Previsora' },
  { value: 'mundial', label: 'Seguros Mundial' },
  { value: 'otros', label: 'Otros' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 74 }, (_, i) => (currentYear + 1 - i).toString());

const VehicleForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: VehicleFormProps) => {
  const { user } = useAuth();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: initialData?.plate || '',
      brand: initialData?.brand || '',
      model: initialData?.model || '',
      year: initialData?.year ? String(initialData.year) : '',
      color: initialData?.color || '',
      fuelType: initialData?.fuelType || '',
      capacity: initialData?.capacity || '',
      soatExpiryDate: initialData?.soatExpiryDate ? initialData.soatExpiryDate.toISOString().split('T')[0] : '',
      technoExpiryDate: initialData?.technoExpiryDate ? initialData.technoExpiryDate.toISOString().split('T')[0] : '',
      soatInsuranceCompany: initialData?.soatInsuranceCompany || '',
      technoCenter: initialData?.technoCenter || '',
      soatDocumentUrl: initialData?.soatDocumentUrl || '',
      technoDocumentUrl: initialData?.technoDocumentUrl || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    const submitData = {
      ...data,
      year: data.year,
      soatExpiryDate: data.soatExpiryDate ? new Date(data.soatExpiryDate) : undefined,
      technoExpiryDate: data.technoExpiryDate ? new Date(data.technoExpiryDate) : undefined,
    };
    onSubmit(submitData);
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <ScrollArea className="flex-1 max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Información básica del vehículo */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Información del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Placa *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="ABC123" 
                          className="uppercase vehicle-plate h-9"
                          maxLength={7}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Marca *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Marca" className="h-9" />
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
                          <Input {...field} placeholder="Modelo" className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Año *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Año" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
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
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Color</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Color" className="h-9" />
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fuelTypes.map((type) => (
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
                </div>
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Capacidad de Carga</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: 5 Toneladas" className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Documentación Colombia */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Documentación Colombia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* SOAT */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">SOAT</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="soatExpiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm flex items-center gap-2">
                            Vencimiento
                            {isExpired(field.value) && (
                              <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">VENCIDO</span>
                            )}
                            {isExpiringSoon(field.value) && !isExpired(field.value) && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded">PRÓXIMO</span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              className={`h-9 ${
                                isExpired(field.value) 
                                  ? "border-red-500" 
                                  : isExpiringSoon(field.value) 
                                    ? "border-yellow-500" 
                                    : ""
                              }`}
                            />
                          </FormControl>
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colombianInsurers.map((insurer) => (
                                <SelectItem key={insurer.value} value={insurer.value}>
                                  {insurer.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DocumentUpload
                    label="Documento SOAT"
                    documentType="soat"
                    currentUrl={form.watch('soatDocumentUrl')}
                    vehicleId={initialData?.id}
                    userId={user?.id || ''}
                    onUploadComplete={(url) => form.setValue('soatDocumentUrl', url)}
                    onRemove={() => form.setValue('soatDocumentUrl', '')}
                  />
                </div>

                {/* Tecnomecánica */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Tecnomecánica</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="technoExpiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm flex items-center gap-2">
                            Vencimiento
                            {isExpired(field.value) && (
                              <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">VENCIDO</span>
                            )}
                            {isExpiringSoon(field.value) && !isExpired(field.value) && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded">PRÓXIMO</span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              className={`h-9 ${
                                isExpired(field.value) 
                                  ? "border-red-500" 
                                  : isExpiringSoon(field.value) 
                                    ? "border-yellow-500" 
                                    : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="technoCenter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Centro Diagnóstico</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Centro (opcional)" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DocumentUpload
                    label="Certificado Tecnomecánica"
                    documentType="techno"
                    currentUrl={form.watch('technoDocumentUrl')}
                    vehicleId={initialData?.id}
                    userId={user?.id || ''}
                    onUploadComplete={(url) => form.setValue('technoDocumentUrl', url)}
                    onRemove={() => form.setValue('technoDocumentUrl', '')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {initialData?.id ? 'Actualizar' : 'Guardar'} Vehículo
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default VehicleForm;
