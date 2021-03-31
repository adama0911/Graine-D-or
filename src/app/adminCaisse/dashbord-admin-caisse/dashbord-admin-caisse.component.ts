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
  dataToDisplay = [];
  listPanierToPrint =[]
  handlePanier(arg){
    console.log(arg)
    this.listPanierToPrint = [] 
    this.listPanierToPrint = JSON.parse(arg);
    console.log(this.listPanierToPrint)
    //this.print()
  }
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
        etatPaiment1 = "payée"
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
  displayDate(date){ 
    if(date != ""){
      return new Date(date).toLocaleString();
    }
    
  }
  currencyFormat(somme) : String{
    return Number(somme).toLocaleString() ;
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
  searchAll = () => {
    let value = this.motcle;
  
    const filterTable = this.listeSave.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    this.dataToDisplay = filterTable;
  }
  calculeForBashbord(arg){
    this.nbrCommandes = 0;
    this.soldeGraineDor = 0;
    this.soldeCompenseBBS = 0;

    this.nbrCommandes = arg.length;
    for(let i of arg){
      let somme =  parseInt(i.montant) ;
      this.soldeGraineDor = this.soldeGraineDor + somme;
      if(i.mode_paiement == 3){
        let somme =  parseInt(i.montant) ;
        this.soldeCompenseBBS = this.soldeCompenseBBS + somme;     
      }
    }
  }

  constructor(private _serviceAdmin:AdminGeneralService) { 
    
  }
  displayDate1(){
    return new Date().toLocaleString()
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
            if(res.status == 1){
              this.calculeForBashbord(res.data)
              let d = res.data.reverse()
              this.data = d
              this.listeSave = d
              this.formateData(d)
              this.loading = false;
              this.hideMoodalEncours();
              this.showMoodalprint();
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
            if(res.status == 1){
              this.calculeForBashbord(res.data)
              let d = res.data.reverse()
              this.data = d
              this.listeSave = d
              this.formateData(d)
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
  print() {
    /* this.printService.init()
             .setBold(true)
             .writeLine('Hello World!')
             .setBold(false)
             .feed(4)
             .cut('full')
             .flush();
             console.log(this.printService)*/
             let printContents, popupWin;
             printContents = document.getElementById("invoice").innerHTML;
             for(let i = 0;i<3;i++){
              
                let w =window.open();
                 w.document.write(`
                 <html>
                     <head>
                         <style>
                             //........Customized style.......
                            
                         </style>
                     </head>
                     <body onload="window.print();window.close()">${printContents} <br/><br/><br/><br/></body>
                 </html>`);
                 w.print();
                 w.close();
             }
    
 
   }
 
  recherche(){
    this.loading = true;

    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommandeByCaissier({debut:dateDebut,fin:dateFin,idCaissier:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
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
  }
  periodiqueChecker:any;
  ngOnDestroy(){
    clearInterval(this.periodiqueChecker);
  }
  ngOnInit(): void {
    this.loading = true;
    this.dd = (new Date().toJSON()).split("T")[0]
    this.df = (new Date().toJSON()).split("T")[0]
    let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
    let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
    this._serviceAdmin.getCommandeByCaissier({debut:dateDebut,fin:dateFin,idCaissier:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
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
    this.periodiqueChecker = setInterval(()=>{
      let d = (new Date().toJSON()).split("T")[0]
      let f = (new Date().toJSON()).split("T")[0]
      let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
      let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
      this._serviceAdmin.getCommandeByCaissier({debut:dateDebut,fin:dateFin,idCaissier:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
        console.log(res)
        if(res.status == 1){
          console.log(this.listeSave.length+" "+res.data.length)
         
            this.calculeForBashbord(res.data)
            let d = res.data.reverse()
            this.data = d
            this.listeSave = d
            this.formateData(d)
          if(this.listeSave.length < res.data.length){
            this.loading = false;
            this.audio = new Audio();
            this.audio.src ='../../assets/hangouts_message_1.mp3';
            this.audio.play();
          }
         
        }else{
          this.loading = false;
        }
        
        
      })
    },20000)

  }
  displayData(obj,nom){
    if(obj != ""){
      
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
    },1000)
  }
  showMoodalNotifPayer(){
    document.getElementById('id0Payer').style.display = "block";
    setTimeout(()=>{
      document.getElementById('id0Payer').style.display = "none";
    },1000)
  }
  hideMoodalPayerNotif(){
    document.getElementById('id0Payer').style.display = "none";
  }
  hideMoodalEncoursNotif(){
    document.getElementById('id0Encours').style.display = "none";
  }
  
  showMoodalprint(){
    document.getElementById('print').style.display = "block";
  }
  hideMoodalprint(){
    document.getElementById('print').style.display = "none";
  }

  
  showMoodalannuler(){
    document.getElementById('annuler').style.display = "block";
  }
  hideMoodalannuler(){
    document.getElementById('annuler').style.display = "none";
  }
  hideMoodalannulerNotif(){
    document.getElementById('annulerNotif').style.display = "block";
    setInterval(()=>{
      document.getElementById('annulerNotif').style.display = "none";
    },3000)
    
  }
  cancelCommande(){
    this.loading = true;
    //$param->user,$param->idCommande,$param->oldstate,$param->newstate
      this._serviceAdmin.updateEtat({idCommande:this.selected.id,oldstate:this.selected.etat,newstate:"-1",user:JSON.parse(sessionStorage.getItem('currentUser')).login}).then(res=>{
        if(res.status == 1){
          this.dd = (new Date().toJSON()).split("T")[0]
          this.df = (new Date().toJSON()).split("T")[0]
          let dateDebut = this.dd.split('-')[2]+"/"+this.dd.split('-')[1]+"/"+this.dd.split('-')[0]
          let dateFin = this.df.split('-')[2]+"/"+this.df.split('-')[1]+"/"+this.df.split('-')[0]
          this._serviceAdmin.getCommandeByCaissier({debut:dateDebut,fin:dateFin,idCaissier:JSON.parse(sessionStorage.getItem('currentUser')).id}).then(res=>{
            console.log(res);
            if(res.status == 1){
              this.calculeForBashbord(res.data)
              this.data = res.data.reverse()
              this.listeSave = res.data.reverse()

              this.loading = false;
              this.hideMoodalannulerNotif();
            }else{
              this.loading = false;
            }
            
            
          })
      
        }
      })
    
   
  }
}
