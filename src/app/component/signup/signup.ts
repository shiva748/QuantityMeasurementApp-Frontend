import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { ApiResponse } from '../../model/api-response.model';
import { Auth } from '../../service/auth';
import { Toast } from '../../service/toast';


@Component({
  selector: 'signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './signup.html',
})
export class Signup {
  authStore = inject(Auth);
  toast = inject(Toast);
  isOpen = input<boolean>(false);
  closeModal = output<void>();
  switchMode = output<void>();
  isLoading = signal(false);
  private fb = inject(FormBuilder);

  signupForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });
  private async signup (){
    this.isLoading.set(true);
    try{
      
      const signupData = this.signupForm.getRawValue();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      })
      let data: ApiResponse<null> = await res.json();
      console.log('Signup response', data);
      if(res.ok){
         this.toast.success('Signup successful! Please login to continue.');
         this.closeModal.emit();
      }else{
         this.toast.error(`Signup failed. ${data.message}`);
      }
    }catch (error){
      this.toast.error('An error occurred during signup. Please try again later.');
    }finally{
      this.isLoading.set(false);
    }
  }
  onSubmit() {
    if (this.signupForm.valid) {
      if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
        this.signupForm.controls.confirmPassword.setErrors({ mismatch: true });
        return;
      }
      this.signup();
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
