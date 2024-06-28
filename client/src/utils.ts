import { toast, toastOptions } from './components/TosatifyConfig'

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

export const shoeMatched = ({
  shoeId,
  updatedShoeId,
  shoeStoreId,
  updatedShoeStoreId,
}: {
  shoeId: number;
  updatedShoeId: number;
  shoeStoreId: number;
  updatedShoeStoreId: number;
}): boolean => {
  return Number(shoeId) === Number(updatedShoeId) && Number(shoeStoreId) === Number(updatedShoeStoreId);
};
