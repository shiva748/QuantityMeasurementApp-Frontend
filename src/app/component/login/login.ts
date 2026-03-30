import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { Auth } from '../../service/auth';
import { ApiResponse } from '../../model/api-response.model';
import { UserData } from '../../model/user.model';

interface LoginData{
  email:string;
  password:string;
}

@Component({
  selector: 'login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './login.html',
})
export class Login {
  authStore = inject(Auth);
  isOpen = input<boolean>(false);
  closeModal = output<void>();
  switchMode = output<void>();

  private fb = inject(FormBuilder);

  isLoading = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  private async login (){
    this.isLoading.set(true);
    try{
      const loginData:LoginData = this.loginForm.getRawValue();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })
      if(res.ok){
        let data:ApiResponse<UserData> = await res.json();
        this.authStore.markAsLoggedIn(data.data);
        console.log(data.message);
        this.closeModal.emit();
      }else{
        console.error('Login failed with status', res.status);
      }
    }catch (error){
      console.error('Login failed', error);
    }finally{
      this.isLoading.set(false);
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.login();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
