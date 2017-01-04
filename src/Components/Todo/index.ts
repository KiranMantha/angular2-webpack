import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from '../Dialog';

import { TodoComponent } from './todo.component';
import { TodoService } from './todo.service'


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DialogModule
    ],
    providers:[TodoService],
    declarations: [TodoComponent],
    exports: [TodoComponent]
})
export class TodoModule { } 