import AView from "./AView";
import ASVGGroup from "../../aweb/svg/ASVGGroup";

export default class AView2D extends AView{
    static GUISpecs = [];
    constructor(args){
        super(args);
        if(args && args.group){
            this.setGroup(args.group);
        }
    }

    /** Get set cssLabelClass */
    set cssLabelClass(value){
        const newclass = value;
        if(newclass!==this._cssLabelClass) {
            this.getGroup().removeClass(this._cssLabelClass)
            this.getGroup().addClass(newclass);
        }
        this._cssLabelClass=value;
    }
    get cssLabelClass(){return this._cssLabelClass;}

    getGroup(){return this.group;}
    setGroup(group){this.group = group;}

    addGraphic(graphic){
        super.addGraphic(graphic);
        graphic.addToGroup(this.getGroup());
    }

    initGraphics(){
        super.initGraphics();
        if(this.getGroup()===undefined) {
            const context = this.getGraphicsContext();
            this.setGroup(context.makeGroup());
        }

        this.initViewElements();
        this.updateGraphicsContext();
        this.updateGroup();
        this.updateGraphicsContext();
    }

    getViewGroupElementClassName(){
        const modelTag = this.getModel().name;
        const groupTag = modelTag? modelTag : this.constructor.name;
        return groupTag;
    }

    hideGraphics(){
        for(let graphic in this.getGraphics()){
            graphic.removeFromParentGroup();
        }
    }

    showGraphics(){
        for(let graphic in this.getGraphics()){
            if(graphic.getParent()===undefined){
                this.getGroup().add(graphic);
            }
        }
    }

    updateGroup(){
        const contextType = this.getGraphicsContext().twoJsType;
        if(contextType==='svg' || contextType ==='SVGRenderer') {
            this.cssLabelClass = this.getViewGroupElementClassName();
        }
    }

    releaseGraphics(args){
        super.releaseGraphics(args);
        if(this.getGroup()) {
            this.getGroup().removeFromParentGroup();
        }
    }

    _removeFromParent(){
        super._removeFromParent();
        this.getGroup().removeFromParentGroup();
    }

    _attachToNewParent(newParent){
        super._attachToNewParent(newParent);
        if(newParent instanceof ASVGGroup) {
            this.getGroup().addToGroup(newParent);
        }else{
            this.getGroup().addToGroup(newParent.getGroup());
        }
    }

    updateGraphicsContext(){
        this.getGraphicsContext().update();
    }

    updateGraphics() {
        this.updateGroup();
        super.updateGraphics(); // calls updateViewElements
    }




    //##################//--Shape Funcs--\\##################
    //<editor-fold desc="Shape Funcs">
    /**
     *
     * @param model
     * @returns {Two.Path}
     */
    createShapeElement(model, open=false){
        // Our createShapeElement will look just like createBoxElement.
        // We create the svg path and and set it's initial attributes
        const context = this.getGraphicsContext();
        const verts = model.getVertices();
        var shape;
        if(open){
            shape = context.makeOpenPath(verts);
        }else{
            shape = context.makePath(verts);
        }

        shape.setAttributes(model.getProperty('attributes'));
        shape.setVertices(model.getVertices());

        return shape;
    }

    createShapeWithVertices(verts){
        const context = this.getGraphicsContext();
        const shape = context.makePath(verts);;
        return shape;
    }

    createCurvedShapeWithVertices(verts){
        const context = this.getGraphicsContext();
        const shape = context.makeCurve(verts);;
        return shape;
    }

    initViewElements(){
        this.initGeometry();
    }

    initGeometry(){
        this.shape = this.createShapeElement(this.getModel());
        this.addGraphic(this.shape);
    }

    updateViewElements(){
        const model = this.getModel();
        this.shape.setVertices(model.getVertices());
        this.shape.setAttributes(model.getProperty('attributes'));
    }

    //</editor-fold>
    //##################\\--Shape Funcs--//##################


    _initAppVariable(name, val){
        if(this.getComponentAppState(name)===undefined){
            this.getController().getComponent().setAppState(name, val);
        }
        this._sliderVariableTypes[name]='app';
    }
    _initModelVariable(name, val){
        if(this.getModel().getProperty(name)===undefined){
            this.getModel().setProperty(name, val);
        }
        this._sliderVariableTypes[name]='model';
    }

    initSliderVariablesApp(){
        if(this._sliderVariableTypes===undefined) {
            this._sliderVariableTypes = {};
        }
    }

    initSliderVariablesModel(){
        if(this._sliderVariableTypes===undefined) {
            this._sliderVariableTypes = {};
        }
    }

    getSliderVariable(name){
        if(this._sliderVariableTypes[name]==='app'){
            return this.getComponentAppState(name);
        }else{
            return this.getModel().getProperty(name);
        }
    }

}
