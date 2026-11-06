const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const SCRIPT = fs.readFileSync(path.resolve(__dirname, "../site-i18n.js"), "utf8");
const PAGES = ["home","privacy","terms","deletion"];
function browser({page="home",languages=["en-US"],stored=null,langParam=null}={}){
 const routes={home:"/",privacy:"/privacy.html",terms:"/terms.html",deletion:"/account-deletion.html"};
 const pathname=routes[page];const query=langParam?"?lang="+langParam:"";
 const origin="https://planififni-sketch.github.io";
 const url=origin+pathname+query;
 const main={dataset:{page},innerHTML:"ORIGINAL_ENGLISH_PAGE"};
 const brand={textContent:"Camping Morocco"};
 const meta={textContent:"Independent campsite information and discovery guide for Morocco."};
 const support={textContent:"Support"};
 const footerLinks=["Google Play","Privacy","Terms","Delete account"].map(textContent=>({textContent}));
 const footer={querySelector(key){if(key===".meta")return meta;if(key===".footer-inner>div:last-child a")return support;return null;},querySelectorAll(key){if(key===".footer-inner>div:nth-child(2) a")return footerLinks;return [];}};
 const linkPaths=["/","https://play.google.com/store/apps/details?id=ma.campingmorocco.app","/privacy.html","/terms.html","/account-deletion.html","/#contact"];
 const links=linkPaths.map((raw,i)=>({
   textContent:["Home","Google Play","Privacy","Terms","Delete account","Contact"][i],
   _raw:raw,getAttribute(key){if(key==="href")return this._raw;return null;},
   set href(value){this._raw=value;},get href(){return this._raw;}
 }));
 const label={textContent:"Language:"};const select={value:"auto",addEventListener(event,fn){if(event==="change")this.change=fn;}};
 const document={documentElement:{lang:"en",dir:"ltr"},title:"Initial",querySelector(selector){return ({
  main:main,".brand > span:last-child":brand,".footer":footer,"#site-language":select,"#site-language-label":label
 })[selector]||null;},querySelectorAll(selector){if(selector==="header .links a"||selector==="a[href]")return links;return [];}};
 const memory=new Map();if(stored!==null)memory.set("camping-morocco-site-language",stored);
 const localStorage={getItem(k){return memory.has(k)?memory.get(k):null;},setItem(k,v){memory.set(k,v);}};
 const history={last:null,replaceState(_state,_title,next){this.last=next;}};
 vm.runInNewContext(SCRIPT,{document,location:{origin,pathname,search:query,href:url},URL,URLSearchParams,navigator:{languages},localStorage,history,console},{timeout:1000});
 return {document,main,brand,footer,meta,support,links,label,select,history,memory};
}
test("automatic browser-language selection and RTL",()=>{
 const fr=browser({languages:["fr-MA","ar-MA","en-US"]});
 assert.equal(fr.document.documentElement.lang,"fr");
 assert.equal(fr.document.documentElement.dir,"ltr");
 assert.match(fr.main.innerHTML,/Trouvez votre prochain camping/);
 assert.equal(fr.select.value,"auto");
 const ar=browser({languages:["ar-MA","fr-FR"]});
 assert.equal(ar.document.documentElement.lang,"ar");
 assert.equal(ar.document.documentElement.dir,"rtl");
 assert.match(ar.main.innerHTML,/اعثر على وجهتك المقبلة/);
});
test("manual selection persists and is reflected in internal links",()=>{
 const b=browser({languages:["fr-FR"]});
 b.select.change({target:{value:"ar"}});
 assert.equal(b.document.documentElement.lang,"ar");
 assert.equal(b.memory.get("camping-morocco-site-language"),"ar");
 assert.match(b.links[2].href,/privacy\.html\?lang=ar/);
 assert.equal(b.history.last,"/?lang=ar");
 const saved=browser({languages:["de-DE"],stored:"es",page:"terms"});
 assert.equal(saved.document.documentElement.lang,"es");
 assert.match(saved.main.innerHTML,/Condiciones de uso/);
});
test("direct links take precedence and unsupported languages fall back to English",()=>{
 const de=browser({languages:["ar-MA"],stored:"fr",langParam:"de",page:"deletion"});
 assert.equal(de.document.documentElement.lang,"de");
 assert.match(de.main.innerHTML,/Kontolöschung/);
 const en=browser({languages:["pt-PT","zh-CN"],page:"home"});
 assert.equal(en.document.documentElement.lang,"en");
 assert.equal(en.main.innerHTML,"ORIGINAL_ENGLISH_PAGE");
});
test("all four translated pages include their legal contact links",()=>{
 for(const locale of ["ar","fr","de","es"]){
  for(const page of PAGES){
   const b=browser({languages:["en-US"],langParam:locale,page});
   assert.equal(b.document.documentElement.lang,locale);
   assert.ok(b.main.innerHTML.length>300,locale+" "+page);
   if(page==="privacy"||page==="deletion"){
    assert.match(b.main.innerHTML,/bisapp\.ink@outlook\.com/);
   }
   if(page==="deletion")assert.match(b.main.innerHTML,/camping-morocco-production\.up\.railway\.app\/account-deletion/);
  }
 }
});
