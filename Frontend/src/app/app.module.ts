import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { AddEntryComponent } from './pages/add-entry/add-entry.component';
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

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    AddEntryComponent,
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
    IconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
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
