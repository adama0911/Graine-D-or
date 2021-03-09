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
  dd
  df

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;
  public data = [
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
      action:'valider',
    },
  ];

  ngOnInit(): void {
    this.dd = (new Date().toJSON()).split("T")[0]
    this.df = (new Date().toJSON()).split("T")[0]
    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;
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
  }
}
