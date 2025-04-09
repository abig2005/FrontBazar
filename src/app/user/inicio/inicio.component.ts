import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/theme/shared/service/categoria.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-inicio',
  imports: [SharedModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  categorias: any[] = [];

  constructor(private categoriaService: CategoriaService, private router: Router) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.categoriaService.listarCategoriasActivas().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al listar categorías:', error);
      }
    });
  }

  verProductos(cveCategoria: number): void {
    this.router.navigate(['/user/productos', cveCategoria]); // Redirige a la pantalla de productos
  }

}
