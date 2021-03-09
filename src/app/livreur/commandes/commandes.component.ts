import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  

import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { commandeItem } from '../interfaces/commandeItem.interface';
import { ConfigService } from 'src/app/services/Config.service';
import { LivreurService } from 'src/app/services/livreur.service';


@Component({
  selector: 'app-commandesLivreur',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})

export class CommandesComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];
  modalRef: BsModalRef;  

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;

  constructor (private _confService:ConfigService,private modalService: BsModalService,private _livreurService: LivreurService){

  }

  public data:commandeItem[] = [
    {
      id:1,
      commande: '122',
      livreur: 'Adama Goudiaby',
      client: "Abdoul Hamid",
      montantCommande: 500,
      montantLivraison: 2000,
      paiement: 1,
      recuperation: 1,
      etat: 1,
      monnaie: 100,
    },
  ];

  openModalWithClass(template: TemplateRef<any>) {  
        this.modalRef = this.modalService.show(  
          template,  
          Object.assign({}, { class: 'gray modal-lg' })  
        );  
  }  

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.isLoading = true;
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'commande', title: 'COMMANDE' },
      { key: 'livreur', title: 'LIVREUR' },
      { key: 'client', title: 'CLIENT' },
      { key: 'montantCommande', title: 'MONTANT COMMANDE' },
      { key: 'montantLivraison', title: 'MONTANT LIVRAISON' },
      { key: 'paiement', title: 'PAIEMENT' , cellTemplate: this.paiementTpl},
      { key: 'recuperation', title: 'RÉCUPÉRATION' , cellTemplate: this.recuperationTpl},
      { key: 'etat', title: 'ETAT COMMANDE' , cellTemplate: this.etatTpl},
      { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];

    let dd = (new Date().toJSON()).split("T")[0]
    let df = (new Date().toJSON()).split("T")[0]
    let dateDebut = dd.split('-')[2]+"/"+dd.split('-')[1]+"/"+dd.split('-')[0]
    let dateFin = df.split('-')[2]+"/"+df.split('-')[1]+"/"+df.split('-')[0]

    this._livreurService.getCommandes({debut:"01/01/2019",fin:dateFin}).then(res=>{
      console.log(res);
    })
  }

}
