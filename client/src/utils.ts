import { toast, toastOptions } from './components/TosatifyConfig'
import { LOW_STOCK } from './components/constants/constants'
import { ShoeDTO } from './types'

interface AlertProps {
  type: 'success'| 'error' | 'warning', 
  message: string, 
  options: {}
}

export const toastAlert = ({type, message, options = {}}: AlertProps)=>{

  switch(type){
    case "success": 
      return toast.success(message, {...toastOptions, ...options })
    
    case "error":
      return toast.error(message, {...toastOptions, ...options })

    case "warning": 
      toast.warning(message, {...toastOptions, ...options })
    
  }

}

export const getRowClasses = (
  shoe: ShoeDTO,
  index: number,
  updatedShoe: ShoeDTO,
  isLowInStock: boolean
) => {
  const baseClass = index % 2 === 0 ? "bg-blue-50" : "bg-white";
  const updatedClass = shoe.id === updatedShoe?.id ? "bg-green-100" : "";
  const lowInventoryClass =
    !isLowInStock && shoe.inventory! < LOW_STOCK ? "bg-red-300 blink" : "";
  const hoverClass =
    !isLowInStock && shoe.inventory! < LOW_STOCK
      ? "hover:text-white"
      : "hover:bg-blue-100";

  return `${baseClass} ${updatedClass} ${lowInventoryClass} ${hoverClass} transition duration-300 ease-in-out`;
};
