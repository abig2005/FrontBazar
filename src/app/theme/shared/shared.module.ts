// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {MatSelectModule} from '@angular/material/select';



// project import
import { CardComponent } from './components/card/card.component';

import { NgScrollbarModule } from 'ngx-scrollbar';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { FormErrorComponent } from 'src/app/shared/form-error/form-error.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    FormErrorComponent,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    NgScrollbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    FormErrorComponent,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  declarations: []
})
export class SharedModule {}
