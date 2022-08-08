import { createCar, createNewWinner, deleteCar, getCars, getWinnerData, updateWinner } from '../../api';
import { CARS_PER_PAGE } from '../../constants';
import { generateNewCar } from '../../helpers';
import { TCar } from '../../types';
import CarRow from '../car-row';
import Control from '../common/control';
import GarageForm from '../garage-form';
import Pagination from '../pagination';

class Garage extends Control {
    garageCars!: TCar[];
    carsCount!: string | null;
    carElements: CarRow[];
    garageForm: GarageForm;
    carsField!: Control<HTMLElement>;
    currentPage: number;
    onNewRecord!: () => void;
    lastPage: number;
    pagination!: Pagination;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'section', ['garage'], 'Garage');
        this.currentPage = 1;
        this.lastPage = 1;
        this.garageForm = new GarageForm(this.node);
        this.garageForm.onGenerateCars = () => this.generateNewCars();
        this.garageForm.onCarUpdate = () => this.updateCarsField();
        this.garageForm.onStartRace = () => this.startRace();
        this.garageForm.onResetCars = () => this.resetCars();
        this.carElements = [];
        this.renderCarsField();
    }

    renderCarsField = async () => {
        await this.getGarageCarsData();
        this.carsField = new Control(this.node, 'div', ['cars-list']);

        for (let i = 0; i < this.garageCars.length; i++) {
            const carItem = new CarRow(this.garageCars[i]);
            carItem.onCarSelect = (id, name, string) => this.selectCar(id, name, string);
            carItem.onCarRemove = (id) => this.removeCarFromGarage(id);
            carItem.renderCarRow();
            this.carElements.push(carItem);
            this.carsField.node.appendChild(carItem.node);
        }
        this.pagination = new Pagination(this.node, this.currentPage, this.lastPage);
        this.pagination.onPageChange = (currentPage) => this.changePage(currentPage);
    };

    getGarageCarsData = async () => {
        const garageData = await getCars(this.currentPage, CARS_PER_PAGE);
        this.garageCars = garageData.cars;
        this.carsCount = garageData.count;
        this.lastPage = Math.ceil(Number(this.carsCount) / CARS_PER_PAGE);
    };

    updateCarsField = () => {
        this.carsField.destroy();
        this.pagination.destroy();
        this.renderCarsField();
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

    removeCarFromGarage = async (id: number) => {
        await deleteCar(id);
        this.updateCarsField();
    };

    startRace = async () => {
        Promise.any(this.carElements.map((car) => car.startRace())).then((data) => {
            console.log(`WINNER IS ${data.id} with time ${data.time}`);
            this.updateWinnerRecord(data.id, data.time);
        });
    };

    resetCars = async () => {
        return Promise.allSettled(this.carElements.map((car) => car.stopDriving()));
    };

    updateWinnerRecord = async (id: number, time: number) => {
        const prevRecord = await getWinnerData(id);
        if (!prevRecord.length) {
            const newRecord = { id, wins: 1, time };
            await createNewWinner(newRecord);
            this.onNewRecord();
        } else if (prevRecord.length) {
            const prevRecordData = prevRecord[0];
            const bestTime = prevRecordData.time < time ? prevRecordData.time : time;
            const newRecord = { wins: prevRecordData.wins + 1, time: bestTime };
            await updateWinner(id, newRecord);
            this.onNewRecord();
        }
    };

    changePage = (currentPage: number) => {
        this.currentPage = currentPage;
        this.updateCarsField();
    };
}

export default Garage;
