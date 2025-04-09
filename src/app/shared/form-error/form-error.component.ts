import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-form-error',
  imports: [CommonModule],
  template: `
    <small class="text-danger" *ngIf="control?.touched && control?.errors">
      <ng-container *ngIf="control.errors['required']">Este campo es obligatorio.</ng-container>
      <ng-container *ngIf="control.errors['min']">El valor debe ser mayor o igual a {{ control.errors['min'].min }}.</ng-container>
      <ng-container *ngIf="control.errors['maxlength']">El valor excede el máximo de {{ control.errors['maxlength'].requiredLength }} caracteres.</ng-container>
      <ng-container *ngIf="control.errors['pattern']">El formato no es válido.</ng-container>
    </small>
  `,
  styleUrls: ['./form-error.component.scss']
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
}