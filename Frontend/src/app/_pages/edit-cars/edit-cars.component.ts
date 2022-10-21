import { Component, OnInit } from '@angular/core';
import { Car } from '@shared/api';
import { ApiService } from 'src/app/api.service';
import { OptionNumber } from 'src/app/option';

@Component({
  selector: 'app-edit-cars',
  templateUrl: './edit-cars.component.html',
  styleUrls: ['./edit-cars.component.sass']
})
export class EditCarsComponent implements OnInit {

  carID: number | null = null;
  carOptions: OptionNumber[] = [];
  cars: Car[] = [];

  shortName: string | null = null;
  fullName: string | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  setup(): void {
    this.api.getCars().subscribe(cars => {
      this.cars = cars;
      this.carOptions = cars.map(c => ({ value: c.id, display: c.shortName }));
    });
  }

  ngOnInit(): void {
  }

  clear() : void {
    this.carID = null;
    this.shortName = null;
    this.fullName = null;
  }

  selectCar(): void {
    const car = this.cars.find(c => c.id == this.carID);
    if(car) { 
      this.carID = car.id;
      this.shortName = car.shortName;
      this.fullName = car.fullName;
    }
  }

  save(): void {
    if(this.shortName && this.fullName) {
      if(this.carID) {
        this.api.updateCar(this.carID, this.shortName, this.fullName).subscribe(() => {
          this.clear();
          this.setup();
        });
      } else {
        this.api.createCar(this.shortName, this.fullName).subscribe(() => {
          this.clear();
          this.setup();
        });
      }
    }
  }

}
