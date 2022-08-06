import Control from '../common/control';
import InputControl from '../common/input-control';

class GarageForm extends Control {
    garageBtns!: Control<HTMLElement>;
    createForm!: Control<HTMLElement>;
    updateForm!: Control<HTMLElement>;
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
        const modelInput = new InputControl('text', this.createForm.node, ['car-model'], 'car-model');
        const colorInput = new InputControl('color', this.createForm.node, ['car-color'], 'car-color');
        const createCarBtn = new Control(this.createForm.node, 'button', ['btn', 'btn-create'], 'Create');
        createCarBtn.node.onclick = (e) => {
            e.preventDefault();
            console.log((modelInput.node as HTMLInputElement).value, (colorInput.node as HTMLInputElement).value);
        };
    }

    renderUpdateForm(carName?: string, carColor?: string) {
        this.updateForm.node.innerHTML = '';
        const modelInput = new InputControl('text', this.createForm.node, ['update-model'], 'update-model');
        if (carName) (modelInput.node as HTMLInputElement).value = carName;
        const colorInput = new InputControl('color', this.createForm.node, ['update-color'], 'update-color');
        if (carColor) (colorInput.node as HTMLInputElement).value = carColor;
        const updateCarBtn = new Control(this.createForm.node, 'button', ['btn', 'btn-update'], 'Update');
        updateCarBtn.node.onclick = (e) => {
            e.preventDefault();
            console.log(
                (modelInput.node as HTMLInputElement).value,
                (colorInput.node as HTMLInputElement).value,
                'UPDATE'
            );
        };
    }

    renderGarageBtns() {
        const raceBtn = new Control(this.garageBtns.node, 'button', ['btn', 'btn-race'], 'Race');
        raceBtn.node.onclick = () => console.log('RACE Started');
        const resetBtn = new Control(this.garageBtns.node, 'button', ['btn'], 'Reset');
        resetBtn.node.onclick = () => console.log('RESET');
        const generateCarsBtn = new Control(this.garageBtns.node, 'button', ['btn'], 'Generate Cars');
        generateCarsBtn.node.onclick = () => console.log('GENERATE NEW CARS');
    }
}

export default GarageForm;

// <form class="create-form">
//       <input id="car-model" class="car-model" type="text">
//       <input id="car-color" class="car-color" type="color">
//       <button class="btn btn-create">Create</button>
//     </form>
//     <form class="update-form">
//       <input id="update-model" class="update-model" type="text">
//       <input id="update-color" class="update-color" type="color">
//       <button class="btn btn-update">Update</button>
//     </form>
//     <div class="garage-btns">
//       <button class="btn btn-race">Race</button>
//       <button class="btn">Reset</button>
//       <button class="btn">Generate Cars</button>
//     </div>
//     <h1>Garage (${garageCars.count})</h1>
