import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Router } from '@angular/router';


import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { commandeItem } from '../interfaces/commandeItem.interface';
import { ConfigService } from 'src/app/services/Config.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { VendeurService } from 'src/app/services/vendeur.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];
  closeResult = '';
  public login = null;
  public password = null;
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true
  montantTotal = 0;
  public loading = false;
  motcle = null;
  debut = null;
  fin = null;
  p: number = 1;
  dataChart = [];
  refSetInterval:any;

  @ViewChild('panier', { static: true }) panier: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor (private router:Router,private _confService:ConfigService,private _vendeurService:VendeurService){

  }

  /**
   * @var data: tableau de commandes qui charge par raport aux manipulations faites sur la tableau dataSave
   * @return dataSave : tableau de livreurs fixe
   **/
  public data:commandeItem[] = [];
  public dataSave:commandeItem[] = [];

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };


  barChartLabels = ['1-5', '5-10', '10-15', '15-20', '20-25', '25-30'];
  barChartType = 'bar';
  barChartLegend = true;

  barChartData = [
    {data: [65, 59, 80, 81, 56, 55], label: 'nombre commandes'},
    {data: [28, 48, 40, 19, 86, 27], label: 'montant'}
  ];


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

  currencyFormat(somme) : String{
    return Number(somme).toLocaleString() ;
  }

  beforeDestroy() {
    clearInterval(this.refSetInterval);
  }

  barChartDatas(data){
    let jour:number;
    this.barChartData = [
      {data: [0, 0, 0, 0, 0, 0], label: 'nombre commandes'},
      {data: [0, 0, 0, 0, 0, 0], label: 'montant'}
    ];
    data.forEach(element => {
      if(element.etat==5){
        jour = parseInt((new Date(element.created_at).toLocaleDateString().split('/'))[0]) ;
        if (jour <=5){
          (this.barChartData[0]).data[0] += 1;
          (this.barChartData[1]).data[0] += element.montant; 
        }
        else if(jour > 5  &&  jour <=10 ){
          (this.barChartData[0]).data[1] += 1;
          (this.barChartData[1]).data[1] += element.montant; 
        }
        else if(jour > 10  &&  jour <=15 ){
          (this.barChartData[0]).data[2] += 1;
          (this.barChartData[1]).data[2] += element.montant; 
        }
        else if(jour > 15  &&  jour <=20 ){
          (this.barChartData[0]).data[3] += 1;
          (this.barChartData[1]).data[3] += element.montant; 
        }
        else if(jour > 20  &&  jour <=25 ){
          (this.barChartData[0]).data[4] += 1;
          (this.barChartData[1]).data[4] += element.montant; 
        }
        else if(jour > 25  &&  jour <=31){
          (this.barChartData[0]).data[5] += 1;
          (this.barChartData[1]).data[5] += element.montant; 
        }
      }
    });
  }

  validerRechercheInterval(){
    console.log({debut:(new Date(this.debut)).toLocaleDateString(),fin:(new Date(this.fin)).toLocaleDateString()})

    this.loading = true;
    this._vendeurService.getCommandes({debut:(new Date(this.debut)).toLocaleDateString(),fin:(new Date(this.fin)).toLocaleDateString()}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.dataSave = this.data = this.parseDatas(res.data);
        if(this.dataSave.length!=0){
          this.loading = false;
        }
      }
    }).catch(err => {
      this.loading = false;
    })
  }

  oughnutChartDatas(data){
    let jour:number;
    this.doughnutChartData = [0, 0, 0, 0];
    data.forEach(element => {
      if(element.etat==5){
        jour = parseInt((new Date(element.created_at).toLocaleDateString().split('/'))[0]) ;
        if (jour <=7){
          this.doughnutChartData[0] += element.montant; 
        }
        else if(jour > 7  &&  jour <=14 ){
          this.doughnutChartData[1] += element.montant; 
        }
        else if(jour > 14  &&  jour <=23 ){
          this.doughnutChartData[2] += element.montant; 
        }
        else if(jour > 23  &&  jour <=31 ){
          this.doughnutChartData[3] += element.montant; 
        }
      }
    });
  }



  public doughnutChartLabels = ['semaine 1', 'semaine 2', 'semaine 3', 'semaine 4'];
  public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';

  prenomComplet (objString:string){
    let obj:any;
    if(objString.trim()!=''){
      obj = JSON.parse(objString);
      return obj.prenom +' '+ obj.nom;
    }
    return "";
  

  }




  /**
   * @param datas: tableau de Commandes reçu appret requette sur serveur
   * @return data : tableau formater pour l'affichage a l'ecran
   * @function: Formatage des données reçu du serveur
  **/
  parseDatas(datas){
    let data = [];
      datas.forEach(element => {
        
        switch (element.etat) {
          case -1:
            element.etatText = 'Annuler'
          case 1:
            element.etatText = 'Enregistrer'
            break;
          case 2:
            element.etatText = 'Valider'
            break;
          case 3:
            element.etatText = 'Preparer'
            break;
          case 4:
            element.etatText = 'En cour de livraison'
            break;  
          case 5:
            element.etatText = 'Payer'
            break;  

        }

        switch (element.recuperation) {
          case 1:
            element.recuperationText = 'sur place'
            break;
          case 2:
            element.recuperationText = 'à livrer'
            break;
        }

        switch (element.mode_paiement) {
          case 1:
            element.paiementText = 'en ligne'
            break;
          case 2:
            element.paiementText = 'à la livraiso'
            break;
        }

      if(element.etat==5){
        
        data.push( 
          {
            id:element.id,
            commande: element.id,
            designation: element.designation,
            livreur: this.prenomComplet(element.livreur),
            caissier: this.prenomComplet(element.caissier),
            adresse:element.adresse,
            client: element.numero_client,
            vendeuse: this.prenomComplet(element.vendeuse),
            montantCommande: element.montant,
            montantLivraison: element.frais_livraison,
            paiement: element.mode_paiement,
            recuperation: element.recuperation,
            etat: element.etat,
            etatText: element.etatText,
            recuperationText:element.recuperationText,
            paiementText:element.paiementText,
            monnaie: this.monnairePrpa(element.montant,element.frais_livraison),
       
          });

          this.montantTotal += element.montant;
      }
    });
    
    this.barChartDatas(datas)
    this.oughnutChartDatas(datas);
    return data;
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


  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.data = this.dataSave.slice(startItem, endItem);
 }

 getCommandes(){
  let dd = (new Date().toJSON()).split("T")[0]
  let df = (new Date().toJSON()).split("T")[0]
  let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
  let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
  this.loading = true;
  this._vendeurService.getCommandes({debut:dateDebut,fin:dateFin}).then(res=>{
    console.log(res);
    if(res.status==1){
      this.dataSave = this.data = this.parseDatas(res.data);
      if(this.dataSave.length!=0){
        this.loading = false;
      }
    }
  }).catch(err => {
    this.loading = false;
  })
 }

 monthFirstLastDay(month):any{
  let obj= {firstday:'',lastday:''};
  switch(month){
    case "01":
      obj.firstday = '01'
      obj.lastday = '31'
      break; 
    case "02":
      obj.firstday = '01'
      obj.lastday = '28'
      break; 
    case "03":
      obj.firstday = '01'
      obj.lastday = '31'
      break; 
    case "04":
      obj.firstday = '01'
      obj.lastday = '30'
      break;
    case "05":
      obj.firstday = '01'
      obj.lastday = '31'
      break; 
    case "06":
      obj.firstday = '01'
      obj.lastday = '30'
      break; 
    case "07":
      obj.firstday = '01'
      obj.lastday = '31'
      break; 
    case "08":
      obj.firstday = '01'
      obj.lastday = '31'
      break; 
    case "09":
      obj.firstday = '01'
      obj.lastday = '30'
      break; 
    case "10":
      obj.firstday = '01'
      obj.lastday = '31'
      break;
    case "11":
      obj.firstday = '01'
      obj.lastday = '30'
      break; 
    case "12":
      obj.firstday = '01'
      obj.lastday = '31'
      break; 
  }
}


  /**
   * @param:0
   * @return :0 
   * @function: methode appelé lorsque le component est pret
  **/
  ngOnInit(): void {
    
    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'commande', title: 'COMMANDE' , cellTemplate: this.panier},
      { key: 'livreur', title: 'LIVREUR' },
      { key: 'client', title: 'CLIENT' },
      { key: 'montantCommande', title: 'MONTANT COMMANDE' },
      { key: 'montantLivraison', title: 'MONTANT LIVRAISON' },
      { key: 'paiement', title: 'PAIEMENT' },
      { key: 'recuperation', title: 'RÉCUPÉRATION' },
      { key: 'etat', title: 'ETAT COMMANDE'},
      { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' },
    ];

    this.getCommandes()

    let dd = (new Date().toJSON()).split("T")[0]
    let df = (new Date().toJSON()).split("T")[0]
    
    let firstLast = {firstday:'',lastday:''};

    firstLast = this.monthFirstLastDay(dd.split('-')[1]);
    
    let dateDebut = firstLast.firstday +dd.split('-')[1]+"/"+dd.split('-')[0]
    let dateFin = firstLast.lastday+ df.split('-')[1]+"/"+df.split('-')[0]
    this._vendeurService.getCommandes({debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.dataChart =  this.parseDatas(res.data);
      }
    }).catch(err => {
      this.loading = false;
    })


    this.refSetInterval = setInterval(()=>{
      let dd = (new Date().toJSON()).split("T")[0]
      let df = (new Date().toJSON()).split("T")[0]
      let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
      let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
      this.loading = true;
      this._vendeurService.getCommandes({debut:dateDebut,fin:dateFin}).then(res=>{
        console.log(res);
        if(res.status==1){
          this.dataSave = this.data = this.parseDatas(res.data);
          if(this.dataSave.length!=0){
            this.loading = false;
          }
        }
      }).catch(err => {
        this.loading = false;
      })
    },10000)
  }



}
