import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import { Categories } from '../../component/categories/categories';
import { Auth } from '../../service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterLink, Categories],
  templateUrl: './home.html',
})
export class Home {
  authStore = inject(Auth);
  categories = [
    { name: 'Length', icon: 'straighten', color: 'bg-blue-100 text-blue-600' },
    { name: 'Weight', icon: 'scale', color: 'bg-green-100 text-green-600' },
    { name: 'Temperature', icon: 'thermostat', color: 'bg-red-100 text-red-600' },
    { name: 'Volume', icon: 'science', color: 'bg-purple-100 text-purple-600' }
  ];
}
