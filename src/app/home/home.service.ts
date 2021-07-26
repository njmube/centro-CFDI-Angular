import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import { Estadistica } from './estadistica';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private urlEndpoint:string = 'http://191.96.42.214:8087/api';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(public http:HttpClient,private router:Router,public authService:AuthService) { }

  getEstadisticaComprobante(): Observable<Estadistica[]> {
    let username =this.authService.usuario.username;
   return this.http.get<Estadistica[]>(`${this.urlEndpoint}/estadistica?username=${username}`).pipe(
     map(response => response as Estadistica[])
 );
 }
}
