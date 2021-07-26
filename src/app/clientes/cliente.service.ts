import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Cliente } from './cliente';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Paises } from '../enum/paises.enum';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndpoint:string = 'http://191.96.42.214:8087/api';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(private http:HttpClient,private router:Router,private authService:AuthService) { }
  //se agrega el metodo en los observables con token
  private agregarAuthorization(){
    let token =this.authService.token;
    if(token != null){
        return this.httpHeaders.append('Authorization','Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAuthorizado(e):boolean{
      if(e.status == 401){
        if(this.authService.isAuthenticated()){
          this.authService.logout();
        }
        this.router.navigate(['/login']);
        return true;
      }
      if(e.status == 403){
        swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso  a este recurso!`,'warning');
        this.router.navigate(['/clientes'])
        return true;
      }
      return false;
  }

  create(cliente:Cliente,cerSeleccionada,keySeleccionada,fotoSeleccionada):Observable<HttpEvent<{}>>{
    const formData = new FormData();
    let json = JSON.stringify(cliente);
    const blob = new Blob([json], {
        type: 'application/json'
        });

    formData.append("archivoCer", cerSeleccionada);
    formData.append("archivoKey",keySeleccionada);
    formData.append("logo",fotoSeleccionada);
    formData.append("cliente",blob);
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token!=null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    const req = new HttpRequest('POST', `${this.urlEndpoint}/cliente`, formData, {
      reportProgress: true,
      headers:httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e =>{
        this.isNoAuthorizado(e);
        return throwError(e);
      })
    );
  }

  getClientes(): Observable<Cliente[]> {
    let username =this.authService.usuario.username;
   return this.http.get<Cliente[]>(`${this.urlEndpoint}/cliente?username=${username}`).pipe(
     map(response => response as Cliente[])
 );
 }
 getClientesAll(): Observable<Cliente[]> {
   let username =this.authService.usuario.username;
  return this.http.get<Cliente[]>(`${this.urlEndpoint}/clientes`).pipe(
    map(response => response as Cliente[])
);
}

 getClienteById(id):Observable<Cliente>{
   return this.http.get<Cliente>(`${this.urlEndpoint}/cliente/${id}` , {headers:this.agregarAuthorization()}).pipe(
     catchError(e =>{
       if(this.isNoAuthorizado(e)){
         return throwError(e);
       }
       this.router.navigate(['/clientes']);
       console.error(e.error.mensaje);
       swal.fire('Error',e.error.mensaje,'error');
       return throwError(e);
     })
   )

 }

 deleteCliente(id:number):Observable<Cliente>{
   return this.http.delete<Cliente>(`${this.urlEndpoint}/cliente/${id}`,{headers:this.agregarAuthorization()}).pipe(
     catchError(e=> {
       if(this.isNoAuthorizado(e)){
         return throwError(e);
       }
       console.error(e.error.mensaje);
       swal.fire(e.error.mensaje,e.error,'error');
       return throwError(e);
     })
   )
 }

//otra forma de parsear los enum en un array para los select
 stringEnumToKeyValue(paises) {
   var keys =Object.keys(paises)
             .map(key => ({ id: paises[key], name: key }))
             var keyValues = keys.slice(keys.length /2);
     return keyValues;
        }
  //forma mas compleja para parsear los enum para los select
    enumSelect(){
       var paises: any[] = [];
      for(let item in Paises){
        if(isNaN(Number(item))){
          paises.push({text:item , value: Paises[item]});
        }
    }
    return paises;

  }
}
