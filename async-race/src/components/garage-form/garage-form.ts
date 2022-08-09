import { createCar, updateCar } from '../../api';
import Control from '../common/control';
import InputControl from '../common/input-control';

import './garage-form.styles.scss';

class GarageForm extends Control {
    garageBtns!: Control<HTMLElement>;
    createForm!: Control<HTMLElement>;
    updateForm!: Control<HTMLElement>;
    onGenerateCars!: () => void;
    onCarUpdate!: () => void;
    modelUpdate!: InputControl;
    colorUpdate!: InputControl;
    updateCarBtn!: Control<HTMLButtonElement>;
    onResetCars!: () => void;
    onStartRace!: () => void;
    modelInput!: InputControl;
    colorInput!: InputControl;
    onCarAdd!: () => void;
    raceBtn!: Control<HTMLButtonElement>;
    resetBtn!: Control<HTMLButtonElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['garage-forms-container']);
        this.render();
    }

    render = (): void => {
        this.createForm = new Control(this.node, 'form', ['garage-form', 'create-form']);
        this.renderCreateForm();
        this.updateForm = new Control(this.node, 'form', ['garage-form', 'update-form']);
        this.renderUpdateForm();
        this.garageBtns = new Control(this.node, 'div', ['garage-btns']);
        this.renderGarageBtns();
    };

    renderCreateForm = (): void => {
        this.modelInput = new InputControl('text', this.createForm.node, ['car-model'], 'car-model');
        this.colorInput = new InputControl('color', this.createForm.node, ['car-color'], 'car-color');
        const createCarBtn = new Control(this.createForm.node, 'button', ['btn', 'btn-create'], 'Create');
        createCarBtn.node.onclick = (e: MouseEvent): void => {
            e.preventDefault();
            this.handleCreateCar();
        };
    };

    renderUpdateForm = (): void => {
        this.updateForm.node.innerHTML = '';
        this.modelUpdate = new InputControl('text', this.updateForm.node, ['car-model'], 'update-model');
        this.colorUpdate = new InputControl('color', this.updateForm.node, ['car-color'], 'update-color');
        this.updateCarBtn = new Control(this.updateForm.node, 'button', ['btn', 'btn-update'], 'Update');
        this.updateCarBtn.node.disabled = true;
    };

    renderGarageBtns = (): void => {
        this.raceBtn = new Control(this.garageBtns.node, 'button', ['btn', 'btn-race'], 'Race');
        this.raceBtn.node.onclick = (): void => {
            this.raceBtn.node.disabled = true;
            this.onStartRace();
        };
        this.resetBtn = new Control(this.garageBtns.node, 'button', ['btn'], 'Reset');
        this.resetBtn.node.onclick = (): void => this.onResetCars();
        const generateCarsBtn = new Control(this.garageBtns.node, 'button', ['btn'], 'Generate Cars');
        generateCarsBtn.node.onclick = (): void => this.onGenerateCars();
    };

    fillUpdateForm = (id: number, carName?: string, carColor?: string): void => {
        if (carName) (this.modelUpdate.node as HTMLInputElement).value = carName;
        if (carColor) (this.colorUpdate.node as HTMLInputElement).value = carColor;
        this.updateCarBtn.node.disabled = false;
        this.updateCarBtn.node.onclick = async (e: MouseEvent): Promise<void> => {
            e.preventDefault();
            await updateCar(id, {
                name: (this.modelUpdate.node as HTMLInputElement).value,
                color: (this.colorUpdate.node as HTMLInputElement).value,
            });
            this.onCarUpdate();
            this.renderUpdateForm();
        };
    };

    handleCreateCar = async (): Promise<void> => {
        const color = (this.colorInput.node as HTMLInputElement).value;
        const nameValue = (this.modelInput.node as HTMLInputElement).value;
        const newName = nameValue.length ? nameValue : 'Noname car';
        await createCar({ name: newName, color });
        (this.modelInput.node as HTMLInputElement).value = '';
        (this.colorInput.node as HTMLInputElement).value = '#000000';
        this.onCarAdd();
    };

    setReadyToRace = (): void => {
        this.raceBtn.node.disabled = false;
    };

    reset = (): void => {
        this.setReadyToRace();
        this.renderUpdateForm();
    };
}

export default GarageForm;
