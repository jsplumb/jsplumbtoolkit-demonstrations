import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-angular";

export abstract class BoneComponent extends BaseNodeComponent {

  abstract boneType:string;

  hitMe() {
    alert("ouch! My " + this.getNode().data.type + "!")
  }

}
