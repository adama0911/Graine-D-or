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
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor (private _confService:ConfigService){

  }

  public data:commandeItem[] = [

  ];


  /**
   * @param:0
   * @return :0 
   * @function: methode appelé lorsque le component est pret
  **/
  ngOnInit(): void {


    this._confService.getHistoriques({}).then(res=>{
      console.log(res);
    })
  }

}
