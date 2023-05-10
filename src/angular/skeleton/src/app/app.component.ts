import { Component, ViewChild } from '@angular/core';

import { ShinBoneComponent } from './shin-bone-component';
import { KneeBoneComponent } from './knee-bone-component';

import {jsPlumbSurfaceComponent, jsPlumbService, BrowserUIAngular, AngularViewOptions } from '@jsplumbtoolkit/browser-ui-angular'
import {
  JsPlumbToolkitOptions,
  ForceDirectedLayout,
  SurfaceRenderOptions,
  SurfaceViewOptions,
  ArrowOverlay,
  BlankEndpoint,
  LabelOverlay,
  StraightConnector,
  AnchorLocations,
  DEFAULT
} from "@jsplumbtoolkit/browser-ui"

const SHIN = "shin"
const KNEE = "knee"

/**
 * This app was created with create-react-app.  AppComponent is the entry point.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // we dont really need this, we just put it here to show you how you can do it.
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  // these are plugged in to the Surface component.
  surfaceId = "example"
  toolkitId = "example"

  toolkit:BrowserUIAngular

  constructor(private $jsplumb:jsPlumbService) {}

  ngOnInit() {
    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
  }

  // Empty in this demonstration.
  toolkitParams:JsPlumbToolkitOptions = {};

  // the view in this demonstration declares a component to use to render each node type, and the appearance and behaviour of
  // a single edge type.
  view = {
    nodes:{
      [SHIN]:{
        component:ShinBoneComponent
      },
      [KNEE]:{
        component:KneeBoneComponent
      }
    },
    edges:{
      [DEFAULT]:{
        connector:StraightConnector.type,
        anchor:AnchorLocations.Continuous,
        overlays:[
          { type:LabelOverlay.type, options:{ location:0.5, label:"${label}"}},
          { type:ArrowOverlay.type, options:{ location:1} },
          { type:ArrowOverlay.type, options:{location:0, direction:-1}}
        ],
        endpoint:BlankEndpoint.type
      }
    }
  };

  // we use a Spring layout, and we enable right-click on the canvas. on data load, we zoom the canvas to show all the data.
  renderParams:SurfaceRenderOptions = {
    layout:{
      type:ForceDirectedLayout.type
    },
    zoomToFit:true,
    consumeRightClick:false
  };

  ngAfterViewInit() {
    // load some sample data when the view is ready.
    this.toolkit.load({
      data:{
        nodes:[
          { id:"1", type:SHIN },
          { id:"2", type:KNEE }
        ],
        edges:[
          { source:"1", target:"2", data:{label:"isConnectedTo"}}
        ]
      }
    })
  }
}
