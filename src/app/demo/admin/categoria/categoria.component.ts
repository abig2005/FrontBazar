import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriaService } from 'src/app/theme/shared/service/categoria.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategoriaDialogComponent } from './add-categoria-dialog/add-categoria-dialog.component';
import { ToastService } from 'src/app/theme/shared/service/toast.service';

@Component({
  selector: 'app-categoria',
  imports: [CardComponent, CommonModule, SharedModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaComponent {
  categorias: any[] = []; // Lista completa de categorías
  paginatedData: any[] = []; // Categorías de la página actual
  @ViewChild(MatPaginator) paginator: MatPaginator;

  toastService = inject(ToastService);

  constructor(
    private categoriaService: CategoriaService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getCategorias();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.updatePaginatedData();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.paginatedData = this.categorias.filter((categoria) =>
      categoria.descripcion.toLowerCase().includes(filterValue)
    );
  }

  getCategorias(): void {
    this.categoriaService.listarCategorias().subscribe((categorias: any[]) => {
      this.categorias = categorias;
      this.updatePaginatedData(); // Inicializa la paginación
    });
  }

  updatePaginatedData(): void {
    const pageIndex = this.paginator.pageIndex || 0;
    const pageSize = this.paginator.pageSize || 5;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.paginatedData = this.categorias.slice(startIndex, endIndex);
  }

  openCategoryModal(categoria?: any): void {
    const modalRef = this.modalService.open(AddCategoriaDialogComponent, { size: 'lg' });
    modalRef.componentInstance.categoria = categoria || {};

    modalRef.result.then(
      (result) => {
        if (result) {
          if (categoria) {
            this.actualizarCategoria(categoria.cveCategoria, result);
          } else {
            this.insertarCategoria(result);
          }
        }
      },
      () => {
        // Modal cerrado sin guardar
      }
    );
  }

  insertarCategoria(categoria: any): void {
    this.categoriaService.insertarCategoria(categoria).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Los datos se guardaron correctamente');
        this.getCategorias();
      },
      error: (error) => {
        this.toastService.showDanger(error);
        console.error('Error al insertar categoría:', error);
      }
    });
  }

  actualizarCategoria(cveCategoria: number, categoria: any): void {
    this.categoriaService.actualizarCategoria(cveCategoria, categoria).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Los datos se actualizaron correctamente');
        this.getCategorias();
      },
      error: (error) => {
        this.toastService.showDanger(error);
        console.error('Error al actualizar categoría:', error);
      }
    });
  }

  eliminarCategoria(cveCategoria: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(cveCategoria).subscribe({
        next: () => {
          this.toastService.showSuccess('Categoría eliminada correctamente');
          this.getCategorias();
        },
        error: (error) => {
          this.toastService.showDanger(error);
          console.error('Error al eliminar categoría:', error);
        }
      });
    }
  }

  cambiarEstatus(categoria: any): void {
    const { cveCategoria, activo } = categoria;
    this.categoriaService.cambiarEstatusCategoria(cveCategoria, !activo).subscribe(() => {
      this.toastService.showSuccess('Estatus actualizado correctamente');
      this.getCategorias();
    });
  }
}