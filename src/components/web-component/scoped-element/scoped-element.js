// 1. Create a scoped custom element registry
const myRegistry = new CustomElementRegistry();

// 2. Define the complete class for <scoped-element>
class ScopedElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Encapsulate content and styles inside the element's own shadow DOM

        // Note: The Inner Shadow Root belongs to the <scoped-element> itself
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 16px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    background-color: #f8fafc;
                    font-family: system-ui, sans-serif;
                }
                h2 {
                    color: #0f172a;
                    margin: 0 0 8px 0;
                    font-size: 1.25rem;
                }
                p {
                    color: #475569;
                    margin: 0;
                }
            </style>
            <div>
                <h2>Scoped Component</h2>
                <p>Hello! This &lt;scoped-element&gt; is registered via a custom, isolated registry.</p>
            </div>
        `;
    }
}

// 3. Register the element to your scoped registry instead of window.customElements
myRegistry.define("scoped-element", ScopedElement);

// 4. Create the host element and attach it to the document body
const host = document.createElement("div");
document.body.appendChild(host);

// 5. Attach a shadow root linked to your scoped registry

// Note: This outer shadow root is attached to a regular div container. By passing 
// customElementRegistry: myRegistry, you are telling the browser: "Any custom element
// rendered inside this shadow boundary should look up its definition in myRegistry 
// instead of the global window.customElements."

const shadow = host.attachShadow({
    mode: "open",
    customElementRegistry: myRegistry,
});

// 6. Inject the element; the browser will automatically resolve and upgrade it using 
//    myRegistry
shadow.innerHTML = "<scoped-element></scoped-element>";

/*
 * You can also associate a scoped registry after the shadow root has been created by 
 * calling initialize()
 * 
 *     const shadow = host.attachShadow({
 *        mode: "open",
 *        customElementRegistry: null, // no registry yet
 *     });
 *     shadow.innerHTML = "<my-element></my-element>";
 *
 *     // Later, associate the scoped registry and upgrade elements
 *     myRegistry.initialize(shadow);
 */

