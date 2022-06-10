import { ASVGLabRenderGraphicsComponent } from "../../AniGraph/src/acomponent/apps/svglab";
import KaleidescopeView from "./viewclasses/KaleidescopeView";
import FreeFallView from "./viewclasses/FreeFallView";
import { AView2D } from "../../AniGraph/src/amvc/views";

export default class CustomViewsComponent extends ASVGLabRenderGraphicsComponent {
    initViewClasses() {
        super.initViewClasses();
        this.addViewClass(AView2D);
        this.addViewClass(KaleidescopeView);
        this.addViewClass(FreeFallView);
    }
}







