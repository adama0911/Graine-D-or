import { Component } from '@angular/core';
import { routeItem } from './interfaces/routeItem.interface';

const ROUTE_VENDEUR: routeItem[] = [
  {
    path:'/livreurs',
    titre: 'Livreurs',
    description:'',
    icon:''
  },
  {
    path:'/commandes',
    titre: 'Commandes',
    description:'',
    icon:''
  },
  {
    path:'/dashboard',
    titre: 'Dashboard',
    description:'',
    icon:''
  },
  ,
  {
    path:'/dashbordAdmin',
    titre: 'Dashboard admin',
    description:'',
    icon:''
  },
  ,
  {
    path:'/createCaisse',
    titre: 'Création caisse',
    description:'',
    icon:''
  },
];



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'angular-router-sample';
  
  menu:routeItem[] = ROUTE_VENDEUR;
  
}