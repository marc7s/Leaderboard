import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './_pages/admin/admin.component';
import { HomeComponent } from './_pages/home/home.component';
import { AddTimeComponent } from './_pages/add-time/add-time.component';
import { LoginComponent } from './_pages/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './httpInterceptor';
import { InputFieldTextComponent } from './components/input-field-text/input-field-text.component';
import { ErrorComponent } from './_pages/error/error.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { TrackComponent } from './_pages/track/track.component';
import { TracksComponent } from './_pages/tracks/tracks.component';
import { UserComponent } from './_pages/user/user.component';
import { LeaderboardEntryComponent } from './components/leaderboard-entry/leaderboard-entry.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { TimePipe } from './time.pipe';
import { CardComponent } from './components/card/card.component';
import { IconPipe } from './icon.pipe';
import { IconComponent } from './components/icon/icon.component';
import { InputFieldSelectComponent } from './components/input-field-select/input-field-select.component';
import { InputFieldTimeComponent } from './components/input-field-time/input-field-time.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RecordsComponent } from './_pages/records/records.component';
import { RecordEntryComponent } from './record-entry/record-entry.component';
import { UsersComponent } from './_pages/users/users.component';
import { PagelinkPipe } from './pagelink.pipe';
import { EditUsersComponent } from './_pages/edit-users/edit-users.component';
import { EditGamesComponent } from './_pages/edit-games/edit-games.component';
import { EditCarsComponent } from './_pages/edit-cars/edit-cars.component';
import { EditWeathersComponent } from './_pages/edit-weathers/edit-weathers.component';
import { EditTyresComponent } from './_pages/edit-tyres/edit-tyres.component';
import { EditTracksComponent } from './_pages/edit-tracks/edit-tracks.component';
import { EditConfigsComponent } from './_pages/edit-configs/edit-configs.component';

const materialModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    AddTimeComponent,
    LoginComponent,
    InputFieldTextComponent,
    ErrorComponent,
    HighlightComponent,
    InfoPanelComponent,
    TrackComponent,
    TracksComponent,
    UserComponent,
    LeaderboardEntryComponent,
    LeaderboardComponent,
    TimePipe,
    CardComponent,
    IconPipe,
    IconComponent,
    InputFieldSelectComponent,
    InputFieldTimeComponent,
    RecordsComponent,
    RecordEntryComponent,
    UsersComponent,
    PagelinkPipe,
    EditUsersComponent,
    EditGamesComponent,
    EditCarsComponent,
    EditWeathersComponent,
    EditTyresComponent,
    EditTracksComponent,
    EditConfigsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ...materialModules,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
