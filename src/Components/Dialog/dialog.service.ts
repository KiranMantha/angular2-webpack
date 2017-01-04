import { Injectable } from '@angular/core';
import { DialogContainerComponent } from './dialog-container.component';
import { DialogComponent } from './dialog.component';

@Injectable()
export class DialogService {
    public createDialog(_dialogContainerComponent: DialogContainerComponent):void {
        _dialogContainerComponent.createDialog(DialogComponent);
    }
}