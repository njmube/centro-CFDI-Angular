import { Paises } from "../enum/paises.enum";

export class Cliente {
  id:number;
  nombre:string;
  status:boolean;
  email:string;
  nombreLogo:string;
  logo:string;
  razonSocial:string;
  rfc:string;
  codigoPostal:string;
  //pais:string;
  pais:Paises;
  nombreFileCer:string
  cer:string;
  nombreFileKey:string;
  key:string;
  passwordKey:string;
  servidor:string;
  keyXsa:string;
  fechaInicial:string;
  //cfdiPrincipal:string[]
  isChecked:boolean= false;

}
