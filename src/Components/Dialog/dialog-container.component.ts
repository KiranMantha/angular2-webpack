import { Component, Type, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { DialogComponent } from './dialog.component';

@Component({
    selector: 'dialog-container',
    template: '<div></div>'
})
export class DialogContainerComponent {
    constructor(private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) { }

    public createDialog(dialogComponent: { new (): DialogComponent }, _bodyComponent: Type<Component>): ComponentRef<DialogComponent> {
        this.viewContainer.clear();

        let dialogComponentFactory =
            this.componentFactoryResolver.resolveComponentFactory(dialogComponent);
        let dialogComponentRef = this.viewContainer.createComponent(dialogComponentFactory);

        dialogComponentRef.instance.close.subscribe(() => {
            dialogComponentRef.destroy();
        });

        dialogComponentRef.instance.open(_bodyComponent);

        return dialogComponentRef;
    }
}