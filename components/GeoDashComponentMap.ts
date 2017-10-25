declare var extract: any;
declare var geodash: any;

/* Components */
import { Component, OnInit, AfterContentInit, AfterViewInit, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';

/* Services */
import { GeoDashServiceBus }  from 'GeoDashServiceBus';
import { GeoDashServiceCompile } from 'GeoDashServiceCompile';

@Component({
  selector: 'geodash-map',
  template: geodash.api.getTemplate('geodashMap.tpl.html')
})
export class GeoDashComponentMap implements OnInit, AfterContentInit, AfterViewInit {
  name = 'GeoDashComponentMap';

  private dashboard: any;
  private state: any;
  private maps: any[];

  constructor(private element: ElementRef, private changeDetector: ChangeDetectorRef, private bus: GeoDashServiceBus, private compileService: GeoDashServiceCompile) {

  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {

    geodash.var.components[this.name] = this; // register externally

    this.maps = <any>[];
    geodash.var.maps = <any>[];

    this.bus.listen("primary", "geodash:loaded", this.onLoaded);
    this.bus.listen("render", "geodash:detectChanges", this.onDetectChanges);
    this.bus.listen("render", "geodash:refresh", this.onRefresh);
    this.bus.listen("render", "geodash:changeView", this.onChangeView);

  }

  ngAfterViewInit(): void {
    this.element.nativeElement.style.display = extract("view.maps", this.state, []).length > 0 ? "block" : "none";
  }

  render = (object: any, ctx: any): any => {
    return geodash.util.arrayToObject(geodash.util.objectToArray(object).map((x:any) => {
      return <any>{
        "name": x.name,
        "value": (geodash.util.isString(x.value) ? this.interpolate(x.value)(ctx) : x.value)
      };
    }));
  }

  interpolate = (template: string): any => {
      return (ctx:any) => this.compileService.compile(template, ctx);
  }

  onLoaded = (name: any, data: any, source: any): void => {
    console.log("GeoDashComponentMap: ", data, source);
    this.dashboard = data["dashboard"];
    this.state = data["state"];
    this.element.nativeElement.style.display = extract("view.maps", this.state, []).length > 0 ? "block" : "none";
    this.refreshMaps();
  }

  refreshMaps = (): void => {
    this.maps = extract("maps", this.dashboard, []).map((m: any): any => geodash.util.extend(m, <any>{
      "style": this.style_map(m, this.state)
    }));
  }

  style_map(map: any, state: any): any {
    var styleMap = <any>{};

    if(geodash.util.isDefined(state))
    {
      if(extract("view.maps", state, []).indexOf(map.id) == -1)
      {
        styleMap["display"] = "none";
      }
    }
    else
    {
      styleMap["display"] = "none";
    }

    if(! geodash.util.isDefined(styleMap.display))
    {
      styleMap["display"] = "block";
    }

    return styleMap;
  }

  onRefresh = (name: any, data: any, source: any): void => {
    console.log("Map Refreshed");
    this.state = data["state"];
    var changed = false;
    for(var i = 0; i < this.maps.length; i++)
    {
      var before = JSON.stringify(this.maps[i]['style']);
      this.maps[i]['style'] = this.style_map(this.maps[i], this.state);
      if(before != JSON.stringify(this.maps[i]['style']))
      {
        changed = true;
      }
    }
    if(changed)
    {
      this.changeDetector.detectChanges();
    }
  }

  onDetectChanges = (name: any, data: any, source: any): void => {
    this.changeDetector.detectChanges();
  }

  onChangeView = (name: any, data: any, source: any): void => {

  }

}
