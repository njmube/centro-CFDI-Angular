import { Comprobantes } from "../cfdi/comprobante/comprobantes";
import { Cliente } from "../clientes/cliente";
import { Rol } from "./rol";

export class Usuario {
  id:number;
  nombre:string;
  apellidos:string;
  username:string;
  password:string;
  email:string;
  estatus:boolean;
  roles:Rol[]=[];
  clientes:Cliente[]=[];
  comprobantes:Comprobantes[]=[];
  clienteId:number[]=[];
  comprobante:string[]=[];
  nuevaPassword:string;


}
