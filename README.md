# jsplumbtoolkit-demonstrations

The demonstrations in this repository are intended to provide a deep dive into specific features that the jsPlumb Toolkit offers. Each of the demonstrations is written in 'vanilla' JS, that is without using a library integration, but any functionality shown here can be used with the Toolkit's library integrations. 

These demonstrations require a 6.x version of the Toolkit.

## Setup

```
npm i
npm run build
```

## Accessing the demonstrations

```
npm run serve
```

The demonstrations will be served at [http://localhost:8080](http://localhost:8080).


## Active Filtering

A demonstration of the [Active Filtering plugin](https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/plugins-overview#active-filtering). Active filtering is a means of disabling targets when the user starts to drag a new edge, and can give your applications a nice boost in terms of their user friendliness and usability.

## Layouts

This demonstration is a test harness for the various layouts that the Toolkit offers.

## Paths

A demonstration of the Toolkit's support for path tracing.  


## Porting to an app using a library integration

The concepts in these demonstrations are all supported by the various library integrations, with the caveat that the way you pass configuration to the Toolkit may differ slightly from vanilla JS.

### Angular

The main thing to keep in mind with the Angular integration is that the `view` is passed in separately to the main render parameters. For instance in Vanilla js perhaps you have this:

```javascript
const mySurface = toolkit.render(someContainer, {
    view:{
        nodes:{
            ...
        },
        edges:{
            ...
        }
    },
    layout:{
        type:AbsoluteLayout.type
    },
    zoomToFit:true,
    plugins:[
        ...
    ]
})
```

whereas in Angular, when you're using the Surface component, you'll pass in the view and the render params separately:

```html
<jsplumb-surface surfaceId="mySurface" toolkitId="myToolkit" [view]="view" [renderParams]="renderParams"></jsplumb-surface>
```

so your `view` and `renderParams` will be defined separately in your component:

```javascript
export class MyComponent {
    
    view = {
        nodes:{
            someType:{
                component:SomeNodeComponent
            }
        },
        edges:{
            ...
        }
    }
    
    renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        zoomToFit:true,
        plugins:[
            ...
        ]
    }
    
}
``` 

#### Event listeners

You may also see the occasional 'registerModelEvent' or a `modelEvents` render parameter in these demonstrations. We use these in vanilla JS where with a library integration you'd more likely bind an event listener in your template. For example say we have this in vanilla JS:

```javascript
const surface = toolkit.render(someElement, {
    view:{
        ...
    },
    modelEvents:[
        {
            event:EVENT_TAP,
            selector:".node-delete",
            callback:(event, eventTarget, info) => {
                toolkit.removeNode(info.obj)
            }
        }
    ]
})
```

Here, we're listening for a tap event on an element with class `node-delete`, and we delete the node in response. In Angular we'd do this instead:

```html
<div class="some-component">
    <div class="node-delete" (click)="deleteNode()">x</div>
    <h1>other stuff</h1>
</div>
``` 

```javascript
export class SomeNodeComponent extends BaseNodeComponent {
    
    deleteNode() {
        this.removeNode()   // `removeNode` is a helper method exposed on BaseNodeComponent         
    }
    
}
```





