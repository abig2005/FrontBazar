import { JwtService } from './../../../../shared/service/jwt.service';
// Angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {

  jwtService= inject(JwtService)
  router= inject(Router);

  cerrarSesion() {
    this.jwtService.eliminarToken();
    this.router.navigate(['/login']);
  }

}
