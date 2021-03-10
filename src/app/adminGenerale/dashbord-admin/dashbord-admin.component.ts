import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Config } from 'protractor';
import { AdminGeneralService } from 'src/app/services/adminGeneral/admin-general.service';
@Component({
  selector: 'app-dashbord-admin',
  templateUrl: './dashbord-admin.component.html',
  styleUrls: ['./dashbord-admin.component.scss']
})
export class DashbordAdminComponent implements OnInit {

  public configuration: Config;
  public columns: Columns[];
  dd;
  df;
  nbrCommandes = 0;
  soldeGraineDor = 0;
  soldeCompenseBBS = 0;
  loading:boolean = false;

  calculeForBashbord(arg){
    this.nbrCommandes = 0;
    this.soldeGraineDor = 0;
    this.soldeCompenseBBS = 0;

    this.nbrCommandes = arg.length;
    for(let i of arg){
      let somme =  parseInt(i.montant) + parseInt(i.frais_livraison);
      this.soldeGraineDor = this.soldeGraineDor + somme;
      if(i.mode_paiement == 1){
        let somme =  parseInt(i.montant) + parseInt(i.frais_livraison);
        this.soldeCompenseBBS = this.soldeCompenseBBS + somme;     
      }
    }
  }
  @ViewChild('panier', { static: true }) panier: TemplateRef<any>;
  @ViewChild('monnaiePrepa', { static: true }) monnaiePrepa: TemplateRef<any>;
  @ViewChild('livreur', { static: true }) livreur: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;
  constructor(private _serviceAdmin:AdminGeneralService,) { 
   
  }
  monnairePrpa(mtt1 ,mtt2){
    let somme = parseInt(mtt1)+parseInt(mtt2);
    let temp = somme/10000;
    let temp1 = temp.toString().split('.')[0];
    temp1 = temp1 + 1;
    let monnaie = parseInt(temp1) * 10000;
    return monnaie - somme;
  }
  public data = [
   /* {
      id:1,
      commande: '122',
      designation: "2 pains",
      livreur: 'Adama Goudiaby',
      client: "Abdoul Hamid",
      montantCommande: 500,
      montantLivraison: 2000,
      paiement: 1,
      recuperation: 1,
      etat: 1,
      monnaie: 100,
      action:'valider',
    },*/
  ];
  cancelCommande(arg){
    this.loading = true;
    //$param->user,$param->idCommande,$param->oldstate,$param->newstate
    if(confirm("Voulez-vous annulé cette commande")){
      this._serviceAdmin.updateEtat({idCommande:arg.id,oldstate:arg.etat,newstate:"-1",user:JSON.parse(sessionStorage.getItem('currentUser')).login}).then(res=>{
        if(res.status == 1){
          this.dd = (new Date().toJSON()).split("T")[0]
          this.df = (new Date().toJSON()).split("T")[0]
          let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
          let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
          this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
            console.log(res);
            if(res.status == 1){
              this.calculeForBashbord(res.data)
              this.data = res.data
              this.configuration = { ...DefaultConfig };
              this.configuration.searchEnabled = true;
              this.columns = [
                { key: 'commande', title: 'COMMANDE' , cellTemplate: this.panier},
                { key: 'livreur', title: 'LIVREUR', cellTemplate: this.livreur },
                { key: 'numero_client', title: 'CLIENT' },
                { key: 'montant', title: 'MONTANT COMMANDE' },
                { key: 'frais_livraison', title: 'MONTANT LIVRAISON' },
                { key: 'mode_paiement', title: 'PAIEMENT' , cellTemplate: this.paiementTpl},
                { key: 'recuperation', title: 'RÉCUPÉRATION' , cellTemplate: this.recuperationTpl},
                { key: 'etat', title: 'ETAT COMMANDE' , cellTemplate: this.etatTpl},
                { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' , cellTemplate: this.monnaiePrepa },
                { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
              ];
              this.loading = false;
            }else{
              this.loading = false;
            }
            
            
          })
      
        }
      })
    }
   
  }
  recherche(){
    this.loading = true;
    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status == 1){
        this.calculeForBashbord(res.data)
        this.data = res.data
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = true;
        this.columns = [
          { key: 'commande', title: 'COMMANDE' , cellTemplate: this.panier},
          { key: 'livreur', title: 'LIVREUR', cellTemplate: this.livreur },
          { key: 'numero_client', title: 'CLIENT' },
          { key: 'montant', title: 'MONTANT COMMANDE' },
          { key: 'frais_livraison', title: 'MONTANT LIVRAISON' },
          { key: 'mode_paiement', title: 'PAIEMENT' , cellTemplate: this.paiementTpl},
          { key: 'recuperation', title: 'RÉCUPÉRATION' , cellTemplate: this.recuperationTpl},
          { key: 'etat', title: 'ETAT COMMANDE' , cellTemplate: this.etatTpl},
          { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' , cellTemplate: this.monnaiePrepa },
          { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
        ];
        this.loading = false;

      }else{
        this.loading = false;

      }
      
      
    })
  }
  ngOnInit(): void {
    this.loading = true;
    console.log(JSON.parse(sessionStorage.getItem('currentUser')).id)
    this.dd = (new Date().toJSON()).split("T")[0]
    this.df = (new Date().toJSON()).split("T")[0]
    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status == 1){
        this.calculeForBashbord(res.data)
        this.data = res.data
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = true;
        this.columns = [
          { key: 'commande', title: 'COMMANDE' , cellTemplate: this.panier},
          { key: 'livreur', title: 'LIVREUR', cellTemplate: this.livreur },
          { key: 'numero_client', title: 'CLIENT' },
          { key: 'montant', title: 'MONTANT COMMANDE' },
          { key: 'frais_livraison', title: 'MONTANT LIVRAISON' },
          { key: 'mode_paiement', title: 'PAIEMENT' , cellTemplate: this.paiementTpl},
          { key: 'recuperation', title: 'RÉCUPÉRATION' , cellTemplate: this.recuperationTpl},
          { key: 'etat', title: 'ETAT COMMANDE' , cellTemplate: this.etatTpl},
          { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' , cellTemplate: this.monnaiePrepa },
          { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
        ];
        this.loading = false;
      }else{
        this.loading = false;
      }
      
      
    })

  }
  displayData(obj,nom){
    if(obj.includes("{")){
      let ob = JSON.parse(obj);
      if(nom =="nom"){
        return ob.nom;
      }
      if(nom =="prenom"){
        return ob.prenom;
      }
          if(nom =="identifiant"){
        return ob.identifiant;
      }
      if(nom =="accesslevel"){
        return ob.accesslevel;
      }
      return "";
    }else{
      return obj;
    }
   
  }
}
