import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { IsAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { IsNotAuthenticatedGuard } from './auth/guards/is-notauthenticated.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [IsNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'boletos',
    canActivate: [IsAuthenticatedGuard],
    canLoad : [IsAuthenticatedGuard],
    loadChildren: () => import('./boletos/boletos.module').then(m => m.BoletosModule)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
