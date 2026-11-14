customElements.define(
    "my-template",
    class extends HTMLElement {
        constructor() {
            super();

            // Using templates with web components
            
            let template = document.getElementById("my-template");
            let templateContent = template.content;

            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(document.importNode(templateContent, true));
        }
    },
);