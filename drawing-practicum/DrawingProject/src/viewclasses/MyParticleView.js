import {
    AParticleView,
    P2D, Vec2, Vec3,
    Matrix3x3, Precision,
    ASVGParticle,
    ASliderSpec,
    ACheckboxSpec
} from "AniGraph";

import MyParticleClass from "../elementclasses/MyParticleClass";

export default class MyParticleView extends AParticleView{
    static DefaultParticleClass = MyParticleClass;
    static DefaultNParticles = 1;

    //Define the sliders that you want to appear in the controls tab when the selected view is set to this view
    static GUISpecs = [
        new ASliderSpec({
            name: 'Frequency',
            minVal: 0,
            maxVal: 10,
        }),
        new ASliderSpec({
            name: 'OrbitRadius',
            minVal: 0,
            maxVal: 200,
        }),
        new ASliderSpec({
            name: 'ParticleSize',
            minVal: 0,
            maxVal: 100,
        }),
        new ASliderSpec({
            name: 'PulseRadius',
            minVal: -1,
            maxVal:2
        })

    ];


    /**
     * Initialize slider variables that are global to the app
     * Their values will only be set if they are currently undefined
     */
    initSliderVariablesApp(){
        super.initSliderVariablesApp();
        this._initAppVariable("Speed", 1);
        this._initAppVariable("Gravity", 1);
    }

    /**
     * Initialize slider variables that control model properties
     * Their values will only be set if they are currently undefined
     */
    initSliderVariablesModel(){
        super.initSliderVariablesModel();
        this._initModelVariable("Frequency", 1);
        this._initModelVariable("OrbitRadius", 10);
        this._initModelVariable("ParticleSize", 10);
        this._initModelVariable("PulseRadius", 1);
    }

    constructor(args){
        super(args);
    }

    initGeometry() {
        super.initGeometry();
        this.nParticles = 3;

        this.lastLaunchTime=0;
        this.particles = [];
        for(let p=0;p<this.nParticles;p++){
            this.particles.push(this.createParticle());
            // this.particles[p].hide(); // potentially hide particles that have not been emitted yet.
        }

        this.maxRestTime=3000;
        this.restTime = this.maxRestTime;
        this.nextParticleIndex = 0;

    }

    emitParticle(pt, args){
        if(pt.hidden){
            pt.show();
        }
        // set initial state
        pt.setPosition(this.getModel().getWorldPosition());

        //We'll store the last time the particle was emitted
        pt.t0 = (args && args.time)? args.time : 0;

        this.restTime = Math.random()*this.maxRestTime;
    }

    updateParticle(particle, args){
        // customize this...
        const time = (args && args.time)? args.time:0;
        const age = (time-particle.t0)/1000;//in seconds
        const period = 1/this.getSliderVariable("Frequency");
        const phase = (age%period)/period;
        const orbit = this.getSliderVariable("OrbitRadius");
        const radius = this.getSliderVariable("ParticleSize");

        particle.setRadius(radius);
        particle.setPosition(this.getModel().getWorldPosition().plus(
            Matrix3x3.Rotation(phase*2*Math.PI).times(P2D(orbit,0))
        ));
    }

    updateViewElements(){
        super.updateViewElements();
        var time = this.getComponentAppState('appTime');
        time = (time!==undefined)? time : 0;
        const model = this.getModel();
        // ...

        if(!this.particles){return;}

        // If you wanted to emit at a regular interval, or under some condition, you could change this logic.
        // you could also keep track of the last particle you emitted.
        if(this.lastEmitTime ===undefined || (time-this.lastEmitTime)>this.restTime){
            this.emitParticle(this.particles[this.nextParticleIndex], {time: this.getComponentAppState('appTime')});
            this.lastEmitTime = time;
            this.nextParticleIndex = (this.nextParticleIndex+1)%this.nParticles;
        }



        for(let p=0;p<this.particles.length;p++) {
            var particle = this.particles[p];
            ///
            this.updateParticle(particle, {
                time: time
            });

            // or you could skip particles that haven't been emitted yet:
            // if(!particle.hidden) {
            //     this.updateParticle(args);
            // }
        }
    }
}