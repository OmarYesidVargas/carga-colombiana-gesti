
import React from 'react';
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
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { Expense, Trip, Vehicle } from '@/types';

/**
 * Props para el componente de diálogos de gastos
 */
interface ExpenseDialogsProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  currentExpense: Expense | null;
  trips: Trip[];
  vehicles: Vehicle[];
  isSubmitting: boolean;
  onFormSubmit: (data: any) => Promise<void>;
  onCloseForm: () => void;
  onConfirmDelete: () => Promise<void>;
}

/**
 * Componente que contiene los diálogos para crear/editar y eliminar gastos
 */
const ExpenseDialogs: React.FC<ExpenseDialogsProps> = ({
  isFormOpen,
  setIsFormOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  currentExpense,
  trips,
  vehicles,
  isSubmitting,
  onFormSubmit,
  onCloseForm,
  onConfirmDelete
}) => {
  return (
    <>
      {/* Diálogo de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentExpense ? 'Editar Gasto' : 'Agregar Gasto'}
            </DialogTitle>
            <DialogDescription>
              {currentExpense 
                ? 'Modifica los detalles del gasto seleccionado.' 
                : 'Registra un nuevo gasto para un viaje.'}
            </DialogDescription>
          </DialogHeader>
          
          <ExpenseForm
            initialData={currentExpense || undefined}
            trips={trips}
            vehicles={vehicles}
            onSubmit={onFormSubmit}
            onCancel={onCloseForm}
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
              Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseDialogs;
