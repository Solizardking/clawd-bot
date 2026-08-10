(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const dn=globalThis,Us=dn.ShadowRoot&&(dn.ShadyCSS===void 0||dn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ks=Symbol(),Qi=new WeakMap;let gr=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==Ks)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(Us&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=Qi.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qi.set(n,t))}return t}toString(){return this.cssText}};const gl=e=>new gr(typeof e=="string"?e:e+"",void 0,Ks),ml=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,i,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new gr(n,e,Ks)},vl=(e,t)=>{if(Us)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),i=dn.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=n.cssText,e.appendChild(s)}},Ji=Us?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return gl(n)})(e):e;const{is:yl,defineProperty:bl,getOwnPropertyDescriptor:wl,getOwnPropertyNames:$l,getOwnPropertySymbols:kl,getPrototypeOf:Sl}=Object,wn=globalThis,Xi=wn.trustedTypes,xl=Xi?Xi.emptyScript:"",Al=wn.reactiveElementPolyfillSupport,Lt=(e,t)=>e,pn={toAttribute(e,t){switch(t){case Boolean:e=e?xl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},zs=(e,t)=>!yl(e,t),Zi={attribute:!0,type:String,converter:pn,reflect:!1,useDefault:!1,hasChanged:zs};Symbol.metadata??=Symbol("metadata"),wn.litPropertyMetadata??=new WeakMap;let rt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Zi){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,n);i!==void 0&&bl(this.prototype,t,i)}}static getPropertyDescriptor(t,n,s){const{get:i,set:o}=wl(this.prototype,t)??{get(){return this[n]},set(r){this[n]=r}};return{get:i,set(r){const c=i?.call(this);o?.call(this,r),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Zi}static _$Ei(){if(this.hasOwnProperty(Lt("elementProperties")))return;const t=Sl(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Lt("properties"))){const n=this.properties,s=[...$l(n),...kl(n)];for(const i of s)this.createProperty(i,n[i])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,i]of n)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const i=this._$Eu(n,s);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)n.unshift(Ji(i))}else t!==void 0&&n.push(Ji(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vl(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(s.converter?.toAttribute!==void 0?s.converter:pn).toAttribute(n,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,n){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:pn;this._$Em=i;const c=r.fromAttribute(n,o.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,n,s,i=!1,o){if(t!==void 0){const r=this.constructor;if(i===!1&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??zs)(o,n)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??n??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,o]of s){const{wrapped:r}=o,c=this[i];r!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,o,c)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};rt.elementStyles=[],rt.shadowRootOptions={mode:"open"},rt[Lt("elementProperties")]=new Map,rt[Lt("finalized")]=new Map,Al?.({ReactiveElement:rt}),(wn.reactiveElementVersions??=[]).push("2.1.2");const Hs=globalThis,eo=e=>e,fn=Hs.trustedTypes,to=fn?fn.createPolicy("lit-html",{createHTML:e=>e}):void 0,mr="$lit$",Ce=`lit$${Math.random().toFixed(9).slice(2)}$`,vr="?"+Ce,_l=`<${vr}>`,Ve=document,Pt=()=>Ve.createComment(""),Nt=e=>e===null||typeof e!="object"&&typeof e!="function",js=Array.isArray,Tl=e=>js(e)||typeof e?.[Symbol.iterator]=="function",es=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,no=/-->/g,so=/>/g,Be=RegExp(`>|${es}(?:([^\\s"'>=/]+)(${es}*=${es}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),io=/'/g,oo=/"/g,yr=/^(?:script|style|textarea|title)$/i,El=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),d=El(1),Me=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ro=new WeakMap,qe=Ve.createTreeWalker(Ve,129);function br(e,t){if(!js(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return to!==void 0?to.createHTML(t):t}const Cl=(e,t)=>{const n=e.length-1,s=[];let i,o=t===2?"<svg>":t===3?"<math>":"",r=St;for(let c=0;c<n;c++){const a=e[c];let f,l,p=-1,h=0;for(;h<a.length&&(r.lastIndex=h,l=r.exec(a),l!==null);)h=r.lastIndex,r===St?l[1]==="!--"?r=no:l[1]!==void 0?r=so:l[2]!==void 0?(yr.test(l[2])&&(i=RegExp("</"+l[2],"g")),r=Be):l[3]!==void 0&&(r=Be):r===Be?l[0]===">"?(r=i??St,p=-1):l[1]===void 0?p=-2:(p=r.lastIndex-l[2].length,f=l[1],r=l[3]===void 0?Be:l[3]==='"'?oo:io):r===oo||r===io?r=Be:r===no||r===so?r=St:(r=Be,i=void 0);const v=r===Be&&e[c+1].startsWith("/>")?" ":"";o+=r===St?a+_l:p>=0?(s.push(f),a.slice(0,p)+mr+a.slice(p)+Ce+v):a+Ce+(p===-2?c:v)}return[br(e,o+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Ot{constructor({strings:t,_$litType$:n},s){let i;this.parts=[];let o=0,r=0;const c=t.length-1,a=this.parts,[f,l]=Cl(t,n);if(this.el=Ot.createElement(f,s),qe.currentNode=this.el.content,n===2||n===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=qe.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(mr)){const h=l[r++],v=i.getAttribute(p).split(Ce),b=/([.?@])?(.*)/.exec(h);a.push({type:1,index:o,name:b[2],strings:v,ctor:b[1]==="."?Rl:b[1]==="?"?Ll:b[1]==="@"?Ml:kn}),i.removeAttribute(p)}else p.startsWith(Ce)&&(a.push({type:6,index:o}),i.removeAttribute(p));if(yr.test(i.tagName)){const p=i.textContent.split(Ce),h=p.length-1;if(h>0){i.textContent=fn?fn.emptyScript:"";for(let v=0;v<h;v++)i.append(p[v],Pt()),qe.nextNode(),a.push({type:2,index:++o});i.append(p[h],Pt())}}}else if(i.nodeType===8)if(i.data===vr)a.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(Ce,p+1))!==-1;)a.push({type:7,index:o}),p+=Ce.length-1}o++}}static createElement(t,n){const s=Ve.createElement("template");return s.innerHTML=t,s}}function dt(e,t,n=e,s){if(t===Me)return t;let i=s!==void 0?n._$Co?.[s]:n._$Cl;const o=Nt(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(e),i._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=i:n._$Cl=i),i!==void 0&&(t=dt(e,i._$AS(e,t.values),i,s)),t}class Il{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,i=(t?.creationScope??Ve).importNode(n,!0);qe.currentNode=i;let o=qe.nextNode(),r=0,c=0,a=s[0];for(;a!==void 0;){if(r===a.index){let f;a.type===2?f=new $n(o,o.nextSibling,this,t):a.type===1?f=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(f=new Pl(o,this,t)),this._$AV.push(f),a=s[++c]}r!==a?.index&&(o=qe.nextNode(),r++)}return qe.currentNode=Ve,i}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let $n=class wr{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=dt(this,t,n),Nt(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tl(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&Nt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ve.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Ot.createElement(br(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(n);else{const o=new Il(i,this),r=o.u(this.options);o.p(n),this.T(r),this._$AH=o}}_$AC(t){let n=ro.get(t.strings);return n===void 0&&ro.set(t.strings,n=new Ot(t)),n}k(t){js(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,i=0;for(const o of t)i===n.length?n.push(s=new wr(this.O(Pt()),this.O(Pt()),this,this.options)):s=n[i],s._$AI(o),i++;i<n.length&&(this._$AR(s&&s._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=eo(t).nextSibling;eo(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},kn=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,i,o){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(t,n=this,s,i){const o=this.strings;let r=!1;if(o===void 0)t=dt(this,t,n,0),r=!Nt(t)||t!==this._$AH&&t!==Me,r&&(this._$AH=t);else{const c=t;let a,f;for(t=o[0],a=0;a<o.length-1;a++)f=dt(this,c[s+a],n,a),f===Me&&(f=this._$AH[a]),r||=!Nt(f)||f!==this._$AH[a],f===m?t=m:t!==m&&(t+=(f??"")+o[a+1]),this._$AH[a]=f}r&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Rl=class extends kn{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},Ll=class extends kn{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},Ml=class extends kn{constructor(t,n,s,i,o){super(t,n,s,i,o),this.type=5}_$AI(t,n=this){if((t=dt(this,t,n,0)??m)===Me)return;const s=this._$AH,i=t===m&&s!==m||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}};class Pl{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){dt(this,t)}}const Nl={I:$n},Ol=Hs.litHtmlPolyfillSupport;Ol?.(Ot,$n),(Hs.litHtmlVersions??=[]).push("3.3.3");const Dl=(e,t,n)=>{const s=n?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const o=n?.renderBefore??null;s._$litPart$=i=new $n(t.insertBefore(Pt(),o),o,void 0,n??{})}return i._$AI(e),i};const qs=globalThis;let ct=class extends rt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Dl(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};ct._$litElement$=!0,ct.finalized=!0,qs.litElementHydrateSupport?.({LitElement:ct});const Fl=qs.litElementPolyfillSupport;Fl?.({LitElement:ct});(qs.litElementVersions??=[]).push("4.2.2");const $r=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const Bl={attribute:!0,type:String,converter:pn,reflect:!1,hasChanged:zs},Ul=(e=Bl,t,n)=>{const{kind:s,metadata:i}=n;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(n.name,e),s==="accessor"){const{name:r}=n;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(r,a,e,!0,c)},init(c){return c!==void 0&&this.C(r,void 0,e,c),c}}}if(s==="setter"){const{name:r}=n;return function(c){const a=this[r];t.call(this,c),this.requestUpdate(r,a,e,!0,c)}}throw Error("Unsupported decorator location: "+s)};function Sn(e){return(t,n)=>typeof n=="object"?Ul(e,t,n):((s,i,o)=>{const r=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),r?Object.getOwnPropertyDescriptor(i,o):void 0})(e,t,n)}function $(e){return Sn({...e,state:!0,attribute:!1})}const Kl=50,zl=200,Hl="Assistant";function ao(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function ys(e){const t=ao(e?.name,Kl)??Hl,n=ao(e?.avatar??void 0,zl)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}function jl(){return ys(typeof window>"u"?{}:{name:window.__CLAWDBOT_ASSISTANT_NAME__,avatar:window.__CLAWDBOT_ASSISTANT_AVATAR__})}const kr="clawdbot.control.settings.v1";function ql(){const t={gatewayUrl:`${location.protocol==="https:"?"wss":"ws"}://${location.host}`,token:"",sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{}};try{const n=localStorage.getItem(kr);if(!n)return t;const s=JSON.parse(n);return{gatewayUrl:typeof s.gatewayUrl=="string"&&s.gatewayUrl.trim()?s.gatewayUrl.trim():t.gatewayUrl,token:typeof s.token=="string"?s.token:t.token,sessionKey:typeof s.sessionKey=="string"&&s.sessionKey.trim()?s.sessionKey.trim():t.sessionKey,lastActiveSessionKey:typeof s.lastActiveSessionKey=="string"&&s.lastActiveSessionKey.trim()?s.lastActiveSessionKey.trim():typeof s.sessionKey=="string"&&s.sessionKey.trim()||t.lastActiveSessionKey,theme:s.theme==="light"||s.theme==="dark"||s.theme==="system"?s.theme:t.theme,chatFocusMode:typeof s.chatFocusMode=="boolean"?s.chatFocusMode:t.chatFocusMode,chatShowThinking:typeof s.chatShowThinking=="boolean"?s.chatShowThinking:t.chatShowThinking,splitRatio:typeof s.splitRatio=="number"&&s.splitRatio>=.4&&s.splitRatio<=.7?s.splitRatio:t.splitRatio,navCollapsed:typeof s.navCollapsed=="boolean"?s.navCollapsed:t.navCollapsed,navGroupsCollapsed:typeof s.navGroupsCollapsed=="object"&&s.navGroupsCollapsed!==null?s.navGroupsCollapsed:t.navGroupsCollapsed}}catch{return t}}function Vl(e){localStorage.setItem(kr,JSON.stringify(e))}function Sr(e){const t=e?.trim();if(!t)return null;if(t==="main")return{raw:t,agentId:"main",channel:"main"};const n=t.split(":").filter(i=>i.length>0);if(n.length===0)return null;if(n[0]==="agent"){const i=n[1]?.trim();return i?{raw:t,agentId:i,channel:n[2],peer:n.length>3?n.slice(3).join(":"):void 0}:null}const s=n[0]?.trim();return s?{raw:t,agentId:s,channel:n[1],peer:n.length>2?n.slice(2).join(":"):void 0}:null}const Wl=[{label:"Chat",tabs:["chat"]},{label:"Control",tabs:["overview","channels","instances","sessions","cron"]},{label:"Agent",tabs:["skills","nodes"]},{label:"Settings",tabs:["config","debug","logs"]}],xr={overview:"/overview",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",config:"/config",debug:"/debug",logs:"/logs"},Ar=new Map(Object.entries(xr).map(([e,t])=>[t,e]));function xn(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Dt(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function Vs(e,t=""){const n=xn(t),s=xr[e];return n?`${n}${s}`:s}function _r(e,t=""){const n=xn(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=Dt(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":Ar.get(i)??null}function Gl(e){let t=Dt(e);if(t.endsWith("/index.html")&&(t=Dt(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(Ar.has(i)){const o=n.slice(0,s);return o.length?`/${o.join("/")}`:""}}return`/${n.join("/")}`}function Yl(e){switch(e){case"chat":return"💬";case"overview":return"📊";case"channels":return"🔗";case"instances":return"📡";case"sessions":return"📄";case"cron":return"⏰";case"skills":return"⚡️";case"nodes":return"🖥️";case"config":return"⚙️";case"debug":return"🐞";case"logs":return"🧾";default:return"📁"}}function bs(e){switch(e){case"overview":return"Overview";case"channels":return"Channels";case"instances":return"Instances";case"sessions":return"Sessions";case"cron":return"Cron Jobs";case"skills":return"Skills";case"nodes":return"Nodes";case"chat":return"Chat";case"config":return"Config";case"debug":return"Debug";case"logs":return"Logs";default:return"Control"}}function Ql(e){switch(e){case"overview":return"Gateway status, entry points, and a fast health read.";case"channels":return"Manage channels and settings.";case"instances":return"Presence beacons from connected clients and nodes.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Schedule wakeups and recurring agent runs.";case"skills":return"Manage skill availability and API key injection.";case"nodes":return"Paired devices, capabilities, and command exposure.";case"chat":return"Direct gateway chat session for quick interventions.";case"config":return"Edit ~/.clawdbot/clawdbot.json safely.";case"debug":return"Gateway snapshots, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}function Ft(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function H(e){if(!e&&e!==0)return"n/a";const t=Date.now()-e;if(t<0)return"just now";const n=Math.round(t/1e3);if(n<60)return`${n}s ago`;const s=Math.round(n/60);if(s<60)return`${s}m ago`;const i=Math.round(s/60);return i<48?`${i}h ago`:`${Math.round(i/24)}d ago`}function Tr(e){if(!e&&e!==0)return"n/a";if(e<1e3)return`${e}ms`;const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);if(n<60)return`${n}m`;const s=Math.round(n/60);return s<48?`${s}h`:`${Math.round(s/24)}d`}function ws(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function $s(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Er(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function hn(e,t){const n=Number(e);return Number.isFinite(n)?n:t}const ts=/<\s*\/?\s*think(?:ing)?\s*>/gi,lo=/<\s*think(?:ing)?\s*>/i,co=/<\s*\/\s*think(?:ing)?\s*>/i;function ns(e){if(!e)return e;const t=lo.test(e),n=co.test(e);if(!t&&!n)return e;if(t!==n)return t?e.replace(lo,"").trimStart():e.replace(co,"").trimStart();if(!ts.test(e))return e;ts.lastIndex=0;let s="",i=0,o=!1;for(const r of e.matchAll(ts)){const c=r.index??0;o||(s+=e.slice(i,c)),o=!r[0].toLowerCase().includes("/"),i=c+r[0].length}return o||(s+=e.slice(i)),s.trimStart()}const Jl=/^\[([^\]]+)\]\s*/,Xl=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"];function Zl(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Xl.some(t=>e.startsWith(`${t} `))}function ss(e){const t=e.match(Jl);if(!t)return e;const n=t[1]??"";return Zl(n)?e.slice(t[0].length):e}function An(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string")return n==="assistant"?ns(s):ss(s);if(Array.isArray(s)){const i=s.map(o=>{const r=o;return r.type==="text"&&typeof r.text=="string"?r.text:null}).filter(o=>typeof o=="string");if(i.length>0){const o=i.join(`
`);return n==="assistant"?ns(o):ss(o)}}return typeof t.text=="string"?n==="assistant"?ns(t.text):ss(t.text):null}function ec(e){const n=e.content,s=[];if(Array.isArray(n))for(const c of n){const a=c;if(a.type==="thinking"&&typeof a.thinking=="string"){const f=a.thinking.trim();f&&s.push(f)}}if(s.length>0)return s.join(`
`);const i=tc(e);if(!i)return null;const r=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(c=>(c[1]??"").trim()).filter(Boolean);return r.length>0?r.join(`
`):null}function tc(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const o=i;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function nc(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}function uo(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function sc(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Ws(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),uo(t)}return uo(sc())}async function ut(e){if(!(!e.client||!e.connected)){e.chatLoading=!0,e.lastError=null;try{const t=await e.client.request("chat.history",{sessionKey:e.sessionKey,limit:200});e.chatMessages=Array.isArray(t.messages)?t.messages:[],e.chatThinkingLevel=t.thinkingLevel??null}catch(t){e.lastError=String(t)}finally{e.chatLoading=!1}}}async function ic(e,t){if(!e.client||!e.connected)return!1;const n=t.trim();if(!n)return!1;const s=Date.now();e.chatMessages=[...e.chatMessages,{role:"user",content:[{type:"text",text:n}],timestamp:s}],e.chatSending=!0,e.lastError=null;const i=Ws();e.chatRunId=i,e.chatStream="",e.chatStreamStartedAt=s;try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:n,deliver:!1,idempotencyKey:i}),!0}catch(o){const r=String(o);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=r,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+r}],timestamp:Date.now()}],!1}finally{e.chatSending=!1}}async function oc(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function rc(e,t){if(!t||t.sessionKey!==e.sessionKey||t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return null;if(t.state==="delta"){const n=An(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else t.state==="final"||t.state==="aborted"?(e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null):t.state==="error"&&(e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,e.lastError=t.errorMessage??"chat error");return t.state}async function gt(e){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const t={includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown},n=hn(e.sessionsFilterActive,0),s=hn(e.sessionsFilterLimit,0);n>0&&(t.activeMinutes=n),s>0&&(t.limit=s);const i=await e.client.request("sessions.list",t);i&&(e.sessionsResult=i)}catch(t){e.sessionsError=String(t)}finally{e.sessionsLoading=!1}}}async function ac(e,t,n){if(!e.client||!e.connected)return;const s={key:t};"label"in n&&(s.label=n.label),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{await e.client.request("sessions.patch",s),await gt(e)}catch(i){e.sessionsError=String(i)}}async function lc(e,t){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),await gt(e)}catch(s){e.sessionsError=String(s)}finally{e.sessionsLoading=!1}}}const po=50,cc=80,dc=12e4;function uc(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const o=i;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function fo(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=uc(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=String(e)}const s=Er(n,dc);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function pc(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function fc(e){if(e.toolStreamOrder.length<=po)return;const t=e.toolStreamOrder.length-po,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function hc(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function ks(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),hc(e)}function gc(e,t=!1){if(t){ks(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>ks(e),cc))}function Gs(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],ks(e)}const mc=5e3;function vc(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},mc))}function yc(e,t){if(!t)return;if(t.stream==="compaction"){vc(e,t);return}if(t.stream!=="tool")return;const n=typeof t.sessionKey=="string"?t.sessionKey:void 0;if(n&&n!==e.sessionKey||!n&&e.chatRunId&&t.runId!==e.chatRunId||e.chatRunId&&t.runId!==e.chatRunId||!e.chatRunId)return;const s=t.data??{},i=typeof s.toolCallId=="string"?s.toolCallId:"";if(!i)return;const o=typeof s.name=="string"?s.name:"tool",r=typeof s.phase=="string"?s.phase:"",c=r==="start"?s.args:void 0,a=r==="update"?fo(s.partialResult):r==="result"?fo(s.result):void 0,f=Date.now();let l=e.toolStreamById.get(i);l?(l.name=o,c!==void 0&&(l.args=c),a!==void 0&&(l.output=a),l.updatedAt=f):(l={toolCallId:i,runId:t.runId,sessionKey:n,name:o,args:c,output:a,startedAt:typeof t.ts=="number"?t.ts:f,updatedAt:f,message:{}},e.toolStreamById.set(i,l),e.toolStreamOrder.push(i)),l.message=pc(l),fc(e),gc(e,r==="result")}function _n(e,t=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const n=()=>{const s=e.querySelector(".chat-thread");if(s){const i=getComputedStyle(s).overflowY;if(i==="auto"||i==="scroll"||s.scrollHeight-s.clientHeight>1)return s}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const s=n();if(!s)return;const i=s.scrollHeight-s.scrollTop-s.clientHeight;if(!(t||e.chatUserNearBottom||i<200))return;t&&(e.chatHasAutoScrolled=!0),s.scrollTop=s.scrollHeight,e.chatUserNearBottom=!0;const r=t?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const c=n();if(!c)return;const a=c.scrollHeight-c.scrollTop-c.clientHeight;(t||e.chatUserNearBottom||a<200)&&(c.scrollTop=c.scrollHeight,e.chatUserNearBottom=!0)},r)})})}function Cr(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function bc(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.chatUserNearBottom=s<200}function wc(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function $c(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0}function kc(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),o=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`clawdbot-logs-${t}-${o}.log`,i.click(),URL.revokeObjectURL(s)}function Sc(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}function We(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function pt(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function Ir(e,t,n){if(t.length===0)return;let s=e;for(let o=0;o<t.length-1;o+=1){const r=t[o],c=t[o+1];if(typeof r=="number"){if(!Array.isArray(s))return;s[r]==null&&(s[r]=typeof c=="number"?[]:{}),s=s[r]}else{if(typeof s!="object"||s==null)return;const a=s;a[r]==null&&(a[r]=typeof c=="number"?[]:{}),s=a[r]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function Rr(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const o=t[i];if(typeof o=="number"){if(!Array.isArray(n))return;n=n[o]}else{if(typeof n!="object"||n==null)return;n=n[o]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function $e(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});Ac(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function Lr(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});xc(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function xc(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Ac(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?pt(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=pt(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=We(t.config??{}),e.configFormOriginal=We(t.config??{}))}async function Ss(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?pt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await $e(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function _c(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=e.configFormMode==="form"&&e.configForm?pt(e.configForm):e.configRaw,n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await $e(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Tc(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("update.run",{sessionKey:e.applySessionKey})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function nn(e,t,n){const s=We(e.configForm??e.configSnapshot?.config??{});Ir(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=pt(s))}function ho(e,t){const n=We(e.configForm??e.configSnapshot?.config??{});Rr(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=pt(n))}async function Kt(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function Tn(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function Ec(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",atMs:n}}if(e.scheduleKind==="every"){const n=hn(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function Cc(e){if(e.payloadKind==="systemEvent"){const i=e.payloadText.trim();if(!i)throw new Error("System event text required.");return{kind:"systemEvent",text:i}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t};e.deliver&&(n.deliver=!0),e.channel&&(n.channel=e.channel),e.to.trim()&&(n.to=e.to.trim());const s=hn(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function Ic(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=Ec(e.cronForm),n=Cc(e.cronForm),s=e.cronForm.agentId.trim(),i={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:s||void 0,enabled:e.cronForm.enabled,schedule:t,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:n,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!i.name)throw new Error("Name required.");await e.client.request("cron.add",i),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await Tn(e),await Kt(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function Rc(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await Tn(e),await Kt(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function Lc(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await Mr(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Mc(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await Tn(e),await Kt(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Mr(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}async function pe(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function Pc(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Nc(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Oc(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}async function En(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const o=s;e.debugModels=Array.isArray(o?.models)?o?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Dc(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Fc=2e3,Bc=new Set(["trace","debug","info","warn","error","fatal"]);function Uc(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function Kc(e){if(typeof e!="string")return null;const t=e.toLowerCase();return Bc.has(t)?t:null}function zc(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=Kc(n?.logLevelName??n?.level),o=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,r=Uc(o);let c=null;r&&(typeof r.subsystem=="string"?c=r.subsystem:typeof r.module=="string"&&(c=r.module)),!c&&o&&o.length<120&&(c=o);let a=null;return typeof t[1]=="string"?a=t[1]:!r&&typeof t[0]=="string"?a=t[0]:typeof t.message=="string"&&(a=t.message),{raw:e,time:s,level:i,subsystem:c,message:a??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function Ys(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),o=(Array.isArray(s.lines)?s.lines.filter(c=>typeof c=="string"):[]).map(zc),r=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=r?o:[...e.logsEntries,...o].slice(-Fc),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}const Pr={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:te,n:un,Gx:go,Gy:mo,a:is,d:os,h:Hc}=Pr,Ge=32,Qs=64,jc=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},J=(e="")=>{const t=new Error(e);throw jc(t,J),t},qc=e=>typeof e=="bigint",Vc=e=>typeof e=="string",Wc=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",Pe=(e,t,n="")=>{const s=Wc(e),i=e?.length,o=t!==void 0;if(!s||o&&i!==t){const r=n&&`"${n}" `,c=o?` of length ${t}`:"",a=s?`length=${i}`:`type=${typeof e}`;J(r+"expected Uint8Array"+c+", got "+a)}return e},Cn=e=>new Uint8Array(e),Nr=e=>Uint8Array.from(e),Or=(e,t)=>e.toString(16).padStart(t,"0"),Dr=e=>Array.from(Pe(e)).map(t=>Or(t,2)).join(""),we={_0:48,_9:57,A:65,F:70,a:97,f:102},vo=e=>{if(e>=we._0&&e<=we._9)return e-we._0;if(e>=we.A&&e<=we.F)return e-(we.A-10);if(e>=we.a&&e<=we.f)return e-(we.a-10)},Fr=e=>{const t="hex invalid";if(!Vc(e))return J(t);const n=e.length,s=n/2;if(n%2)return J(t);const i=Cn(s);for(let o=0,r=0;o<s;o++,r+=2){const c=vo(e.charCodeAt(r)),a=vo(e.charCodeAt(r+1));if(c===void 0||a===void 0)return J(t);i[o]=c*16+a}return i},Br=()=>globalThis?.crypto,Gc=()=>Br()?.subtle??J("crypto.subtle must be defined, consider polyfill"),Bt=(...e)=>{const t=Cn(e.reduce((s,i)=>s+Pe(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},Yc=(e=Ge)=>Br().getRandomValues(Cn(e)),gn=BigInt,He=(e,t,n,s="bad number: out of range")=>qc(e)&&t<=e&&e<n?e:J(s),T=(e,t=te)=>{const n=e%t;return n>=0n?n:t+n},Ur=e=>T(e,un),Qc=(e,t)=>{(e===0n||t<=0n)&&J("no inverse n="+e+" mod="+t);let n=T(e,t),s=t,i=0n,o=1n;for(;n!==0n;){const r=s/n,c=s%n,a=i-o*r;s=n,n=c,i=o,o=a}return s===1n?T(i,t):J("no inverse")},Jc=e=>{const t=jr[e];return typeof t!="function"&&J("hashes."+e+" not set"),t},rs=e=>e instanceof ae?e:J("Point expected"),xs=2n**256n;class ae{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const o=xs;this.X=He(t,0n,o),this.Y=He(n,0n,o),this.Z=He(s,1n,o),this.T=He(i,0n,o),Object.freeze(this)}static CURVE(){return Pr}static fromAffine(t){return new ae(t.x,t.y,1n,T(t.x*t.y))}static fromBytes(t,n=!1){const s=os,i=Nr(Pe(t,Ge)),o=t[31];i[31]=o&-129;const r=zr(i);He(r,0n,n?xs:te);const a=T(r*r),f=T(a-1n),l=T(s*a+1n);let{isValid:p,value:h}=Zc(f,l);p||J("bad point: y not sqrt");const v=(h&1n)===1n,b=(o&128)!==0;return!n&&h===0n&&b&&J("bad point: x==0, isLastByteOdd"),b!==v&&(h=T(-h)),new ae(h,r,1n,T(h*r))}static fromHex(t,n){return ae.fromBytes(Fr(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=is,n=os,s=this;if(s.is0())return J("bad point: ZERO");const{X:i,Y:o,Z:r,T:c}=s,a=T(i*i),f=T(o*o),l=T(r*r),p=T(l*l),h=T(a*t),v=T(l*T(h+f)),b=T(p+T(n*T(a*f)));if(v!==b)return J("bad point: equation left != right (1)");const k=T(i*o),A=T(r*c);return k!==A?J("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:o,Y:r,Z:c}=rs(t),a=T(n*c),f=T(o*i),l=T(s*c),p=T(r*i);return a===f&&l===p}is0(){return this.equals(lt)}negate(){return new ae(T(-this.X),this.Y,this.Z,T(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=is,o=T(t*t),r=T(n*n),c=T(2n*T(s*s)),a=T(i*o),f=t+n,l=T(T(f*f)-o-r),p=a+r,h=p-c,v=a-r,b=T(l*h),k=T(p*v),A=T(l*v),I=T(h*p);return new ae(b,k,I,A)}add(t){const{X:n,Y:s,Z:i,T:o}=this,{X:r,Y:c,Z:a,T:f}=rs(t),l=is,p=os,h=T(n*r),v=T(s*c),b=T(o*p*f),k=T(i*a),A=T((n+s)*(r+c)-h-v),I=T(k-b),M=T(k+b),O=T(v-l*h),R=T(A*I),_=T(M*O),F=T(A*O),V=T(I*M);return new ae(R,_,V,F)}subtract(t){return this.add(rs(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return lt;if(He(t,1n,un),t===1n)return this;if(this.equals(Ye))return dd(t).p;let s=lt,i=Ye;for(let o=this;t>0n;o=o.double(),t>>=1n)t&1n?s=s.add(o):n&&(i=i.add(o));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(lt))return{x:0n,y:1n};const i=Qc(s,te);T(s*i)!==1n&&J("invalid inverse");const o=T(t*i),r=T(n*i);return{x:o,y:r}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=Kr(n);return s[31]|=t&1n?128:0,s}toHex(){return Dr(this.toBytes())}clearCofactor(){return this.multiply(gn(Hc),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply(un/2n,!1).double();return un%2n&&(t=t.add(this)),t.is0()}}const Ye=new ae(go,mo,1n,T(go*mo)),lt=new ae(0n,1n,1n,0n);ae.BASE=Ye;ae.ZERO=lt;const Kr=e=>Fr(Or(He(e,0n,xs),Qs)).reverse(),zr=e=>gn("0x"+Dr(Nr(Pe(e)).reverse())),me=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=te;return n},Xc=e=>{const n=e*e%te*e%te,s=me(n,2n)*n%te,i=me(s,1n)*e%te,o=me(i,5n)*i%te,r=me(o,10n)*o%te,c=me(r,20n)*r%te,a=me(c,40n)*c%te,f=me(a,80n)*a%te,l=me(f,80n)*a%te,p=me(l,10n)*o%te;return{pow_p_5_8:me(p,2n)*e%te,b2:n}},yo=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,Zc=(e,t)=>{const n=T(t*t*t),s=T(n*n*t),i=Xc(e*s).pow_p_5_8;let o=T(e*n*i);const r=T(t*o*o),c=o,a=T(o*yo),f=r===e,l=r===T(-e),p=r===T(-e*yo);return f&&(o=c),(l||p)&&(o=a),(T(o)&1n)===1n&&(o=T(-o)),{isValid:f||l,value:o}},As=e=>Ur(zr(e)),Js=(...e)=>jr.sha512Async(Bt(...e)),ed=(...e)=>Jc("sha512")(Bt(...e)),Hr=e=>{const t=e.slice(0,Ge);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(Ge,Qs),s=As(t),i=Ye.multiply(s),o=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:o}},Xs=e=>Js(Pe(e,Ge)).then(Hr),td=e=>Hr(ed(Pe(e,Ge))),nd=e=>Xs(e).then(t=>t.pointBytes),sd=e=>Js(e.hashable).then(e.finish),id=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,o=As(t),r=Ye.multiply(o).toBytes();return{hashable:Bt(r,s,n),finish:f=>{const l=Ur(o+As(f)*i);return Pe(Bt(r,Kr(l)),Qs)}}},od=async(e,t)=>{const n=Pe(e),s=await Xs(t),i=await Js(s.prefix,n);return sd(id(s,i,n))},jr={sha512Async:async e=>{const t=Gc(),n=Bt(e);return Cn(await t.digest("SHA-512",n.buffer))},sha512:void 0},rd=(e=Yc(Ge))=>e,ad={getExtendedPublicKeyAsync:Xs,getExtendedPublicKey:td,randomSecretKey:rd},mn=8,ld=256,qr=Math.ceil(ld/mn)+1,_s=2**(mn-1),cd=()=>{const e=[];let t=Ye,n=t;for(let s=0;s<qr;s++){n=t,e.push(n);for(let i=1;i<_s;i++)n=n.add(t),e.push(n);t=n.double()}return e};let bo;const wo=(e,t)=>{const n=t.negate();return e?n:t},dd=e=>{const t=bo||(bo=cd());let n=lt,s=Ye;const i=2**mn,o=i,r=gn(i-1),c=gn(mn);for(let a=0;a<qr;a++){let f=Number(e&r);e>>=c,f>_s&&(f-=o,e+=1n);const l=a*_s,p=l,h=l+Math.abs(f)-1,v=a%2!==0,b=f<0;f===0?s=s.add(wo(v,t[p])):n=n.add(wo(b,t[h]))}return e!==0n&&J("invalid wnaf"),{p:n,f:s}},as="clawdbot-device-identity-v1";function Ts(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function Vr(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let o=0;o<s.length;o+=1)i[o]=s.charCodeAt(o);return i}function ud(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function Wr(e){const t=await crypto.subtle.digest("SHA-256",e);return ud(new Uint8Array(t))}async function pd(){const e=ad.randomSecretKey(),t=await nd(e);return{deviceId:await Wr(t),publicKey:Ts(t),privateKey:Ts(e)}}async function Zs(){try{const n=localStorage.getItem(as);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await Wr(Vr(s.publicKey));if(i!==s.deviceId){const o={...s,deviceId:i};return localStorage.setItem(as,JSON.stringify(o)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await pd(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem(as,JSON.stringify(t)),e}async function fd(e,t){const n=Vr(e),s=new TextEncoder().encode(t),i=await od(s,n);return Ts(i)}const Gr="clawdbot.device.auth.v1";function ei(e){return e.trim()}function hd(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].sort()}function ti(){try{const e=window.localStorage.getItem(Gr);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Yr(e){try{window.localStorage.setItem(Gr,JSON.stringify(e))}catch{}}function gd(e){const t=ti();if(!t||t.deviceId!==e.deviceId)return null;const n=ei(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function Qr(e){const t=ei(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=ti();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:hd(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,Yr(n),i}function Jr(e){const t=ti();if(!t||t.deviceId!==e.deviceId)return;const n=ei(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Yr(s)}async function Ne(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function md(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await Ne(e)}catch(n){e.devicesError=String(n)}}async function vd(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await Ne(e)}catch(s){e.devicesError=String(s)}}async function yd(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await Zs(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&Qr({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await Ne(e)}catch(n){e.devicesError=String(n)}}async function bd(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await Zs();t.deviceId===s.deviceId&&Jr({deviceId:s.deviceId,role:t.role}),await Ne(e)}catch(s){e.devicesError=String(s)}}async function In(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{});e.nodes=Array.isArray(n.nodes)?n.nodes:[]}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}function wd(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function $d(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function ni(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=wd(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);kd(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function kd(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=We(t.file??{}))}async function Sd(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=$d(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await ni(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function xd(e,t,n){const s=We(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Ir(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Ad(e,t){const n=We(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});Rr(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}async function si(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}function ft(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function Rn(e){return e instanceof Error?e.message:String(e)}async function zt(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=Rn(n)}finally{e.skillsLoading=!1}}}function _d(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function Td(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await zt(e),ft(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=Rn(s);e.skillsError=i,ft(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function Ed(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await zt(e),ft(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=Rn(n);e.skillsError=s,ft(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function Cd(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await zt(e),ft(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const o=Rn(i);e.skillsError=o,ft(e,t,{kind:"error",message:o})}finally{e.skillsBusyKey=null}}}function Id(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function ii(e){return e==="system"?Id():e}const sn=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Rd=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,on=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},Ld=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const o=i.documentElement,r=i,c=Rd();if(!!r.startViewTransition&&!c){let f=.5,l=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")f=sn(n.pointerClientX/window.innerWidth),l=sn(n.pointerClientY/window.innerHeight);else if(n?.element){const p=n.element.getBoundingClientRect();p.width>0&&p.height>0&&typeof window<"u"&&(f=sn((p.left+p.width/2)/window.innerWidth),l=sn((p.top+p.height/2)/window.innerHeight))}o.style.setProperty("--theme-switch-x",`${f*100}%`),o.style.setProperty("--theme-switch-y",`${l*100}%`),o.classList.add("theme-transition");try{const p=r.startViewTransition?.(()=>{t()});p?.finished?p.finished.finally(()=>on(o)):on(o)}catch{on(o),t()}return}t(),on(o)};function Md(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{In(e,{quiet:!0})},5e3))}function Pd(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function oi(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&Ys(e,{quiet:!0})},2e3))}function ri(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function ai(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&En(e)},3e3))}function li(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}function Re(e,t){const n={...t,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||t.sessionKey.trim()||"main"};e.settings=n,Vl(n),t.theme!==e.theme&&(e.theme=t.theme,Ln(e,ii(t.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function Xr(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&Re(e,{...e.settings,lastActiveSessionKey:n})}function Nd(e){if(!window.location.search)return;const t=new URLSearchParams(window.location.search),n=t.get("token"),s=t.get("password"),i=t.get("session"),o=t.get("gatewayUrl");let r=!1;if(n!=null){const a=n.trim();a&&a!==e.settings.token&&Re(e,{...e.settings,token:a}),t.delete("token"),r=!0}if(s!=null){const a=s.trim();a&&(e.password=a),t.delete("password"),r=!0}if(i!=null){const a=i.trim();a&&(e.sessionKey=a,Re(e,{...e.settings,sessionKey:a,lastActiveSessionKey:a}))}if(o!=null){const a=o.trim();a&&a!==e.settings.gatewayUrl&&Re(e,{...e.settings,gatewayUrl:a}),t.delete("gatewayUrl"),r=!0}if(!r)return;const c=new URL(window.location.href);c.search=t.toString(),window.history.replaceState({},"",c.toString())}function Od(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="logs"?oi(e):ri(e),t==="debug"?ai(e):li(e),ci(e),ea(e,t,!1)}function Dd(e,t,n){Ld({nextTheme:t,applyTheme:()=>{e.theme=t,Re(e,{...e.settings,theme:t}),Ln(e,ii(t))},context:n,currentTheme:e.theme})}async function ci(e){e.tab==="overview"&&await ta(e),e.tab==="channels"&&await qd(e),e.tab==="instances"&&await si(e),e.tab==="sessions"&&await gt(e),e.tab==="cron"&&await di(e),e.tab==="skills"&&await zt(e),e.tab==="nodes"&&(await In(e),await Ne(e),await $e(e),await ni(e)),e.tab==="chat"&&(await Qd(e),_n(e,!e.chatHasAutoScrolled)),e.tab==="config"&&(await Lr(e),await $e(e)),e.tab==="debug"&&(await En(e),e.eventLog=e.eventLogBuffer),e.tab==="logs"&&(e.logsAtBottom=!0,await Ys(e,{reset:!0}),Cr(e,!0))}function Fd(){if(typeof window>"u")return"";const e=window.__CLAWDBOT_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?xn(e):Gl(window.location.pathname)}function Bd(e){e.theme=e.settings.theme??"system",Ln(e,ii(e.theme))}function Ln(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t}function Ud(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&Ln(e,n.matches?"dark":"light")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Kd(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function zd(e,t){if(typeof window>"u")return;const n=_r(window.location.pathname,e.basePath)??"chat";Zr(e,n),ea(e,n,t)}function Hd(e){if(typeof window>"u")return;const t=_r(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();s&&(e.sessionKey=s,Re(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s})),Zr(e,t)}function Zr(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="logs"?oi(e):ri(e),t==="debug"?ai(e):li(e),e.connected&&ci(e)}function ea(e,t,n){if(typeof window>"u")return;const s=Dt(Vs(t,e.basePath)),i=Dt(window.location.pathname),o=new URL(window.location.href);t==="chat"&&e.sessionKey?o.searchParams.set("session",e.sessionKey):o.searchParams.delete("session"),i!==s&&(o.pathname=s),n?window.history.replaceState({},"",o.toString()):window.history.pushState({},"",o.toString())}function jd(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),window.history.replaceState({},"",s.toString())}async function ta(e){await Promise.all([pe(e,!1),si(e),gt(e),Kt(e),En(e)])}async function qd(e){await Promise.all([pe(e,!0),Lr(e),$e(e)])}async function di(e){await Promise.all([pe(e,!1),Kt(e),Tn(e)])}function na(e){return e.chatSending||!!e.chatRunId}function Vd(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}async function sa(e){e.connected&&(e.chatMessage="",await oc(e))}function Wd(e,t){const n=t.trim();n&&(e.chatQueue=[...e.chatQueue,{id:Ws(),text:n,createdAt:Date.now()}])}async function ia(e,t,n){Gs(e);const s=await ic(e,t);return!s&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),s&&Xr(e,e.sessionKey),s&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),_n(e),s&&!e.chatRunId&&oa(e),s}async function oa(e){if(!e.connected||na(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await ia(e,t.text)||(e.chatQueue=[t,...e.chatQueue])}function Gd(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function Yd(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim();if(i){if(Vd(i)){await sa(e);return}if(t==null&&(e.chatMessage=""),na(e)){Wd(e,i);return}await ia(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft)})}}async function Qd(e){await Promise.all([ut(e),gt(e),Es(e)]),_n(e,!0)}const Jd=oa;function Xd(e){const t=Sr(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function Zd(e,t){const n=xn(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Es(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=Xd(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=Zd(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),o=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=o||null}catch{e.chatAvatarUrl=null}}const ra={CHILD:2},aa=e=>(...t)=>({_$litDirective$:e,values:t});let la=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};const{I:eu}=Nl,$o=e=>e,ko=()=>document.createComment(""),xt=(e,t,n)=>{const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const o=s.insertBefore(ko(),i),r=s.insertBefore(ko(),i);n=new eu(o,r,e,e.options)}else{const o=n._$AB.nextSibling,r=n._$AM,c=r!==e;if(c){let a;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(a=e._$AU)!==r._$AU&&n._$AP(a)}if(o!==i||c){let a=n._$AA;for(;a!==o;){const f=$o(a).nextSibling;$o(s).insertBefore(a,i),a=f}}}return n},Ue=(e,t,n=e)=>(e._$AI(t,n),e),tu={},nu=(e,t=tu)=>e._$AH=t,su=e=>e._$AH,ls=e=>{e._$AR(),e._$AA.remove()};const So=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},ca=aa(class extends la{constructor(e){if(super(e),e.type!==ra.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const i=[],o=[];let r=0;for(const c of e)i[r]=s?s(c,r):r,o[r]=n(c,r),r++;return{values:o,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const i=su(e),{values:o,keys:r}=this.dt(t,n,s);if(!Array.isArray(i))return this.ut=r,o;const c=this.ut??=[],a=[];let f,l,p=0,h=i.length-1,v=0,b=o.length-1;for(;p<=h&&v<=b;)if(i[p]===null)p++;else if(i[h]===null)h--;else if(c[p]===r[v])a[v]=Ue(i[p],o[v]),p++,v++;else if(c[h]===r[b])a[b]=Ue(i[h],o[b]),h--,b--;else if(c[p]===r[b])a[b]=Ue(i[p],o[b]),xt(e,a[b+1],i[p]),p++,b--;else if(c[h]===r[v])a[v]=Ue(i[h],o[v]),xt(e,i[p],i[h]),h--,v++;else if(f===void 0&&(f=So(r,v,b),l=So(c,p,h)),f.has(c[p]))if(f.has(c[h])){const k=l.get(r[v]),A=k!==void 0?i[k]:null;if(A===null){const I=xt(e,i[p]);Ue(I,o[v]),a[v]=I}else a[v]=Ue(A,o[v]),xt(e,i[p],A),i[k]=null;v++}else ls(i[h]),h--;else ls(i[p]),p++;for(;v<=b;){const k=xt(e,a[b+1]);Ue(k,o[v]),a[v++]=k}for(;p<=h;){const k=i[p++];k!==null&&ls(k)}return this.ut=r,nu(e,a),Me}});function da(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,o=Array.isArray(i)?i:null,r=Array.isArray(o)&&o.some(h=>{const v=h;return String(v.type??"").toLowerCase()==="text"&&typeof v.text=="string"&&v.text.trim().length>0}),c=Array.isArray(o)&&o.some(h=>{const v=h,b=String(v.type??"").toLowerCase();return b==="toolcall"||b==="tool_call"||b==="tooluse"||b==="tool_use"||b==="toolresult"||b==="tool_result"||b==="tool_call"||b==="tool_result"||typeof v.name=="string"&&v.arguments!=null}),a=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||a||c&&!r)&&(n="toolResult");let f=[];typeof t.content=="string"?f=[{type:"text",text:t.content}]:Array.isArray(t.content)?f=t.content.map(h=>({type:h.type||"text",text:h.text,name:h.name,args:h.args||h.arguments})):typeof t.text=="string"&&(f=[{type:"text",text:t.text}]);const l=typeof t.timestamp=="number"?t.timestamp:Date.now(),p=typeof t.id=="string"?t.id:void 0;return{role:n,content:f,timestamp:l,id:p}}function ui(e){const t=e.toLowerCase();return t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"||t==="toolresult"?"tool":t==="assistant"?"assistant":t==="user"?"user":t==="system"?"system":e}function ua(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}class Cs extends la{constructor(t){if(super(t),this.it=m,t.type!==ra.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===m||t==null)return this._t=void 0,this.it=t;if(t===Me)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}Cs.directiveName="unsafeHTML",Cs.resultType=1;const Is=aa(Cs);function xo(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,s=Array(t);n<t;n++)s[n]=e[n];return s}function iu(e){if(Array.isArray(e))return e}function ou(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var s,i,o,r,c=[],a=!0,f=!1;try{if(o=(n=n.call(e)).next,t!==0)for(;!(a=(s=o.call(n)).done)&&(c.push(s.value),c.length!==t);a=!0);}catch(l){f=!0,i=l}finally{try{if(!a&&n.return!=null&&(r=n.return(),Object(r)!==r))return}finally{if(f)throw i}}return c}}function ru(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function au(e,t){return iu(e)||ou(e,t)||lu(e,t)||ru()}function lu(e,t){if(e){if(typeof e=="string")return xo(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?xo(e,t):void 0}}const pa=Object.entries,Ao=Object.setPrototypeOf,cu=Object.isFrozen,du=Object.getPrototypeOf,uu=Object.getOwnPropertyDescriptor;let X=Object.freeze,Z=Object.seal,at=Object.create,fa=typeof Reflect<"u"&&Reflect,Rs=fa.apply,Ls=fa.construct;X||(X=function(t){return t});Z||(Z=function(t){return t});Rs||(Rs=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),o=2;o<s;o++)i[o-2]=arguments[o];return t.apply(n,i)});Ls||(Ls=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const it=G(Array.prototype.forEach),pu=G(Array.prototype.lastIndexOf),_o=G(Array.prototype.pop),ot=G(Array.prototype.push),fu=G(Array.prototype.splice),Ie=Array.isArray,Ct=G(String.prototype.toLowerCase),cs=G(String.prototype.toString),To=G(String.prototype.match),At=G(String.prototype.replace),Eo=G(String.prototype.indexOf),hu=G(String.prototype.trim),gu=G(Number.prototype.toString),mu=G(Boolean.prototype.toString),Co=typeof BigInt>"u"?null:G(BigInt.prototype.toString),Io=typeof Symbol>"u"?null:G(Symbol.prototype.toString),Q=G(Object.prototype.hasOwnProperty),_t=G(Object.prototype.toString),Y=G(RegExp.prototype.test),Ke=vu(TypeError);function G(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return Rs(e,t,s)}}function vu(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return Ls(e,n)}}function P(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ct;if(Ao&&Ao(e,null),!Ie(t))return e;let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const o=n(i);o!==i&&(cu(t)||(t[s]=o),i=o)}e[i]=!0}return e}function yu(e){for(let t=0;t<e.length;t++)Q(e,t)||(e[t]=null);return e}function ee(e){const t=at(null);for(const s of pa(e)){var n=au(s,2);const i=n[0],o=n[1];Q(e,i)&&(Ie(o)?t[i]=yu(o):o&&typeof o=="object"&&o.constructor===Object?t[i]=ee(o):t[i]=o)}return t}function bu(e){switch(typeof e){case"string":return e;case"number":return gu(e);case"boolean":return mu(e);case"bigint":return Co?Co(e):"0";case"symbol":return Io?Io(e):"Symbol()";case"undefined":return _t(e);case"function":case"object":{if(e===null)return _t(e);const t=e,n=ce(t,"toString");if(typeof n=="function"){const s=n(t);return typeof s=="string"?s:_t(s)}return _t(e)}default:return _t(e)}}function ce(e,t){for(;e!==null;){const s=uu(e,t);if(s){if(s.get)return G(s.get);if(typeof s.value=="function")return G(s.value)}e=du(e)}function n(){return null}return n}function wu(e){try{return Y(e,""),!0}catch{return!1}}const Ro=X(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ds=X(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),us=X(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),$u=X(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),ps=X(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),ku=X(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Lo=X(["#text"]),Mo=X(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),fs=X(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Po=X(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),rn=X(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Su=Z(/{{[\w\W]*|^[\w\W]*}}/g),xu=Z(/<%[\w\W]*|^[\w\W]*%>/g),Au=Z(/\${[\w\W]*/g),_u=Z(/^data-[\-\w.\u00B7-\uFFFF]+$/),Tu=Z(/^aria-[\-\w]+$/),No=Z(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Eu=Z(/^(?:\w+script|data):/i),Cu=Z(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Iu=Z(/^html$/i),Ru=Z(/^[a-z][.\w]*(-[.\w]+)+$/i),Oo=Z(/<[/\w!]/g),Do=Z(/<[/\w]/g),Lu=Z(/<\/no(script|embed|frames)/i),Mu=Z(/\/>/i),re={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Pu=function(){return typeof window>"u"?null:window},Nu=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const o="dompurify"+(s?"#"+s:"");try{return t.createPolicy(o,{createHTML(r){return r},createScriptURL(r){return r}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},Fo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},Ee=function(t,n,s,i){return Q(t,n)&&Ie(t[n])?P(i.base?ee(i.base):{},t[n],i.transform):s};function ha(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Pu();const t=x=>ha(x);if(t.version="3.4.13",t.removed=[],!e||!e.document||e.document.nodeType!==re.document||!e.Element)return t.isSupported=!1,t;let n=e.document;const s=n,i=s.currentScript;e.DocumentFragment;const o=e.HTMLTemplateElement,r=e.Node,c=e.Element,a=e.NodeFilter,f=e.NamedNodeMap;f===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;const l=e.DOMParser,p=e.trustedTypes,h=c.prototype,v=ce(h,"cloneNode"),b=ce(h,"remove"),k=ce(h,"nextSibling"),A=ce(h,"childNodes"),I=ce(h,"parentNode"),M=ce(h,"shadowRoot"),O=ce(h,"attributes"),R=r&&r.prototype?ce(r.prototype,"nodeType"):null,_=r&&r.prototype?ce(r.prototype,"nodeName"):null,F=r&&r.prototype?ce(r.prototype,"ownerDocument"):null;if(typeof o=="function"){const x=n.createElement("template");x.content&&x.content.ownerDocument&&(n=x.content.ownerDocument)}let V,be="",vt,Si=!1,yt=0;const xi=function(){if(yt>0)throw Ke('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Xe=function(u){xi(),yt++;try{return V.createHTML(u)}finally{yt--}},Ka=function(u){xi(),yt++;try{return V.createScriptURL(u)}finally{yt--}},za=function(){return Si||(vt=Nu(p,i),Si=!0),vt},jt=n,Dn=jt.implementation,Ai=jt.createNodeIterator,Ha=jt.createDocumentFragment,ja=jt.getElementsByTagName,qa=s.importNode;let U=Fo();t.isSupported=typeof pa=="function"&&typeof I=="function"&&Dn&&Dn.createHTMLDocument!==void 0;const Va=Su,Wa=xu,Ga=Au,Ya=_u,Qa=Tu,Ja=Eu,_i=Cu,Xa=Ru;let Ti=No,K=null;const Fn=P({},[...Ro,...ds,...us,...ps,...Lo]);let z=null;const Bn=P({},[...Mo,...fs,...Po,...rn]);let W=Object.seal(at(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),bt=null,Ei=null;const xe=Object.seal(at(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Ci=!0,Un=!0,Ii=!1,Ri=!0,Ae=!1,_e=!0,De=!1,Kn=!1,qt=null,Vt=null,zn=!1,Ze=!1,Wt=!1,Gt=!1,Li=!0,Mi=!1;const Pi="user-content-";let Hn=!0,Yt=!1,et={},fe=null;const jn=P({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]);let Ni=null;const Oi=P({},["audio","video","img","source","image","track"]);let qn=null;const Di=P({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Qt="http://www.w3.org/1998/Math/MathML",Jt="http://www.w3.org/2000/svg",he="http://www.w3.org/1999/xhtml";let tt=he,Vn=!1,Wn=null;const Za=P({},[Qt,Jt,he],cs),Fi=X(["mi","mo","mn","ms","mtext"]);let Gn=P({},Fi);const Bi=X(["annotation-xml"]);let Yn=P({},Bi);const el=P({},["title","style","font","a","script"]);let wt=null;const tl=["application/xhtml+xml","text/html"],nl="text/html";let j=null,nt=null;const sl=n.createElement("form"),Ui=function(u){return u instanceof RegExp||u instanceof Function},Qn=function(){let u=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(nt&&nt===u)return;(!u||typeof u!="object")&&(u={}),u=ee(u),wt=tl.indexOf(u.PARSER_MEDIA_TYPE)===-1?nl:u.PARSER_MEDIA_TYPE,j=wt==="application/xhtml+xml"?cs:Ct,K=Ee(u,"ALLOWED_TAGS",Fn,{transform:j}),z=Ee(u,"ALLOWED_ATTR",Bn,{transform:j}),Wn=Ee(u,"ALLOWED_NAMESPACES",Za,{transform:cs}),qn=Ee(u,"ADD_URI_SAFE_ATTR",Di,{transform:j,base:Di}),Ni=Ee(u,"ADD_DATA_URI_TAGS",Oi,{transform:j,base:Oi}),fe=Ee(u,"FORBID_CONTENTS",jn,{transform:j}),bt=Ee(u,"FORBID_TAGS",ee({}),{transform:j}),Ei=Ee(u,"FORBID_ATTR",ee({}),{transform:j}),et=Q(u,"USE_PROFILES")?u.USE_PROFILES&&typeof u.USE_PROFILES=="object"?ee(u.USE_PROFILES):u.USE_PROFILES:!1,Ci=u.ALLOW_ARIA_ATTR!==!1,Un=u.ALLOW_DATA_ATTR!==!1,Ii=u.ALLOW_UNKNOWN_PROTOCOLS||!1,Ri=u.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ae=u.SAFE_FOR_TEMPLATES||!1,_e=u.SAFE_FOR_XML!==!1,De=u.WHOLE_DOCUMENT||!1,Ze=u.RETURN_DOM||!1,Wt=u.RETURN_DOM_FRAGMENT||!1,Gt=u.RETURN_TRUSTED_TYPE||!1,zn=u.FORCE_BODY||!1,Li=u.SANITIZE_DOM!==!1,Mi=u.SANITIZE_NAMED_PROPS||!1,Hn=u.KEEP_CONTENT!==!1,Yt=u.IN_PLACE||!1,Ti=wu(u.ALLOWED_URI_REGEXP)?u.ALLOWED_URI_REGEXP:No,tt=typeof u.NAMESPACE=="string"?u.NAMESPACE:he,Gn=Q(u,"MATHML_TEXT_INTEGRATION_POINTS")&&u.MATHML_TEXT_INTEGRATION_POINTS&&typeof u.MATHML_TEXT_INTEGRATION_POINTS=="object"?ee(u.MATHML_TEXT_INTEGRATION_POINTS):P({},Fi),Yn=Q(u,"HTML_INTEGRATION_POINTS")&&u.HTML_INTEGRATION_POINTS&&typeof u.HTML_INTEGRATION_POINTS=="object"?ee(u.HTML_INTEGRATION_POINTS):P({},Bi);const g=Q(u,"CUSTOM_ELEMENT_HANDLING")&&u.CUSTOM_ELEMENT_HANDLING&&typeof u.CUSTOM_ELEMENT_HANDLING=="object"?ee(u.CUSTOM_ELEMENT_HANDLING):at(null);if(W=at(null),Q(g,"tagNameCheck")&&Ui(g.tagNameCheck)&&(W.tagNameCheck=g.tagNameCheck),Q(g,"attributeNameCheck")&&Ui(g.attributeNameCheck)&&(W.attributeNameCheck=g.attributeNameCheck),Q(g,"allowCustomizedBuiltInElements")&&typeof g.allowCustomizedBuiltInElements=="boolean"&&(W.allowCustomizedBuiltInElements=g.allowCustomizedBuiltInElements),Z(W),Ae&&(Un=!1),Wt&&(Ze=!0),et&&(K=P({},Lo),z=at(null),et.html===!0&&(P(K,Ro),P(z,Mo)),et.svg===!0&&(P(K,ds),P(z,fs),P(z,rn)),et.svgFilters===!0&&(P(K,us),P(z,fs),P(z,rn)),et.mathMl===!0&&(P(K,ps),P(z,Po),P(z,rn))),xe.tagCheck=null,xe.attributeCheck=null,Q(u,"ADD_TAGS")&&(typeof u.ADD_TAGS=="function"?xe.tagCheck=u.ADD_TAGS:Ie(u.ADD_TAGS)&&(K===Fn&&(K=ee(K)),P(K,u.ADD_TAGS,j))),Q(u,"ADD_ATTR")&&(typeof u.ADD_ATTR=="function"?xe.attributeCheck=u.ADD_ATTR:Ie(u.ADD_ATTR)&&(z===Bn&&(z=ee(z)),P(z,u.ADD_ATTR,j))),Q(u,"ADD_URI_SAFE_ATTR")&&Ie(u.ADD_URI_SAFE_ATTR)&&P(qn,u.ADD_URI_SAFE_ATTR,j),Q(u,"FORBID_CONTENTS")&&Ie(u.FORBID_CONTENTS)&&(fe===jn&&(fe=ee(fe)),P(fe,u.FORBID_CONTENTS,j)),Q(u,"ADD_FORBID_CONTENTS")&&Ie(u.ADD_FORBID_CONTENTS)&&(fe===jn&&(fe=ee(fe)),P(fe,u.ADD_FORBID_CONTENTS,j)),Hn&&(K["#text"]=!0),De&&P(K,["html","head","body"]),K.table&&(P(K,["tbody"]),delete bt.tbody),u.TRUSTED_TYPES_POLICY){if(typeof u.TRUSTED_TYPES_POLICY.createHTML!="function")throw Ke('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof u.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Ke('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const S=V;V=u.TRUSTED_TYPES_POLICY;try{be=Xe("")}catch(E){throw V=S,E}}else u.TRUSTED_TYPES_POLICY===null?(V=void 0,be=""):(V===void 0&&(V=za()),V&&typeof be=="string"&&(be=Xe("")));X&&X(u),nt=u},Ki=P({},[...ds,...us,...$u]),zi=P({},[...ps,...ku]),il=function(u,g,S){return g.namespaceURI===he?u==="svg":g.namespaceURI===Qt?u==="svg"&&(S==="annotation-xml"||Gn[S]):!!Ki[u]},ol=function(u,g,S){return g.namespaceURI===he?u==="math":g.namespaceURI===Jt?u==="math"&&Yn[S]:!!zi[u]},rl=function(u,g,S){return g.namespaceURI===Jt&&!Yn[S]||g.namespaceURI===Qt&&!Gn[S]?!1:!zi[u]&&(el[u]||!Ki[u])},al=function(u){let g=I(u);(!g||!g.tagName)&&(g={namespaceURI:tt,tagName:"template"});const S=Ct(u.tagName),E=Ct(g.tagName);return Wn[u.namespaceURI]?u.namespaceURI===Jt?il(S,g,E):u.namespaceURI===Qt?ol(S,g,E):u.namespaceURI===he?rl(S,g,E):!!(wt==="application/xhtml+xml"&&Wn[u.namespaceURI]):!1},Te=function(u){ot(t.removed,{element:u});try{I(u).removeChild(u)}catch{if(b(u),!I(u))throw Ke("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Xt=function(u){$t(u);const g=A(u);if(g){const E=[];it(g,C=>{ot(E,C)}),it(E,C=>{try{b(C)}catch{}})}const S=O(u);if(S)for(let E=S.length-1;E>=0;--E){const C=S[E],L=C&&C.name;if(typeof L=="string")try{u.removeAttribute(L)}catch{}}},Fe=function(u,g){try{ot(t.removed,{attribute:g.getAttributeNode(u),from:g})}catch{ot(t.removed,{attribute:null,from:g})}if(g.removeAttribute(u),u==="is")if(Ze||Wt)try{Te(g)}catch{}else try{g.setAttribute(u,"")}catch{}},ll=function(u){const g=O(u);if(g)for(let S=g.length-1;S>=0;--S){const E=g[S],C=E&&E.name;if(!(typeof C!="string"||z[j(C)]))try{u.removeAttribute(C)}catch{}}},$t=function(u){const g=[u];for(;g.length>0;){const S=g.pop();(R?R(S):S.nodeType)===re.element&&ll(S);const C=A(S);if(C)for(let L=C.length-1;L>=0;--L)g.push(C[L])}},cl=function(u){if(!_e)return;const g=[u];for(;g.length>0;){const S=g.pop(),E=R?R(S):S.nodeType;if(E===re.processingInstruction||E===re.comment&&Y(Do,S.data)){try{b(S)}catch{}continue}if(E===re.element){const L=S,B=j(_?_(S):S.nodeName);try{L.hasAttribute&&L.hasAttribute("patchsrc")&&L.removeAttribute("patchsrc"),L.hasAttribute&&L.hasAttribute("for")&&B!=="label"&&B!=="output"&&L.removeAttribute("for")}catch{}}const C=A(S);if(C)for(let L=C.length-1;L>=0;--L)g.push(C[L])}},Hi=function(u){let g=null,S=null;if(zn)u="<remove></remove>"+u;else{const L=To(u,/^[\r\n\t ]+/);S=L&&L[0]}wt==="application/xhtml+xml"&&tt===he&&(u='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+u+"</body></html>");const E=V?Xe(u):u;if(tt===he)try{g=new l().parseFromString(E,wt)}catch{}if(!g||!g.documentElement){g=Dn.createDocument(tt,"template",null);try{g.documentElement.innerHTML=Vn?be:E}catch{}}const C=g.body||g.documentElement;return u&&S&&C.insertBefore(n.createTextNode(S),C.childNodes[0]||null),tt===he?ja.call(g,De?"html":"body")[0]:De?g.documentElement:C},ji=function(u){const g=F?F(u):u.ownerDocument;return Ai.call(g||u,u,a.SHOW_ELEMENT|a.SHOW_COMMENT|a.SHOW_TEXT|a.SHOW_PROCESSING_INSTRUCTION|a.SHOW_CDATA_SECTION,null)},Zt=function(u){return u=At(u,Va," "),u=At(u,Wa," "),u=At(u,Ga," "),u},Jn=function(u){var g;u.normalize();const S=F?F(u):u.ownerDocument,E=Ai.call(S||u,u,a.SHOW_TEXT|a.SHOW_COMMENT|a.SHOW_CDATA_SECTION|a.SHOW_PROCESSING_INSTRUCTION,null);let C=E.nextNode();for(;C;)C.data=Zt(C.data),C=E.nextNode();const L=(g=u.querySelectorAll)===null||g===void 0?void 0:g.call(u,"template");L&&it(L,B=>{st(B.content)&&Jn(B.content)})},en=function(u){const g=_?_(u):null;return typeof g!="string"||j(g)!=="form"?!1:typeof u.nodeName!="string"||typeof u.textContent!="string"||typeof u.removeChild!="function"||u.attributes!==O(u)||typeof u.removeAttribute!="function"||typeof u.setAttribute!="function"||typeof u.namespaceURI!="string"||typeof u.insertBefore!="function"||typeof u.hasChildNodes!="function"||u.nodeType!==R(u)||u.childNodes!==A(u)},st=function(u){if(!R||typeof u!="object"||u===null)return!1;try{return R(u)===re.documentFragment}catch{return!1}},kt=function(u){if(!R||typeof u!="object"||u===null)return!1;try{return typeof R(u)=="number"}catch{return!1}};function ge(x,u,g){x.length!==0&&it(x,S=>{S.call(t,u,g,nt)})}const dl=function(u,g){return!!(_e&&u.hasChildNodes()&&!kt(u.firstElementChild)&&Y(Oo,u.textContent)&&Y(Oo,u.innerHTML)||_e&&u.namespaceURI===he&&g==="style"&&kt(u.firstElementChild)||u.nodeType===re.processingInstruction||_e&&u.nodeType===re.comment&&Y(Do,u.data))},ul=function(u,g,S){if(!bt[g]&&Gi(g)&&(W.tagNameCheck instanceof RegExp&&Y(W.tagNameCheck,g)||W.tagNameCheck instanceof Function&&W.tagNameCheck(g)))return!1;if(Hn&&!fe[g]){const E=I(u),C=A(u);if(C&&E){const L=C.length;for(let B=L-1;B>=0;--B){const q=u===S?v(C[B],!0):C[B];E.insertBefore(q,k(u))}}}return Te(u),!0},qi=function(u,g,S,E){return u.length===0?g:g===S||g===E?ee(g):g},Vi=function(u,g){if(ge(U.beforeSanitizeElements,u,null),u!==g&&I(u)===null)return Yt&&$t(u),!0;if(en(u))return Te(u),!0;const S=j(_?_(u):u.nodeName);if(K=qi(U.uponSanitizeElement,K,Fn,qt),ge(U.uponSanitizeElement,u,{tagName:S,allowedTags:K}),u!==g&&I(u)===null)return Yt&&$t(u),!0;if(dl(u,S))return Te(u),!0;if(bt[S]||!(xe.tagCheck instanceof Function&&xe.tagCheck(S))&&!K[S]){const C=ul(u,S,g);return C===!1&&ge(U.afterSanitizeElements,u,null),C}if((R?R(u):u.nodeType)===re.element&&!al(u)||(S==="noscript"||S==="noembed"||S==="noframes")&&Y(Lu,u.innerHTML))return Te(u),!0;if(Ae&&u.nodeType===re.text){const C=Zt(u.textContent);u.textContent!==C&&(ot(t.removed,{element:u.cloneNode()}),u.textContent=C)}return ge(U.afterSanitizeElements,u,null),!1},Wi=function(u,g,S){if(Ei[g]||_e&&g==="patchsrc"||_e&&g==="for"&&u!=="label"&&u!=="output"||Li&&(g==="id"||g==="name")&&(S in n||S in sl))return!1;const E=z[g]||xe.attributeCheck instanceof Function&&xe.attributeCheck(g,u);if(!(Un&&Y(Ya,g))){if(!(Ci&&Y(Qa,g))){if(E){if(!qn[g]){if(!Y(Ti,At(S,_i,""))){if(!((g==="src"||g==="xlink:href"||g==="href")&&u!=="script"&&Eo(S,"data:")===0&&Ni[u])){if(!(Ii&&!Y(Ja,At(S,_i,"")))){if(S)return!1}}}}}else if(!(Gi(u)&&(W.tagNameCheck instanceof RegExp&&Y(W.tagNameCheck,u)||W.tagNameCheck instanceof Function&&W.tagNameCheck(u))&&(W.attributeNameCheck instanceof RegExp&&Y(W.attributeNameCheck,g)||W.attributeNameCheck instanceof Function&&W.attributeNameCheck(g,u))||g==="is"&&W.allowCustomizedBuiltInElements&&(W.tagNameCheck instanceof RegExp&&Y(W.tagNameCheck,S)||W.tagNameCheck instanceof Function&&W.tagNameCheck(S))))return!1}}return!0},pl=P({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Gi=function(u){return!pl[Ct(u)]&&Y(Xa,u)},fl=function(u,g,S,E){if(V&&typeof p=="object"&&typeof p.getAttributeType=="function"&&!S)switch(p.getAttributeType(u,g)){case"TrustedHTML":return Xe(E);case"TrustedScriptURL":return Ka(E)}return E},hl=function(u,g,S,E){try{S?u.setAttributeNS(S,g,E):u.setAttribute(g,E),en(u)?Te(u):_o(t.removed)}catch{Fe(g,u)}},Yi=function(u){ge(U.beforeSanitizeAttributes,u,null);const g=u.attributes;if(!g||en(u))return;z=qi(U.uponSanitizeAttribute,z,Bn,Vt);const S={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:z,forceKeepAttr:void 0};let E=g.length;const C=j(u.nodeName);for(;E--;){const L=g[E],B=L.name,q=L.namespaceURI,ie=L.value,oe=j(B),Zn=ie;let ne=B==="value"?Zn:hu(Zn);if(S.attrName=oe,S.attrValue=ne,S.keepAttr=!0,S.forceKeepAttr=void 0,ge(U.uponSanitizeAttribute,u,S),ne=S.attrValue,Mi&&(oe==="id"||oe==="name")&&Eo(ne,Pi)!==0&&(Fe(B,u),ne=Pi+ne),_e&&Y(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,ne)){Fe(B,u);continue}if(oe==="attributename"&&To(ne,"href")){Fe(B,u);continue}if(!S.forceKeepAttr){if(!S.keepAttr){Fe(B,u);continue}if(!Ri&&Y(Mu,ne)){Fe(B,u);continue}if(Ae&&(ne=Zt(ne)),!Wi(C,oe,ne)){Fe(B,u);continue}ne=fl(C,oe,q,ne),ne!==Zn&&hl(u,B,q,ne)}}ge(U.afterSanitizeAttributes,u,null)},tn=function(u){let g=null;const S=ji(u);for(ge(U.beforeSanitizeShadowDOM,u,null);g=S.nextNode();)if(ge(U.uponSanitizeShadowNode,g,null),Vi(g,u),Yi(g),st(g.content)&&tn(g.content),(R?R(g):g.nodeType)===re.element){const C=M(g);st(C)&&(Xn(C),tn(C))}ge(U.afterSanitizeShadowDOM,u,null)},Xn=function(u){const g=[{node:u,shadow:null}];for(;g.length>0;){const S=g.pop();if(S.shadow){tn(S.shadow);continue}const E=S.node,L=(R?R(E):E.nodeType)===re.element,B=A(E);if(B)for(let q=B.length-1;q>=0;--q)g.push({node:B[q],shadow:null});if(L){const q=_?_(E):null;if(typeof q=="string"&&j(q)==="template"){const ie=E.content;st(ie)&&g.push({node:ie,shadow:null})}}if(L){const q=M(E);st(q)&&g.push({node:null,shadow:q},{node:q,shadow:null})}}};return t.sanitize=function(x){let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},g=null,S=null,E=null,C=null;if(Vn=!x,Vn&&(x="<!-->"),typeof x!="string"&&!kt(x)&&(x=bu(x),typeof x!="string"))throw Ke("dirty is not a string, aborting");if(!t.isSupported)return x;Kn?(K=qt,z=Vt):Qn(u),(U.uponSanitizeElement.length>0||U.uponSanitizeAttribute.length>0)&&(K=ee(K)),U.uponSanitizeAttribute.length>0&&(z=ee(z)),t.removed=[];const L=Yt&&typeof x!="string"&&kt(x);if(L){cl(x);const ie=_?_(x):x.nodeName;if(typeof ie=="string"){const oe=j(ie);if(!K[oe]||bt[oe])throw Xt(x),Ke("root node is forbidden and cannot be sanitized in-place")}if(en(x))throw Xt(x),Ke("root node is clobbered and cannot be sanitized in-place");try{Xn(x)}catch(oe){throw Xt(x),oe}}else if(kt(x))g=Hi("<!---->"),S=g.ownerDocument.importNode(x,!0),S.nodeType===re.element&&S.nodeName==="BODY"||S.nodeName==="HTML"?g=S:g.appendChild(S),Xn(S);else{if(!Ze&&!Ae&&!De&&x.indexOf("<")===-1)return V&&Gt?Xe(x):x;if(g=Hi(x),!g)return Ze?null:Gt?be:""}g&&zn&&Te(g.firstChild);const B=L?x:g;try{const ie=ji(B);for(;E=ie.nextNode();)Vi(E,B),Yi(E),st(E.content)&&tn(E.content)}catch(ie){throw L&&(Xt(x),it(t.removed,oe=>{oe.element&&$t(oe.element)})),ie}if(L)return it(t.removed,ie=>{ie.element&&$t(ie.element)}),Ae&&Jn(x),x;if(Ze){if(Ae&&Jn(g),Wt)for(C=Ha.call(g.ownerDocument);g.firstChild;)C.appendChild(g.firstChild);else C=g;return(z.shadowroot||z.shadowrootmode)&&(C=qa.call(s,C,!0)),C}let q=De?g.outerHTML:g.innerHTML;return De&&K["!doctype"]&&g.ownerDocument&&g.ownerDocument.doctype&&g.ownerDocument.doctype.name&&Y(Iu,g.ownerDocument.doctype.name)&&(q="<!DOCTYPE "+g.ownerDocument.doctype.name+`>
`+q),Ae&&(q=Zt(q)),V&&Gt?Xe(q):q},t.setConfig=function(){let x=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Qn(x),Kn=!0,qt=K,Vt=z},t.clearConfig=function(){nt=null,Kn=!1,qt=null,Vt=null,V=vt,be=""},t.isValidAttribute=function(x,u,g){nt||Qn({});const S=j(x),E=j(u);return Wi(S,E,g)},t.addHook=function(x,u){typeof u=="function"&&Q(U,x)&&ot(U[x],u)},t.removeHook=function(x,u){if(Q(U,x)){if(u!==void 0){const g=pu(U[x],u);return g===-1?void 0:fu(U[x],g,1)[0]}return _o(U[x])}},t.removeHooks=function(x){Q(U,x)&&(U[x]=[])},t.removeAllHooks=function(){U=Fo()},t}var Ms=ha();function pi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Je=pi();function ga(e){Je=e}var je={exec:()=>null};function N(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(i,o)=>{let r=typeof o=="string"?o:o.source;return r=r.replace(se.caret,"$1"),n=n.replace(i,r),s},getRegex:()=>new RegExp(n,t)};return s}var Ou=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),se={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},Du=/^(?:[ \t]*(?:\n|$))+/,Fu=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Bu=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ht=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Uu=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,fi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,ma=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,va=N(ma).replace(/bull/g,fi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ku=N(ma).replace(/bull/g,fi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),hi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,zu=/^[^\n]+/,gi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Hu=N(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",gi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ju=N(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,fi).getRegex(),Mn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",mi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,qu=N("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",mi).replace("tag",Mn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ya=N(hi).replace("hr",Ht).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Mn).getRegex(),Vu=N(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ya).getRegex(),vi={blockquote:Vu,code:Fu,def:Hu,fences:Bu,heading:Uu,hr:Ht,html:qu,lheading:va,list:ju,newline:Du,paragraph:ya,table:je,text:zu},Bo=N("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ht).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Mn).getRegex(),Wu={...vi,lheading:Ku,table:Bo,paragraph:N(hi).replace("hr",Ht).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Bo).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Mn).getRegex()},Gu={...vi,html:N(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",mi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:je,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:N(hi).replace("hr",Ht).replace("heading",` *#{1,6} *[^
]`).replace("lheading",va).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Yu=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Qu=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ba=/^( {2,}|\\)\n(?!\s*$)/,Ju=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,mt=/[\p{P}\p{S}]/u,Pn=/[\s\p{P}\p{S}]/u,yi=/[^\s\p{P}\p{S}]/u,Xu=N(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Pn).getRegex(),wa=/(?!~)[\p{P}\p{S}]/u,Zu=/(?!~)[\s\p{P}\p{S}]/u,ep=/(?:[^\s\p{P}\p{S}]|~)/u,tp=N(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ou?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),$a=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,np=N($a,"u").replace(/punct/g,mt).getRegex(),sp=N($a,"u").replace(/punct/g,wa).getRegex(),ka="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ip=N(ka,"gu").replace(/notPunctSpace/g,yi).replace(/punctSpace/g,Pn).replace(/punct/g,mt).getRegex(),op=N(ka,"gu").replace(/notPunctSpace/g,ep).replace(/punctSpace/g,Zu).replace(/punct/g,wa).getRegex(),rp=N("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,yi).replace(/punctSpace/g,Pn).replace(/punct/g,mt).getRegex(),ap=N(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,mt).getRegex(),lp="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",cp=N(lp,"gu").replace(/notPunctSpace/g,yi).replace(/punctSpace/g,Pn).replace(/punct/g,mt).getRegex(),dp=N(/\\(punct)/,"gu").replace(/punct/g,mt).getRegex(),up=N(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),pp=N(mi).replace("(?:-->|$)","-->").getRegex(),fp=N("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",pp).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),vn=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,hp=N(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",vn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Sa=N(/^!?\[(label)\]\[(ref)\]/).replace("label",vn).replace("ref",gi).getRegex(),xa=N(/^!?\[(ref)\](?:\[\])?/).replace("ref",gi).getRegex(),gp=N("reflink|nolink(?!\\()","g").replace("reflink",Sa).replace("nolink",xa).getRegex(),Uo=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,bi={_backpedal:je,anyPunctuation:dp,autolink:up,blockSkip:tp,br:ba,code:Qu,del:je,delLDelim:je,delRDelim:je,emStrongLDelim:np,emStrongRDelimAst:ip,emStrongRDelimUnd:rp,escape:Yu,link:hp,nolink:xa,punctuation:Xu,reflink:Sa,reflinkSearch:gp,tag:fp,text:Ju,url:je},mp={...bi,link:N(/^!?\[(label)\]\((.*?)\)/).replace("label",vn).getRegex(),reflink:N(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",vn).getRegex()},Ps={...bi,emStrongRDelimAst:op,emStrongLDelim:sp,delLDelim:ap,delRDelim:cp,url:N(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Uo).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:N(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Uo).getRegex()},vp={...Ps,br:N(ba).replace("{2,}","*").getRegex(),text:N(Ps.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},an={normal:vi,gfm:Wu,pedantic:Gu},Tt={normal:bi,gfm:Ps,breaks:vp,pedantic:mp},yp={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ko=e=>yp[e];function ve(e,t){if(t){if(se.escapeTest.test(e))return e.replace(se.escapeReplace,Ko)}else if(se.escapeTestNoEncode.test(e))return e.replace(se.escapeReplaceNoEncode,Ko);return e}function zo(e){try{e=encodeURI(e).replace(se.percentDecode,"%")}catch{return null}return e}function Ho(e,t){let n=e.replace(se.findPipe,(o,r,c)=>{let a=!1,f=r;for(;--f>=0&&c[f]==="\\";)a=!a;return a?"|":" |"}),s=n.split(se.splitPipe),i=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(se.slashPipe,"|");return s}function Et(e,t,n){let s=e.length;if(s===0)return"";let i=0;for(;i<s&&e.charAt(s-i-1)===t;)i++;return e.slice(0,s-i)}function bp(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function wp(e,t=0){let n=t,s="";for(let i of e)if(i==="	"){let o=4-n%4;s+=" ".repeat(o),n+=o}else s+=i,n++;return s}function jo(e,t,n,s,i){let o=t.href,r=t.title||null,c=e[1].replace(i.other.outputLinkReplace,"$1");s.state.inLink=!0;let a={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:o,title:r,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,a}function $p(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let i=s[1];return t.split(`
`).map(o=>{let r=o.match(n.other.beginningSpace);if(r===null)return o;let[c]=r;return c.length>=i.length?o.slice(i.length):o}).join(`
`)}var yn=class{options;rules;lexer;constructor(e){this.options=e||Je}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Et(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=$p(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=Et(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Et(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Et(t[0],`
`).split(`
`),s="",i="",o=[];for(;n.length>0;){let r=!1,c=[],a;for(a=0;a<n.length;a++)if(this.rules.other.blockquoteStart.test(n[a]))c.push(n[a]),r=!0;else if(!r)c.push(n[a]);else break;n=n.slice(a);let f=c.join(`
`),l=f.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${f}`:f,i=i?`${i}
${l}`:l;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(l,o,!0),this.lexer.state.top=p,n.length===0)break;let h=o.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let v=h,b=v.raw+`
`+n.join(`
`),k=this.blockquote(b);o[o.length-1]=k,s=s.substring(0,s.length-v.raw.length)+k.raw,i=i.substring(0,i.length-v.text.length)+k.text;break}else if(h?.type==="list"){let v=h,b=v.raw+`
`+n.join(`
`),k=this.list(b);o[o.length-1]=k,s=s.substring(0,s.length-h.raw.length)+k.raw,i=i.substring(0,i.length-v.raw.length)+k.raw,n=b.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:o,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,i={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let o=this.rules.other.listItemRegex(n),r=!1;for(;e;){let a=!1,f="",l="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;f=t[0],e=e.substring(f.length);let p=wp(t[2].split(`
`,1)[0],t[1].length),h=e.split(`
`,1)[0],v=!p.trim(),b=0;if(this.options.pedantic?(b=2,l=p.trimStart()):v?b=t[1].length+1:(b=p.search(this.rules.other.nonSpaceChar),b=b>4?1:b,l=p.slice(b),b+=t[1].length),v&&this.rules.other.blankLine.test(h)&&(f+=h+`
`,e=e.substring(h.length+1),a=!0),!a){let k=this.rules.other.nextBulletRegex(b),A=this.rules.other.hrRegex(b),I=this.rules.other.fencesBeginRegex(b),M=this.rules.other.headingBeginRegex(b),O=this.rules.other.htmlBeginRegex(b),R=this.rules.other.blockquoteBeginRegex(b);for(;e;){let _=e.split(`
`,1)[0],F;if(h=_,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),F=h):F=h.replace(this.rules.other.tabCharGlobal,"    "),I.test(h)||M.test(h)||O.test(h)||R.test(h)||k.test(h)||A.test(h))break;if(F.search(this.rules.other.nonSpaceChar)>=b||!h.trim())l+=`
`+F.slice(b);else{if(v||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||I.test(p)||M.test(p)||A.test(p))break;l+=`
`+h}v=!h.trim(),f+=_+`
`,e=e.substring(_.length+1),p=F.slice(b)}}i.loose||(r?i.loose=!0:this.rules.other.doubleBlankLine.test(f)&&(r=!0)),i.items.push({type:"list_item",raw:f,task:!!this.options.gfm&&this.rules.other.listIsTask.test(l),loose:!1,text:l,tokens:[]}),i.raw+=f}let c=i.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let a of i.items){if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),a.task){if(a.text=a.text.replace(this.rules.other.listReplaceTask,""),a.tokens[0]?.type==="text"||a.tokens[0]?.type==="paragraph"){a.tokens[0].raw=a.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),a.tokens[0].text=a.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let l=this.lexer.inlineQueue.length-1;l>=0;l--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[l].src)){this.lexer.inlineQueue[l].src=this.lexer.inlineQueue[l].src.replace(this.rules.other.listReplaceTask,"");break}}let f=this.rules.other.listTaskCheckbox.exec(a.raw);if(f){let l={type:"checkbox",raw:f[0]+" ",checked:f[0]!=="[ ]"};a.checked=l.checked,i.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=l.raw+a.tokens[0].raw,a.tokens[0].text=l.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(l)):a.tokens.unshift({type:"paragraph",raw:l.raw,text:l.raw,tokens:[l]}):a.tokens.unshift(l)}}if(!i.loose){let f=a.tokens.filter(p=>p.type==="space"),l=f.length>0&&f.some(p=>this.rules.other.anyLine.test(p.raw));i.loose=l}}if(i.loose)for(let a of i.items){a.loose=!0;for(let f of a.tokens)f.type==="text"&&(f.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Ho(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let r of s)this.rules.other.tableAlignRight.test(r)?o.align.push("right"):this.rules.other.tableAlignCenter.test(r)?o.align.push("center"):this.rules.other.tableAlignLeft.test(r)?o.align.push("left"):o.align.push(null);for(let r=0;r<n.length;r++)o.header.push({text:n[r],tokens:this.lexer.inline(n[r]),header:!0,align:o.align[r]});for(let r of i)o.rows.push(Ho(r,o.header.length).map((c,a)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:o.align[a]})));return o}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let o=Et(n.slice(0,-1),"\\");if((n.length-o.length)%2===0)return}else{let o=bp(t[2],"()");if(o===-2)return;if(o>-1){let r=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,r).trim(),t[3]=""}}let s=t[2],i="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(s);o&&(s=o[1],i=o[3])}else i=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),jo(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[s.toLowerCase()];if(!i){let o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return jo(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||!s[1]&&!s[2]&&!s[3]&&!s[4]||s[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[3])||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,o,r,c=i,a=0,f=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(f.lastIndex=0,t=t.slice(-1*e.length+i);(s=f.exec(t))!==null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o)continue;if(r=[...o].length,s[3]||s[4]){c+=r;continue}else if((s[5]||s[6])&&i%3&&!((i+r)%3)){a+=r;continue}if(c-=r,c>0)continue;r=Math.min(r,r+c+a);let l=[...s[0]][0].length,p=e.slice(0,i+s.index+l+r);if(Math.min(i,r)%2){let v=p.slice(1,-1);return{type:"em",raw:p,text:v,tokens:this.lexer.inlineTokens(v)}}let h=p.slice(2,-2);return{type:"strong",raw:p,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,o,r,c=i,a=this.rules.inline.delRDelim;for(a.lastIndex=0,t=t.slice(-1*e.length+i);(s=a.exec(t))!==null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o||(r=[...o].length,r!==i))continue;if(s[3]||s[4]){c+=r;continue}if(c-=r,c>0)continue;r=Math.min(r,r+c);let f=[...s[0]][0].length,l=e.slice(0,i+s.index+f+r),p=l.slice(i,-i);return{type:"del",raw:l,text:p,tokens:this.lexer.inlineTokens(p)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},de=class Ns{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Je,this.options.tokenizer=this.options.tokenizer||new yn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:se,block:an.normal,inline:Tt.normal};this.options.pedantic?(n.block=an.pedantic,n.inline=Tt.pedantic):this.options.gfm&&(n.block=an.gfm,this.options.breaks?n.inline=Tt.breaks:n.inline=Tt.gfm),this.tokenizer.rules=n}static get rules(){return{block:an,inline:Tt}}static lex(t,n){return new Ns(n).lex(t)}static lexInline(t,n){return new Ns(n).inlineTokens(t)}lex(t){t=t.replace(se.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(se.tabCharGlobal,"    ").replace(se.spaceLine,""));t;){let i;if(this.options.extensions?.block?.some(r=>(i=r.call({lexer:this},t,n))?(t=t.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(t)){t=t.substring(i.raw.length);let r=n.at(-1);i.raw.length===1&&r!==void 0?r.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(t)){t=t.substring(i.raw.length);let r=n.at(-1);r?.type==="paragraph"||r?.type==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+i.raw,r.text+=`
`+i.text,this.inlineQueue.at(-1).src=r.text):n.push(i);continue}if(i=this.tokenizer.fences(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(t)){t=t.substring(i.raw.length);let r=n.at(-1);r?.type==="paragraph"||r?.type==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+i.raw,r.text+=`
`+i.raw,this.inlineQueue.at(-1).src=r.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(t)){t=t.substring(i.raw.length),n.push(i);continue}let o=t;if(this.options.extensions?.startBlock){let r=1/0,c=t.slice(1),a;this.options.extensions.startBlock.forEach(f=>{a=f.call({lexer:this},c),typeof a=="number"&&a>=0&&(r=Math.min(r,a))}),r<1/0&&r>=0&&(o=t.substring(0,r+1))}if(this.state.top&&(i=this.tokenizer.paragraph(o))){let r=n.at(-1);s&&r?.type==="paragraph"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+i.raw,r.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):n.push(i),s=o.length!==t.length,t=t.substring(i.raw.length);continue}if(i=this.tokenizer.text(t)){t=t.substring(i.raw.length);let r=n.at(-1);r?.type==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+i.raw,r.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):n.push(i);continue}if(t){let r="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(r);break}else throw new Error(r)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){this.tokenizer.lexer=this;let s=t,i=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!==null;)a.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!==null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let o;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!==null;)o=i[2]?i[2].length:0,s=s.slice(0,i.index+o)+"["+"a".repeat(i[0].length-o-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let r=!1,c="";for(;t;){r||(c=""),r=!1;let a;if(this.options.extensions?.inline?.some(l=>(a=l.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.escape(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.tag(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.link(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(a.raw.length);let l=n.at(-1);a.type==="text"&&l?.type==="text"?(l.raw+=a.raw,l.text+=a.text):n.push(a);continue}if(a=this.tokenizer.emStrong(t,s,c)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.codespan(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.br(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.del(t,s,c)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.autolink(t)){t=t.substring(a.raw.length),n.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(t))){t=t.substring(a.raw.length),n.push(a);continue}let f=t;if(this.options.extensions?.startInline){let l=1/0,p=t.slice(1),h;this.options.extensions.startInline.forEach(v=>{h=v.call({lexer:this},p),typeof h=="number"&&h>=0&&(l=Math.min(l,h))}),l<1/0&&l>=0&&(f=t.substring(0,l+1))}if(a=this.tokenizer.inlineText(f)){t=t.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(c=a.raw.slice(-1)),r=!0;let l=n.at(-1);l?.type==="text"?(l.raw+=a.raw,l.text+=a.text):n.push(a);continue}if(t){let l="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return n}},bn=class{options;parser;constructor(e){this.options=e||Je}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(se.notSpaceStart)?.[0],i=e.replace(se.endingNewline,"")+`
`;return s?'<pre><code class="language-'+ve(s)+'">'+(n?i:ve(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:ve(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let r=0;r<e.items.length;r++){let c=e.items[r];s+=this.listitem(c)}let i=t?"ol":"ul",o=t&&n!==1?' start="'+n+'"':"";return"<"+i+o+`>
`+s+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let s="";for(let i=0;i<e.rows.length;i++){let o=e.rows[i];n="";for(let r=0;r<o.length;r++)n+=this.tablecell(o[r]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ve(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),i=zo(e);if(i===null)return s;e=i;let o='<a href="'+e+'"';return t&&(o+=' title="'+ve(t)+'"'),o+=">"+s+"</a>",o}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let i=zo(e);if(i===null)return ve(n);e=i;let o=`<img src="${e}" alt="${ve(n)}"`;return t&&(o+=` title="${ve(t)}"`),o+=">",o}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ve(e.text)}},wi=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},ue=class Os{options;renderer;textRenderer;constructor(t){this.options=t||Je,this.options.renderer=this.options.renderer||new bn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new wi}static parse(t,n){return new Os(n).parse(t)}static parseInline(t,n){return new Os(n).parseInline(t)}parse(t){this.renderer.parser=this;let n="";for(let s=0;s<t.length;s++){let i=t[s];if(this.options.extensions?.renderers?.[i.type]){let r=i,c=this.options.extensions.renderers[r.type].call({parser:this},r);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(r.type)){n+=c||"";continue}}let o=i;switch(o.type){case"space":{n+=this.renderer.space(o);break}case"hr":{n+=this.renderer.hr(o);break}case"heading":{n+=this.renderer.heading(o);break}case"code":{n+=this.renderer.code(o);break}case"table":{n+=this.renderer.table(o);break}case"blockquote":{n+=this.renderer.blockquote(o);break}case"list":{n+=this.renderer.list(o);break}case"checkbox":{n+=this.renderer.checkbox(o);break}case"html":{n+=this.renderer.html(o);break}case"def":{n+=this.renderer.def(o);break}case"paragraph":{n+=this.renderer.paragraph(o);break}case"text":{n+=this.renderer.text(o);break}default:{let r='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}parseInline(t,n=this.renderer){this.renderer.parser=this;let s="";for(let i=0;i<t.length;i++){let o=t[i];if(this.options.extensions?.renderers?.[o.type]){let c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){s+=c||"";continue}}let r=o;switch(r.type){case"escape":{s+=n.text(r);break}case"html":{s+=n.html(r);break}case"link":{s+=n.link(r);break}case"image":{s+=n.image(r);break}case"checkbox":{s+=n.checkbox(r);break}case"strong":{s+=n.strong(r);break}case"em":{s+=n.em(r);break}case"codespan":{s+=n.codespan(r);break}case"br":{s+=n.br(r);break}case"del":{s+=n.del(r);break}case"text":{s+=n.text(r);break}default:{let c='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},It=class{options;block;constructor(e){this.options=e||Je}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?de.lex:de.lexInline}provideParser(e=this.block){return e?ue.parse:ue.parseInline}},kp=class{defaults=pi();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ue;Renderer=bn;TextRenderer=wi;Lexer=de;Tokenizer=yn;Hooks=It;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let i=s;for(let o of i.header)n=n.concat(this.walkTokens(o.tokens,t));for(let o of i.rows)for(let r of o)n=n.concat(this.walkTokens(r.tokens,t));break}case"list":{let i=s;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=s;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{let r=i[o].flat(1/0);n=n.concat(this.walkTokens(r,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let o=t.renderers[i.name];o?t.renderers[i.name]=function(...r){let c=i.renderer.apply(this,r);return c===!1&&(c=o.apply(this,r)),c}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=t[i.level];o?o.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),s.extensions=t),n.renderer){let i=this.defaults.renderer||new bn(this.defaults);for(let o in n.renderer){if(!(o in i))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let r=o,c=n.renderer[r],a=i[r];i[r]=(...f)=>{let l=c.apply(i,f);return l===!1&&(l=a.apply(i,f)),l||""}}s.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new yn(this.defaults);for(let o in n.tokenizer){if(!(o in i))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let r=o,c=n.tokenizer[r],a=i[r];i[r]=(...f)=>{let l=c.apply(i,f);return l===!1&&(l=a.apply(i,f)),l}}s.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new It;for(let o in n.hooks){if(!(o in i))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let r=o,c=n.hooks[r],a=i[r];It.passThroughHooks.has(o)?i[r]=f=>{if(this.defaults.async&&It.passThroughHooksRespectAsync.has(o))return(async()=>{let p=await c.call(i,f);return a.call(i,p)})();let l=c.call(i,f);return a.call(i,l)}:i[r]=(...f)=>{if(this.defaults.async)return(async()=>{let p=await c.apply(i,f);return p===!1&&(p=await a.apply(i,f)),p})();let l=c.apply(i,f);return l===!1&&(l=a.apply(i,f)),l}}s.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,o=n.walkTokens;s.walkTokens=function(r){let c=[];return c.push(o.call(this,r)),i&&(c=c.concat(i.call(this,r))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return de.lex(e,t??this.defaults)}parser(e,t){return ue.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},i={...this.defaults,...s},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let r=i.hooks?await i.hooks.preprocess(t):t,c=await(i.hooks?await i.hooks.provideLexer(e):e?de.lex:de.lexInline)(r,i),a=i.hooks?await i.hooks.processAllTokens(c):c;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let f=await(i.hooks?await i.hooks.provideParser(e):e?ue.parse:ue.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(f):f})().catch(o);try{i.hooks&&(t=i.hooks.preprocess(t));let r=(i.hooks?i.hooks.provideLexer(e):e?de.lex:de.lexInline)(t,i);i.hooks&&(r=i.hooks.processAllTokens(r)),i.walkTokens&&this.walkTokens(r,i.walkTokens);let c=(i.hooks?i.hooks.provideParser(e):e?ue.parse:ue.parseInline)(r,i);return i.hooks&&(c=i.hooks.postprocess(c)),c}catch(r){return o(r)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+ve(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Qe=new kp;function D(e,t){return Qe.parse(e,t)}D.options=D.setOptions=function(e){return Qe.setOptions(e),D.defaults=Qe.defaults,ga(D.defaults),D};D.getDefaults=pi;D.defaults=Je;D.use=function(...e){return Qe.use(...e),D.defaults=Qe.defaults,ga(D.defaults),D};D.walkTokens=function(e,t){return Qe.walkTokens(e,t)};D.parseInline=Qe.parseInline;D.Parser=ue;D.parser=ue.parse;D.Renderer=bn;D.TextRenderer=wi;D.Lexer=de;D.lexer=de.lex;D.Tokenizer=yn;D.Hooks=It;D.parse=D;D.options;D.setOptions;D.use;D.walkTokens;D.parseInline;ue.parse;de.lex;D.setOptions({gfm:!0,breaks:!0,mangle:!1});const qo=["a","b","blockquote","br","code","del","em","h1","h2","h3","h4","hr","i","li","ol","p","pre","strong","table","tbody","td","th","thead","tr","ul"],Vo=["class","href","rel","target","title","start"];let Wo=!1;const Sp=14e4,xp=4e4;function Ap(){Wo||(Wo=!0,Ms.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function Ds(e){const t=e.trim();if(!t)return"";Ap();const n=Er(t,Sp),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>xp){const r=`<pre class="code-block">${_p(`${n.text}${s}`)}</pre>`;return Ms.sanitize(r,{ALLOWED_TAGS:qo,ALLOWED_ATTR:Vo})}const i=D.parse(`${n.text}${s}`);return Ms.sanitize(i,{ALLOWED_TAGS:qo,ALLOWED_ATTR:Vo})}function _p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Tp(e,t){return d`<span class=${t} aria-hidden="true">${e}</span>`}function ln(e,t){e&&(e.textContent=t)}const Ep=1500,Cp=2e3,Aa="Copy as markdown",Ip="Copied",Rp="Copy failed",hs="📋",Lp="✓",Mp="!";async function Pp(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function cn(e,t){e.title=t,e.setAttribute("aria-label",t)}function Np(e){const t=e.label??Aa;return d`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget,i=s?.querySelector(".chat-copy-btn__icon");if(!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const o=await Pp(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!o){s.dataset.error="1",cn(s,Rp),ln(i,Mp),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,cn(s,t),ln(i,hs))},Cp);return}s.dataset.copied="1",cn(s,Ip),ln(i,Lp),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,cn(s,t),ln(i,hs))},Ep)}}}
    >
      ${Tp(hs,"chat-copy-btn__icon")}
    </button>
  `}function Op(e){return Np({text:()=>e,label:Aa})}const Dp={emoji:"🧩",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Fp={bash:{emoji:"🛠️",title:"Bash",detailKeys:["command"]},process:{emoji:"🧰",title:"Process",detailKeys:["sessionId"]},read:{emoji:"📖",title:"Read",detailKeys:["path"]},write:{emoji:"✍️",title:"Write",detailKeys:["path"]},edit:{emoji:"📝",title:"Edit",detailKeys:["path"]},attach:{emoji:"📎",title:"Attach",detailKeys:["path","url","fileName"]},browser:{emoji:"🌐",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{emoji:"🖼️",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{emoji:"📱",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{emoji:"⏰",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{emoji:"🔌",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{emoji:"🟢",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{emoji:"💬",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{emoji:"💬",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},Bp={fallback:Dp,tools:Fp},_a=Bp,Go=_a.fallback??{emoji:"🧩"},Up=_a.tools??{};function Kp(e){return(e??"tool").trim()}function zp(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Hp(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function Ta(e){if(e!=null){if(typeof e=="string"){const t=e.trim();if(!t)return;const n=t.split(/\r?\n/)[0]?.trim()??"";return n?n.length>160?`${n.slice(0,157)}…`:n:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const t=e.map(s=>Ta(s)).filter(s=>!!s);if(t.length===0)return;const n=t.slice(0,3).join(", ");return t.length>3?`${n}…`:n}}}function jp(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function qp(e,t){for(const n of t){const s=jp(e,n),i=Ta(s);if(i)return i}}function Vp(e){if(!e||typeof e!="object")return;const t=e,n=typeof t.path=="string"?t.path:void 0;if(!n)return;const s=typeof t.offset=="number"?t.offset:void 0,i=typeof t.limit=="number"?t.limit:void 0;return s!==void 0&&i!==void 0?`${n}:${s}-${s+i}`:n}function Wp(e){if(!e||typeof e!="object")return;const t=e;return typeof t.path=="string"?t.path:void 0}function Gp(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function Yp(e){const t=Kp(e.name),n=t.toLowerCase(),s=Up[n],i=s?.emoji??Go.emoji??"🧩",o=s?.title??zp(t),r=s?.label??t,c=e.args&&typeof e.args=="object"?e.args.action:void 0,a=typeof c=="string"?c.trim():void 0,f=Gp(s,a),l=Hp(f?.label??a);let p;n==="read"&&(p=Vp(e.args)),!p&&(n==="write"||n==="edit"||n==="attach")&&(p=Wp(e.args));const h=f?.detailKeys??s?.detailKeys??Go.detailKeys??[];return!p&&h.length>0&&(p=qp(e.args,h)),!p&&e.meta&&(p=e.meta),p&&(p=Jp(p)),{name:t,emoji:i,title:o,label:r,verb:l,detail:p}}function Qp(e){const t=[];if(e.verb&&t.push(e.verb),e.detail&&t.push(e.detail),t.length!==0)return t.join(" · ")}function Jp(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const Xp=80,Zp=2,Yo=100;function ef(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function tf(e){const t=e.split(`
