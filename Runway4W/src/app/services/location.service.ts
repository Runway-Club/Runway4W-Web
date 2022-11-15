import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Leaflet from 'leaflet';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  options: Leaflet.MapOptions = {
    layers: getLayers(),
    zoom: 10,
    center: new Leaflet.LatLng(10.774620056152344, 106.67485809326172),
  };

  address = "";
  actualAddress = "";

  zoomIn: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  zoomOut: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getLocationFromAddress() {
    let words = this.address.split('.');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].trim();
    }
    let formalAddress = words.join('.');
    this.httpClient.get(`https://word-loc-api.run.app.rdhasaki.com/to_coor?address=${formalAddress}`).subscribe((data: any) => {
      console.log(data);
      this.options.center = new Leaflet.LatLng(data[0], data[1]);
      if (this.options.layers.length == 1) {
        this.options.layers.push(new Leaflet.Marker(this.options.center, {
          icon: new Leaflet.Icon({
            iconSize: [50, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/red-marker.svg',
          }),
        } as Leaflet.MarkerOptions));
      } else {
        this.options.layers[1] = new Leaflet.Marker(this.options.center, {
          icon: new Leaflet.Icon({
            iconSize: [50, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/red-marker.svg',
          }),
        } as Leaflet.MarkerOptions);
      }

    });
  }

  searchByActualAddress() {
    this.httpClient.get(`https://nominatim.openstreetmap.org/search?q=${this.actualAddress}&format=json`).subscribe((data) => {
      let searchResult = data as any[];
      if (searchResult.length > 0) {
        let { lat, lon } = searchResult[0];
        this.options.center = new Leaflet.LatLng(lat, lon);
        this.getAddress();
        this.actualAddress = searchResult[0]["display_name"];
      }
    });
  }

  getActualAddressByLocation() {
    this.httpClient.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.options.center['lat']}&lon=${this.options.center['lng']}`).subscribe((data) => {
      this.actualAddress = data["display_name"];
    });
  }


  getAddressDebounce = debounce(() => {
    this.httpClient.get(`https://word-loc-api.run.app.rdhasaki.com/to_words?lat=${this.options.center['lat']}&long=${this.options.center['lng']}`).subscribe((data: any) => {
      console.log(data);
      this.address = "";
      this.address = data.address.join(' . ');
      this.getActualAddressByLocation();
      //this.router.navigate([], { queryParams: { addr: this.address } });
      // this.address = data;
    });
  }, 1000)

  getAddress() {
    console.log("getAddress");
    this.getAddressDebounce();

  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.options.center = new Leaflet.LatLng(position.coords.latitude, position.coords.longitude);
      this.getAddress();
    });
  }

}

export const getLayers = (): Leaflet.Layer[] => {
  return [
    // Basic style
    new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    } as Leaflet.TileLayerOptions),
  ] as Leaflet.Layer[];
};

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number,
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}