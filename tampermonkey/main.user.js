
// ==UserScript==
// @name         mdn-language-changer
// @namespace    https://yinm.info/
// @version      0.1.0
// @description  Change MDN doc's languages (English <-> Japanese) by hotkeys.
// @author       yinm
// @match        https://developer.mozilla.org/*
// @grant        none
// ==/UserScript==

(() => {
  // node_modules/@github/hotkey/dist/index.js
  var Leaf = class {
    constructor(trie) {
      this.children = [];
      this.parent = trie;
    }
    delete(value) {
      const index = this.children.indexOf(value);
      if (index === -1)
        return false;
      this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
      if (this.children.length === 0) {
        this.parent.delete(this);
      }
      return true;
    }
    add(value) {
      this.children.push(value);
      return this;
    }
  };
  var RadixTrie = class {
    constructor(trie) {
      this.parent = null;
      this.children = {};
      this.parent = trie || null;
    }
    get(edge) {
      return this.children[edge];
    }
    insert(edges) {
      let currentNode = this;
      for (let i = 0; i < edges.length; i += 1) {
        const edge = edges[i];
        let nextNode = currentNode.get(edge);
        if (i === edges.length - 1) {
          if (nextNode instanceof RadixTrie) {
            currentNode.delete(nextNode);
            nextNode = null;
          }
          if (!nextNode) {
            nextNode = new Leaf(currentNode);
            currentNode.children[edge] = nextNode;
          }
          return nextNode;
        } else {
          if (nextNode instanceof Leaf)
            nextNode = null;
          if (!nextNode) {
            nextNode = new RadixTrie(currentNode);
            currentNode.children[edge] = nextNode;
          }
        }
        currentNode = nextNode;
      }
      return currentNode;
    }
    delete(node) {
      for (const edge in this.children) {
        const currentNode = this.children[edge];
        if (currentNode === node) {
          const success = delete this.children[edge];
          if (Object.keys(this.children).length === 0 && this.parent) {
            this.parent.delete(this);
          }
          return success;
        }
      }
      return false;
    }
  };
  function isFormField(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    const name = element.nodeName.toLowerCase();
    const type = (element.getAttribute("type") || "").toLowerCase();
    return name === "select" || name === "textarea" || name === "input" && type !== "submit" && type !== "reset" && type !== "checkbox" && type !== "radio" || element.isContentEditable;
  }
  function fireDeterminedAction(el) {
    if (isFormField(el)) {
      el.focus();
    } else {
      el.click();
    }
  }
  function expandHotkeyToEdges(hotkey3) {
    return hotkey3.split(",").map((edge) => edge.split(" "));
  }
  function hotkey(event) {
    return `${event.ctrlKey ? "Control+" : ""}${event.altKey ? "Alt+" : ""}${event.metaKey ? "Meta+" : ""}${event.shiftKey && event.key.toUpperCase() !== event.key ? "Shift+" : ""}${event.key}`;
  }
  var hotkeyRadixTrie = new RadixTrie();
  var elementsLeaves = new WeakMap();
  var currentTriePosition = hotkeyRadixTrie;
  var resetTriePositionTimer = null;
  function resetTriePosition() {
    resetTriePositionTimer = null;
    currentTriePosition = hotkeyRadixTrie;
  }
  function keyDownHandler(event) {
    if (event.defaultPrevented)
      return;
    if (event.target instanceof Node && isFormField(event.target))
      return;
    if (resetTriePositionTimer != null) {
      window.clearTimeout(resetTriePositionTimer);
    }
    resetTriePositionTimer = window.setTimeout(resetTriePosition, 1500);
    const newTriePosition = currentTriePosition.get(hotkey(event));
    if (!newTriePosition) {
      resetTriePosition();
      return;
    }
    currentTriePosition = newTriePosition;
    if (newTriePosition instanceof Leaf) {
      fireDeterminedAction(newTriePosition.children[newTriePosition.children.length - 1]);
      event.preventDefault();
      resetTriePosition();
      return;
    }
  }
  function install(element, hotkey3) {
    if (Object.keys(hotkeyRadixTrie.children).length === 0) {
      document.addEventListener("keydown", keyDownHandler);
    }
    const hotkeys = expandHotkeyToEdges(hotkey3 || element.getAttribute("data-hotkey") || "");
    const leaves = hotkeys.map((h) => hotkeyRadixTrie.insert(h).add(element));
    elementsLeaves.set(element, leaves);
  }

  // src/createSnackbar.ts
  function createSnackbar(languageNameInMdn) {
    const snackbar = document.createElement("div");
    snackbar.textContent = `${languageNameInMdn} is not found.`;
    snackbar.style.cssText = `
--heightValue: 3rem;

position: fixed;
bottom: 1rem;
left: 50%;
transform: translateX(-50%);
width: 30%;
height: var(--heightValue);
line-height: var(--heightValue);
text-align: center;
background-color: #333;
color: #fff;
box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 
  0 1px 18px 0 rgba(0, 0, 0, 0.12), 
  0 3px 5px -1px rgba(0, 0, 0, 0.2);
`;
    document.body.appendChild(snackbar);
    return snackbar;
  }

  // src/setKeybinding.ts
  function setKeybinding(languageCode, hotkey3, languageNameInMdn) {
    const linkElement = document.querySelector(`[lang="${languageCode}"] a`);
    if (linkElement) {
      install(linkElement, hotkey3);
    } else {
      const snackbar = createSnackbar(languageNameInMdn);
      setTimeout(() => {
        snackbar.style.display = "none";
      }, 5e3);
    }
  }

  // src/main.ts
  var languages = [
    {
      languageCode: "en-US",
      hotkey: "e n",
      languageNameInMdn: "English"
    },
    {
      languageCode: "ja",
      hotkey: "j a",
      languageNameInMdn: "\u65E5\u672C\u8A9E"
    }
  ];
  var currentLanguage = document.querySelector("#header-language-menu")?.textContent?.replace("\u25BC", "");
  languages.forEach(({languageCode, hotkey: hotkey3, languageNameInMdn}) => {
    if (currentLanguage !== languageNameInMdn) {
      setKeybinding(languageCode, hotkey3, languageNameInMdn);
    }
  });
})();
