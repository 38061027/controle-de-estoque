import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

const MODULES:any = [
  MatCardModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
      MODULES
  ],
  exports:[MODULES]
})
export class MaterialModule { }
