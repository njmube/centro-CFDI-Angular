import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import swal  from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(public http:HttpClient,private router:Router,public authService:AuthService) { }

  //mensajes de no authorizado
    public isNoAuthorizado(e):boolean{
        if(e.status == 401){
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
          return true;
        }
        if(e.status == 500){
          return true;
        }
        return false;
    }

     
}
