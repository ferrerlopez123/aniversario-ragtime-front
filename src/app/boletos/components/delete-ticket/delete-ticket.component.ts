import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-ticket',
  templateUrl: './delete-ticket.component.html',
  styleUrls: ['./delete-ticket.component.css']
})
export class DeleteTicketComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DeleteTicketComponent>) { }

  ngOnInit(): void {
  }

  cerrar(isdelete?:boolean): void {
    this.dialogRef.close(isdelete);
  }
}
