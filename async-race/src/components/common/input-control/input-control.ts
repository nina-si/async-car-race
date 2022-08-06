import Control from '../control';

class InputControl extends Control {
    constructor(type: string, parentNode?: HTMLElement, classNames?: string[], id?: string) {
        super(parentNode, 'input', classNames);
        (this.node as HTMLInputElement).type = type;
        if (id) this.node.id = id;
    }
}

export default InputControl;
