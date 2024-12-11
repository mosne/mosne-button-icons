/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ToolbarInlineIcon.js":
/*!**********************************!*\
  !*** ./src/ToolbarInlineIcon.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _shapes_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shapes.js */ "./src/shapes.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * WP Core Dependencies
 */







/**
 * Project Dependencies
 */


const mosneIconFormatName = 'mosne/inline-icon';
const mosneIconEdit = ({
  isActive,
  activeAttributes,
  value,
  onChange,
  contentRef
}) => {
  var _window$mosneButtonIc;
  const [mosneIconText, setmosneIconText] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [iconWidth, setIconWidth] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [iconHeight, setIconHeight] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [currentIcon, setCurrentIcon] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [showPopover, setShowPopover] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [typingInProgress, setTypingInProgress] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const anchorRef = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.useAnchor)({
    editableContentElement: contentRef.current
  });
  const toolbarButtonOnClick = () => {
    if (!isActive) {
      setShowPopover(true);
    } else {
      setShowPopover(false);
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.removeFormat)(value, mosneIconFormatName));
    }
  };
  const saveMosneIconText = () => {
    if (currentIcon) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.applyFormat)(value, {
        type: mosneIconFormatName,
        attributes: {
          "data-icon": currentIcon,
          width: iconWidth || "1em",
          height: iconHeight || "1em",
          "aria-hidden": "true"
        },
        content: "="
      }));
    } else {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.removeFormat)(value, mosneIconFormatName));
    }
    setShowPopover(false);
  };
  const removeMosneIcon = () => {
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.removeFormat)(value, mosneIconFormatName));
    setShowPopover(false);
  };
  if (isActive && !showPopover && !typingInProgress) {
    setTypingInProgress(false);
    setShowPopover(true);
  }
  if (!isActive && !typingInProgress && showPopover && mosneIconText) {
    setShowPopover(false);
  }
  if (mosneIconText !== activeAttributes.mosneIconText && !typingInProgress) {
    setmosneIconText(activeAttributes.mosneIconText);
  }
  const ICONS = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.applyFilters)('mosne-button-icons.icons', (_window$mosneButtonIc = window.mosneButtonIcons.data) !== null && _window$mosneButtonIc !== void 0 ? _window$mosneButtonIc : [], mosneIconFormatName);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarGroup, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
        icon: _shapes_js__WEBPACK_IMPORTED_MODULE_6__["default"],
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Inline Icon', 'mosne-button-icons'),
        isActive: isActive,
        onClick: toolbarButtonOnClick
      }), showPopover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Popover, {
        anchor: anchorRef,
        className: "mosne-icon-popover",
        onClose: () => setShowPopover(false),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "mosne-button-icons__picker",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalGrid, {
            className: "block-editor-block-styles__variants",
            columns: "6",
            gap: "4",
            children: ICONS.map((icon, index) => {
              var _icon$icon;
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                label: icon?.label,
                title: icon?.label,
                style: {
                  '--button-icon-url': `url(${icon.url})`
                },
                isPressed: () => setCurrentIcon(icon.value),
                className: "wp-block-mosne-button-icon__inline",
                onClick: () => {
                  setmosneIconText('');
                  setCurrentIcon(currentIcon === icon.value ? null : icon.value);
                },
                children: (_icon$icon = icon.icon) !== null && _icon$icon !== void 0 ? _icon$icon : icon.value
              }, index);
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "mosne-icon-popover__controls",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalVStack, {
            spacing: 4,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalHStack, {
              spacing: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalNumberControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Width'),
                value: iconWidth,
                min: 1,
                onChange: newWidth => {
                  setIconWidth(newWidth);
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalNumberControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Height'),
                value: iconHeight,
                min: 1,
                onChange: newWidth => {
                  setIconHeight(newWidth);
                }
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalHStack, {
              spacing: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                onClick: removeMosneIcon,
                className: "mosne-icon-popover__controls-remove components-button is-secondary is-destructive",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Remove', 'mosne-button-icons')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                onClick: saveMosneIconText,
                className: "mosne-icon-popover__controls-save components-button is-primary",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Save', 'mosne-button-icons')
              })]
            })]
          })
        })]
      })]
    })
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.registerFormatType)(mosneIconFormatName, {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Inline Icons', 'mosne-button-icons'),
  tagName: 'span',
  className: 'wp-block-mosne-button-icon__inline',
  ariaHidden: 'true',
  edit: mosneIconEdit
});

/***/ }),

/***/ "./src/shapes.js":
/*!***********************!*\
  !*** ./src/shapes.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const shapes = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fill: "transparent",
    stroke: "currentColor",
    strokeWidth: "1.75",
    d: "M4.75 14c0-.69.56-1.25 1.25-1.25h3c.69 0 1.25.56 1.25 1.25v3c0 .69-.56 1.25-1.25 1.25H6c-.69 0-1.25-.56-1.25-1.25v-3Zm9 1.5a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0ZM12 4.5l3.031 5.25H8.97L12 4.5Zm3.248 5.625Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shapes);

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "@wordpress/rich-text":
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["richText"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/button-icons.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ToolbarInlineIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ToolbarInlineIcon.js */ "./src/ToolbarInlineIcon.js");
// Button icons tools
// import './InspectorControls.js';
// import './ToolbarButton.js';

})();

/******/ })()
;
//# sourceMappingURL=button-icons.js.map