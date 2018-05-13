String.prototype.html = function() {
  let parser = new DOMParser();
  let doc = parser.parseFromString(this, "text/html");
  return doc.body.firstChild;
};

const elementStyle = (width, height) => `
                    #gallery-container {
                        max-width: ${width};
                        margin: 20px auto;
                        border: #fff solid 3px;
                        background: #fff;
                    }
                    #main-img img {
                        width: 100%;
                        cursor:default;
                        transition:0.3s ease;
                        z-index:1;
                        opacity:1;
                    }
                    #imgs{
                      margin-top:20px;
                      display: grid;
                      grid-template-columns: repeat(4, 1fr);
                      grid-gap: 3px;
                    }
                    #imgs img {
                      width: 100%;
                      cursor:pointer;
                      max-height: ${height};
                      transition: 0.3s ease;
                    }

                    #imgs img:hover {
                      transition: 0.2s ease;
                      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.6);
                    }

                    .fade-in {
                        opacity:0.3!important;
                        transition:0.3s ease;
                        z-index:1;
                    }
                `;

class Image_gallery extends HTMLElement {
  constructor() {
    super();
    this.dom = this.attachShadow({ mode: "open" });
  }

  switchImage(src) {
    const display_img = this.dom.querySelector("#main-img").children[0];
    display_img.classList.add("fade-in");
    display_img.src = src;
    setTimeout(() => display_img.classList.remove("fade-in"), 300);
  }

  addStyle(sheet) {
    const style = document.createElement("style");
    style.type = `text/css`;
    style.appendChild(document.createTextNode(sheet));
    this.dom.appendChild(style);
  }

  connectedCallback() {
    const clone = this.getAttribute("clone") || false;
    const width = this.getAttribute("width") || "40vw";
    const height = this.getAttribute("height") || "30vh";
    const container = `<div id="gallery-container">
                          <div id="main-img">
                          </div>
                          <div id="imgs">
                           </div>
                       </div>`.html();
    this.addStyle(elementStyle(width, height));
    this.dom.appendChild(container);
    const images_list = this.dom.querySelector("#imgs");
    const display_img = this.dom.querySelector("#main-img");
    const images = this.querySelectorAll("img");

    images.forEach(img => {
      img.onclick = this.switchImage.bind(this, img.src);
      images_list.appendChild(img);
      if (clone) this.appendChild(img.cloneNode(true));
    });
    display_img.appendChild(images[0].cloneNode(true));
  }
}

customElements.define("image-gallery", Image_gallery);
