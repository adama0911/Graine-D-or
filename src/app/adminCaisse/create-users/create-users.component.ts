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
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  constructor(private _serviceAdmin:AdminGeneralService) { 
   
  }
  consolelog(){
    console.log(this.selected)
  }
  createUser(){
    this.loading = true;
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
        this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
          console.log(res)
          this.data = res['users']
          this.etapeDisplay = 1;
          this.loading = false;

        })
      }else{
        this.loading = false;
      }
    });
    //this.data.push({prenom:this.prenom,nom:this.nom,login:this.identifiant,telephone:this.telephone,adresse:this.adresse,action:"Valider"})
  }
  updateUser(){
    this.loading = true;

    this._serviceAdmin.updateUser({prenom:this.selected.prenom,nom:this.selected.nom,telephone:this.selected.telephone,adresse:this.selected.adresse,login:this.selected.login}).then(res=>{
      console.log(res)
      if(res['status'] == 1){
        this._serviceAdmin.getUsers({depends_on:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
          console.log(res)
          this.data = res['users']
          this.etapeDisplay = 1;
           this.loading = false;

        })
      }else{
        this.loading = false;

      }
    })
    
  }
  deleteUser(arg){
    
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

}
