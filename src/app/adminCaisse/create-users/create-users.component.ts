import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faTruckMonster } from '@fortawesome/free-solid-svg-icons';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Config } from 'protractor';
import { DataItem } from 'src/app/interfaces/dataItem.object';
import { AdminGeneralService } from 'src/app/services/adminGeneral/admin-general.service';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.scss']
})
export class CreateUsersComponent implements OnInit {
  /*
  *Les variables déclaré localement
  */
  prenom
  nom
  adresse
  telephone
  identifiant
  etapeDisplay:number = 1;
  searchValue = '';
  visible = false;
  typeUser
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
  consolelog(){
    console.log(this.selected)
  }
  /**
   * createUser permet de créer un utilisateur (vendeuse ou livreur)
   */
  createUser(){
    this.loading = true;
    this.badPhoneNumber = false;
    if(!this.checkTelephone(this.telephone)){
      this.loading = false;
      this.badPhoneNumber = true
    }else{
      let accesslevel 
      if(this.typeUser == "vendeuse"){
        accesslevel = 3
      }
      if(this.typeUser == "livreur"){
        accesslevel = 4
      }
      this._serviceAdmin.createUser({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id,prenom:this.prenom,nom:this.nom,login:this.identifiant,telephone:this.telephone,adresse:this.adresse,accesslevel:accesslevel}).then(res=>{
        console.log(res);
        if(res['status'] == 1){
         //this.etapeDisplay = 1;
            this.loading = false;
            this.errorCode = 2;
            this.errorMessage = "créations effectué avec succés";
            this.reinitialiser()
        }else{
          this.loading = false;
          this.errorCode = 1;
          this.errorMessage = res.message;
        }
      });
    }
    this.hideNotifAdd()

    //this.data.push({prenom:this.prenom,nom:this.nom,login:this.identifiant,telephone:this.telephone,adresse:this.adresse,action:"Valider"})
  }
  /**
   * updateUser permet de modifier un utilisateur
   */
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
          
            this.loading = false;
            this.errorCode = 2;
            this.errorMessage = "Modification effectué avec succés";
          
        }else{
          this.loading = false;
          this.errorCode = 1;
          this.errorMessage = res.message;

        }
      })
    
    }
    this.hideNotifUpdate()
  }
  /**
   * deleteUser permet de supprimer
   * @param selected  l'obejet à supprimer
   */
  deleteUser(){
    
  
    this.loading = true;
    this._serviceAdmin.deleteUser({login:this.selected.login}).then(res=>{
      if(res['status'] == 1){
        this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
          console.log(res)
          this.data = res['users']
          this.loading = false;
          this.showMoodalNotif()

        })
      }else{
        this.loading = false;

      }
    })
    this.hideMoodal()
    
  }
  public data = [
    
  ];
  /**
   * getUsers permet d'obtenier la liste des users créer par lui
   */
  getUsers(){
    this.loading = true;
    this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
      console.log(res)
      this.data = res['users']
      this.loading = false;
    })
  }
  /**
   * 
   * @param tel numéro de téléphone à verifier (si c'est un numéro de 9 chiffre)
   * @returns true si ok ou false si non ok
   */
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
  /**
   * reinitialiser reinitialisé après création
   */
  reinitialiser(){
    this.prenom = undefined;
    this.nom = undefined;
    this.adresse = undefined;
    this.telephone = undefined;
    this.typeUser = undefined;
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
  showMoodal(){
    document.getElementById('id01').style.display = "block";
  }
  hideMoodal(){
    document.getElementById('id01').style.display = "none";
  }
  hideMoodalNotif(){
    document.getElementById('id02').style.display = "none";

  }
  showMoodalNotif(){
    document.getElementById('id02').style.display = "block";
    setTimeout(()=>{
      document.getElementById('id02').style.display = "none";
    },5000)
  }
}
