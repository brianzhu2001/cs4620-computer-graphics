import {
  AParticleView,
  Vec2,
  ASliderSpec
} from "AniGraph";

import MyParticleClass from "../elementclasses/MyParticleClass";

export default class FreeFallView extends AParticleView {
  static DefaultParticleClass = MyParticleClass;
  static DefaultNParticles = 1;

  //Define the sliders that you want to appear in the controls tab when the selected view is set to this view
  static GUISpecs = [
    new ASliderSpec({
      name: 'Particle Radius',
      minVal: 0,
      maxVal: 100,
    }),
    new ASliderSpec({
      name: 'Wind',
      minVal: 0,
      maxVal: 10,
    }),
    new ASliderSpec({
      name: 'Wind Angle',
      minVal: 0,
      maxVal: 360,
    }),
    new ASliderSpec({
      name: 'Drag',
      minVal: 0,
      maxVal: 3,
    }),
    new ASliderSpec({
      name: 'Particle Mass',
      minVal: 0.1,
      maxVal: 5,
    })
  ];


  /**
   * Initialize slider variables that are global to the app
   * Their values will only be set if they are currently undefined
   */
  initSliderVariablesApp() {
    super.initSliderVariablesApp();
    this._initAppVariable("Speed", 0);
    this._initAppVariable("Gravity", 1);
  }

  /**
   * Initialize slider variables that control model properties
   * Their values will only be set if they are currently undefined
   */
  initSliderVariablesModel() {
    super.initSliderVariablesModel();
    this._initModelVariable("Wind", 0);
    this._initModelVariable("Wind Angle", 0);
    this._initModelVariable("Drag", 0);
    this._initModelVariable("Particle Radius", 10);
    this._initModelVariable("Particle Mass", 1);
  }

  constructor(args) {
    super(args);
  }

  initGeometry() {
    super.initGeometry();
    this.nParticles = 10;

    this.lastLaunchTime = 0;
    this.particles = [];
    for (let p = 0; p < this.nParticles; p++) {
      this.particles.push(this.createParticle({ "curved": true }));
      // this.particles[p].hide(); // potentially hide particles that have not been emitted yet.
    }

    this.maxRestTime = 3000;
    this.restTime = this.maxRestTime;
    this.nextParticleIndex = 0;
    this.velocity = new Vec2(this.getSliderVariable("Speed"), 0);

  }

  emitParticle(pt, args) {
    if (pt.hidden) {
      pt.show();
    }
    // set initial state
    pt.setPosition(this.getModel().getWorldPosition());
    //We'll store the last time the particle was emitted
    pt.t0 = (args && args.time) ? args.time : 0;
    pt.restTime = this.maxRestTime;
  }

  updateParticle(particle, args) {
    // customize this...
    particle.setAttribute("linewidth", 0);
    const time = (args && args.time) ? args.time : 0;
    var age = (time - particle.t0) / 1000;
    if (age > particle.restTime / 1000) {
      this.emitParticle(particle, args);
    }
    else {
      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }
      function gradient(age, restTime) {
        var amt = Math.floor(age / restTime * 255);
        var r = 255;
        var g = amt;
        var b = 255 - amt;
        return rgbToHex(r, g, b);
      }
      var mass = this.getSliderVariable("Particle Mass");
      var gravity = new Vec2(0, this.getSliderVariable("Gravity")).times(1 / mass).times(age * 100);
      var wind = this.getSliderVariable("Wind");
      var windAngle = this.getSliderVariable("Wind Angle") * Math.PI / 180;
      var windVelocity = new Vec2(wind * Math.cos(windAngle), wind * Math.sin(windAngle)).times(100);
      var drag = this.getSliderVariable("Drag");
      drag = new Vec2(0, drag * -1).times(1 / mass).times(age * 100);
      var velocity = this.velocity.plus(gravity).plus(windVelocity).plus(drag);
      var positionDelta = velocity.times(age);
      particle.setRadius(this.getSliderVariable("Particle Radius"));
      particle.setAttribute("fill", gradient(age, particle.restTime / 1000));
      particle.setPosition(this.getModel().getWorldPosition().plus(positionDelta));
    }
  }

  updateViewElements() {
    super.updateViewElements();
    var time = this.getComponentAppState('appTime');
    time = (time !== undefined) ? time : 0;
    const model = this.getModel();
    // ...

    if (!this.particles) { return; }

    // If you wanted to emit at a regular interval, or under some condition, you could change this logic.
    // you could also keep track of the last particle you emitted.
    if (this.lastEmitTime === undefined || (time - this.lastEmitTime) > this.restTime) {
      this.emitParticle(this.particles[this.nextParticleIndex], { time: this.getComponentAppState('appTime') });
      this.lastEmitTime = time;
      this.nextParticleIndex = (this.nextParticleIndex + 1) % this.nParticles;
    }



    for (let p = 0; p < this.particles.length; p++) {
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