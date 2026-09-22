const { JSDOM } = require("jsdom");

// 1. Create a simulated DOM environment
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <body>
      <div id="observed-container"></div>
    </body>
  </html>
`);

// Extract the required DOM globals from the jsdom window instance
const { document, MutationObserver } = dom.window;

// 2. Select the target DOM element to watch
const targetNode = document.getElementById("observed-container");

// 3. Define what changes to listen for
const config = {
  childList: true,     // Detect adding or removing child elements
  attributes: true,    // Detect attribute modifications (e.g., class, style, id)
  characterData: true, // Detect changes to text node contents
  subtree: true        // Watch target node AND all of its descendants
};

// 4. Callback function executed whenever mutations occur
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      console.log("Child node change detected:");
      mutation.addedNodes.forEach(node => console.log("  Added:", node.outerHTML || node.textContent));
      mutation.removedNodes.forEach(node => console.log("  Removed:", node.outerHTML || node.textContent));

    } else if (mutation.type === "attributes") {
      console.log(`Attribute changed: '${mutation.attributeName}' was modified.`);

    } else if (mutation.type === "characterData") {
      console.log("Text content inside the element changed.");
      
    }
  }
};

// 5. Create an observer instance and attach the callback
const observer = new MutationObserver(callback);

// 6. Start observing the target element with the configuration options
observer.observe(targetNode, config);

// --- Testing the Observer ---

// Add a child node (Triggers 'childList')
const newElement = document.createElement("p");
newElement.textContent = "Hello, MutationObserver!";
targetNode.appendChild(newElement);

// Change an attribute (Triggers 'attributes')
targetNode.setAttribute("data-status", "active");

// Stop watching when finished
// observer.disconnect();
