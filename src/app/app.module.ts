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
import { NzProgressModule } from 'ng-zorro-antd/progress';
/******************************************************
*               Components
*******************************************************/

import { AppComponent } from './app.component';
import { CrisisListComponent } from './crisis-list/crisis-list.component';
import { HeroesListComponent } from './heroes-list/heroes-list.component';
import { ConfigService } from './services/Config.service';
import { LoginComponent } from './login/login.component';
import { LivreursComponent } from './vendeur/livreurs/livreurs.component';
import { CommandesComponent } from './vendeur/commandes/commandes.component';
import { CommandesComponent as LivreurCommandesComponent} from './livreur/commandes/commandes.component';
import { DashboardComponent } from './vendeur/dashboard/dashboard.component';
import { TableModule } from 'ngx-easy-table';
import { ChartsModule } from 'ng2-charts';
import { HistoriqueComponent } from './livreur/historique/historique.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CrisisListComponent,
    HeroesListComponent,
    LoginComponent,
    LivreursComponent,
    CommandesComponent,
    LivreurCommandesComponent,
    DashboardComponent,
    HistoriqueComponent,
    HomeComponent,
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
    ChartsModule,
    RouterModule.forRoot([
      {path: 'crisis-list', component: CrisisListComponent},
      {path: 'heroes-list', component: HeroesListComponent},
      {path: 'login', component: LoginComponent},
      {path: 'livreurs', component: LivreursComponent},
      {path: 'commandes', component: CommandesComponent},
      {path: 'commandesLivreur', component: LivreurCommandesComponent},
      {path: 'historiqueLivreur', component: HistoriqueComponent},
      {path: 'dashboardVendeur', component: DashboardComponent},
      {path: 'home', component: HomeComponent},
    ]),
    NzButtonModule,
    NzTableModule,
    NzDropDownModule,
    NzLayoutModule,
    NzGridModule,
   NzProgressModule,

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
