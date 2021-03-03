import { Component ,OnInit} from '@angular/core';
import { routeItem } from '../interfaces/routeItem.interface';

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
    path:'/dashboardVendeur',
    titre: 'Dashboard',
    description:'',
    icon:''
  }
];


const ROUTE_LIVREUR: routeItem[] = [
  {
    path:'/commandesLivreur',
    titre: 'Commandes',
    description:'',
    icon:''
  },
  {
    path:'/historiqueLivreur',
    titre: 'Historiques',
    description:'',
    icon:''
  }
];


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'angular-router-sample';
  
  menu:routeItem[] = ROUTE_VENDEUR;
  
  constructor() { }

  ngOnInit(): void {
  }

}
