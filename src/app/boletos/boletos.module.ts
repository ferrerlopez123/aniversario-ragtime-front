import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoletosRoutingModule } from './boletos-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { MylistPageComponent } from './pages/mylist-page/mylist-page.component';
import { AddTicketComponent } from './components/add-ticket/add-ticket.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddVendorComponent } from './components/add-vendor/add-vendor.component';
import { DeleteTicketComponent } from './components/delete-ticket/delete-ticket.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';
import { CloseSessionComponent } from './components/close-session/close-session.component';


@NgModule({
  declarations: [
    ListPageComponent,
    LayoutPageComponent,
    MylistPageComponent,
    AddTicketComponent,
    AddVendorComponent,
    DeleteTicketComponent,
    TicketComponent,
    CloseSessionComponent
  ],
  imports: [
    CommonModule,
    BoletosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    QRCodeModule,
    NgxPaginationModule
  ]
})
export class BoletosModule { }
