import { Component, OnInit, NgZone, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { title } from 'node:process';
// import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})

export class FormComponent implements OnInit {
  autocomplete: { input: string; };
  autocompleteItems: any[];
  // location: any;
  public todo : FormGroup;
  placeid: any;
  GoogleAutocomplete: any;
  @Input()
  direccion: string
  
  constructor(
    public formBuilder: FormBuilder,
    public zone: NgZone,
    private route: Router
  ) { 
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

      this.todo = this.formBuilder.group({
        direccion:['', Validators.required],
        numero: ['', Validators.required],
        piso: ['',],
        descripcion: [''],
        });
      }
      enviaInfo(){
      console.log(this.todo.value)
    }

  

  ngOnInit() {}

  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
       
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          console.log(prediction)
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  //FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  async SelectSearchResult(item) {
    //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
    //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
    console.log(JSON.stringify(item))
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];      
    this.placeid = item.place_id
    this.todo.value.direccion = item.description
    console.log(this.todo.value.direccion)
    const txt = document.getElementById('address') as HTMLInputElement
    txt.value = this.todo.value.direccion
  }
  
  
  
  //LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  goToMap(){
    return this.route.navigate(['/maps'])
  }

  GoTo(){
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
  }
  
}
