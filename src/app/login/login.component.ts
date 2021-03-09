import { Component, OnInit } from '@angular/core';
import * as sha1 from 'js-sha1';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public login = null;
  public password = null;
  isLogin=0
  public isLivreur = 0;
  faCoffee = faCoffee;
  menu
  constructor(private _logService:LoginService,private router:Router) { }

  ngOnInit(): void {
  }
  
  loger (){

    // this.isLogin = 1;
    // this.isLivreur = 1;
    // //this.menu = ROUTE_LIVREUR;
    // this.router.navigate(['/commandesLivreur'])

    this._logService.loger({login:this.login,password:sha1(this.password)}).then(res=>{
      console.log(res);
      if(res.status==1){
       /* console.log(res); 
        sessionStorage.setItem('profile','vendeur');
        sessionStorage.setItem('accessLevel','1');*/
          this.isLogin = 1;
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          this.router.navigate(['/home'])
      /*  if(res.user.accesslevel==1){
          //this.menu = ROUTE_ADMIN;
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          this.router.navigate(['/dashbordAdmin'])

        } else if(res.user.accesslevel==2){
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          //this.menu = ROUTE_ADMIN_CAISSE;
          this.router.navigate(['/dashbordAdminCaisse'])
        } else if(res.user.accesslevel==3){
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          //this.menu = ROUTE_VENDEUR;
          this.router.navigate(['/livreurs'])
        }
        else if(res.user.accesslevel==4){
          sessionStorage.setItem('currentUser',JSON.stringify(res.user))
          //this.menu = ROUTE_LIVREUR;
          this.router.navigate(['/commandesLivreur'])
        }*/
      }else{
        console.log(res);
      }
    })
  
  }

}
