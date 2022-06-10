import {
    Matrix3x3,
    Vec2,
    Precision,
    ADragInteraction,
    ADragValueInteraction
} from "AniGraph"

export default class Rotation extends ADragInteraction{

    static Create(args){
        // Use the super class's Create function to instantiate the AInteraction subclass that we will return
        const interaction = super.Create(args);
        interaction.model = interaction.controller.getModel();

        //define the drag start callback
        interaction.setDragStartCallback(event=>{
            if(!interaction.elementIsTarget(event)){return;}
            event.preventDefault();
            // Shortened reference for neatness
            const mod = interaction.controller.getModel();

            //Get WO matrix (space of parent object)
            interaction.WOMatrix = mod.getParent().getWorldToObjectMatrix();
            // Save start cursor position in world space
            interaction.StartCursor = interaction.getEventPositionInContext(event);
            // Save start cursor position in space of parent object
            interaction.WOCursor = interaction.WOMatrix.times(interaction.StartCursor);
            // Get anchor location in space of parent object
            interaction.startTransformOrigin = interaction.WOMatrix.times(mod.getWorldPosition());
            // Starting rotation
            interaction.startRotation = mod.getRotation();
            // Vector between starting cursor and anchor point
            interaction.uVector = interaction.startTransformOrigin.minus(interaction.WOCursor);
            // The starting matrix
            interaction.startMatrix = mod.matrix;

            // Scale space transformations
            interaction.TR=Matrix3x3.Translation(interaction.startTransformOrigin).times(
                Matrix3x3.Rotation(interaction.controller.getModel().getRotation())
            );
            interaction.RiTi=interaction.TR.getInverse();

            //The starting cursor in scale-space, for convenience's sake.
            interaction.startCursorScaleCoords = interaction.RiTi.times(interaction.WOCursor);

        });

        //now define a drag move callback
        interaction.setDragMoveCallback(event=> {
            event.preventDefault();
            // Given two vector values, returns a normalized Vec2.
            function normalize(x, y) {
                const length = Math.sqrt(x**2 + y**2)
                return new Vec2(x / length, y / length)
            }

            //First, transform the new cursor location to scale space and get the vector between its current point and the anchor.
            const newCursor = (interaction.WOMatrix.times(interaction.getEventPositionInContext(event)));
            const vVector = interaction.startTransformOrigin.minus(newCursor);

            // Normalize u and v vectors
            const u = normalize(interaction.uVector.x, interaction.uVector.y)
            const v = normalize(vVector.x, vVector.y)
            // Angle between starting vector and current vector, angle = acos(u dot v)
            // "sign" determines if the angle is clockwise(-) or counterclockwise(+) by finding the cross product.
            const sign = Math.sign(v.x*u.y - v.y*u.x)
            const angle = sign * Math.acos(u.x*v.x+u.y*v.y);

            // New rotation matrix is the starting rotation plus the angle between the two vectors.
            const modTR = Matrix3x3.Translation(interaction.startTransformOrigin).times(
                Matrix3x3.Rotation(interaction.startRotation+angle));
            const modRiTi = modTR.getInverse();

            // Replaces old scalespace matrix with modified scalespace matrix.
            interaction.controller.getModel().setMatrix(interaction.TR.times(modRiTi).times(interaction.startMatrix));

        });
        //we can optionally define a drag end callback
        interaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return interaction;
    }


}
