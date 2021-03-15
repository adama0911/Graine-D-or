import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {DataItem} from '../interfaces/dataItem.object'

import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { livreurItem } from '../interfaces/livreurItem.interface';
import { VendeurService } from 'src/app/services/vendeur.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';



@Component({
  selector: 'app-livreurs',
  templateUrl: './livreurs.component.html',
  styleUrls: ['./livreurs.component.scss']
})
export class LivreursComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];
  closeResult = '';
  public login = null;
  public password = null;
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true
  motcle = null;
  p: number = 1;

  constructor(private _vendeurService:VendeurService) {}

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;


  /**
   * @var data: tableau de Livreurs qui charge par raport aux manipulations faites sur la tableau dataSave
   * @return dataSave : tableau de livreurs fixe
   **/
  public data:livreurItem[] = [];
  public dataSave:livreurItem[] = [];


  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.data = this.dataSave.slice(startItem, endItem);
 }

   /**
   * @param datas: tableau de livreur reçu appret requette sur serveur
   * @return data : tableau formater pour l'affichage a l'ecran
   * @function: Formatage des données reçu du serveur
  **/
  parseDatas(datas){
    let data = [];
    datas.forEach(element => {
        data.push( 
          {

            accesslevel: element.accesslevel,
            adresse: element.adresse,
            created_at: (new Date(element.created_at)).toLocaleDateString(),
            livreur: element.livreur,
            deleted_at: element.deleted_at,
            depends_on:element.depends_on,
            etat: element.etat,
            first_log:element.first_log,
            id: element.id,
            nom: element.nom,
            password: element.password,
            telephone: element.telephone,
            updated_at: (new Date(element.updated_at)).toLocaleDateString(),
        });
    });
    console.log(data)
    return data;
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

  monnairePrpa(mtt1 ,mtt2){
    let somme = parseInt(mtt1)+parseInt(mtt2);
    let temp = somme/10000;
    let temp1 = temp.toString().split('.')[0];
    temp1 = temp1 + 1;
    let monnaie = parseInt(temp1) * 10000;
    return monnaie - somme;
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
      { key: 'prenom', title: 'PRENOM' },
      { key: 'nom', title: 'NOM' },
      { key: 'telephone', title: 'TELEPHONE' },
      { key: 'adresse', title: 'ADRESSE' },
      { key: 'created_at', title: "DATE D'INCRIPTION" },
      { key: 'etat', title: "ETAT" },
    ];


    this._vendeurService.getLivreurs({}).then(res=>{
      console.log(res.data);
      
      //this.data = this.dataSave = res.data;
        this.dataSave = this.data = this.parseDatas(res.data);
    })
  }


}
