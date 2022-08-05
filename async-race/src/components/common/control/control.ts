class Control<NodeType extends HTMLElement = HTMLElement> {
    public node: NodeType;

    constructor(parentNode: HTMLElement | null, tagName = 'div', className = '', content = '') {
        const elem = document.createElement(tagName);
        elem.className = className;
        elem.textContent = content;
        if (parentNode) {
            parentNode.append(elem);
        }
        this.node = elem as NodeType;
    }

    destroy(): void {
        this.node.remove();
    }

    showNode(): void {
        this.node.classList.remove('hidden');
    }

    hideNode(): void {
        this.node.classList.add('hidden');
    }
}

export default Control;
