/**
 * TollsPage Component
 * 
 * Página principal para la gestión de peajes que incluye:
 * - Listado de peajes
 * - Filtros de búsqueda
 * - Creación y edición de peajes
 * - Estadísticas básicas
 * 
 * @author OmarYesidVargas
 * @version 2.0.0
 * @lastModified 2025-05-28 17:30:00
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, MapPin, Navigation, Calculator, Filter } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TollCard } from '@/components/tolls/TollCard';
import { useToast } from '@/components/ui/use-toast';
import { Toll } from '@/types';
import { TollForm } from '@/components/tolls/TollForm';
import { useTolls } from '@/hooks/useTolls';
import { formatCurrency } from '@/lib/utils';

/**
 * Interfaz para los filtros de búsqueda
 */
interface TollFilters {
  search: string;
  category?: string;
  status?: string;
}

/**
 * Componente TollsPage
 * @returns {JSX.Element} Página de gestión de peajes
 */
const TollsPage: React.FC = () => {
  const { toast } = useToast();
  const { tolls, isLoading, error, createToll, updateToll, deleteToll } = useTolls();
  const [filters, setFilters] = useState<TollFilters>({ search: '' });
  const [showForm, setShowForm] = useState(false);
  const [selectedToll, setSelectedToll] = useState<Toll | null>(null);

  /**
   * Calcula las estadísticas de los peajes
   */
  const stats = {
    total: tolls.length,
    active: tolls.filter(t => t.estado === 'activo').length,
    averageTariff: tolls.reduce((acc, t) => acc + t.tarifa, 0) / tolls.length || 0
  };

  /**
   * Filtra los peajes según los criterios de búsqueda
   */
  const filteredTolls = tolls.filter(toll => {
    const matchesSearch = toll.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                         toll.ubicacion.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || toll.categoria === filters.category;
    const matchesStatus = !filters.status || toll.estado === filters.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  /**
   * Maneja la creación o actualización de un peaje
   */
  const handleSubmit = async (data: Toll) => {
    try {
      if (selectedToll) {
        await updateToll(data);
        toast({
          title: "Peaje actualizado",
          description: "El peaje se ha actualizado correctamente."
        });
      } else {
        await createToll(data);
        toast({
          title: "Peaje creado",
          description: "El nuevo peaje se ha creado correctamente."
        });
      }
      setShowForm(false);
      setSelectedToll(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la operación.",
        variant: "destructive"
      });
    }
  };

  /**
   * Maneja la eliminación de un peaje
   */
  const handleDelete = async (toll: Toll) => {
    if (window.confirm(`¿Está seguro de eliminar el peaje ${toll.nombre}?`)) {
      try {
        await deleteToll(toll.id);
        toast({
          title: "Peaje eliminado",
          description: "El peaje se ha eliminado correctamente."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar el peaje.",
          variant: "destructive"
        });
      }
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error al cargar los peajes: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header y Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Peajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Peajes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.active}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Tarifa Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {formatCurrency(stats.averageTariff)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar peajes..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilters({ search: '' })}>
                Limpiar filtros
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'activo' }))}>
                Solo activos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, status: 'inactivo' }))}>
                Solo inactivos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedToll(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Peaje
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedToll ? 'Editar Peaje' : 'Nuevo Peaje'}
              </DialogTitle>
              <DialogDescription>
                {selectedToll 
                  ? 'Actualice los datos del peaje seleccionado.' 
                  : 'Complete el formulario para crear un nuevo peaje.'}
              </DialogDescription>
            </DialogHeader>
            <TollForm
              toll={selectedToll}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedToll(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de peajes */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTolls.map((toll) => (
            <TollCard
              key={toll.id}
              toll={toll}
              onEdit={(toll) => {
                setSelectedToll(toll);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
          {filteredTolls.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No se encontraron peajes que coincidan con los criterios de búsqueda.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TollsPage;
