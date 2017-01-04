import { NgModule } from '@angular/core';
import {DialogComponent} from './dialog.component';
import { DialogContainerComponent } from './dialog-container.component';
import { DialogService } from './dialog.service'

@NgModule({
    declarations: [DialogContainerComponent, DialogComponent],
    exports: [DialogContainerComponent],
    providers: [DialogService],
    entryComponents:[DialogComponent]
})
export class DialogModule { }