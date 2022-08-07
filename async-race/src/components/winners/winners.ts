import { getWinners } from '../../api';
import { SORT_ORDER, SORT_TYPE, WINNERS_PER_PAGE } from '../../constants';
import { TWinner } from '../../types';
import Control from '../common/control';
import WinnerRecord from '../winner-record';

class Winners extends Control {
    header: Control<HTMLElement>;
    currentPage: number;
    sortType: string;
    sortOrder: string;
    winnersCount!: string | null;
    winnersData!: TWinner[];
    winnersTable!: Control<HTMLElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['hidden']);
        this.header = new Control(this.node, 'h2', ['winners-header']);
        this.currentPage = 0;
        this.sortType = SORT_TYPE.TIME;
        this.sortOrder = SORT_ORDER.ASC;
        this.renderWinners();
    }

    renderWinners = async () => {
        await this.getWinnersData();
        this.header.node.textContent = `Winners (${this.winnersCount})`;
        this.winnersTable = new Control(this.node, 'table', ['winners-table']);
        this.renderWinnersTable();
        console.log(this.winnersData);
    };

    getWinnersData = async () => {
        const response = await getWinners(this.currentPage, WINNERS_PER_PAGE, this.sortType, this.sortOrder);
        this.winnersCount = response.count;
        this.winnersData = response.winners;
    };

    updateWinners = async () => {
        await this.getWinnersData();
        this.header.node.textContent = `Winners (${this.winnersCount})`;
        this.winnersTable.node.innerHTML = '';
        this.renderWinnersTable();
    };

    renderWinnersTable = async () => {
        this.winnersTable.node.innerHTML = `
            <thead>
            <tr>
                <td>ID</td>
                <td>Image</td>
                <td>Car</td>
                <td>Wins number</td>
                <td>Best time in secs</td>
            </tr>
            </thead>
        `;
        const winRecords = this.winnersData.map((winner) => new WinnerRecord(this.winnersTable.node, winner));
        for (let i = 0; i < winRecords.length; i++) {
            winRecords[i].render();
        }
    };
}

export default Winners;
