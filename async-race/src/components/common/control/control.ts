class Control<NodeType extends HTMLElement = HTMLElement> {
    public node: NodeType;

    constructor(
        parentNode: HTMLElement | null = null,
        tagName: string = 'div',
        classNames: string[] = [],
        content: string = ''
    ) {
        const elem = document.createElement(tagName);
        if (classNames.length) {
            for (let i = 0; i < classNames.length; i++) {
                elem.classList.add(classNames[i]);
            }
        }
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
