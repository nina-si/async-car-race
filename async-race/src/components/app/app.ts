import Page from '../page';

const rootElement = document.querySelector('#root') as HTMLElement;

class App {
    page: Page;

    constructor() {
        this.page = new Page();
    }

    start() {
        rootElement.append(this.page.node);
    }
}

export default App;
