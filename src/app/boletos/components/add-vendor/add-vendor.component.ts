import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BoletosService } from '../../services/boletos.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent implements OnInit {

  newVendor: FormGroup = this.fb.group({
    vendedor: [,[Validators.required,this.notEmptyValidator]]
  })

  constructor(public dialogRef: MatDialogRef<AddVendorComponent>,
    private fb: FormBuilder,
    private readonly boletoService:BoletosService) {}

  ngOnInit(): void {
  }

  campoNoValido(campo: string) {
    return this.newVendor.get(campo)?.invalid
       && this.newVendor.get(campo)?.touched;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    let vendedor: string = ''
    if(this.newVendor.invalid) {
      this.newVendor.markAllAsTouched();
      return;
    }

    vendedor = this.newVendor?.value?.vendedor?.trim();
    this.boletoService.addSeller(vendedor).subscribe({
      next:(value) => {
        this.dialogRef.close(value.name);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error',error.error.message,'error'); 
      }
    })
  }

  notEmptyValidator(control: FormControl): ValidationErrors | null {
    return (control?.value || '').trim().length? null : { 'whitespace': true }; 

  }


}
