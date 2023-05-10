import {AfterViewInit, Component, ElementRef, Input} from '@angular/core'

import {
  EVENT_UNDOREDO_UPDATE,
  UndoRedoUpdateParams,
  EVENT_CANVAS_CLICK,
  EVENT_SURFACE_MODE_CHANGED,
  Surface,
  SurfaceMode,
  FALSE, TRUE
} from '@jsplumbtoolkit/browser-ui'
import {jsPlumbService} from '@jsplumbtoolkit/browser-ui-angular'

// --------------------------------------- CONTROLS COMPONENT ------------------------------------------------------------------
//
// This component was written for the jsPlumb Toolkit demonstrations. It's production ready of course, but it assumes a couple of
// other styles are available (via jsplumbtoolkit-demo-support.css), and it has
// hardcoded labels in English.


@Component({
  selector: 'jsplumb-controls',
  template: `<div class="controls">
              <i class="fa fa-arrows selected-mode" mode="pan" title="Pan Mode" (click)="panMode()"></i>
              <i class="fa fa-pencil" mode="select" title="Select Mode" (click)="selectMode()"></i>
              <i class="fa fa-home" reset title="Zoom To Fit" (click)="zoomToFit()"></i>
              <i class="fa fa-undo" undo title="Undo last action" (click)="undo()"></i>
              <i class="fa fa-repeat" redo title="Redo last action" (click)="redo()"></i>
              <i class="fa fa-times" title="Clear flowchart" (click)="clear()"></i>
          </div>`
})
export class ControlsComponent implements AfterViewInit {

  @Input() surfaceId: string

  surface: Surface

  constructor(private el: ElementRef, private $jsplumb: jsPlumbService) { }

  getNativeElement(component: any) {
    return (component.nativeElement || component._nativeElement || component.location.nativeElement).childNodes[0]
  }

  panMode() {
    this.surface.setMode(SurfaceMode.PAN)
  }

  selectMode() {
    this.surface.setMode(SurfaceMode.SELECT)
  }

  zoomToFit() {
    this.surface.toolkitInstance.clearSelection()
    this.surface.zoomToFit()
  }

  undo() {
    this.surface.toolkitInstance.undo()
  }

  redo() {
    this.surface.toolkitInstance.redo()
  }

  ngAfterViewInit() {
    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {

      this.surface = s
      this.surface.bind(EVENT_SURFACE_MODE_CHANGED, (mode: string) => {
        const controls = this.getNativeElement(this.el)
        this.surface.removeClass(controls.querySelectorAll('[mode]'), 'selected-mode')
        this.surface.addClass(controls.querySelectorAll(`[mode='${mode}']`), 'selected-mode')
      });

      this.surface.toolkitInstance.bind(EVENT_UNDOREDO_UPDATE, (state: UndoRedoUpdateParams) => {
        const controls = this.getNativeElement(this.el)
        controls.setAttribute('can-undo', state.undoCount > 0 ? TRUE : FALSE)
        controls.setAttribute('can-redo', state.redoCount > 0 ? TRUE : FALSE)
      })

      this.surface.bind(EVENT_CANVAS_CLICK, () => this.surface.toolkitInstance.clearSelection())

    })
  }

  clear() {
    const t = this.surface.toolkitInstance
    if (t.getNodeCount() === 0 || confirm('Clear flowchart?')) {
      t.clear()
    }
  }
}


// -------------------------------------------- / CONTROLS COMPONENT ----------------------------------------------------
