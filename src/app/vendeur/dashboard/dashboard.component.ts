import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

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

  @ViewChild('panier', { static: true }) panier: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor (private _confService:ConfigService,private _vendeurService:VendeurService){

  }

  public data:commandeItem[] = [];
  public dataSave:commandeItem[] = [];

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };


  barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  barChartType = 'bar';
  barChartLegend = true;
  barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];



  public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
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




  parseDatas(datas){
    let data = [];
    let caissier = {prenom:"",nom:""}
    datas.forEach(element => {
      if(element.etat==5){
        caissier = JSON.parse(element.caissier);
        data.push( 
          {
            id:element.id,
            commande: element.id,
            designation: element.designation,
            livreur: this.prenomComplet(element.livreur),
            caissier: this.prenomComplet(element.caissier),
            adresse:element.adresse,
            client: element.client,
            vendeuse: this.prenomComplet(element.vendeuse),
            montantCommande: element.montant,
            montantLivraison: element.frais_livraison,
            paiement: element.mode_paiement,
            recuperation: element.recuperation,
            etat: element.etat,
            monnaie: this.monnairePrpa(element.montant,element.frais_livraison),
       
          });
      }
    });
    console.log(data)
    return data;
  }

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

    let dd = (new Date().toJSON()).split("T")[0]
    let df = (new Date().toJSON()).split("T")[0]
    let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
    let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
    this._vendeurService.getCommandes({debut:"01/01/2019",fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.dataSave = this.data = this.parseDatas(res.data);
      }
    })
  }

}
