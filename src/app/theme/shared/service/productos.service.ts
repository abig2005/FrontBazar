import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private baseUrl = 'http://localhost:3000/api/producto'; // Reemplaza <tu-servidor> con la URL de tu backend
  private http: HttpClient;

  constructor(private injector: Injector) {
    // Lazily resolve HttpClient to avoid circular dependency
    this.http = this.injector.get(HttpClient);
  }


  // Obtener todos los productos
  listarProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

    // Obtener todos los productos
    listarProductosPorCategoria(cveCategoria: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/categoria/${cveCategoria}`);
  
    }


   // Insertar un nuevo producto
   insertarProducto(producto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, producto);
  }

  // Actualizar un producto
  actualizarProducto(cveProducto: number, producto: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveProducto}`, producto);
  }

  // Eliminar un producto
  eliminarProducto(cveProducto: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${cveProducto}`);
  }

  // Cambiar el estatus de un producto
  cambiarEstatus(cveProducto: number, estatus: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveProducto}/${estatus}`, {});
  }

  // Autocompletar productos
  autocomplete(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/autocomplete`, { params: { q: query } });
  }

  // Subir una imagen para un producto
  subirImagen(cveProducto: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/${cveProducto}/imagen`, formData);
  }

  // Obtener la imagen de un producto
  obtenerImagen(cveProducto: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${cveProducto}/imagen`, { responseType: 'blob' });
  }

}