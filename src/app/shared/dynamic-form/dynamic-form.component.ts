import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() formGroup!: FormGroup; // Recibe el FormGroup
  @Input() fields: any[] = []; // Recibe la configuración de los campos
}
