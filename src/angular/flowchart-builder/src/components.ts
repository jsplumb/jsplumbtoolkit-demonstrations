import {isNode} from '@jsplumbtoolkit/browser-ui'
import {BaseNodeComponent} from '@jsplumbtoolkit/browser-ui-angular'
import {Component} from '@angular/core'
import {FlowchartService} from './app/flowchart.service'


/**
 * This is the base class for editable nodes in this demo. It extends `BaseNodeComponent` from the angular integration.
 */
export class BaseEditableNodeComponent extends BaseNodeComponent {

  constructor(protected flowchartService: FlowchartService) {
    super()
  }

  removeNode () {
    const obj = this.getNode()
    if (obj != null) {
      if (isNode(obj)) {
        this.flowchartService.showDialog({
          id: 'dlgConfirm',
          data: {
            msg: `Delete ${obj.data.text} ?`
          },
          onOK: () => {
            this.toolkit.removeNode(obj)
          }
        })
      }
    }
  }

  editNode() {
    const obj = this.getNode()
    this.flowchartService.showDialog({
      id: 'dlgText',
      data: obj.data,
      title: `Edit ${obj.data.type} name`,
      onOK: (data: any) => {
        if (data.text && data.text.length > 2) {
          // if name is at least 2 chars long, update the underlying data and
          // update the UI.
          this.toolkit.updateNode(obj, data)
        }
      }
    })
  }

}

// ----------------- question node -------------------------------

@Component({ templateUrl: 'templates/question.html' })
export class QuestionNodeComponent extends BaseEditableNodeComponent {
  constructor(flowchartService: FlowchartService) {
    super(flowchartService)
  }
}

// ----------------- action node -------------------------------

@Component({ templateUrl: 'templates/action.html' })
export class ActionNodeComponent extends BaseEditableNodeComponent  {
  constructor(flowchartService: FlowchartService) {
    super(flowchartService)
  }
}

// ----------------- start node -------------------------------

@Component({ templateUrl: 'templates/start.html' })
export class StartNodeComponent extends BaseEditableNodeComponent  {
  constructor(flowchartService: FlowchartService) {
    super(flowchartService)
  }
}

// ----------------- output node -------------------------------

@Component({ templateUrl: 'templates/output.html' })
export class OutputNodeComponent extends BaseEditableNodeComponent  {
  constructor(flowchartService: FlowchartService) {
    super(flowchartService)
  }
}

// -------------- /node components ------------------------------------
