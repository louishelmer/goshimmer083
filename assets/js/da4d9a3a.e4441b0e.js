(self.webpackChunkdoc_ops=self.webpackChunkdoc_ops||[]).push([[1258],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return p},kt:function(){return d}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(r),d=o,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||a;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},389:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return p},default:function(){return m}});var n=r(2122),o=r(9756),a=(r(7294),r(3905)),i=["components"],l={},s="How to do a release",c={unversionedId:"teamresources/release",id:"teamresources/release",isDocsHomePage:!1,title:"How to do a release",description:"1. Create a PR into develop updating the banner version (plugins/banner.AppVersion) and mentioning the changes in CHANGELOG.md",source:"@site/docs/teamresources/release.md",sourceDirName:"teamresources",slug:"/teamresources/release",permalink:"/docs/teamresources/release",editUrl:"https://github.com/iotaledger/Goshimmer/tree/develop/docOps/docs/teamresources/release.md",version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Integration tests with Docker",permalink:"/docs/tooling/integration_tests"},next:{title:"Code guidelines",permalink:"/docs/teamresources/guidelines"}},p=[],u={toc:p};function m(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"how-to-do-a-release"},"How to do a release"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Create a PR into ",(0,a.kt)("inlineCode",{parentName:"li"},"develop")," updating the banner version (",(0,a.kt)("inlineCode",{parentName:"li"},"plugins/banner.AppVersion"),") and mentioning the changes in ",(0,a.kt)("inlineCode",{parentName:"li"},"CHANGELOG.md")),(0,a.kt)("li",{parentName:"ol"},"Create a PR merging ",(0,a.kt)("inlineCode",{parentName:"li"},"develop")," into ",(0,a.kt)("inlineCode",{parentName:"li"},"master")),(0,a.kt)("li",{parentName:"ol"},"Create a release via the release page with the same changelog entries as in ",(0,a.kt)("inlineCode",{parentName:"li"},"CHANGELOG.md")," for the given version tagging the ",(0,a.kt)("inlineCode",{parentName:"li"},"master")," branch"),(0,a.kt)("li",{parentName:"ol"},"Pray that the CI gods let the build pass"),(0,a.kt)("li",{parentName:"ol"},"Check that the binaries are working"),(0,a.kt)("li",{parentName:"ol"},"Stop the entry-node"),(0,a.kt)("li",{parentName:"ol"},"Delete DB"),(0,a.kt)("li",{parentName:"ol"},"Update version in docker-compose"),(0,a.kt)("li",{parentName:"ol"},"Pull newest image"),(0,a.kt)("li",{parentName:"ol"},"Start the node")))}m.isMDXComponent=!0}}]);