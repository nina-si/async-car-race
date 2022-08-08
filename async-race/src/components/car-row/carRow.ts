import { getDriveParams, stopEngine, switchDriveMode } from '../../api';
import { ANIMATION_SPEED, DRIVE_STATUS, TRACK_END, TRACK_START } from '../../constants';
import { renderCarImg } from '../../helpers';
import { TCar } from '../../types';
import Control from '../common/control';

class CarRow extends Control {
    name: string;
    id: number;
    color: string;
    carIcon!: Control<HTMLElement>;
    onCarSelect!: (carId: number, name: string, color: string) => void;
    onCarRemove!: (id: number) => void;
    asessedDriveTime!: number;
    isMoving!: boolean;
    startBtn!: Control<HTMLButtonElement>;
    stopBtn!: Control<HTMLButtonElement>;
    onReturnToStart!: () => void;
    controller!: AbortController;

    constructor(carData: TCar) {
        super(null, 'div', ['car-item']);
        this.name = carData.name;
        this.id = carData.id;
        this.color = carData.color;
    }

    renderCarRow = (): void => {
        const carBtns = new Control(this.node, 'div', ['car-btns']);
        const selectBtn = new Control(carBtns.node, 'button', ['btn'], 'Select');
        selectBtn.node.onclick = () => this.onCarSelect(this.id, this.name, this.color);
        const removeBtn = new Control(carBtns.node, 'button', ['btn'], 'Remove');
        removeBtn.node.onclick = () => this.onCarRemove(this.id);
        new Control(carBtns.node, 'span', ['car-name'], this.name);

        const track = new Control(this.node, 'div', ['track']);
        const controlBtns = new Control(track.node, 'div', ['control-btns']);
        this.startBtn = new Control(controlBtns.node, 'button', ['btn'], 'Start');
        this.startBtn.node.onclick = () => this.startDriving();
        this.stopBtn = new Control(controlBtns.node, 'button', ['btn'], 'Stop');
        this.stopBtn.node.disabled = true;
        this.stopBtn.node.onclick = () => this.stopDriving();

        this.carIcon = new Control(track.node, 'div', ['car']);
        this.carIcon.node.innerHTML = renderCarImg(this.color);
        const flag = new Control(track.node, 'div', ['flag']);
        flag.node.innerHTML = '&#9872';
    };

    startDriving = async () => {
        this.startBtn.node.disabled = true;
        this.asessedDriveTime = await this.getDriveTime();
        this.stopBtn.node.disabled = false;
        this.animateCar();
        const response = await switchDriveMode(this.id, this.controller.signal);
        if (response === 500) {
            this.isMoving = false;
        }
        return response;
    };

    animateCar = async (): Promise<void> => {
        if (this.asessedDriveTime) {
            const animationStep = (TRACK_END - TRACK_START) / (this.asessedDriveTime / ANIMATION_SPEED);
            let currentPosition = TRACK_START;
            this.isMoving = true;
            const animationInterval = setInterval(() => {
                if (this.isMoving) {
                    if (currentPosition < TRACK_END) {
                        currentPosition += animationStep;
                        this.carIcon.node.style.left = `${currentPosition}%`;
                    } else if (currentPosition >= TRACK_END) {
                        this.isMoving = false;
                        clearInterval(animationInterval);
                    }
                } else clearInterval(animationInterval);
            }, ANIMATION_SPEED);
        }
    };

    getDriveTime = async (): Promise<number> => {
        const driveParameters = await getDriveParams(this.id, DRIVE_STATUS.STARTED);
        return driveParameters.distance / driveParameters.velocity;
    };

    stopDriving = async () => {
        this.stopBtn.node.disabled = true;
        if (this.controller) this.controller.abort();
        await stopEngine(this.id);
        this.isMoving = false;
        this.carIcon.node.style.left = `${TRACK_START}%`;
        this.startBtn.node.disabled = false;
        this.onReturnToStart();
    };

    startRace = async (controller: AbortController) => {
        this.controller = controller;
        const startTime = new Date().getTime();

        const result = await this.startDriving();

        if (result === 200) {
            const finishTime = new Date().getTime();
            return { id: this.id, time: Number(((finishTime - startTime) / 1000).toFixed(2)), name: this.name };
        } else throw new Error(`Car № ${this.id} didn't finish`);
    };
}

export default CarRow;
