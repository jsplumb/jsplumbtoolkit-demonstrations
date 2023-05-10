import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import {
    JsPlumbToolkitMiniviewComponent,
    JsPlumbToolkitSurfaceComponent,
}  from '@jsplumbtoolkit/browser-ui-react'

import {
    DrawingToolsPlugin,
    LassoPlugin,
    CancelFunction, CommitFunction,
    Edge, Vertex,
    AbsoluteLayout,
    Node,
    uuid,
    EVENT_CANVAS_CLICK,
    EVENT_CLICK,
    EVENT_DBL_CLICK,
    EVENT_TAP,
    ArrowOverlay,
    BlankEndpoint,
    LabelOverlay,
    AnchorLocations,
    newInstance,
    OrthogonalConnector,
    EdgePathEditor
} from "@jsplumbtoolkit/browser-ui"


import QuestionComponent from './question-component'
import ActionComponent from './action-component'
import OutputComponent from './output-component'

import StartComponent from './start-component'
// controls component provides undo/redo/zoom to fit, etc

import ControlsComponent  from './controls-component'
// drag nodes from palette to canvas

import DragDropNodeSource from './drag-drop-node-source'
// node ops contains methods that the node components need - edit, remove.

import createNodeOps from './node-ops'
// in this demonstration we use the Toolkit's Dialogs package, but this is not a requirement for
// working with the toolkit.

import createDialogManager from './dialog-manager'


const START = "start"
const OUTPUT = "output"
const ACTION = "action"
const QUESTION = "question"
const SELECTABLE = "selectable"
const DEFAULT = "default"
const SOURCE = "source"
const TARGET = "target"
const RESPONSE = "response"

const mainElement = document.querySelector("#jtk-demo-flowchart"),
        nodePaletteElement = mainElement.querySelector(".node-palette");

const dialogManager = createDialogManager()
const nodeOps = createNodeOps(dialogManager)

