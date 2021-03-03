import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import * as XLSX from 'xlsx';

import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { commandeItem } from '../interfaces/commandeItem.interface';
import { ConfigService } from 'src/app/services/Config.service';
import { VendeurService } from 'src/app/services/vendeur.service';



@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {

  public configuration: Config;
  public columns: Columns[];

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('paiementTpl', { static: true }) paiementTpl: TemplateRef<any>;
  @ViewChild('recuperationTpl', { static: true }) recuperationTpl: TemplateRef<any>;
  @ViewChild('etatTpl', { static: true }) etatTpl: TemplateRef<any>;

  constructor (private _vendeurService:VendeurService){

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

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
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

    this._vendeurService.getCommandes({}).then(res=>{
      console.log(res);
    })
  }

}
