import { MatTableDataSource } from '@angular/material/table';
// angular import
import { Component, inject, ViewChild } from '@angular/core';


// project import

import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { ProductosService } from 'src/app/theme/shared/service/productos.service';
import { CommonModule } from '@angular/common';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastService } from 'src/app/theme/shared/service/toast.service';
import { CategoriaService } from 'src/app/theme/shared/service/categoria.service';

@Component({
  selector: 'app-productos',
  imports: [CardComponent, CommonModule, SharedModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export default class ProductosComponent{
  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['cveProducto', 'nombre', 'descripcion', 'precio', 'cantidad', 'categoria', 'imagen', 'acciones'];

  // Datos de ejemplo para la tabla
  dataSource= new MatTableDataSource([]); // Inicializar dataSource como un nuevo MatTableDataSource vacío
  productos: any[] = [];
  categorias: any[] = [];
  categoriaSeleccionada: number | null = null;


  imagenSeleccionada: string | null = null; // Variable para almacenar la imagen seleccionada

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

    toastService = inject(ToastService);
    
  paginatedData: any[] = []; // Datos de la página actual

      // Configuración de la paginación
  pageSize: number = 6;
  pageIndex: number = 0;
  length: number = 0; // Total de productos

  // Inyección del servicio en el constructor
  constructor(private productosService: ProductosService,
    private modalService: NgbModal,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.getProductos();
    this.cargarCategorias();

      // Configurar el filtro personalizado
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const filterValue = filter.trim().toLowerCase();
    return (
      data.nombre.toLowerCase().includes(filterValue) || // Filtrar por nombre
      data.descripcion.toLowerCase().includes(filterValue) || // Filtrar por descripción
      data.categoria.descripcion.toLowerCase().includes(filterValue) // Filtrar por categoría
    );
  };

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.updatePaginatedData();
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategoriasActivas().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  // Consumir service
  getProductos() {
    console.log('Obteniendo productos...');
  
    this.productosService.listarProductos().subscribe({
      next: (response) => {
        console.log('Productos:', response);
  
        // Convertir las imágenes al formato Base64 si es necesario
        this.dataSource.data = response.map((producto: any) => {
          if (producto.imagen) {
            if (typeof producto.imagen === 'string' && producto.imagen.startsWith('data:image')) {
              // Si la imagen ya está en formato Base64, no hacer nada
              console.log('La imagen ya está en formato Base64:', producto.imagen);
            } else if (producto.imagen.data && Array.isArray(producto.imagen.data)) {
              // Si la imagen está en formato Buffer, convertirla a Base64
              try {
                console.log('Convirtiendo imagen desde Buffer a Base64...');
                const base64String = btoa(
                  String.fromCharCode(...new Uint8Array(producto.imagen.data))
                );
                producto.imagen = `data:image/png;base64,${base64String}`; // Ajusta el tipo de imagen si no es PNG
              } catch (error) {
                console.error('Error al convertir la imagen a Base64:', error);
                producto.imagen = null; // Si ocurre un error, asignar null
              }
            } else {
              // Si no hay datos válidos, asignar null
              console.warn('Formato de imagen no válido:', producto.imagen);
              producto.imagen = null;
            }
          } else {
            producto.imagen = null; // Si no hay imagen, asignar null
          }
          return producto;
        });

        this.productos = this.dataSource.data; // Asigna los productos al dataSource
        this.length = this.productos.length; // Asegúrate de que este valor sea correcto

        this.updatePaginatedData(); // Inicializa con la primera página


      },
      error: (error) => {
        this.toastService.showDanger(error);

        console.error('Error al obtener productos:', error);
      },
    });
  }

  
  // Insertar producto
  insertarProducto(producto: any): void {
    this.productosService.insertarProducto(producto).subscribe({
      next: (response) => {
        console.log('Producto insertado:', response);
        this.toastService.showSuccess('Los datos se guardaron correctamente');
        // Subir la imagen si existe
        if (producto.imagen) {
          this.agregarImagen(response.cveProducto, producto.imagen);
        }
  
        // this.dataSource = [...this.dataSource, response]; 
        this.getProductos(); // Actualizar la lista de productos después de insertar
      },
      error: (error) => {
        this.toastService.showDanger(error);
        console.error('Error al insertar producto:', error);
      },
    });
  }

  // Actualizar producto
  actualizarProducto(cveProducto: number, producto: any): void {
    this.productosService.actualizarProducto(cveProducto, producto).subscribe({
      next: (response) => {
        console.log('Producto actualizado:', response);
        this.toastService.showSuccess('Los datos se actualizaron correctamente');
        // Subir la imagen si existe
        if (producto.imagen) {
          this.agregarImagen(cveProducto, producto.imagen);
        }
        response.imagen = producto.imagen; // Mantener la imagen del producto actualizado
        const index = this.dataSource.data.findIndex((p) => p.cveProducto === cveProducto);
        if (index !== -1) {
          this.dataSource[index] = response; // Actualizar el producto en la tabla
          this.dataSource.data = [...this.dataSource.data]; // Forzar la actualización de la tabla
        }
        this.getProductos();
      },
      error: (error) => {
        this.toastService.showDanger(error);
        console.error('Error al actualizar producto:', error);
      },
    });
  }

    // Eliminar producto
    eliminarProducto(cveProducto: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        this.productosService.eliminarProducto(cveProducto).subscribe({
          next: () => {
            console.log(`Producto con ID ${cveProducto} eliminado.`);
            this.toastService.showSuccess('Producto eliminado correctamente');
            this.dataSource.data = this.dataSource.data.filter((producto) => producto.cveProducto !== cveProducto); // Actualizar la tabla
          },
          error: (error) => {
            this.toastService.showDanger(error);
            console.error('Error al eliminar producto:', error);
          },
        });
      }
    }

  // Método para abrir el modal y mostrar la imagen
  verImagen(imagen: string, modalTemplate: any): void {
    this.imagenSeleccionada = imagen; // Asignar la URL de la imagen seleccionada
    this.modalService.open(modalTemplate, { size: 'sn', centered: true }); // Abrir el modal
  }

  agregarImagen(cveProducto: number, file: File): void {
    this.productosService.subirImagen(cveProducto, file).subscribe({
      next: (response) => {
        console.log('Imagen subida exitosamente:', response);
      },
      error: (error) => {
        this.toastService.showDanger(error);
        console.error('Error al subir la imagen:', error);
      },
    });
  }

  // Abrir modal para agregar o editar producto
  openProductModal(producto?: any): void {
    const modalRef = this.modalService.open(AddProductDialogComponent, { size: 'lg' });
    modalRef.componentInstance.producto = producto || {}; // Pasar el producto al modal (vacío si es nuevo)

    modalRef.result.then(
      (result) => {
        if (result) {
          if (producto) {
            // Si existe un producto, actualizar
            this.actualizarProducto(producto.cveProducto, result);
          } else {
            // Si no existe, insertar
            this.insertarProducto(result);
          }
        }
      },
      () => {
        // Modal cerrado sin guardar
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

    filtrarPorCategoria(cveCategoria: number): void {
      if (cveCategoria) {
        this.dataSource.data = this.productos.filter(producto => producto.categoria.cveCategoria === cveCategoria);
      } else {
        this.dataSource.data = this.productos; // Mostrar todos los productos si no hay categoría seleccionada
      }
    }

    updatePaginatedData(): void {
      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.productos.slice(startIndex, endIndex);
    }

    cambiarPagina(event: PageEvent): void {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    }
  


}