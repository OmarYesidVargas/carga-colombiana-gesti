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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peajes</h1>
          <p className="text-gray-600 mt-1">
            Administra los peajes de las rutas más frecuentes
          </p>
        </div>
        
        <Button onClick={() => handleOpenForm()} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> 
          Agregar Peaje
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Resumen de peajes */}
        <div className="lg:col-span-1">
          <TollSummary 
            tollRecords={tollRecords} 
            tolls={tolls}
            vehicles={vehicles}
            trips={trips}
          />
        </div>
        
        {/* Lista de peajes */}
        <div className="lg:col-span-3 space-y-6">
          {/* Búsqueda */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar peajes..."
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Pestañas por ruta o lista completa */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-gray-200 px-6 pt-4">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Todos los peajes
                  </TabsTrigger>
                  {tollsByRoute.slice(0, 3).map((routeData) => (
                    <TabsTrigger 
                      key={routeData.route} 
                      value={routeData.route}
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      {routeData.route}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="all" className="mt-0">
                  {filteredTolls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        No se encontraron peajes. Agrega tu primer peaje para comenzar.
                      </p>
                      <Button 
                        onClick={() => handleOpenForm()} 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" /> 
                        Agregar Peaje
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {tollsByRoute.map((routeData) => (
                  <TabsContent key={routeData.route} value={routeData.route} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {currentToll ? 'Editar Peaje' : 'Agregar Peaje'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
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
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Esta acción no se puede deshacer. El peaje será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
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
