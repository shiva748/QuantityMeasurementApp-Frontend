import { Component, Input } from '@angular/core';
import {MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface category{
  name:string,
  icon:string,
  color:string
}

@Component({
  selector: 'unit-category',
  imports: [MatIconModule, RouterModule],
  templateUrl: './categories.html',
})
export class Categories {
  @Input() data!:category;
}
