import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom";
import {
    AModel2D,
    AModel2DGroup,
    AppState,
    ASceneGraphEditor,
    ASVGLabEditGraphicsComponent,
    ASVGLabMainToolPanel
} from "AniGraph"


export default function Assignment2Core() {
    const appState = new AppState({model: new AModel2DGroup({name:'rootModel'})});
    const app = (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                <ASVGLabMainToolPanel appState={appState}/>
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-6"}>
                    <ASceneGraphEditor appState={appState}/>
                </div>
                <div className={"col-6"}>
                    <ASVGLabEditGraphicsComponent appState={appState}/>
                </div>
            </div>
        </div>
    );
    ReactDOM.render(app,
        document.querySelector('#main')
    );
}
Assignment2Core();
