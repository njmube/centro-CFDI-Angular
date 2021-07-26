import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role:string;
  username:string;
  constructor(public authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.usuario.roles.forEach(e=>{this.role=e.nombre})
    this.username = this.authService.usuario.username
  }
  logout():void{
    let username =this.authService.usuario.username;
    this.authService.logout();
    swal.fire("Logout", `hola ${username}, has cerrado sesión con éxito!`,'success');
    this.router.navigate(["/login"]);
  }

}
