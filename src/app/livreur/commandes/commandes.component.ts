import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { commandeItem } from '../interfaces/commandeItem.interface';
import { ConfigService } from 'src/app/services/Config.service';


@Component({
  selector: 'app-commandesLivreur',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})

export class CommandesComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor (private _confService:ConfigService){

  }

  public data:commandeItem[] = [
    {
      id:1,
      commande: '122',
      client: "Abdoul Hamid",
      montantCommande: 500,
      montantLivraison: 2000,
      paiement: 1,
      recuperation: 1,
      etat: 1,
      monnaie: 100,
    },
  ];

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.isLoading = true;
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'commande', title: 'COMMANDE' },
      { key: 'client', title: 'CLIENT' },
      { key: 'montantCommande', title: 'MONTANT COMMANDE' },
      { key: 'montantLivraison', title: 'MONTANT LIVRAISON' },
      { key: 'paiement', title: 'PAIEMENT' },
      { key: 'recuperation', title: 'RÉCUPÉRATION' },
      { key: 'etat', title: 'ETAT COMMANDE' },
      { key: 'monnaie', title: 'MONNAIE À PRÉPARÉE' },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];

    this._confService.getHistoriques({}).then(res=>{
      console.log(res);
    })
  }

}