`),n=t.slice(0,Zp),s=n.join(`
`);return s.length>Yo?s.slice(0,Yo)+"…":n.length<t.length?s+"…":s}function nf(e){const t=e,n=sf(t.content),s=[];for(const i of n){const o=String(i.type??"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(o)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:of(i.arguments??i.args)})}for(const i of n){const o=String(i.type??"").toLowerCase();if(o!=="toolresult"&&o!=="tool_result")continue;const r=rf(i),c=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:c,text:r})}if(ua(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",o=An(e)??void 0;s.push({kind:"result",name:i,text:o})}return s}function Qo(e,t){const n=Yp({name:e.name,args:e.args}),s=Qp(n),i=!!e.text?.trim(),o=!!t,r=o?()=>{if(i){t(ef(e.text));return}const p=`## ${n.label}

${s?`**Command:** \`${s}\`

`:""}*No output — tool completed successfully.*`;t(p)}:void 0,c=i&&(e.text?.length??0)<=Xp,a=i&&!c,f=i&&c,l=!i;return d`
    <div
      class="chat-tool-card ${o?"chat-tool-card--clickable":""}"
      @click=${r}
      role=${o?"button":m}
      tabindex=${o?"0":m}
      @keydown=${o?p=>{p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),r?.())}:m}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${n.emoji}</span>
          <span>${n.label}</span>
        </div>
        ${o?d`<span class="chat-tool-card__action">${i?"View ›":"›"}</span>`:m}
        ${l&&!o?d`<span class="chat-tool-card__status">✓</span>`:m}
      </div>
      ${s?d`<div class="chat-tool-card__detail">${s}</div>`:m}
      ${l?d`<div class="chat-tool-card__status-text muted">Completed</div>`:m}
      ${a?d`<div class="chat-tool-card__preview mono">${tf(e.text)}</div>`:m}
      ${f?d`<div class="chat-tool-card__inline mono">${e.text}</div>`:m}
    </div>
  `}function sf(e){return Array.isArray(e)?e.filter(Boolean):[]}function of(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function rf(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function af(e){return d`
    <div class="chat-group assistant">
      ${$i("assistant",e)}
      <div class="chat-group-messages">
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>
  `}function lf(e,t,n,s){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),o=s?.name??"Assistant";return d`
    <div class="chat-group assistant">
      ${$i("assistant",s)}
      <div class="chat-group-messages">
        ${Ea({role:"assistant",content:[{type:"text",text:e}]},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${o}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function cf(e,t){const n=ui(e.role),s=t.assistantName??"Assistant",i=n==="user"?"You":n==="assistant"?s:n,o=n==="user"?"user":n==="assistant"?"assistant":"other",r=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return d`
    <div class="chat-group ${o}">
      ${$i(e.role,{name:s,avatar:t.assistantAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((c,a)=>Ea(c.message,{isStreaming:e.isStreaming&&a===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${r}</span>
        </div>
      </div>
    </div>
  `}function $i(e,t){const n=ui(e),s=t?.name?.trim()||"Assistant",i=t?.avatar?.trim()||"",o=n==="user"?"U":n==="assistant"?s.charAt(0).toUpperCase()||"A":n==="tool"?"⚙":"?",r=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return i&&n==="assistant"?df(i)?d`<img
        class="chat-avatar ${r}"
        src="${i}"
        alt="${s}"
      />`:d`<div class="chat-avatar ${r}">${i}</div>`:d`<div class="chat-avatar ${r}">${o}</div>`}function df(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||/^\//.test(e)}function Ea(e,t,n){const s=e,i=typeof s.role=="string"?s.role:"unknown",o=ua(e)||i.toLowerCase()==="toolresult"||i.toLowerCase()==="tool_result"||typeof s.toolCallId=="string"||typeof s.tool_call_id=="string",r=nf(e),c=r.length>0,a=An(e),f=t.showReasoning&&i==="assistant"?ec(e):null,l=a?.trim()?a:null,p=f?nc(f):null,h=l,v=i==="assistant"&&!!h?.trim(),b=["chat-bubble",v?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");return!h&&c&&o?d`${r.map(k=>Qo(k,n))}`:!h&&!c?m:d`
    <div class="${b}">
      ${v?Op(h):m}
      ${p?d`<div class="chat-thinking">${Is(Ds(p))}</div>`:m}
      ${h?d`<div class="chat-text">${Is(Ds(h))}</div>`:m}
      ${r.map(k=>Qo(k,n))}
    </div>
  `}function uf(e){return d`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title">Tool Output</div>
        <button @click=${e.onClose} class="btn" title="Close sidebar">
          ✕
        </button>
      </div>
      <div class="sidebar-content">
        ${e.error?d`
              <div class="callout danger">${e.error}</div>
              <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
                View Raw Text
              </button>
            `:e.content?d`<div class="sidebar-markdown">${Is(Ds(e.content))}</div>`:d`<div class="muted">No content available</div>`}
      </div>
    </div>
  `}var pf=Object.defineProperty,ff=Object.getOwnPropertyDescriptor,Nn=(e,t,n,s)=>{for(var i=s>1?void 0:s?ff(t,n):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(i=(s?r(t,n,i):r(i))||i);return s&&i&&pf(t,n,i),i};let ht=class extends ct{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=t.getBoundingClientRect().width,i=(e.clientX-this.startX)/n;let o=this.startRatio+i;o=Math.max(this.minRatio,Math.min(this.maxRatio,o)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:o},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return d``}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};ht.styles=ml`
    :host {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
      transition: background 150ms ease-out;
      flex-shrink: 0;
      position: relative;
    }

    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }

    :host(:hover) {
      background: var(--accent, #007bff);
    }

    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `;Nn([Sn({type:Number})],ht.prototype,"splitRatio",2);Nn([Sn({type:Number})],ht.prototype,"minRatio",2);Nn([Sn({type:Number})],ht.prototype,"maxRatio",2);ht=Nn([$r("resizable-divider")],ht);const hf=5e3;function gf(e){return e?e.active?d`
      <div class="callout info compaction-indicator compaction-indicator--active">
        🧹 Compacting context...
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<hf?d`
        <div class="callout success compaction-indicator compaction-indicator--complete">
          🧹 Context compacted
        </div>
      `:m:m}function mf(e){const t=e.connected,n=e.sending||e.stream!==null,i=e.sessions?.sessions?.find(l=>l.key===e.sessionKey)?.reasoningLevel??"off",o=e.showThinking&&i!=="off",r={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},c=e.connected?"Message (↩ to send, Shift+↩ for line breaks)":"Connect to the gateway to start chatting…",a=e.splitRatio??.6,f=!!(e.sidebarOpen&&e.onCloseSidebar);return d`
    <section class="card chat">
      ${e.disabledReason?d`<div class="callout">${e.disabledReason}</div>`:m}

      ${e.error?d`<div class="callout danger">${e.error}</div>`:m}

      ${gf(e.compactionStatus)}

      ${e.focusMode?d`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ✕
            </button>
          `:m}

      <div
        class="chat-split-container ${f?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${f?`0 0 ${a*100}%`:"1 1 100%"}"
        >
          <div
            class="chat-thread"
            role="log"
            aria-live="polite"
            @scroll=${e.onChatScroll}
          >
            ${e.loading?d`<div class="muted">Loading chat…</div>`:m}
            ${ca(yf(e),l=>l.key,l=>l.kind==="reading-indicator"?af(r):l.kind==="stream"?lf(l.text,l.startedAt,e.onOpenSidebar,r):l.kind==="group"?cf(l,{onOpenSidebar:e.onOpenSidebar,showReasoning:o,assistantName:e.assistantName,assistantAvatar:r.avatar}):m)}
          </div>
        </div>

        ${f?d`
              <resizable-divider
                .splitRatio=${a}
                @resize=${l=>e.onSplitRatioChange?.(l.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${uf({content:e.sidebarContent??null,error:e.sidebarError??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(`\`\`\`
${e.sidebarContent}
\`\`\``)}})}
              </div>
            `:m}
      </div>

      ${e.queue.length?d`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(l=>d`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">${l.text}</div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(l.id)}
                      >
                        ✕
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:m}

      <div class="chat-compose">
        <label class="field chat-compose__field">
          <span>Message</span>
          <textarea
            .value=${e.draft}
            ?disabled=${!e.connected}
            @keydown=${l=>{l.key==="Enter"&&(l.isComposing||l.keyCode===229||l.shiftKey||e.connected&&(l.preventDefault(),t&&e.onSend()))}}
            @input=${l=>e.onDraftChange(l.target.value)}
            placeholder=${c}
          ></textarea>
        </label>
        <div class="chat-compose__actions">
          <button
            class="btn"
            ?disabled=${!e.connected||e.sending}
            @click=${e.onNewSession}
          >
            New session
          </button>
          <button
            class="btn primary"
            ?disabled=${!e.connected}
            @click=${e.onSend}
          >
            ${n?"Queue":"Send"}
          </button>
        </div>
      </div>
    </section>
  `}const Jo=200;function vf(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=da(s.message),o=ui(i.role),r=i.timestamp||Date.now();!n||n.role!==o?(n&&t.push(n),n={kind:"group",key:`group:${o}:${s.key}`,role:o,messages:[{message:s.message,key:s.key}],timestamp:r,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function yf(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-Jo);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Jo} messages (${i} hidden).`,timestamp:Date.now()}});for(let o=i;o<n.length;o++){const r=n[o],c=da(r);!e.showThinking&&c.role.toLowerCase()==="toolresult"||t.push({kind:"message",key:Xo(r,o),message:r})}if(e.showThinking)for(let o=0;o<s.length;o++)t.push({kind:"message",key:Xo(s[o],o+n.length),message:s[o]});if(e.stream!==null){const o=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:o,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:o})}return vf(t)}function Xo(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const o=typeof n.messageId=="string"?n.messageId:"";if(o)return`msg:${o}`;const r=typeof n.timestamp=="number"?n.timestamp:null,c=typeof n.role=="string"?n.role:"unknown",f=An(e)??(typeof n.content=="string"?n.content:null)??bf(e)??String(t),l=wf(f);return r?`msg:${c}:${r}:${l}`:`msg:${c}:${l}`}function bf(e){try{return JSON.stringify(e)}catch{return null}}function wf(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return(t>>>0).toString(36)}const $f=[{id:"kimi-k2-0905-preview",name:"Kimi K2 0905 Preview",alias:"Kimi K2",reasoning:!1},{id:"kimi-k2-turbo-preview",name:"Kimi K2 Turbo",alias:"Kimi K2 Turbo",reasoning:!1},{id:"kimi-k2-thinking",name:"Kimi K2 Thinking",alias:"Kimi K2 Thinking",reasoning:!0},{id:"kimi-k2-thinking-turbo",name:"Kimi K2 Thinking Turbo",alias:"Kimi K2 Thinking Turbo",reasoning:!0}];function ye(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Ca(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(ye(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function On(e){return e.filter(t=>typeof t=="string").join(".")}function le(e,t){const n=On(e),s=t[n];if(s)return s;const i=n.split(".");for(const[o,r]of Object.entries(t)){if(!o.includes("*"))continue;const c=o.split(".");if(c.length!==i.length)continue;let a=!0;for(let f=0;f<i.length;f+=1)if(c[f]!=="*"&&c[f]!==i[f]){a=!1;break}if(a)return r}}function Se(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function kf(e){const t=On(e).toLowerCase();return t.includes("token")||t.includes("password")||t.includes("secret")||t.includes("apikey")||t.endsWith("key")}const Sf=new Set(["title","description","default","nullable"]);function xf(e){return Object.keys(e??{}).filter(n=>!Sf.has(n)).length===0}function Af(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const Ut={chevronDown:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,plus:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,minus:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,trash:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,edit:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`};function ke(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:r,onPatch:c}=e,a=e.showLabel??!0,f=ye(t),l=le(s,i),p=l?.label??t.title??Se(String(s.at(-1))),h=l?.help??t.description,v=On(s);if(o.has(v))return d`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${p}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const k=(t.anyOf??t.oneOf??[]).filter(_=>!(_.type==="null"||Array.isArray(_.type)&&_.type.includes("null")));if(k.length===1)return ke({...e,schema:k[0]});const A=_=>{if(_.const!==void 0)return _.const;if(_.enum&&_.enum.length===1)return _.enum[0]},I=k.map(A),M=I.every(_=>_!==void 0);if(M&&I.length>0&&I.length<=5){const _=n??t.default;return d`
        <div class="cfg-field">
          ${a?d`<label class="cfg-field__label">${p}</label>`:m}
          ${h?d`<div class="cfg-field__help">${h}</div>`:m}
          <div class="cfg-segmented">
            ${I.map((F,V)=>d`
              <button
                type="button"
                aria-label=${`Set ${p} to ${String(F)}`}
                class="cfg-segmented__btn ${F===_||String(F)===String(_)?"active":""}"
                ?disabled=${r}
                @click=${()=>c(s,F)}
              >
                ${String(F)}
              </button>
            `)}
          </div>
        </div>
      `}if(M&&I.length>5)return er({...e,options:I,value:n??t.default});const O=new Set(k.map(_=>ye(_)).filter(Boolean)),R=new Set([...O].map(_=>_==="integer"?"number":_));if([...R].every(_=>["string","number","boolean"].includes(_))){const _=R.has("string"),F=R.has("number");if(R.has("boolean")&&R.size===1)return ke({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(_||F)return Zo({...e,inputType:F&&!_?"number":"text"})}}if(t.enum){const b=t.enum;if(b.length<=5){const k=n??t.default;return d`
        <div class="cfg-field">
          ${a?d`<label class="cfg-field__label">${p}</label>`:m}
          ${h?d`<div class="cfg-field__help">${h}</div>`:m}
          <div class="cfg-segmented">
            ${b.map(A=>d`
              <button
                type="button"
                aria-label=${`Set ${p} to ${String(A)}`}
                class="cfg-segmented__btn ${A===k||String(A)===String(k)?"active":""}"
                ?disabled=${r}
                @click=${()=>c(s,A)}
              >
                ${String(A)}
              </button>
            `)}
          </div>
        </div>
      `}return er({...e,options:b,value:n??t.default})}if(f==="object")return Tf(e);if(f==="array")return Ef(e);if(f==="boolean"){const b=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return d`
      <label class="cfg-toggle-row ${r?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${p}</span>
          ${h?d`<span class="cfg-toggle-row__help">${h}</span>`:m}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${b}
            ?disabled=${r}
            @change=${k=>c(s,k.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return f==="number"||f==="integer"?_f(e):f==="string"?Zo({...e,inputType:"text"}):d`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${p}</div>
      <div class="cfg-field__error">Unsupported type: ${f}. Use Raw mode.</div>
    </div>
  `}function Zo(e){const{schema:t,value:n,path:s,hints:i,disabled:o,onPatch:r,inputType:c}=e,a=e.showLabel??!0,f=le(s,i),l=f?.label??t.title??Se(String(s.at(-1))),p=f?.help??t.description,h=f?.sensitive??kf(s),v=f?.placeholder??(h?"••••":t.default!==void 0?`Default: ${t.default}`:""),b=n??"";return d`
    <div class="cfg-field">
      ${a?d`<label class="cfg-field__label">${l}</label>`:m}
      ${p?d`<div class="cfg-field__help">${p}</div>`:m}
      <div class="cfg-input-wrap">
        <input
          type=${h?"password":c}
          class="cfg-input"
          placeholder=${v}
          .value=${b==null?"":String(b)}
          ?disabled=${o}
          @input=${k=>{const A=k.target.value;if(c==="number"){if(A.trim()===""){r(s,void 0);return}const I=Number(A);r(s,Number.isNaN(I)?A:I);return}r(s,A)}}
        />
        ${t.default!==void 0?d`
          <button
            type="button"
            class="cfg-input__reset"
            aria-label=${`Reset ${l} to default`}
            title="Reset to default"
            ?disabled=${o}
            @click=${()=>r(s,t.default)}
          >↺</button>
        `:m}
      </div>
    </div>
  `}function _f(e){const{schema:t,value:n,path:s,hints:i,disabled:o,onPatch:r}=e,c=e.showLabel??!0,a=le(s,i),f=a?.label??t.title??Se(String(s.at(-1))),l=a?.help??t.description,p=n??t.default??"",h=typeof p=="number"?p:0;return d`
    <div class="cfg-field">
      ${c?d`<label class="cfg-field__label">${f}</label>`:m}
      ${l?d`<div class="cfg-field__help">${l}</div>`:m}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${o}
          @click=${()=>r(s,h-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${p==null?"":String(p)}
          ?disabled=${o}
          @input=${v=>{const b=v.target.value,k=b===""?void 0:Number(b);r(s,k)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${o}
          @click=${()=>r(s,h+1)}
        >+</button>
      </div>
    </div>
  `}function er(e){const{schema:t,value:n,path:s,hints:i,disabled:o,options:r,onPatch:c}=e,a=e.showLabel??!0,f=le(s,i),l=f?.label??t.title??Se(String(s.at(-1))),p=f?.help??t.description,h=n??t.default,v=r.findIndex(k=>k===h||String(k)===String(h)),b="__unset__";return d`
    <div class="cfg-field">
      ${a?d`<label class="cfg-field__label">${l}</label>`:m}
      ${p?d`<div class="cfg-field__help">${p}</div>`:m}
      <select
        class="cfg-select"
        ?disabled=${o}
        .value=${v>=0?String(v):b}
        @change=${k=>{const A=k.target.value;c(s,A===b?void 0:r[Number(A)])}}
      >
        <option value=${b}>Select...</option>
        ${r.map((k,A)=>d`
          <option value=${String(A)}>${String(k)}</option>
        `)}
      </select>
    </div>
  `}function Tf(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:r,onPatch:c}=e;e.showLabel;const a=le(s,i),f=a?.label??t.title??Se(String(s.at(-1))),l=a?.help??t.description,p=n??t.default,h=p&&typeof p=="object"&&!Array.isArray(p)?p:{},v=t.properties??{},k=Object.entries(v).sort((O,R)=>{const _=le([...s,O[0]],i)?.order??0,F=le([...s,R[0]],i)?.order??0;return _!==F?_-F:O[0].localeCompare(R[0])}),A=new Set(Object.keys(v)),I=t.additionalProperties,M=!!I&&typeof I=="object";return s.length===1?d`
      <div class="cfg-fields">
        ${k.map(([O,R])=>ke({schema:R,value:h[O],path:[...s,O],hints:i,unsupported:o,disabled:r,onPatch:c}))}
        ${M?tr({schema:I,value:h,path:s,hints:i,unsupported:o,disabled:r,reservedKeys:A,onPatch:c}):m}
      </div>
    `:d`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${f}</span>
        <span class="cfg-object__chevron">${Ut.chevronDown}</span>
      </summary>
      ${l?d`<div class="cfg-object__help">${l}</div>`:m}
      <div class="cfg-object__content">
        ${k.map(([O,R])=>ke({schema:R,value:h[O],path:[...s,O],hints:i,unsupported:o,disabled:r,onPatch:c}))}
        ${M?tr({schema:I,value:h,path:s,hints:i,unsupported:o,disabled:r,reservedKeys:A,onPatch:c}):m}
      </div>
    </details>
  `}function Ef(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:r,onPatch:c}=e,a=e.showLabel??!0,f=le(s,i),l=f?.label??t.title??Se(String(s.at(-1))),p=f?.help??t.description,h=Array.isArray(t.items)?t.items[0]:t.items;if(!h)return d`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${l}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const v=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return d`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${a?d`<span class="cfg-array__label">${l}</span>`:m}
        <span class="cfg-array__count">${v.length} item${v.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          aria-label=${`Add ${l} item`}
          ?disabled=${r}
          @click=${()=>{const b=[...v,Ca(h)];c(s,b)}}
        >
          <span class="cfg-array__add-icon">${Ut.plus}</span>
          Add
        </button>
      </div>
      ${p?d`<div class="cfg-array__help">${p}</div>`:m}
      
      ${v.length===0?d`
        <div class="cfg-array__empty">
          No items yet. Click "Add" to create one.
        </div>
      `:d`
        <div class="cfg-array__items">
          ${v.map((b,k)=>d`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${k+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  aria-label="Remove item"
                  title="Remove item"
                  ?disabled=${r}
                  @click=${()=>{const A=[...v];A.splice(k,1),c(s,A)}}
                >
                  ${Ut.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${ke({schema:h,value:b,path:[...s,k],hints:i,unsupported:o,disabled:r,showLabel:!1,onPatch:c})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function tr(e){const{schema:t,value:n,path:s,hints:i,unsupported:o,disabled:r,reservedKeys:c,onPatch:a}=e,f=xf(t),l=Object.entries(n??{}).filter(([p])=>!c.has(p));return d`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          aria-label="Add custom entry"
          ?disabled=${r}
          @click=${()=>{const p={...n??{}};let h=1,v=`custom-${h}`;for(;v in p;)h+=1,v=`custom-${h}`;p[v]=f?{}:Ca(t),a(s,p)}}
        >
          <span class="cfg-map__add-icon">${Ut.plus}</span>
          Add Entry
        </button>
      </div>
      
      ${l.length===0?d`
        <div class="cfg-map__empty">No custom entries.</div>
      `:d`
        <div class="cfg-map__items">
          ${l.map(([p,h])=>{const v=[...s,p],b=Af(h);return d`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${p}
                    ?disabled=${r}
                    @change=${k=>{const A=k.target.value.trim();if(!A||A===p)return;const I={...n??{}};A in I||(I[A]=I[p],delete I[p],a(s,I))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${f?d`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${b}
                          ?disabled=${r}
                          @change=${k=>{const A=k.target,I=A.value.trim();if(!I){a(v,void 0);return}try{a(v,JSON.parse(I))}catch{A.value=b}}}
                        ></textarea>
                      `:ke({schema:t,value:h,path:v,hints:i,unsupported:o,disabled:r,showLabel:!1,onPatch:a})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  aria-label=${`Remove entry ${p}`}
                  title="Remove entry"
                  ?disabled=${r}
                  @click=${()=>{const k={...n??{}};delete k[p],a(s,k)}}
                >
                  ${Ut.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const nr={env:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,update:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,agents:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path><circle cx="8" cy="14" r="1"></circle><circle cx="16" cy="14" r="1"></circle></svg>`,auth:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,channels:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,messages:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,commands:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,hooks:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,skills:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,tools:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,gateway:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,wizard:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9h0"></path><path d="M17.8 6.2 19 5"></path><path d="m3 21 9-9"></path><path d="M12.2 6.2 11 5"></path></svg>`,meta:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`,logging:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,browser:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>`,ui:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,models:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,bindings:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,broadcast:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg>`,audio:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,session:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,cron:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,web:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,discovery:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,canvasHost:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,talk:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,plugins:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6"></path><path d="m4.93 10.93 4.24 4.24"></path><path d="M2 12h6"></path><path d="m4.93 13.07 4.24-4.24"></path><path d="M12 22v-6"></path><path d="m19.07 13.07-4.24-4.24"></path><path d="M22 12h-6"></path><path d="m19.07 10.93-4.24 4.24"></path></svg>`,default:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`},ki={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"}};function sr(e){return nr[e]??nr.default}function Cf(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=ki[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:Rt(t,s)}function Rt(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||Rt(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&Rt(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&Rt(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&Rt(s,t))return!0}return!1}function If(e){if(!e.schema)return d`<div class="muted">Schema unavailable.</div>`;const t=e.schema,n=e.value??{};if(ye(t)!=="object"||!t.properties)return d`<div class="callout danger">Unsupported schema. Use Raw.</div>`;const s=new Set(e.unsupportedPaths??[]),i=t.properties,o=e.searchQuery??"",r=e.activeSection,c=e.activeSubsection??null;let a=Object.entries(i);r&&(a=a.filter(([l])=>l===r)),o&&(a=a.filter(([l,p])=>Cf(l,p,o))),a.sort((l,p)=>{const h=le([l[0]],e.uiHints)?.order??50,v=le([p[0]],e.uiHints)?.order??50;return h!==v?h-v:l[0].localeCompare(p[0])});let f=null;if(r&&c&&a.length===1){const l=a[0]?.[1];l&&ye(l)==="object"&&l.properties&&l.properties[c]&&(f={sectionKey:r,subsectionKey:c,schema:l.properties[c]})}return a.length===0?d`
      <div class="config-empty">
        <div class="config-empty__icon">🔍</div>
        <div class="config-empty__text">
          ${o?`No settings match "${o}"`:"No settings in this section"}
        </div>
      </div>
    `:d`
    <div class="config-form config-form--modern">
      ${f?(()=>{const{sectionKey:l,subsectionKey:p,schema:h}=f,v=le([l,p],e.uiHints),b=v?.label??h.title??Se(p),k=v?.help??h.description??"",A=n[l],I=A&&typeof A=="object"?A[p]:void 0,M=`config-section-${l}-${p}`;return d`
              <section class="config-section-card" id=${M}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${sr(l)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${b}</h3>
                    ${k?d`<p class="config-section-card__desc">${k}</p>`:m}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${ke({schema:h,value:I,path:[l,p],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():a.map(([l,p])=>{const h=ki[l]??{label:l.charAt(0).toUpperCase()+l.slice(1),description:p.description??""};return d`
              <section class="config-section-card" id="config-section-${l}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${sr(l)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${h.label}</h3>
                    ${h.description?d`<p class="config-section-card__desc">${h.description}</p>`:m}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${ke({schema:p,value:n[l],path:[l],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Rf=new Set(["title","description","default","nullable"]);function Lf(e){return Object.keys(e??{}).filter(n=>!Rf.has(n)).length===0}function Ia(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(o=>Object.is(o,i))||s.push(i);return{enumValues:s,nullable:n}}function Ra(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Mt(e,[])}function Mt(e,t){const n=new Set,s={...e},i=On(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const c=Mf(e,t);return c||{schema:e,unsupportedPaths:[i]}}const o=Array.isArray(e.type)&&e.type.includes("null"),r=ye(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=r??e.type,s.nullable=o||e.nullable,s.enum){const{enumValues:c,nullable:a}=Ia(s.enum);s.enum=c,a&&(s.nullable=!0),c.length===0&&n.add(i)}if(r==="object"){const c=e.properties??{},a={};for(const[f,l]of Object.entries(c)){const p=Mt(l,[...t,f]);p.schema&&(a[f]=p.schema);for(const h of p.unsupportedPaths)n.add(h)}if(s.properties=a,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Lf(e.additionalProperties)){const f=Mt(e.additionalProperties,[...t,"*"]);s.additionalProperties=f.schema??e.additionalProperties,f.unsupportedPaths.length>0&&n.add(i)}}else if(r==="array"){const c=Array.isArray(e.items)?e.items[0]:e.items;if(!c)n.add(i);else{const a=Mt(c,[...t,"*"]);s.items=a.schema??c,a.unsupportedPaths.length>0&&n.add(i)}}else r!=="string"&&r!=="number"&&r!=="integer"&&r!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function Mf(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let o=!1;for(const c of n){if(!c||typeof c!="object")return null;if(Array.isArray(c.enum)){const{enumValues:a,nullable:f}=Ia(c.enum);s.push(...a),f&&(o=!0);continue}if("const"in c){if(c.const==null){o=!0;continue}s.push(c.const);continue}if(ye(c)==="null"){o=!0;continue}i.push(c)}if(s.length>0&&i.length===0){const c=[];for(const a of s)c.some(f=>Object.is(f,a))||c.push(a);return{schema:{...e,enum:c,nullable:o,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const c=Mt(i[0],t);return c.schema&&(c.schema.nullable=o||c.schema.nullable),c}const r=["string","number","integer","boolean"];return i.length>0&&s.length===0&&i.every(c=>c.type&&r.includes(String(c.type)))?{schema:{...e,nullable:o},unsupportedPaths:[]}:null}const Fs={all:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,env:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,update:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,agents:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path><circle cx="8" cy="14" r="1"></circle><circle cx="16" cy="14" r="1"></circle></svg>`,auth:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,channels:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,messages:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,commands:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,hooks:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,skills:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,tools:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,gateway:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,wizard:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9h0"></path><path d="M17.8 6.2 19 5"></path><path d="m3 21 9-9"></path><path d="M12.2 6.2 11 5"></path></svg>`,meta:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`,logging:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,browser:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>`,ui:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,models:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,bindings:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,broadcast:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg>`,audio:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,session:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,cron:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,web:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,discovery:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,canvasHost:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,talk:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,plugins:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6"></path><path d="m4.93 10.93 4.24 4.24"></path><path d="M2 12h6"></path><path d="m4.93 13.07 4.24-4.24"></path><path d="M12 22v-6"></path><path d="m19.07 13.07-4.24-4.24"></path><path d="M22 12h-6"></path><path d="m19.07 10.93-4.24 4.24"></path></svg>`,default:d`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`},ir=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"}],or="__all__",Pf=[{label:"MiniMax M2.1",providerKey:"minimax",providerName:"MiniMax",baseURL:"https://api.minimax.io/anthropic",protocol:"anthropic-messages",apiKeyEnv:"MINIMAX_API_KEY",primaryModel:"minimax/MiniMax-M2.1",models:[{id:"minimax/MiniMax-M2.1",name:"MiniMax M2.1",alias:"MiniMax M2.1",reasoning:!0}]},{label:"GLM 4.7",providerKey:"zai",providerName:"Z.AI",baseURL:"https://open.bigmodel.cn/api/paas/v4",protocol:"openai-chat-completions",apiKeyEnv:"ZAI_API_KEY",primaryModel:"zai/glm-4.7",models:[{id:"zai/glm-4.7",name:"GLM 4.7",alias:"GLM 4.7",reasoning:!0}]},{label:"Kimi K2",providerKey:"moonshot",providerName:"Moonshot",baseURL:"https://api.moonshot.ai/v1",protocol:"openai-chat-completions",apiKeyEnv:"MOONSHOT_API_KEY",primaryModel:"moonshot/kimi-k2-0905-preview",models:$f.map(e=>({id:`moonshot/${e.id}`,name:e.name,alias:e.alias,reasoning:e.reasoning}))}];function rr(e){return Fs[e]??Fs.default}function Nf(e,t){const n=ki[e];return n||{label:t?.title??Se(e),description:t?.description??""}}function Of(e){const{key:t,schema:n,uiHints:s}=e;if(!n||ye(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([o,r])=>{const c=le([t,o],s),a=c?.label??r.title??Se(o),f=c?.help??r.description??"",l=c?.order??50;return{key:o,label:a,description:f,order:l}});return i.sort((o,r)=>o.order!==r.order?o.order-r.order:o.key.localeCompare(r.key)),i}function Df(e,t){if(!e||!t)return[];const n=[];function s(i,o,r){if(i===o)return;if(typeof i!=typeof o){n.push({path:r,from:i,to:o});return}if(typeof i!="object"||i===null||o===null){i!==o&&n.push({path:r,from:i,to:o});return}if(Array.isArray(i)&&Array.isArray(o)){JSON.stringify(i)!==JSON.stringify(o)&&n.push({path:r,from:i,to:o});return}const c=i,a=o,f=new Set([...Object.keys(c),...Object.keys(a)]);for(const l of f)s(c[l],a[l],r?`${r}.${l}`:l)}return s(e,t,""),n}function ar(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}function Ff(e){return e?typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e)):{}}function Bf(e){try{const t=JSON.parse(e);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{}}function Uf(e,t){let n=e;for(const s of t){if(!n||typeof n!="object"||Array.isArray(n))return;n=n[s]}return n}function gs(e,t,n){let s=e;for(const i of t.slice(0,-1)){const o=s[i];(!o||typeof o!="object"||Array.isArray(o))&&(s[i]={}),s=s[i]}s[t[t.length-1]]=n}function Kf(e,t){const n=Uf(e,["models","providers",t.providerKey]),s=n&&typeof n=="object"&&!Array.isArray(n)?n:{},i=typeof s.apiKey=="string"&&s.apiKey.trim()?s.apiKey:`\${${t.apiKeyEnv}}`;return{...s,name:t.providerName,baseURL:t.baseURL,protocol:t.protocol,apiKey:i,models:t.models}}function zf(e,t){const n=e.formValue!=null?Ff(e.formValue):Bf(e.raw),s=Kf(n,t);gs(n,["models","mode"],"merge"),gs(n,["models","providers",t.providerKey],s),gs(n,["agents","defaults","model","primary"],t.primaryModel),e.onRawChange(`${JSON.stringify(n,null,2).trimEnd()}
`),e.onFormPatch(["models","mode"],"merge"),e.onFormPatch(["models","providers",t.providerKey],s),e.onFormPatch(["agents","defaults","model","primary"],t.primaryModel)}function Hf(e){return d`
    <div class="config-presets" aria-label="Model presets">
      <div class="config-presets__title">Model Presets</div>
      <div class="config-presets__actions">
        ${Pf.map(t=>d`
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.loading||e.saving||e.applying}
              @click=${()=>zf(e,t)}
            >
              ${t.label}
            </button>
          `)}
      </div>
    </div>
  `}function jf(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Ra(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=!!e.formValue&&!e.loading&&!s,o=e.connected&&!e.saving&&(e.formMode==="raw"?!0:i),r=e.connected&&!e.applying&&!e.updating&&(e.formMode==="raw"?!0:i),c=e.connected&&!e.applying&&!e.updating,a=n.schema?.properties??{},f=ir.filter(_=>_.key in a),l=new Set(ir.map(_=>_.key)),p=Object.keys(a).filter(_=>!l.has(_)).map(_=>({key:_,label:_.charAt(0).toUpperCase()+_.slice(1)})),h=[...f,...p],v=e.activeSection&&n.schema&&ye(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,b=e.activeSection?Nf(e.activeSection,v):null,k=e.activeSection?Of({key:e.activeSection,schema:v,uiHints:e.uiHints}):[],A=e.formMode==="form"&&!!e.activeSection&&k.length>0,I=e.activeSubsection===or,M=e.searchQuery||I?null:e.activeSubsection??k[0]?.key??null,O=e.formMode==="form"?Df(e.originalValue,e.formValue):[],R=O.length>0;return d`
    <div class="config-layout">
      <!-- Sidebar -->
      <aside class="config-sidebar">
        <div class="config-sidebar__header">
          <div class="config-sidebar__title">Settings</div>
          <span class="pill pill--sm ${t==="valid"?"pill--ok":t==="invalid"?"pill--danger":""}">${t}</span>
        </div>
        
        <!-- Search -->
        <div class="config-search">
          <svg class="config-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="config-search__input"
            placeholder="Search settings..."
            .value=${e.searchQuery}
            @input=${_=>e.onSearchChange(_.target.value)}
          />
          ${e.searchQuery?d`
            <button 
              class="config-search__clear"
              @click=${()=>e.onSearchChange("")}
            >×</button>
          `:m}
        </div>
        
        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${Fs.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${h.map(_=>d`
            <button
              class="config-nav__item ${e.activeSection===_.key?"active":""}"
              @click=${()=>e.onSectionChange(_.key)}
            >
              <span class="config-nav__icon">${rr(_.key)}</span>
              <span class="config-nav__label">${_.label}</span>
            </button>
          `)}
        </nav>
        
        <!-- Mode toggle at bottom -->
        <div class="config-sidebar__footer">
          <div class="config-mode-toggle">
            <button
              class="config-mode-toggle__btn ${e.formMode==="form"?"active":""}"
              ?disabled=${e.schemaLoading||!e.schema}
              @click=${()=>e.onFormModeChange("form")}
            >
              Form
            </button>
            <button
              class="config-mode-toggle__btn ${e.formMode==="raw"?"active":""}"
              @click=${()=>e.onFormModeChange("raw")}
            >
              Raw
            </button>
          </div>
        </div>
      </aside>
      
      <!-- Main content -->
      <main class="config-main">
        <!-- Action bar -->
        <div class="config-actions">
          <div class="config-actions__left">
            ${R?d`
              <span class="config-changes-badge">${O.length} unsaved change${O.length!==1?"s":""}</span>
            `:d`
              <span class="config-status muted">No changes</span>
            `}
          </div>
          <div class="config-actions__right">
            <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onReload}>
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!o}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!r}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!c}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>
        
        <!-- Diff panel -->
        ${R?d`
          <details class="config-diff">
            <summary class="config-diff__summary">
              <span>View ${O.length} pending change${O.length!==1?"s":""}</span>
              <svg class="config-diff__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            <div class="config-diff__content">
              ${O.map(_=>d`
                <div class="config-diff__item">
                  <div class="config-diff__path">${_.path}</div>
                  <div class="config-diff__values">
                    <span class="config-diff__from">${ar(_.from)}</span>
                    <span class="config-diff__arrow">→</span>
                    <span class="config-diff__to">${ar(_.to)}</span>
                  </div>
                </div>
              `)}
            </div>
          </details>
        `:m}

        ${Hf(e)}

        ${b&&e.formMode==="form"?d`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">${rr(e.activeSection??"")}</div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${b.label}</div>
                  ${b.description?d`<div class="config-section-hero__desc">${b.description}</div>`:m}
                </div>
              </div>
            `:m}

        ${A?d`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${M===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(or)}
                >
                  All
                </button>
                ${k.map(_=>d`
                    <button
                      class="config-subnav__item ${M===_.key?"active":""}"
                      title=${_.description||_.label}
                      @click=${()=>e.onSubsectionChange(_.key)}
                    >
                      ${_.label}
                    </button>
                  `)}
              </div>
            `:m}

        <!-- Form content -->
        <div class="config-content">
          ${e.formMode==="form"?d`
                ${e.schemaLoading?d`<div class="config-loading">
                      <div class="config-loading__spinner"></div>
                      <span>Loading schema…</span>
                    </div>`:If({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:M})}
                ${s?d`<div class="callout danger" style="margin-top: 12px;">
                      Form view can't safely edit some fields.
                      Use Raw to avoid losing config entries.
                    </div>`:m}
              `:d`
                <label class="field config-raw-field">
                  <span>Raw JSON5</span>
                  <textarea
                    .value=${e.raw}
                    @input=${_=>e.onRawChange(_.target.value)}
                  ></textarea>
                </label>
              `}
        </div>

        ${e.issues.length>0?d`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:m}
      </main>
    </div>
  `}function qf(e){if(!e&&e!==0)return"n/a";const t=Math.round(e/1e3);if(t<60)return`${t}s`;const n=Math.round(t/60);return n<60?`${n}m`:`${Math.round(n/60)}h`}function Vf(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],o=typeof i?.configured=="boolean"&&i.configured,r=typeof i?.running=="boolean"&&i.running,c=typeof i?.connected=="boolean"&&i.connected,f=(n.channelAccounts?.[e]??[]).some(l=>l.configured||l.running||l.connected);return o||r||c||f}function Wf(e,t){return t?.[e]?.length??0}function La(e,t){const n=Wf(e,t);return n<2?m:d`<div class="account-count">Accounts (${n})</div>`}function Gf(e,t){let n=e;for(const s of t){if(!n)return null;const i=ye(n);if(i==="object"){const o=n.properties??{};if(typeof s=="string"&&o[s]){n=o[s];continue}const r=n.additionalProperties;if(typeof s=="string"&&r&&typeof r=="object"){n=r;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function Yf(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}function Qf(e){const t=Ra(e.schema),n=t.schema;if(!n)return d`<div class="callout danger">Schema unavailable. Use Raw.</div>`;const s=Gf(n,["channels",e.channelId]);if(!s)return d`<div class="callout danger">Channel config schema unavailable.</div>`;const i=e.configValue??{},o=Yf(i,e.channelId);return d`
    <div class="config-form">
      ${ke({schema:s,value:o,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
  `}function Oe(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return d`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?d`<div class="muted">Loading config schema…</div>`:Qf({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${s||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?"Saving…":"Save"}
        </button>
        <button
          class="btn"
          ?disabled=${s}
          @click=${()=>n.onConfigReload()}
        >
          Reload
        </button>
      </div>
    </div>
  `}function Jf(e){const{props:t,discord:n,accountCountLabel:s}=e;return d`
    <div class="card">
      <div class="card-title">Discord</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?H(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?H(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?d`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${Oe({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Xf(e){const{props:t,imessage:n,accountCountLabel:s}=e;return d`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">macOS bridge status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?H(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?H(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?d`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:m}

      ${Oe({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Zf(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function eh(e){const{state:t,callbacks:n,accountId:s}=e,i=Zf(t),o=(c,a,f={})=>{const{type:l="text",placeholder:p,maxLength:h,help:v}=f,b=t.values[c]??"",k=t.fieldErrors[c],A=`nostr-profile-${c}`;return l==="textarea"?d`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${A}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${a}
          </label>
          <textarea
            id="${A}"
            .value=${b}
            placeholder=${p??""}
            maxlength=${h??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${I=>{const M=I.target;n.onFieldChange(c,M.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${v?d`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${v}</div>`:m}
          ${k?d`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${k}</div>`:m}
        </div>
      `:d`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${A}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${a}
        </label>
        <input
          id="${A}"
          type=${l}
          .value=${b}
          placeholder=${p??""}
          maxlength=${h??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${I=>{const M=I.target;n.onFieldChange(c,M.value)}}
          ?disabled=${t.saving}
        />
        ${v?d`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${v}</div>`:m}
        ${k?d`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${k}</div>`:m}
      </div>
    `},r=()=>{const c=t.values.picture;return c?d`
      <div style="margin-bottom: 12px;">
        <img
          src=${c}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${a=>{const f=a.target;f.style.display="none"}}
          @load=${a=>{const f=a.target;f.style.display="block"}}
        />
      </div>
    `:m};return d`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?d`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:m}

      ${t.success?d`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:m}

      ${r()}

      ${o("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${o("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${o("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${o("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?d`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${o("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${o("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${o("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${o("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:m}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?"Saving...":"Save & Publish"}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?"Importing...":"Import from Relays"}
        </button>

        <button
          class="btn"
          @click=${n.onToggleAdvanced}
        >
          ${t.showAdvanced?"Hide Advanced":"Show Advanced"}
        </button>

        <button
          class="btn"
          @click=${n.onCancel}
          ?disabled=${t.saving}
        >
          Cancel
        </button>
      </div>

      ${i?d`<div style="font-size: 12px; color: var(--warning-color); margin-top: 8px;">
            You have unsaved changes
          </div>`:m}
    </div>
  `}function th(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}function lr(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function nh(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:o,profileFormCallbacks:r,onEditProfile:c}=e,a=s[0],f=n?.configured??a?.configured??!1,l=n?.running??a?.running??!1,p=n?.publicKey??a?.publicKey,h=n?.lastStartAt??a?.lastStartAt??null,v=n?.lastError??a?.lastError??null,b=s.length>1,k=o!=null,A=M=>{const O=M.publicKey,R=M.profile,_=R?.displayName??R?.name??M.name??M.accountId;return d`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${_}</div>
          <div class="account-card-id">${M.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${M.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${M.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${O??""}">${lr(O)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${M.lastInboundAt?H(M.lastInboundAt):"n/a"}</span>
          </div>
          ${M.lastError?d`
                <div class="account-card-error">${M.lastError}</div>
              `:m}
        </div>
      </div>
    `},I=()=>{if(k&&r)return eh({state:o,callbacks:r,accountId:s[0]?.accountId??"default"});const M=a?.profile??n?.profile,{name:O,displayName:R,about:_,picture:F,nip05:V}=M??{},be=O||R||_||F||V;return d`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${f?d`
                <button
                  class="btn btn-sm"
                  @click=${c}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:m}
        </div>
        ${be?d`
              <div class="status-list">
                ${F?d`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${F}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${vt=>{vt.target.style.display="none"}}
                        />
                      </div>
                    `:m}
                ${O?d`<div><span class="label">Name</span><span>${O}</span></div>`:m}
                ${R?d`<div><span class="label">Display Name</span><span>${R}</span></div>`:m}
                ${_?d`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${_}</span></div>`:m}
                ${V?d`<div><span class="label">NIP-05</span><span>${V}</span></div>`:m}
              </div>
            `:d`
              <div style="color: var(--text-muted); font-size: 13px;">
                No profile set. Click "Edit Profile" to add your name, bio, and avatar.
              </div>
            `}
      </div>
    `};return d`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${b?d`
            <div class="account-card-list">
              ${s.map(M=>A(M))}
            </div>
          `:d`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${f?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${l?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${p??""}"
                  >${lr(p)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${h?H(h):"n/a"}</span>
              </div>
            </div>
          `}

      ${v?d`<div class="callout danger" style="margin-top: 12px;">${v}</div>`:m}

      ${I()}

      ${Oe({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function sh(e){const{props:t,signal:n,accountCountLabel:s}=e;return d`
    <div class="card">
      <div class="card-title">Signal</div>
      <div class="card-sub">signal-cli status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Base URL</span>
          <span>${n?.baseUrl??"n/a"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?H(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?H(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?d`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${Oe({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function ih(e){const{props:t,slack:n,accountCountLabel:s}=e;return d`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">Socket mode status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?H(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?H(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?d`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${Oe({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function oh(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,o=s.length>1,r=c=>{const f=c.probe?.bot?.username,l=c.name||c.accountId;return d`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${f?`@${f}`:l}
          </div>
          <div class="account-card-id">${c.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${c.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${c.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${c.lastInboundAt?H(c.lastInboundAt):"n/a"}</span>
          </div>
          ${c.lastError?d`
                <div class="account-card-error">
                  ${c.lastError}
                </div>
              `:m}
        </div>
      </div>
    `};return d`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${o?d`
            <div class="account-card-list">
              ${s.map(c=>r(c))}
            </div>
          `:d`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${n?.configured?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${n?.running?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Mode</span>
                <span>${n?.mode??"n/a"}</span>
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${n?.lastStartAt?H(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?H(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${n?.probe?d`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:m}

      ${Oe({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function rh(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return d`
    <div class="card">
      <div class="card-title">WhatsApp</div>
      <div class="card-sub">Link WhatsApp Web and monitor connection health.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Linked</span>
          <span>${n?.linked?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${n?.connected?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last connect</span>
          <span>
            ${n?.lastConnectedAt?H(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?H(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?qf(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:m}

      ${t.whatsappMessage?d`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:m}

      ${t.whatsappQrDataUrl?d`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:m}

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(!1)}
        >
          ${t.whatsappBusy?"Working…":"Show QR"}
        </button>
        <button
          class="btn"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(!0)}
        >
          Relink
        </button>
        <button
          class="btn"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppWait()}
        >
          Wait for scan
        </button>
        <button
          class="btn danger"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppLogout()}
        >
          Logout
        </button>
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Refresh
        </button>
      </div>

      ${Oe({channelId:"whatsapp",props:t})}
    </div>
  `}function ah(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null,o=t?.slack??null,r=t?.signal??null,c=t?.imessage??null,a=t?.nostr??null,l=lh(e.snapshot).map((p,h)=>({key:p,enabled:Vf(p,e),order:h})).sort((p,h)=>p.enabled!==h.enabled?p.enabled?-1:1:p.order-h.order);return d`
    <section class="grid grid-cols-2">
      ${l.map(p=>ch(p.key,e,{whatsapp:n,telegram:s,discord:i,slack:o,signal:r,imessage:c,nostr:a,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?H(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:m}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function lh(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","slack","signal","imessage","nostr"]}function ch(e,t,n){const s=La(e,n.channelAccounts);switch(e){case"whatsapp":return rh({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return oh({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return Jf({props:t,discord:n.discord,accountCountLabel:s});case"slack":return ih({props:t,slack:n.slack,accountCountLabel:s});case"signal":return sh({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return Xf({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],o=i[0],r=o?.accountId??"default",c=o?.profile??null,a=t.nostrProfileAccountId===r?t.nostrProfileFormState:null,f=a?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return nh({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:a,profileFormCallbacks:f,onEditProfile:()=>t.onNostrProfileEdit(r,c)})}default:return dh(e,t,n.channelAccounts??{})}}function dh(e,t,n){const s=ph(t.snapshot,e),i=t.snapshot?.channels?.[e],o=typeof i?.configured=="boolean"?i.configured:void 0,r=typeof i?.running=="boolean"?i.running:void 0,c=typeof i?.connected=="boolean"?i.connected:void 0,a=typeof i?.lastError=="string"?i.lastError:void 0,f=n[e]??[],l=La(e,n);return d`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${l}

      ${f.length>0?d`
            <div class="account-card-list">
              ${f.map(p=>mh(p))}
            </div>
          `:d`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${o==null?"n/a":o?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${r==null?"n/a":r?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${c==null?"n/a":c?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${a?d`<div class="callout danger" style="margin-top: 12px;">
            ${a}
          </div>`:m}

      ${Oe({channelId:e,props:t})}
    </div>
  `}function uh(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function ph(e,t){return uh(e)[t]?.label??e?.channelLabels?.[t]??t}const fh=600*1e3;function Ma(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<fh:!1}function hh(e){return e.running?"Yes":Ma(e)?"Active":"No"}function gh(e){return e.connected===!0?"Yes":e.connected===!1?"No":Ma(e)?"Active":"n/a"}function mh(e){const t=hh(e),n=gh(e);return d`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${e.name||e.accountId}</div>
        <div class="account-card-id">${e.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">Running</span>
          <span>${t}</span>
        </div>
        <div>
          <span class="label">Configured</span>
          <span>${e.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${n}</span>
        </div>
        <div>
          <span class="label">Last inbound</span>
          <span>${e.lastInboundAt?H(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?d`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:m}
      </div>
    </div>
  `}function vh(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function yh(e){const t=e.ts??null;return t?H(t):"n/a"}function Pa(e){return e?`${Ft(e)} (${H(e)})`:"n/a"}function bh(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function wh(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function $h(e){const t=e.state??{},n=t.nextRunAtMs?Ft(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Ft(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function kh(e){const t=e.schedule;return t.kind==="at"?`At ${Ft(t.atMs)}`:t.kind==="every"?`Every ${Tr(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function Sh(e){const t=e.payload;return t.kind==="systemEvent"?`System: ${t.text}`:`Agent: ${t.message}`}function xh(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.channel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function Ah(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function _h(e){const t=xh(e);return d`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Scheduler</div>
        <div class="card-sub">Gateway-owned cron scheduler status.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${e.status?.jobs??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${Pa(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?d`<span class="muted">${e.error}</span>`:m}
        </div>
      </div>

      <div class="card">
        <div class="card-title">New Job</div>
        <div class="card-sub">Create a scheduled wakeup or agent run.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Name</span>
            <input
              .value=${e.form.name}
              @input=${n=>e.onFormChange({name:n.target.value})}
            />
          </label>
          <label class="field">
            <span>Description</span>
            <input
              .value=${e.form.description}
              @input=${n=>e.onFormChange({description:n.target.value})}
            />
          </label>
          <label class="field">
            <span>Agent ID</span>
            <input
              .value=${e.form.agentId}
              @input=${n=>e.onFormChange({agentId:n.target.value})}
              placeholder="default"
            />
          </label>
          <label class="field checkbox">
            <span>Enabled</span>
            <input
              type="checkbox"
              .checked=${e.form.enabled}
              @change=${n=>e.onFormChange({enabled:n.target.checked})}
            />
          </label>
          <label class="field">
            <span>Schedule</span>
            <select
              .value=${e.form.scheduleKind}
              @change=${n=>e.onFormChange({scheduleKind:n.target.value})}
            >
              <option value="every">Every</option>
              <option value="at">At</option>
              <option value="cron">Cron</option>
            </select>
          </label>
        </div>
        ${Th(e)}
        <div class="form-grid" style="margin-top: 12px;">
          <label class="field">
            <span>Session</span>
            <select
              .value=${e.form.sessionTarget}
              @change=${n=>e.onFormChange({sessionTarget:n.target.value})}
            >
              <option value="main">Main</option>
              <option value="isolated">Isolated</option>
            </select>
          </label>
          <label class="field">
            <span>Wake mode</span>
            <select
              .value=${e.form.wakeMode}
              @change=${n=>e.onFormChange({wakeMode:n.target.value})}
            >
              <option value="next-heartbeat">Next heartbeat</option>
              <option value="now">Now</option>
            </select>
          </label>
          <label class="field">
            <span>Payload</span>
            <select
              .value=${e.form.payloadKind}
              @change=${n=>e.onFormChange({payloadKind:n.target.value})}
            >
              <option value="systemEvent">System event</option>
              <option value="agentTurn">Agent turn</option>
            </select>
          </label>
        </div>
        <label class="field" style="margin-top: 12px;">
          <span>${e.form.payloadKind==="systemEvent"?"System text":"Agent message"}</span>
          <textarea
            .value=${e.form.payloadText}
            @input=${n=>e.onFormChange({payloadText:n.target.value})}
            rows="4"
          ></textarea>
        </label>
	          ${e.form.payloadKind==="agentTurn"?d`
	              <div class="form-grid" style="margin-top: 12px;">
                <label class="field checkbox">
                  <span>Deliver</span>
                  <input
                    type="checkbox"
                    .checked=${e.form.deliver}
                    @change=${n=>e.onFormChange({deliver:n.target.checked})}
                  />
	                </label>
	                <label class="field">
	                  <span>Channel</span>
	                  <select
	                    .value=${e.form.channel||"last"}
	                    @change=${n=>e.onFormChange({channel:n.target.value})}
	                  >
	                    ${t.map(n=>d`<option value=${n}>
                            ${Ah(e,n)}
                          </option>`)}
                  </select>
                </label>
                <label class="field">
                  <span>To</span>
                  <input
                    .value=${e.form.to}
                    @input=${n=>e.onFormChange({to:n.target.value})}
                    placeholder="+1555… or chat id"
                  />
                </label>
                <label class="field">
                  <span>Timeout (seconds)</span>
                  <input
                    .value=${e.form.timeoutSeconds}
                    @input=${n=>e.onFormChange({timeoutSeconds:n.target.value})}
                  />
                </label>
                ${e.form.sessionTarget==="isolated"?d`
                      <label class="field">
                        <span>Post to main prefix</span>
                        <input
                          .value=${e.form.postToMainPrefix}
                          @input=${n=>e.onFormChange({postToMainPrefix:n.target.value})}
                        />
                      </label>
                    `:m}
              </div>
            `:m}
        <div class="row" style="margin-top: 14px;">
          <button class="btn primary" ?disabled=${e.busy} @click=${e.onAdd}>
            ${e.busy?"Saving…":"Add job"}
          </button>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Jobs</div>
      <div class="card-sub">All scheduled jobs stored in the gateway.</div>
      ${e.jobs.length===0?d`<div class="muted" style="margin-top: 12px;">No jobs yet.</div>`:d`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(n=>Eh(n,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?d`
            <div class="muted" style="margin-top: 12px;">
              Select a job to inspect run history.
            </div>
          `:e.runs.length===0?d`<div class="muted" style="margin-top: 12px;">No runs yet.</div>`:d`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(n=>Ch(n))}
              </div>
            `}
    </section>
  `}function Th(e){const t=e.form;return t.scheduleKind==="at"?d`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?d`
      <div class="form-grid" style="margin-top: 12px;">
        <label class="field">
          <span>Every</span>
          <input
            .value=${t.everyAmount}
            @input=${n=>e.onFormChange({everyAmount:n.target.value})}
          />
        </label>
        <label class="field">
          <span>Unit</span>
          <select
            .value=${t.everyUnit}
            @change=${n=>e.onFormChange({everyUnit:n.target.value})}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
      </div>
    `:d`
    <div class="form-grid" style="margin-top: 12px;">
      <label class="field">
        <span>Expression</span>
        <input
          .value=${t.cronExpr}
          @input=${n=>e.onFormChange({cronExpr:n.target.value})}
        />
      </label>
      <label class="field">
        <span>Timezone (optional)</span>
        <input
          .value=${t.cronTz}
          @input=${n=>e.onFormChange({cronTz:n.target.value})}
        />
      </label>
    </div>
  `}function Eh(e,t){const s=`list-item list-item-clickable${t.runsJobId===e.id?" list-item-selected":""}`;return d`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${kh(e)}</div>
        <div class="muted">${Sh(e)}</div>
        ${e.agentId?d`<div class="muted">Agent: ${e.agentId}</div>`:m}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${$h(e)}</div>
        <div class="row" style="justify-content: flex-end; margin-top: 8px;">
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onToggle(e,!e.enabled)}}
          >
            ${e.enabled?"Disable":"Enable"}
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onRun(e)}}
          >
            Run
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onLoadRuns(e.id)}}
          >
            Runs
          </button>
          <button
            class="btn danger"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onRemove(e)}}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `}function Ch(e){return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Ft(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?d`<div class="muted">${e.error}</div>`:m}
      </div>
    </div>
  `}function Ih(e){return d`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Snapshots</div>
            <div class="card-sub">Status, health, and heartbeat data.</div>
          </div>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">Status</div>
            <pre class="code-block">${JSON.stringify(e.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Health</div>
            <pre class="code-block">${JSON.stringify(e.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Last heartbeat</div>
            <pre class="code-block">${JSON.stringify(e.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Manual RPC</div>
        <div class="card-sub">Send a raw gateway method with JSON params.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Method</span>
            <input
              .value=${e.callMethod}
              @input=${t=>e.onCallMethodChange(t.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${t=>e.onCallParamsChange(t.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?d`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:m}
        ${e.callResult?d`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:m}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Models</div>
      <div class="card-sub">Catalog from models.list.</div>
      <pre class="code-block" style="margin-top: 12px;">${JSON.stringify(e.models??[],null,2)}</pre>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Event Log</div>
      <div class="card-sub">Latest gateway events.</div>
      ${e.eventLog.length===0?d`<div class="muted" style="margin-top: 12px;">No events yet.</div>`:d`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(t=>d`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${t.event}</div>
                      <div class="list-sub">${new Date(t.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${wh(t.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function Rh(e){return d`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-sub">Presence beacons from the gateway and clients.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.lastError?d`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:m}
      ${e.statusMessage?d`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:m}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?d`<div class="muted">No instances reported yet.</div>`:e.entries.map(t=>Lh(t))}
      </div>
    </section>
  `}function Lh(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],o=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${vh(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(r=>d`<span class="chip">${r}</span>`)}
          ${o?d`<span class="chip">${o}</span>`:m}
          ${e.platform?d`<span class="chip">${e.platform}</span>`:m}
          ${e.deviceFamily?d`<span class="chip">${e.deviceFamily}</span>`:m}
          ${e.modelIdentifier?d`<span class="chip">${e.modelIdentifier}</span>`:m}
          ${e.version?d`<span class="chip">${e.version}</span>`:m}
        </div>
      </div>
      <div class="list-meta">
        <div>${yh(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const cr=["trace","debug","info","warn","error","fatal"];function Mh(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function Ph(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function Nh(e){const t=e.filterText.trim().toLowerCase(),n=cr.some(o=>!e.levelFilters[o]),s=e.entries.filter(o=>o.level&&!e.levelFilters[o.level]?!1:Ph(o,t)),i=t||n?"filtered":"visible";return d`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Logs</div>
          <div class="card-sub">Gateway file logs (JSONL).</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn"
            ?disabled=${s.length===0}
            @click=${()=>e.onExport(s.map(o=>o.raw),i)}
          >
            Export ${i}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>Filter</span>
          <input
            .value=${e.filterText}
            @input=${o=>e.onFilterTextChange(o.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${o=>e.onToggleAutoFollow(o.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${cr.map(o=>d`
            <label class="chip log-chip ${o}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[o]}
                @change=${r=>e.onLevelToggle(o,r.target.checked)}
              />
              <span>${o}</span>
            </label>
          `)}
      </div>

      ${e.file?d`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:m}
      ${e.truncated?d`<div class="callout" style="margin-top: 10px;">
            Log output truncated; showing latest chunk.
          </div>`:m}
      ${e.error?d`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:m}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?d`<div class="muted" style="padding: 12px;">No log entries.</div>`:s.map(o=>d`
                <div class="log-row">
                  <div class="log-time mono">${Mh(o.time)}</div>
                  <div class="log-level ${o.level??""}">${o.level??""}</div>
                  <div class="log-subsystem mono">${o.subsystem??""}</div>
                  <div class="log-message mono">${o.message??o.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}function Oh(e){const t=zh(e),n=Gh(e);return d`
    ${Qh(n)}
    ${Yh(t)}
    ${Dh(e)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${e.nodes.length===0?d`<div class="muted">No nodes found.</div>`:e.nodes.map(s=>rg(s))}
      </div>
    </section>
  `}function Dh(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return d`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <button class="btn" ?disabled=${e.devicesLoading} @click=${e.onDevicesRefresh}>
          ${e.devicesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.devicesError?d`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:m}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?d`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>Fh(i,e))}
            `:m}
        ${s.length>0?d`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>Bh(i,e))}
            `:m}
        ${n.length===0&&s.length===0?d`<div class="muted">No paired devices.</div>`:m}
      </div>
    </section>
  `}function Fh(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?H(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",o=e.isRepair?" · repair":"",r=e.remoteIp?` · ${e.remoteIp}`:"";return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${r}</div>
        <div class="muted" style="margin-top: 6px;">
          ${i} · requested ${s}${o}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>t.onDeviceApprove(e.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>t.onDeviceReject(e.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function Bh(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${ws(e.roles)}`,o=`scopes: ${ws(e.scopes)}`,r=Array.isArray(e.tokens)?e.tokens:[];return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${o}</div>
        ${r.length===0?d`<div class="muted" style="margin-top: 6px;">Tokens: none</div>`:d`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${r.map(c=>Uh(e.deviceId,c,t))}
              </div>
            `}
      </div>
    </div>
  `}function Uh(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${ws(t.scopes)}`,o=H(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return d`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${o}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?m:d`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const Le="__defaults__",dr=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],Kh=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function zh(e){const t=e.configForm,n=sg(e.nodes),{defaultBinding:s,agents:i}=og(t),o=!!t,r=e.configSaving||e.configFormMode==="raw";return{ready:o,disabled:r,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function ur(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function Hh(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function jh(e){const t=e?.defaults??{};return{security:ur(t.security),ask:Hh(t.ask),askFallback:ur(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function qh(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const o=i,r=typeof o.id=="string"?o.id.trim():"";if(!r)return;const c=typeof o.name=="string"?o.name.trim():void 0,a=o.default===!0;s.push({id:r,name:c||void 0,isDefault:a})}),s}function Vh(e,t){const n=qh(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(r=>i.set(r.id,r)),s.forEach(r=>{i.has(r)||i.set(r,{id:r})});const o=Array.from(i.values());return o.length===0&&o.push({id:"main",isDefault:!0}),o.sort((r,c)=>{if(r.isDefault&&!c.isDefault)return-1;if(!r.isDefault&&c.isDefault)return 1;const a=r.name?.trim()?r.name:r.id,f=c.name?.trim()?c.name:c.id;return a.localeCompare(f)}),o}function Wh(e,t){return e===Le?Le:e&&t.some(n=>n.id===e)?e:Le}function Gh(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=jh(t),i=Vh(e.configForm,t),o=ig(e.nodes),r=e.execApprovalsTarget;let c=r==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;r==="node"&&c&&!o.some(p=>p.id===c)&&(c=null);const a=Wh(e.execApprovalsSelectedAgent,i),f=a!==Le?(t?.agents??{})[a]??null:null,l=Array.isArray(f?.allowlist)?f.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:a,selectedAgent:f,agents:i,allowlist:l,target:r,targetNodeId:c,targetNodes:o,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function Yh(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return d`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec node binding</div>
          <div class="card-sub">
            Pin agents to a specific node when using <span class="mono">exec host=node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.configDirty}
          @click=${e.onSave}
        >
          ${e.configSaving?"Saving…":"Save"}
        </button>
      </div>

      ${e.formMode==="raw"?d`<div class="callout warn" style="margin-top: 12px;">
            Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
          </div>`:m}

      ${e.ready?d`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">Default binding</div>
                  <div class="list-sub">Used when agents do not override a node binding.</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>Node</span>
                    <select
                      ?disabled=${e.disabled||!t}
                      @change=${s=>{const o=s.target.value.trim();e.onBindDefault(o||null)}}
                    >
                      <option value="" ?selected=${n===""}>Any node</option>
                      ${e.nodes.map(s=>d`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?m:d`<div class="muted">No nodes with system.run available.</div>`}
                </div>
              </div>

              ${e.agents.length===0?d`<div class="muted">No agents found.</div>`:e.agents.map(s=>ng(s,e))}
            </div>
          `:d`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function Qh(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return d`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec approvals</div>
          <div class="card-sub">
            Allowlist and approval policy for <span class="mono">exec host=gateway/node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.dirty||!n}
          @click=${e.onSave}
        >
          ${e.saving?"Saving…":"Save"}
        </button>
      </div>

      ${Jh(e)}

      ${t?d`
            ${Xh(e)}
            ${Zh(e)}
            ${e.selectedScope===Le?m:eg(e)}
          `:d`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function Jh(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return d`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Target</div>
          <div class="list-sub">
            Gateway edits local approvals; node edits the selected node.
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Host</span>
            <select
              ?disabled=${e.disabled}
              @change=${s=>{if(s.target.value==="node"){const r=e.targetNodes[0]?.id??null;e.onSelectTarget("node",n||r)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?d`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const o=s.target.value.trim();e.onSelectTarget("node",o||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>d`<option
                          value=${s.id}
                          ?selected=${n===s.id}
                        >
                          ${s.label}
                        </option>`)}
                  </select>
                </label>
              `:m}
        </div>
      </div>
      ${e.target==="node"&&!t?d`<div class="muted">No nodes advertise exec approvals yet.</div>`:m}
    </div>
  `}function Xh(e){return d`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===Le?"active":""}"
          @click=${()=>e.onSelectScope(Le)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return d`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function Zh(e){const t=e.selectedScope===Le,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],o=typeof s.security=="string"?s.security:void 0,r=typeof s.ask=="string"?s.ask:void 0,c=typeof s.askFallback=="string"?s.askFallback:void 0,a=t?n.security:o??"__default__",f=t?n.ask:r??"__default__",l=t?n.askFallback:c??"__default__",p=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,h=p??n.autoAllowSkills,v=p==null;return d`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${t?"Default security mode.":`Default: ${n.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const A=b.target.value;!t&&A==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],A)}}
            >
              ${t?m:d`<option value="__default__" ?selected=${a==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${dr.map(b=>d`<option
                    value=${b.value}
                    ?selected=${a===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${t?"Default prompt policy.":`Default: ${n.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const A=b.target.value;!t&&A==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],A)}}
            >
              ${t?m:d`<option value="__default__" ?selected=${f==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${Kh.map(b=>d`<option
                    value=${b.value}
                    ?selected=${f===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${t?"Applied when the UI prompt is unavailable.":`Default: ${n.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const A=b.target.value;!t&&A==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],A)}}
            >
              ${t?m:d`<option value="__default__" ?selected=${l==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${dr.map(b=>d`<option
                    value=${b.value}
                    ?selected=${l===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":v?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${h?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${h}
              @change=${b=>{const k=b.target;e.onPatch([...i,"autoAllowSkills"],k.checked)}}
            />
          </label>
          ${!t&&!v?d`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:m}
        </div>
      </div>
    </div>
  `}function eg(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return d`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{const s=[...n,{pattern:""}];e.onPatch(t,s)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${n.length===0?d`<div class="muted">No allowlist entries yet.</div>`:n.map((s,i)=>tg(e,s,i))}
    </div>
  `}function tg(e,t,n){const s=t.lastUsedAt?H(t.lastUsedAt):"never",i=t.lastUsedCommand?$s(t.lastUsedCommand,120):null,o=t.lastResolvedPath?$s(t.lastResolvedPath,120):null;return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?d`<div class="list-sub mono">${i}</div>`:m}
        ${o?d`<div class="list-sub mono">${o}</div>`:m}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${r=>{const c=r.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],c.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove(["agents",e.selectedScope,"allowlist"]);return}e.onRemove(["agents",e.selectedScope,"allowlist",n])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function ng(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${e.isDefault?"default agent":"agent"} ·
          ${n==="__default__"?`uses default (${t.defaultBinding??"any"})`:`override: ${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${t.disabled||!i}
            @change=${o=>{const c=o.target.value.trim();t.onBindAgent(e.index,c==="__default__"?null:c)}}
          >
            <option value="__default__" ?selected=${n==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(o=>d`<option
                  value=${o.id}
                  ?selected=${n===o.id}
                >
                  ${o.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function sg(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.run"))continue;const o=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!o)continue;const r=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():o;t.push({id:o,label:r===o?o:`${r} · ${o}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function ig(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(c=>String(c)==="system.execApprovals.get"||String(c)==="system.execApprovals.set"))continue;const o=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!o)continue;const r=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():o;t.push({id:o,label:r===o?o:`${r} · ${o}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function og(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,o=e.agents??{},r=Array.isArray(o.list)?o.list:[];if(r.length===0)return{defaultBinding:i,agents:[t]};const c=[];return r.forEach((a,f)=>{if(!a||typeof a!="object")return;const l=a,p=typeof l.id=="string"?l.id.trim():"";if(!p)return;const h=typeof l.name=="string"?l.name.trim():void 0,v=l.default===!0,k=(l.tools??{}).exec??{},A=typeof k.node=="string"&&k.node.trim()?k.node.trim():null;c.push({id:p,name:h||void 0,index:f,isDefault:v,binding:A})}),c.length===0&&c.push(t),{defaultBinding:i,agents:c}}function rg(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],o=Array.isArray(e.commands)?e.commands:[];return d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${typeof e.nodeId=="string"?e.nodeId:""}
          ${typeof e.remoteIp=="string"?` · ${e.remoteIp}`:""}
          ${typeof e.version=="string"?` · ${e.version}`:""}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${n?"paired":"unpaired"}</span>
          <span class="chip ${t?"chip-ok":"chip-warn"}">
            ${t?"connected":"offline"}
          </span>
          ${i.slice(0,12).map(r=>d`<span class="chip">${String(r)}</span>`)}
          ${o.slice(0,8).map(r=>d`<span class="chip">${String(r)}</span>`)}
        </div>
      </div>
    </div>
  `}function ag(e){const t=e.hello?.snapshot,n=t?.uptimeMs?Tr(t.uptimeMs):"n/a",s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:"n/a",i=(()=>{if(e.connected||!e.lastError)return null;const r=e.lastError.toLowerCase();if(!(r.includes("unauthorized")||r.includes("connect failed")))return null;const a=!!e.settings.token.trim(),f=!!e.password.trim();return!a&&!f?d`
        <div class="muted" style="margin-top: 8px;">
          This gateway requires auth. Add a token or password, then click Connect.
          <div style="margin-top: 6px;">
            <span class="mono">clawdbot dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">clawdbot doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px;">
            <a
              class="session-link"
              href="https://docs.clawd.bot/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="Control UI auth docs (opens in new tab)"
              >Docs: Control UI auth</a
            >
          </div>
        </div>
      `:d`
      <div class="muted" style="margin-top: 8px;">
        Auth failed. Re-copy a tokenized URL with
        <span class="mono">clawdbot dashboard --no-open</span>, or update the token,
        then click Connect.
        <div style="margin-top: 6px;">
          <a
            class="session-link"
            href="https://docs.clawd.bot/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="Control UI auth docs (opens in new tab)"
            >Docs: Control UI auth</a
          >
        </div>
      </div>
    `})(),o=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0)!==!1)return null;const c=e.lastError.toLowerCase();return!c.includes("secure context")&&!c.includes("device identity required")?null:d`
      <div class="muted" style="margin-top: 8px;">
        This page is HTTP, so the browser blocks device identity. Use HTTPS (Tailscale Serve) or
        open <span class="mono">http://127.0.0.1:18789</span> on the gateway host.
        <div style="margin-top: 6px;">
          If you must stay on HTTP, set
          <span class="mono">gateway.controlUi.allowInsecureAuth: true</span> (token-only).
        </div>
        <div style="margin-top: 6px;">
          <a
            class="session-link"
            href="https://docs.clawd.bot/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="Tailscale Serve docs (opens in new tab)"
            >Docs: Tailscale Serve</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.clawd.bot/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="Insecure HTTP docs (opens in new tab)"
            >Docs: Insecure HTTP</a
          >
        </div>
      </div>
    `})();return d`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Gateway Access</div>
        <div class="card-sub">Where the dashboard connects and how it authenticates.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>WebSocket URL</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${r=>{const c=r.target.value;e.onSettingsChange({...e.settings,gatewayUrl:c})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          <label class="field">
            <span>Gateway Token</span>
            <input
              .value=${e.settings.token}
              @input=${r=>{const c=r.target.value;e.onSettingsChange({...e.settings,token:c})}}
              placeholder="CLAWDBOT_GATEWAY_TOKEN"
            />
          </label>
          <label class="field">
            <span>Password (not stored)</span>
            <input
              type="password"
              .value=${e.password}
              @input=${r=>{const c=r.target.value;e.onPasswordChange(c)}}
              placeholder="system or shared password"
            />
          </label>
          <label class="field">
            <span>Default Session Key</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${r=>{const c=r.target.value;e.onSessionKeyChange(c)}}
            />
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${()=>e.onConnect()}>Connect</button>
          <button class="btn" @click=${()=>e.onRefresh()}>Refresh</button>
          <span class="muted">Click Connect to apply connection changes.</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Snapshot</div>
        <div class="card-sub">Latest gateway handshake information.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Status</div>
            <div class="stat-value ${e.connected?"ok":"warn"}">
              ${e.connected?"Connected":"Disconnected"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Uptime</div>
            <div class="stat-value">${n}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Tick Interval</div>
            <div class="stat-value">${s}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Last Channels Refresh</div>
            <div class="stat-value">
              ${e.lastChannelsRefresh?H(e.lastChannelsRefresh):"n/a"}
            </div>
          </div>
        </div>
        ${e.lastError?d`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${i??""}
              ${o??""}
            </div>`:d`<div class="callout" style="margin-top: 14px;">
              Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage.
            </div>`}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">Instances</div>
        <div class="stat-value">${e.presenceCount}</div>
        <div class="muted">Presence beacons in the last 5 minutes.</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Sessions</div>
        <div class="stat-value">${e.sessionsCount??"n/a"}</div>
        <div class="muted">Recent session keys tracked by the gateway.</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Cron</div>
        <div class="stat-value">
          ${e.cronEnabled==null?"n/a":e.cronEnabled?"Enabled":"Disabled"}
        </div>
        <div class="muted">Next wake ${Pa(e.cronNext)}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Notes</div>
      <div class="card-sub">Quick reminders for remote control setups.</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">Tailscale serve</div>
          <div class="muted">
            Prefer serve mode to keep the gateway on loopback with tailnet auth.
          </div>
        </div>
        <div>
          <div class="note-title">Session hygiene</div>
          <div class="muted">Use /new or sessions.patch to reset context.</div>
        </div>
        <div>
          <div class="note-title">Cron reminders</div>
          <div class="muted">Use isolated sessions for recurring runs.</div>
        </div>
      </div>
    </section>
  `}const lg=["","off","minimal","low","medium","high"],cg=["","off","on"],dg=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],ug=["","off","on","stream"];function pg(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function Na(e){return pg(e)==="zai"}function fg(e){return Na(e)?cg:lg}function hg(e,t){return!t||!e||e==="off"?e:"on"}function gg(e,t){return e?t&&e==="on"?"low":e:null}function mg(e){const t=e.result?.sessions??[];return d`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Sessions</div>
          <div class="card-sub">Active session keys and per-session overrides.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field">
          <span>Active within (minutes)</span>
          <input
            .value=${e.activeMinutes}
            @input=${n=>e.onFiltersChange({activeMinutes:n.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:n.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:n.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:n.target.checked})}
          />
        </label>
      </div>

      ${e.error?d`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}

      <div class="muted" style="margin-top: 12px;">
        ${e.result?`Store: ${e.result.path}`:""}
      </div>

      <div class="table" style="margin-top: 16px;">
        <div class="table-head">
          <div>Key</div>
          <div>Label</div>
          <div>Kind</div>
          <div>Updated</div>
          <div>Tokens</div>
          <div>Thinking</div>
          <div>Verbose</div>
          <div>Reasoning</div>
          <div>Actions</div>
        </div>
        ${t.length===0?d`<div class="muted">No sessions found.</div>`:t.map(n=>vg(n,e.basePath,e.onPatch,e.onDelete,e.loading))}
      </div>
    </section>
  `}function vg(e,t,n,s,i){const o=e.updatedAt?H(e.updatedAt):"n/a",r=e.thinkingLevel??"",c=Na(e.modelProvider),a=hg(r,c),f=fg(e.modelProvider),l=e.verboseLevel??"",p=e.reasoningLevel??"",h=e.displayName??e.key,v=e.kind!=="global",b=v?`${Vs("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return d`
    <div class="table-row">
      <div class="mono">${v?d`<a href=${b} class="session-link">${h}</a>`:h}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${k=>{const A=k.target.value.trim();n(e.key,{label:A||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${o}</div>
      <div>${bh(e)}</div>
      <div>
        <select
          .value=${a}
          ?disabled=${i}
          @change=${k=>{const A=k.target.value;n(e.key,{thinkingLevel:gg(A,c)})}}
        >
          ${f.map(k=>d`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${l}
          ?disabled=${i}
          @change=${k=>{const A=k.target.value;n(e.key,{verboseLevel:A||null})}}
        >
          ${dg.map(k=>d`<option value=${k.value}>${k.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${p}
          ?disabled=${i}
          @change=${k=>{const A=k.target.value;n(e.key,{reasoningLevel:A||null})}}
        >
          ${ug.map(k=>d`<option value=${k}>${k||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <button class="btn danger" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function yg(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function ze(e,t){return t?d`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:m}function bg(e){const t=e.execApprovalQueue[0];if(!t)return m;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${yg(s)}`:"expired",o=e.execApprovalQueue.length;return d`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${o>1?d`<div class="exec-approval-queue">${o} pending</div>`:m}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${ze("Host",n.host)}
          ${ze("Agent",n.agentId)}
          ${ze("Session",n.sessionKey)}
          ${ze("CWD",n.cwd)}
          ${ze("Resolved",n.resolvedPath)}
          ${ze("Security",n.security)}
          ${ze("Ask",n.ask)}
        </div>
        ${e.execApprovalError?d`<div class="exec-approval-error">${e.execApprovalError}</div>`:m}
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-once")}
          >
            Allow once
          </button>
          <button
            class="btn"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-always")}
          >
            Always allow
          </button>
          <button
            class="btn danger"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("deny")}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  `}function wg(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(i=>[i.name,i.description,i.source].join(" ").toLowerCase().includes(n)):t;return d`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Bundled, managed, and workspace skills.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${i=>e.onFilterChange(i.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${s.length} shown</div>
      </div>

      ${e.error?d`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:m}

      ${s.length===0?d`<div class="muted" style="margin-top: 16px;">No skills found.</div>`:d`
            <div class="list" style="margin-top: 16px;">
              ${s.map(i=>$g(i,e))}
            </div>
          `}
    </section>
  `}function $g(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,o=e.install.length>0&&e.missing.bins.length>0,r=[...e.missing.bins.map(a=>`bin:${a}`),...e.missing.env.map(a=>`env:${a}`),...e.missing.config.map(a=>`config:${a}`),...e.missing.os.map(a=>`os:${a}`)],c=[];return e.disabled&&c.push("disabled"),e.blockedByAllowlist&&c.push("blocked by allowlist"),d`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${$s(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?d`<span class="chip chip-warn">disabled</span>`:m}
        </div>
        ${r.length>0?d`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${r.join(", ")}
              </div>
            `:m}
        ${c.length>0?d`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${c.join(", ")}
              </div>
            `:m}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${n}
            @click=${()=>t.onToggle(e.skillKey,e.disabled)}
          >
            ${e.disabled?"Enable":"Disable"}
          </button>
          ${o?d`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:m}
        </div>
        ${i?d`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:m}
        ${e.primaryEnv?d`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${s}
                  @input=${a=>t.onEdit(e.skillKey,a.target.value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${n}
                @click=${()=>t.onSaveKey(e.skillKey)}
              >
                Save key
              </button>
            `:m}
      </div>
    </div>
  `}function kg(e,t){const n=Vs(t,e.basePath);return d`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey||(s.preventDefault(),e.setTab(t))}}
      title=${bs(t)}
    >
      <span class="nav-item__icon" aria-hidden="true">${Yl(t)}</span>
      <span class="nav-item__text">${bs(t)}</span>
    </a>
  `}function Sg(e){const t=xg(e.sessionKey,e.sessionsResult),n=e.onboarding,s=e.onboarding,i=e.onboarding?!1:e.settings.chatShowThinking,o=e.onboarding?!0:e.settings.chatFocusMode,r=d`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>`,c=d`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h3"></path><path d="M20 7V4h-3"></path><path d="M4 17v3h3"></path><path d="M20 17v3h-3"></path><circle cx="12" cy="12" r="3"></circle></svg>`;return d`
    <div class="chat-controls">
      <label class="field chat-controls__session">
        <select
          .value=${e.sessionKey}
          ?disabled=${!e.connected}
          @change=${a=>{const f=a.target.value;e.sessionKey=f,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:f,lastActiveSessionKey:f}),e.loadAssistantIdentity(),jd(e,f),ut(e)}}
        >
          ${ca(t,a=>a.key,a=>d`<option value=${a.key}>
                ${a.displayName??a.key}
              </option>`)}
        </select>
      </label>
      <button
        class="btn btn--sm btn--icon"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),ut(e)}}
        title="Refresh chat history"
      >
        ${r}
      </button>
      <span class="chat-controls__separator">|</span>
      <button
        class="btn btn--sm btn--icon ${i?"active":""}"
        ?disabled=${n}
        @click=${()=>{n||e.applySettings({...e.settings,chatShowThinking:!e.settings.chatShowThinking})}}
        aria-pressed=${i}
        title=${n?"Disabled during onboarding":"Toggle assistant thinking/working output"}
      >
        🧠
      </button>
      <button
        class="btn btn--sm btn--icon ${o?"active":""}"
        ?disabled=${s}
        @click=${()=>{s||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${o}
        title=${s?"Disabled during onboarding":"Toggle focus mode (hide sidebar + page header)"}
      >
        ${c}
      </button>
    </div>
  `}function xg(e,t){const n=new Set,s=[],i=t?.sessions?.find(o=>o.key===e);if(n.add(e),s.push({key:e,displayName:i?.displayName}),t?.sessions)for(const o of t.sessions)n.has(o.key)||(n.add(o.key),s.push({key:o.key,displayName:o.displayName}));return s}const Ag=["system","light","dark"];function _g(e){const t=Math.max(0,Ag.indexOf(e.theme)),n=s=>i=>{const r={element:i.currentTarget};(i.clientX||i.clientY)&&(r.pointerClientX=i.clientX,r.pointerClientY=i.clientY),e.setTheme(s,r)};return d`
    <div class="theme-toggle" style="--theme-index: ${t};">
      <div class="theme-toggle__track" role="group" aria-label="Theme">
        <span class="theme-toggle__indicator"></span>
        <button
          class="theme-toggle__button ${e.theme==="system"?"active":""}"
          @click=${n("system")}
          aria-pressed=${e.theme==="system"}
          aria-label="System theme"
          title="System"
        >
          ${Cg()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${n("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${Tg()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${n("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Eg()}
        </button>
      </div>
    </div>
  `}function Tg(){return d`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `}function Eg(){return d`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function Cg(){return d`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}const Ig=/^data:/i,Rg=/^https?:\/\//i;function Lg(e){const t=e.agentsList?.agents??[],s=Sr(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",o=t.find(c=>c.id===s)?.identity,r=o?.avatarUrl??o?.avatar;if(r)return Ig.test(r)||Rg.test(r)?r:o?.avatarUrl}function Mg(e){const t=e.presenceEntries.length,n=e.sessionsResult?.count??null,s=e.cronStatus?.nextWakeAtMs??null,i=e.connected?null:"Disconnected from gateway.",o=e.tab==="chat",r=o&&(e.settings.chatFocusMode||e.onboarding),c=e.onboarding?!1:e.settings.chatShowThinking,a=Lg(e),f=e.chatAvatarUrl??a??null;return d`
    <div class="shell ${o?"shell--chat":""} ${r?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">☰</span>
          </button>
          <div class="brand">
            <div class="brand-title">CLAWDBOT</div>
            <div class="brand-sub">Gateway Dashboard</div>
          </div>
        </div>
        <div class="topbar-status">
          <div class="pill">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Health</span>
            <span class="mono">${e.connected?"OK":"Offline"}</span>
          </div>
          ${_g(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Wl.map(l=>{const p=e.settings.navGroupsCollapsed[l.label]??!1,h=l.tabs.some(v=>v===e.tab);return d`
            <div class="nav-group ${p&&!h?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const v={...e.settings.navGroupsCollapsed};v[l.label]=!p,e.applySettings({...e.settings,navGroupsCollapsed:v})}}
                aria-expanded=${!p}
              >
                <span class="nav-label__text">${l.label}</span>
                <span class="nav-label__chevron">${p?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${l.tabs.map(v=>kg(e,v))}
              </div>
            </div>
          `})}
        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">Resources</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.clawd.bot"
              target="_blank"
              rel="noreferrer"
              title="Docs (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">📚</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${o?"content--chat":""}">
        <section class="content-header">
          <div>
            <div class="page-title">${bs(e.tab)}</div>
            <div class="page-sub">${Ql(e.tab)}</div>
          </div>
          <div class="page-meta">
            ${e.lastError?d`<div class="pill danger">${e.lastError}</div>`:m}
            ${o?Sg(e):m}
          </div>
        </section>

        ${e.tab==="overview"?ag({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:t,sessionsCount:n,cronEnabled:e.cronStatus?.enabled??null,cronNext:s,lastChannelsRefresh:e.channelsLastSuccess,onSettingsChange:l=>e.applySettings(l),onPasswordChange:l=>e.password=l,onSessionKeyChange:l=>{e.sessionKey=l,e.chatMessage="",e.resetToolStream(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview()}):m}

        ${e.tab==="channels"?ah({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:l=>pe(e,l),onWhatsAppStart:l=>e.handleWhatsAppStart(l),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(l,p)=>nn(e,l,p),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(l,p)=>e.handleNostrProfileEdit(l,p),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(l,p)=>e.handleNostrProfileFieldChange(l,p),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):m}

        ${e.tab==="instances"?Rh({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>si(e)}):m}

        ${e.tab==="sessions"?mg({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,onFiltersChange:l=>{e.sessionsFilterActive=l.activeMinutes,e.sessionsFilterLimit=l.limit,e.sessionsIncludeGlobal=l.includeGlobal,e.sessionsIncludeUnknown=l.includeUnknown},onRefresh:()=>gt(e),onPatch:(l,p)=>ac(e,l,p),onDelete:l=>lc(e,l)}):m}

        ${e.tab==="cron"?_h({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(l=>l.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:l=>e.cronForm={...e.cronForm,...l},onRefresh:()=>e.loadCron(),onAdd:()=>Ic(e),onToggle:(l,p)=>Rc(e,l,p),onRun:l=>Lc(e,l),onRemove:l=>Mc(e,l),onLoadRuns:l=>Mr(e,l)}):m}

        ${e.tab==="skills"?wg({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,onFilterChange:l=>e.skillsFilter=l,onRefresh:()=>zt(e,{clearMessages:!0}),onToggle:(l,p)=>Td(e,l,p),onEdit:(l,p)=>_d(e,l,p),onSaveKey:l=>Ed(e,l),onInstall:(l,p,h)=>Cd(e,l,p,h)}):m}

        ${e.tab==="nodes"?Oh({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>In(e),onDevicesRefresh:()=>Ne(e),onDeviceApprove:l=>md(e,l),onDeviceReject:l=>vd(e,l),onDeviceRotate:(l,p,h)=>yd(e,{deviceId:l,role:p,scopes:h}),onDeviceRevoke:(l,p)=>bd(e,{deviceId:l,role:p}),onLoadConfig:()=>$e(e),onLoadExecApprovals:()=>{const l=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return ni(e,l)},onBindDefault:l=>{l?nn(e,["tools","exec","node"],l):ho(e,["tools","exec","node"])},onBindAgent:(l,p)=>{const h=["agents","list",l,"tools","exec","node"];p?nn(e,h,p):ho(e,h)},onSaveBindings:()=>Ss(e),onExecApprovalsTargetChange:(l,p)=>{e.execApprovalsTarget=l,e.execApprovalsTargetNodeId=p,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:l=>{e.execApprovalsSelectedAgent=l},onExecApprovalsPatch:(l,p)=>xd(e,l,p),onExecApprovalsRemove:l=>Ad(e,l),onSaveExecApprovals:()=>{const l=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Sd(e,l)}}):m}

        ${e.tab==="chat"?mf({sessionKey:e.sessionKey,onSessionKeyChange:l=>{e.sessionKey=l,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:l,lastActiveSessionKey:l}),e.loadAssistantIdentity(),ut(e),Es(e)},thinkingLevel:e.chatThinkingLevel,showThinking:c,loading:e.chatLoading,sending:e.chatSending,compactionStatus:e.compactionStatus,assistantAvatarUrl:f,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:i,error:e.lastError,sessions:e.sessionsResult,focusMode:r,onRefresh:()=>(e.resetToolStream(),Promise.all([ut(e),Es(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:l=>e.handleChatScroll(l),onDraftChange:l=>e.chatMessage=l,onSend:()=>e.handleSendChat(),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onQueueRemove:l=>e.removeQueuedMessage(l),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,splitRatio:e.splitRatio,onOpenSidebar:l=>e.handleOpenSidebar(l),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:l=>e.handleSplitRatioChange(l),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar}):m}

        ${e.tab==="config"?jf({raw:e.configRaw,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:l=>e.configRaw=l,onFormModeChange:l=>e.configFormMode=l,onFormPatch:(l,p)=>nn(e,l,p),onSearchChange:l=>e.configSearchQuery=l,onSectionChange:l=>{e.configActiveSection=l,e.configActiveSubsection=null},onSubsectionChange:l=>e.configActiveSubsection=l,onReload:()=>$e(e),onSave:()=>Ss(e),onApply:()=>_c(e),onUpdate:()=>Tc(e)}):m}

        ${e.tab==="debug"?Ih({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:l=>e.debugCallMethod=l,onCallParamsChange:l=>e.debugCallParams=l,onRefresh:()=>En(e),onCall:()=>Dc(e)}):m}

        ${e.tab==="logs"?Nh({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:l=>e.logsFilterText=l,onLevelToggle:(l,p)=>{e.logsLevelFilters={...e.logsLevelFilters,[l]:p}},onToggleAutoFollow:l=>e.logsAutoFollow=l,onRefresh:()=>Ys(e,{reset:!0}),onExport:(l,p)=>e.exportLogs(l,p),onScroll:l=>e.handleLogsScroll(l)}):m}
      </main>
      ${bg(e)}
    </div>
  `}const Pg={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},Ng={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""};async function Og(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});t&&(e.agentsList=t)}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}const pr={CONTROL_UI:"control-ui"},fr={WEBCHAT:"webchat"};function Dg(e){return JSON.stringify({version:1,deviceId:e.deviceId,clientId:e.clientId,clientMode:e.clientMode,role:e.role,scopes:[...e.scopes].sort(),signedAtMs:e.signedAtMs,token:e.token,nonce:e.nonce??null})}const Fg=4008;class Bg{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.onopen=()=>this.queueConnect(),this.ws.onmessage=t=>this.handleMessage(String(t.data??"")),this.ws.onclose=t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()},this.ws.onerror=()=>{})}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.approvals","operator.pairing"],s="operator";let i=null,o=!1,r=this.opts.token;if(t){i=await Zs();const l=gd({deviceId:i.deviceId,role:s})?.token;r=l??this.opts.token,o=!!(l&&this.opts.token)}const c=r||this.opts.password?{token:r,password:this.opts.password}:void 0;let a;if(t&&i){const l=Date.now(),p=this.connectNonce??void 0,h=Dg({deviceId:i.deviceId,clientId:this.opts.clientName??pr.CONTROL_UI,clientMode:this.opts.mode??fr.WEBCHAT,role:s,scopes:n,signedAtMs:l,token:r??null,nonce:p}),v=await fd(i.privateKey,h);a={id:i.deviceId,publicKey:i.publicKey,signature:v,signedAt:l,nonce:p}}const f={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??pr.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??fr.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:a,caps:[],auth:c,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",f).then(l=>{l?.auth?.deviceToken&&i&&Qr({deviceId:i.deviceId,role:l.auth.role??s,token:l.auth.deviceToken,scopes:l.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(l)}).catch(()=>{o&&i&&Jr({deviceId:i.deviceId,role:s}),this.ws?.close(Fg,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const r=i.payload,c=r&&typeof r.nonce=="string"?r.nonce:null;c&&(this.connectNonce=c,this.sendConnect());return}const o=typeof i.seq=="number"?i.seq:null;o!==null&&(this.lastSeq!==null&&o>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:o}),this.lastSeq=o);try{this.opts.onEvent?.(i)}catch(r){console.error("[gateway] event handler error:",r)}return}if(s.type==="res"){const i=n,o=this.pending.get(i.id);if(!o)return;this.pending.delete(i.id),i.ok?o.resolve(i.payload):o.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=Ws(),i={type:"req",id:s,method:t,params:n},o=new Promise((r,c)=>{this.pending.set(s,{resolve:a=>r(a),reject:c})});return this.ws.send(JSON.stringify(i)),o}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}function Bs(e){return typeof e=="object"&&e!==null}function Ug(e){if(!Bs(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Bs(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,o=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!o?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:o}}function Kg(e){if(!Bs(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Oa(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function zg(e,t){const n=Oa(e).filter(s=>s.id!==t.id);return n.push(t),n}function hr(e,t){return Oa(e).filter(n=>n.id!==t)}async function Da(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const o=ys(i);e.assistantName=o.name,e.assistantAvatar=o.avatar,e.assistantAgentId=o.agentId??null}catch{}}function ms(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",o=t.defaultAgentId?.trim();return n==="main"||n===i||o&&(n===`agent:${o}:main`||n===`agent:${o}:${i}`)?s:n}function Hg(e,t){if(!t?.mainSessionKey)return;const n=ms(e.sessionKey,t),s=ms(e.settings.sessionKey,t),i=ms(e.settings.lastActiveSessionKey,t),o=n||s||e.sessionKey,r={...e.settings,sessionKey:s||o,lastActiveSessionKey:i||o},c=r.sessionKey!==e.settings.sessionKey||r.lastActiveSessionKey!==e.settings.lastActiveSessionKey;o!==e.sessionKey&&(e.sessionKey=o),c&&Re(e,r)}function Fa(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,e.client?.stop(),e.client=new Bg({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"clawdbot-control-ui",mode:"webchat",onHello:t=>{e.connected=!0,e.hello=t,Vg(e,t),Da(e),Og(e),In(e,{quiet:!0}),Ne(e,{quiet:!0}),ci(e)},onClose:({code:t,reason:n})=>{e.connected=!1,e.lastError=`disconnected (${t}): ${n||"no reason"}`},onEvent:t=>jg(e,t),onGap:({expected:t,received:n})=>{e.lastError=`event gap detected (expected seq ${t}, got ${n}); refresh recommended`}}),e.client.start()}function jg(e,t){try{qg(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function qg(e,t){if(e.eventLogBuffer=[{ts:Date.now(),event:t.event,payload:t.payload},...e.eventLogBuffer].slice(0,250),e.tab==="debug"&&(e.eventLog=e.eventLogBuffer),t.event==="agent"){if(e.onboarding)return;yc(e,t.payload);return}if(t.event==="chat"){const n=t.payload;n?.sessionKey&&Xr(e,n.sessionKey);const s=rc(e,n);(s==="final"||s==="error"||s==="aborted")&&(Gs(e),Jd(e)),s==="final"&&ut(e);return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&di(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&Ne(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=Ug(t.payload);if(n){e.execApprovalQueue=zg(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=hr(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.approval.resolved"){const n=Kg(t.payload);n&&(e.execApprovalQueue=hr(e.execApprovalQueue,n.id))}}function Vg(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&Hg(e,n.sessionDefaults)}function Wg(e){e.basePath=Fd(),zd(e,!0),Bd(e),Ud(e),window.addEventListener("popstate",e.popStateHandler),Nd(e),Fa(e),Md(e),e.tab==="logs"&&oi(e),e.tab==="debug"&&ai(e)}function Gg(e){Sc(e)}function Yg(e){window.removeEventListener("popstate",e.popStateHandler),Pd(e),ri(e),li(e),Kd(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Qg(e,t){if(e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("tab"))){const n=t.has("tab"),s=t.has("chatLoading")&&t.get("chatLoading")===!0&&e.chatLoading===!1;_n(e,n||s||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Cr(e,t.has("tab")||t.has("logsAutoFollow"))}async function Jg(e,t){await Pc(e,t),await pe(e,!0)}async function Xg(e){await Nc(e),await pe(e,!0)}async function Zg(e){await Oc(e),await pe(e,!0)}async function em(e){await Ss(e),await $e(e),await pe(e,!0)}async function tm(e){await $e(e),await pe(e,!0)}function nm(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const o=s.trim(),r=i.join(":").trim();o&&r&&(t[o]=r)}return t}function Ba(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Ua(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function sm(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=th(n??void 0)}function im(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function om(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function rm(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function am(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=Ba(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(Ua(n),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const o=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:o,success:null,fieldErrors:nm(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await pe(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function lm(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=Ba(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(Ua(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:a,success:null};return}const o=i.merged??i.imported??null,r=o?{...t.values,...o}:t.values,c=!!(r.banner||r.website||r.nip05||r.lud16);e.nostrProfileFormState={...t,importing:!1,values:r,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:c},i.saved&&await pe(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}var cm=Object.defineProperty,dm=Object.getOwnPropertyDescriptor,w=(e,t,n,s)=>{for(var i=s>1?void 0:s?dm(t,n):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(i=(s?r(t,n,i):r(i))||i);return s&&i&&cm(t,n,i),i};const vs=jl();function um(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}let y=class extends ct{constructor(){super(...arguments),this.settings=ql(),this.password="",this.tab="chat",this.onboarding=um(),this.connected=!1,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.eventLogBuffer=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.assistantName=vs.name,this.assistantAvatar=vs.avatar,this.assistantAgentId=vs.agentId??null,this.sessionKey=this.settings.sessionKey,this.chatLoading=!1,this.chatSending=!1,this.chatMessage="",this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.splitRatio=this.settings.splitRatio,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...Ng},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...Pg},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.basePath="",this.popStateHandler=()=>Hd(this),this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),Wg(this)}firstUpdated(){Gg(this)}disconnectedCallback(){Yg(this),super.disconnectedCallback()}updated(e){Qg(this,e)}connect(){Fa(this)}handleChatScroll(e){bc(this,e)}handleLogsScroll(e){wc(this,e)}exportLogs(e,t){kc(e,t)}resetToolStream(){Gs(this)}resetChatScroll(){$c(this)}async loadAssistantIdentity(){await Da(this)}applySettings(e){Re(this,e)}setTab(e){Od(this,e)}setTheme(e,t){Dd(this,e,t)}async loadOverview(){await ta(this)}async loadCron(){await di(this)}async handleAbortChat(){await sa(this)}removeQueuedMessage(e){Gd(this,e)}async handleSendChat(e,t){await Yd(this,e,t)}async handleWhatsAppStart(e){await Jg(this,e)}async handleWhatsAppWait(){await Xg(this)}async handleWhatsAppLogout(){await Zg(this)}async handleChannelConfigSave(){await em(this)}async handleChannelConfigReload(){await tm(this)}handleNostrProfileEdit(e,t){sm(this,e,t)}handleNostrProfileCancel(){im(this)}handleNostrProfileFieldChange(e,t){om(this,e,t)}async handleNostrProfileSave(){await am(this)}async handleNostrProfileImport(){await lm(this)}handleNostrProfileToggleAdvanced(){rm(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleOpenSidebar(e){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarCloseTimer=null)},200)}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}render(){return Mg(this)}};w([$()],y.prototype,"settings",2);w([$()],y.prototype,"password",2);w([$()],y.prototype,"tab",2);w([$()],y.prototype,"onboarding",2);w([$()],y.prototype,"connected",2);w([$()],y.prototype,"theme",2);w([$()],y.prototype,"themeResolved",2);w([$()],y.prototype,"hello",2);w([$()],y.prototype,"lastError",2);w([$()],y.prototype,"eventLog",2);w([$()],y.prototype,"assistantName",2);w([$()],y.prototype,"assistantAvatar",2);w([$()],y.prototype,"assistantAgentId",2);w([$()],y.prototype,"sessionKey",2);w([$()],y.prototype,"chatLoading",2);w([$()],y.prototype,"chatSending",2);w([$()],y.prototype,"chatMessage",2);w([$()],y.prototype,"chatMessages",2);w([$()],y.prototype,"chatToolMessages",2);w([$()],y.prototype,"chatStream",2);w([$()],y.prototype,"chatStreamStartedAt",2);w([$()],y.prototype,"chatRunId",2);w([$()],y.prototype,"compactionStatus",2);w([$()],y.prototype,"chatAvatarUrl",2);w([$()],y.prototype,"chatThinkingLevel",2);w([$()],y.prototype,"chatQueue",2);w([$()],y.prototype,"sidebarOpen",2);w([$()],y.prototype,"sidebarContent",2);w([$()],y.prototype,"sidebarError",2);w([$()],y.prototype,"splitRatio",2);w([$()],y.prototype,"nodesLoading",2);w([$()],y.prototype,"nodes",2);w([$()],y.prototype,"devicesLoading",2);w([$()],y.prototype,"devicesError",2);w([$()],y.prototype,"devicesList",2);w([$()],y.prototype,"execApprovalsLoading",2);w([$()],y.prototype,"execApprovalsSaving",2);w([$()],y.prototype,"execApprovalsDirty",2);w([$()],y.prototype,"execApprovalsSnapshot",2);w([$()],y.prototype,"execApprovalsForm",2);w([$()],y.prototype,"execApprovalsSelectedAgent",2);w([$()],y.prototype,"execApprovalsTarget",2);w([$()],y.prototype,"execApprovalsTargetNodeId",2);w([$()],y.prototype,"execApprovalQueue",2);w([$()],y.prototype,"execApprovalBusy",2);w([$()],y.prototype,"execApprovalError",2);w([$()],y.prototype,"configLoading",2);w([$()],y.prototype,"configRaw",2);w([$()],y.prototype,"configValid",2);w([$()],y.prototype,"configIssues",2);w([$()],y.prototype,"configSaving",2);w([$()],y.prototype,"configApplying",2);w([$()],y.prototype,"updateRunning",2);w([$()],y.prototype,"applySessionKey",2);w([$()],y.prototype,"configSnapshot",2);w([$()],y.prototype,"configSchema",2);w([$()],y.prototype,"configSchemaVersion",2);w([$()],y.prototype,"configSchemaLoading",2);w([$()],y.prototype,"configUiHints",2);w([$()],y.prototype,"configForm",2);w([$()],y.prototype,"configFormOriginal",2);w([$()],y.prototype,"configFormDirty",2);w([$()],y.prototype,"configFormMode",2);w([$()],y.prototype,"configSearchQuery",2);w([$()],y.prototype,"configActiveSection",2);w([$()],y.prototype,"configActiveSubsection",2);w([$()],y.prototype,"channelsLoading",2);w([$()],y.prototype,"channelsSnapshot",2);w([$()],y.prototype,"channelsError",2);w([$()],y.prototype,"channelsLastSuccess",2);w([$()],y.prototype,"whatsappLoginMessage",2);w([$()],y.prototype,"whatsappLoginQrDataUrl",2);w([$()],y.prototype,"whatsappLoginConnected",2);w([$()],y.prototype,"whatsappBusy",2);w([$()],y.prototype,"nostrProfileFormState",2);w([$()],y.prototype,"nostrProfileAccountId",2);w([$()],y.prototype,"presenceLoading",2);w([$()],y.prototype,"presenceEntries",2);w([$()],y.prototype,"presenceError",2);w([$()],y.prototype,"presenceStatus",2);w([$()],y.prototype,"agentsLoading",2);w([$()],y.prototype,"agentsList",2);w([$()],y.prototype,"agentsError",2);w([$()],y.prototype,"sessionsLoading",2);w([$()],y.prototype,"sessionsResult",2);w([$()],y.prototype,"sessionsError",2);w([$()],y.prototype,"sessionsFilterActive",2);w([$()],y.prototype,"sessionsFilterLimit",2);w([$()],y.prototype,"sessionsIncludeGlobal",2);w([$()],y.prototype,"sessionsIncludeUnknown",2);w([$()],y.prototype,"cronLoading",2);w([$()],y.prototype,"cronJobs",2);w([$()],y.prototype,"cronStatus",2);w([$()],y.prototype,"cronError",2);w([$()],y.prototype,"cronForm",2);w([$()],y.prototype,"cronRunsJobId",2);w([$()],y.prototype,"cronRuns",2);w([$()],y.prototype,"cronBusy",2);w([$()],y.prototype,"skillsLoading",2);w([$()],y.prototype,"skillsReport",2);w([$()],y.prototype,"skillsError",2);w([$()],y.prototype,"skillsFilter",2);w([$()],y.prototype,"skillEdits",2);w([$()],y.prototype,"skillsBusyKey",2);w([$()],y.prototype,"skillMessages",2);w([$()],y.prototype,"debugLoading",2);w([$()],y.prototype,"debugStatus",2);w([$()],y.prototype,"debugHealth",2);w([$()],y.prototype,"debugModels",2);w([$()],y.prototype,"debugHeartbeat",2);w([$()],y.prototype,"debugCallMethod",2);w([$()],y.prototype,"debugCallParams",2);w([$()],y.prototype,"debugCallResult",2);w([$()],y.prototype,"debugCallError",2);w([$()],y.prototype,"logsLoading",2);w([$()],y.prototype,"logsError",2);w([$()],y.prototype,"logsFile",2);w([$()],y.prototype,"logsEntries",2);w([$()],y.prototype,"logsFilterText",2);w([$()],y.prototype,"logsLevelFilters",2);w([$()],y.prototype,"logsAutoFollow",2);w([$()],y.prototype,"logsTruncated",2);w([$()],y.prototype,"logsCursor",2);w([$()],y.prototype,"logsLastFetchAt",2);w([$()],y.prototype,"logsLimit",2);w([$()],y.prototype,"logsMaxBytes",2);w([$()],y.prototype,"logsAtBottom",2);y=w([$r("clawdbot-app")],y);
//# sourceMappingURL=index-CoGWmRHF.js.map
