import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DialogContainerComponent } from '../Dialog/dialog-container.component'
import { GlobalService } from './app.global.service';

@Component({
    selector: '[my-app]',
    template: require('./app.component.tpl.html')
})

export class AppComponent implements AfterViewInit {
    @ViewChild(DialogContainerComponent) _dialogContainer: DialogContainerComponent;
    constructor(private _globalService: GlobalService) {
    }

    ngAfterViewInit() {
        this._globalService.dialogContainer = this._dialogContainer;
    }
}