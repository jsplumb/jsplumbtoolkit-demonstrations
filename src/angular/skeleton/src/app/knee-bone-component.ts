import { BoneComponent } from "./bone-component";
import {Component} from "@angular/core";

@Component({ templateUrl:"bone-component.html" })
export class KneeBoneComponent extends BoneComponent {
    boneType = "KNEE"
}
