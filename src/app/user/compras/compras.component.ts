import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { JwtService } from 'src/app/theme/shared/service/jwt.service';
import { VentaService } from 'src/app/theme/shared/service/venta.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-compras',
  imports: [SharedModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.scss'
})
export class ComprasComponent {

  displayedColumns: string[] = ['cveVenta', 'totalVenta', 'fechaVenta', 'estado', 'expand'];
  dataSource = new MatTableDataSource<any>();
  expandedElement: any | null = null;
  cveUsuario:number;


  constructor(private ventaService: VentaService,
    private  jwtService: JwtService
  ) {
    this.cveUsuario = this.jwtService.obtenerCveUsuario(); // Obtiene el ID del usuario desde el token JWT

  }

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.ventaService.listarVentasPorUsuario(this.cveUsuario).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  toggle(row: any): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calcularSubtotal(detalles: any[]): number {
    return detalles.reduce((subtotal, detalle) => {
      return subtotal + (detalle.cantidad * detalle.precioProducto);
    }, 0);
  }

}
