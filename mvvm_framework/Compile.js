class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;

        if (this.el) {
            let fragment = this.node2fragment(this.el);

            this.comile(fragment);
            this.el.appendChild(fragment);
        }
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }

    isDirective(name) {
        return name.includes('v-');
    }

    node2fragment(el) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment;
    }

    compile(fragment) {
        let childNodes = fragment.childNodes;

        Array.from(childNodes).forEach(node => {
            if (this.isElementNode(node)) {
                this.compile(node);
                this.compileElement(node);
            } else {
                this.compileText(node);
            }
        });
    }

    compileElement(node) {
        let attrs = node.attributes;
        Array.form(attrs).forEach(attr => {
            let attrName = attr.name;

            if (this.isDirective(attrName)) {
                let exp = attr.value;

                let [, type] = attrName.split('-');
                CompileUtil[type](node, this.vm, exp);
            }
        });
    }

    compileText(node) {
        let exp = node.contentText;
        let reg = /\{\{([^}+])\}\}/g;

        if (reg.test(exp)) {
            CompileUtil['text'](node, this.vm, exp);
        }
    }
}