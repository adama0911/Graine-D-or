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
    

 currencyFormat(somme) : String{
  return Number(somme).toLocaleString() ;
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
  periodiquecheck:any;
  ngOnDestroy(){
    clearInterval(this.periodiquecheck);

  }

  /**
   * @param:0
   * @return :0 
   * @function: methode appelé lorsque le component est pret
  **/
   audio
  ngOnInit(): void {
    
    this.configuration = { ...DefaultConfig };
    this.configuration.isLoading = true;
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'commande', title: 'DATE' , cellTemplate: this.panier},
      { key: 'commande', title: 'COMMANDE' , cellTemplate: this.panier},
      { key: 'livreur', title: 'LIVREUR' },
      { key: 'client', title: 'CLIENT' },
      { key: 'vendeuse', title: 'VENDEUSE' },
      { key: 'montantCommande', title: 'MONTANT COMMANDE' },
      { key: 'montantLivraison', title: 'MONTANT LIVRAISON' },
      { key: 'paiement', title: 'MODE PAIEMENT' , cellTemplate: this.paiementTpl},
      { key: 'paiement', title: 'ETAT PAIEMENT' , cellTemplate: this.paiementTpl},
      //{ key: 'recuperation', title: 'RÉCUPÉRATION' , cellTemplate: this.recuperationTpl},
      { key: 'etat', title: 'ETAT COMMANDE' , cellTemplate: this.etatTpl},
      { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' },
    ];

    let dd = (new Date().toJSON()).split("T")[0]
    let df = (new Date().toJSON()).split("T")[0]
    let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
    let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
    this._livreurService.getCommandes({debut:dateDebut,fin:dateFin}).then(res=>{
      console.log(res);
      if(res.status==1){
        this.dataSave = this.data = this.parseDatas(res.data);
      }
    })

    this.periodiquecheck = setInterval(()=>{
      let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
        let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]
        this._livreurService.getCommandes({debut:dateDebut,fin:dateFin}).then(res=>{
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
}
