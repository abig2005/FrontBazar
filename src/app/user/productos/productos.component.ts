import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/theme/shared/service/carrito.service';
import { JwtService } from 'src/app/theme/shared/service/jwt.service';
import { ProductosService } from 'src/app/theme/shared/service/productos.service';
import { ToastService } from 'src/app/theme/shared/service/toast.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-productos',
  imports: [SharedModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

  productos: any[] = [];
  productosPaginados: any[] = [];
  categoriaNombre: string = '';
  cveCategoria: number = 0;

    // Configuración de la paginación
    pageSize: number = 6;
    pageIndex: number = 0;
    length: number = 0; // Total de productos

    usuarioID: number = 0; // Cambia esto por el ID del usuario actual

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductosService,
    private carritoService: CarritoService,
    private toastService: ToastService, 
    private jwtService: JwtService
  ) {
    this.usuarioID = this.jwtService.obtenerCveUsuario(); // Obtiene el ID del usuario desde el token JWT
  }

  ngOnInit(): void {
    this.cveCategoria = +this.route.snapshot.paramMap.get('cveCategoria')!;
    this.listarProductosPorCategoria();
  }

  listarProductosPorCategoria(): void {
    this.productoService.listarProductosPorCategoria(this.cveCategoria).subscribe({
      next: (data) => {
        console.log('Productos:', data);
        this.productos = data;
        this.length = data.length; // Asegúrate de que este valor sea correcto
        if (data.length > 0) {
          this.categoriaNombre = data[0].categoriaNombre; // Asume que el backend devuelve el nombre de la categoría
        }
        this.actualizarProductosPaginados();
      },
      error: (error) => {
        console.error('Error al listar productos:', error);
      }
    });
  }
  actualizarProductosPaginados(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.productosPaginados = this.productos.slice(startIndex, endIndex);
  }

  cambiarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarProductosPaginados();
  }


  agregarAlCarrito(producto: any): void {
    const carrito = {
      cveUsuario: this.usuarioID, // Cambia esto por el ID del usuario actual
      cantidad: 1,
      cveProducto: producto.cveProducto
    };

    this.carritoService.agregarProductoAlCarrito(carrito).subscribe({
      next: () => {
        this.toastService.showSuccess('Producto agregado al carrito');
      },
      error: (error) => {
        console.error('Error al agregar al carrito:', error);
        this.toastService.showDanger('Ocurrió un error al agregar el producto al carrito');
      }
    });
  }

  mostrarImagen(imagen: any): string {
    if (imagen && imagen.data) {
      return 'data:image/jpeg;base64,' + btoa(String.fromCharCode(...new Uint8Array(imagen.data)));
    }
    return ''; // Retorna una cadena vacía si no hay imagen
  }

}
