import { createCar, getCars } from '../../api';
import { generateNewCar } from '../../helpers';
import { TCar } from '../../types';
import Car from '../car';
import Control from '../common/control';
import GarageForm from '../garage-form';

class Garage extends Control {
    garageCars!: TCar[];
    carsCount!: string | null;
    carElements: HTMLElement[];
    garageForm: GarageForm;
    carsField!: Control<HTMLElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', [], 'Garage');
        this.garageForm = new GarageForm(this.node);
        this.garageForm.onGenerateCars = () => this.generateNewCars();
        this.carElements = [];
        this.renderCars();
    }

    renderCars = async () => {
        await this.getGarageCarsData();
        console.log(this.garageCars, this.carsCount);
        this.carsField = new Control(this.node, 'div', ['cars-list']);

        for (let i = 0; i < this.garageCars.length; i++) {
            const carItem = new Car(this.garageCars[i]);
            carItem.renderCar();
            this.carElements.push(carItem.node);
            this.carsField.node.appendChild(carItem.node);
        }
    };

    getGarageCarsData = async () => {
        const garageData = await getCars(0, 7);
        this.garageCars = garageData.cars;
        this.carsCount = garageData.count;
    };

    updateCarsField = () => {
        this.carsField.destroy();
        this.renderCars();
    };

    generateNewCars = async () => {
        const newCarsData = [];
        for (let i = 0; i < 100; i++) {
            newCarsData.push(generateNewCar());
        }
        Promise.allSettled(newCarsData.map((newCar) => createCar(newCar))).then(() => this.updateCarsField());
    };
}

export default Garage;
