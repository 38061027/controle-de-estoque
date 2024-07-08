import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';

const MODULES:any = [
  MatCardModule,
  MatTableModule
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
