class CustomizedBuiltin extends HTMLParagraphElement {
    constructor() {
        super();
    }
  // Element functionality written in here
}

customElements.define("customized-builtin", CustomizedBuiltin, { extends: "p" });
