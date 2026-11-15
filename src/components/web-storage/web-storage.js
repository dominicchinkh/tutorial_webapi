class WebStorageDemo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        /*
         * How to Test the storage Event:
         * 
         * 1. Run your dev server (npm start) and open http://localhost:3000 in two 
         *    separate browser windows (or side-by-side tabs)
         * 
         * 2. Type a name and click Save in the first tab
         *
         * 3. Look at the second tab: the input field and welcome message will 
         *    automatically update to reflect the new data via the storage event 
         *    listener
         */

        // Bind the storage event handler so it can be referenced for cleanup
        this.handleStorageEvent = (event) => {

            console.log(event);
            
            if (event.key === 'username') {
                const nameInput  = this.shadowRoot.getElementById('name-input');
                const welcomeMsg = this.shadowRoot.getElementById('welcome-message');

                if (event.newValue) {
                    nameInput.value = event.newValue;
                    welcomeMsg.textContent = `Synced from another tab: Hello, ${event.newValue}!`;
                } else {
                    nameInput.value = '';
                    welcomeMsg.textContent = 'Storage cleared from another tab!';
                }
            }
        };
    }

    connectedCallback() {
        this.render();
        this.setupStorageLogic();

        // Listen for localStorage changes from other tabs/windows
        window.addEventListener('storage', this.handleStorageEvent);
    }

    disconnectedCallback() {
        // Clean up the event listener when the component is removed from the page
        window.removeEventListener('storage', this.handleStorageEvent);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 16px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    background-color: #f8fafc;
                    font-family: system-ui, sans-serif;
                    max-width: 400px;
                    margin-bottom: 16px;
                }
                h3 {
                    margin-top: 0;
                    color: #0f172a;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    color: #475569;
                }
                input {
                    padding: 6px 10px;
                    font-size: 1rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    width: calc(100% - 22px);
                }
                button {
                    background-color: #2563eb;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #1d4ed8;
                }
                #clear-btn {
                    background-color: #dc2626;
                    margin-left: 8px;
                }
                #clear-btn:hover {
                    background-color: #b91c1c;
                }
                #welcome-message {
                    font-weight: 500;
                    color: #16a34a;
                    margin-top: 12px;
                }
            </style>
            <div>
                <h3>Web Storage API Demo</h3>
                <label for="name-input">Enter your name:</label>
                <input type="text" id="name-input" placeholder="e.g., Jane Doe" />
                <br>
                <button id="save-btn">Save</button>
                <button id="clear-btn">Clear Storage</button>
                <p id="welcome-message"></p>
            </div>
        `;
    }

    setupStorageLogic() {

        if(!this.storageAvailable("sessionStorage")) {
            console.log("Session storage is not available");
        }
        else {
            console.log("Session storage is available");
        }

        if(!this.storageAvailable("localStorage")) {
            console.log("Local storage is not available");
        }
        else {
            console.log("Local storage is available");
        }

        const nameInput  = this.shadowRoot.getElementById('name-input');
        const saveBtn    = this.shadowRoot.getElementById('save-btn');
        const clearBtn   = this.shadowRoot.getElementById('clear-btn');
        const welcomeMsg = this.shadowRoot.getElementById('welcome-message');

        // 1. Retrieve data from localStorage on load (getItem)
        const savedName = localStorage.getItem('username');
        if (savedName) {
            nameInput.value = savedName;
            welcomeMsg.textContent = `Welcome back, ${savedName}! (Loaded from localStorage)`;
        }

        // 2. Save data to localStorage on button click (setItem)
        saveBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (name) {

                // Note: Storage only supports storing and retrieving strings. If you 
                // want to save other data types, you have to convert them to strings. 
                // For plain objects and arrays, you can use JSON.stringify()

                localStorage.setItem('username', name);
                welcomeMsg.textContent = `Hello, ${name}! Saved to localStorage successfully.`;
            }
        });

        // 3. Remove data from localStorage on button click (removeItem)
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('username');
            nameInput.value = '';
            welcomeMsg.textContent = 'Storage cleared for "username". Refresh to test.';
        });
    }

    storageAvailable(type) {
        let storage;

        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;

        } catch (e) {
            return (
                e instanceof DOMException &&
                e.name === "QuotaExceededError" &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            );
        }
    }
}

customElements.define('web-storage-demo', WebStorageDemo);
