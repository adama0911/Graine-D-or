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
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';


/******************************************************
*               Components
*******************************************************/

import { AppComponent } from './app.component';
import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { HeroesListComponent } from './heroes-list/heroes-list.component';
import { ConfigService } from './services/Config.service';
import { LoginComponent } from './login/login.component';
import { CreateCaisseComponent } from './adminGenerale/create-caisse/create-caisse.component';
import { DashbordAdminComponent } from './adminGenerale/dashbord-admin/dashbord-admin.component';
import { LivreursComponent } from './vendeur/livreurs/livreurs.component';
import { CommandesComponent } from './vendeur/commandes/commandes.component';
import { DashboardComponent } from './vendeur/dashboard/dashboard.component';
import { TableModule } from 'ngx-easy-table';
import { CreateUsersComponent } from './adminCaisse/create-users/create-users.component';
import { DashbordAdminCaisseComponent } from './adminCaisse/dashbord-admin-caisse/dashbord-admin-caisse.component';

@NgModule({
  declarations: [
    AppComponent,
    CrisisListComponent,
    HeroesListComponent,
    LoginComponent,

    CreateCaisseComponent,
    DashbordAdminComponent,

    LivreursComponent,
    CommandesComponent,
    DashboardComponent,
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
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'crisis-list', component: CrisisListComponent},
      {path: 'heroes-list', component: HeroesListComponent},
      {path: 'login', component: LoginComponent},

      {path: 'createCaisse', component: CreateCaisseComponent},
      {path: 'dashbordAdmin', component: DashbordAdminComponent},

      {path: 'createUsers', component: CreateUsersComponent},
      {path: 'dashbordAdminCaisse', component: DashbordAdminCaisseComponent},

      {path: 'livreurs', component: LivreursComponent},
      {path: 'commandes', component: CommandesComponent},
      {path: 'dashboardVendeur', component: DashboardComponent},

    ]),
    NzButtonModule,
    NzTableModule,
    NzDropDownModule,
    NzLayoutModule,
    NzGridModule,
    NzCardModule,
    NzFormModule,
    NzGridModule,
    FormsModule,
    NzModalModule,
    
  ],
  providers: [ConfigService,

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
