import { Component, OnInit } from '@angular/core';
import { Country } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { OptionNumber } from 'src/app/option';

@Component({
  selector: 'app-edit-countries',
  templateUrl: './edit-countries.component.html',
  styleUrls: ['./edit-countries.component.sass']
})
export class EditCountriesComponent implements OnInit {

  countryID: number | null = null;
  countryOptions: OptionNumber[] = [];
  countries: Country[] = [];

  shortName: string | null = null;
  fullName: string | null = null;
  alpha2Code: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void { 
    this.api.getCountries().subscribe(countries => {
      this.countries = countries;
      this.countryOptions = countries.map(c => ({ value: c.id, display: c.shortName }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.countryID = null;
    this.shortName = null;
    this.fullName = null;
    this.alpha2Code = null;
  }

  selectCountry(): void {
    const country = this.countries.find(c => c.id == this.countryID);
    if(country) { 
      this.countryID = country.id;
      this.shortName = country.shortName;
      this.fullName = country.fullName;
      this.alpha2Code = country.alpha2Code;
    }
  }

  save(): void {
    if(this.shortName && this.fullName && this.alpha2Code) {
      if(this.countryID) {
        this.api.updateCountry(this.countryID, this.shortName, this.fullName, this.alpha2Code).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createCountry(this.shortName, this.fullName, this.alpha2Code).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
