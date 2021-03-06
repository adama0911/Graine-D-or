import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Config } from 'protractor';
import { AdminGeneralService } from 'src/app/services/adminGeneral/admin-general.service';
@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {

  public configuration: Config;
  public columns: Columns[];
  dd;
  df;
  nbrCommandes = 0;
  soldeGraineDor = 0;
  soldeCompenseBBS = 0;
  loading:boolean = false;
  selected;
  motcle;
  listeSave;
  p;
  audio:any;
  dataToDisplay = [];
  userFiltre;
  listLivreur;
  listCaisse;
  listVendeuse;
  
  formateData(arg){
  this.dataToDisplay = [];

    for(let i of arg){
      let paiement = "";
      let recuperation = ""
      if(i.mode_paiement == 1){
        paiement = "en ligne"
      }else{
        paiement = "à la livaison"
      }
      if(i.recuperation == 1){
        recuperation = "à livrer"
      }else{
        recuperation = "sur place"
      }
      let mtt = parseInt(i.montant)-parseInt(i.frais_livraison)
      this.dataToDisplay.push({
        id:i.id,
        date:i.created_at,
        commande:i.refCommande,
        livreur:i.livreur,
        caissier:i.caissier,
        vendeuse:i.vendeuse,
        client:i.numero_client,
        montant:parseInt(i.montant)-parseInt(i.frais_livraison),
        fraisLivraison:parseInt(i.frais_livraison),
        paiement:paiement,
        recuperation:recuperation,
        etat:i.etat,
        panier:i.designation,
        monnaiePrepa:this.monnairePrpa(mtt,i.frais_livraison)
      })
      this.calculeForBashbord(this.dataToDisplay)
    }
    console.log(this.dataToDisplay)
    this.listeSave = this.dataToDisplay
  }
  calculeForBashbord(arg){
    this.nbrCommandes = 0;
    this.soldeGraineDor = 0;
    this.soldeCompenseBBS = 0;

    this.nbrCommandes = arg.length;
    for(let i of arg){
      let somme =  parseInt(i.montant);
      this.soldeGraineDor = this.soldeGraineDor + somme;
      if(i.mode_paiement == 1){
        let somme =  parseInt(i.montant);
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

  onChange(arg){
    if(arg == ""){
      this.dataToDisplay = this.listeSave
    }else{
      this.dataToDisplay =[]
      for(let i of this.listeSave){
        if(this.displayData(i.livreur,'login') == arg){
          this.dataToDisplay.push(i)
        }
      }
      this.calculeForBashbord(this.dataToDisplay)

    }
  }
  onChange1(arg){
    if(arg == ""){
      this.dataToDisplay = this.listeSave
    }else{
      this.dataToDisplay =[]
      for(let i of this.listeSave){
        if(this.displayData(i.vendeuse,'login') == arg){
          this.dataToDisplay.push(i)
        }
      }
      this.calculeForBashbord(this.dataToDisplay)

    }
  }
  onChange2(arg){
    if(arg == ""){
      this.dataToDisplay = this.listeSave
    }else{
      this.dataToDisplay =[]
      for(let i of this.listeSave){
        if(this.displayData(i.caissier,'login') == arg){
          this.dataToDisplay.push(i)
        }
      }
      this.calculeForBashbord(this.dataToDisplay)

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
    this.dataToDisplay = filterTable;
  }
  monnairePrpa(mtt1 ,mtt2){
    let somme = parseInt(mtt1)+parseInt(mtt2);
    let temp = somme/10000;
    let temp1 = temp.toString().split('.')[0];
    let temp3 = parseInt(temp1) + 1;
    let monnaie = temp3 * 10000;
    return monnaie - somme;
  }
  formateNumClient(arg){
    if(arg.includes("+")){
      return arg.split("+")[1]
    } else{
      return arg
    }
    
  }
  public data = [
  
  ];
  cancelCommande(){
    this.loading = true;
    //$param->user,$param->idCommande,$param->oldstate,$param->newstate
      this._serviceAdmin.updateEtat({idCommande:this.selected.id,oldstate:this.selected.etat,newstate:"-1",user:JSON.parse(sessionStorage.getItem('currentUser')).login}).then(res=>{
        if(res.status == 1){
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
              this.showMoodalNotif()
            }else{
              this.loading = false;
            }
            
            
          })
      
        }
      })
    
   
  }
  currencyFormat(somme) : String{
    return Number(somme).toLocaleString() ;
  }
  recherche(){
    this.loading = true;
    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status == 1){
        let d = res.data.reverse()
        this.data = d
        this.listeSave = d
        this.formateData(d)

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
        
        let d = res.data.reverse()
        this.data = d
        this.listeSave = d
        this.formateData(d)
        this.loading = false;
      }else{
        this.loading = false;
      }
      
      
    })
    this._serviceAdmin.getUsersByAccessLevel({accesslevel:2}).then(res =>{
      console.log(res);
      this.listCaisse = res.status
    })
    this._serviceAdmin.getUsersByAccessLevel({accesslevel:3}).then(res =>{
      console.log(res);
      this.listVendeuse = res.status

      
    })
    this._serviceAdmin.getUsersByAccessLevel({accesslevel:4}).then(res =>{
      console.log(res);
      this.listLivreur = res.status

      
    })
  
  }
  displayPanier(arg){
    if(arg.includes("[{")){
      if(arg != null || arg != undefined || arg != ""){
        let panier = JSON.parse(arg);
        let toDisplay = ""
        for(let i of panier){
          toDisplay = toDisplay+""+i.qte+" "+i.article+" ,"
        }
        return toDisplay
      }else{
        return "";
      }
    }else{
      return arg;
    }
    
    
    
  }
 
  displayDate(date){ 
    if(date != ""){
      return new Date(date).toLocaleString();
    }
    
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
      if(nom =="id"){
        return ob.identifiant;
      }
      if(nom =="login"){
        return ob.login;
      }
      return "";
    }else{
      return obj;
    }
   
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
