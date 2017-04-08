declare var extract: any;
declare var geodash: any;

/* Components */
import { Component, OnInit, EventEmitter, ElementRef } from '@angular/core';

/* Services */
import { GeoDashServiceBus }  from 'GeoDashServiceBus';

@Component({
  selector: 'geodash-map',
  template: geodash.api.getTemplate('geodashMap.tpl.html')
})
export class GeoDashComponentMap implements OnInit {
  name = 'GeoDashComponentMap';

  constructor(private element: ElementRef, private bus: GeoDashServiceBus) {

  }

  ngOnInit(): void {
    geodash.var.components[this.name] = this; // register externally

  }

}
