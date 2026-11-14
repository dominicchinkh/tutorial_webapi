// Even though the HTML parser builds the shadow root automatically, you still need 
// a JavaScript class definition to upgrade the custom element so the browser recognizes
// the tag name and allows you to attach behavior (like event listeners)

class DeclarativeCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Because the shadow root was created declaratively, 
        // we can access it immediately via this.shadowRoot
        const shadow = this.shadowRoot;
        
        if (shadow) {
            const button = shadow.querySelector('#alert-btn');
            if (button) {
                button.addEventListener('click', () => {
                    alert('Hello from inside the Declarative Shadow DOM!');
                });
            }
        }
    }
}

// Register the custom element tag globally
customElements.define('declarative-card', DeclarativeCard);