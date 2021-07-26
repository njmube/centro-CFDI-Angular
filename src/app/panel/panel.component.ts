import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  username:string;
  constructor(public authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.username = this.authService.usuario.username
  }

  logout():void{
    let username =this.authService.usuario.username;
    this.authService.logout();
    swal.fire("Logout", `hola ${username}, has cerrado sesión con éxito!`,'success');
    this.router.navigate(["/login"]);
  }
}
