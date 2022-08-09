import Control from '../common/control';

import './pagination.styles.scss';

class Pagination extends Control {
    currentPage: number;
    lastPage: number;
    onPageChange!: (currentPage: number) => void;

    constructor(parentNode: HTMLElement, currentPage: number, lastPage: number) {
        super(parentNode, 'div', ['pagination']);
        this.currentPage = currentPage;
        this.lastPage = lastPage;
        this.render();
    }

    render = (): void => {
        const prev = new Control(null, 'button', ['btn'], 'previous');
        if (this.currentPage === 1) (prev.node as HTMLButtonElement).disabled = true;
        const current = new Control(null, 'button', ['btn', 'btn--current-page'], `${this.currentPage}`);
        const next = new Control(null, 'button', ['btn'], 'next');
        if (this.currentPage === this.lastPage) (next.node as HTMLButtonElement).disabled = true;
        this.node.append(prev.node, current.node, next.node);
        prev.node.onclick = () => this.switchToPrevPage();
        next.node.onclick = () => this.switchToNextPage();
    };

    switchToPrevPage = (): void => {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.onPageChange(this.currentPage);
        }
    };

    switchToNextPage = (): void => {
        if (this.currentPage < this.lastPage) {
            this.currentPage = this.currentPage + 1;
            this.onPageChange(this.currentPage);
        }
    };
}

export default Pagination;
