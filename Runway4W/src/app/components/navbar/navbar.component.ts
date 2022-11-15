import { Component, HostListener, OnInit } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public location: LocationService,) { }

  ngOnInit(): void {
  }

  address = "";
  isAddress = false;


  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 768;
  }

  searchAddress(address: string) {

    this.location.getLocationFromAddress();

  }

  addressKeypress(ev: any) {
    if (ev.key == "Enter") {
      this.searchAddress(this.address);
    }
  }

  actualAddressKeypress(ev: any) {
    if (ev.key == "Enter") {
      this.location.searchByActualAddress();
    }
  }

  zoomIn() {
    this.location.options.zoom++;
    if (this.location.options.zoom > 20) {
      this.location.options.zoom = 20;
    }
  }

  zoomOut() {
    this.location.options.zoom--;
    if (this.location.options.zoom < 1) {
      this.location.options.zoom = 1;
    }
  }

  toggleIsAddress() {
    this.isAddress = !this.isAddress;
  }

}
