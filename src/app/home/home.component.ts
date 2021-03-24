import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as sha1 from 'js-sha1';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { routeItem } from '../interfaces/routeItem.interface';
import { LoginService } from '../services/login.service';
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


const ROUTE_ADMIN: routeItem[] = [
  {
    path:'/dashbordAdmin',
    titre: 'Dashboard admin',
    description:'',
    icon:''
  },
  {
    path:'/createCaisse',
    titre: 'Création caisse',
    description:'',
    icon:''
  }
];

const ROUTE_ADMIN_CAISSE: routeItem[] = [
    {
      path:'/dashbordAdminCaisse',
      titre: 'Dashboard caisse',
      description:'',
      icon:''
    },
    {
      path:'/createUsers',
      titre: 'Création utilisateur',
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
  menu;
  public isLivreur = 0;
  faCoffee = faCoffee;
  constructor(private router:Router,private _serviceLogin:LoginService) { }
  logout(){
   
      this._serviceLogin.logout({login:JSON.parse(sessionStorage.getItem('currentUser')).login}).then(res=>{
        if(res.status == 1){
          sessionStorage.clear();
          this.router.navigate(["/login"])
        }
      })
  
   
  }
  showMoodal(){
    document.getElementById('idLogout').style.display = "block";
  }
  hideMoodal(){
    document.getElementById('idLogout').style.display = "none";
  }
  ngOnInit(): void {
     let user = JSON.parse(sessionStorage.getItem('currentUser'))
    if(user.accesslevel==1){
      this.isLivreur=0;
      this.menu = ROUTE_ADMIN;
      this.router.navigate(['/dashbordAdmin'])

    } else if(user.accesslevel==2){
      this.isLivreur=0;
      this.menu = ROUTE_ADMIN_CAISSE;
      this.router.navigate(['/dashbordAdminCaisse'])
    } else if(user.accesslevel==3){
      this.isLivreur=0;
      this.menu = ROUTE_VENDEUR;
      this.router.navigate(['/livreurs'])
    }
    else if(user.accesslevel==4){
      this.isLivreur=1;
      this.menu = ROUTE_LIVREUR;
      this.isLivreur = 1;
      this.router.navigate(['/commandesLivreur'])
    }else if(user.accesslevel==5){
      this.isLivreur = 1;
      this.router.navigate(['/dashboardEcran'])
    }
  }

}
