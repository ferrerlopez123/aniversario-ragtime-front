import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { AddVendorComponent } from '../add-vendor/add-vendor.component';
import { Boleto, Paquete } from 'src/app/shared/interfaces';
import * as moment from 'moment';
import { UserType } from 'src/app/shared/userType';
import { BoletosService } from '../../services/boletos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit, OnDestroy {
  subscription!: Subscription 
  total:number = 0;
  estado: string = 'Pendiente';
  restante: number = 0;
  ticket!: Boleto; 
  filterSeller!: Observable<string[]>
  today:Date = new Date();
  PACKAGES: any[] = UserType.PACKAGES
  MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  vendedores: string[] = []
  isUpdate = false;
  

  miFormulario: FormGroup = this.fb.group({
    nombre: [,[Validators.required, this.notEmptyValidator]],
    apellidos: [,[Validators.required, this.notEmptyValidator]],
    paquete:[[],Validators.required],
    vendedor:[,Validators.required],
    pago:[,[Validators.required,Validators.min(1)]],
    fechaVenta:[this.today,Validators.required],
    asiento:[]
  })

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTicketComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private readonly boletosServie: BoletosService) { }


    get totalErrorMsg(): string {
      const errors = this.miFormulario.get('pago')?.errors;
      if(errors?.['mayorPago']){
        return 'El pago no puede ser mayor al total';
  
      } else if(errors?.['noPago']){
        return 'El pago debe ser mayor a 0'
      } 
      return 'El pago debe ser mayor a 0';
    }

  ngOnInit(): void {
    this.gettingSellerData()
    if(this.data) {
     this.ticket = this.data;
     this.total = this.ticket.total;
     this.estado = this.ticket.status;
     this.restante = this.ticket.total - this.ticket.paid;
     this.miFormulario.reset({
      nombre: this.ticket.name,
      apellidos: this.ticket.surnames,
      paquete: this.ticket.package,
      vendedor: this.ticket.seller,
      pago: this.ticket.paid,
      asiento: this.ticket.seat === '' || !this.ticket?.seat ? null: this.ticket.seat,
      fechaVenta:  this.formatingDateString(this.ticket?.soldDate),
     })
    }
    const initialValue = this.miFormulario.value;
    this.subscription = this.miFormulario.valueChanges.subscribe(value => {
      if(this.data) {
        this.checkingUpdate(initialValue,value);
      }
      if(value.paquete) {
        let paquetes = value.paquete as Array<any>
        let total = 0
        paquetes.forEach(value => {
          total = total + value.price;
        })
        this.total = total
      }
      if( value.paquete?.length > 0) {
        this.restante = this.total - (value?.pago || 0);
      }
      if(value.pago > this.total && value.paquete?.length > 0) {
      this.miFormulario.get('pago')?.setErrors({mayorPago:true})
      } else if(value.pago <= 0 || !value?.pago) {
        this.miFormulario.get('pago')?.setErrors({noPago:true})
      } else {
        this.miFormulario.get('pago')?.setErrors(null);
      }
      if(value.pago == this.total && this.total > 0) {
        this.estado = 'Pagado'
      } else {
        this.estado = 'Pendiente'
      }
      if(!value?.vendedor?.trim()) {
        this.miFormulario.get('vendedor')?.setErrors({noVendedor:true})
      } else if(!this.vendedores.includes(value?.vendedor)) {
        this.miFormulario.get('vendedor')?.setErrors({noIncludes:true})
      } else {
        this.miFormulario.get('vendedor')?.setErrors(null)
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vendedores.filter(option => option.toLowerCase().includes(filterValue));
  }
  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid
       && this.miFormulario.get(campo)?.touched;
  }

  close(): void {
    this.dialogRef.close();
  }
  guardar(): void {
    if(this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    this.formattingData();
  }

  formattingData(): void {
    let ticket: Boleto;
    let action: string = '';
    let id = this.ticket?._id
    if(!this.data) {
      action = 'agregar';
    } else {
      action = 'editar'
    }
    ticket = {
      name: this.miFormulario.value?.nombre.trim(),
      surnames: this.miFormulario.value?.apellidos.trim(),
      package: this.miFormulario.value?.paquete,
      soldDate: this.formatingDate(this.miFormulario.value.fechaVenta),
      seller: this.miFormulario.value?.vendedor.trim(),
      status:this.estado,
      total: this.total,
      paid:this.miFormulario.value?.pago,
      seat: this.miFormulario.value?.asiento?.trim()?.toUpperCase() || ''
    }
     this.dialogRef.close({action,ticket,id});
    
  }

  formatingDate(date:Date): string {
    moment.locale("es");
    let todayFormated = moment(date).format('LL');
    return todayFormated
  }

  formatingDateString(date:string): Date {
    const dataticket = date.split(' ');
    const day = dataticket[0];
    const month = this.MONTHS.indexOf(dataticket[2].toLowerCase());
    const year = dataticket[4]
    return new Date(+year,month,+day);
  }

  notEmptyValidator(control: FormControl): ValidationErrors | null {
    return (control?.value || '').trim().length? null : { 'whitespace': true }; 

  }

  newVendor():void {
   const dialogRef =  this.dialog.open(AddVendorComponent,{
      disableClose: true,
      panelClass: 'dialog-class'
      });

      dialogRef.afterClosed().subscribe({
        next:(value) =>{
          if(value) {
            this.gettingSellerData();
            this.miFormulario.controls['vendedor'].reset(value)
          }
        }
      })
  }

  comparer(o1:Paquete , o2: Paquete): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.name === o2.name : o2 === o2;
  }
  
  checkingUpdate(initialValue:any,value:any) {
    this.isUpdate= Object.keys(initialValue).some(key => {
      if(key === 'asiento' ) {
        return (value[key]?.toLowerCase()?.trim()) !== (initialValue[key]?.toLowerCase()?.trim() || '')
      } 
      if(typeof value[key] === 'string' ) {
        return value[key]?.toLowerCase()?.trim() !== initialValue[key]?.toLowerCase()?.trim()
      } 
      if(key === 'fechaVenta') {
        return value[key].getTime() !== initialValue[key].getTime()
      }
      if(key === 'paquete') {
        return JSON.stringify(value[key]) !== JSON.stringify(initialValue[key])
      }
      return value[key] != initialValue[key]
    })
  }

  gettingSellerData() {
    this.boletosServie.getSeller().subscribe({
      next:(value => {
        let vendedores:any = []
        value.forEach((value => {
          vendedores.push(value.name);
        }))
        this.vendedores = vendedores;
        this.filterSeller = this.miFormulario.controls['vendedor'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        )
      }),
      error: () => {
        this.errorMsg('Algo salió mal inténtenlo más tarde');
      }
    })
  }

  errorMsg(error:string) {
    Swal.fire({
      icon: 'error',
      text: error,
    })
  }
}