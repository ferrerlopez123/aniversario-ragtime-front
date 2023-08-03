import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { UserType } from 'src/app/shared/userType';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  miFormulario: FormGroup =  this.fb.group({
    name: ['',[Validators.required,Validators.nullValidator,this.notEmptyValidator]],
    email: ['',[Validators.required,Validators.email]],
    password: ['',[Validators.required,Validators.minLength(6),this.notEmptyValidator]],
    password2: ['',[Validators.required,Validators.minLength(6),this.notEmptyValidator]],
    code:['',[Validators.required,this.notValidCode]]
  },{
    validators:[this.camposIguales('password','password2')]
  })

  constructor( private fb: FormBuilder,
                private router: Router,
                private authService: AuthService) { }


  
  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid
        && this.miFormulario.get(campo)?.touched;
  }
  registro() {
    const {name, email, password, code} = this.miFormulario.value;
    let roles = 'user';

    if(code === UserType.ADMIN) {
      roles = 'admin';
    }

    this.authService.registro(name.trim(),email.trim(),password,roles).subscribe(
      {next:(value) => {
        if(value) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado correctamente',
            showConfirmButton: false,
          })
          this.router.navigateByUrl('/boletos/list'); 
        }
      },
      error:(error) => {
        Swal.fire('Error',error,'error'); 
      }
    }
    )

    
  }


  notEmptyValidator(control: FormControl): ValidationErrors | null {
    return (control?.value || '').trim().length? null : { 'whitespace': true }; 

  }

  notValidCode (control: FormControl): ValidationErrors | null {
    const valor:string = control.value?.trim();
    if(valor === UserType.ADMIN || valor ===  UserType.USER ){
      return null
    }
    return {
      notValidCode: true
    };
  }

  camposIguales(campo1: string, campo2: string){

    return (formGroup:AbstractControl) : ValidationErrors | null => {

      const pass1 = formGroup.get(campo1)?.value
      const pass2 = formGroup.get(campo2)?.value

      if(pass1 !== pass2){
        formGroup.get(campo2)?.setErrors({noIguales: true});
        return {noIguales: true}
      } 

      formGroup.get(campo2)?.setErrors(null);
      return null
    }

  }

}
