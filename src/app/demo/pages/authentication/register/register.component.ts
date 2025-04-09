import { ToastService } from './../../../../theme/shared/service/toast.service';
// angular import
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register',
  imports: [RouterModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  registerForm: FormGroup;
  mostrarPassword: boolean = false;
loginForm: any;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      username: ['', [
        Validators.required,
        Validators.pattern('^[^\\s]+$') // Validación para evitar espacios
      ]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Z])(?=.*\\d).+$') // Al menos 1 mayúscula y 1 número
        ]
      ],
      confirmPassword: ['', Validators.required],
      cveRol: [2], // Valor fijo para el rol
      direccion: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    });
  }

  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  passwordsCoinciden(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }

  // Método para eliminar espacios en tiempo real
  eliminarEspacios(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorSinEspacios = input.value.replace(/\s+/g, ''); // Elimina todos los espacios
    this.registerForm.get('username')?.setValue(valorSinEspacios, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.passwordsCoinciden()) {
      const payload = this.registerForm.value;
      delete payload.aceptaTerminos; // No enviar aceptaTerminos al backend
      delete payload.confirmPassword; // No enviar confirmPassword al backend

      this.http.post('http://localhost:3000/api/usuario', payload).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.toastService.showSuccess('Registro exitoso');
          this.router.navigate(['/login']); // Redirigir al login
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          this.toastService.showDanger(error.error.message || 'Error en el registro');
        }
      });
    } else {
      this.toastService.showDanger('Debes aceptar los términos y condiciones o las contraseñas no coinciden.');
    }
  }
}