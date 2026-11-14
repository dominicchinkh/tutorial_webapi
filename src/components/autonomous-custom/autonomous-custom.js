// A custom element is implemented as a class which extends HTMLElement
class AutonomousCustom extends HTMLElement {

    // An array containing the names of all attributes for which the element needs
    // change notifications
    static observedAttributes = ["size"];

    constructor() {

        // Set up initial state and default values, register event listeners and  
        // perhaps create a shadow root. At this point, you should not inspect the 
        //  element's attributes or children, or add new attributes or children

        super();

        // The collapsed state is represented as a boolean property (with setter and 
        // getter methods) that is not visible outside of the element. To make this 
        // state selectable in CSS the custom element:
        this._internals = this.attachInternals();

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
        //   mode: 'open' means that the Shadow DOM can be accessed from outside the
        //   component using JavaScript via the element's .shadowRoot property
        const shadow = this.attachShadow({ mode: 'open' });

        // Create container and styles
        const text = document.createElement('span');
        text.textContent = 'Hello from inside my Autonomous Custom Element!';

        const style = document.createElement('style');

        // Autonomous custom elements (but not elements based on built-in elements) 
        // also allow you to define states and select against them using the :state() 
        // pseudo-class function
        
        style.textContent = `
            span {
                color: #0076ff;
                font-weight: bold;
                padding: 8px;
                border: 1px solid #0076ff;
                border-radius: 4px;
            }
            span:state(hidden) {
                border: none;
            }
        `;

        // Attach to Shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(text);
    }

    connectedCallback() {
        // Called each time the element is added to the document

        console.log("Custom element added to page.");
    }

    disconnectedCallback() {
        // Called each time the element is removed from the document

        console.log("Custom element removed from page.");
    }

    connectedMoveCallback() {
        // When defined, this is called instead of connectedCallback() and 
        // disconnectedCallback() each time the element is moved to a different 
        // place in the DOM via Element.moveBefore()

        console.log("Custom element moved with moveBefore()");
    }

    adoptedCallback() {
        // Called each time the element is moved to a new document

        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Called when attributes are changed, added, removed, or replaced
        
        console.log(
            `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
        );
    }

    //-----------------------------------------------------------
    // Custom states and custom state pseudo-class CSS selectors

    get collapsed() {
        return this._internals.states.has("hidden");
    }

    set collapsed(flag) {
        if (flag) {
            // Existence of identifier corresponds to "true"
            this._internals.states.add("hidden");
        } else {
            // Absence of identifier corresponds to "false"
            this._internals.states.delete("hidden");
        }
    }
}

// Register the element with the browser
// Note: Custom element names MUST contain a hyphen (-)
customElements.define('autonomous-custom', AutonomousCustom);
