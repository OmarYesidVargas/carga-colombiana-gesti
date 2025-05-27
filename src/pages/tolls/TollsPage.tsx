
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, MapPin, Route, Calculator, Filter } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
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

  const hasActiveFilters = searchTerm !== '' || selectedRoute !== 'all' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header Principal */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Gestión de Peajes
              </h1>
              <p className="text-violet-100 text-lg">
                Administra los peajes de las rutas más frecuentes
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                  <MapPin className="h-4 w-4" />
                  <span>{totalTolls} peajes registrados</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                  <Route className="h-4 w-4" />
                  <span>{totalRoutes} rutas activas</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                  <Calculator className="h-4 w-4" />
                  <span>Promedio: {formatCurrency(averagePrice)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => handleOpenForm()} 
              className="bg-white text-violet-700 hover:bg-violet-50 font-semibold px-6 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200 shrink-0"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" /> 
              Agregar Peaje
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Panel lateral de resumen */}
          <div className="xl:col-span-1 space-y-6">
            <TollSummary 
              tollRecords={tollRecords} 
              tolls={tolls}
              vehicles={vehicles}
              trips={trips}
            />
            
            {/* Estadísticas adicionales */}
            <Card className="bg-white/80 backdrop-blur border border-violet-100 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-violet-600" />
                  Estadísticas Rápidas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total peajes</span>
                    <Badge variant="secondary" className="bg-violet-100 text-violet-700 font-semibold">
                      {totalTolls}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Rutas únicas</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-semibold">
                      {totalRoutes}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Precio promedio</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(averagePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Más costoso</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(mostExpensive)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenido principal */}
          <div className="xl:col-span-3 space-y-6">
            {/* Barra de búsqueda y filtros */}
            <Card className="bg-white/90 backdrop-blur border border-violet-100 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar peajes por nombre, ubicación o ruta..."
                      className="pl-10 border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                        <SelectTrigger className="border-violet-200 focus:border-violet-400">
                          <SelectValue placeholder="Filtrar por ruta" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-violet-200">
                          <SelectItem value="all">Todas las rutas</SelectItem>
                          {uniqueRoutes.map((route) => (
                            <SelectItem key={route} value={route}>{route}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="border-violet-200 focus:border-violet-400">
                          <SelectValue placeholder="Filtrar por categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-violet-200">
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          {uniqueCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRoute('all');
                          setSelectedCategory('all');
                        }}
                        className="border-violet-200 text-violet-700 hover:bg-violet-50"
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Lista de peajes */}
            <div className="bg-white/90 backdrop-blur rounded-xl border border-violet-100 shadow-lg overflow-hidden">
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 pt-4">
                  <TabsList className="bg-white/80 backdrop-blur border border-violet-200">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
                    >
                      Todos ({filteredTolls.length})
                    </TabsTrigger>
                    {tollsByRoute.slice(0, 3).map((routeData) => (
                      <TabsTrigger 
                        key={routeData.route} 
                        value={routeData.route}
                        className="data-[state=active]:bg-violet-500 data-[state=active]:text-white font-medium"
                      >
                        {routeData.route} ({routeData.tolls.length})
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="all" className="mt-0">
                    {filteredTolls.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                          <MapPin className="h-12 w-12 text-violet-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          No se encontraron peajes
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          {hasActiveFilters
                            ? 'Intenta ajustar los filtros de búsqueda para encontrar más resultados'
                            : 'Agrega tu primer peaje para comenzar a gestionar las tarifas de tus rutas'
                          }
                        </p>
                        <Button 
                          onClick={() => handleOpenForm()} 
                          className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 h-auto"
                          size="lg"
                        >
                          <Plus className="mr-2 h-5 w-5" /> 
                          Agregar Peaje
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  {tollsByRoute.map((routeData) => (
                    <TabsContent key={routeData.route} value={routeData.route} className="mt-0">
                      <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                        <h3 className="font-semibold text-gray-900 text-lg">Ruta: {routeData.route}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {routeData.tolls.length} peajes en esta ruta
                        </p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
        
        {/* Diálogos */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white border border-violet-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900 text-xl">
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
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white border border-red-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Esta acción no se puede deshacer. El peaje será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
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
    </div>
  );
};

export default TollsPage;
