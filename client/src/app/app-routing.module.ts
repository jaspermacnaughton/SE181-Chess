import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectorComponent } from './selector/selector.component';
import { GameComponent } from './game/game.component';


const routes: Routes = [
  {path: "", redirectTo: "/select", pathMatch: "full"},
  {path: "select", component: SelectorComponent},
  {path: "play", component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
