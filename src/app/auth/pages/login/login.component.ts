import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router)

  public myForm: FormGroup = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]],
  });

  login() {
    const {email,password} = this.myForm.value;
    this.authService.login(email,password).subscribe(
      {next: () => {
        this.router.navigateByUrl('/boletos/list')
      },
      error: (error) => {
        Swal.fire('Error',error,'error');
      }
    }
    )
  }
}
