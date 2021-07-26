import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import swal from 'sweetalert2';
import { Router , ActivatedRoute} from '@angular/router';
import { ClienteService } from './cliente.service';
import { HttpEventType } from '@angular/common/http';
import { Paises } from '../enum/paises.enum';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  public cliente:Cliente = new Cliente();
   progreso: number = 0;
  private logoSeleccionada: File;
  private cerSeleccionada: File;
  private keySeleccionada: File;
  paises: any[] = [];
  clientes:Cliente[];
  params;
  resultado: string;
  constructor(public clienteService:ClienteService,
              private router:Router,
              public activateRoute:ActivatedRoute)
    {
    this.params = this.clienteService.stringEnumToKeyValue(Paises);
    }


  ngOnInit(): void {
    this.paises=this.clienteService.enumSelect();
  }

  public create():void{

    this.clienteService.create(this.cliente,this.cerSeleccionada,this.keySeleccionada,this.logoSeleccionada).subscribe( event =>{
      if(event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
           this.cliente = response.cliente as Cliente;
           console.log(response.mensaje);
           this.router.navigate(['/clientes/ver']);
            swal.fire('Cliente creado Exitosamente!', response.mensaje, 'success');
        }
    }, error =>{
      if(error.status==400){
        console.log(error.error.mensaje)
        swal.fire('Error',error.error.mensaje, 'error');
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
