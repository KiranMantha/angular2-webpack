import { Component, Inject, forwardRef, Host } from '@angular/core';
import { TodoService } from './todo.service';
import { TodoModal } from '../../Modals/todo.modal';
import { GlobalService } from '../App/app.global.service';
import { DialogService } from '../Dialog/dialog.service';

@Component({
    selector: 'todo',
    template: require('./todo.component.html'),
    providers: [TodoService]
})
export class TodoComponent {
    public Title: string = 'Hello World';
    public Todo: TodoModal = new TodoModal();
    constructor( @Inject(TodoService) public _todoService: TodoService,
        @Inject(DialogService) public _dialogService: DialogService,
        @Inject(GlobalService) public _globalService: GlobalService) {
    }

    public SaveTodo(): void {
        this.Todo.id = this._todoService.Todos.length + 1;
        this._todoService.SaveTodo(this.Todo);
        this.Todo = new TodoModal();
    }
    public EditTodo(obj: TodoModal): void {
        alert(obj.name);
    }

    public OpenDialog(): void {
        this._dialogService.createDialog(this._globalService.dialogContainer, TodoComponent);
    }
}