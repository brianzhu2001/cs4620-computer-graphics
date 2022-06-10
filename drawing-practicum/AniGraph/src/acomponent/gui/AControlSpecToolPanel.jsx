/*
 * Copyright (c) 2020. Abe Davis
 */
import React from "react"
import {Checkbox, Toggle} from "rsuite";
import {Slider} from "rsuite";

import {SketchPicker} from "react-color";
import tinycolor from "tinycolor2"

import ASelectPicker from "./ASelectPicker";
import AToolPanelComponent from "./AToolPanelComponent";
import ASliderSpec from "./specs/ASliderSpec";
import ACheckboxSpec from "./specs/ACheckboxSpec";
import AColorPickerSpec from "./specs/AColorPickerSpec";
import AColorPicker from "./AColorPicker";

export default class A2CreativeToolPanel extends AToolPanelComponent{
    constructor(props){
        super(props);
    }

    getGUISpec(){
        return this.getAppState('GUISpec');
    }

    /** Get selectedModelControls */
    get selectedModelControls(){
        const mspec = this.getGUISpec().modelGUISpecs? this.getGUISpec().modelGUISpecs:[];
        const vspec = this.getGUISpec().viewGUISpecs? this.getGUISpec().viewGUISpecs:[];
        return [...mspec, ...vspec];
    }

    /** Get appStateControls */
    get appStateControls(){
        return this.getGUISpec().appGUISpecs? this.getGUISpec().appGUISpecs : [];
    }


    //##################//--App State--\\##################
    //<editor-fold desc="App State">

    getSelectedModelControllers(){
        return this.getAppState('selectedModelControllers');
    }

    getSelectedModelController(){
        const selection = this.getSelectedModelControllers();
        return (selection && selection.length>0)? selection[0] : undefined;
    }

    getSelectedModel(){
        // return this.state.selectedModel;
        const controller = this.getSelectedModelController();
        return controller? controller.getModel() : undefined;
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.addAppStateListener('selectedModelControllers', function(selectedModelControllers){
            const selectedModel = (selectedModelControllers && selectedModelControllers.length>0)? selectedModelControllers[0].getModel() : undefined;
            self.setState({selectedModel: selectedModel});
            if(selectedModel) {
                // var stateDict = {selectedViewClass: selectedModel.getProperty('viewClass')};
                var stateDict = {};
                for(let mcontrol of self.selectedModelControls){
                    if(mcontrol.propType==='attribute'){
                        stateDict[mcontrol.key] = selectedModel.getAttribute(mcontrol.key);
                    }else{
                        stateDict[mcontrol.key] = selectedModel.getProperty(mcontrol.key);
                    }
                }
                self.setState(stateDict);
            }
        }, 'AControlSpecSelectedModelListener');

        for(let acontrol of self.appStateControls){
            // var statename = acontrol.key;
            this.addAppStateListener(acontrol.key, function(value){
                let statedict = {};
                statedict[acontrol.key]=value;
                self.setState(statedict);
            }, acontrol.key);
        }
    }


    //</editor-fold>
    //##################\\--App State--//##################

    _getDropdownDataItems(itemdict){
        if(!itemdict){
            return [];
        }
        const rval = [];
        if(Array.isArray(itemdict)){
            for(let m of itemdict){
                rval.push({value: m, label:m});
            }
        }else{
            for(let m in itemdict){
                rval.push({value: m, label:m});
            }
        }
        return rval;
    }

    bindMethods() {
        super.bindMethods();
        this.getSelectedModel = this.getSelectedModel.bind(this);
        this.modelSelectionControlResponse = this.modelSelectionControlResponse.bind(this);
        this.appControlResponse = this.appControlResponse.bind(this);
    }


