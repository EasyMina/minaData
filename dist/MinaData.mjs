/*! For license information please see MinaData.mjs.LICENSE.txt */
var t={d:(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};function r(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i,a,u=[],c=!0,s=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=i.call(r)).done)&&(u.push(n.value),u.length!==e);c=!0);}catch(t){s=!0,o=t}finally{try{if(!c&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(s)throw o}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}t.d(e,{O:()=>M});var o={presets:{transactionByHash:{description:"Retrieve transaction data using a given transaction hash.",input:{query:"query q($hash: String!) {\n  transaction(query: {hash: $hash}) {\n    hash\n    dateTime\n    blockHeight\n    from\n    nonce\n    to\n    toAccount {\n      token\n    }\n  }\n}",variables:{hash:{default:"5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1",description:"Set the transaction hash string.",regex:"regexs__transactionHash",required:!0,type:"string"}}},expect:{key:"transaction",type:"hash"}},latestBlockHeight:{description:"Retrieve the most recent block height from the selected blockchain.",input:{query:"query q($blockHeight_lt: Int) {\n  block(query: {blockHeight_lt: $blockHeight_lt}) {\n    blockHeight\n    dateTime\n  }\n}",variables:{blockHeight_lt:{default:999999999,description:"Set the highest block height.",regex:"regexs__blockHeight_lt",required:!1,type:"number"}}},expect:{key:"block",type:"hash"}},latestBlockHeights:{description:"Retrieve the most recent block height from the selected blockchain.",input:{query:"query q($limit: Int) {\n  blocks(limit: $limit, sortBy: BLOCKHEIGHT_DESC) {\n    blockHeight\n    protocolState {\n      consensusState {\n        slotSinceGenesis\n        slot\n      }\n    }\n    dateTime\n    receivedTime\n  }\n}",variables:{limit:{default:10,description:"Set a limit on how many results will be shown.",regex:"regexs__limit",required:!1,type:"number"}}},expect:{key:"blocks",type:"array"}},latestEventsFromContract:{description:"Retrieve the latest events from a Mina contract.",input:{query:"query q($limit: Int!, $blockHeight_lt: Int!, $creator: String!) {\n events(query: {blockHeight_lt: $blockHeight_lt, blockStateHash: {creator: $creator}}, sortBy: BLOCKHEIGHT_DESC, limit: $limit) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",variables:{creator:{default:"B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM",description:"Set the creator's address as the minimum address.",regex:"regexs__minaAddress",required:!0,type:"string"},limit:{default:10,description:"Set a limit on how many results will be shown.",regex:"regexs__limit",required:!1,type:"number"},blockHeight_lt:{default:999999999,description:"highest block",regex:"regexs__blockHeight_lt",required:!1,type:"number"}}},expect:{key:"events",type:"array"}}},regexs:{transactionHash:/^[a-zA-Z0-9]{52}$/,blockHeight_lt:/^(0|[1-9]\d{0,8})$/,limit:/[0-9]{0,2}/,minaAddress:/^B62[1-9A-HJ-NP-Za-km-z]{0,}$/}},i=Object.entries(o.presets).reduce((function(t,e,n){var i=r(e,2),a=i[0],u=i[1];return t[a]=u,t[a].input.variables=Object.entries(t[a].input.variables).reduce((function(t,e,n){var i=r(e,2),a=i[0],u=i[1];return t[a]=u,t[a].regex=function(t){var e=t.data,r=t.keyPath,n=t.separator,o=void 0===n?"__":n;if("string"==typeof r)return r.split(o).reduce((function(t,e,r){if(t&&t.hasOwnProperty(e))return t[e]}),e);console.log("KeyPath: ".concat(r,' is not a "string".'))}({data:o,keyPath:t[a].regex}),t}),{}),t}),{});function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function u(){u=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},c=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function h(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{h({},"")}catch(t){h=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var i=e&&e.prototype instanceof m?e:m,a=Object.create(i.prototype),u=new I(n||[]);return o(a,"_invoke",{value:q(t,r,u)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var y="suspendedStart",d="suspendedYield",v="executing",b="completed",g={};function m(){}function w(){}function k(){}var x={};h(x,c,(function(){return this}));var O=Object.getPrototypeOf,j=O&&O(O(T([])));j&&j!==r&&n.call(j,c)&&(x=j);var E=k.prototype=m.prototype=Object.create(x);function S(t){["next","throw","return"].forEach((function(e){h(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function r(o,i,u,c){var s=p(t[o],t,i);if("throw"!==s.type){var l=s.arg,h=l.value;return h&&"object"==a(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,u,c)}),(function(t){r("throw",t,u,c)})):e.resolve(h).then((function(t){l.value=t,u(l)}),(function(t){return r("throw",t,u,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function q(e,r,n){var o=y;return function(i,a){if(o===v)throw new Error("Generator is already running");if(o===b){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var u=n.delegate;if(u){var c=L(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=b,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?b:d,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=b,n.method="throw",n.arg=s.arg)}}}function L(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,L(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function H(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function T(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(a(e)+" is not iterable")}return w.prototype=k,o(E,"constructor",{value:k,configurable:!0}),o(k,"constructor",{value:w,configurable:!0}),w.displayName=h(k,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,k):(t.__proto__=k,h(t,l,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},S(_.prototype),h(_.prototype,s,(function(){return this})),e.AsyncIterator=_,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new _(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(E),h(E,l,"Generator"),h(E,c,(function(){return this})),h(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=T,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(H),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),H(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;H(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function c(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i,a,u=[],c=!0,s=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=i.call(r)).done)&&(u.push(n.value),u.length!==e);c=!0);}catch(t){s=!0,o=t}finally{try{if(!c&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(s)throw o}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return s(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function l(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function h(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,(void 0,o=function(t,e){if("object"!==a(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,"string");if("object"!==a(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(n.key),"symbol"===a(o)?o:String(o)),n)}var o}function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){var e="function"==typeof Map?new Map:void 0;return p=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return y(t,arguments,b(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),v(r,t)},p(t)}function y(t,e,r){return y=d()?Reflect.construct.bind():function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&v(o,r.prototype),o},y.apply(null,arguments)}function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function v(t,e){return v=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},v(t,e)}function b(t){return b=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},b(t)}function g(t,e){w(t,e),e.add(t)}function m(t,e,r){w(t,e),e.set(t,r)}function w(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function k(t,e){return function(t,e){return e.get?e.get.call(t):e.value}(t,j(t,e,"get"))}function x(t,e,r){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return r}function O(t,e,r){return function(t,e,r){if(e.set)e.set.call(t,r);else{if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=r}}(t,j(t,e,"set"),r),r}function j(t,e,r){if(!e.has(t))throw new TypeError("attempted to "+r+" private field on non-instance");return e.get(t)}var E=new WeakMap,S=new WeakMap,_=new WeakMap,q=new WeakMap,L=new WeakSet,P=new WeakSet,H=new WeakSet,I=new WeakSet,T=new WeakSet,A=new WeakSet,M=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&v(t,e)}(w,p(EventTarget));var e,r,n,o,i,s,y=(i=w,s=d(),function(){var t,e=b(i);if(s){var r=b(this).constructor;t=Reflect.construct(e,arguments,r)}else t=e.apply(this,arguments);return function(t,e){if(e&&("object"===a(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return f(t)}(this,t)});function w(){var t,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,w),g(f(t=y.call(this)),A),g(f(t),T),g(f(t),I),g(f(t),H),g(f(t),P),g(f(t),L),m(f(t),E,{writable:!0,value:void 0}),m(f(t),S,{writable:!0,value:void 0}),m(f(t),_,{writable:!0,value:void 0}),m(f(t),q,{writable:!0,value:void 0}),O(f(t),S,e),O(f(t),E,{event:{singleFetch:"status",subgroup:"subgroup"},render:{frameInterval:1e3,delayBetweenRequests:1e4,singleMaxInSeconds:30},network:{berkeley:{explorer:{transaction:"https://berkeley.minaexplorer.com/transaction/",wallet:"https://berkeley.minaexplorer.com/wallet/"},node:"https://berkeley.graphql.minaexplorer.com",nodeProxy:"https://proxy.berkeley.minaexplorer.com/graphql",graphQl:"https://berkeley.graphql.minaexplorer.com",faucet:{api:"https://faucet.minaprotocol.com/api/v1/faucet",web:"https://faucet.minaprotocol.com/?address={{address}}",network:"berkeley-qanet"},transaction_fee:1e8}}}),t}return e=w,r=[{key:"setEnvironment",value:function(t){var e=t.network;return x(this,L,$).call(this),Object.keys(k(this,E).network).includes(e)?(O(this,_,{environment:!0,nonce:0,subgroups:{},network:e}),!0):(console.log('Network "'.concat(e,'" does not exist.')),!0)}},{key:"getPresets",value:function(){return Object.keys(k(this,q))}},{key:"getPreset",value:function(t){var e=t.key;return k(this,q)[e]}},{key:"getData",value:(n=u().mark((function t(e){var r,n,o,i,a,s,l,h,f,p,y,d,v,b,g,m,w,O,j;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=e.preset,n=e.userVars,o=e.subgroup,i=void 0===o?"default":o,a=x(this,P,B).call(this,{preset:r,userVars:n,subgroup:i}),s=c(a,3),l=s[0],h=s[1],f=s[2],k(this,S)&&h.forEach((function(t){return console.log(t)})),0===l.length){t.next=6;break}return l.forEach((function(t){return console.log(t)})),t.abrupt("return",!0);case 6:return p=k(this,_).nonce,k(this,_).nonce++,Object.hasOwn(k(this,_).subgroups,i)||(k(this,_).subgroups[i]={time:performance.now(),ids:{}},x(this,I,N).call(this,{subgroup:i,status:"started",data:null})),k(this,_).subgroups[i].ids[p]=-1,y=x(this,A,C).call(this,{cmd:r,data:f}),x(this,T,F).call(this,{eventId:p,preset:r,status:"started",subgroup:i,data:null}),d=null,t.prev=13,v=performance.now(),t.next=17,fetch(y.fetch.url,{method:y.fetch.method,headers:y.fetch.headers,body:y.fetch.data});case 17:return b=t.sent,t.next=20,b.json();case 20:d=t.sent,g=performance.now(),m=g-v,x(this,T,F).call(this,{eventId:p,preset:r,status:"success (".concat(Math.floor(m)," ms)"),subgroup:i,data:JSON.stringify(d)}),k(this,_).subgroups[i].ids[p]=1,t.next=32;break;case 27:t.prev=27,t.t0=t.catch(13),console.log("Following error occured: ".concat(t.t0)),x(this,T,F).call(this,{eventId:p,preset:r,status:"failed!",subgroup:i,data:null}),k(this,_).subgroups[i].ids[p]=0;case 32:return Object.entries(k(this,_).subgroups[i].ids).every((function(t){var e=c(t,2);return e[0],-1!==e[1]}))?(console.log("inside"),w=Object.entries(k(this,_).subgroups[i].ids).every((function(t){var e=c(t,2);return e[0],1===e[1]})),O=performance.now(),j=O-k(this,_).subgroups[i].time,w?x(this,I,N).call(this,{subgroup:i,status:"success! (".concat(j," ms)"),data:JSON.stringify(k(this,_).subgroups[i].ids)}):x(this,I,N).call(this,{subgroup:i,status:"failed!",data:JSON.stringify(k(this,_).subgroups[i].ids)})):console.log("outsude"),t.abrupt("return",[p,d]);case 35:case"end":return t.stop()}}),t,this,[[13,27]])})),o=function(){var t=this,e=arguments;return new Promise((function(r,o){var i=n.apply(t,e);function a(t){l(i,r,o,a,u,"next",t)}function u(t){l(i,r,o,a,u,"throw",t)}a(void 0)}))},function(t){return o.apply(this,arguments)})}],r&&h(e.prototype,r),Object.defineProperty(e,"prototype",{writable:!1}),w}();function $(){O(this,q,i)}function B(t){var e=this,r=t.preset,n=t.userVars,o=(t.subgroup,[]),i=[];this.getPresets().includes(r)?this.getPreset({key:r}):o.push("preset: ".concat(r," does not exist"));var a=["query","variables"].reduce((function(t,a,u){switch(a){case"query":t.query=k(e,q)[r].input.query;break;case"variables":!Object.hasOwn(t,a)&&(t.variables={}),Object.entries(k(e,q)[r].input.variables).forEach((function(e){var r=c(e,2),a=r[0],u=r[1];Object.hasOwn(n,a)?u.regex.test(n[a])?"number"===u.type?t.variables[a]=parseInt(n[a]):t.variables[a]=n[a]:o.push("userInput ".concat(a,": ").concat(n[a]," is not matching ").concat(u.regex)):u.required?o.push("userInput ".concat(a," is missing and required.")):(i.push("userInput ".concat(a,' is missing, default "').concat(u.default,'" will set instead.')),t.variables[a]=u.default)}))}return t}),{});return[o,i,a]}function N(t){var e=t.subgroup,r=t.status,n=t.data,o=new CustomEvent(k(this,E).event.subgroup,{detail:{subgroup:e,status:r,data:n}});return this.dispatchEvent(o),!0}function F(t){var e=t.eventId,r=t.preset,n=t.status,o=t.subgroup,i=t.data,a=new CustomEvent(k(this,E).event.singleFetch,{detail:{eventId:e,preset:r,subgroup:o,status:n,data:i}});return this.dispatchEvent(a),!0}function C(t){t.cmd;var e=t.data;k(this,S)&&console.log("");var r=k(this,_).network;return{fetch:{method:"post",maxBodyLength:1/0,url:k(this,E).network[r].graphQl,headers:{"Content-Type":"application/json",Accept:"application/json"},data:JSON.stringify(e)}}}var G=e.O;export{G as MinaData};