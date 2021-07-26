import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';
import swal from 'sweetalert2';
import { Rol } from '../rol';
import { ClienteService } from 'src/app/clientes/cliente.service';
import { Cliente } from 'src/app/clientes/cliente';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
public usuario:Usuario = new Usuario();
estatus:any[]=[];
clientes:Cliente[];
tComprobante: any[] = [];
habilitar:boolean=false;
passwordNueva:string=null;
passwordRepetida:string=null;
roles:Rol[];
rol:Rol;
activeCheck:boolean=false
checkClienteId=[];
checkTipoComprobante=[];
//client:Cliente[];
nameRol:string;
  constructor(public usuarioService:UsuarioService,public activatedRoute:ActivatedRoute,private router:Router,
              public clienteService:ClienteService) { }

  ngOnInit(): void {
    this.estatus=this.usuarioService.enumSelectEstatus();
    this.cargarUsuario();

    this.usuarioService.getAllRoles().subscribe(
      roles => this.roles = roles);

      this.cargaCliente();
      this.tComprobante=this.usuarioService.enumSelectComprobante();

  }
  //se activa despues de detetctar nuevos cambios
  ngDoCheck():void{
    this.onSelectRol()
    this.activacheckCliente();
    this.activacheckComprobante();
  }

  cargaCliente(){
    this.clienteService.getClientesAll().subscribe(
       clientes => this.clientes = clientes
     );

  }
  cargarUsuario():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.usuarioService.getUsuarioById(id).subscribe(usuario => {this.usuario = usuario
        ,this.usuario.roles.forEach(element => {
          this.rol=element ,this.nameRol=element.nombre
        }),this.usuario.clientes.forEach(element => {
          this.checkClienteId.push(element.id)
        }),this.usuario.comprobantes.forEach(element => {
          this.checkTipoComprobante.push(element.nombre)
        });
      }
    );}
    })
  }

  update():void{
    if(this.habilitar){

      if(this.passwordNueva==null || this.passwordRepetida==null){
        swal.fire('// WARNING: ',"Las contraseña no pueden ir vacias",'warning');
      }else{
        this.usuario.nuevaPassword=this.passwordNueva;
        this.updateRole();
        this.updateUsuario();
      }
      if(this.passwordNueva!=this.passwordRepetida ){
        swal.fire('// WARNING: ',"Las contraseñas no coinciden",'warning');
      }
    }else{
      this.updateRole();
      this.updateUsuario();
    }
  }

  updateUsuario(){
    this.usuario.clienteId=this.checkClienteId;
    this.usuario.comprobante=this.checkTipoComprobante;
    this.usuarioService.update(this.usuario)
    .subscribe(usuario =>{
      this.router.navigate(['/usuarios/ver'])
      swal.fire('Usuario actualizado','Usuario actualizado con exíto!','success');
    })
  }

  updateRole(){
    var index=0;
    var rol
    for(var x=0;x<this.usuario.roles.length;x++) {
      rol=this.usuario.roles[x].nombre;
      if(rol != this.rol.nombre){
          this.usuario.roles.splice(x, 1);
          this.usuario.roles.push(this.rol)
      }
      index++;
    }
  }

  compararRol(o1:Rol,o2:Rol){
    return o1 ==null || o2==null? false : o1.id===o2.id
  }

  onSelectRol(){
  if(this.rol!=null){
      if(this.rol.nombre=="ROLE_USER"){
        this.activeCheck=true;
      }else{
        this.activeCheck=false;
        this.checkClienteId.length=0;
        this.checkTipoComprobante.length=0;
      }
      //  this.usuario.roles.push(this.rol)
      }
  }
  onCheckboxCliente() {
    this.checkClienteId = []
    this.clientes.forEach((value, index) => {
      if (value.isChecked) {
        this.checkClienteId.push(value.id);
      }
    });
    console.log(this.checkClienteId)
  }

  onCheckboxTipo(){
    this.checkTipoComprobante = []
    this.tComprobante.forEach((value, index) => {
      if (value.isChecked) {
        this.checkTipoComprobante.push(value.value);
      }
    });
    console.log(this.checkTipoComprobante)
  }

  activacheckCliente(){
    if(this.clientes!=undefined){
    for(var x=0;x<this.clientes.length;x++){
      for(var y=0;y<this.checkClienteId.length;y++){
        if(this.clientes[x].id==this.checkClienteId[y]){
            this.clientes[x].isChecked=true;
        }
      }
    }
  }
  }

  activacheckComprobante(){
  if(this.tComprobante!=undefined){
    for(var x=0;x<this.tComprobante.length;x++){
      for(var y=0;y<this.checkClienteId.length;y++){
        if(this.tComprobante[x].value==this.checkTipoComprobante[y]){
            this.tComprobante[x].isChecked=true;
        }
      }
    }
  }
  }
}
