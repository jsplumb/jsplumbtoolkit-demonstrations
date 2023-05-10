import { Component, ViewChild, Directive } from '@angular/core'
import {EVENT_TAP, EVENT_CLICK, Surface, EVENT_CANVAS_CLICK, BlankEndpoint, ArrowOverlay, DEFAULT, AnchorLocations } from '@jsplumbtoolkit/browser-ui'
import { BrowserUIAngular, jsPlumbSurfaceComponent, jsPlumbService } from '@jsplumbtoolkit/browser-ui-angular'
import {
    Node,
    Group,
    AbsoluteLayout,
    StateMachineConnector
} from '@jsplumbtoolkit/browser-ui'

@Directive()
class BaseNodeComponent {
    toolkit:BrowserUIAngular
    surface:Surface
    _el:any
    obj:any

    ngAfterViewInit() {
        this.surface.jsplumb.revalidate(this._el)
    }
}

// ----------------- node -------------------------------

@Component({    
    templateUrl:"templates/node.html"
})
export class NodeComponent extends BaseNodeComponent {
    remove(obj:any) {
        this.toolkit.removeNode(obj);
    }
}

// ----------------- group -------------------------------

@Component({
    templateUrl:"templates/group.html"
})
export class GroupComponent extends BaseNodeComponent {

    toggleGroup(group:any) {
        this.surface.toggleGroup(group);
    }
}

// -------------- /node components ------------------------------------

@Component({
    selector: 'jsplumb-demo',
    template: `
        <div class="jtk-demo-canvas">
            <jsplumb-controls [surfaceId]="surfaceId"></jsplumb-controls>
            <jsplumb-surface [surfaceId]="surfaceId" [toolkitId]="toolkitId" [view]="view" [renderParams]="renderParams" [toolkitParams]="toolkitParams"></jsplumb-surface>
            <jsplumb-miniview [surfaceId]="surfaceId"></jsplumb-miniview>
        </div>
        <div class="jtk-demo-rhs">
            <div class="sidebar node-palette"
                 jsplumb-surface-drop
                 selector="div"
                 surfaceId="demoSurface"
                 [dataGenerator]="dataGenerator">

                <div *ngFor="let nodeType of draggableTypes" [attr.data-node-type]="nodeType.type" title="Drag to add new" [attr.data-jtk-is-group]="nodeType.group" class="sidebar-item">
                    {{nodeType.label}}
                </div>
            </div>
            <p>
                This is a demonstration of the Groups functionality, using Angular.
            </p>
            <ul>
                <li>Drag new Nodes/Groups from the palette on the left onto the workspace. You can drag Nodes directly into
                    Groups.</li>
                <li>Collapse/Expand Groups with the -/+ buttons</li>
                <li>Drag existing Nodes into Groups to add them.</li>
                <li>Nodes can be dragged out of Group 1 but not out of Group 2</li>
                <li>Click the 'Pencil' icon to enter 'select' mode, then select several nodes. Click the canvas to exit.</li>
                <li>Click the 'Home' icon to zoom out and see all the nodes.</li>
            </ul>
            <jsplumb-dataset [toolkitId]="toolkitId"></jsplumb-dataset>
        </div>
            
    
    
    
                `
})
export class AppComponent { 

    @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

    toolkit:BrowserUIAngular
    surface:Surface

    toolkitId:string
    surfaceId:string

    constructor(private $jsplumb:jsPlumbService) {
        this.toolkitId = "demo";
        this.surfaceId = "demoSurface";
    }

    ngOnInit() {
        this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
    }

    draggableTypes = [
        {label: "Node", type: "node"},
        {label: "Group", type: "group", group:true }
    ];

    toolkitParams:any = {
        groupFactory:(type:string, data:any, callback:Function) => {
            data.title = "Group " + (this.toolkit.getGroupCount() + 1)
            callback(data)
        },
        nodeFactory:(type:string, data:any, callback:Function) => {
            data.name = (this.toolkit.getNodeCount() + 1)
            callback(data)
        }
    }

    toggleSelection(node:any) {  
        this.toolkit.toggleSelection(node)
    }

    view = {
        nodes:{
            [DEFAULT]:{
                component:NodeComponent,
                events: {
                    [EVENT_TAP]: (params:{el:Element, obj:Node, renderer:Surface, e:Event, toolkit:BrowserUIAngular}) => {
                        this.toolkit.toggleSelection(params.obj);
                    }
                }
            }
        },
        groups:{
            [DEFAULT]:{
                component:GroupComponent,
                endpoint:BlankEndpoint.type,
                anchor:AnchorLocations.Continuous,
                revert:false,
                orphan:true,
                constrain:false,
                autoSize:true,
                layout:{
                    type:AbsoluteLayout.type
                },
                events:{
                    [EVENT_CLICK]:(p:{el:Element, obj:Group, renderer:Surface, e:Event, toolkit:BrowserUIAngular}) => {
                        console.log(p)
                    }
                }
            },
            constrained:{
                parent:DEFAULT,
                constrain:true
            }
        }
    };

    renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e:Event) => {
                this.toolkit.clearSelection()
            }
        },
        defaults: {
            anchor:AnchorLocations.Continuous,
            endpoint: BlankEndpoint.type,
            connector: { type:StateMachineConnector.type, options:{ cssClass: "connectorClass", hoverClass: "connectorHoverClass" } },
            paintStyle: { strokeWidth: 1, stroke: '#89bcde' },
            hoverPaintStyle: { stroke: "orange" },
            connectionOverlays: [
                { type: ArrowOverlay.type, options:{ fill: "#09098e", width: 10, length: 10, location: 1 } }
            ]
        },
        lassoFilter: ".controls, .controls *, .miniview, .miniview *",
        dragOptions: {
            filter: ".delete *"
        },
        consumeRightClick:false
    };

    dataGenerator(el:Element) {
        return { type:el.getAttribute("data-node-type") }
    }

    ngAfterViewInit() {

        this.surface = this.surfaceComponent.surface
        this.toolkit = this.surface.toolkitInstance
        this.toolkit.load({
            data : {
                "groups":[
                    {"id":"one", "title":"Group 1", "left":100, top:50 },
                    {"id":"two", "title":"Group 2", "left":750, top:250, type:"constrained"  },
                    {"id":"three", "title":"Nested Group", "left":50, "top":50, "group":"two"  }
                ],
                "nodes": [
                    { "id": "window1", "name": "1", "left": 10, "top": 20, group:"one" },
                    { "id": "window2", "name": "2", "left": 140, "top": 50, group:"one" },
                    { "id": "window3", "name": "3", "left": 450, "top": 50 },
                    { "id": "window4", "name": "4", "left": 110, "top": 370 },
                    { "id": "window5", "name": "5", "left": 140, "top": 150, group:"one" },
                    { "id": "window6", "name": "6", "left": 450, "top": 50, group:"two" },
                    { "id": "window7", "name": "7", "left": 50, "top": 450 }
                ],
                "edges": [
                    { source:"window3", target:"one"},
                    { source:"window3", target:"window4"},
                    { source:"one", target:"two"},
                    { source:"window5", target:"window6"},
                    { source:"window1", target:"window2"},
                    { source:"window1", target:"window5"}
                ]
            },
            onload:() => {
                this.surface.centerContent();
                this.surface.repaintEverything()
            }
        })
    }

}
