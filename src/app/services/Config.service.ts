import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
  })

export class ConfigService {
    private url = "http://192.168.1.113/backendGrainedor/public/index.php";

    private header :HttpHeaders;
  
    //Constructeur : initialisation des variables
    constructor(private http: HttpClient) {
      this.header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
  
     }
  
    // requete de reccuperation de l'ensemble des produits
    public getHistoriques(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      let link=this.url+ '/admin/createUser';
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
    } 

}