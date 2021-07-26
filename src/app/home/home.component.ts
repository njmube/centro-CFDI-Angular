import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Estadistica } from './estadistica';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
estadisticas: Estadistica[] =[];
dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  constructor(private homeService:HomeService) { }

  ngOnInit(): void {
	  this.homeService.getEstadisticaComprobante().subscribe(
       estadistica => {this.estadisticas = estadistica
         this.dtTrigger.next();
       });

     this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

}
