import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { MylistPageComponent } from './pages/mylist-page/mylist-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {path: 'list', component: ListPageComponent},
      {path: 'myList',component: MylistPageComponent},
      {path: '**', redirectTo: 'list'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoletosRoutingModule { }
