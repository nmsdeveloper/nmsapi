/**
 * CAROUSEL API
 */
// class NMSCarousel {
//   /**
//    *
//    */
//   constructor(element, options = {}) {
//     this.element = element;
//     this.carousel = document.querySelector(`.${this.element}`);
//     this.carousel.setAttribute("tabindex", "0");
//     this.container = this.takeElement("nms--carousel__container");
//     this.items = [
//       ...document.querySelectorAll(`.${this.element} .nms--carousel__item`),
//     ];
//     this.options = Object.assign(
//       {},
//       {
//         itemToScroll: 1,
//         itemVisible: 1,
//         loop: false,
//         infinite: false,
//         responsives: {},
//       },
//       options,
//       {
//         autoplay: Object.assign(
//           {
//             active: false,
//             reverse: false,
//             time: 5,
//           },
//           options.autoplay
//         ),
//         animation: Object.assign(
//           {
//             type: "",
//             time: 0.5,
//           },
//           options.animation
//         ),
//         navigation: Object.assign(
//           {
//             prev: "",
//             next: "",
//           },
//           options.navigation
//         ),
//         pagination: Object.assign(
//           {
//             puces: "",
//             clickable: true,
//           },
//           options.pagination
//         ),
//       }
//     );
//     this.itemToScroll = this.options.itemToScroll;
//     this.itemVisible = this.options.itemVisible;
//     this.autoplay = this.options.autoplay;
//     this.animation = this.options.animation;
//     this.touchPlugin = {
//       startDrag: function startDrag(event) {
//         if (event.touches) {
//           if (event.touches.length > 1) {
//             return;
//           } else {
//             event = event.touches[0];
//           }
//         }
//         this.origin = { x: event.screenX };
//         this.width = this.containerWidth;
//       },

//       drag: function drag(event) {
//         if (this.origin) {
//           let point = event.touches ? event.touches[0] : event;
//           let translate = { x: point.screenX - this.origin.x };
//           let baseTranslate = (this.currentItem * -100) / this.items.length;
//           this.lastTranslate = translate;
//           this.setTranslate(baseTranslate + (100 * translate.x) / this.width);
//         }
//       },

//       endDrag: function endDrag() {
//         if (this.origin && this.lastTranslate) {
//           if (Math.abs(this.lastTranslate.x / this.nmscarouselWidth) > 0.2) {
//             if (this.lastTranslate.x < 0) {
//               this.next();
//             } else {
//               this.prev();
//             }
//           } else {
//             this.slideToItem(this.currentItem);
//           }
//         }
//         this.origin = null;
//       },
//     };

//     this.moveCallbacks = [];
//     this.lastIndexItem = this.items.length - this.getItemVisible;
//     this.currentItem = this.autoplay.reverse ? this.getLastIndexItem : 0;
//     this.offset = 0;

//     this.isWindowResize();
//     window.addEventListener("resize", this.isWindowResize.bind(this));
//   }

//   takeElement(className) {
//     return document.querySelector(`.${this.element} .${className}`);
//   }

//   isMatches() {
//     let devices = [];
//     Object.keys(this.options.responsives).forEach((resp) => {
//       devices.push({
//         media: window.matchMedia(`(max-width: ${resp}px)`),
//         device: resp,
//       });
//     });
//     return devices;
//   }

//   isWindowResize() {
//     document
//       .querySelectorAll(`.${this.element} .nms--carousel__pagination-puce`)
//       .forEach((el) => {
//         el.remove();
//       });

//     try {
//       for (let i = 0; i < this.isMatches().length; i++) {
//         if (this.isMatches()[i].media.matches) {
//           this.setItemToScroll(
//             this.options.responsives[this.isMatches()[i].device].itemToScroll
//           );
//           this.setItemVisible(
//             this.options.responsives[this.isMatches()[i].device].itemVisible
//           );

//           throw "break";
//         } else {
//           this.setItemToScroll(this.options.itemToScroll);
//           this.setItemVisible(this.options.itemVisible);
//         }
//       }
//     } catch (e) {
//       if (e !== "break") throw e;
//     }
//     this.setLastIndexItem(this.items.length - this.getItemVisible);

//     if (this.options.infinite) {
//       this.offset = this.getItemVisible * 2 - 1;
//       this.items = [
//         ...this.items
//           .slice(this.items.length - this.offset)
//           .map((item) => item.cloneNode(true)),
//         ...this.items,
//         ...this.items.slice(0, this.offset).map((item) => item.cloneNode(true)),
//       ];

//       this.slideToItem(this.offset, false);
//     }
//     this.items.forEach((item) => this.container.appendChild(item));

//     this.currentStyle();

//     if (this.options.navigation.prev !== "")
//       this.prevButton = this.takeElement(this.options.navigation.prev);
//     if (this.options.navigation.next !== "")
//       this.nextButton = this.takeElement(this.options.navigation.next);

//     this.navigations();
//     this.navigationsKey();
//     this.navigationsTouchPlugin(this);

//     if (this.options.pagination.puces !== "")
//       this.pagination = this.takeElement(this.options.pagination.puces);

//     this.paginations();

//     this.moveCallbacks.forEach((callback) => callback(this.currentItem));

//     if (this.options.infinite)
//       this.container.ontransitionend = this.resetInfinite.bind(this);
//   }

//   currentStyle() {
//     this.ratio = this.items.length / this.getItemVisible;
//     this.container.style.width = `${this.ratio * 100}%`;

//     this.items.forEach((item) => {
//       item.style.width = `${100 / this.getItemVisible / this.ratio}%`;
//     });
//   }

//   navigations() {
//     if (this.autoplay.active) this.startAutoplay();

//     if (this.prevButton) this.prevButton.onclick = this.prev.bind(this);
//     if (this.nextButton) this.nextButton.onclick = this.next.bind(this);

//     if (this.options.loop || this.options.infinite) return;
//     this.onMove((index) => {
//       if (this.prevButton)
//         if (index === 0)
//           this.prevButton.classList.add("nms--carousel__navigation-hidden");
//         else
//           this.prevButton.classList.remove("nms--carousel__navigation-hidden");

//       if (this.nextButton)
//         if (index === this.getLastIndexItem)
//           this.nextButton.classList.add("nms--carousel__navigation-hidden");
//         else
//           this.nextButton.classList.remove("nms--carousel__navigation-hidden");
//     });
//   }

//   startAutoplay() {
//     if (this.autoplay.reverse) this.prev();
//     else this.next();

//     if (
//       !this.options.loop &&
//       (this.currentItem === this.getLastIndexItem || this.currentItem === 0)
//     )
//       return;
//     else
//       window.setTimeout(() => {
//         this.navigations();
//       }, this.autoplay.time * 1000);
//   }

//   navigationsKey() {
//     this.carousel.onkeyup = (event) => {
//       if (event.key === "ArrowRight" || event.key === "Right") this.next();
//       else if (event.key === "ArrowLeft" || event.key === "Left") this.prev();
//     };
//   }

//   navigationsTouchPlugin() {
//     this.container.onmousedown = this.touchPlugin.startDrag.bind(this);

//     window.onmousemove = this.touchPlugin.drag.bind(this);
//     window.onmouseup = this.touchPlugin.endDrag.bind(this);

//     this.container.ontouchstart = this.touchPlugin.startDrag.bind(this);

//     window.ontouchmove = this.touchPlugin.drag.bind(this);
//     window.ontouchend = this.touchPlugin.endDrag.bind(this);
//     window.ontouchcancel = this.touchPlugin.endDrag.bind(this);
//   }

//   resetInfinite() {
//     if (this.currentItem <= this.getItemToScroll)
//       this.slideToItem(
//         this.currentItem + (this.items.length - 2 * this.offset),
//         false
//       );
//     else if (this.currentItem >= this.items.length - this.offset)
//       this.slideToItem(
//         this.currentItem - (this.items.length - 2 * this.offset),
//         false
//       );
//   }

//   prev() {
//     let index = this.currentItem - this.getItemToScroll;
//     if (this.currentItem === 0) index = this.getLastIndexItem;
//     else if (this.items[index] === undefined) index = 0;

//     if (this.currentItem === 0 && !this.options.loop) return;
//     else this.slideToItem(index);
//   }

//   next() {
//     let index = this.currentItem + this.getItemToScroll;
//     if (this.currentItem === this.getLastIndexItem) {
//       index = 0;
//     } else if (this.items[index + this.getItemVisible - 1] === undefined)
//       index = this.getLastIndexItem;

//     if (this.currentItem === this.getLastIndexItem && !this.options.loop)
//       return;
//     else this.slideToItem(index);
//   }

//   slideToItem(index, animation = true) {
//     let translateX = (index * -100) / this.items.length;

//     if (!animation) this.disableTransition();
//     this.animations(index);
//     this.setTranslate(translateX);
//     this.container.offsetHeight;
//     if (!animation) this.enableTransition();

//     this.currentItem = index;

//     this.moveCallbacks.forEach((callback) => callback(this.currentItem));
//   }

//   enableTransition() {
//     return (this.container.style.transform = "");
//   }
//   disableTransition() {
//     return (this.container.style.transform = "none");
//   }

//   paginations() {
//     if (this.pagination) {
//       let puces = [];
//       for (let i = 0; i <= this.pucesLength()[0]; i++) {
//         var createElement = document.createElement("div");
//         createElement.classList.add("nms--carousel__pagination-puce");
//         let puce = createElement;

//         this.pagination.appendChild(puce);
//         puces.push(puce);
//       }

//       if (this.options.pagination.clickable && !this.options.infinite)
//         puces.forEach((puce, i) => {
//           puce.onclick = () => this.slideToItem(this.pucesLength()[1][i]);
//         });

//       this.onMove((index) => {
//         let count = this.items.length - 2 * this.offset;

//         let activePuce =
//           puces[
//             Math.ceil(((index - this.offset) % count) / this.getItemToScroll)
//           ];
//         if (activePuce) {
//           puces.forEach((puce) =>
//             puce.classList.remove("nms--carousel__pagination-puce-active")
//           );
//           activePuce.classList.add("nms--carousel__pagination-puce-active");
//         }
//       });
//     }
//   }

