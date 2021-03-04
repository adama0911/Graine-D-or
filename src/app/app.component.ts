import { Component } from '@angular/core';
import { routeItem } from './interfaces/routeItem.interface';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'angular-router-sample';
  public login = null;
  public password = null;
  isLogin=0
  public isLivreur = 0;

  
  menu:routeItem[] = ROUTE_VENDEUR;
  


  ngOnInit(): void {
  }


  constructor (private _logService:LoginService,private router:Router){

  }


  loger (){
    // this.isLogin = 1;
    // this.isLivreur = 1;
    // this.menu = ROUTE_LIVREUR;
    // this.router.navigate(['/commandesLivreur'])
    this._logService.loger({login:this.login,password:this.password}).then(res=>{
      console.log(res);
      if(res.status==1){
          this.isLogin = 1;

        if(res.user.accesslevel==1){
          this.menu = ROUTE_ADMIN;
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          this.router.navigate(['/dashbordAdmin'])

        } else if(res.user.accesslevel==2){
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          this.menu = ROUTE_ADMIN_CAISSE;
          this.router.navigate(['/dashbordAdminCaisse'])
        } else if(res.user.accesslevel==3){
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          this.menu = ROUTE_VENDEUR;
          this.router.navigate(['/livreurs'])
        }
        else if(res.user.accesslevel==4){
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          this.menu = ROUTE_LIVREUR;
          this.router.navigate(['/commandesLivreur'])
        }
      }else{
        console.log(res);
      }
      this.router.navigate(['/home'])
    })
  
  }
    
}