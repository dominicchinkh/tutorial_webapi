class IndexedDB extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.db = null;
    }

    connectedCallback() {
        this.render();
        this.initDB();
        this.setupEvents();
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
                    max-width: 450px;
                    margin-bottom: 16px;
                }
                h3 { margin-top: 0; color: #0f172a; }
                label { display: block; margin-bottom: 4px; color: #475569; font-size: 0.9rem; }
                input {
                    padding: 6px 10px;
                    font-size: 1rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 4px;
                    margin-bottom: 10px;
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
                button:hover { background-color: #1d4ed8; }
                ul { padding-left: 20px; color: #334155; margin-bottom: 0; }
                #status { font-weight: 500; color: #16a34a; margin-top: 8px; font-size: 0.9rem; }
            </style>
            <div>
                <label for="task-input">Task Title:</label>
                <input type="text" id="task-input" placeholder="e.g., Learn IndexedDB" />
                <label for="hours-input">Hours:</label>
                <input type="number" id="hours-input" placeholder="e.g., 2" />
                <br>
                <button id="add-btn">Add Task</button>
                <p id="status"></p>
                <h4>Stored Tasks:</h4>
                <ul id="task-list"></ul>
            </div>
        `;
    }

    initDB() {
        // 1. Open (or create) the database with version 1
        const request = indexedDB.open('toDoDatabase', 1);

        request.onerror = (event) => {
            this.shadowRoot.getElementById('status').textContent = 'Database error: ' + event.target.error;
        };

        request.onsuccess = (event) => {

            // IDBDatabase
            this.db = event.target.result;

            this.shadowRoot.getElementById('status').textContent = 'Database connected successfully!';
            this.loadTasks();
        };

        // 2. onupgradeneeded is the only place to structure/alter database schemas

        // If the database doesn't already exist: 
        //   It is created by the open operation, then an onupgradeneeded event is 
        //   triggered and you create the database schema in the handler for this event

        // If the database does exist but you are specifying an upgraded version number:
        //   An onupgradeneeded event is triggered straight away, allowing you to provide
        //   an updated schema in its handler

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create an object store named "toDoList" with keyPath "taskTitle"
            const objectStore = db.createObjectStore('toDoList', { keyPath: 'taskTitle' });

            // Create an index to search or filter by hours
            objectStore.createIndex('hours', 'hours', { unique: false });

            // If the onupgradeneeded event exits successfully, the onsuccess handler 
            // of the open database request will then be triggered
        };
    }

    setupEvents() {
        const addBtn = this.shadowRoot.getElementById('add-btn');

        addBtn.addEventListener('click', () => {
            const taskTitle = this.shadowRoot.getElementById('task-input').value.trim();
            const hours = Number(this.shadowRoot.getElementById('hours-input').value);

            if (!taskTitle) {
                return;
            }

            const newItem = { taskTitle, hours };

            // 3. Open a readwrite transaction to add data
            const transaction = this.db.transaction(['toDoList'], 'readwrite');
            const objectStore = transaction.objectStore('toDoList');
            const request = objectStore.add(newItem);

            request.onsuccess = () => {
                this.shadowRoot.getElementById('task-input').value = '';
                this.shadowRoot.getElementById('hours-input').value = '';
                this.shadowRoot.getElementById('status').textContent = `Task "${taskTitle}" added!`;
                this.loadTasks();
            };

            request.onerror = (event) => {
                this.shadowRoot.getElementById('status').textContent = 'Error adding task (Duplicate?): ' + event.target.error;
            };
        });
    }

    loadTasks() {
        const taskList = this.shadowRoot.getElementById('task-list');
        taskList.innerHTML = '';

        if (!this.db) {
            return;
        }

        // 4. Read data using a read-only transaction and a cursor
        const transaction = this.db.transaction(['toDoList'], 'readonly');
        const objectStore = transaction.objectStore('toDoList');

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                const li = document.createElement('li');
                li.textContent = `${cursor.value.taskTitle} — ${cursor.value.hours} hour(s)`;
                taskList.appendChild(li);
                cursor.continue();
            }
        };
    }
}

customElements.define('indexed-db', IndexedDB);
