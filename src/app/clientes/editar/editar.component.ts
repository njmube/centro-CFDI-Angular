import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { Paises } from 'src/app/enum/paises.enum';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  public cliente:Cliente = new Cliente();
  progreso: number = 0;
  private logoSeleccionada: File;
  private cerSeleccionada: File;
  private keySeleccionada: File;
  params;
  paises:any[] = [];
  object;
  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
      this.cargarCliente();
      this.params = this.clienteService.stringEnumToKeyValue(Paises);
      this.paises=this.clienteService.enumSelect();
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.clienteService.getClienteById(id).subscribe((cliente) => this.cliente = cliente);
        console.log(this.cliente)
      }
    })
  }

  editar():void{
    console.log(this.cliente.id);
    if(this.cliente.rfc==null && this.cliente.nombre==null && this.cliente.razonSocial==null &&
      this.cliente.codigoPostal==null && this.cliente.pais==null ){
      this.router.navigate(['/cliente/editar/'+this.cliente.id]);
      swal.fire("Error","Campos Nombre, Razon social, Rfc, Codigo postal, País no deben quedar vacios!",'error');
    }
    this.clienteService.create(this.cliente,this.cerSeleccionada,this.keySeleccionada,this.logoSeleccionada).subscribe( event =>{
      if(event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
           this.cliente = response.cliente as Cliente;
           console.log(response.mensaje);
           this.router.navigate(['/clientes']);
            swal.fire('Cliente actualizado Exitosamente!', response.mensaje, 'success');
        }
    })
  }

  seleccionaLogo(event) {
  this.logoSeleccionada = event.target.files[0];
  this.progreso = 0;
  console.log(this.logoSeleccionada);
  if (this.logoSeleccionada.type.indexOf('image') < 0) {
    swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
    event.target.value="";
    this.logoSeleccionada = null;
  }
}
seleccionaCer(event) {
this.cerSeleccionada = event.target.files[0];
if(this.cerSeleccionada!=null){
    if(!(/\.(CER|cer)$/i).test(this.cerSeleccionada.name)){
      console.log("Archivo invalido")
      swal.fire("Error","Error tipo de archivo Cer incorrecto!","error");
      this.cerSeleccionada = null;
        event.target.value="";
    }else{
      console.log("Archivo valido")
    }
  }
this.progreso = 0;
}

seleccionaKey(event) {
this.keySeleccionada = event.target.files[0];
if(this.keySeleccionada!=null){
  if(!(/\.(KEY|key)$/i).test(this.keySeleccionada.name)){
      console.log("Archivo invalido")
      swal.fire("Error","Error tipo de archivo Key incorrecto!","error");
      this.keySeleccionada = null;
      event.target.value="";
    }else{
      console.log("Archivo valido")
    }
  }
  this.progreso = 0;
}

}
