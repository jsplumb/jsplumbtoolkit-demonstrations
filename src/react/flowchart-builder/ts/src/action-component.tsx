import React from 'react'

/**
 * Component used to render an action node.
 */
export default function ActionComponent({ctx, nodeOps}) {

    const { vertex, surface, toolkit } = ctx;
    const data = vertex.data;

    return <div style={{width:data.w + 'px', height:data.h + 'px'}} className="flowchart-object flowchart-action" data-jtk-target="true" data-jtk-port-type="target">
        <svg width={data.w} height={data.h}>
            <rect x={10} y={10} width={data.w-20} height={data.h-20} className="inner" rx={5} ry={5}/>
        </svg>
        <span>{data.text}</span>
        <div className="node-edit node-action" onClick={() => nodeOps.edit(vertex, toolkit)}></div>
        <div className="node-delete node-action" onClick={() => nodeOps.remove(vertex, toolkit)}></div>
        <div className="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
    </div>
}
