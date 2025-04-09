import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { CarritoService } from 'src/app/theme/shared/service/carrito.service';
import { JwtService } from 'src/app/theme/shared/service/jwt.service';
import { ToastService } from 'src/app/theme/shared/service/toast.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-carrito',
  imports: [SharedModule, NgxPayPalModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {

  displayedColumns: string[] = ['nombre', 'descripcion', 'cantidad', 'precio', 'subtotal', 'acciones', 'expand'];
  dataSource = new MatTableDataSource<any>();
  cveUsuario:number; // Cambia esto por el ID del usuario actual
  expandedElement: any | null = null;

  toastService = inject(ToastService);

  //Para el metodo de pago
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean = false;

  mostrarPayPal: boolean = false; // Controla la visibilidad del componente PayPal

  //Paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(private carritoService: CarritoService, private  jwtService: JwtService) {
    this.cveUsuario = this.jwtService.obtenerCveUsuario(); // Obtiene el ID del usuario desde el token JWT

    
  }

  ngOnInit(): void {
    this.cargarCarrito();
    this.initConfig();

  }

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarCarrito(): void {
    this.carritoService.obtenerCarrito(this.cveUsuario).subscribe((data) => {
      data.forEach((item: any) => {
        if (item.producto.imagen && item.producto.imagen.data) {
          item.producto.imagen = this.convertirBufferABase64(item.producto.imagen.data);
        }
      });
      this.dataSource.data = data;
    });
  }

  actualizarCantidad(item: any): void {
    const carrito = {
      cveUsuario: this.cveUsuario,
      cantidad: item.cantidad,
      cveProducto: item.producto.cveProducto
    };
    this.carritoService.agregarProductoAlCarrito(carrito).subscribe({
      next: () => {
        console.log(`Cantidad del producto ${item.producto.cveProducto} actualizada a ${item.cantidad}`);
        this.toastService.showSuccess('Cantidad actualizada correctamente');
        this.cargarCarrito();
        this.mostrarPayPal = false 
      },
      error: (error) => {
        console.error('Error al actualizar la cantidad:', error);
        this.cargarCarrito();
        this.toastService.showDanger(error.error.message || 'Error al actualizar la cantidad');
      }
    });
  }


  eliminarProducto(cveUsuario: number, cveProducto): void {
    this.carritoService.eliminarProductoDelCarrito(cveUsuario, cveProducto).subscribe(() => {
      this.cargarCarrito();
    });
  }

  toggle(row: any): void {
    console.log(row);
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  
  convertirBufferABase64(buffer: any): string {
    const binary = buffer.map((byte: number) => String.fromCharCode(byte)).join('');
    return `data:image/png;base64,${btoa(binary)}`;
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'MXN', // Moneda en pesos mexicanos
      clientId: "AYOeyCQvilLVKJGjslZfFSi_Nkl7A6OfXNarj5lS55iUcQXMhpp3AypVjAVkS_qvPcO5D415b9SnBFuN",
      createOrderOnClient: (data) => {
        const items = this.dataSource.data.map((item: any) => ({
          name: item.producto.nombre,
          quantity: item.cantidad.toString(),
          category: 'PHYSICAL_GOODS',
          unit_amount: {
            currency_code: 'MXN',
            value: item.producto.precio.toFixed(2),
          },
        }));
  
        const subtotal = this.calcularSubtotal();
        const envio = this.calcularEnvio();
        const total = subtotal + envio;
  
        return <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'MXN',
                value: total.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: 'MXN',
                    value: subtotal.toFixed(2),
                  },
                  shipping: {
                    currency_code: 'MXN',
                    value: envio.toFixed(2),
                  },
                },
              },
              items: items,
            },
          ],
        };
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - transaction completed successfully', data);
        this.showSuccess = true;
        this.toastService.showSuccess('Pago realizado con éxito.');
        this.finalizarCompra(); // Llama a un método para finalizar la compra
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.toastService.showDanger('El pago fue cancelado.');
        this.mostrarPayPal = false; // Oculta el componente PayPal
      },
      onError: err => {
        console.log('OnError', err);
        this.toastService.showDanger('Ocurrió un error durante el pago.');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  finalizarCompra(): void {
    this.carritoService.insertarDesdeCarrito(this.cveUsuario).subscribe({
      next: () => {
        this.toastService.showSuccess('Compra finalizada correctamente.');
        this.cargarCarrito(); // Limpia el carrito después de la compra
      },
      error: (error) => {
        console.error('Error al finalizar la compra:', error);
        this.toastService.showDanger('Error al finalizar la compra.');
      },
    });
  }
  
  calcularSubtotal(): number {
    return this.dataSource.data.reduce((subtotal, item) => {
      return subtotal + (item.cantidad * item.producto.precio);
    }, 0);
  }
  
  calcularTotal(): number {
    const subtotal = this.calcularSubtotal();
    const envio = this.calcularEnvio();
    return subtotal + envio;
  }

  calcularEnvio(): number {
    const subtotal = this.calcularSubtotal();
    return subtotal >= 500 ? 0 : 50; // Envío gratuito si el subtotal es mayor o igual a $500
  }

}
