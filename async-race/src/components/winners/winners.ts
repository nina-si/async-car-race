import { getWinners } from '../../api';
import { SORT_ORDER, SORT_TYPE, WINNERS_PER_PAGE } from '../../constants';
import { TWinnerData } from '../../types';
import Control from '../common/control';
import Pagination from '../pagination';
import WinnerRecord from '../winner-record';

class Winners extends Control {
    header: Control<HTMLElement>;
    currentPage: number;
    sortType: string;
    sortOrder: string;
    winnersCount!: string | null;
    winnersData!: TWinnerData[];
    winnersTable!: Control<HTMLElement>;
    pagination!: Pagination;
    lastPage: number;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['hidden']);
        this.header = new Control(this.node, 'h2', ['winners-header']);
        this.currentPage = 1;
        this.lastPage = 1;
        this.sortType = SORT_TYPE.ID;
        this.sortOrder = SORT_ORDER.ASC;
        this.renderWinners();
    }

    renderWinners = async () => {
        await this.getWinnersData();
        this.header.node.textContent = `Winners (${this.winnersCount})`;
        this.winnersTable = new Control(this.node, 'table', ['winners-table']);
        this.pagination = new Pagination(this.node, this.currentPage, this.lastPage);
        this.pagination.onPageChange = (currentPage) => this.changePage(currentPage);
        this.renderWinnersTable();
    };

    getWinnersData = async () => {
        const response = await getWinners(this.currentPage, WINNERS_PER_PAGE, this.sortType, this.sortOrder);
        this.winnersCount = response.count;
        this.lastPage = Math.ceil(Number(this.winnersCount) / WINNERS_PER_PAGE);
        this.winnersData = response.winners;
    };

    updateWinners = async () => {
        await this.getWinnersData();
        this.header.node.textContent = `Winners (${this.winnersCount})`;
        this.winnersTable.node.innerHTML = '';
        this.pagination.destroy();
        this.renderWinnersTable();
        this.pagination = new Pagination(this.node, this.currentPage, this.lastPage);
        this.pagination.onPageChange = (currentPage) => this.changePage(currentPage);
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

    changePage = (currentPage: number) => {
        this.currentPage = currentPage;
        this.updateWinners();
    };
}

export default Winners;
