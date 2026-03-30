import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Auth} from '../../service/auth';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './profile.html',
})
export class Profile {
  authStore = inject(Auth);

  get initials(): string {
    const first:string | undefined = this.authStore.getUserData()?.firstName.charAt(0);
    const last:string | undefined = this.authStore.getUserData()?.lastName.charAt(0);
    return `${first ?? ""}${last ?? ""}`.toUpperCase();
  }
}
