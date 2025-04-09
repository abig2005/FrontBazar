import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
    private baseUrl = 'http://localhost:3000/api/rol'; // Reemplaza <tu-servidor> con la URL de tu backend

  constructor(private http: HttpClient) {}

  // Listar todos los roles
  listarRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}