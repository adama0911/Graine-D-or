import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminGeneralService {
  
   //l'url de base
  private url = "http://161.97.73.229/backendGrainedor/public/index.php";
  // private url = "https://a52b6d862cb8.ngrok.io/backendGrainedor/public/index.php";
  //http://161.97.73.229/backendGrainedor/public/index.php
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
     return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
   }
    // getUsers est une fonction pour obtenir la liste des utilisateur
    public getUsers(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/admin/getUsersByDependsOn";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
     // getUsersAdmin est une fonction pour obtenir la liste des utilisateur
     public getUsersAdmin(): Promise<any>{
      let params//="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/service/getUsersByAdmin";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    } 
    public getUsersByAccessLevel(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/service/getUsersByAccessLevel";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
    // deleteUser pour supprimer un uttilisateur
    public deleteUser(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/admin/deleteUser";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
     // updateUser pour modifier un uttilisateur
     public updateUser(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/admin/updateUser";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
    // getCommande pour obtenir les commandes
    public getCommande(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/admin/getCommandes";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
     // getCommandeByCaissier pour obtenir les commandes par caissier
     public getCommandeByCaissier(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/admin/getCommandesByIdCaissier";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
     // updateEtat pour modifier les etats des commandes
     public updateEtat(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/service/updateEtat";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
    // remiseSurFileDattente pour remettre le livreur sur la fil d'attente
    public remiseSurFileDattente(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/service/remiseSurFileDattente";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    } 
    // resetPassword pour réinitaliser le mot de passe de l'utilisateur
    public resetPassword(param): Promise<any>{
      let params="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/service/updatePassword";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
    
    // getCompense pour obtenir la compense BBS
    public getCompense(): Promise<any>{
      let params//="param="+JSON.stringify(param);
      console.log(params);
      
      let link=this.url+"/service/getCompense";
      return this.http.post(link,params,{headers:this.header}).toPromise().then( res => { return res} ).catch(error => {console.log(error); return 'bad' });
    }
}
