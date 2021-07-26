import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders } from '@angular/common/http'
import { Usuario } from './usuario';
import { Rol } from './rol';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private _usuario:Usuario;
   private _token: string;
   rol:Rol
  constructor(private http:HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario:Usuario):Observable<any>{
    const urlEndpoint = 'http://191.96.42.214:8087/oauth/token';
    const credenciales = btoa('centroCfdi'+':'+'12345');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'Basic ' + credenciales});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);
    //obtenemos el token
    return this.http.post<any>(urlEndpoint,params.toString(),{headers:httpHeaders})
  }

  guardarUsuario(acccessToken:string):void{
    let payload = this.obtenerDatosToken(acccessToken);
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.email = payload.email;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));
  }
  guardarToken(acccessToken:string):void{
    this._token = acccessToken;
    sessionStorage.setItem('token',acccessToken);
  }
  obtenerDatosToken(acccessToken:string):any{
    if(acccessToken!=null){
      return JSON.parse(atob(acccessToken.split(".")[1]))
    }
    return null;
  }

   isAuthenticated():boolean{
     let payload = this.obtenerDatosToken(this.token);
     if(payload!=null && payload.user_name && payload.user_name.length>0){
       //console.log(payload);
      //  console.log(payload.user_name);
      //   console.log(payload.user_name.legth)
       return true;
     }
     return false;
   }

   hasRole(role: string): boolean {
     var rol;
     for(var x=0;x<this.usuario.roles.length;x++){
       rol = this.usuario.roles[x];

       if(rol == role){
         return true;
        }
      }
       return false
  }

   logout():void{
     this._token=null;
     this._usuario = null;
     sessionStorage.clear();
     sessionStorage.removeItem('token');
     sessionStorage.removeItem('usuario');
   }

}
