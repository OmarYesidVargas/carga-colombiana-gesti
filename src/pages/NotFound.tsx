
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader className="space-y-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-6xl font-bold">404</CardTitle>
          <CardDescription className="text-red-100 text-lg">
            Página no encontrada
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              La página que buscas no existe o ha sido movida.
            </p>
            <p className="text-sm text-gray-500">
              Ruta solicitada: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              asChild 
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al Inicio
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline"
              onClick={() => window.history.back()}
            >
              <button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
              </button>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
