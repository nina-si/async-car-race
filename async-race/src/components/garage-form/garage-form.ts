import { createCar, updateCar } from '../../api';
import Control from '../common/control';
import InputControl from '../common/input-control';

class GarageForm extends Control {
    garageBtns!: Control<HTMLElement>;
    createForm!: Control<HTMLElement>;
    updateForm!: Control<HTMLElement>;
    onGenerateCars!: () => void;
    onCarUpdate!: () => void;
    modelUpdate!: InputControl;
    colorUpdate!: InputControl;
    updateCarBtn!: Control<HTMLElement>;
    onResetCars!: () => void;
    onStartRace!: () => void;
    modelInput!: InputControl;
    colorInput!: InputControl;
    onCarAdd!: () => void;
    raceBtn!: Control<HTMLButtonElement>;
    resetBtn!: Control<HTMLButtonElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode);
        this.render();
    }

    render() {
        this.createForm = new Control(this.node, 'form', ['create-form']);
        this.renderCreateForm();
        this.updateForm = new Control(this.node, 'form', ['update-form']);
        this.renderUpdateForm();
        this.garageBtns = new Control(this.node, 'div', ['garage-btns']);
        this.renderGarageBtns();
    }

    renderCreateForm() {
        this.modelInput = new InputControl('text', this.createForm.node, ['car-model'], 'car-model');
        this.colorInput = new InputControl('color', this.createForm.node, ['car-color'], 'car-color');
        const createCarBtn = new Control(this.createForm.node, 'button', ['btn', 'btn-create'], 'Create');
        createCarBtn.node.onclick = (e) => {
            e.preventDefault();
            this.handleCreateCar();
        };
    }

    renderUpdateForm() {
        this.updateForm.node.innerHTML = '';
        this.modelUpdate = new InputControl('text', this.updateForm.node, ['update-model'], 'update-model');
        this.colorUpdate = new InputControl('color', this.updateForm.node, ['update-color'], 'update-color');
        this.updateCarBtn = new Control(this.updateForm.node, 'button', ['btn', 'btn-update'], 'Update');
        (this.updateCarBtn.node as HTMLButtonElement).disabled = true;
    }

    renderGarageBtns() {
        this.raceBtn = new Control(this.garageBtns.node, 'button', ['btn', 'btn-race'], 'Race');
        this.raceBtn.node.onclick = () => {
            this.raceBtn.node.disabled = true;
            this.onStartRace();
        };
        this.resetBtn = new Control(this.garageBtns.node, 'button', ['btn'], 'Reset');
        this.resetBtn.node.onclick = () => this.onResetCars();
        const generateCarsBtn = new Control(this.garageBtns.node, 'button', ['btn'], 'Generate Cars');
        generateCarsBtn.node.onclick = () => this.onGenerateCars();
    }

    fillUpdateForm(id: number, carName?: string, carColor?: string) {
        if (carName) (this.modelUpdate.node as HTMLInputElement).value = carName;
        if (carColor) (this.colorUpdate.node as HTMLInputElement).value = carColor;
        (this.updateCarBtn.node as HTMLButtonElement).disabled = false;
        this.updateCarBtn.node.onclick = async (e) => {
            e.preventDefault();
            await updateCar(id, {
                name: (this.modelUpdate.node as HTMLInputElement).value,
                color: (this.colorUpdate.node as HTMLInputElement).value,
            });
            this.onCarUpdate();
            this.renderUpdateForm();
        };
    }

    handleCreateCar = async () => {
        const color = (this.colorInput.node as HTMLInputElement).value;
        const nameValue = (this.modelInput.node as HTMLInputElement).value;
        const newName = nameValue.length ? nameValue : 'Noname car';
        await createCar({ name: newName, color });
        (this.modelInput.node as HTMLInputElement).value = '';
        (this.colorInput.node as HTMLInputElement).value = '#000000';
        this.onCarAdd();
    };

    setReadyToRace = () => {
        this.raceBtn.node.disabled = false;
    };

    reset = () => {
        this.setReadyToRace();
        this.renderUpdateForm();
    };
}

export default GarageForm;
