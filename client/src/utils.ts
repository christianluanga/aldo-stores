import { toast, toastOptions } from './components/TosatifyConfig'
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

export const isUpdatedShoe = (previousShoe: ShoeDTO, updatedShoe: ShoeDTO): boolean => {
  return Number(previousShoe.id) === updatedShoe.id && 
         Number(previousShoe.store?.id) === updatedShoe.store?.id;
};
