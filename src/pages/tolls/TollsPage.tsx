
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  
  // Obtener rutas y categorías únicas
  const uniqueRoutes = Array.from(new Set(tolls.map(toll => toll.route))).sort();
  const uniqueCategories = Array.from(new Set(tolls.map(toll => toll.category))).sort();
  
  // Filtrar peajes
  const filteredTolls = tolls.filter((toll) => {
    const matchesSearch = 
      toll.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      toll.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
      toll.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoute = selectedRoute === 'all' || toll.route === selectedRoute;
    const matchesCategory = selectedCategory === 'all' || toll.category === selectedCategory;
    
    return matchesSearch && matchesRoute && matchesCategory;
  });
  
  // Estadísticas
  const totalTolls = tolls.length;
  const totalRoutes = uniqueRoutes.length;
  const averagePrice = tolls.length > 0 ? tolls.reduce((sum, toll) => sum + toll.price, 0) / tolls.length : 0;
  const mostExpensive = tolls.length > 0 ? Math.max(...tolls.map(toll => toll.price)) : 0;
  
  const handleOpenForm = (toll?: Toll) => {
    setCurrentToll(toll || null);
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
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
        {/* Header responsive */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Gestión de Peajes
              </h1>
              <p className="text-violet-100 text-sm sm:text-base lg:text-lg">
                Administra los peajes de las rutas más frecuentes
              </p>
              
              {/* Estadísticas responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{totalTolls} peajes</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                  <Route className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{totalRoutes} rutas</span>
                </div>
                <div className="col-span-2 sm:col-span-2 flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                  <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Promedio: {formatCurrency(averagePrice)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => handleOpenForm()} 
              className="bg-white text-violet-700 hover:bg-violet-50 font-semibold px-4 sm:px-6 py-2 sm:py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto self-start"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="text-sm sm:text-base">Agregar Peaje</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Panel lateral responsive */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <TollSummary 
              tollRecords={tollRecords} 
              tolls={tolls}
              vehicles={vehicles}
              trips={trips}
            />
            
            {/* Estadísticas rápidas */}
            <Card className="bg-white/80 backdrop-blur border border-violet-100 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">Total peajes</span>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 font-semibold text-xs">
                    {totalTolls}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">Rutas únicas</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-semibold text-xs">
                    {totalRoutes}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-600">Precio promedio</span>
                  <span className="font-semibold text-emerald-600 text-xs sm:text-sm">{formatCurrency(averagePrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs sm:text-sm text-gray-600">Más costoso</span>
                  <span className="font-semibold text-orange-600 text-xs sm:text-sm">{formatCurrency(mostExpensive)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenido principal responsive */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Barra de búsqueda y filtros responsive */}
            <Card className="bg-white/90 backdrop-blur border border-violet-100 shadow-lg">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar peajes por nombre, ubicación o ruta..."
                      className="pl-10 border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white h-8 sm:h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                      <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                        <SelectTrigger className="border-violet-200 focus:border-violet-400 h-8 sm:h-9 text-sm">
                          <SelectValue placeholder="Filtrar por ruta" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-violet-200">
                          <SelectItem value="all">Todas las rutas</SelectItem>
                          {uniqueRoutes.map((route) => (
                            <SelectItem key={route} value={route} className="text-sm">{route}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="border-violet-200 focus:border-violet-400 h-8 sm:h-9 text-sm">
                        <SelectValue placeholder="Filtrar por categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-violet-200">
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {uniqueCategories.map((category) => (
                          <SelectItem key={category} value={category} className="text-sm">{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRoute('all');
                          setSelectedCategory('all');
                        }}
                        className="border-violet-200 text-violet-700 hover:bg-violet-50 h-8 sm:h-9 text-sm"
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Lista de peajes responsive */}
            <div className="bg-white/90 backdrop-blur rounded-xl border border-violet-100 shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                {filteredTolls.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                  <div className="text-center py-12 sm:py-16">
                    <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-violet-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                      <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-violet-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      No se encontraron peajes
                    </h3>
                    <p className="text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
                      {hasActiveFilters
                        ? 'Intenta ajustar los filtros de búsqueda para encontrar más resultados'
                        : 'Agrega tu primer peaje para comenzar a gestionar las tarifas de tus rutas'
                      }
                    </p>
                    <Button 
                      onClick={() => handleOpenForm()} 
                      className="bg-violet-500 hover:bg-violet-600 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto text-sm sm:text-base"
                    >
                      <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                      Agregar Peaje
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Diálogo de formulario responsive */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[600px] p-0 gap-0 mx-auto">
            <DialogHeader className="p-3 sm:p-4 pb-2 border-b">
              <DialogTitle className="text-base sm:text-lg">
                {currentToll ? 'Editar Peaje' : 'Agregar Peaje'}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {currentToll 
                  ? 'Modifica los detalles del peaje seleccionado.' 
                  : 'Registra un nuevo peaje para tus rutas frecuentes.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden px-3 sm:px-4 pb-3 sm:pb-4">
              <TollForm
                initialData={currentToll || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
                isSubmitting={isSubmitting}
              />
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de confirmación responsive */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base">¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Esta acción no se puede deshacer. El peaje será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-600"
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
