import {
    createCar,
    createNewWinner,
    deleteCar,
    deleteCarFromWinners,
    getCars,
    getWinnerData,
    updateWinner,
} from '../../api';
import { CARS_PER_PAGE } from '../../constants';
import { generateNewCar } from '../../helpers';
import { TCar, TWinner } from '../../types';
import CarRow from '../car-row';
import Control from '../common/control';
import GarageForm from '../garage-form';
import Pagination from '../pagination';

import './garage.styles.scss';

class Garage extends Control {
    garageCars!: TCar[];
    carsCount!: string | null;
    carElements!: CarRow[];
    garageForm: GarageForm;
    carsField!: Control<HTMLElement>;
    currentPage: number;
    lastPage: number;
    pagination!: Pagination;
    garageHeader!: Control<HTMLElement>;
    winnerModal!: Control<HTMLElement>;
    onCarDataUpdate!: () => void;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'section', ['garage'], 'Garage');
        this.currentPage = 1;
        this.lastPage = 1;
        this.winnerModal = new Control(this.node, 'div', ['winner-modal']);
        this.garageForm = new GarageForm(this.node);
        this.garageHeader = new Control(this.node, 'h2', ['garage-header']);
        this.garageForm.onGenerateCars = () => this.generateNewCars();
        this.garageForm.onCarUpdate = () => {
            this.updateCarsField();
            this.onCarDataUpdate();
        };
        this.garageForm.onStartRace = () => this.startRace();
        this.garageForm.onResetCars = () => this.resetCars();
        this.garageForm.onCarAdd = () => this.updateCarsField();
        this.renderCarsField();
    }

    renderCarsField = async () => {
        await this.getGarageCarsData();
        this.garageHeader.node.textContent = `Garage (${this.carsCount})`;
        this.carsField = new Control(this.node, 'div', ['cars-list']);

        this.carElements = [];
        for (let i = 0; i < this.garageCars.length; i++) {
            const carItem = new CarRow(this.garageCars[i]);
            carItem.onCarSelect = (id, name, string) => this.selectCar(id, name, string);
            carItem.onCarRemove = (id) => this.removeCarFromGarage(id);
            carItem.renderCarRow();
            carItem.onReturnToStart = () => this.checkIfReadyToRace();
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
        await deleteCarFromWinners(id);
        this.updateCarsField();
        this.onCarDataUpdate();
    };

    startRace = async () => {
        const controller = new AbortController();
        Promise.any(this.carElements.map((car) => car.startRace(controller)))
            .then((data) => {
                this.updateWinnerRecord(data);
            })
            .catch(() => console.log('There are no finished cars'));
    };

    resetCars = async () => {
        return Promise.allSettled(this.carElements.map((car) => car.stopDriving()));
    };

    updateWinnerRecord = async (data: TWinner) => {
        const { id, name, time } = data;
        this.displayWinnerModal(name, time);
        const prevRecord = await getWinnerData(id);
        if (!prevRecord.length) {
            const newRecord = { id, wins: 1, time };
            await createNewWinner(newRecord);
            this.onCarDataUpdate();
        } else if (prevRecord.length) {
            const prevRecordData = prevRecord[0];
            const bestTime = prevRecordData.time < time ? prevRecordData.time : time;
            const newRecord = { wins: prevRecordData.wins + 1, time: bestTime };
            await updateWinner(id, newRecord);
            this.onCarDataUpdate();
        }
    };

    changePage = (currentPage: number) => {
        this.currentPage = currentPage;
        this.updateCarsField();
    };

    displayWinnerModal = (name: string, time: number) => {
        this.winnerModal.node.textContent = `${name.toUpperCase()} won with result ${time}s`;
        this.winnerModal.node.classList.add('winner-modal--visible');
        setTimeout(() => this.winnerModal.node.classList.remove('winner-modal--visible'), 3000);
    };

    checkIfReadyToRace = () => {
        const isReady = this.carElements.map((elem) => !elem.startBtn.node.disabled);
        if (isReady.every((elem) => elem === true)) {
            this.garageForm.setReadyToRace();
        }
    };
}

export default Garage;
