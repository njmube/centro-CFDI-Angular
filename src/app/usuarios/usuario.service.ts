import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { map, catchError, tap } from 'rxjs/operators';
import { TipoComprobante } from '../enum/tipo-comprobante.enum';
import { Cliente } from '../clientes/cliente';
import { StatusService } from '../authorization/status.service';
import swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Estatus } from '../enum/estatus.enum';
import { Rol } from './rol';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlEndpoint:string = 'http://191.96.42.214:8087/api';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  constructor(private http:HttpClient, private authService: AuthService, private statusService:StatusService) { }

  private agregarAuthorizationHeader() {
   let token = this.authService.token;
   if (token != null) {
     return this.httpHeaders.append('Authorization', 'Bearer ' + token);
   }
   return this.httpHeaders;
 }

  create(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(`${this.urlEndpoint}/usuarios/crear`,usuario,{headers:this.httpHeaders})
  }

  getAllUsuario(): Observable<Usuario[]> {
   return this.http.get<Usuario[]>(`${this.urlEndpoint}/usuarios`,{headers:this.agregarAuthorizationHeader()})
   .pipe(map(response=> response as Usuario[])
   ,catchError(e =>{
     if(this.statusService.isNoAuthorizado(e)){
       return throwError(e);
     }
     console.error(e.error.mensaje);
     swal.fire('Error',e.error.mensaje,'error');
     return throwError(e);
   }));
}

getUsuarioById(id):Observable<Usuario>{
  return this.http.get<Usuario>(`${this.urlEndpoint}/usuario/${id}` , {headers:this.agregarAuthorizationHeader()}).pipe(
    catchError(e =>{
      if(this.statusService.isNoAuthorizado(e)){
        return throwError(e);
      }
      console.error(e.error.mensaje);
      swal.fire('Error',e.error.mensaje,'error');
      return throwError(e);
    })
  )

}

deleteUsuario(id:number):Observable<Usuario>{
  return this.http.delete<Usuario>(`${this.urlEndpoint}/usuario/${id}`,{headers:this.agregarAuthorizationHeader()}).pipe(
    catchError(e=> {
      if(this.statusService.isNoAuthorizado(e)){
        return throwError(e);
      }
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error,'error');
      return throwError(e);
    })
  )
}
update(usuario:Usuario):Observable<Usuario>{
  return this.http.put<Usuario>(`${this.urlEndpoint}/usuario/${usuario.id}`,usuario,{headers:this.agregarAuthorizationHeader()})
  .pipe(catchError(e=> {
    if(this.statusService.isNoAuthorizado(e)){
      return throwError(e);
    }
    console.error(e.error.mensaje);
    swal.fire(e.error.mensaje,e.error,'error');
    return throwError(e);
  }));
}

enumSelectComprobante(){
   var tComprobante: any[] = [];
   var isChecked:Boolean=false;
  for(let item in TipoComprobante){
    if(isNaN(Number(item))){
      tComprobante.push({text:item , value: TipoComprobante[item],isChecked:isChecked});
    }
}
return tComprobante;

}
enumSelectEstatus(){
   var estatus: any[] = [];
  for(let item in Estatus){
    if(isNaN(Number(item))){
      estatus.push({text:item , value: Estatus[item]});
    }
}
return estatus;

}
getAllRoles():Observable<Rol[]>{
  return this.http.get<Rol[]>(`${this.urlEndpoint}/roles`)
  .pipe(map(response=> response as Rol[]));
}

}
