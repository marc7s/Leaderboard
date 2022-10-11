import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './authguard.service';
import { AddEntryComponent } from './pages/add-entry/add-entry.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TrackComponent } from './pages/track/track.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'track/:shortName', component: TrackComponent },
  { path: 'user/:username', component: UserComponent },
  { path: '', canActivate: [AuthguardService], children: [
    { path: 'admin', component: AdminComponent },
    { path: 'add-entry', component: AddEntryComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
