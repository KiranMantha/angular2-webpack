import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'dialog',
    template: require('./dialog.component.tpl.html')
})
export class DialogComponent {
    public close = new EventEmitter();

    public onClickedExit():void {
        this.close.emit('event');
    }
}