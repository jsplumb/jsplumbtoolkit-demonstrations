import * as React from 'react'


/**
 * Component used to render an output node.
 */
export default function OutputComponent ({ctx, nodeOps}) {

    const { vertex, surface, toolkit } = ctx;
    const data = vertex.data;

    return <div style={{width:data.w + 'px', height:data.h + 'px'}} className="flowchart-object flowchart-output" data-jtk-target="true" data-jtk-port-type="target">
        <svg width={data.w} height={data.h}>
            <rect x={0} y={0} width={data.w} height={data.h} rx={5} ry={5}/>
        </svg>
        <span>{data.text}</span>
        <div className="node-edit node-action" onClick={() => nodeOps.edit(vertex, toolkit)}></div>
        <div className="node-delete node-action" onClick={() => nodeOps.remove(vertex, toolkit)}></div>
    </div>
}
