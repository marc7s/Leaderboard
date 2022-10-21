import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './authguard.service';
import { AddTimeComponent } from './_pages/add-time/add-time.component';
import { AdminComponent } from './_pages/admin/admin.component';
import { EditCarsComponent } from './_pages/edit-cars/edit-cars.component';
import { EditConfigsComponent } from './_pages/edit-configs/edit-configs.component';
import { EditGamesComponent } from './_pages/edit-games/edit-games.component';
import { EditTracksComponent } from './_pages/edit-tracks/edit-tracks.component';
import { EditTyresComponent } from './_pages/edit-tyres/edit-tyres.component';
import { EditUsersComponent } from './_pages/edit-users/edit-users.component';
import { EditWeathersComponent } from './_pages/edit-weathers/edit-weathers.component';
import { ErrorComponent } from './_pages/error/error.component';
import { HomeComponent } from './_pages/home/home.component';
import { LoginComponent } from './_pages/login/login.component';
import { RecordsComponent } from './_pages/records/records.component';
import { TrackComponent } from './_pages/track/track.component';
import { TracksComponent } from './_pages/tracks/tracks.component';
import { UserComponent } from './_pages/user/user.component';
import { UsersComponent } from './_pages/users/users.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'records', component: RecordsComponent },
  { path: 'track/:shortName', component: TrackComponent },
  { path: 'tracks', component: TracksComponent },
  { path: 'user/:username', component: UserComponent },
  { path: 'users', component: UsersComponent },
  { path: '', canActivate: [AuthguardService], children: [
    { path: 'admin', component: AdminComponent },
    { path: 'add-time', component: AddTimeComponent },
    { path: 'edit-cars', component: EditCarsComponent },
    { path: 'edit-configs', component: EditConfigsComponent },
    { path: 'edit-games', component: EditGamesComponent },
    { path: 'edit-tracks', component: EditTracksComponent },
    { path: 'edit-tyres', component: EditTyresComponent },
    { path: 'edit-users', component: EditUsersComponent },
    { path: 'edit-weathers', component: EditWeathersComponent }
  ]},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
