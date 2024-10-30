(()=>{var e,t={9:(e,t,n)=>{"use strict";const r=window.wp.blocks,o=window.wp.primitives,i=window.ReactJSXRuntime,s=(0,i.jsx)(o.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,i.jsx)(o.Path,{d:"M18.5 5.5V8H20V5.5h2.5V4H20V1.5h-1.5V4H16v1.5h2.5zM12 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6h-1.5v6a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5h6V4z"})});var a=n(942),l=n.n(a);const c=window.wp.i18n,u=window.wp.blockEditor,d=window.wp.hooks,p=window.wp.components,h=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"mosne/button-icons","version":"0.1.0","title":"Mosne Button Icons","category":"widgets","description":"Example block scaffolded with Create Block tool.","example":{},"supports":{"align":true,"anchor":true,"customClassName":true,"html":false,"reusable":true,"spacing":{"margin":true,"padding":true},"typography":{"fontSize":true,"textAlign":true},"color":{"text":true,"background":true,"gradient":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}}},"attributes":{"icon":{"type":"string","default":""},"style":{"type":"object","default":{"typography":{"textAlign":"center"}}}},"textdomain":"mosne-button-icons","editorScript":"file:./index.js","style":"file:./style-index.css"}');(0,r.registerBlockType)(h.name,{...h,icon:s,edit:function({attributes:e,setAttributes:t,className:n}){var r;const{icon:o}=e,s=(0,d.applyFilters)("mosne-button-icons.icons",null!==(r=window.mosneButtonIcons.data)&&void 0!==r?r:[],"mosne/button-icons"),a=l()(n,{[`has-icon has-icon__${e?.icon}`]:e?.icon});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(u.InspectorControls,{children:(0,i.jsx)(p.PanelBody,{title:(0,c.__)("Button Icons","mosne-button-icons"),children:(0,i.jsx)(p.PanelRow,{children:(0,i.jsx)("div",{className:"mosne-button-icons__picker",children:(0,i.jsx)(p.__experimentalGrid,{className:"block-editor-block-styles__variants",columns:"4",gap:"4",children:s.map(((e,n)=>{var r;return(0,i.jsx)(p.Button,{label:e?.label,title:e?.label,style:{"--button-icon-url":`url(${e.url})`},isPressed:o===e.value,className:"wp-block-mosne-button-icon__inline",onClick:()=>t({icon:o===e.value?null:e.value}),children:null!==(r=e.icon)&&void 0!==r?r:e.value},n)}))})})})})}),(0,i.jsx)("div",{...(0,u.useBlockProps)({className:a}),children:(0,i.jsx)("span",{"aria-hidden":"true",className:"wp-block-mosne-button-icon__inline",children:"+"})})]})},save:function({className:e,attributes:t}){const n=l()(e,{[`has-icon has-icon__${t?.icon}`]:t?.icon});return(0,i.jsx)("div",{...u.useBlockProps.save({className:n}),children:(0,i.jsx)("span",{"aria-hidden":"true",className:"wp-block-mosne-button-icon__inline",children:"+"})})}})},942:(e,t)=>{var n;!function(){"use strict";var r={}.hasOwnProperty;function o(){for(var e="",t=0;t<arguments.length;t++){var n=arguments[t];n&&(e=s(e,i(n)))}return e}function i(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return o.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var n in e)r.call(e,n)&&e[n]&&(t=s(t,n));return t}function s(e,t){return t?e?e+" "+t:e+t:e}e.exports?(o.default=o,e.exports=o):void 0===(n=function(){return o}.apply(t,[]))||(e.exports=n)}()}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}};return t[e](i,i.exports,r),i.exports}r.m=t,e=[],r.O=(t,n,o,i)=>{if(!n){var s=1/0;for(u=0;u<e.length;u++){n=e[u][0],o=e[u][1],i=e[u][2];for(var a=!0,l=0;l<n.length;l++)(!1&i||s>=i)&&Object.keys(r.O).every((e=>r.O[e](n[l])))?n.splice(l--,1):(a=!1,i<s&&(s=i));if(a){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[n,o,i]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={57:0,350:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,i,s=n[0],a=n[1],l=n[2],c=0;if(s.some((t=>0!==e[t]))){for(o in a)r.o(a,o)&&(r.m[o]=a[o]);if(l)var u=l(r)}for(t&&t(n);c<s.length;c++)i=s[c],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(u)},n=self.webpackChunkmosne_button_icons=self.webpackChunkmosne_button_icons||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var o=r.O(void 0,[350],(()=>r(9)));o=r.O(o)})();