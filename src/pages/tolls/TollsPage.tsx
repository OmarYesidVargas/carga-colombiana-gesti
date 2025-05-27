
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Filter, MapPin, Route, Calculator } from 'lucide-react';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tollToDelete, setTollToDelete] = useState<string | null>(null);
  const [currentToll, setCurrentToll] = useState<Toll | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Obtener rutas únicas
  const uniqueRoutes = Array.from(new Set(tolls.map(toll => toll.route))).sort();
  
  // Obtener categorías únicas
  const uniqueCategories = Array.from(new Set(tolls.map(toll => toll.category))).sort();
  
  // Función para filtrar peajes
  const filteredTolls = tolls.filter((toll) => {
    const matchesSearch = 
      toll.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      toll.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
      toll.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoute = selectedRoute === 'all' || toll.route === selectedRoute;
    const matchesCategory = selectedCategory === 'all' || toll.category === selectedCategory;
    
    return matchesSearch && matchesRoute && matchesCategory;
  });
  
  // Calcular estadísticas
  const totalTolls = tolls.length;
  const totalRoutes = uniqueRoutes.length;
  const averagePrice = tolls.length > 0 ? tolls.reduce((sum, toll) => sum + toll.price, 0) / tolls.length : 0;
  const mostExpensive = tolls.length > 0 ? Math.max(...tolls.map(toll => toll.price)) : 0;
  
  // Categorizar peajes por ruta
  const tollsByRoute = React.useMemo(() => {
    const result: Record<string, Toll[]> = {};
    
    filteredTolls.forEach((toll) => {
      if (!result[toll.route]) {
        result[toll.route] = [];
      }
      result[toll.route].push(toll);
    });
    
    return Object.entries(result)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([route, tolls]) => ({
        route,
        tolls: tolls.sort((a, b) => a.name.localeCompare(b.name))
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Peajes</h1>
            <p className="text-violet-100 mt-2">
              Administra los peajes de las rutas más frecuentes
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{totalTolls} peajes registrados</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4" />
                <span>{totalRoutes} rutas activas</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Promedio: {formatCurrency(averagePrice)}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => handleOpenForm()} 
            className="bg-white text-violet-600 hover:bg-violet-50 font-semibold shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" /> 
            Agregar Peaje
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral de resumen */}
        <div className="lg:col-span-1 space-y-6">
          <TollSummary 
            tollRecords={tollRecords} 
            tolls={tolls}
            vehicles={vehicles}
            trips={trips}
          />
          
          {/* Estadísticas adicionales */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total peajes</span>
                  <span className="font-semibold text-violet-600">{totalTolls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rutas únicas</span>
                  <span className="font-semibold text-violet-600">{totalRoutes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precio promedio</span>
                  <span className="font-semibold text-violet-600">{formatCurrency(averagePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Más costoso</span>
                  <span className="font-semibold text-violet-600">{formatCurrency(mostExpensive)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contenido principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Barra de búsqueda y filtros */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar peajes por nombre, ubicación o ruta..."
                    className="pl-10 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las rutas</SelectItem>
                      {uniqueRoutes.map((route) => (
                        <SelectItem key={route} value={route}>{route}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Lista de peajes */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-gray-200 px-6 pt-4">
                <TabsList className="bg-gray-100">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                  >
                    Todos ({filteredTolls.length})
                  </TabsTrigger>
                  {tollsByRoute.slice(0, 3).map((routeData) => (
                    <TabsTrigger 
                      key={routeData.route} 
                      value={routeData.route}
                      className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                    >
                      {routeData.route} ({routeData.tolls.length})
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
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No se encontraron peajes
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || selectedRoute !== 'all' || selectedCategory !== 'all'
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'Agrega tu primer peaje para comenzar'
                        }
                      </p>
                      <Button 
                        onClick={() => handleOpenForm()} 
                        className="bg-violet-500 hover:bg-violet-600 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" /> 
                        Agregar Peaje
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {tollsByRoute.map((routeData) => (
                  <TabsContent key={routeData.route} value={routeData.route} className="mt-0">
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900">Ruta: {routeData.route}</h3>
                      <p className="text-sm text-gray-600">
                        {routeData.tolls.length} peajes en esta ruta
                      </p>
                    </div>
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
