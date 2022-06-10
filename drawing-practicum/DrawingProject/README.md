# Instructions and Checkpoints:

### Part 1: Representing Transformations Hierarchically 
Begin by implementing the indicated parts of [`./src/models/A2Model.js`](./src/models/A2Model.js)...

## Interactions
In assignment 1, you implemented supplemental controllers that added user interactions to the graphics
of a view class. With these interactions, users could move, rotate, and scale graphics using the mouse.
In this part of the assignment, we will extend this functionality to help users manipulate the nodes of our scene graph hierarchically. 

The file [`./src/interactions/ReferenceA1InteractionImplementations.js`](./src/interactions/ReferenceA1InteractionImplementations.js) provides example implementations of the interactions you wrote in Assignment 1 as modular AInteraction subclasses. You can see how these interactions are used to create a controller in [`./src/components/A2GraphicsComponent.jsx`](./src/components/A2GraphicsComponent.jsx), which also creates a second controller based on the incomplete interactions defined in [`./src/interactions/SceneGraphElementInteractions.js`](./src/interactions/SceneGraphElementInteractions.js). Your task for this part of the assignment will be to complete the indicated missing parts of [`SceneGraphElementInteractions.js`](./src/interactions/SceneGraphElementInteractions.js). 



### Checkpoint 1:
TODO: I'm working on model loading so that students can load the checkpoint model and see that it behaves the way we say it should.

For now, checkpoint 1 has the following functionality:

##### The Following should work:
- You can move nodes around in the graph editor and this will change their order in the graphics view.
- You can move a node in the graph editor to change its parent.
- if you apply rotate, translate, or scale a parent, the transformation will apply to the children as well

##### What won't work: 
- Old Transformation conrtollers will do weird things to any node that has a parent other than the root.
 
 