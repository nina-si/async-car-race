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
    winnersTableHeader!: Control<HTMLElement>;
    winsHeader!: Control<HTMLElement>;
    bestTimeHeader!: Control<HTMLElement>;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['hidden']);
        this.header = new Control(this.node, 'h2', ['winners-header']);
        this.currentPage = 1;
        this.lastPage = 1;
        this.sortType = SORT_TYPE.ID;
        this.sortOrder = SORT_ORDER.ASC;
        this.renderWinners();
    }

    renderWinners = async (): Promise<void> => {
        await this.getWinnersData();
        this.header.node.textContent = `Winners (${this.winnersCount})`;
        this.winnersTable = new Control(this.node, 'table', ['winners-table']);
        this.pagination = new Pagination(this.node, this.currentPage, this.lastPage);
        this.pagination.onPageChange = (currentPage) => this.changePage(currentPage);
        this.renderWinnersTable();
    };

    getWinnersData = async (): Promise<void> => {
        const response = await getWinners(this.currentPage, WINNERS_PER_PAGE, this.sortType, this.sortOrder);
        this.winnersCount = response.count;
        this.lastPage = Math.ceil(Number(this.winnersCount) / WINNERS_PER_PAGE);
        this.winnersData = response.winners;
    };

    updateWinners = async (): Promise<void> => {
        await this.getWinnersData();
        this.header.node.textContent = `Winners (${this.winnersCount})`;
        this.winnersTable.node.innerHTML = '';
        this.pagination.destroy();
        this.renderWinnersTable();
        this.pagination = new Pagination(this.node, this.currentPage, this.lastPage);
        this.pagination.onPageChange = (currentPage) => this.changePage(currentPage);
    };

    renderWinnersTable = async (): Promise<void> => {
        this.winnersTableHeader = new Control(this.winnersTable.node, 'thead');
        this.renderWinnersTableHeader();
        const winRecords = this.winnersData.map((winner) => new WinnerRecord(this.winnersTable.node, winner));
        for (let i = 0; i < winRecords.length; i++) {
            winRecords[i].render();
        }
    };

    renderWinnersTableHeader = (): void => {
        const headerRow = new Control(this.winnersTableHeader.node, 'tr');
        const id = new Control(null, 'td', [], 'ID');
        const image = new Control(null, 'td', [], 'Image');
        const car = new Control(null, 'td', [], 'Car');
        this.winsHeader = new Control(null, 'td', [], 'Wins number');
        this.bestTimeHeader = new Control(null, 'td', [], 'Best time in secs');
        this.winsHeader.node.onclick = () => this.handleSortingChange(SORT_TYPE.WINS);
        this.bestTimeHeader.node.onclick = () => this.handleSortingChange(SORT_TYPE.TIME);
        if (this.sortType === SORT_TYPE.ID) {
            this.winsHeader.node.textContent = 'Wins number ↕️';
            this.bestTimeHeader.node.textContent = 'Best time in secs ↕️';
        }
        if (this.sortType === SORT_TYPE.TIME) {
            this.winsHeader.node.textContent = 'Wins number ↕️';
            this.bestTimeHeader.node.textContent = `Best time in secs ${
                this.sortOrder === SORT_ORDER.ASC ? '⬆️' : '⬇️'
            }`;
        }
        if (this.sortType === SORT_TYPE.WINS) {
            this.bestTimeHeader.node.textContent = 'Best time in secs ↕️';
            this.winsHeader.node.textContent = `Wins number ${this.sortOrder === SORT_ORDER.ASC ? '⬆️' : '⬇️'}`;
        }
        headerRow.node.append(id.node, image.node, car.node, this.winsHeader.node, this.bestTimeHeader.node);
    };

    changePage = (currentPage: number): void => {
        this.currentPage = currentPage;
        this.updateWinners();
    };

    handleSortingChange = (sortType: string): void => {
        if (this.sortType === sortType) {
            this.sortOrder = this.sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
        } else {
            this.sortType = sortType;
            this.sortOrder = SORT_ORDER.ASC;
        }
        this.updateWinners();
    };
}

export default Winners;
