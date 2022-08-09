import Control from '../common/control';

import './header.styles.scss';

class Header extends Control {
    garageBtn!: Control<HTMLElement>;
    winnersBtn!: Control<HTMLElement>;
    onGarageClick!: () => void;
    onWinnersClick!: () => void;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'header', ['main-header']);
        this.render();
    }

    render = (): void => {
        this.garageBtn = new Control(this.node, 'button', ['btn', 'btn-header'], 'Garage');
        this.garageBtn.node.onclick = () => this.onGarageClick();
        this.winnersBtn = new Control(this.node, 'button', ['btn', 'btn-header'], 'Winners');
        this.winnersBtn.node.onclick = () => this.onWinnersClick();
    };
}

export default Header;
