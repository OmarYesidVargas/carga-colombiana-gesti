
/**
 * Hook para sistema de notificaciones Toast en TransporegistrosPlus
 * 
 * Este hook proporciona una interfaz unificada para mostrar notificaciones
 * toast en la aplicación, con soporte para diferentes variantes y acciones.
 * Utiliza Radix UI Toast primitives para funcionalidad robusta.
 * 
 * Características:
 * - Soporte para múltiples variantes (default, destructive, success, warning)
 * - Límite configurable de toasts simultáneos
 * - Auto-dismiss con timeout configurable
 * - Acciones personalizables en toasts
 * - Estado reactivo con React hooks
 * 
 * @author TransporegistrosPlus Team
 * @version 1.0.0
 */

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Configuración del sistema de toasts
const TOAST_LIMIT = 1 // Máximo número de toasts simultáneos
const TOAST_REMOVE_DELAY = 1000000 // Tiempo antes de remover toast (en ms)

/**
 * Tipo extendido para toasts con propiedades adicionales
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * Tipos de acciones disponibles para el reducer
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

/**
 * Genera un ID único para cada toast
 * @returns {string} ID único basado en contador incremental
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * Tipos de acciones para el reducer de toasts
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

/**
 * Estado del sistema de toasts
 */
interface State {
  toasts: ToasterToast[]
}

// Map para gestionar timeouts de toasts
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Agrega un toast a la cola de eliminación
 * @param {string} toastId - ID del toast a eliminar
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer para gestionar el estado de toasts
 * Maneja todas las acciones relacionadas con toasts
 * 
 * @param {State} state - Estado actual
 * @param {Action} action - Acción a ejecutar
 * @returns {State} Nuevo estado
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Efectos secundarios - Podría extraerse a una acción dismissToast()
      // pero se mantiene aquí por simplicidad
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Lista de listeners para cambios de estado
const listeners: Array<(state: State) => void> = []

// Estado en memoria para persistencia
let memoryState: State = { toasts: [] }

/**
 * Dispatcher para acciones de toast
 * Actualiza el estado y notifica a todos los listeners
 * 
 * @param {Action} action - Acción a ejecutar
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

/**
 * Función principal para crear y mostrar toasts
 * 
 * @param {Toast} props - Propiedades del toast (variant por defecto es "default")
 * @returns {Object} Objeto con métodos para controlar el toast
 */
function toast({ variant = "default", ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      variant,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Hook personalizado para usar el sistema de toasts
 * Proporciona estado reactivo y funciones para gestionar toasts
 * 
 * @returns {Object} Estado actual y funciones para gestionar toasts
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
