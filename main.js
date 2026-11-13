// A custom element is implemented as a class which extends HTMLElement
class WordCount extends HTMLElement {
    constructor() {
        super();

        /*
         * Shadow DOM enables you to attach a DOM tree to an element, and have the 
         * internals of this tree hidden from JavaScript and CSS running in the page
         * 
         *   - Shadow host: The regular DOM node that the shadow DOM is attached to
         *   - Shadow tree: The DOM tree inside the shadow DOM
         *   - Shadow boundary: the place where the shadow DOM ends, and the regular 
         *     DOM begins
         *   - Shadow root: The root node of the shadow tree
         * 
         * You can affect the nodes in the shadow DOM in exactly the same way as 
         * non-shadow nodes. The difference is that none of the code inside a shadow DOM
         * can affect anything outside it
         * 
         */

        // Create a Shadow DOM root
        const shadow = this.attachShadow({ mode: 'open' });

        // Create container and styles
        const text = document.createElement('span');
        text.textContent = 'Hello from inside my Custom Element!';

        const style = document.createElement('style');
        style.textContent = `
            span {
                color: #0076ff;
                font-weight: bold;
                padding: 8px;
                border: 1px solid #0076ff;
                border-radius: 4px;
            }
        `;

        // Attach to Shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(text);
    }
}

// Register the element with the browser
// Note: Custom element names MUST contain a hyphen (-)
customElements.define('word-count', WordCount);
