import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';


import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { commandeItem } from '../interfaces/commandeItem.interface';
import { ConfigService } from 'src/app/services/Config.service';
import { VendeurService } from 'src/app/services/vendeur.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';





@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {

  public configuration: Config;
  public columns: Columns[];
  closeResult = '';
  public login = null;
  public password = null;
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true
  public loading = false;
  public loadingModal = false;
  motcle = null;
  p: number = 1;
  currentCom = {};
  currentLivreur:any;
  modalEtat = '2';
  listLivreurs = [];
  refSetInterval : any;

  modalOK(com,etat){
    this.showMoodal();
    this.currentCom = com;
    this.modalEtat = etat;
  }

  constructor (private router:Router,private _vendeurService:VendeurService){

  }

  /**
   * @var data: tableau de commandes qui change par raport aux manipulations faites sur la tableau dataSave
   * @return dataSave : tableau de livreurs fixe
   **/
  public data:commandeItem[] = [];
  public dataSave:commandeItem[] = [];


  /**
   * @param objString: Objet JSON qui represent un utilisateur 
   * @return : renvoi  le nom complet de l'utilisateur
   * @function: renvoi le nom complet de l'utilisateur  a partir de l'objet
  **/
  prenomComplet (objString:string){
    let obj:any;
    if(objString.trim()!=''){
      obj = JSON.parse(objString);
      return obj.prenom +' '+ obj.nom;
    }
    return "";
  }

  /**
   * @param: 0
   * @return: 0
   * @function: Rechercher dans le tabeau
   **/
  searchAll = () => {
    let value = this.motcle;
    console.log("PASS", { value });
  
    const filterTable = this.dataSave.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    this.data = filterTable;
  }

  changerEtatCommander(commande:any,etat:string){
    this.loading = true;
    this.hideMoodal();
    console.log(commande);
    console.log({user:(JSON.parse(sessionStorage.getItem('currentUser'))).login,idCommande:commande.id,oldstate:commande.etat,newstate:parseInt(etat)});
    this._vendeurService.updateEtat({user:(JSON.parse(sessionStorage.getItem('currentUser'))).login,idCommande:commande.id,oldstate:commande.etat,newstate:parseInt(etat)}).then(res=>{
      console.log(res);
      this.getCommandes();
    })
  }

  assignerCommande(currentCom,currentLivreur){
    this.loadingModal=true;
    console.log({idCommande:currentCom.id,idLivreur:currentLivreur})
    this._vendeurService.assigner({idCommande:currentCom.id,idLivreur:currentLivreur}).then(res=>{
      if(res.status==1){
        console.log("Assigner",res);
        this.loadingModal=false;
        this.hideMoodal();
        this.getCommandes();
      }else{
        console.log("Pas assigner",res);
      }
    })
  }

  /**
   * @param datas: tableau de Commandes reçu appret requette sur serveur
   * @return data : tableau formater pour l'affichage a l'ecran
   * @function: Formatage des données reçu du serveur
  **/
  parseDatas(datas){
    let data = [];

    (datas).forEach(element => {
        
        switch (element.etat) {
          case -1:
            element.etatText = 'Annulée'
          case 1:
            element.etatText = 'Enregistrée'
            break;
          case 2:
            element.etatText = 'Validée'
            break;
          case 3:
            element.etatText = 'Preparée'
            break;
          case 4:
            element.etatText = 'En cour de livraison'
            break;  
          case 5:
            element.etatText = 'Payée'
            break;  

        }

        switch (element.recuperation) {
          case 0:
            element.recuperationText = 'sur place'
            break;
          case 1:
            element.recuperationText = 'à livrer'
            break;
        }

        switch (element.mode_paiement) {
          case 1:
            element.paiementText = 'sentoolpay'
            break;
          case 3:
            element.paiementText = 'à la livraison'
            break;
        }
        switch (element.etatPaiment) {
          case 0:
            element.etatpaiementText = 'en attente'
            break;
          case 1:
            element.etatpaiementText = 'payée'
            break;
          case -1:
            element.etatpaiementText = 'echec'
            break;
        }

        data.push( 
          {
            id:element.id,
            date:new Date(element.created_at).toLocaleString(),
            commande: element.refCommande,
            designation: element.designation,
            livreur: this.prenomComplet(element.livreur),
            caissier: this.prenomComplet(element.caissier),
            adresse:element.adresse,
            client: element.numero_client,
            vendeuse: this.prenomComplet(element.vendeuse),
            montantCommande: element.montant,
            montantLivraison: element.frais_livraison,
            paiement: element.mode_paiement,
            etatpaiement: element.etatpaiementText,
            recuperation: element.recuperation,
            etat: element.etat,
            etatText: element.etatText,
            recuperationText:element.recuperationText,
            paiementText:element.paiementText,
            monnaie: this.monnairePrpa(element.montant,element.frais_livraison),
       
          });
    });

    console.log(data)
    return data;
  }

  displayPanier(arg){
    if(arg.includes('[{')){
      if(arg != null || arg != undefined || arg != ""){
        let panier = JSON.parse(arg);
        let toDisplay = ""
        for(let i of panier){
          toDisplay = toDisplay+" "+i.qte+" "+i.article+" ,"
        }
        return toDisplay
      }else{
        return "";
      }
    }else{
      return arg
    }
  }

  /**
   * @param: 
   * @return: frais
   * @function: Ouvre un modal
  **/
  showMoodal(){
    document.getElementById('idModal').style.display = "block";
  }

  /**
   * @param: 
   * @return: frais
   * @function: ferme un modal
  **/
  hideMoodal(){
    document.getElementById('idModal').style.display = "none";
  }

  currencyFormat(somme) : String{
    return Number(somme).toLocaleString() ;
  }

    /**
   * @param mtt1: montant 
   * @return mtt2 : frais
   * @function: calcul de la monnaie
  **/
  monnairePrpa(mtt1 ,mtt2){
    let somme = parseInt(mtt1)+parseInt(mtt2);
    let temp = somme/10000;
    let temp1 = temp.toString().split('.')[0];
    temp1 = temp1 + 1;
    let monnaie = parseInt(temp1) * 10000;
    return monnaie - somme;
  }


  exportToExcel(): void {
    // Here is simple example how to export to excel by https://www.npmjs.com/package/xlsx
    try {
      /* generate worksheet */
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
      /* save to file */
      XLSX.writeFile(wb, 'file.xlsx');
    } catch (err) {
      console.error('export error', err);
    }
  }

  // exportToCSV(): void {
  //   const options = {
  //     fieldSeparator: ',',
  //     quoteStrings: '"',
  //     decimalSeparator: '.',
  //     showLabels: true,
  //     showTitle: false,
  //     useTextFile: false,
  //     useBom: true,
  //     useKeysAsHeaders: true,
  //   };
  //   const csvExporter = new ExportToCsv(options);

  //   csvExporter.generateCsv(this.data);
  // }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.data = this.dataSave.slice(startItem, endItem);
  }
    
 
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
}


