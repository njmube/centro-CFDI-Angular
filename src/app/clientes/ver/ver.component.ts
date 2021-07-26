import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  clientes: Cliente[] =[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private clienteService:ClienteService) { }

  ngOnInit(){
    this.clienteService.getClientes().subscribe(
       cliente => {this.clientes = cliente
         this.dtTrigger.next();
       });

     this.dtOptions = {
      pagingType: 'full_numbers'
    };

  }

  delete(cliente: Cliente): void {
    swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre}?`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      buttonsStyling: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.deleteCliente(cliente.id).subscribe(
          () => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

}
