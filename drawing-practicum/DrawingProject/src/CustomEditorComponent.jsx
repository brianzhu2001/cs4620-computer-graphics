import {ASVGLabEditGraphicsComponent} from "AniGraph";

// import A2JointIKInteraction from "./privatecode/A2JointIKInteraction"
// import ADragToRotateInteraction from "./privatecode/ADragToRotateInteraction"
import {ABoundingBox2DController, AIDragScaleAroundAnchor, AIDragAnchor, AIDragShapePosition} from "AniGraph"
import Rotation from "./interactions/Rotation";
import Kinematics from "./interactions/Kinematics";

export default class CustomEditorComponent extends ASVGLabEditGraphicsComponent{
    initEditModes(){
        super.initEditModes();

        this.addSelectionController('Rotation', new ABoundingBox2DController({
            component: this,
            handleInteractionClasses: [AIDragScaleAroundAnchor],
            anchorInteractionClasses: [AIDragAnchor],
            hostViewInteractionClasses: [Rotation],
            groupBoxInteractionClasses: [Rotation]
        }));

        this.addSelectionController('InverseKinematics', new ABoundingBox2DController({
            component: this,
            handleInteractionClasses: [AIDragScaleAroundAnchor],
            anchorInteractionClasses: [AIDragAnchor],
            hostViewInteractionClasses: [Kinematics],
            groupBoxInteractionClasses: [Kinematics]
        }));

    }

}