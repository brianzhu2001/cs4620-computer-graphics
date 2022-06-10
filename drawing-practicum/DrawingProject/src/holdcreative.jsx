import 'bootstrap/dist/css/bootstrap.min.css';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import jQuery from 'jquery';
import React from "react";
import ReactDOM from "react-dom";
import {
    ACheckboxSpec, AGUISpec, AObject,
    AppState,
    ASceneGraphEditor
} from "AniGraph"

import {
    A2CreativeToolPanel,
    A2CreativeComponent
} from "./creative/index";

import A2CreativeModel from "./creative/model/A2CreativeModel";
import {A2ModelGroup} from "./models/A2Model";
import A2ToolPanel from "./components/A2ToolPanel";
import A2GraphicsComponent from "./components/A2GraphicsComponent";
import ASliderSpec from "../../AniGraph/src/acomponent/gui/specs/ASliderSpec";


AObject.RegisterClass(A2CreativeModel);
AObject.RegisterClass(A2ModelGroup);

export default function Assignment2Creative() {
    const appState = new AppState({
        model: new A2ModelGroup({name:'rootModel'}),
        newModelClass: A2CreativeModel,
        GUISpec: new AGUISpec({
            appGUI: [
                new ACheckboxSpec({
                    name: "AutoPlay",
                }),
                new ASliderSpec({
                    name: 'Speed',
                    minVal: 0,
                    maxVal: 3,
                    defaultValue: 1
                }),
                new ASliderSpec({
                    name: 'Gravity',
                    minVal: 0,
                    maxVal: 5,
                    defaultValue: 0
                })
            ]
        })
    });
    const app = (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <A2ToolPanel appState={appState}/>
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-6"}>
                    <div className="container mt-3">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active" href="#shapeeditor">Shape Editor</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#grapheditor">Graph Editor</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#creativecontrols">Controls</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="shapeeditor" className="container tab-pane active">
                                <A2GraphicsComponent appState={appState}/>
                            </div>
                            <div id="grapheditor" className="container tab-pane">
                                <ASceneGraphEditor appState={appState}/>
                            </div>
                            <div id="creativecontrols" className="container tab-pane">
                                <A2CreativeToolPanel appState={appState}/>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div className={"col-6"}>*/}
                {/*    <ASceneGraphEditor appState={appState}/>*/}
                {/*</div>*/}
                <div className={"col-6"}>
                    <div className="container mt-3">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active">Live View</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="liveview" className="container tab-pane active">
                                <A2CreativeComponent appState={appState}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    ReactDOM.render(app,
        document.querySelector('#main')
    );

    jQuery(".nav-tabs a").click(function(){
        jQuery(this).tab('show');
    });
}
Assignment2Creative();
