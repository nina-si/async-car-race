import Control from '../common/control';

class Winners extends Control {
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['hidden'], 'Winners');
    }
}

export default Winners;
