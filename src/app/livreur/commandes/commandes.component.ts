import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as sha1 from 'js-sha1';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';


import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { commandeItem } from '../interfaces/commandeItem.interface';
import { ConfigService } from 'src/app/services/Config.service';
import { LivreurService } from 'src/app/services/livreur.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-commandesLivreur',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})

export class CommandesComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];
  modalRef: BsModalRef;  
  closeResult = '';
  public login = null;
  public password = null;
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true

  @ViewChild('panier', { static: true }) panier: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;

  constructor (private _logService:LoginService,private modalService: NgbModal,private _confService:ConfigService,private _livreurService: LivreurService){

  }



  public data:commandeItem[] = [];
  public dataSave:commandeItem[] = [];


  loger (){

    // this.isLogin = 1;
    // this.isLivreur = 1;
    // this.menu = ROUTE_LIVREUR;
    // this.router.navigate(['/commandesLivreur'])

    this._logService.loger({login:this.login,password:sha1(this.password)}).then(res=>{
      console.log(res);
      if(res.status==1){
       /* console.log(res); 
        sessionStorage.setItem('profile','vendeur');
        sessionStorage.setItem('accessLevel','1');*/

      }else{
        console.log(res);
      }
    })
  
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.data = this.dataSave.slice(startItem, endItem);
 }
    

  openPointage() :void{
    (document.getElementById("modalTempmate1")).style.display = "block";
  }

   closePointage():void {
    (document.getElementById("modalTempmate1")).style.display = "none";
  }

  parseDatas(datas){
    let data = [];
    let caissier = {prenom:"",nom:""}
    datas.forEach(element => {
        caissier = JSON.parse(element.caissier);
        data.push( 
          {
            id:element.id,
            commande: element.id,
            designation: element.designation,
            livreur: element.livreur,
            caissier: caissier.prenom + " "+ caissier.nom,
            adresse:element.adresse,
            client: element.numero_client,
            vendeuse:element.vendeuse,
            montantCommande: element.montant,
            montantLivraison: element.frais_livraison,
            paiement: element.mode_paiement,
            recuperation: element.recuperation,
            etat: element.etat,
            monnaie: this.monnairePrpa(element.montant,element.frais_livraison),
        });
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

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.isLoading = true;
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'commande', title: 'COMMANDE' , cellTemplate: this.panier},
      { key: 'livreur', title: 'LIVREUR' },
      { key: 'client', title: 'CLIENT' },
      { key: 'vendeuse', title: 'VENDEUSE' },
      { key: 'montantCommande', title: 'MONTANT COMMANDE' },
      { key: 'montantLivraison', title: 'MONTANT LIVRAISON' },
      { key: 'paiement', title: 'PAIEMENT' , cellTemplate: this.paiementTpl},
      { key: 'recuperation', title: 'RÉCUPÉRATION' , cellTemplate: this.recuperationTpl},
      { key: 'etat', title: 'ETAT COMMANDE' , cellTemplate: this.etatTpl},
      { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' },
    ];

    let dd = (new Date().toJSON()).split("T")[0]
    let df = (new Date().toJSON()).split("T")[0]
    let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
    let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
    this._livreurService.getCommandes({debut:"01/01/2019",fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.dataSave = this.data = this.parseDatas(res.data);
      }
    })


  }

}
