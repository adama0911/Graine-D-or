import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminGeneralService {

   //l'url de base
   private url = "https://890f64c9e80b.ngrok.io/backendGrainedor/public/index.php";
   //Headers
   private header :HttpHeaders;
 
   constructor(private http: HttpClient) {
     this.header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
 
    }
    
    // CreateUser est une fonction de création des utilisateurs : Vérificatteur, Opérateur et client
    public createUser(param): Promise<any>{
     let params="param="+JSON.stringify(param);
     console.log(params);
     
     let link=this.url+"/admin/createUser";
     return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(JSON.stringify(res)); return res} ).catch(error => {console.log(error); return 'bad' });
   }
}
