import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './theme/layout/usuario/usuario.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '', 
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'productos',
        loadComponent: () => import('./demo/admin/productos/productos.component').then((m) => m.default)
      },
      {
        path: 'categoria',
        loadComponent: () => import('./demo/admin/categoria/categoria.component').then((m) => m.CategoriaComponent)
      },
      {
        path: 'venta',
        loadComponent: () => import('./demo/admin/ventas/ventas.component').then((m) => m.VentasComponent)
      },
    ]
  },
  {
    path: 'user',
    component: UsuarioComponent,
    children: [
      {
        path: '',
        redirectTo: '', 
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadComponent: () => import('./user/inicio/inicio.component').then((m) => m.InicioComponent)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./user/carrito/carrito.component').then((m) => m.CarritoComponent)
      },
      {
        path: 'compras',
        loadComponent: () => import('./user/compras/compras.component').then((m) => m.ComprasComponent)
      },
      {
        path: 'productos/:cveCategoria',
        loadComponent: () => import('./user/productos/productos.component').then((m) => m.ProductosComponent)
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
