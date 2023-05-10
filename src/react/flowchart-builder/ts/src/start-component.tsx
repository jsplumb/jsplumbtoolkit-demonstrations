import * as React from 'react'

/**
 * Component used to render a start node. Note that this component extends the Toolkit's BaseNodeComponent, whereas the others
 * extend the 'BaseEditableComponent' - the other node types can have their labels edited, or be removed, and this node type cannot.
 */
export default function StartComponent({ctx, nodeOps}){

    const { vertex, surface, toolkit } = ctx;
    const data = vertex.data;

    return <div style={{width:data.w + 'px', height:data.h + 'px'}} className="flowchart-object flowchart-start">
            <svg width={data.w} height={data.h}>
                <ellipse cx={data.w / 2} cy={data.h / 2} rx={(data.w /2) - 10} ry={(data.h/2) - 10} className="inner"/>
            </svg>
            <span>{data.text}</span>
            <div className="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
        </div>
}
