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
  // declaration et initalisation des variables
  public configuration: Config;
  public columns: Columns[];
  modalRef: BsModalRef;  
  closeResult = '';
  public login = null;
  public password = null;
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true
  public loading = false;
  loadingStat = 0;
  motcle = null;
  loginError = null;
  page = 1;
  pageSize = 10;
  p: number = 1;


  @ViewChild('panier', { static: true }) panier: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;

  constructor (private _logService:LoginService,private modalService: NgbModal,private _confService:ConfigService,private _livreurService: LivreurService){

  }


  /**
   * @var data: tableau de commandes qui charge par raport aux manipulations faites sur la tableau dataSave
   * @return dataSave : tableau de livreurs fixe
   **/
  public data:commandeItem[] = [];
  public dataSave:commandeItem[] = [];

  /**
   * @param: 0
   * @return: 0
   * @function: permet de pointer un livreur
   **/
  loger (){
    this.loginError = null;
    this.loading = true;
    this._logService.loger({login:this.login,password:sha1(this.password)}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.loadingStat = 1;
        this.loading = false;
        sessionStorage.setItem('currentUser',JSON.stringify(res.user))
      }else{
        console.log(res);
        this.loading = false;
        this.loginError = "Identifiant  où mot de passe incorrect !!!";
        console.log(this.loginError)
      }
    })
  
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


  /**
   * @param event: la page en cour dans la pagination
   * @return: 0
   * @function: permet de pointer un livreur
  **/
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.data = this.dataSave.slice(startItem, endItem);
 }
    

   /**
   * @param:0
   * @return: 0
   * @function: Ouvrir le modal de pointage
  **/
  openPointage() :void{
    (document.getElementById("modalTempmate1")).style.display = "block";
  }

  /**
   * @param:0
   * @return: 0
   * @function: Fermer le modal de  pointage
  **/
   closePointage():void {
    (document.getElementById("modalTempmate1")).style.display = "none";
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

        data.push( 
          {
            id:element.id,
            commande: element.id,
            designation: element.designation,
            livreur: this.prenomComplet(element.livreur),
            caissier: this.prenomComplet(element.caissier),
            adresse:element.adresse,
            client:  element.numero_client,
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
    });
    console.log(data)
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
   * @param:0
   * @return :0 
   * @function: methode appelé lorsque le component est pret
  **/
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

    setInterval(()=>{
      let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
        let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
        this._livreurService.getCommandes({debut:"01/01/2019",fin:dateFin}).then(res=>{
          console.log(res);
          if(res.status==1){
            this.dataSave = this.data = this.parseDatas(res.data);
          }
        })
    },10000)
  }

}
