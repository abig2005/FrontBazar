import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private readonly tokenKey = 'token'; // Clave para almacenar el token en localStorage

  constructor() {}

  /**
   * Guarda el token en localStorage
   * @param token El token JWT a guardar
   */
  guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token desde localStorage
   * @returns El token JWT o null si no existe
   */
  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Elimina el token de localStorage
   */
  eliminarToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Verifica si el token existe en localStorage
   * @returns true si el token existe, false en caso contrario
   */
  existeToken(): boolean {
    return !!this.obtenerToken();
  }

  /**
   * Decodifica el token JWT (si es necesario)
   * @param token El token JWT a decodificar
   * @returns Un objeto con los datos decodificados o null si el token no es válido
   */
  decodificarToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  /**
   * Obtiene los datos decodificados del token almacenado
   * @returns Un objeto con los datos del token o null si no hay token
   */
  obtenerDatosToken(): any {
    const token = this.obtenerToken();
    return token ? this.decodificarToken(token) : null;
  }

  obtenerCveUsuario(): number | null {
    const datosToken = this.obtenerDatosToken();
    return datosToken ? datosToken.cveUsuario : null;
  }

}