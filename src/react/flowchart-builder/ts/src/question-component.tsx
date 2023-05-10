import * as React from 'react';

/**
 * Component used to render a Question node.
 */
export default function QuestionComponent({ctx, nodeOps}){

    const { vertex, surface, toolkit } = ctx;
    const data = vertex.data;

    return <div style={{width:data.w + 'px', height:data.h + 'px'}} className="flowchart-object flowchart-question" data-jtk-target="true" data-jtk-port-type="target">
        <svg width={data.w} height={data.h}>
            <path d={'M' +  (data.w/2) + ' 10 L ' + (data.w - 10) + ' ' +  (data.h/2) + ' L ' + (data.w/2) + ' ' + (data.h - 10) + '  L 10 ' + (data.h/2) + '  Z'} className="inner"/>
        </svg>
        <span>{data.text}</span>
        <div className="node-edit node-action" onClick={() => nodeOps.edit(vertex, toolkit)}></div>
        <div className="node-delete node-action" onClick={() => nodeOps.remove(vertex, toolkit)}></div>
        <div className="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
    </div>
}
