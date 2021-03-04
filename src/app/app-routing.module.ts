import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCaisseComponent } from './adminGenerale/create-caisse/create-caisse.component';
import { DashbordAdminComponent } from './adminGenerale/dashbord-admin/dashbord-admin.component';
import { LivreursComponent } from './vendeur/livreurs/livreurs.component';
import { CommandesComponent } from './vendeur/commandes/commandes.component';
import { CommandesComponent as LivreurCommandesComponent} from './livreur/commandes/commandes.component';
import { DashboardComponent } from './vendeur/dashboard/dashboard.component';

import { HistoriqueComponent } from './livreur/historique/historique.component';
import { CreateUsersComponent } from './adminCaisse/create-users/create-users.component';
import { DashbordAdminCaisseComponent } from './adminCaisse/dashbord-admin-caisse/dashbord-admin-caisse.component';


const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
