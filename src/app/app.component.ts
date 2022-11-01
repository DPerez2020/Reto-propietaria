import { AddressService } from './address.service';
import { AfterViewInit, Component } from '@angular/core';
import { Map, tileLayer } from 'leaflet';
import { geocoder } from 'leaflet-control-geocoder';
import { FormBuilder, FormGroup } from '@angular/forms';

// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  addressForm!:FormGroup;

  constructor(private _addressService:AddressService, private _formBuilder:FormBuilder){
    this.addressForm = this._buildAddressMap();
  }

  title = 'propietaria-reto';

  ngAfterViewInit(): void {
    const map = new Map('map').setView([18.47334, -69.9137], 13);

    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(map);  

    geocoder().addTo(map)
    .on('markgeocode', (e) => {
      console.log(e);
      
    });

    map.on('click', (e) => {
      this._addressService.translateAddress(`${e.latlng.lng},${e.latlng.lat}`).subscribe({
        next: (data) => {
          console.log(data);         
        },
        error: (err) => {
          console.log(err);
          
        }
      })
    })
  }

  private _buildAddressMap(){
    return this._formBuilder.group({
      address: [''],
      city: [''],
      num: [''],
      block: [''],
      codPostal: [''],
      placeName: [''],
      Neighborhood: [''],
      LongLabel: [''],
      region: [''],
      geoPoint:[{}]
    });
  }
}
