// angular import
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JwtService } from 'src/app/theme/shared/service/jwt.service';
import { ToastService } from 'src/app/theme/shared/service/toast.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-login',
  imports: [RouterModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {

  loginData = {
    username: '',
    password: ''
  };

  mostrarPassword: boolean = false;


  usuario: any = null;
  jwtService = inject(JwtService);
  

  constructor(private http: HttpClient, private router: Router, private toastService: ToastService) {
    this.usuario = this.jwtService.decodificarToken(localStorage.getItem('token') || '');
    if(this.usuario){
      if(this.usuario.rol.clave==1){
        this.router.navigate(['/admin/productos']); // Redirigir al dashboard o página principal
      }else{
        this.router.navigate(['/user/inicio']); // Redirigir al dashboard o página principal
      }
    }

  }

  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }


  onSubmit(): void {
    const payload = { ...this.loginData };

    this.http.post('http://localhost:3000/api/auth', payload).subscribe({
      next: (response: any) => {
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem('token', response.token); // Guardar el token en el almacenamiento local
        this.toastService.showSuccess('Inicio de sesión exitoso');
        let usuario = this.jwtService.decodificarToken(response.token);
        if(usuario.rol.clave==1){
          this.router.navigate(['/admin/productos']); // Redirigir al dashboard o página principal
        }else{
          this.router.navigate(['/user/inicio']); // Redirigir al dashboard o página principal

        }
      },
      error: (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.toastService.showDanger('Usuario o contraseña incorrectos');
      }
    });
  }

}
