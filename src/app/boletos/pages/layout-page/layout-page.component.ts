import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CloseSessionComponent } from '../../components/close-session/close-session.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent implements OnInit {

  get usuario() {
    return this.authService.usuario;
  }

  headerSection = [
    {
      name: 'Boletos',
      router: './list'
    },
   {
      name: 'Mis boletos',
      router: './myList'
   }
  ]
  public getScreenWidth: any;
  public getScreenHeight: any;
  isMobile = false;
  constructor(private authService: AuthService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  logout() {
    const dialogRef = this.dialog.open(CloseSessionComponent,{
      disableClose: false,
      panelClass: 'dialog-class'
    })

    dialogRef.afterClosed().subscribe({
      next:(value) => {
        if(value) {
          this.router.navigateByUrl('/auth/login');
          this.authService.logout();
        }
      }
    })
  }

}
