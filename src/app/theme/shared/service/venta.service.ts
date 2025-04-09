import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
    private baseUrl = 'http://localhost:3000/api/venta'; 

  constructor(private http: HttpClient) {}

  // Listar todas las ventas
  listarVentas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  listarVentasPorUsuario(cveUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuario/${cveUsuario}`); 
  }

  // Insertar una nueva venta
  insertarVenta(venta: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, venta);
  }

  cambiarEstadoVenta(cveVenta: number, nuevoEstado: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveVenta}/estado/${nuevoEstado}`, {});
  }

}