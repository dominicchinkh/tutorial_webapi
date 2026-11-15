class UpdateStyle extends HTMLElement {
    static observedAttributes = ["size"];

    constructor() {
        super();
        this._internals = this.attachInternals();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        shadow.innerHTML = `
            <style></style>
            <span>Hello from inside my Autonomous Custom Element!</span>
        `;

        // Call updateStyle right away to apply initial styles based on attributes
        this.updateStyle();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
        
        // Automatically call updateStyle whenever an observed attribute changes
        if (name === "size") {
            this.updateStyle();
        }
    }

    updateStyle() {
        const shadow = this.shadowRoot;
        
        if (!shadow) {
            return;
        }

        // Read the current 'size' attribute to determine styles dynamically
        const size = this.getAttribute("size");
        let padding = "8px"; // default
        
        if (size === "large") {
            padding = "16px";
        } 
        else if (size === "small") {
            padding = "4px";
        }

        // Apply the dynamic styles to the shadow DOM's <style> tag
        shadow.querySelector("style").textContent = `
            span {
                color: #0076ff;
                font-weight: bold;
                padding: ${padding};
                border: 1px solid #0076ff;
                border-radius: 4px;
                display: inline-block;
            }
            span:state(hidden) {
                border: none;
            }
        `;
    }
}

customElements.define('update-style', UpdateStyle);
