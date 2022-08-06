import { getCars } from '../../api';
import { TCar } from '../../types';
import Car from '../car';
import Control from '../common/control';
import GarageForm from '../garage-form';

class Garage extends Control {
    garageCars!: TCar[];
    carsCount!: string | null;
    carElements: HTMLElement[];
    garageForm: GarageForm;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['hidden'], 'Garage');
        this.garageForm = new GarageForm(this.node);
        this.carElements = [];
        this.renderCars();
    }

    renderCars = async () => {
        const garageData = await getCars(0, 7);
        this.garageCars = garageData.cars;
        this.carsCount = garageData.count;
        console.log(this.garageCars, this.carsCount);
        const carsField = new Control(this.node, 'div', ['cars-list']);

        for (let i = 0; i < this.garageCars.length; i++) {
            const carItem = new Car(this.garageCars[i]);
            carItem.renderCar();
            this.carElements.push(carItem.node);
            carsField.node.appendChild(carItem.node);
        }
    };
}

export default Garage;
