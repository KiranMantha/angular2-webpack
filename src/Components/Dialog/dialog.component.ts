import { Component, Type, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

@Component({
    selector: 'dialog-holder',
    template: require('./dialog.component.tpl.html')
})
export class DialogComponent {
    public close = new EventEmitter();
    @ViewChild('dialogBody', { read: ViewContainerRef }) dialogBody: ViewContainerRef;
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { };

    public onClickedExit(): void {
        this.close.emit('event');
    }

    public open(_bodyComponent?: Type<Component>): void {
        if (_bodyComponent) {
            let dialogBodyComponentFactory =
                this.componentFactoryResolver.resolveComponentFactory(_bodyComponent);

            this.dialogBody.createComponent(dialogBodyComponentFactory, 0, this.dialogBody.injector);
        }
    }
}