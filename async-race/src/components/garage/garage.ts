import Control from '../common/control';

class Garage extends Control {
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'hidden', 'Garage');
    }
}

export default Garage;
