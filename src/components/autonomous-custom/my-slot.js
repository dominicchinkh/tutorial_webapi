customElements.define('my-slot',
    class extends HTMLElement {
        constructor() {
            super();

            const template = document.getElementById('my-slot-paragraph');
            const templateContent = template.content;

            this.attachShadow({ mode: 'open' }).appendChild(
                templateContent.cloneNode(true)
            );
        }
    }
);
