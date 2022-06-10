import {
    AParticleView,
    P2D, Vec2, Vec3,
    Matrix3x3, Precision,
    ASVGParticle,
    ASliderSpec,
} from "AniGraph/src";
import ExampleExplicitParticleElement from "../elementclasses/ExampleExplicitParticleElement";
import AColorPickerSpec from "../../../AniGraph/src/acomponent/gui/specs/AColorPickerSpec";


// right now this function just returns the center of the line segment
function closestPointOnLineSegment(args){
    const point = args.point;
    const A = args.segmentStart;
    const B = args.segmentEnd;

    // some potentially useful quantities...

    // vector from segmentStart to segmentEnd
    // const AB = B.minus(A);

    // vector from segment start to the query point
    // const AP = point.minus(A);

    // normalized version of AB (hint: useful for projecting things onto AB)
    // const ABNorm = AB.getNormalized();

    // this is a placeholder. It will just return the midpoint of the line segment.
    return A.plus(B).times(0.5);
}


export default class NearestPointView extends AParticleView{
    static DefaultParticleClass = ExampleExplicitParticleElement;

    //Define the sliders that you want to appear in the controls tab when the selected view is set to this view
    static GUISpecs = [
        new ASliderSpec({
            name: 'ParticleSize',
            minVal: 0,
            maxVal: 100,
        }),
        new AColorPickerSpec({
            name: 'ParticleColor'
        })
    ];


    /**
     * Initialize slider variables that are global to the app
     * Their values will only be set if they are currently undefined
     */
    initSliderVariablesApp(){
        super.initSliderVariablesApp();
    }

    /**
     * Initialize slider variables that control model properties
     * Their values will only be set if they are currently undefined
     */
    initSliderVariablesModel(){
        super.initSliderVariablesModel();
        this._initModelVariable("ParticleSize", 10);
    }

    constructor(args){
        super(args);
    }


    createShapeElement(model, open=true){
        return super.createShapeElement(model, open);
    }

    initGeometry() {
        super.initGeometry();
        this.initEdgeMarkers();
    }

    initEdgeMarkers(){
        const verts = this.getModel().getVertices();
        this.edgeMarkers = [];
        const anchor = this.getModel().getWorldPosition();
        // Here we will create a marker for each edge of our geometry,
        // and set the particle's position to be the point on that edge closest to our model's anchor
        for(let p=0;p<(verts.length-1);p++){
            this.edgeMarkers.push(this.createParticle());
            // var lineseg = new LineSegment2D(verts[p], verts[p+1]);
            this.edgeMarkers[p].setPosition(closestPointOnLineSegment({
                point: anchor,
                segmentStart: verts[p],
                segmentEnd: verts[p + 1]
            }));
            this.edgeMarkers[p].show();
            this.edgeMarkers[p].setRadius(this.getSliderVariable("ParticleSize"));
        }
    }

    updateEdgeMarkers(){
        const model = this.getModel();
        if(!this.edgeMarkers){return;}

        const anchor = this.getModel().getWorldPosition();
        const verts = this.getModel().getVertices();

        for(let p=0;p<(verts.length-1);p++) {
            var edge = this.edgeMarkers[p];
            const radius = this.getSliderVariable("ParticleSize");
            edge.setRadius(radius);

            // rigtht now, closestPointOnLineSegment just returns the midpoint of the line segment.
            // When doing collision detection, you should
            edge.setPosition(closestPointOnLineSegment({
                point: anchor,
                segmentStart: verts[p],
                segmentEnd: verts[p + 1]
            }));
            edge.setAttribute('fill', model.getProperty('ParticleColor'));

        }
    }



    updateViewElements(){
        super.updateViewElements();
        var time = this.getComponentAppState('appTime');
        time = (time!==undefined)? time : 0;
        this.updateEdgeMarkers();
    }

}