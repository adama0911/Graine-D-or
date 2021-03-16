import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Config } from 'protractor';
import { DataItem } from 'src/app/interfaces/dataItem.object';
import { AdminGeneralService } from 'src/app/services/adminGeneral/admin-general.service';


@Component({
  selector: 'app-create-caisse',
  templateUrl: './create-caisse.component.html',
  styleUrls: ['./create-caisse.component.scss']
})
export class CreateCaisseComponent implements OnInit {

  prenom
  nom
  adresse
  telephone
  identifiant
  etapeDisplay:number = 1;
  searchValue = '';
  visible = false;

  selected 

  public configuration: Config;
  public columns: Columns[];
  loading:boolean = false;
  errorCode:number = 0;
  errorMessage = "";
  badPhoneNumber:boolean = false;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  constructor(private _serviceAdmin:AdminGeneralService) { 
   
  }
  retry($event){
    this.badPhoneNumber = false;
  }
  consolelog(){
    console.log(this.selected)
  }
  checkTelephone(tel){
    if(tel == null || tel == ""){
      return false;
    }
    let numero=tel.split("");
    console.log(numero.length);
    if(numero.length!=parseInt("9")){
      return false;
    }
    if(numero[0] != "7"){
      return false;
    }


    for(let i=0;i<numero.length;i++){
      if(!this.isNumber(numero[i])){
        return false;
      }
    }
    return true;
  }
  isNumber(num:string):boolean{
    let tab=["0","1","2","3","4","5","6","7","8","9"];
    for(let i=0;i<tab.length;i++){
      if(num===tab[i]){
        return true;
      }
    }
    return false;
  }
  createUser(){
    this.loading = true;
    this.badPhoneNumber = false;
    if(!this.checkTelephone(this.telephone)){
      this.loading = false;
      this.badPhoneNumber = true
    }else{
      
    this._serviceAdmin.createUser({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id,prenom:this.prenom,nom:this.nom,login:this.identifiant,telephone:this.telephone,adresse:this.adresse,accesslevel:2}).then(res=>{
      if(res['status'] == 1){
        this.errorCode = 2;
        this.errorMessage = "créations effectué avec succés";
        this.loading = false;
        this.reinitialiser()

      }else{
        this.errorCode = 1;
        this.errorMessage = res.message;
        this.loading = false;

      }   
     });
    }
    this.hideNotifAdd()
    //this.data.push({prenom:this.prenom,nom:this.nom,login:this.identifiant,telephone:this.telephone,adresse:this.adresse,action:"Valider"})
  }
  updateUser(){
    this.loading = true;
    this.badPhoneNumber = false;
    if(!this.checkTelephone(this.selected.telephone)){
      this.loading = false;
      this.badPhoneNumber = true
    }else{
      this._serviceAdmin.updateUser({prenom:this.selected.prenom,nom:this.selected.nom,telephone:this.selected.telephone,adresse:this.selected.adresse,login:this.selected.login}).then(res=>{
        console.log(res)
        if(res['status'] == 1){
         // this.etapeDisplay = 1;
          //this.loading = false;
          this.errorCode = 2;
          this.errorMessage = "Modification effectué avec succés";
         
          //this._serviceAdmin.getUsers({depends_on:2}).then(res=>{
           // console.log(res)
            //this.data = res['users']
            //this.etapeDisplay = 1;
            this.loading = false;
            
            
           
          //})
        }else{
          this.loading = false;
          this.loading = false;
          this.errorCode = 1;
          this.errorMessage = res.message;
        }
      })
    }

    this.hideNotifUpdate()
  }
  deleteUser(arg){
    console.log(arg)
    if(confirm('Vous allez supprimé cette utilisateur')){
      this.loading = true;
      this._serviceAdmin.deleteUser({login:arg.login}).then(res=>{
        if(res['status'] == 1){
          this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
            console.log(res)
            this.data = res['users']
            this.loading = false;

          })
        }else{
          this.loading = false;

        }
      })
    }
    
  }
  public data = [
    
  ];

  getUsers(){
    this.loading = true;

    this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
      console.log(res)
      this.data = res['users']
      this.loading = false;

    })
  }
  ngOnInit(): void {
    this.loading = true;

    this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
      console.log(res)
      this.data = res['users']
      this.loading = false;

    })
    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'prenom', title: 'PRENOM' },
      { key: 'nom', title: 'NOM' },
      { key: 'telephone', title: 'TELEPHONE' },
      { key: 'adresse', title: 'ADRESSE' },
      { key: 'login', title: 'LOGIN' },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];
  }
  reinitialiser(){
    this.prenom = undefined;
    this.nom = undefined;
    this.adresse = undefined;
    this.telephone = undefined;
    this.identifiant = undefined;
    
  }
  hideNotifAdd(){
    setTimeout(()=>{
      this.errorCode = 0;
    },5000);
  }
  hideNotifUpdate(){
    setTimeout(()=>{
      this.errorCode = 3;
    },5000);
  }

}
