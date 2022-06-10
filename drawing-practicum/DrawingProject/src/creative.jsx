import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import jQuery from 'jquery';
import React from "react";
import ReactDOM from "react-dom";
import {
    ACheckboxSpec, AGUISpec, AObject,
    AModel2D,
    AModel2DGroup,
    AppState,
    ASceneGraphEditor, ASVGLabToolPanel,
    ASliderSpec,
    ASVGLabMainToolPanel
} from "AniGraph"
import CustomViewsComponent from "./CustomViewsComponent";
import CustomEditorComponent from "./CustomEditorComponent";

export default function Assignment2Creative() {
    const appState = new AppState({
        model: new AModel2DGroup({ name: 'rootModel' }),
        newModelClass: AModel2D,
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
                }),
            ]
        })
    });
    const app = (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <ASVGLabMainToolPanel appState={appState} />
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
                                <CustomEditorComponent appState={appState} />
                            </div>
                            <div id="grapheditor" className="container tab-pane">
                                <ASceneGraphEditor appState={appState} />
                            </div>
                            <div id="creativecontrols" className="container tab-pane">
                                <ASVGLabToolPanel appState={appState} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-6"}>
                    <div className="container mt-3">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active">Live View</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="liveview" className="container tab-pane active">
                                <CustomViewsComponent appState={appState} />
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

    jQuery(".nav-tabs a").click(function () {
        jQuery(this).tab('show');
    });
}
Assignment2Creative();
