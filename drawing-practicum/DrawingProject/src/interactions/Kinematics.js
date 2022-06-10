import {
    Matrix3x3,
    Vec2,
    Precision,
    ADragInteraction,
    ADragValueInteraction
} from "AniGraph"

export default class Kinematics extends ADragInteraction{

    static epsilon = 5 // radius on convergence in pixels
    static depth = 8 // depth-1 internal vertices with variable angle

    static Create(args){
        // Use the super class's Create function to instantiate the AInteraction subclass that we will return
        const interaction = super.Create(args);
        interaction.model = interaction.controller.getModel();

        //define the drag start callback
        interaction.setDragStartCallback(event=>{
            if(!interaction.elementIsTarget(event)){return;}
            event.preventDefault();
            // Do something
            var startCursor = interaction.getEventPositionInContext(event)
            var end_model = interaction.controller.getModel()

            var i
            // for(i = 0; i < this.depth; i++){} this was to make all scales square, unneeded since we just removed renormalize

            // params = [points, start_pt, lengths, total_len, epsilon]
            // see fabrik_init for details
            var output = this.fabrik_init(end_model, startCursor, this.depth, this.epsilon)
            interaction.points = output[0]
            interaction.start_pt = output[1]
            interaction.lengths = output[2]
            interaction.total_len = output[3]
            interaction.epsilon = this.epsilon

            interaction.angles = []
            var vec1, vec2
            for(i = 1; i < interaction.points.length-1; i++){
                vec1 = interaction.points[i-1].minus(interaction.points[i])
                vec2 = interaction.points[i].minus(interaction.points[i+1])
                interaction.angles.push(Math.atan2(vec1.y, vec1.x) - Math.atan2(vec2.y, vec2.x))
            }
            vec1 = interaction.points[interaction.points.length-1].minus(
                interaction.points[interaction.points.length-2])
            interaction.angles.push(Math.atan2(vec1.y, vec1.x))
        });

        //now define a drag move callback
        interaction.setDragMoveCallback(event=> {
            event.preventDefault();
            // First we transform our new cursor location to scale space.
            const newCursorScreenCoordinates = interaction.getEventPositionInContext(event);

            //do somehting. e.g., rotate to world point newCursorScreenCoordinates
            var output = this.fabrik_update(newCursorScreenCoordinates, interaction.points,
                interaction.start_pt, interaction.lengths, interaction.total_len, interaction.epsilon)
            interaction.points = output[0]
            interaction.start_pt = output[1]
            interaction.lengths = output[2]
            interaction.total_len = output[3]

            var new_angles = []
            var diff_angles = []
            var i, vec1, vec2, angle
            for(i = 1; i < interaction.points.length-1; i++){
                vec1 = interaction.points[i-1].minus(interaction.points[i])
                vec2 = interaction.points[i].minus(interaction.points[i+1])
                angle = Math.atan2(vec1.y, vec1.x) - Math.atan2(vec2.y, vec2.x)
                new_angles.push(angle)
                diff_angles.push(angle - interaction.angles[i-1])
            }
            vec1 = interaction.points[interaction.points.length-1].minus(
                interaction.points[interaction.points.length-2])
            angle = Math.atan2(vec1.y, vec1.x)
            new_angles.push(angle)
            diff_angles.push(angle - interaction.angles[interaction.angles.length-1])
            interaction.angles = new_angles

            var model = interaction.controller.getModel()
            for(i = 0; i < diff_angles.length; i++){
                model.setRotation(model.getRotation()+diff_angles[i])
                model = model.getParent()
                if(!model){
                    break
                }
            }
        });
        //we can optionally define a drag end callback
        interaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return interaction;
    }


    static fabrik_init(end_obj, click_pt, depth = 3, epsilon = 5){
        // points[i] is the vertex i "upstream" of click_pt
        var i
        var points = [click_pt]
        // var rotations = []
        var cur_obj = end_obj
        for(i = 0; i < depth; i++){
            points.push(cur_obj.getWorldPosition())
            // rotations.push(cur_obj.getRotation())
            if(cur_obj.getParent().getParent()){
                cur_obj = cur_obj.getParent()
            } else{
                break
            }
        }
        // maybe put this all in last-parent coordinates? for improved shear etc compatibility
        var start_pt = points[points.length-1] // this doesn't change

        // lengths[i] is the length of the ith vector that doesn't include the endpoint
        var lengths = []
        var total_len = 0
        var l
        for(i = 1; i < points.length; i++){
            l = points[i].minus(points[i-1]).L2()
            lengths.push(l)
            total_len += l
        }

        return [points, start_pt, lengths, total_len, epsilon]
    }

    static fabrik_update(mouse_loc, points, start_pt, lengths, total_len, epsilon){
        var end_pt = mouse_loc.dup()
        var dist = end_pt.minus(start_pt).L2()
        if (total_len <= dist){
            // out of range
            // produces straight line to get as close as possible
            // this is just to save time because it's a trivial case
            var diff = dist - total_len
            var direction = end_pt.minus(start_pt).getNormalized()
            var cur = end_pt.minus(direction.times(diff))
            for(var i = 0; i < lengths.length; i++){ // the last member of points is unchanged
                points[i] = cur
                cur = cur.minus(direction.times(lengths[i]))
            }
            return [points, start_pt, lengths, total_len, epsilon]
        } else{
            // in range (gets as close as possible)
            var err = end_pt.minus(start_pt) // difference between endpoint and mouse, end convergence when < epsilon
            var cur_err, dir, i
            var max_loop = 3
            while (err.L2() >= epsilon && max_loop > 0){
                // backwards
                points[0] = end_pt
                for(i = 0; i < lengths.length; i++){
                    dir = points[i].minus(points[i+1]).getNormalized()
                    points[i+1] = points[i].minus(dir.times(lengths[i]))
                }
                //forward
                points[points.length-1] = start_pt
                for(i = lengths.length-1; i >= 0; i--){
                    dir = points[i].minus(points[i+1]).getNormalized()
                    points[i] = points[i+1].plus(dir.times(lengths[i]))
                }
                cur_err = end_pt.minus(points[0])
                if(err.minus(cur_err).L2() < epsilon){
                    break
                }
                err = cur_err
                max_loop = max_loop - 1
            }

            return [points, start_pt, lengths, total_len, epsilon]
        }
    }
}