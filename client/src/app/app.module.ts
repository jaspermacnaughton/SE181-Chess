import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectorComponent } from './selector/selector.component';
import { GameComponent } from './game/game.component';
import { HttpClientModule } from '@angular/common/http';
import { SquareComponent } from './game/square/square.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    GameComponent,
    SquareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
