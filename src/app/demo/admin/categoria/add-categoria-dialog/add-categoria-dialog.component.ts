import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormComponent } from 'src/app/shared/dynamic-form/dynamic-form.component';
import { CategoriaService } from 'src/app/theme/shared/service/categoria.service';

@Component({
  selector: 'app-add-categoria-dialog',
  imports: [DynamicFormComponent],
  templateUrl: './add-categoria-dialog.component.html',
  styleUrl: './add-categoria-dialog.component.scss'
})
export class AddCategoriaDialogComponent {

  categoriaForm: FormGroup;

  titulo: string = ''; // Título del modal
  categoria: any; // categoria recibido para editar

  fields: any[] = []; // Configuración de los campos

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private categoriaService: CategoriaService, // Inyectar el servicio de categorías
  ) {}
 ngOnInit(): void {
    // Inicializar el formulario
    this.categoriaForm = this.fb.group({
      cveCategoria: [this.categoria?.cveCategoria || ''],
      descripcion: [this.categoria?.descripcion || '', Validators.required],
      activo: [this.categoria?.activo ?? true]
    });

        // Configuración de los campos
    this.fields = [
      { name: 'descripcion', type: 'input', label: 'Nombre', placeholder: 'Ingrese el nombre', inputType: 'text' },
    ];

    console.log('categoria recibido:', this.categoria);
    if(this.categoria?.cveCategoria !=null) {
      this.titulo = 'Editar categoria'; // Cambiar el título si se está editando un categoria
    }else{
      this.titulo = 'Agregar categoria'; // Cambiar el título si se está agregando un nuevo categoria
    }


  }
  

  save(): void {
    if (this.categoriaForm.valid) {
      const formValue = { ...this.categoriaForm.value };
  
      // Convertir cveCategoria a número
      formValue.cveCategoria = +formValue.cveCategoria;

      console.log('Formulario válido:', formValue);
      this.activeModal.close(formValue); // Devuelve los datos del formulario

    }
  }

  cancel(): void {
    this.activeModal.dismiss(); // Cierra el modal sin devolver datos
  }


}
