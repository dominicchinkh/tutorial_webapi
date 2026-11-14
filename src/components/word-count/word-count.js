class WordCount extends HTMLParagraphElement {
    constructor() {
        super();
    }
  // Element functionality written in here
}

customElements.define("word-count", WordCount, { extends: "p" });
