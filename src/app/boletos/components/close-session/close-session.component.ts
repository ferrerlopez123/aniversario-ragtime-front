import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-close-session',
  templateUrl: './close-session.component.html',
  styleUrls: ['./close-session.component.css']
})
export class CloseSessionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CloseSessionComponent>) { }

  ngOnInit(): void {
  }

  cerrar(isdelete?:boolean): void {
    this.dialogRef.close(isdelete);
  }
}
