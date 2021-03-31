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
  selected;
  motcle;
  listeSave;
  p;
  audio:any;
  dataToDisplay = [];
  formateData(arg){
  this.dataToDisplay = [];

    for(let i of arg){
      let paiement = "";
      let recuperation = ""
      let etatPaiment1 = "" 
      if(i.mode_paiement == 1){
        paiement = "sentoolpay"
      }else{
        paiement = "à la livaison"
      }
      if(i.recuperation == 1){
        recuperation = "à livrer"
      }else{
        recuperation = "sur place"
      }
      
      if(i.etatPaiment == 0){
        etatPaiment1 = "en attente"
      }else if(i.etatPaiment == 1){
        etatPaiment1 = "payer"
      }else{
        etatPaiment1 =  "Echec"
      }
      let mtt = parseInt(i.montant)-parseInt(i.frais_livraison)
      this.dataToDisplay.push({
        id:i.id,
        date:i.created_at,
        commande:i.refCommande,
        livreur:i.livreur,
        client:i.numero_client,
        vendeuse:i.vendeuse,
        caissier:i.caissier,
        montant:parseInt(i.montant)-parseInt(i.frais_livraison),
        fraisLivraison:parseInt(i.frais_livraison),
        paiement:paiement,
        recuperation:recuperation,
        etat:i.etat,
        panier:i.designation,
        monnaiePrepa:this.monnairePrpa(mtt,i.frais_livraison),
        etatPaiment:etatPaiment1
      })

    }
    console.log(this.dataToDisplay)
    this.listeSave = this.dataToDisplay
  }
  calculeForBashbord(arg){
    this.nbrCommandes = 0;
    this.soldeGraineDor = 0;

    this.nbrCommandes = arg.length;
    for(let i of arg){
      let somme =  parseInt(i.montant) + parseInt(i.frais_livraison);
      this.soldeGraineDor = this.soldeGraineDor + parseInt(i.montant);
     
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
        this.calculeForBashbord(res.data)
        let d = res.data.reverse()
        this.data = d
        this.listeSave = d
        this.formateData(d)

        this.loading = false;

      }else{
        this.loading = false;

      }
      
      
    })
    this._serviceAdmin.getCompense().then(res =>{
      console.log(res)
      this.soldeCompenseBBS = res.compense
    })
  }
  periodiqueChecker:any;
  ngOnDestroy(){
    clearInterval(this.periodiqueChecker);
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
        let d = res.data.reverse()
        this.data = d
        this.listeSave = d
        this.formateData(d)
        this.loading = false;
      }else{
        this.loading = false;
      }
      
      
    })
    this._serviceAdmin.getCompense().then(res =>{
      console.log(res)
      this.soldeCompenseBBS = res.compense
    })
     this.periodiqueChecker = setInterval(()=>{
      let d = (new Date().toJSON()).split("T")[0]
      let f = (new Date().toJSON()).split("T")[0]
      let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
      let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
      this._serviceAdmin.getCommande({debut:dateDebut,fin:dateFin}).then(res=>{
        //console.log(res.data);
       
        if(res.status == 1){
          this.calculeForBashbord(res.data)
          let d = res.data.reverse()
          this.data = d
          this.listeSave = d
          this.formateData(d)
          this.loading = false;
          if(this.listeSave.length < res.data.length){
            console.log("Fiiiiiiiii")
            this.loading = false;
            this.audio = new Audio();
            this.audio.src ='../../assets/hangouts_message_1.mp3';
            this.audio.play();
          }
        }else{
          this.loading = false;
        }
        
        
      })
      this._serviceAdmin.getCompense().then(res =>{
        console.log(res)
        this.soldeCompenseBBS = res.compense
      })
    },20000)

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
