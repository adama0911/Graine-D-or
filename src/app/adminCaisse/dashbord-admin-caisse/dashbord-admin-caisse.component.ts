import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Config } from 'protractor';
import { AdminGeneralService } from 'src/app/services/adminGeneral/admin-general.service';
@Component({
  selector: 'app-dashbord-admin-caisse',
  templateUrl: './dashbord-admin-caisse.component.html',
  styleUrls: ['./dashbord-admin-caisse.component.scss']
})
export class DashbordAdminCaisseComponent implements OnInit {

  public configuration: Config;
  public columns: Columns[];
  dd;
  df;
  selected;
  nbrCommandes = 0;
  soldeGraineDor = 0;
  soldeCompenseBBS = 0;
  motcle;
 loading:boolean = true;
  p;
  listeSave;
  audio

  displayDate(date){ 
    if(date != ""){
      return new Date(date).toLocaleString();
    }
    
  }
  displayPanier(arg){
    if(arg != null || arg != undefined || arg != ""){
      let panier = JSON.parse(arg);
      let toDisplay = ""
      for(let i of panier){
        toDisplay = toDisplay+"\n"+i.qte+" "+i.article+", "
      }
      return toDisplay
    }else{
      return "";
    }
    
  }
  searchAll = () => {
    let value = this.motcle;
    console.log("PASS", { value });
  
    const filterTable = this.listeSave.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    console.log(this.data)
    this.data = filterTable;
  }
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
  constructor(private _serviceAdmin:AdminGeneralService) { 
   
  }
  @ViewChild('panier', { static: true }) panier: TemplateRef<any>;
  @ViewChild('monnaiePrepa', { static: true }) monnaiePrepa: TemplateRef<any>;
  @ViewChild('livreur', { static: true }) livreur: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;  
  public data = [ ];
  monnairePrpa(mtt1 ,mtt2){
    let somme = parseInt(mtt1)+parseInt(mtt2);
    let temp = somme/10000;
    let temp1 = temp.toString().split('.')[0];
    temp1 = temp1 + 1;
    let monnaie = parseInt(temp1) * 10000;
    return monnaie - somme;
  }
  encoursLivraison(){
    this.loading = true;

    //$param->user,$param->idCommande,$param->oldstate,$param->newstate
      this._serviceAdmin.updateEtat({idCommande:this.selected.id,oldstate:this.selected.etat,newstate:"4",user:JSON.parse(sessionStorage.getItem('currentUser')).login}).then(res=>{
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
              this.showMoodalNotifEncours();

            }else{
              this.loading = false;

            }
            
            
          })
      
        }else{
          this.loading = false;

        }
      })
    
   
  }
  payer(){
    this.loading = true;

    //$param->user,$param->idCommande,$param->oldstate,$param->newstate
      this._serviceAdmin.updateEtat({idCommande:this.selected.id,oldstate:this.selected.etat,newstate:"5",user:JSON.parse(sessionStorage.getItem('currentUser')).login}).then(res=>{
        if(res.status == 1){
          if(this.displayData(this.selected.livreur,'login') != ""){
            this._serviceAdmin.remiseSurFileDattente({login:this.displayData(this.selected.livreur,'login')}).then(res=>{
              console.log(res)
            })
          }
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
              this.showMoodalNotifPayer();
            }else{
              this.loading = false;

            }
            
            
          })
      
        }else{
          this.loading = false;

        }
      })
    
   
  }
  recherche(){
    this.loading = true;

    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommandeByCaissier({debut:dateDebut,fin:dateFin,idCaissier:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
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
        this.data = res.data.reverse()
        this.listeSave = res.data.reverse()
        this.loading = false;
      }else{
        this.loading = false;
      }
      
      
    })
    setInterval(()=>{
      console.log('inside intervalle')
      let d = (new Date().toJSON()).split("T")[0]
      let f = (new Date().toJSON()).split("T")[0]
      let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
      let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
      this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
        console.log(res);
        if(res.status == 1){
          this.calculeForBashbord(res.data)
          this.data = res.data.reverse()
          this.listeSave = res.data.reverse()
          this.loading = false;
          //this.audio = new Audio();
          //this.audio.src ='../../assets/hangouts_message_1.mp3';
          //this.audio.play();
        }else{
          this.loading = false;
        }
        
        
      })
    },10000)

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
        if(nom =="login"){
        return ob.login;
      }
      if(nom =="accesslevel"){
        return ob.accesslevel;
      }
      return "";
    }else{
      return obj;
    }
   
  }
  showMoodalEncours(){
    document.getElementById('id0Encours').style.display = "block";
  }
  hideMoodalEncours(){
    document.getElementById('id0Encours').style.display = "none";
  }
  showMoodalPayer(){
    document.getElementById('id0Payer').style.display = "block";
  }
  hideMoodalPayer(){
    document.getElementById('id0Payer').style.display = "none";
  }
  
  showMoodalNotifEncours(){
    document.getElementById('id0Encours').style.display = "block";
    setTimeout(()=>{
      document.getElementById('id0Encours').style.display = "none";
    },5000)
  }
  showMoodalNotifPayer(){
    document.getElementById('id0Payer').style.display = "block";
    setTimeout(()=>{
      document.getElementById('id0Payer').style.display = "none";
    },5000)
  }
  hideMoodalPayerNotif(){
    document.getElementById('id0Payer').style.display = "none";
  }
  hideMoodalEncoursNotif(){
    document.getElementById('id0Encours').style.display = "none";
  }
}
