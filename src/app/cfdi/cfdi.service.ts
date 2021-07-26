import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TipoComprobante } from '../enum/tipo-comprobante.enum';
import { StatusService } from '../authorization/status.service';
import { ResponseDataTable } from './response-data-table';
import { Comprobantes } from './comprobante/comprobantes';


@Injectable({
  providedIn: 'root'
})
export class CfdiService {
  private urlEndpoint:string = 'http://191.96.42.214:8087/api';
  private httpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  private username2:string = this.authService.usuario.username;
  constructor(private http:HttpClient,private router:Router,private authService:AuthService,private statusService:StatusService) { }

//agrega authorizacion del token en httpHeaders
  private agregarAuthorization(){
    let token =this.authService.token;
    if(token != null){
        return this.httpHeaders.append('Authorization','Bearer ' + token);
    }
    return this.httpHeaders;
  }



  downloadXmlId(id):Observable<HttpResponse<Blob>>{
    var url = this.urlEndpoint+"/downloadXml";
    return this.http.get<Blob>(`${url}/${id}` , {headers:this.agregarAuthorization(),observe:'response', responseType:'blob' as 'json'})
    .pipe(catchError(e=>{
      if(e.status== 400)
      swal.fire('Error','Error el archivo no se encuentra!','error');
      return throwError(e);
    }));
  }

  downloadPdfId(id):Observable<HttpResponse<Blob>>{
    var url = this.urlEndpoint+"/downloadPdf";
    return this.http.get<Blob>(`${url}/${id}` , {headers:this.agregarAuthorization(),observe:'response',responseType:'blob' as 'json'})
    .pipe(catchError(e=>{
        console.log(e.status)
      if(e.status== 400)
      console.log(e.error)
      swal.fire('Error','Error el archivo no se encuentra!','error');
      return throwError(e);
    }));
  }

  downloadZipAllFiles(params):Observable<HttpResponse<Blob>>{
    var url = this.urlEndpoint+"/downloadZip?inicial="+params.fechaInicial+"&final="+params.fechaFinal
    +"&clienteId="+params.clienteId+"&tipoComp="+params.tipoComprobante+"&username="+this.username2;
    return this.http.get<Blob>(`${url}` , {headers:this.agregarAuthorization(),observe:'response', responseType:'blob' as 'json'})
    .pipe(catchError(e=>{
      if(e.status== 500)
      swal.fire('Error',e.error.messaje,'error');
      return throwError(e);
    }));
  }


  getDataInput(dataTablesParameters,params):Observable<ResponseDataTable>{
    let username =this.authService.usuario.username;
    const url = `${this.urlEndpoint}/data/cfdi?inicial=${params.fechaInicial}&final=${params.fechaFinal}&clienteId=${params.clienteId}&tipoComp=${params.tipoComprobante}&username=${username}`
    return this.http.post<ResponseDataTable>(`${url}`,dataTablesParameters,{headers:this.agregarAuthorization()}).pipe
  (catchError(e=>{
    if(this.statusService.isNoAuthorizado(e)){
      return throwError(e);
    }
    this.router.navigate(['/cfdi/ver']);
    console.error(e.error.mensaje);
    swal.fire('Error',e.error.mensaje,'error');
    return throwError(e);
  }));;
  }

  getComprobantes(): Observable<Comprobantes[]> {
    let username =this.authService.usuario.username;
   return this.http.get<Comprobantes[]>(`${this.urlEndpoint}/comprobantes?username=${username}`,{headers:this.agregarAuthorization()}).pipe(
     map(response => response as Comprobantes[])
 );
 }
  enumSelect(){
     var tComprobante: any[] = [];

    for(let item in TipoComprobante){
      if(isNaN(Number(item))){
        tComprobante.push({text:item , value: TipoComprobante[item]});
      }
  }
  return tComprobante;

}


}