    modelSelectionControlResponse(controlSpec, args) {
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            if(controlSpec.propType==='attribute'){
                selectedModel.setAttribute(controlSpec.key, args.value);
            }else{
                selectedModel.setProperty(controlSpec.key, args.value);
            }
            var statedict = {};
            statedict[controlSpec.key]=args.value;
            this.setState(statedict);
            this.signalAppEvent('update');
        }
    }

    appControlResponse(controlSpec, args) {
        var statename = controlSpec.key;
        this.setAppState(statename, args.value);
        this.signalAppEvent('update');
    }


    render(){

        const toolpanel = this;
        const uploaderStyles = {
            lineHeight: '15px'
        }

        function renderAppControl(control){
            var value = toolpanel.state[control.key];
            var label = control.label;
            if(value===undefined){
                label='['+label+']';
            }
            if(control instanceof ASliderSpec){
                return (
                    <div className={"p-4 align-items-center align-self-center"}
                         key={'checkbox'+control.getUID()}>
                        {label}
                        <Slider
                            onChange={(val)=>{
                                toolpanel.appControlResponse(control, {value: val});
                            }}
                            value={toolpanel.state[control.key]}
                            min={control.minVal}
                            max={control.maxVal}
                            step={control.step}
                            key={'slider'+control.getUID()}
                        />
                    </div>
                );
            }else{
                if(control instanceof ACheckboxSpec){
                    return(
                        <Checkbox
                            checked={toolpanel.state[control.key]}
                            onChange={(value, checked) => {
                                toolpanel.appControlResponse(control, {value: checked});
                            }}
                            key={'checkbox'+control.getUID()}
                        >
                            {label}
                        </Checkbox>
                    );
                }else{
                    if(control instanceof AColorPickerSpec){
                        return (
                            <React.Fragment key={'frag'+control.getUID()}>
                                {label}
                                <AColorPicker
                                    value={toolpanel.state[control.key]}
                                    onChange={(value)=>{
                                        toolpanel.appControlResponse(control, {value: value});
                                    }}
                                    key={'colorpicker'+control.getUID()}
                                >
                                </AColorPicker>
                            </React.Fragment>
                        );
                    }
                }
            }
        }

        function renderSelectionControl(control){
            const statename = control.key;
            var value = toolpanel.state[statename];
            var label = control.label;
            if(value===undefined){
                label='['+label+']';
            }
            if(control instanceof ASliderSpec){
                return (
                    <div className={"p-3 align-items-center align-self-center"}
                         key={'sliderdiv'+control.getUID()}>
                        {label}
                        <Slider
                            onChange={(val)=>{
                                toolpanel.modelSelectionControlResponse(control, {value: val});
                            }}
                            value={toolpanel.state[control.key]}
                            min={control.minVal}
                            max={control.maxVal}
                            step={control.step}
                            disabled={!toolpanel.getSelectedModel()}
                            key={'slider'+control.getUID()}
                        />
                    </div>
                );
            }else{
                if(control instanceof ACheckboxSpec){
                    return(
                        <Checkbox
                            checked={toolpanel.state[control.key]}
                            onChange={(args) => {
                                toolpanel.modelSelectionControlResponse(control, {value: args.value});
                            }}
                            key={'checkbox'+control.getUID()}
                        >
                            {label}
                        </Checkbox>
                    );
                } else{
                    if(control instanceof AColorPickerSpec){
                        return (
                            <React.Fragment key={'frag'+control.getUID()}>
                                {label}
                                <AColorPicker
                                    value={toolpanel.state[control.key]}
                                    onChange={(value)=>{
                                        toolpanel.modelSelectionControlResponse(control, {value: `rgba(${ value.rgb.r }, ${ value.rgb.g }, ${ value.rgb.b }, ${ value.rgb.a })`});
                                    }}
                                    key={'colorpicker'+control.getUID()}
                                >
                                </AColorPicker>
                            </React.Fragment>
                        );
                    }
                }
            }
        }
        const appControlRenders = [];
        const selectionControlRenders = [];

        for(let c of this.appStateControls){
            appControlRenders.push(renderAppControl(c));
        }

        for(let mc of this.selectedModelControls){
            selectionControlRenders.push(renderSelectionControl(mc));
        }

        return (
            <div style={{overflowY: 'scroll'}}>
                <div>
                    <h4> App Controls:</h4>
                    {appControlRenders}
                </div>
                <div>
                    <h4> Selection Controls:</h4>
                    {selectionControlRenders}
                </div>

                {this.props.children}
            </div>
        )
    }
}