import {
  AParticleView,
  Vec2,
  ASliderSpec,
} from "AniGraph";

import MyParticleClass from "../elementclasses/MyParticleClass";

export default class KaleidescopeView extends AParticleView {
  static DefaultParticleClass = MyParticleClass;
  static DefaultNParticles = 1;

  //Define the sliders that you want to appear in the controls tab when the selected view is set to this view
  static GUISpecs = [
    new ASliderSpec({
      name: 'ParticleSize',
      minVal: 0,
      maxVal: 100,
    }),
    new ASliderSpec({
      name: 'Frequency',
      minVal: 0,
      maxVal: 100,
    }),
    new ASliderSpec({
      name: 'Width',
      minVal: 0,
      maxVal: 2,
    }),
    new ASliderSpec({
      name: 'Height',
      minVal: 0,
      maxVal: 2,
    })
  ];


  /**
   * Initialize slider variables that are global to the app
   * Their values will only be set if they are currently undefined
   */
  initSliderVariablesApp() {
    super.initSliderVariablesApp();
    this._initAppVariable("Speed", 1);
    this._initAppVariable("Gravity", 1);
  }

  /**
   * Initialize slider variables that control model properties
   * Their values will only be set if they are currently undefined
   */
  initSliderVariablesModel() {
    super.initSliderVariablesModel();
    this._initModelVariable("Width", 1);
    this._initModelVariable("Height", 1);
    this._initModelVariable("Frequency", 10);
    this._initModelVariable("ParticleSize", 10);
  }

  constructor(args) {
    super(args);
  }

  initGeometry() {
    super.initGeometry();
    this.nParticles = 60;

    this.lastLaunchTime = 0;
    this.particles = [];
    for (let p = 0; p < this.nParticles; p++) {
      this.particles.push(this.createParticle({ "curved": false }));
      // this.particles[p].hide(); // potentially hide particles that have not been emitted yet.
    }

    this.maxRestTime = 3000;
    this.restTime = this.maxRestTime;
    this.nextParticleIndex = 0;

  }

  emitParticle(pt, args) {
    if (pt.hidden) {
      pt.show();
    }
    // set initial state
    /*var delta = new Vec2(Math.random() * this.maxRestTime / 50, Math.random() * this.maxRestTime / 50);
    pt.initPosition = this.getModel().getWorldPosition().plus(delta);
    pt.setPosition(pt.initPosition);
    console.log(pt.initPosition);*/
    pt.setPosition(this.getModel().getWorldPosition());
    //We'll store the last time the particle was emitted
    pt.t0 = (args && args.time) ? args.time : 0;
    pt.restTime = Math.random() * this.maxRestTime;
    var gravity = Math.floor(Math.random() * Math.floor(2));
    // var gravity = this.getSliderVariable("Gravity") > 0 ? 1 : -1;
    pt.gravity = gravity > 0 ? 1 : -1;
  }

  updateParticle(particle, args) {
    // customize this...
    particle.setAttribute("linewidth", 0);
    const time = (args && args.time) ? args.time : 0;
    var speed = this.getSliderVariable("Speed");
    const age = (time - particle.t0) / 1000 * speed;
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
        var r = Math.floor(age * 1000 / restTime * 255);
        var g = 255;
        var b = 255 - Math.floor(age * 1000 / restTime * 255);;
        return rgbToHex(r, g, b);
      }

      // var gravity = this.getSliderVariable("Gravity") > 0 ? 1 : -1;
      var frequency = this.getSliderVariable("Frequency");
      var width = this.getSliderVariable("Width");
      var height = this.getSliderVariable("Height");
      var particleSize = this.getSliderVariable("ParticleSize");
      var positionDelta = new Vec2(width * age * 100 * Math.sin(age * frequency), height * age * 100 * particle.gravity);
      if (age) {
        particle.setAttribute("fill", gradient(age, particle.restTime));
        particle.setAttribute("opacity", 1 - (age * 1000) / particle.restTime);
        particle.setRadius(particleSize / 2 + particleSize * (age * 1000) / particle.restTime);
      }
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
    }
  }
}