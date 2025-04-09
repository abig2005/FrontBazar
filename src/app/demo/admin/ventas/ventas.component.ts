import { MatTableDataSource } from '@angular/material/table';
import { Component, inject, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VentaService } from 'src/app/theme/shared/service/venta.service';
import { ToastService } from 'src/app/theme/shared/service/toast.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ventas',
  imports: [SharedModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class VentasComponent {

  displayedColumns: string[] = ['cveVenta', 'totalVenta', 'fechaVenta', 'cveUsuario', 'estado', 'expand'];
  
  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any | null = null;

  estados: string[] = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];


    toastService = inject(ToastService);
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.getVentas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getVentas(): void {
    this.ventaService.listarVentas().subscribe({
      next: (ventas) => {
        this.dataSource.data = ventas;
      },
      error: (error) => {
        console.error('Error al obtener las ventas:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

    /** Checks whether an element is expanded. */
    isExpanded(row: any) {
      console.log('Row:', row);
      return this.expandedElement === row;
    }
  
    /** Toggles the expanded state of an element. */
    toggle(row: any) {
      this.expandedElement = this.isExpanded(row) ? null : row;
    }

  // toggleRow(row: any): void {
  //   console.log('Row clicked:', row);
  //   console.log('Expanded element:', this.expandedElement);
  //   this.expandedElement = this.expandedElement === row ? null : row;
  // }

  cambiarEstado(venta: any): void {
    const nuevoEstado = venta.estado;
    this.ventaService.cambiarEstadoVenta(venta.cveVenta, nuevoEstado).subscribe({
      next: () => {
        this.toastService.showSuccess('Estado actualizado correctamente');
      },
      error: (error) => {
        this.toastService.showDanger('Error al actualizar el estado');
        console.error('Error al actualizar el estado:', error);
      }
    });
  }

  calcularSubtotal(detalles: any[]): number {
    return detalles.reduce((subtotal, detalle) => subtotal + detalle.cantidad * detalle.precioProducto, 0);
  }

}
