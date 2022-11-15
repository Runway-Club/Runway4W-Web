import { Component, ContentChild, ElementRef, Query, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { LocationService } from './services/location.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public location: LocationService, private router: ActivatedRoute) {
    this.router.queryParams.subscribe((params) => {
      if (params['addr'] != undefined) {
        this.location.address = params['addr'];
        this.location.getLocationFromAddress();
      }
    });
    location.zoomIn.subscribe(() => {
      this.zoomIn();
    });
    location.zoomOut.subscribe(() => {
      this.zoomOut();
    });
  }

  zoomIn() {

  }
  zoomOut() {

  }

}



