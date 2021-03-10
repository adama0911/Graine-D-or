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

  constructor(private _vendeurService:VendeurService) {}

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  public data:livreurItem[] = [];


  public dataSave:livreurItem[] = [];


  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.data = this.dataSave.slice(startItem, endItem);
 }

  parseDatas(datas){
    // let data = [];
    // let caissier = {prenom:"",nom:""}
    // // datas.forEach(element => {
    // //     caissier = JSON.parse(element.caissier);
    // //     data.push( 
    // //       {

    // //         accesslevel: element.accesslevel,
    // //         adresse: element.adresse,
    // //         created_at: element.created_at,
    // //         livreur: element.livreur,
    // //         deleted_at: element.deleted_at,
    // //         depends_on:element.depends_on,
    // //         etat: element.numero_client,
    // //         first_log:element.first_log,
    // //         id: element.id,
    // //         nom: element.nom,
    // //         password: element.password,
    // //         telephone: element.telephone,
    // //         updated_at: element.updated_at,
    // //     });
    // // });
    // console.log(data)
    return datas;
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
    this.configuration.searchEnabled = true;
    // ... etc.
    this.columns = [
      { key: 'prenom', title: 'PRENOM' },
      { key: 'nom', title: 'NOM' },
      { key: 'telephone', title: 'TELEPHONE' },
      { key: 'adresse', title: 'ADRESSE' },
      { key: 'created_at', title: "DATE D'INCRIPTION" },
      { key: 'etat', title: "MISE A JOUR" },
      { key: 'action', title: 'Actions'},
    ];


    this._vendeurService.getLivreurs({}).then(res=>{
      console.log(res.data);
      this.data = this.dataSave = res.data;
      // if(res.status==1){
      //   this.dataSave = this.data = this.parseDatas(res.data);
      // }
    })
  }


}
