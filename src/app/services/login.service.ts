import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = "http://161.97.73.229/backendGrainedor/public/index.php";
  // private url = "https://3ddd1083596b.ngrok.io/backendGrainedor/public/index.php";
  

  private header :HttpHeaders;

  //Constructeur : initialisation des variables
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

   }

  // requete de reccuperation de l'ensemble des produits
  public loger(param): Promise<any>{
    let params="param="+JSON.stringify(param);
    console.log(params);
    let link=this.url+ '/admin/login';
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  } 

  
  //firstLogin changer mot passe sur le premier login
  public firstLogin(param): Promise<any>{
    let params="param="+JSON.stringify(param);
    console.log(params);
    let link=this.url+ '/admin/updatePassword';
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  } 

  public logout(param): Promise<any>{
    let params="param="+JSON.stringify(param);
    console.log(params);
    let link=this.url+ '/admin/logOut';
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  } 

  
}
