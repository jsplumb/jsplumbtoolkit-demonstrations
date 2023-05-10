import { BoneComponent } from "./bone-component";
import {Component} from "@angular/core";

@Component({ templateUrl:"bone-component.html" })
export class ShinBoneComponent extends BoneComponent {
  boneType = "SHIN";
}