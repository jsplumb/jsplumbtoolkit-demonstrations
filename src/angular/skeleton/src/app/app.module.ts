import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

import { KneeBoneComponent } from './knee-bone-component';
import { ShinBoneComponent } from './shin-bone-component';
import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular";

@NgModule({
    declarations: [
        AppComponent, KneeBoneComponent, ShinBoneComponent // Any components used to render nodes/groups/ports must be declared in the `declarations` array
    ],
    imports: [
        BrowserModule, jsPlumbToolkitModule // import the jsPlumbToolkitModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // JSPLUMB requires this
})
export class AppModule { }
