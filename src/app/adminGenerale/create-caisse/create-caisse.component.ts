import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-create-caisse',
  templateUrl: './create-caisse.component.html',
  styleUrls: ['./create-caisse.component.scss']
})
export class CreateCaisseComponent implements OnInit {

  prenom
  nom
  adresse
  telephone
  identifiant
  etapeDisplay:number = 1;
  searchValue = '';
  visible = false;

  selected = []


  constructor() { 
   
  }

 

  ngOnInit(): void {
   
  }

}
