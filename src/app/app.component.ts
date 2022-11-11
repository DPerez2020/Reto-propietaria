import { AddressService } from './address.service';
import { AfterViewInit, Component } from '@angular/core';
import { Map, tileLayer } from 'leaflet';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  addressForm!: FormGroup;
  coordsForm!: FormGroup;

  constructor(private _addressService: AddressService, private _formBuilder: FormBuilder) {
    this.addressForm = this._buildAddressMap();
    this.coordsForm = this._formBuilder.group({
      coordX: [''],
      coordY: ['']
    });
  }

  title = 'propietaria-reto';

  ngAfterViewInit(): void {
    this._setMap();
  }

  public searchByCoords() {
    const coords = this.coordsForm.value;

          
    let params ={
      latlng:coords.coordY,
      lntlng:coords.coordX
    }

    this._getAndSetAddress(params);
  }

  public saveAddress() {
    const address = this.addressForm.value;
    this._addressService.saveAddress(address).subscribe({
      next: (data) => {
        console.log(data);
        this.addressForm.reset();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private _setMap() {
    const map = new Map('map').setView([18.47334, -69.9137], 13);

    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
      .addTo(map);

    map.on('click', (e) => {    
      let params ={
        latlng:e.latlng.lng,
        lntlng:e.latlng.lat
      }

      this._getAndSetAddress(params);
    })
  }

  private _getAndSetAddress(e: any) {
    this._addressService.translateAddress(`${e.latlng},${e.lntlng}`).subscribe({
      next: (data) => {

        let formData = {
          region: "",
          municipio: data.address.Neighborhood,
          province: data.address.Region,
          houseNum: data.address.AddNum,
          fullAddress: data.address.LongLabel,
          city: data.address.City,
          block: data.address.Block,
          codPostal: data.address.Postal,
          placeName: data.address.PlaceName,
          geoPoint: {
            x:data.location.x,
            y:data.location.y
          }
        }

        this.addressForm.setValue(formData);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  private _buildAddressMap() {
    return this._formBuilder.group({
      region: [''],
      municipio: [''],
      province: [''],
      houseNum: [''],
      fullAddress: [''],
      city: [''],
      block: [''],
      codPostal: [''],
      placeName: [''],
      geoPoint: [{}]
    });
  }
}
