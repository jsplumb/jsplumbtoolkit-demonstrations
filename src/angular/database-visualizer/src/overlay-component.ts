import {ChangeDetectionStrategy, Component} from "@angular/core"
import {BaseAngularOverlayComponent} from "@jsplumbtoolkit/browser-ui-angular"

import { ObjectData } from "@jsplumbtoolkit/browser-ui"

@Component({

  template: ` <button class="node-remove" (click)="remove()" aria-label="Add column">
            X</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class DeleteConnectionOverlayComponent extends BaseAngularOverlayComponent {

  updateEdge(updates: ObjectData): void {

    console.log('updateEdge', updates);

  }

  remove(): void {

    this.removeEdge();

  }

}
