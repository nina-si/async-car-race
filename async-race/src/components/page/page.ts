import Control from '../common/control';
import Garage from '../garage';
import Header from '../header';
import Winners from '../winners';

import './page.styles.scss';

class Page extends Control {
    header: Header;
    garage: Garage;
    winners: Winners;

    constructor() {
        super(null, 'div', ['wrapper']);
        this.header = new Header(this.node);
        this.garage = new Garage(this.node);
        this.winners = new Winners(this.node);
        this.garage.onCarDataUpdate = () => this.winners.updateWinners();
        this.header.onGarageClick = () => this.showGarageView();
        this.header.onWinnersClick = () => this.showWinnersView();
    }

    showGarageView = (): void => {
        this.winners.hideNode();
        this.garage.showNode();
    };

    showWinnersView = (): void => {
        this.garage.hideNode();
        this.winners.showNode();
    };
}

export default Page;
