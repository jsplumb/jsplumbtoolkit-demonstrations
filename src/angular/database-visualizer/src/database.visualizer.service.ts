import { Injectable } from '@angular/core';
import {Dialogs, ShowOptions} from "@jsplumbtoolkit/browser-ui"
import {BrowserUIAngular, jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"

@Injectable({
  providedIn: 'root'
})
export class DatabaseVisualizerService {

  private TOOLKIT_ID = "dbVis"
  private dialogs:Dialogs
  private _toolkit:BrowserUIAngular

  constructor(private $jsplumb:jsPlumbService) {
    this.dialogs = new Dialogs({selector:".dlg"})
  }

  showDialog(options:ShowOptions) {
    this.dialogs.show(options)
  }

  get toolkit():BrowserUIAngular {
    if (this._toolkit == null) {
      this._toolkit = this.$jsplumb.getToolkit(this.TOOLKIT_ID);
    }
    return this._toolkit
  }
}
