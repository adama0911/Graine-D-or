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
  menu;
  public loading = false;
  isFirstLog:boolean = false;
  newpassword;
  confirmpassword;
  constructor(private _logService:LoginService,private router:Router) { }

  ngOnInit(): void {
  }

  goToLivreur(){
    this.isLogin = 0;
    this.router.navigate(['/commandesLivreur'])
  }
  firstLog(){
    if(this.newpassword == this.confirmpassword){
      this._logService.firstLogin({login:this.login,password:sha1(this.newpassword)}).then(res=>{
        console.log(res);
        if(res.status == 1){
          this.isFirstLog = false;
          this.login = undefined;
          this.password = undefined;
        }
      })
    }else{  
      alert("Les mots de passe sont différants")
    }
  }
  loger (){
    this.loading = true;
    this._logService.loger({login:this.login,password:sha1(this.password)}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.newpassword = undefined;
        this.confirmpassword = undefined;
          if(res.user.first_log == 0){
            this.isFirstLog = true;
            this.loading = false;
          }else{
            this.loading = false;
            this.isLogin = 1;
            sessionStorage.setItem('currentUser',JSON.stringify(res.user))
            this.router.navigate(['/home'])
          }
        }else{
          this.loading = false;
          alert("Login ou mot de passe incorrect !!!")
          console.log(res);
        }
         
    })
  
  }

}
