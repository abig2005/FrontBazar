import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private baseUrl = 'http://localhost:3000/api/carrito'; // Reemplaza <tu-servidor> con la URL de tu backend

  constructor(private http: HttpClient) {}

  // Agregar un producto al carrito
  agregarProductoAlCarrito(carrito: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, carrito);
  }

  // Obtener el carrito de un usuario
  obtenerCarrito(cveUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${cveUsuario}`);
  }

  // Eliminar un producto del carrito
  eliminarProductoDelCarrito(cveUsuario: number, cveProducto: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${cveUsuario}/${cveProducto}`);
  }

  // Insertar productos desde el carrito a una venta
  insertarDesdeCarrito(cveUsuario: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/insertarDesdeCarrito/${cveUsuario}`, {});
  }
}