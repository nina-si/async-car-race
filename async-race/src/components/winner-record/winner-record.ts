import { getCarInfo } from '../../api';
import { renderCarImg } from '../../helpers';
import { TWinnerData } from '../../types';
import Control from '../common/control';

class WinnerRecord extends Control {
    id: number;
    wins: number;
    time: number;
    name!: string;
    color!: string;

    constructor(parentNode: HTMLElement, winner: TWinnerData) {
        super(parentNode, 'tr', ['winner-record']);
        this.id = winner.id;
        this.wins = winner.wins;
        this.time = winner.time;
    }

    render = async () => {
        await this.getCarData();
        const idCell = new Control(null, 'td', [], this.id.toString());
        const imageCell = new Control(this.node, 'div', []);
        imageCell.node.innerHTML = renderCarImg(this.color);
        const nameCell = new Control(null, 'td', [], this.name);
        const winsCell = new Control(null, 'td', [], this.wins.toString());
        const timeCell = new Control(null, 'td', [], this.time.toString());
        this.node.append(idCell.node, imageCell.node, nameCell.node, winsCell.node, timeCell.node);
    };

    getCarData = async () => {
        const response = await getCarInfo(this.id);
        this.name = response.name;
        this.color = response.color;
    };
}

export default WinnerRecord;
