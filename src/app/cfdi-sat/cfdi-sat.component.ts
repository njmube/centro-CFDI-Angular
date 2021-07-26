import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfdi-sat',
  templateUrl: './cfdi-sat.component.html',
  styleUrls: ['./cfdi-sat.component.css']
})
export class CfdiSatComponent implements OnInit {
  tipo:String;
  formCiecc:boolean=false;
  formFiel:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

}
