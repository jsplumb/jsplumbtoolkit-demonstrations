import * as React from 'react'

import { useEffect } from 'react'
import { SurfaceDropManager } from '@jsplumbtoolkit/browser-ui'

/**
 *
 * @param items Array<{type:string, label:string>}> list of draggable items, with their type and label
 * @param surface Surface The surface to attach to
 * @param container HTMLElement The element this component is to be drawn into. We use this so that the drag/drop
 * can be located anywhere on the screen.
 * @constructor
 */
export default function DragDropNodeSource({items, surface, container})  {

    /**
     * this is invoked when the user starts dragging something. it returns object type and
     * initial width/height.
     * @param el
     */
    const dataGenerator = (el:Element)  => {
        return {
            w:el.getAttribute("data-width"),
            h:el.getAttribute("data-height"),
            type:el.getAttribute("data-node-type")
        }
    }

    useEffect(() => {
        new SurfaceDropManager({
            source:container,
            surface,
            selector:"div",
            dataGenerator
        })
    })

    return items.map(ns => {
            return <div data-node-type={ns.type} title="Drag to add new" className="sidebar-item" data-width="240"
                        data-height="160">{ns.label}</div>
        })
}

