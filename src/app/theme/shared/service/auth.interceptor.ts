import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtén el token (puedes obtenerlo de localStorage, sessionStorage o un servicio)
  const token = localStorage.getItem('token'); // Cambia esto según tu implementación

  // Si el token existe, clona la solicitud y agrega el encabezado Authorization
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Pasa la solicitud (modificada o no) al siguiente interceptor o al backend
  return next(authReq);
};