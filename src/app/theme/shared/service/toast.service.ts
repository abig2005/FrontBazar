import { Injectable, TemplateRef } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: any[] = [];

    // Mostrar un toast con mensaje o plantilla
    show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
      this.toasts.push({ textOrTpl, ...options });
    }
  
    // Eliminar un toast
    remove(toast: any) {
      this.toasts = this.toasts.filter(t => t !== toast);
    }
  
    // Métodos específicos para éxito y error
    showSuccess(message: string) {
      this.show(message, { classname: 'bg-success text-light', delay: 4000 });
    }
  
    showDanger(message: string) {
      this.show(message, { classname: 'bg-danger text-light', delay: 4000 });
    }
    
}