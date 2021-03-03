import { Component } from '@angular/core';
import { routeItem } from './interfaces/routeItem.interface';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'angular-router-sample';
  public login = null;
  public password = null;

  constructor (private _logService:LoginService,private router:Router){

  }


  loger (){
    this._logService.loger({login:this.login,password:this.password}).then(res=>{
      console.log(res);
      if(res.status==1){
        console.log(res);
        sessionStorage.setItem('profile','vendeur');
        sessionStorage.setItem('accessLevel','1');
        this.router.navigate(['/home'])
      }else{
        console.log(res);
        sessionStorage.setItem('profile','vendeur');
        sessionStorage.setItem('accessLevel','1');
        this.router.navigate(['/home'])
      }
    })
  }
}