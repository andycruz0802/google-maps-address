//IMPORTAR LOS MODULOS NECESARIOS PARA LAS FUNCIONES.

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';

// import { HttpClient } from '@angular/common/http';
// import { LatLng } from '@ionic-native/google-maps';

declare var google: any;


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

  

export class MapComponent implements OnInit {
  
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  direcciones: any[]

 
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,
    private route: Router

  ){
    
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
 
  //CARGAMOS EL MAPA EN ONINIT
  ngOnInit() {
    this.loadMap();    
  }

  //CARGAR EL MAPA TIENE DOS PARTES 
  loadMap() {
    
    //OBTENEMOS LAS COORDENADAS DESDE EL TELEFONO.
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      this.lat = this.map.center.lat() 
      this.long = this.map.center.lng()

    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.lat+','+this.long+'&key=AIzaSyB6QgBvFSz8Zy_-4YvsGsOpA3IhnVJMZEA'
    console.log(url)
      
     fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.autocomplete.input = responseJson.results[1].formatted_address
    })


    
      //CUANDO TENEMOS LAS COORDENADAS SIMPLEMENTE NECESITAMOS PASAR AL MAPA DE GOOGLE TODOS LOS PARAMETROS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      this.map.addListener('center_changed', () => {
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
        console.log('accuracy',this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        
      }); 
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  
  }

  


  
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5    
    }; 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);  
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      }); 
  }

  
    

  //FUNCION DEL BOTON INFERIOR PARA QUE NOS DIGA LAS COORDENADAS DEL LUGAR EN EL QUE POSICIONAMOS EL PIN.
  ShowCords(){
    // alert('lat' +this.lat+', long'+this.long )
    alert('Ubicaciones posibles: \r\n\r\n'
          + ' - Murcia capital\r\n - San Javier\r\n - San Cayetano\r\n - Cartagena')
  }

  goToForm(){
    this.route.navigate([''])
  }

  //AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
  // UpdateSearchResults(){
  //   if (this.autocomplete.input == '') {
  //     this.autocompleteItems = [];
  //     return;
  //   }
  //   this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
  //   (predictions, status) => {
       
  //     this.autocompleteItems = [];
  //     this.zone.run(() => {
  //       predictions.forEach((prediction) => {
  //         console.log(prediction)
  //         this.autocompleteItems.push(prediction);
  //       });
  //     });
  //   });
  // }
  
  // //FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  // SelectSearchResult(item) {
  //   //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
  //   //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
  //   console.log(JSON.stringify(item))
  //   this.autocomplete.input = item.description;
  //   this.autocompleteItems = [];      
  //   this.placeid = item.place_id
  //   this.GoTo()
  // }
  
  
  // //LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  // ClearAutocomplete(){
  //   this.autocompleteItems = []
  //   this.autocomplete.input = ''
  // }
  

   mostrarCalle(){
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.lat+','+this.long+'&key=AIzaSyB6QgBvFSz8Zy_-4YvsGsOpA3IhnVJMZEA'
    console.log(url)
      
     fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      let actual = responseJson.results[1].formatted_address
      alert(actual)
    })


  }

   calculateDistance(){
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.lat+','+this.long+'&key=AIzaSyB6QgBvFSz8Zy_-4YvsGsOpA3IhnVJMZEA'

    let distancia = (<HTMLSelectElement>document.getElementById('distancia')).value;
    var dis: number = +distancia;
    console.log(distancia)
    var a = 0, b = 0, c = 0, d = 0
    this.direcciones= ['37.9832905759174 -1.097789813025254', '37.80548978252476 -0.8332412248237175' , '37.81669280866347 -0.8938290129202064' , '37.61514791335604 -0.9872168328689512']
    const direccion1 = this.direcciones[0].split(' ')
    const direccion2 = this.direcciones[1].split(' ')
    const direccion3 = this.direcciones[2].split(' ')
    const direccion4 = this.direcciones[3].split(' ')
    

    const matrix = new google.maps.DistanceMatrixService();
    
    matrix.getDistanceMatrix({
      origins: [new google.maps.LatLng(this.lat, this.long)],
      destinations: [new google.maps.LatLng(direccion1[0], direccion1[1]),
                     new google.maps.LatLng(direccion2[0], direccion2[1]),
                     new google.maps.LatLng(direccion3[0], direccion3[1]),
                     new google.maps.LatLng(direccion4[0], direccion4[1])],
      travelMode: google.maps.TravelMode.DRIVING,

    }, function(response, status) {
    // ------------------------------------------- mostrar calle -----------------------------------------------------
      console.log(response)

    console.log(url)
      
     fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      let actual = responseJson.results[1].formatted_address
      console.log(actual)
      console.log(distancia)

      

      a = response.rows[0].elements[0].distance.value / 1000
      // a.split('.').join(',');
      var a_string = ''+a;
      a_string = a_string.replace('.', ',')
      var direccionA = response.destinationAddresses[0]  
      console.log(a)

      b = response.rows[0].elements[1].distance.value / 1000
      var b_string = ''+b;
      b_string = b_string.replace('.', ',')
      var direccionB = response.destinationAddresses[1]
      console.log(b)

      c = response.rows[0].elements[2].distance.value / 1000
      var c_string = ''+c;
      c_string = c_string.replace('.', ',')
      var direccionC = response.destinationAddresses[2]
      console.log(c)

      d = response.rows[0].elements[3].distance.value / 1000
      var d_string = ''+d;
      d_string = d_string.replace('.', ',')
      var direccionD = response.destinationAddresses[3]
      console.log(d)

      if (isNaN(dis)) {
        alert('Seleccione antes una distancia...')
      }else{
        var alerta = 'Más cerca de ' + dis + ' kilómetros\r\n \r\n';
      if (b < dis) {
        alerta +=  direccionB + ' - ' + b_string + ' km \r\n\r\n'
      }
      if (a < dis) {
        alerta +=  direccionA + ' - ' + a_string + ' km \r\n\r\n'
      }
      if (c < dis) {
        alerta +=  direccionC + ' - ' + c_string + ' km \r\n\r\n'
      }
      if (d < dis) {
        alerta +=  direccionD + ' - ' + d_string + ' km \r\n\r\n'
      }
      if (alerta == 'Más cerca de ' + dis + ' kilómetros\r\n \r\n') {
        alerta = "No hay ninguna ubicación a menos de " + dis + " km..."
      }
      alert(alerta)
      }
      
      console.log(status)
    })


    // ------------------------------------------- mostrar calle -----------------------------------------------------
      
    });


  }

  



 
  //EJEMPLO PARA IR A UN LUGAR DESDE UN LINK EXTERNO, ABRIR GOOGLE MAPS PARA DIRECCIONES. 
  GoTo(){
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
  }

}
