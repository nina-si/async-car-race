import { TCar } from '../../types';
import Page from '../page';

const rootElement = document.querySelector('#root') as HTMLElement;

class App {
    page!: Page;
    cars: TCar[];
    constructor() {
        this.cars = [];
    }

    start() {
        this.page = new Page(rootElement);
    }
}

export default App;
