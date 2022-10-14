import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { AddTimeComponent } from './pages/add-time/add-time.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './httpInterceptor';
import { InputFieldTextComponent } from './components/input-field-text/input-field-text.component';
import { ErrorComponent } from './pages/error/error.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { TrackComponent } from './pages/track/track.component';
import { TrackListComponent } from './pages/track-list/track-list.component';
import { UserComponent } from './pages/user/user.component';
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
    TrackListComponent,
    UserComponent,
    LeaderboardEntryComponent,
    LeaderboardComponent,
    TimePipe,
    CardComponent,
    IconPipe,
    IconComponent,
    InputFieldSelectComponent,
    InputFieldTimeComponent
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
