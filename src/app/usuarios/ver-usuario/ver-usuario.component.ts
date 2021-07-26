import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.css']
})
export class VerUsuarioComponent implements OnInit {
  usuarios: Usuario[] =[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private usuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuario().subscribe(
          usuarios=> {this.usuarios = usuarios
         this.dtTrigger.next();
       });

    this.dtOptions = {
     pagingType: 'full_numbers'
   };
  }

  delete(usuario: Usuario): void {
    swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al username ${usuario.username}?`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      buttonsStyling: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.usuarioService.deleteUsuario(usuario.id).subscribe(
          () => {
            this.usuarios = this.usuarios.filter(cli => cli !== usuario)
            swal.fire(
              'Username Eliminado!',
              `Username ${usuario.username} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

}
