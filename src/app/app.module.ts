import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AppBootstrapModule} from "./app-bootstrap.module";
import {HeaderComponent} from "./header/header.component";
import {SoundControlComponent} from "./sounds-board/sound-control/sound-control.component";
import {SoundsService} from "./sounds-board/sounds.service";
import {SoundsBoardComponent} from "./sounds-board/sounds-board.component";
import {RemoteControlComponent} from "./remote-control/remote-control.component";
import {RemoteControlService} from "./remote-control/remote-control.service";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SoundsBoardComponent,
    SoundControlComponent,
    RemoteControlComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppBootstrapModule
  ],
  providers: [SoundsService, RemoteControlService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
