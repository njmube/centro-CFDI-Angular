import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';
import swal from 'sweetalert2';
import { ClienteService } from 'src/app/clientes/cliente.service';
import { Cliente } from 'src/app/clientes/cliente';
import { Rol } from '../rol';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public usuario:Usuario = new Usuario();
  usuarios:Usuario[];
  clientes:Cliente[];
  tComprobante: any[] = [];
  checkClienteId=[];
  checkTipoComprobante=[];
  errores:string[]
  roles:Rol[];
  role:Rol=null;
  activeCheck:boolean=false
  constructor(public usuarioService:UsuarioService ,private clienteService:ClienteService, private router:Router
              ,public authService:AuthService) {

  }

  ngOnInit(): void {

     this.clienteService.getClientesAll().subscribe(
        clientes => this.clientes = clientes
      );

      this.tComprobante=this.usuarioService.enumSelectComprobante();

      this.usuarioService.getAllRoles().subscribe(
        roles => this.roles = roles
      );
  }
 validExistTokeAndUser():boolean{
    if(this.authService.usuario.username!=null && this.authService.token!=null){
      return true;
    }
   return false;
 }
  onSelectRol(){
  if(this.role!=null){
      if(this.role.nombre=="ROLE_USER"){
        this.activeCheck=true
      }else{
        this.activeCheck=false ;
      }
        this.usuario.roles.push(this.role)
      }
  }
  onCheckboxCliente() {
    this.checkClienteId = []
    this.clientes.forEach((value, index) => {
      if (value.isChecked) {
        this.checkClienteId.push(value.id);
      }
    });

}

onCheckboxTipo(){
  this.checkTipoComprobante = []
  this.tComprobante.forEach((value, index) => {
    if (value.isChecked) {
      this.checkTipoComprobante.push(value.value);
    }
  });
}

  public create():void{
    if(this.usuario.roles.length<1 ||  this.role==null ){
      swal.fire('// WARNING: ','seleccionar rol!','warning')
    }else if(this.checkClienteId.length < 1 && this.role.nombre=="ROLE_USER"){
      swal.fire('// WARNING: ','seleccionar empresa!','warning')
    }else if (this.checkTipoComprobante.length < 1 && this.role.nombre=="ROLE_USER"){
      swal.fire('// WARNING: ','seleccionar comprobante!','warning')
    }else{
        this.usuario.clienteId=this.checkClienteId;
        this.usuario.comprobante=this.checkTipoComprobante;
        this.usuarioService.create(this.usuario).subscribe(
          response=> {
          swal.fire('Nuevo usuario','usuario '+ response.nombre +' creado con exito!','success');
        },error =>{
          if(error.status==400){
            console.error(error.error.error)
          }
          if(error.status==409){
            console.error(error.error.mensaje)
            swal.fire('Error Usuario',error.error.mensaje, 'error');
          }
        });
      }
  }
}
