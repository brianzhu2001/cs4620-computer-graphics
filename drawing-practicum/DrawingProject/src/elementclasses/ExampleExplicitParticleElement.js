import {PointList2D, Vec2, ASVGParticle} from "AniGraph";

export default class ExampleExplicitParticleElement extends ASVGParticle{
    constructor(args){
        super(args);

        this._position = (args && args.position)? args.position : new Vec2(0,0);
        this._radius = (args && args.radius)? args.radius : 10;
        this.updateVertices();

        // add velocity if you are doing euler integration
        // this.velocity = new Vec2(...)...

        //Or, you could do the full state as one big vector. *OR* you could even do the whole particle
        //system as one long vector of degrees of freedom. If we were doing this in numpy, that would probably
        //make a big performance difference. In Javascript, probably not quite as significant.
    }

    /** Get set position */
    get position(){return this._position;}

    setPosition(position){
        this._position = position;
        this.updateVertices();
    }

    /** Get set radius */
    get radius(){return this._radius;}
    setRadius(radius){
        this._radius = radius;
        this.updateVertices();
    }

    updateVertices(){
        this.setVertices(PointList2D.EquilateralTriangle(this.position,  2*this.radius*Math.cos(Math.PI/6)));
    }
}