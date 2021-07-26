import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  titulo:string = "Centro CFDI";
  usuario:Usuario;
  constructor(public authService:AuthService,private router:Router)
  {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    /*if(this.authService.isAuthenticated()){
        swal.fire('Login',`hola ${this.authService.usuario.username} ya estas authenticado!`,'info' );
    }*/
  }
 login():void{
   if(this.usuario.username == null || this.usuario.password == null){
     swal.fire('Error login','username o password vacios!!','error');
      return;
   }
     this.authService.login(this.usuario).subscribe(response=>{
      console.log(response);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      //obtener del servicio el username
      let usuario = this.authService.usuario;
      //console.log(usuario);
      this.router.navigate(['/home']);
      swal.fire('Login','Hola ' + usuario.username+' , has iniciado sesion con exito!','success');
    }, err=>{
      if(err.status == 400){
        swal.fire('Error login','Usuario o clave incorrectas!', 'error');
      }
    });

 }
}
