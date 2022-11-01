import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _token ="AAPK03955f8682e94867912783d4e7c5c105XjBqvda2S1qqU33kOHkXK6mNU4TlhtPjIAfL6LXk_IVGoo0Ee535-qEl-WDVeVYL"

  constructor(private http:HttpClient) { }

  public translateAddress(point:any){
    return this.http.get(`https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${point}
    &f=json&token=${this._token}`);
  }
}
