
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
 * Props for the expense dialogs component
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
 * Component that contains dialogs for creating/editing and deleting expenses
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
      {/* Form dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[calc(100%-2rem)] sm:w-auto">
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
      
      {/* Confirmation dialog for deletion */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[calc(100%-2rem)] sm:w-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El gasto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
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
