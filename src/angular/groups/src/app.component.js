"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var jsplumbtoolkit_1 = require("jsplumbtoolkit");
var jsplumbtoolkit_angular_1 = require("./jsplumbtoolkit-angular");
// ----------------------- node components -------------------------
// TODO figure out how these can be created more easily.
var BaseNodeComponent = (function () {
    function BaseNodeComponent() {
    }
    BaseNodeComponent.prototype.ngAfterViewInit = function () {
        this.surface.getJsPlumb().revalidate(this._el);
    };
    return BaseNodeComponent;
}());
// ----------------- node -------------------------------
var NodeComponent = (function (_super) {
    __extends(NodeComponent, _super);
    function NodeComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeComponent.prototype.remove = function (obj) {
        this.toolkit.removeNode(obj);
    };
    return NodeComponent;
}(BaseNodeComponent));
NodeComponent = __decorate([
    core_1.Component({
        templateUrl: "templates/node.html"
    })
], NodeComponent);
exports.NodeComponent = NodeComponent;
// ----------------- group -------------------------------
var GroupComponent = (function (_super) {
    __extends(GroupComponent, _super);
    function GroupComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupComponent.prototype.toggleGroup = function (group) {
        this.surface.toggleGroup(group);
    };
    return GroupComponent;
}(BaseNodeComponent));
GroupComponent = __decorate([
    core_1.Component({
        templateUrl: "templates/group.html"
    })
], GroupComponent);
exports.GroupComponent = GroupComponent;
// -------------- /node components ------------------------------------
var AppComponent = (function () {
    function AppComponent() {
        var _this = this;
        this.draggableTypes = [
            { label: "Node", type: "node" },
            { label: "Group", type: "group", group: true }
        ];
        this.toolkitParams = {
            groupFactory: function (type, data, callback) {
                data.title = "Group " + (_this.toolkitComponent.toolkit.getGroupCount() + 1);
                callback(data);
            },
            nodeFactory: function (type, data, callback) {
                data.name = (_this.toolkitComponent.toolkit.getNodeCount() + 1);
                callback(data);
            }
        };
        this.view = {
            nodes: {
                "default": {
                    template: "node"
                }
            },
            groups: {
                "default": {
                    template: "group",
                    endpoint: "Blank",
                    anchor: "Continuous",
                    revert: false,
                    orphan: true,
                    constrain: false
                },
                constrained: {
                    parent: "default",
                    constrain: true
                }
            }
        };
        this.renderParams = {
            layout: {
                type: "Absolute"
            },
            events: {
                canvasClick: function (e) {
                    _this.toolkitComponent.toolkit.clearSelection();
                },
                modeChanged: function (mode) {
                    var controls = document.querySelector(".controls");
                    jsplumbtoolkit_1.jsPlumb.removeClass(controls.querySelectorAll("[mode]"), "selected-mode");
                    jsplumbtoolkit_1.jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), "selected-mode");
                }
            },
            jsPlumb: {
                Anchor: "Continuous",
                Endpoint: "Blank",
                Connector: ["StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" }],
                PaintStyle: { strokeWidth: 1, stroke: '#89bcde' },
                HoverPaintStyle: { stroke: "orange" },
                Overlays: [
                    ["Arrow", { fill: "#09098e", width: 10, length: 10, location: 1 }]
                ]
            },
            lassoFilter: ".controls, .controls *, .miniview, .miniview *",
            dragOptions: {
                filter: ".delete *"
            },
            consumeRightClick: false
        };
    }
    AppComponent.prototype.nodeResolver = function (typeId) {
        return ({
            "node": NodeComponent,
            "group": GroupComponent
        })[typeId];
    };
    AppComponent.prototype.toggleSelection = function (node) {
        this.toolkitComponent.toolkit.toggleSelection(node);
    };
    AppComponent.prototype.typeExtractor = function (el) {
        return el.getAttribute("jtk-node-type");
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        var toolkit = this.toolkitComponent.toolkit;
        var surface = this.toolkitComponent.surface;
        var controls = document.querySelector(".controls");
        // pan mode/select mode
        jsplumbtoolkit_1.jsPlumb.on(controls, "tap", "[mode]", function () {
            surface.setMode(this.getAttribute("mode"));
        });
        // on home button click, zoom content to fit.
        jsplumbtoolkit_1.jsPlumb.on(controls, "tap", "[reset]", function () {
            toolkit.clearSelection();
            surface.zoomToFit();
        });
        // ---------------- update data set -------------------------
        var _syntaxHighlight = function (json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return "<pre>" + json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    }
                    else {
                        cls = 'string';
                    }
                }
                else if (/true|false/.test(match)) {
                    cls = 'boolean';
                }
                else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }) + "</pre>";
        };
        var datasetContainer = document.querySelector(".jtk-demo-dataset");
        var _updateDataset = function () {
            datasetContainer.innerHTML = _syntaxHighlight(JSON.stringify(toolkit.exportData(), null, 4));
        };
        toolkit.bind("dataUpdated", _updateDataset);
        toolkit.load({
            data: {
                "groups": [
                    { "id": "one", "title": "Group 1", "left": 100, top: 50 },
                    { "id": "two", "title": "Group 2", "left": 450, top: 250, type: "constrained" }
                ],
                "nodes": [
                    { "id": "window1", "name": "1", "left": 10, "top": 20, group: "one" },
                    { "id": "window2", "name": "2", "left": 140, "top": 50, group: "one" },
                    { "id": "window3", "name": "3", "left": 450, "top": 50 },
                    { "id": "window4", "name": "4", "left": 110, "top": 370 },
                    { "id": "window5", "name": "5", "left": 140, "top": 150, group: "one" },
                    { "id": "window6", "name": "6", "left": 50, "top": 50, group: "two" },
                    { "id": "window7", "name": "7", "left": 50, "top": 450 }
                ],
                "edges": [
                    { "source": "window1", "target": "window3" },
                    { "source": "window1", "target": "window4" },
                    { "source": "window3", "target": "window5" },
                    { "source": "window5", "target": "window2" },
                    { "source": "window4", "target": "window6" },
                    { "source": "window6", "target": "window2" }
                ]
            },
            onload: function () {
                surface.centerContent();
                surface.repaintEverything();
            }
        });
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild(jsplumbtoolkit_angular_1.jsPlumbToolkitComponent),
    __metadata("design:type", jsplumbtoolkit_angular_1.jsPlumbToolkitComponent)
], AppComponent.prototype, "toolkitComponent", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'jsplumb-demo',
        template: "<div class=\"sidebar node-palette\" jsplumb-palette selector=\"li\" surfaceId=\"demoSurface\" [typeExtractor]=\"typeExtractor\">\n                <ul>\n                    <li *ngFor=\"let nodeType of draggableTypes\" [attr.jtk-node-type]=\"nodeType.type\" title=\"Drag to add new\" [attr.jtk-group]=\"nodeType.group\">\n                            {{nodeType.label}}\n                    </li>\n                </ul>\n                </div>\n                <jsplumb-toolkit #toolkit surfaceId=\"demoSurface\" jtkId=\"demo\" [view]=\"view\" [renderParams]=\"renderParams\" [toolkitParams]=\"toolkitParams\" [nodeResolver]=\"nodeResolver\"></jsplumb-toolkit>\n              <jsplumb-miniview surfaceId=\"demoSurface\"></jsplumb-miniview>"
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map