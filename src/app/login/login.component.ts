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
  passError = null;
  loginError = null;
  constructor(private _logService:LoginService,private router:Router) { }

  ngOnInit(): void {
  }

  goToLivreur(){
    this.isLogin = 0;
    this.router.navigate(['/commandesLivreur'])
  }

 


  testPass (pass){
      console.log(pass)
      if(pass.trim()==''){
        this.passwordQuality = null;
      }else if(pass.match( /[0-9]/g) &&  
              pass.match( /[A-Z]/g) && pass.match(/[a-z]/g) && 
              pass.match( /[^a-zA-Z\d]/g) && 
              pass.length >= 8) {   
            this.passwordQuality = 2;
      }else if ( pass.length  >= 6 && pass.length < 8){
        this.passwordQuality = 1; 
      }else if(pass.length < 6){
        this.passwordQuality = 0; 
      }
      console.log(this.passwordQuality)
  }


  firstLog(){
    this.passError = null;
    if(this.newpassword == this.confirmpassword){
      if(this.passwordQuality!=0){
        this._logService.firstLogin({login:this.login,password:sha1(this.newpassword)}).then(res=>{
          console.log(res);
          if(res.status == 1){
            this.isFirstLog = false;
            this.login = undefined;
            this.password = undefined;
          }
          if(res.status == 1){
            this.isFirstLog = false;
            this.login = undefined;
            this.password = undefined;
          }
        })
        
      }else{
        this.passError = "Mot de pass très faible";
      }
    }else{  
      this.passError = "Les mots de passe sont différants";
    }
  }

  passwordQuality = null;
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
          this.loginError = "Login  où mot de passe incorrect !!!";
          console.log(res);
        }
         
    })
  
  }

}
