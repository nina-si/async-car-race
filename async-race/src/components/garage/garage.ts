import { createCar, getCars } from '../../api';
import { generateNewCar } from '../../helpers';
import { TCar } from '../../types';
import CarRow from '../car-row';
import Control from '../common/control';
import GarageForm from '../garage-form';

class Garage extends Control {
    garageCars!: TCar[];
    carsCount!: string | null;
    carElements: HTMLElement[];
    garageForm: GarageForm;
    carsField!: Control<HTMLElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'section', ['garage'], 'Garage');
        this.garageForm = new GarageForm(this.node);
        this.garageForm.onGenerateCars = () => this.generateNewCars();
        this.garageForm.onCarUpdate = () => this.updateCarsField();
        this.carElements = [];
        this.renderCars();
    }

    renderCars = async () => {
        await this.getGarageCarsData();
        this.carsField = new Control(this.node, 'div', ['cars-list']);

        for (let i = 0; i < this.garageCars.length; i++) {
            const carItem = new CarRow(this.garageCars[i]);
            carItem.onCarSelect = (id, name, string) => this.selectCar(id, name, string);
            carItem.renderCarRow();
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

    selectCar(id: number, name: string, color: string) {
        this.garageForm.fillUpdateForm(id, name, color);
    }
}

export default Garage;