ngOnDestroy(){
  clearInterval(this.refSetInterval);

}
getLiv(){
  this.loading = true;
  this._vendeurService.getLivreurs({}).then(res=>{
    console.log(res.data);
    
    //this.data = this.dataSave = res.data;
     this.listLivreurs = this.parseDatasLivreurs(res.data);
     this.loading = false;
  })
}
  /**
   * @param:0
   * @return :0 
   * @function: methode appelé lorsque le component est pret
  **/
   audio
  ngOnInit(): void {

    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'commande', title: 'DATE' , },
      { key: 'commande', title: 'COMMANDE' , },
      { key: 'livreur', title: 'LIVREUR' },
      { key: 'client', title: 'CLIENT' },
      { key: 'montantCommande', title: 'MONTANT COMMANDE' },
      { key: 'montantLivraison', title: 'MONTANT LIVRAISON' },
      { key: 'paiement', title: 'MODE PAIEMENT' , },
      { key: 'paiement', title: 'ETAT PAIEMENT' , },
      //{ key: 'recuperation', title: 'RÉCUPÉRATION' , rationTpl},
      { key: 'etat', title: 'ETAT COMMANDE' , },
      { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' },
      { key: 'action', title: 'Actions' },
    ];

    this.getCommandes();

    this._vendeurService.getLivreurs({}).then(res=>{
      console.log(res.data);
      
      //this.data = this.dataSave = res.data;
       this.listLivreurs = this.parseDatasLivreurs(res.data);
    })

    this.refSetInterval = setInterval(()=>{
      let user =JSON.parse(sessionStorage.getItem('currentUser'));
      let dd = (new Date().toJSON()).split("T")[0]
      let df = (new Date().toJSON()).split("T")[0]
      let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
      let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
      this._vendeurService.getCommandes({idVendeuse:user.id,debut:dateDebut,fin:dateFin}).then(res=>{
        console.log(res);
        if(res.status==1){
          if(this.dataSave.length < res.data.length){
            this.loading = false;
            this.audio = new Audio();
            this.audio.src ='../../assets/hangouts_message_1.mp3';
            this.audio.play();
          }
          this.dataSave = this.data = (this.parseDatas(res.data)).reverse();

        }
      })
    },20000)

  }

  parseDatasLivreurs(datas){
    let data = [];
    datas.forEach(element => {
        switch(element.etat){
          case 1:
            element.etatText = 'pointé';
            break;
          case 0:
            element.etatText = 'non pointé'
        }

        if(element.etat==1){
          data.push( 
            {
  
              accesslevel: element.accesslevel,
              created_at: (new Date(element.created_at)).toLocaleDateString(),
              etat: element.etat,
              etatText:element.etatText,
              id: element.id,
              idUser:element.idUser,
              login:element.login,
              nom: element.nom,
              timestamp: element.timestamp,
              prenom: element.prenom,
              updated_at: (new Date(element.updated_at)).toLocaleDateString(),
          });
      
        }

      });
    //console.log(data)
    return data;
}


  getCommandes(){
    let user =JSON.parse(sessionStorage.getItem('currentUser'));
    this.loading = true;
    let dd = (new Date().toJSON()).split("T")[0]
    let df = (new Date().toJSON()).split("T")[0]
    let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
    let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
    this._vendeurService.getCommandes({idVendeuse:user.id,debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.dataSave = this.data = (this.parseDatas(res.data)).reverse();
        this.loading = false;
      }
    })
  }

}
