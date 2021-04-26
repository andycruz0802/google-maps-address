import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'maps',
    component: MapComponent
  },
  {
    path: '',
    component: FormComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    BrowserModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
