import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrl = 'http://localhost:3000/api/categoria'; // Reemplaza <tu-servidor> con la URL de tu backend
  private http: HttpClient;

  constructor(private injector: Injector, private snackBar: MatSnackBar) {
    // Lazily resolve HttpClient to avoid circular dependency
    this.http = this.injector.get(HttpClient);
  }


  // Listar todas las categorías
  listarCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`)
    .pipe(catchError( (error) => this.handleError(error) ));
  }

  // Listar categorías activas
  listarCategoriasActivas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/activas`)
    .pipe(catchError( (error) => this.handleError(error) ));
  }

  // Insertar una nueva categoría
  insertarCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, categoria)
    .pipe(catchError( (error) => this.handleError(error) ));
  }

  // Actualizar una categoría
  actualizarCategoria(cveCategoria: number, categoria: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveCategoria}`, categoria)
    .pipe(catchError( (error) => this.handleError(error) ));
  }

  // Eliminar una categoría
  eliminarCategoria(cveCategoria: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${cveCategoria}`)
    .pipe(catchError( (error) => this.handleError(error) ));
  }

  // Cambiar el estatus de una categoría
  cambiarEstatusCategoria(cveCategoria: number, estatus: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${cveCategoria}/${estatus}`, {})
    .pipe(catchError( (error) => this.handleError(error) ));
  }

  private handleError(error: any){
    var message = "Ocurrio un error";
    if (error.error){
      if(error.error.message)message= error.error.message;
    }
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });

    return throwError(() => new Error(message));
  }

}