//   pucesLength() {
//     let puceAndIndex = [0];
//     let l = 0;
//     let i = this.getItemToScroll;
//     while (true) {
//       l = i + this.getItemVisible === this.items.length ? l : l + 1;

//       if (this.items[i + this.getItemVisible - 1] === undefined) {
//         puceAndIndex.push(this.getLastIndexItem);
//         if (this.options.infinite)
//           return [Math.ceil((l + 1) / 2), puceAndIndex];
//         else return [l, puceAndIndex];
//       }
//       puceAndIndex.push(i);
//       i += this.getItemToScroll;
//     }
//   }

//   onMove(callback) {
//     this.moveCallbacks.push(callback);
//   }

//   animations(index) {
//     if (this.animation.type === "fade") this.fade(index);
//   }

//   fade(index) {
//     for (let item = index; item < index + this.getItemVisible; item++) {
//       this.items[item].style.animation = `fade ${this.animation.time}s linear`;
//     }
//     window.setTimeout(() => {
//       if (this.animation.type === "fade") {
//         for (let item = index; item < index + this.getItemVisible; item++) {
//           this.items[item].style.animation = "";
//         }
//       }
//     }, this.animation.time * 1000);
//   }

//   get nmscarouselWidth() {
//     return this.carousel.offsetWidth;
//   }
//   get containerWidth() {
//     return this.container.offsetWidth;
//   }
//   get getItemVisible() {
//     return this.itemVisible;
//   }
//   get getItemToScroll() {
//     return this.itemToScroll;
//   }
//   get getLastIndexItem() {
//     return this.lastIndexItem;
//   }

//   setTranslate(percent) {
//     this.container.style.transform = `translate3d(${percent}%, 0, 0)`;
//   }
//   setItemVisible(visible) {
//     this.itemVisible = visible;
//   }
//   setItemToScroll(scroll) {
//     this.itemToScroll = scroll;
//   }
//   setLastIndexItem(last) {
//     this.lastIndexItem = last;
//   }
// }

/**
 * TYPOGRAPHY API
 */
// class NMSTypography {
//   constructor(element) {
//     this.element = element;
//   }

//   text3d(options = {}) {
//     const option = Object.assign(
//       {},
//       {
//         isometric: 15,
//         color: "#2d2d2d",
//         shadow: "#5d5d5d",
//       },
//       options
//     );

//     let obj = document.getElementById(this.element),
//       shadow = "";

//     for (let i = 0; i < option.isometric; i++) {
//       shadow += `${shadow ? "," : ""} ${-i * 1}px ${i * 1}px 0 ${
//         option.shadow
//       }`;
//     }

//     obj.style = `
//       position: relative;
//       color: ${option.color};
//       font-size: 3rem;
//       font-weight: bold;
//       font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
//       text-shadow: ${shadow};
//       letter-spacing: 1rem;
//       transform: rotate(-25deg) skew(25deg);
//     `;

//     obj.style.setProperty(
//       "::before",
//       `
//       content: ${obj.textContent};
//       position: absolute;
//       top: 2rem;
//       left: -2rem;
//       color: rgba(0, 0, 0, 0.3);
//       `
//     );
//   }

//   textjump(text = "Empty", options = {}) {
//     const option = Object.assign(
//       {},
//       {
//         startY: 0,
//         endY: -3,
//         duration: 2,
//         infinite: true,
//         onHover: true,
//       },
//       options
//     );
//     const cssAnimation = document.createElement("style"),
//       element = document.getElementById(this.element),
//       iteration = option.infinite ? "infinite" : "forwards",
//       state = option.onHover ? "paused" : "running";

//     var rules = document.createTextNode(`
//       @keyframes jumping {
//           0%, 40%, 100% {
//             transform: translateY(${option.startY});
//           }
//           20% {
//             transform: translateY(${option.endY}rem);
//           }
//         }
//       `);

//     cssAnimation.appendChild(rules);
//     document.getElementsByTagName("head")[0].appendChild(cssAnimation);

//     for (let i = 0; i < text.length; i++)
//       element.innerHTML += `
//         <pre class="jump">${text.charAt(i)}</pre>
//        `;

//     const obj = document.querySelectorAll(".jump");
//     style(state);

//     if (option.onHover) {
//       element.onmousemove = () => {
//         style("running");
//       };
//       element.onmouseout = () => {
//         style("paused");
//       };
//     }

//     function style(state) {
//       obj.forEach((el, i) => {
//         el.style = `
//           position: relative;
//           display: inline-block;
//           color: #2d2d2d;
//           font-size: 2rem;
//           font-weight: bold;
//           cursor: pointer;
//           font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
//           letter-spacing: 0.25rem;
//           animation: jumping ${option.duration}s ease-in-out ${iteration};
//           animation-delay: ${0.1 * i + 1}s;
//           animation-play-state: ${state};
//         `;
//       });
//     }
//   }
// }

/**
 * LOADER API
 */
class NMSLoader {
  constructor(element, options = {}) {
    this.element = element;
  }
}
