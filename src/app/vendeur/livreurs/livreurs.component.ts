import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {DataItem} from '../interfaces/dataItem.object'

import {
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { livreurItem } from '../interfaces/livreurItem.interface';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-livreurs',
  templateUrl: './livreurs.component.html',
  styleUrls: ['./livreurs.component.scss']
})
export class LivreursComponent implements OnInit {
  public configuration: Config;
  public columns: Columns[];

  constructor(private nzMessageService: NzMessageService) {}

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  public data:livreurItem[] = [
    {
    id:1,
    prenom: 'Magor',
    nom: 'Sy',
    telephone:'773256321',
    adresse:'Yoff',
    created_at:'12/02/2021',
    updated_at:'12/02/2021',
    }

  ];

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
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
      { key: 'updated_at', title: "MISE A JOUR" },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];
  }


}
