import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddTicketComponent } from '../../components/add-ticket/add-ticket.component';
import { Boleto, Paquete } from 'src/app/shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { DeleteTicketComponent } from '../../components/delete-ticket/delete-ticket.component';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { BoletosService } from '../../services/boletos.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {
  filterValue = '';
  isMobile = false;
  displayedColumns: string[] = ['name','package','soldDate','seller', 'status','seat','ticket'];
  ticketsList:Boleto[] = [];
  originalTicketList!:Boleto[];
  isLoading = true;
  isAdmin = false;
  dataSource = new MatTableDataSource<Boleto>();
  public p : number = 1
  public itemsMobile: number= 10;

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private boletosService: BoletosService,
    private authService: AuthService) { 
    }

  ngOnInit(): void {
    let userType = this.authService.usuario!.roles
    if(userType![0] === 'admin') {
      this.isAdmin = true;
    }
    this.gettingTicketsData();
  }


  ngAfterViewInit():void {
    this.dataSource.paginator = this.paginator;
  }

  gettingTicketsData(): void {
    this.isLoading = true;
    this.boletosService.getTicket().subscribe({
      next:(data) => {
        this.originalTicketList = data;
        this.ticketsList = data;
        this.dataSource.data = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error:() => {
        this.errorMsg('Algo salió mal inténtenlo más tarde');
        this.isLoading = false;
      }
    })
  }
  handlePageEvent(e: PageEvent) {
    this.p = e.pageIndex + 1;
    this.itemsMobile = e.pageSize;  
  }
  handleMobilePageEvent(p: number) {
    this.p = p
    this.paginator.pageIndex = p - 1;
    this.dataSource.paginator = this.paginator;
  }

  searchFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  applyFilters() {
    let ticketFilterArray = this.originalTicketList.filter((value) => {
      let filter = this.filterValue.toLowerCase().trim();
      let name = value.name + ' ' + value.surnames
      return  name.toLowerCase().includes(filter) || value.soldDate.toLowerCase().includes(filter) ||
      value.seller.toLocaleLowerCase().includes(filter) || value.status.toLowerCase().includes(filter)
    })
    this.ticketsList = ticketFilterArray;
    this.dataSource.data = ticketFilterArray
  }
  formattingPackage(packages: Paquete[]): string {
    let packagesName: string [] = [];
    packages.forEach(value => {
      packagesName?.push(value.name)
    })
    return packagesName.join(',');
  }

  createTicket(ticket:Boleto):void {
    const dialogRef = this.dialog.open(TicketComponent,{
      data: ticket,
      panelClass: 'dialog-class'
    })

  }
  
  deleteTicket(id:any): void {
    const dialogRef = this.dialog.open(DeleteTicketComponent,{
      disableClose: false,
      panelClass: 'dialog-class'
    })

    dialogRef.afterClosed().subscribe({
      next:(value) => {
        if(value) {
          this.boletosService.deleteTicket(id).subscribe({
            next:() => {
              this.gettingTicketsData();
              this.toastr.error('Boleto eliminado')
            },
            error:() => {
              this.errorMsg('Algo salió mal inténtenlo más tarde');
            }
          })
        }
      }
    })
  }
  addTicket(ticket?:Boleto): void {
    const dialogRef = this.dialog.open(AddTicketComponent,{
    data:ticket,
    disableClose: true,
    panelClass: 'dialog-class',
    position: {top: '1%'},
    });

    dialogRef.afterClosed().subscribe({
      next:(value) => {
        if(value && value.action === 'agregar') {
          this.boletosService.addTicket(value.ticket).subscribe({
            next:() => {
              this.gettingTicketsData();
              this.toastr.success('Boleto agregado')
            },
            error:() => {
              this.errorMsg('Algo salió mal inténtenlo más tarde');
            }
          })
        }
        if(value && value.action === 'editar') {
          this.boletosService.updateTicket(value.ticket,value.id).subscribe({
            next:() => {
              this.gettingTicketsData();
              this.toastr.success('Boleto actualizado')
            },
            error:() => {
              this.errorMsg('Algo salió mal inténtenlo más tarde');
            }
          })
        }
      }
    })
  }

  errorMsg(error:string) {
    Swal.fire({
      icon: 'error',
      text: error,
    })
  }

  noDataMesssage(): string {
   return this.filterValue !== '' ? `No se encontraron boletos para "${this.filterValue}"` : 'No se encontraron boletos'
  }

}