import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Cfdi } from './cfdi';
import { CfdiService } from './cfdi.service';
import { saveAs } from 'file-saver';
import { StatusService } from '../authorization/status.service';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { ClienteService } from '../clientes/cliente.service';
import { Cliente } from '../clientes/cliente';
import { Parameters } from './parameters';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
import { Comprobantes } from './comprobante/comprobantes';
import { ResponseDataTable } from './response-data-table';


@Component({
  selector: 'app-cfdi',
  templateUrl: './cfdi.component.html',
  styleUrls: ['./cfdi.component.css']
})

export class CfdiComponent implements OnDestroy, OnInit  {
  currentDate:Date;
//input filtrado dataTable
  public params:Parameters= new  Parameters();
  public loading: boolean;
  clientes:Cliente[];
  comprobantes:Comprobantes[];
  id:number;
  tComprobante: any[] = [];
  dataCfdi: Cfdi[];

  @ViewChild(DataTableDirective, {static: false})
    datatableElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

  tableData = [];
  blob: Blob;
  idCliente;
  comprobante;
      constructor(public http:HttpClient,public cfdiservice:CfdiService,public statusService:StatusService
              ,public clienteService:ClienteService,private router:Router,public renderer: Renderer2,
              private datepipe: DatePipe, public authService:AuthService) {
     this.currentDate = new Date();
  }


  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
       clientes => this.clientes = clientes
     );

     this.cfdiservice.getComprobantes().subscribe(
       comprobante => this.comprobantes = comprobante
     );
     this.tComprobante=this.cfdiservice.enumSelect();

    //dataTable
   this.getDataFromSource();

 }

 onCheckboxChange(e) {
 }

 filterByInput(): void {
   //parseo fechas date a string
  let  fechaIn=this.datepipe.transform(this.params.fechaInicial,'yyyy-MM-dd');
  let  fechaFin=this.datepipe.transform(this.params.fechaFinal,'yyyy-MM-dd');
    this.idCliente = $('#clienteId').val();
    this.comprobante = $('#comprobante').val();
    this.params.clienteId = this.idCliente;
    this.params.tipoComprobante = this.comprobante;

   if(fechaIn==null || fechaFin==null)
   {
      swal.fire('// WARNING: ','Fecha inicial o Fecha final requerido!','warning');
   }else{

     this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.draw();
    });
    }
   }

   getDataFromSource() {
   this.dtOptions = {
     pagingType: 'full_numbers',
     serverSide: true,
     processing: true,
     destroy:true,
     ajax: (dataTablesParameters: any, callback)=>{

        this.cfdiservice.getDataInput(dataTablesParameters,this.params).subscribe(resp=>{
          this.dataCfdi=resp.data
          callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
        })
     },
     columns: [
       { data: 'tfdUuid'},
       { data: 'folio' },
       { data: 'fecha' },
       { data: 'total' },
       { data: 'id' }]
     };

    }

ngOnDestroy(): void {
 $.fn['dataTable'].ext.search.pop();
}


 downloadXml(id:number):void{
   this.cfdiservice.downloadXmlId(id).subscribe((resp: HttpResponse<Blob>) =>{
     //obtengo el nombre del archivo
      const filename=resp.headers.get('content-disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
        saveAs(resp.body,filename);
   },error=>{
     if(this.statusService.isNoAuthorizado(error.status)){ }

   })
 }
 downloadPdf(id:number):void{
   this.cfdiservice.downloadPdfId(id).subscribe((resp:HttpResponse<Blob>) =>{
     //obtengo el nombre del archivo
      const filename=resp.headers.get('content-disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
      saveAs(resp.body,filename);
   },error=>{
     console.log(error);
     this.statusService.isNoAuthorizado(error.status)

   })
 }

 downloadZipAll(params:Parameters):void{
   this.loading = true;
   this.cfdiservice.downloadZipAllFiles(params).subscribe((resp: HttpResponse<Blob>) =>{
     const filename=resp.headers.get('content-disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
     if(filename!='undefined')
     {
       this.loading = false;
       saveAs(resp.body,filename);
     }
   },error=>{
     this.loading = false;
     console.log(error);
     this.statusService.isNoAuthorizado(error.status)
   })
 }

ngAfterViewInit(): void {
 $('.menu-item').click(function(){
           $('.menu-item').addClass('menu-item-there');
});
}
}
