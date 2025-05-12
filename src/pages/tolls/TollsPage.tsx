
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TollCard from '@/components/tolls/TollCard';
import TollForm from '@/components/tolls/TollForm';
import TollSummary from '@/components/tolls/TollSummary';
import { Toll } from '@/types';

const TollsPage = () => {
  const { tolls, tollRecords, trips, vehicles, addToll, updateToll, deleteToll } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tollToDelete, setTollToDelete] = useState<string | null>(null);
  const [currentToll, setCurrentToll] = useState<Toll | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Función para filtrar peajes
  const filteredTolls = tolls.filter((toll) => {
    const matchesSearch = 
      toll.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      toll.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
      toll.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Categorizar peajes por ruta
  const tollsByRoute = React.useMemo(() => {
    const result: Record<string, Toll[]> = {};
    
    filteredTolls.forEach((toll) => {
      if (!result[toll.route]) {
        result[toll.route] = [];
      }
      result[toll.route].push(toll);
    });
    
    // Ordenar las rutas por cantidad de peajes
    return Object.entries(result)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([route, tolls]) => ({
        route,
        tolls
      }));
  }, [filteredTolls]);
  
  const handleOpenForm = (toll?: Toll) => {
    if (toll) {
      setCurrentToll(toll);
    } else {
      setCurrentToll(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentToll(null);
  };
  
  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Convertir price a número
      data.price = parseFloat(data.price);
      
      if (currentToll) {
        updateToll(currentToll.id, data);
      } else {
        addToll(data);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar peaje:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (tollId: string) => {
    setTollToDelete(tollId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (tollToDelete) {
      deleteToll(tollToDelete);
      setIsDeleteDialogOpen(false);
      setTollToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Peajes</h1>
          <p className="text-muted-foreground">
            Administra los peajes de las rutas más frecuentes
          </p>
        </div>
        
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" /> 
          Agregar Peaje
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Resumen de peajes */}
        <div className="md:col-span-1">
          <TollSummary 
            tollRecords={tollRecords} 
            tolls={tolls}
            vehicles={vehicles}
            trips={trips}
          />
        </div>
        
        {/* Lista de peajes */}
        <div className="md:col-span-3 space-y-4">
          {/* Búsqueda */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar peajes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Pestañas por ruta o lista completa */}
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos los peajes</TabsTrigger>
              {tollsByRoute.slice(0, 3).map((routeData) => (
                <TabsTrigger key={routeData.route} value={routeData.route}>
                  {routeData.route}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              {filteredTolls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTolls.map((toll) => (
                    <TollCard
                      key={toll.id}
                      toll={toll}
                      onEdit={handleOpenForm}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">
                      No se encontraron peajes. Agrega tu primer peaje para comenzar.
                    </p>
                    <Button 
                      onClick={() => handleOpenForm()} 
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" /> 
                      Agregar Peaje
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {tollsByRoute.map((routeData) => (
              <TabsContent key={routeData.route} value={routeData.route}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {routeData.tolls.map((toll) => (
                    <TollCard
                      key={toll.id}
                      toll={toll}
                      onEdit={handleOpenForm}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentToll ? 'Editar Peaje' : 'Agregar Peaje'}
            </DialogTitle>
            <DialogDescription>
              {currentToll 
                ? 'Modifica los detalles del peaje seleccionado.' 
                : 'Registra un nuevo peaje para tus rutas frecuentes.'}
            </DialogDescription>
          </DialogHeader>
          
          <TollForm
            initialData={currentToll || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El peaje será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TollsPage;