function DemoComponent(props) {

    const pathEditor = useRef(null)
    const surfaceComponent = useRef(null)
    const miniviewContainer = useRef(null)
    const controlsContainer = useRef(null)

    const toolkit = newInstance({
        nodeFactory: (type:string, data:Record<string, any>, callback:Function) => {
            dialogManager.showTextDialog(
                "Enter " + type + " name:",
                {},
                (d:Record<string, any>) => {
                    data.text = d.text;
                    // if the user entered a name...
                    if (data.text) {
                        // and it was at least 2 chars
                        if (data.text.length >= 2) {
                            // set an id and continue.
                            data.id = uuid();
                            callback(data);
                        }
                        else
                        // else advise the user.
                            alert(type + " names must be at least 2 characters!");
                    }
                    // else...do not proceed.
                }
            );
            return true
        },
        beforeStartConnect:(source:Vertex, edgeType:string) => {
            // limit edges from start node to 1. if any other type of node, return
            return (source.data.type === START && source.getEdges().length > 0) ? false : { label:"..." }
        },
        edgeFactory: (type: string, data: Record<string, any>, continueCallback: CommitFunction, abortCallback: CancelFunction):boolean => {
            dialogManager.showEdgeLabelDialog(data, continueCallback, abortCallback)
            return true
        }
    });

    const view = {
        nodes: {
            [START]: {
                jsx:(ctx:any) => { return <StartComponent ctx={ctx} nodeOps={nodeOps}/> }
            },
            [SELECTABLE]: {
                events: {
                    [EVENT_TAP]:  (params:{obj:Node}) => {
                        toolkit.toggleSelection(params.obj);
                    }
                }
            },
            [QUESTION]: {
                parent: SELECTABLE,
                jsx:(ctx:any) => { return <QuestionComponent ctx={ctx} nodeOps={nodeOps}/> }
            },
            [ACTION]: {
                parent: SELECTABLE,
                jsx:(ctx:any) => { return <ActionComponent ctx={ctx} nodeOps={nodeOps}/> }
            },
            [OUTPUT]:{
                parent:SELECTABLE,
                jsx:(ctx:any) => { return <OutputComponent ctx={ctx} nodeOps={nodeOps}/> }
            }
        },
        // There are two edge types defined - 'yes' and 'no', sharing a common
        // parent.
        edges: {
            [DEFAULT]: {
                anchor:AnchorLocations.AutoDefault,
                endpoint:BlankEndpoint.type,
                connector: { type:OrthogonalConnector.type, options:{ cornerRadius: 5 } },
                paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
                hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
                events: {
                    [EVENT_DBL_CLICK]:  (params:any) => {
                        dialogManager.showConfirmDialog("Delete Edge", () => {
                            toolkit.removeEdge(params.edge)
                        }
                        )
                    },
                    [EVENT_CLICK]: (params:any) => {
                        pathEditor.current.startEditing(params.edge, {})
                    }
                },
                overlays: [
                    { type:ArrowOverlay.type, options:{ location: 1, width: 10, length: 10 }},
                    { type:ArrowOverlay.type, options:{ location: 0.3, width: 10, length: 10 }}
                ]
            },
            [RESPONSE]:{
                parent:DEFAULT,
                overlays:[
                    {
                        type: LabelOverlay.type,
                        options:{
                            label: "${label}",
                            events:{
                                click:(params:{edge:Edge}) => {
                                    _editLabel(params.edge);
                                }
                            }
                        }
                    }
                ]
            }
        },
        ports: {
            [START]: {
                edgeType: DEFAULT
            },
            [SOURCE]: {
                maxConnections: -1,
                edgeType: RESPONSE
            },
            [TARGET]: {
                maxConnections: -1,
                isTarget: true
            }
        }
    }

    const renderParams = {
        // Layout the nodes using an absolute layout
        layout: {
            type: AbsoluteLayout.type
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e:Event) => {
                toolkit.clearSelection()
                pathEditor.current.stopEditing()
            }
        },
        lassoInvert:true,
        consumeRightClick: false,
        dragOptions: {
            filter: ".jtk-draw-handle, .node-action, .node-action i"
        },
        zoomToFit:true,
        plugins:[
            DrawingToolsPlugin.type, LassoPlugin.type
        ],
        grid:{
            size:{
                w: 20,
                h: 20
            }
        },
        magnetize: {
            afterDrag: true
        }
    }


    const draggableNodeTypes = [
        { type:"question", label:"Question" },
        { type:"action", label:"Action" },
        { type:"output", label:"Output" }
    ]

    useEffect(() => {

        // on mount, setup a few things:

        // the edge editor.
        pathEditor.current = new EdgePathEditor(surfaceComponent.current.surface)

        // controls component. needs to be done here as it needs a reference to the surface.
        const c = createRoot(controlsContainer.current)
        c.render(
            <ControlsComponent surface={surfaceComponent.current.surface}/>
        );

        // drag/drop new nodes.
        const p = createRoot(nodePaletteElement)
        p.render(
            <DragDropNodeSource
                surface={surfaceComponent.current.surface}
                container={nodePaletteElement}
                items={draggableNodeTypes}
            />);
        //

        // a miniview.
        const m = createRoot(miniviewContainer.current)
        m.render(
            <JsPlumbToolkitMiniviewComponent surface={surfaceComponent.current.surface}/>
        );

        // finally, load some data
        toolkit.load({url:"data/copyright.json"})

    })

    const _editLabel = (edge:Edge, deleteOnCancel?:boolean) => {
        dialogManager.showEdgeLabelDialog(edge.data, (data) => {
            toolkit.updateEdge(edge, { label:data.label || "" });
        }, () => {
            if (deleteOnCancel) {
                toolkit.removeEdge(edge);
            }
        })
    }

    return <div style={{width:"100%",height:"100%",display:"flex"}}>
        <JsPlumbToolkitSurfaceComponent renderParams={renderParams} toolkit={toolkit} view={view} ref={ surfaceComponent }/>
        <div className="controls" ref={ controlsContainer }/>
        <div className="miniview" ref={ miniviewContainer }/>
    </div>
}

const canvas = document.querySelector(".jtk-demo-canvas")
const root = createRoot(canvas)
root.render(<DemoComponent/>)

