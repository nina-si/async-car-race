import { getCars } from '../../api';
import { TCar } from '../../types';
import Car from '../car';
import Control from '../common/control';

class Garage extends Control {
    garageCars!: TCar[];
    carsCount!: string | null;
    carElements: HTMLElement[];

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'hidden', 'Garage');
        this.carElements = [];
        this.renderCars();
    }

    renderCars = async () => {
        const garageData = await getCars(0, 7);
        this.garageCars = garageData.cars;
        this.carsCount = garageData.count;
        console.log(this.garageCars, this.carsCount);
        const carsTable = new Control(this.node, 'div', 'cars-list');

        for (let i = 0; i < this.garageCars.length; i++) {
            const carItem = new Car(this.garageCars[i]);
            carItem.renderCar();
            this.carElements.push(carItem.node);
            carsTable.node.appendChild(carItem.node);
        }
    };
}

export default Garage;
