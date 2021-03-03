import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendeurService {
  private url = "https://b38a6a901469.ngrok.io/backendGrainedor/public/index.php";

  private header :HttpHeaders;

  //Constructeur : initialisation des variables
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

   }

  // requete de reccuperation de l'ensemble des produits
  public getCommandes(param): Promise<any>{
    let params="param="+JSON.stringify(param);
    console.log(params);
    let link=this.url+ '/admin/getCommandes';
    return this.http.post(link,params,{headers:this.header}).toPromise().then( res => {console.log(res); return res} ).catch(error => {console.log(error); return 'bad' });
  } 
}