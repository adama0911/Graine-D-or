/** import all locales data **/
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
registerLocaleData(en);
registerLocaleData(zh);

/** config ng-zorro-antd i18n **/
import { en_US, NZ_I18N, fr_FR } from 'ng-zorro-antd/i18n';
/******************************************************
*               Modules
*******************************************************/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule,Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { NzProgressModule } from 'ng-zorro-antd/progress';


import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';



import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';


/******************************************************
*               Components
*******************************************************/

import { AppComponent } from './app.component';
import { ConfigService } from './services/Config.service';
import { CreateCaisseComponent } from './adminGenerale/create-caisse/create-caisse.component';
import { DashbordAdminComponent } from './adminGenerale/dashbord-admin/dashbord-admin.component';
import { LivreursComponent } from './vendeur/livreurs/livreurs.component';
import { CommandesComponent } from './vendeur/commandes/commandes.component';
import { CommandesComponent as LivreurCommandesComponent} from './livreur/commandes/commandes.component';
import { DashboardComponent } from './vendeur/dashboard/dashboard.component';
import { TableModule } from 'ngx-easy-table';
import { ChartsModule } from 'ng2-charts';
import { HistoriqueComponent } from './livreur/historique/historique.component';
import { CreateUsersComponent } from './adminCaisse/create-users/create-users.component';
import { DashbordAdminCaisseComponent } from './adminCaisse/dashbord-admin-caisse/dashbord-admin-caisse.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/",
    pathMatch: "full"
  },
  {
    path:"createCaisse",
    component:CreateCaisseComponent
  },
  {
    path:"dashbordAdmin",
    component:DashbordAdminComponent
  },
  {
    path:"createUsers",
    component:CreateUsersComponent
  },
  {
    path: "dashbordAdminCaisse",
    component: DashbordAdminCaisseComponent,
    // children: [
    //   {
    //     path: "",
    //     loadChildren:
    //       "./layouts/admin-layout/admin-layout.module#AdminLayoutModule"
    //   }
    // ]
  }, 
  {
    path: 'livreurs',
    component: LivreursComponent,

  },
  {
    path:"commandes",
    component:CommandesComponent
  },
  {
    path:"commandesLivreur",
    component:LivreurCommandesComponent
  },
  {
    path:"historiqueLivreur",
    component:HistoriqueComponent
  },
  {
    path:"dashboardVendeur",
    component:DashboardComponent
  },
  {
    path: "**",
    redirectTo: "/"
  }
];



@NgModule({
  declarations: [
    AppComponent,
   
    CreateCaisseComponent,
    DashbordAdminComponent,

    LivreursComponent,
    CommandesComponent,
    LivreurCommandesComponent,
    DashboardComponent,
    HistoriqueComponent,
    CreateUsersComponent,
    DashbordAdminCaisseComponent,
  ],
  imports: [
    BrowserModule,
    TableModule,
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    PaginationModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    NzButtonModule,
    NzTableModule,
    NzDropDownModule,
    NzLayoutModule,
    NzGridModule,
    NzIconModule,
   NzProgressModule,
   FontAwesomeModule,
   
   

    NzCardModule,
    NzFormModule,
    NzGridModule,
    FormsModule,
    NzModalModule,
    NgbModule,
    
  ],
  providers: [ConfigService,BsModalService,PaginationConfig,

    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'en':
            return en_US;
          /** keep the same with angular.json/i18n/locales configuration **/
          case 'fr':
            return fr_FR;
          default:
            return en_US;
        }
      },
      deps: [LOCALE_ID]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
