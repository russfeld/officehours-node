import{a as se,d as j,u as he,o as F,L as l,r as $,b as a,c,e as t,f as u,w as x,g as r,R as A,h as E,i as k,t as S,p as H,j as V,k as C,S as pe,F as w,l as fe,m as B,n as R,s as T,q as J,v as me,x as ye,y as be,z as ne,M as z,A as oe,B as ae,C as Y,D as G,E as re,G as U,H as ie,I as ce,J as ve,K as ke,N as O,O as ge,P as we,Q as qe,T as $e,U as Se,V as xe,W as Ce,X as Qe,Y as Oe,Z as Ne,_ as Le,$ as Te,a0 as Re,a1 as Ie,a2 as Ae,a3 as Ee,a4 as Me,a5 as Je}from"./vendor.c0c8c140.js";const Ue=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const _ of d.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&i(_)}).observe(document,{childList:!0,subtree:!0});function n(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerpolicy&&(d.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?d.credentials="include":o.crossorigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function i(o){if(o.ep)return;o.ep=!0;const d=n(o);fetch(o.href,d)}};Ue();const q=se.create({baseURL:"/",headers:{Accept:"application/json","Content-Type":"application/json"}}),Q=j("token",{state:()=>({token:he("token","")}),getters:{refresh_token(){return this.token?F(this.token).refresh_token:""},eid(){return this.token?F(this.token).eid:""},id(){return this.token?F(this.token).user_id:""},is_admin(){return this.token?F(this.token).is_admin:!1}},actions:{async getToken(){l.info("token:get"),await q.get("/auth/token",{withCredentials:!0}).then(e=>{this.token=e.data.token}).catch(e=>{e.response&&e.response.status===401?(l.info("token:get login failed - redirecting to CAS"),window.location.href="/auth/login"):(l.error("token:get error"+JSON.stringify(e)),this.token="")})},async tryToken(){l.info("token:try"),await q.get("/auth/token",{withCredentials:!0}).then(e=>{this.token=e.data.token}).catch(async e=>{e.response&&e.response.status===401?(l.info("token:try login failed - trying refresh token"),await this.refreshToken()):(l.error("token:try error"+JSON.stringify(e)),this.token="")})},async refreshToken(){l.info("token:refresh"),await q.post("/auth/token",{refresh_token:this.refresh_token}).then(e=>{this.token=e.data.token}).catch(e=>{e.response&&e.response.status===401?(l.info("token:refresh login failed - redirecting to CAS"),window.location.href="/auth/login"):(l.error("token:refresh error"+JSON.stringify(e)),this.token="")})},async logout(){this.token="",window.location.href="http://localhost:3000/auth/logout"}}});var M=(e,s)=>{const n=e.__vccOpts||e;for(const[i,o]of s)n[i]=o;return n};const je=e=>(H("data-v-41093076"),e=e(),V(),e),De={class:"navbar navbar-expand-md navbar-dark fixed-top bg-purple"},Pe={class:"container"},Ke=k("Office Hours"),Fe=je(()=>t("button",{class:"navbar-toggler",type:"button","data-bs-toggle":"collapse","data-bs-target":"#navbarCollapse","aria-controls":"navbarCollapse","aria-expanded":"false","aria-label":"Toggle navigation"},[t("span",{class:"navbar-toggler-icon"})],-1)),He={id:"navbarCollapse",class:"collapse navbar-collapse"},Ve={class:"navbar-nav me-auto mb-2 mb-md-0"},Be={class:"nav-item"},We=k("Queues"),ze={class:"nav-item"},Ye=k("About"),Ge={key:0,class:"nav-item"},Xe=k("Admin"),Ze={class:""},et={key:0},tt={class:"navbar-nav me-auto mb-2 mb-md-0"},st={class:"nav-item"},nt={class:"nav-item"},ot=k(" Logout"),at={key:1},rt=k(" Login"),it={setup(e){const s=Q();return(n,i)=>{const o=$("font-awesome-icon");return a(),c("nav",De,[t("div",Pe,[u(r(A),{to:"/",class:"navbar-brand"},{default:x(()=>[Ke]),_:1}),Fe,t("div",He,[t("ul",Ve,[t("li",Be,[u(r(A),{to:"/queues","active-class":"active",class:"nav-link"},{default:x(()=>[We]),_:1})]),t("li",ze,[u(r(A),{to:"/about","active-class":"active",class:"nav-link"},{default:x(()=>[Ye]),_:1})]),r(s).is_admin?(a(),c("li",Ge,[u(r(A),{to:"/admin","active-class":"active",class:"nav-link"},{default:x(()=>[Xe]),_:1})])):E("",!0)]),t("div",Ze,[r(s).token?(a(),c("div",et,[t("ul",tt,[t("li",st,[u(r(A),{to:"/profile","active-class":"active",class:"nav-link"},{default:x(()=>[u(o,{icon:"user"}),k(" "+S(r(s).eid),1)]),_:1})]),t("li",nt,[t("a",{class:"btn btn-success float-end",onClick:i[0]||(i[0]=d=>r(s).logout())},[u(o,{icon:"arrow-right-from-bracket"}),ot])])])])):(a(),c("div",at,[t("a",{class:"btn btn-success",onClick:i[1]||(i[1]=d=>r(s).getToken())},[u(o,{icon:"arrow-right-to-bracket"}),rt])]))])])])])}}};var ct=M(it,[["__scopeId","data-v-41093076"]]);const ut={id:"main",class:"container px-4 py-5"},lt={setup(e){return(s,n)=>(a(),c(w,null,[t("header",null,[u(ct)]),t("div",ut,[(a(),C(pe,null,{default:x(()=>[u(r(fe))]),_:1}))])],64))}};var dt=M(lt,[["__scopeId","data-v-7a5a2909"]]);const _t="modulepreload",te={},ht="/",pt=function(s,n){return!n||n.length===0?s():Promise.all(n.map(i=>{if(i=`${ht}${i}`,i in te)return;te[i]=!0;const o=i.endsWith(".css"),d=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${d}`))return;const _=document.createElement("link");if(_.rel=o?"stylesheet":_t,o||(_.as="script",_.crossOrigin=""),_.href=i,document.head.appendChild(_),o)return new Promise((b,f)=>{_.addEventListener("load",b),_.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${i}`)))})})).then(()=>s())};const ft={},mt=e=>(H("data-v-8c844e72"),e=e(),V(),e),yt={class:"pb-2 border-bottom"},bt=k(" Office Hours Queue "),vt=mt(()=>t("div",{class:"row p-4 pb-0 pt-lg-4 pb-lg-4 align-items-center rounded-3 border shadow-lg"},[t("div",{class:"col-lg-10 mx-auto"},[t("p",{class:"lead-custom text-center"}," Welcome! Here you can join the queue for office hours. Let's get started! ")])],-1));function kt(e,s){const n=$("font-awesome-icon");return a(),c(w,null,[t("h2",yt,[u(n,{icon:"chalkboard-teacher"}),bt]),vt],64)}var ue=M(ft,[["render",kt],["__scopeId","data-v-8c844e72"]]);const gt=t("br",null,null,-1),wt={key:0},qt=k("Queues List"),$t={key:1},St=k(" Login"),xt={setup(e){const s=Q();return(n,i)=>{const o=$("RouterLink"),d=$("font-awesome-icon");return a(),c("main",null,[u(ue),gt,r(s).token?(a(),c("div",wt,[u(o,{to:"/queues",class:"btn btn-success"},{default:x(()=>[qt]),_:1})])):(a(),c("div",$t,[t("a",{class:"btn btn-success",onClick:i[0]||(i[0]=_=>r(s).getToken())},[u(d,{icon:"arrow-right-to-bracket"}),St])]))])}}},Ct={setup(e){return(s,n)=>(a(),C(xt))}};const Qt={class:"col"},Ot={class:"card-header"},Nt={key:0,class:"float-end badge rounded-pill bg-success"},Lt={key:1,class:"float-end badge rounded-pill bg-danger"},Tt={class:"card-body"},Rt={class:"card-text"},It={props:{queue:{type:Object,default(){return{}}},helpers:{type:Number,default(){return 0}},requests:{type:Number,default(){return 0}}},setup(e){const s=e,n=B();function i(o){n.push("/queues/"+o)}return(o,d)=>{const _=$("font-awesome-icon");return a(),c("div",Qt,[t("div",{class:"card w-100 hvr-grow",onClick:d[0]||(d[0]=b=>i(s.queue.id))},[t("h5",Ot,[k(S(s.queue.name)+" ",1),s.queue.is_open===1?(a(),c("span",Nt,[k("Open | "+S(e.helpers)+" ",1),u(_,{icon:"user-graduate"}),k(" | "+S(e.requests)+" ",1),u(_,{icon:"circle-question"})])):(a(),c("span",Lt,"Closed"))]),t("div",Tt,[t("p",Rt,S(s.queue.snippet),1)])])])}}};var At=M(It,[["__scopeId","data-v-3451fb3b"]]);const L=j("queues",{state:()=>({queues:[],online:{}}),getters:{getQueue:e=>s=>e.queues.find(n=>n.id==s),sortedQueues:e=>[...e.queues].sort((s,n)=>n.is_open-s.is_open)},actions:{async hydrate(){l.info("queues:hydrate"),await q.get("/api/v1/queues").then(e=>{this.queues=e.data})},async hydrateOnline(){l.info("queues:hydrateOnline"),await q.get("/api/v1/queues/online").then(e=>{this.online=e.data})},async update(e){await q.post("/api/v1/queues/"+e.id,{queue:e}).then(async()=>{await this.hydrate()})},async deleteQueue(e){await q.delete("/api/v1/queues/"+e).then(async()=>{await this.hydrate()})},async addQueue(e){await q.put("/api/v1/queues/",{name:e}).then(async()=>{await this.hydrate()})}}}),Et={class:"row row-cols-1 row-cols-lg-3 g-4"},Mt={async setup(e){let s,n;const i=L();i.hydrate(),[s,n]=R(()=>i.hydrateOnline()),await s,n();const{sortedQueues:o,online:d}=T(i);return(_,b)=>(a(),c("div",Et,[(a(!0),c(w,null,J(r(o),(f,m)=>(a(),C(At,{key:f.id,queue:f,index:m,helpers:r(d).helpers[String(f.id)],requests:r(d).requests[String(f.id)]},null,8,["queue","index","helpers","requests"]))),128))]))}},Jt=t("br",null,null,-1),Ut={setup(e){return(s,n)=>(a(),c("main",null,[u(ue),Jt,u(Mt)]))}},K=j("requests",{state:()=>({requests:[],online:[],helpers:[],socket:void 0,connected:!1,error:!1}),getters:{getRequest:e=>s=>e.requests.find(n=>n.user_id===s),userOnline:e=>s=>e.online.find(n=>n==s)!==void 0,sortedRequests:e=>[...e.requests].sort(function(s,n){return s.status_id==n.status_id?s.id-n.id:n.status_id-s.status_id})},actions:{async connectQueue(e){this.socket&&this.socket.disconnect(),this.$reset();const s=Q();this.socket=me("http://localhost:3000",{auth:{token:s.token,queue_id:e}}),this.socket.on("connect",()=>{l.info("socket:connect"),this.connected=!0,this.error=!1}),this.socket.on("connect_error",n=>{l.error("socket:connect_error - "+n),this.$reset,this.error=!0}),this.socket.on("disconnect",()=>{l.info("socket:disconnect"),this.connected=!1,this.error=!1}),this.socket.on("queue:update",async n=>{l.info("queue:update - "+JSON.stringify(n.id)),l.debug("|- updated: "+JSON.stringify(n));var i=this.requests.findIndex(o=>o.id===n.id);i<0?this.requests.push(n):this.requests[i]=n}),this.socket.on("queue:remove",async n=>{l.info("queue.remove - "+JSON.stringify(n));var i=this.requests.findIndex(o=>o.id===n);i>=0&&this.requests.splice(i,1)}),this.socket.on("user:online",async n=>{l.info("user:online - "+JSON.stringify(n)),this.online.push(String(n))}),this.socket.on("user:offline",async n=>{l.info("user:offline - "+JSON.stringify(n)),this.online.splice(this.online.indexOf(String(n)),1)}),this.socket.on("helper:online",async n=>{l.info("helper:online - "+JSON.stringify(n.id)),l.debug("|- helper: "+JSON.stringify(n)),this.helpers.push(n)}),this.socket.on("helper:offline",async n=>{l.info("helper:offline - "+JSON.stringify(n)),this.helpers.splice(this.helpers.findIndex(i=>i.id==n),1)}),this.socket.on("queue:opening",async()=>{l.info("queue:opening"),await L().hydrate()}),this.socket.on("connected",async(n,i)=>{l.info("socket:connected"),l.debug("|-online: "+JSON.stringify(n)),l.debug("|-helpers: "+JSON.stringify(i)),this.online=n,this.helpers=i}),this.socket.on("queue:closing",async()=>{l.info("queue:closing"),this.requests=[],await L().hydrate()}),l.info("emit queue:connect"),await this.socket.emit("queue:connect",async(n,i)=>{n==200?(l.info("queue:connect OK"),l.debug("|- requests: "+JSON.stringify(i)),this.requests=i):l.error("queue:connect error - "+JSON.stringify(n))})},async disconnectQueue(){this.socket&&(l.info("emit socket:disconnect"),this.socket.disconnect()),this.$reset()},async joinQueue(){l.info("emit queue:join"),await this.socket.emit("queue:join",async e=>{e==200?l.info("queue:join OK"):l.error("queue:join error - "+JSON.stringify(e))})},async openQueue(){l.info("emit queue:open"),await this.socket.emit("queue:open",async e=>{e==200?(l.info("queue:open OK"),L().hydrate()):l.error("queue:open error - "+JSON.stringify(e))})},async closeQueue(){l.info("emit queue:close"),await this.socket.emit("queue:close",async e=>{e==200?(l.info("queue:close OK"),this.requests=[],L().hydrate()):l.error("queue:close error - "+JSON.stringify(e))})},async takeRequest(e){l.info("emit request:take - "+e),await this.socket.emit("request:take",e,async s=>{s==200?l.info("request:take OK"):l.error("request:take error - "+JSON.stringify(s))})},async deleteRequest(e){l.info("emit request:delete - "+e),await this.socket.emit("request:delete",e,async s=>{s==200?l.info("request:delete OK"):l.error("request:delete error - "+JSON.stringify(s))})},async finishRequest(e){l.info("emit request:finish - "+e),await this.socket.emit("request:finish",e,async s=>{s==200?l.info("request:finish OK"):l.error("request:finish error - "+JSON.stringify(s))})}}});const jt={key:2,class:"badge bg-primary rounded-pill"},Dt={props:{request:{type:Object,default(){return{}}},helper:{type:Boolean,default(){return!1}},userId:{type:Number,default(){return-1}}},setup(e){const s=e,n=K(),i=async function(){await n.deleteRequest(s.request.id)},o=async function(){await n.takeRequest(s.request.id)},d=async function(){await n.finishRequest(s.request.id)};return(_,b)=>{const f=$("font-awesome-icon");return a(),c("li",{class:ye(["list-group-item",[e.request.status_id==2?"list-group-item-primary":"",e.request.user_id==e.userId?"current-user":"",r(n).userOnline(e.request.user_id)?"":"list-group-item-light"]])},[r(n).userOnline(e.request.user_id)?(a(),C(f,{key:0,icon:"link"})):(a(),C(f,{key:1,icon:"link-slash"})),k(" "+S(e.request.user.name)+" ",1),e.request.status_id==2?(a(),c("span",jt,S(e.request.helper.name),1)):E("",!0),e.helper?(a(),c(w,{key:3},[t("button",{class:"float-end btn btn-danger btn-sm mx-1",onClick:i}," X "),e.request.status_id==1?(a(),c("button",{key:0,class:"float-end btn btn-primary btn-sm mx-1",onClick:o}," Take ")):(a(),c("button",{key:1,class:"float-end btn btn-success btn-sm mx-1",onClick:d}," Done "))],64)):E("",!0)],2)}}};var Pt=M(Dt,[["__scopeId","data-v-eaea46b6"]]);const Kt=t("h3",{class:"text-center"},"Students Waiting",-1),Ft=t("hr",null,null,-1),Ht={class:"list-group list-group-numbered"},le={props:{id:{type:Number,default:-1}},setup(e){const s=Q(),n=K(),{sortedRequests:i}=T(n);return(o,d)=>(a(),c(w,null,[Kt,Ft,t("ul",Ht,[(a(!0),c(w,null,J(r(i),(_,b)=>(a(),C(Pt,be({key:_.id,request:_,index:b},o.$attrs,{"user-id":r(s).id}),null,16,["request","index","user-id"]))),128))])],64))}},Vt=t("h3",{class:"text-center"},"Helpers Online",-1),Bt=t("hr",null,null,-1),Wt={class:"list-group list-group-flush"},de={setup(e){const s=K(),{helpers:n}=T(s);return(i,o)=>{const d=$("font-awesome-icon");return a(),c(w,null,[Vt,Bt,t("ul",Wt,[(a(!0),c(w,null,J(r(n),(_,b)=>(a(),c("li",{key:b,class:"list-group-item"},[u(d,{icon:"link"}),k(" "+S(_.name),1)]))),128))])],64)}}};const D=e=>(H("data-v-8ccb829a"),e=e(),V(),e),zt={class:"queue-header mx-auto"},Yt={key:0,class:"btn btn-outline-success float-end disabled"},Gt=D(()=>t("span",{class:"visually-hidden"},"Connected!",-1)),Xt=D(()=>t("span",{class:"visually-hidden"},"Disconnected!",-1)),Zt=D(()=>t("span",{class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},null,-1)),es=D(()=>t("span",{class:"visually-hidden"},"Connecting...",-1)),ts=[Zt,es],ss=D(()=>t("h2",{class:"text-center"},"Moderate Queue",-1)),ns=D(()=>t("hr",null,null,-1)),os={class:"row"},as={class:"col-12 col-md-4 mb-4"},rs={class:"col-12 col-md-8 mb-4"},is={props:{id:{type:Number,default:-1}},async setup(e){let s,n;const i=e,o=L();[s,n]=R(()=>o.hydrate()),await s,n();const d=o.getQueue,_=K(),{connected:b,error:f}=T(_);[s,n]=R(()=>_.connectQueue(i.id)),await s,n();const m=async function(){confirm("Are you sure? All pending requests will be lost!")&&await _.closeQueue()},v=async function(){await _.openQueue()},p=async function(){await _.connectQueue(i.id)};return ne(async()=>{await _.disconnectQueue()}),(h,y)=>{const g=$("font-awesome-icon");return a(),c(w,null,[t("div",zt,[r(b)?(a(),c("button",Yt,[u(g,{icon:"link"}),Gt])):(a(),c(w,{key:1},[r(f)?(a(),c("button",{key:0,class:"btn btn-outline-danger float-end",onClick:p},[u(g,{icon:"link-slash"}),Xt])):(a(),c("button",{key:1,class:"btn btn-outline-warning float-end",onClick:p},ts))],64)),ss,r(d)(e.id).is_open==1?(a(),c("a",{key:2,class:"w-100 btn btn-success",onClick:m},"Queue is Open - Click to Close")):(a(),c("a",{key:3,class:"w-100 btn btn-danger",onClick:v},"Queue is Closed - Click to Open"))]),ns,t("div",os,[t("div",as,[u(de)]),t("div",rs,[u(le,{id:e.id,helper:""},null,8,["id"])])])],64)}}};var cs=M(is,[["__scopeId","data-v-8ccb829a"]]);const I=e=>(H("data-v-c2cf3a2c"),e=e(),V(),e),us={id:"studentModal",class:"modal fade",tabindex:"-1","aria-labelledby":"studentModalLabel","aria-hidden":"true"},ls={class:"modal-dialog"},ds={class:"modal-content"},_s=I(()=>t("div",{class:"modal-header"},[t("h5",{id:"studentModalLabel",class:"modal-title"},"Your Turn!"),t("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),hs={class:"modal-body"},ps=k(" You will be helped by "),fs=k(". Their contact info is below: "),ms=I(()=>t("hr",null,null,-1)),ys=["innerHTML"],bs=I(()=>t("div",{class:"modal-footer"},[t("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," OK ")],-1)),vs={class:"queue-header mx-auto"},ks={key:0,class:"btn btn-outline-success float-end disabled"},gs=I(()=>t("span",{class:"visually-hidden"},"Connected!",-1)),ws=I(()=>t("span",{class:"visually-hidden"},"Disconnected!",-1)),qs=I(()=>t("span",{class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},null,-1)),$s=I(()=>t("span",{class:"visually-hidden"},"Connecting...",-1)),Ss=[qs,$s],xs=I(()=>t("h2",{class:"text-center"},"Waiting Queue",-1)),Cs={key:0,class:"w-100 btn btn-success disabled",disabled:""},Qs={key:3,class:"w-100 btn btn-danger disabled",disabled:""},Os=I(()=>t("hr",null,null,-1)),Ns={key:0,class:"row"},Ls={class:"col-12 col-md-4 mb-4"},Ts={class:"col-12 col-md-8 mb-4"},Rs={props:{id:{type:Number,default:-1}},async setup(e){let s,n;const i=e,o=Q(),d=L();[s,n]=R(()=>d.hydrate()),await s,n();const _=d.getQueue,b=K(),f=b.getRequest,{connected:m,error:v}=T(b);[s,n]=R(()=>b.connectQueue(i.id)),await s,n();var p,h=!1;b.$subscribe(()=>{const N=f(o.id);N&&N.status_id==2&&!h&&(h=!0,p=new z("#studentModal",{}),p.show())});const y=async function(){h=!1,await b.joinQueue()},g=async function(){await b.connectQueue(i.id)};return ne(async()=>{await b.disconnectQueue()}),(N,Z)=>{const ee=$("font-awesome-icon");return a(),c(w,null,[t("div",us,[t("div",ls,[t("div",ds,[_s,t("div",hs,[r(f)(r(o).id)&&r(f)(r(o).id).helper?(a(),c(w,{key:0},[t("p",null,[ps,t("strong",null,S(r(f)(r(o).id).helper.name),1),fs]),ms,t("div",{innerHTML:r(oe).sanitize(r(ae).parse(r(f)(r(o).id).helper.contact_info))},null,8,ys)],64)):E("",!0)]),bs])])]),t("div",vs,[r(m)?(a(),c("button",ks,[u(ee,{icon:"link"}),gs])):(a(),c(w,{key:1},[r(v)?(a(),c("button",{key:0,class:"btn btn-outline-danger float-end",onClick:g},[u(ee,{icon:"link-slash"}),ws])):(a(),c("button",{key:1,class:"btn btn-outline-warning float-end",onClick:g},Ss))],64)),xs,r(_)(e.id).is_open==1?(a(),c(w,{key:2},[r(f)(r(o).id)!=null?(a(),c("a",Cs,"Queue Joined")):(a(),c("a",{key:1,class:"w-100 btn btn-success",onClick:Z[0]||(Z[0]=oo=>y())},"Join Queue"))],64)):(a(),c("a",Qs,"Queue is Closed"))]),Os,r(_)(e.id).is_open==1?(a(),c("div",Ns,[t("div",Ls,[u(de)]),t("div",Ts,[u(le,{id:e.id},null,8,["id"])])])):E("",!0)],64)}}};var Is=M(Rs,[["__scopeId","data-v-c2cf3a2c"]]);const As=k(" Back"),Es=k(" Edit"),Ms={class:"display-5 text-center"},Js=t("hr",null,null,-1),Us=["innerHTML"],js=t("hr",null,null,-1),Ds={props:{id:{type:Number,default:-1}},async setup(e){let s,n;const i=Q(),o=L();[s,n]=R(()=>o.hydrate()),await s,n();const d=o.getQueue;return(_,b)=>{const f=$("font-awesome-icon");return a(),c("main",null,[u(r(A),{to:{name:"queues"},class:"btn btn-secondary float-start"},{default:x(()=>[u(f,{icon:"arrow-left"}),As]),_:1}),r(i).is_admin?(a(),C(r(A),{key:0,to:{name:"queue_edit",params:{id:e.id}},class:"btn btn-secondary float-end"},{default:x(()=>[u(f,{icon:"pen-to-square"}),Es]),_:1},8,["to"])):E("",!0),t("h1",Ms,S(r(d)(e.id).name),1),Js,t("div",{innerHTML:r(oe).sanitize(r(ae).parse(r(d)(e.id).description))},null,8,Us),js,r(d)(e.id).helper==1?(a(),C(cs,{key:1,id:e.id},null,8,["id"])):(a(),C(Is,{key:2,id:e.id},null,8,["id"]))])}}},Ps={setup(e){return(s,n)=>(a(),C(Ds))}},X=j("users",{state:()=>({users:[]}),getters:{getUser:e=>s=>e.users.find(n=>n.id===s)},actions:{async hydrate(){l.info("users:hydrate"),await q.get("/api/v1/users").then(e=>{this.users=e.data})},async update(e){await q.post("/api/v1/users/"+e.id,{user:e}).then(async()=>{await this.hydrate()})},async deleteUser(e){await q.delete("/api/v1/users/"+e).then(async()=>{await this.hydrate()})},async addUser(e){await q.put("/api/v1/users/",{eid:e}).then(async()=>{await this.hydrate()})}}});const Ks=t("h1",{class:"display-5 text-center"},"Edit Queue",-1),Fs=t("hr",null,null,-1),Hs={class:"mb-3"},Vs=t("label",{for:"multiselect-users",class:"form-label"},"Helpers",-1),Bs=t("div",{class:"form-text"}," Helpers who can manage the queue (usually TAs) - admins already have access ",-1),Ws={class:"row row-cols-1 row-cols-md-2"},zs=t("div",{class:"col d-grid mb-2"},[t("button",{class:"btn btn-success"},"Save")],-1),Ys={class:"col d-grid mb-2"},Gs=k(" Cancel"),Xs={props:{id:{type:Number,default:-1}},async setup(e){let s,n;const i=e,o=B(),d=L();[s,n]=R(()=>d.hydrate()),await s,n();const _=d.getQueue(i.id),b=X();b.hydrate();const{users:f}=T(b);var m;Y(()=>{m=new G({blockStyles:{italic:"_"},status:!1})});const v=async p=>{p=(({id:h,name:y,snippet:g})=>({id:h,name:y,snippet:g}))(p),p.description=m.value(),p.users=[];for(const h of _.users)p.users.push({id:h.id});try{await d.update(p),o.push("/queues/"+_.id)}catch(h){if(h.response&&h.response.status===422){let y={};if(h.response.data.data){for(const g in h.response.data.data){y[g]="";for(const N of h.response.data.data[g])y[g]=y[g]+N.message+" "}U("queueform",["The server rejected this submission. Please correct errors listed above"],y)}else U("queueform",["The server rejected this submission due to an SQL Error. Refresh and try again"])}else console.error(h)}};return(p,h)=>{const y=$("FormKit"),g=$("router-link");return a(),c("main",null,[Ks,Fs,u(y,{id:"queueform",type:"form",value:r(_),actions:!1,onSubmit:v},{default:x(()=>[u(y,{type:"text",name:"name",label:"Queue Name",help:"Name of the queue (usually the course)",validation:"required"}),u(y,{type:"text",name:"snippet",label:"Short Description",help:"Short description shown on the initial card"}),u(y,{type:"textarea",name:"description",label:"Long Description",help:"Long description shown on the queue page",rows:"10"}),t("div",Hs,[Vs,u(r(re),{id:"multiselect-users",modelValue:r(_).users,"onUpdate:modelValue":h[0]||(h[0]=N=>r(_).users=N),class:"form-control",options:r(f),multiple:!0,"tag-placeholder":"Add this as new user",placeholder:"Type to search or add user",label:"eid","track-by":"id"},null,8,["modelValue","options"]),Bs]),t("div",Ws,[zs,t("div",Ys,[u(g,{to:{name:"queue_single",params:{id:r(_).id}},class:"btn btn-secondary"},{default:x(()=>[Gs]),_:1},8,["to"])])])]),_:1},8,["value"])])}}},Zs={setup(e){return(s,n)=>(a(),C(Xs))}},en=j("profile",{state:()=>({user:{}}),actions:{async hydrate(){l.info("profile:hydrate"),await q.get("/api/v1/profile").then(e=>{this.user=e.data})},async update(e){await q.post("/api/v1/profile/",{user:e}).then(async()=>{await this.hydrate()})}}});const tn=t("h1",{class:"display-5 text-center"},"Edit User",-1),sn=t("hr",null,null,-1),nn={class:"row row-cols-1 row-cols-md-2"},on=t("div",{class:"col d-grid mb-2"},[t("button",{class:"btn btn-success"},"Save")],-1),an={class:"col d-grid mb-2"},rn=k(" Cancel"),cn={async setup(e){let s,n;const i=B(),o=en();[s,n]=R(()=>o.hydrate()),await s,n();const{user:d}=T(o);var _;Y(()=>{_=new G({blockStyles:{italic:"_"},status:!1})});const b=async f=>{const m={name:f.name,contact_info:_.value()};try{await o.update(m),i.push("/queues/")}catch(v){if(v.response&&v.response.status===422){let p={};if(v.response.data.data){for(const h in v.response.data.data){p[h]="";for(const y of v.response.data.data[h])p[h]=p[h]+y.message+" "}U("userform",["The server rejected this submission. Please correct errors listed above"],p)}else U("userform",["The server rejected this submission due to an SQL Error. Refresh and try again"])}else console.error(v)}};return(f,m)=>{const v=$("FormKit"),p=$("router-link");return a(),c("main",null,[tn,sn,u(v,{id:"userform",type:"form",value:r(d),actions:!1,onSubmit:b},{default:x(()=>[u(v,{type:"text",name:"eid",label:"eID",disabled:!0,help:"Your K-State eID (cannot be changed)",validation:"required"}),u(v,{type:"text",name:"name",label:"Name",help:"Your full name as you'd like it displayed on the site",validation:"required"}),u(v,{type:"textarea",name:"contact_info",label:"Contact Information",help:"Any information we should know about how to contact you",rows:"10"}),t("div",nn,[on,t("div",an,[u(p,{to:{name:"queues"},class:"btn btn-secondary"},{default:x(()=>[rn]),_:1})])])]),_:1},8,["value"])])}}};const un={setup(e){return(s,n)=>(a(),C(cn))}},ln={id:"userModal",class:"modal fade",tabindex:"-1","aria-labelledby":"userModalLabel","aria-hidden":"true"},dn={class:"modal-dialog"},_n={class:"modal-content"},hn=t("div",{class:"modal-header"},[t("h5",{id:"userModalLabel",class:"modal-title"},"Delete User"),t("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),pn={class:"modal-body"},fn=t("h5",null,"Are you sure you want to delete this user?",-1),mn=t("strong",null,"eID: ",-1),yn=t("br",null,null,-1),bn=t("strong",null,"Name: ",-1),vn={class:"modal-footer"},kn=t("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," Close ",-1),gn=k(" Delete User "),wn=k(" User "),qn=t("h1",{class:"text-center"},"Users",-1),$n={class:"table table-striped table-hover"},Sn=t("thead",null,[t("tr",null,[t("th",null,"eID"),t("th",null,"Name"),t("th",null,"Roles"),t("th",null,"Actions")])],-1),xn=["onClick"],Cn={setup(e){const s=X();s.hydrate();const{users:n}=T(s),i=Q();var o=ie({}),d;const _=function(m){o.id=m.id,o.eid=m.eid,o.name=m.name,d=new z("#userModal",{}),d.show()},b=async function(m){await s.deleteUser(m),d.hide()},f=async function(){var m=prompt("Enter an eID to create a user");if(m)try{await s.addUser(m)}catch(v){v.response&&v.response.status===422?alert(JSON.stringify(v.response.data)):alert(v)}};return(m,v)=>{const p=$("font-awesome-icon");return a(),c(w,null,[t("div",ln,[t("div",dn,[t("div",_n,[hn,t("div",pn,[fn,t("p",null,[mn,k(S(r(o).eid)+" ",1),yn,bn,k(S(r(o).name),1)])]),t("div",vn,[kn,t("button",{type:"button",class:"btn btn-danger",onClick:v[0]||(v[0]=h=>b(r(o).id))},[u(p,{icon:"trash"}),gn])])])])]),t("button",{type:"button",class:"btn btn-success float-end",onClick:f},[u(p,{icon:"plus"}),wn]),qn,t("table",$n,[Sn,t("tbody",null,[(a(!0),c(w,null,J(r(n),h=>(a(),c("tr",{key:h.id},[t("td",null,S(h.eid),1),t("td",null,S(h.name),1),t("td",null,[(a(!0),c(w,null,J(h.roles,y=>(a(),c("span",{key:y.id,class:"badge rounded-pill bg-success"},S(y.name),1))),128))]),t("td",null,[u(r(A),{to:{name:"admin_useredit",params:{id:h.id}},class:"btn btn-secondary btn-sm mx-1"},{default:x(()=>[u(p,{icon:"pen-to-square"})]),_:2},1032,["to"]),h.id!=r(i).id?(a(),c("button",{key:0,type:"button",class:"btn btn-danger btn-sm mx-1",onClick:ce(y=>_(h),["prevent"])},[u(p,{icon:"trash"})],8,xn)):E("",!0)])]))),128))])])],64)}}},Qn={id:"queueModal",class:"modal fade",tabindex:"-1","aria-labelledby":"queueModalLabel","aria-hidden":"true"},On={class:"modal-dialog"},Nn={class:"modal-content"},Ln=t("div",{class:"modal-header"},[t("h5",{id:"queueModalLabel",class:"modal-title"},"Delete Queue"),t("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),Tn={class:"modal-body"},Rn=t("h5",null,"Are you sure you want to delete this queue?",-1),In=t("strong",null,"Name: ",-1),An={class:"modal-footer"},En=t("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," Close ",-1),Mn=k(" Delete Queue "),Jn=k(" Queue "),Un=t("h1",{class:"text-center"},"Queues",-1),jn={class:"table table-striped table-hover"},Dn=t("thead",null,[t("tr",null,[t("th",null,"Name"),t("th",null,"Actions")])],-1),Pn=["onClick"],Kn={setup(e){const s=L();s.hydrate();const{queues:n}=T(s);var i=ie({}),o;const d=function(f){i.id=f.id,i.name=f.name,o=new z("#queueModal",{}),o.show()},_=async function(f){await s.deleteQueue(f),o.hide()},b=async function(){var f=prompt("Enter a name for the new queue");if(f)try{await s.addQueue(f)}catch(m){m.response&&m.response.status===422?alert(JSON.stringify(m.response.data)):alert(m)}};return(f,m)=>{const v=$("font-awesome-icon");return a(),c(w,null,[t("div",Qn,[t("div",On,[t("div",Nn,[Ln,t("div",Tn,[Rn,t("p",null,[In,k(S(r(i).name),1)])]),t("div",An,[En,t("button",{type:"button",class:"btn btn-danger",onClick:m[0]||(m[0]=p=>_(r(i).id))},[u(v,{icon:"trash"}),Mn])])])])]),t("button",{type:"button",class:"btn btn-success float-end",onClick:b},[u(v,{icon:"plus"}),Jn]),Un,t("table",jn,[Dn,t("tbody",null,[(a(!0),c(w,null,J(r(n),p=>(a(),c("tr",{key:p.id},[t("td",null,S(p.name),1),t("td",null,[t("button",{type:"button",class:"btn btn-danger btn-sm mx-1",onClick:ce(h=>d(p),["prevent"])},[u(v,{icon:"trash"})],8,Pn)])]))),128))])])],64)}}},Fn={setup(e){return(s,n)=>(a(),c(w,null,[u(Kn),u(Cn)],64))}},Hn=j("roles",{state:()=>({roles:[]}),actions:{async hydrate(){l.info("roles:hydrate"),await q.get("/api/v1/roles").then(e=>{this.roles=e.data})}}});const Vn=t("h1",{class:"display-5 text-center"},"Edit User",-1),Bn=t("hr",null,null,-1),Wn={class:"mb-3"},zn=t("label",{for:"multiselect-roles",class:"form-label"},"Roles",-1),Yn=t("div",{class:"form-text"},"Roles assigned to this user",-1),Gn={class:"row row-cols-1 row-cols-md-2"},Xn=t("div",{class:"col d-grid mb-2"},[t("button",{class:"btn btn-success"},"Save")],-1),Zn={class:"col d-grid mb-2"},eo=k(" Cancel"),to={props:{id:{type:Number,default:-1}},async setup(e){let s,n;const i=e,o=B(),d=X();[s,n]=R(()=>d.hydrate()),await s,n();const _=d.users.find(p=>p.id===parseInt(i.id)),b=Hn();b.hydrate();const{roles:f}=T(b);var m;Y(()=>{m=new G({blockStyles:{italic:"_"},status:!1})});const v=async p=>{p=(({id:h,name:y})=>({id:h,name:y}))(p),p.contact_info=m.value(),p.roles=[];for(const h of _.roles)p.roles.push({id:h.id});try{await d.update(p),o.push("/admin/")}catch(h){if(h.response&&h.response.status===422){let y={};if(h.response.data.data){for(const g in h.response.data.data){y[g]="";for(const N of h.response.data.data[g])y[g]=y[g]+N.message+" "}U("usersForm",["The server rejected this submission. Please correct errors listed above"],y)}else U("usersForm",["The server rejected this submission due to an SQL Error. Refresh and try again"])}else console.error(h)}};return(p,h)=>{const y=$("FormKit"),g=$("router-link");return a(),c("main",null,[Vn,Bn,u(y,{id:"userform",type:"form",value:r(_),actions:!1,onSubmit:v},{default:x(()=>[u(y,{type:"text",name:"eid",label:"eID",disabled:!0,help:"The user's K-State eID (cannot be changed)",validation:"required"}),u(y,{type:"text",name:"name",label:"Name",help:"The user's full name as you'd like it displayed on the site",validation:"required"}),u(y,{type:"textarea",name:"contact_info",label:"Contact Information",help:"Any information we should know about how to contact the user",rows:"10"}),t("div",Wn,[zn,u(r(re),{id:"multiselect-roles",modelValue:r(_).roles,"onUpdate:modelValue":h[0]||(h[0]=N=>r(_).roles=N),class:"form-control",options:r(f),multiple:!0,"tag-placeholder":"Add this as new role",placeholder:"Type to search or add role",label:"name","track-by":"id"},null,8,["modelValue","options"]),Yn]),t("div",Gn,[Xn,t("div",Zn,[u(g,{to:{name:"admin"},class:"btn btn-secondary"},{default:x(()=>[eo]),_:1})])])]),_:1},8,["value"])])}}},so={setup(e){return(s,n)=>(a(),C(to))}},W=()=>Q().is_admin,_e=ve({history:ke("/"),routes:[{path:"/",name:"home",component:Ct,beforeEnter:async()=>{const e=Q();if(await e.tryToken(),e.token)return"/queues"}},{path:"/about",name:"about",component:()=>pt(()=>import("./AboutView.9c55ed1f.js"),["assets/AboutView.9c55ed1f.js","assets/vendor.c0c8c140.js"])},{path:"/queues",name:"queues",component:Ut},{path:"/queues/:id",name:"queue_single",component:Ps,props:e=>({id:Number(e.params.id)})},{path:"/queues/:id/edit",name:"queue_edit",component:Zs,props:!0,beforeEnter:W},{path:"/profile",name:"profile",component:un},{path:"/admin",name:"admin",component:Fn,beforeEnter:W},{path:"/admin/user/:id/edit",name:"admin_useredit",component:so,props:!0,beforeEnter:W}]});_e.beforeEach(async function(e){if(e.name!=="home"&&e.name!=="about"){const s=Q();if(s.token||await s.tryToken(),!s.token)return"/"}});const no=()=>{q.interceptors.request.use(e=>{if(e.url!=="/auth/token"){const s=Q();s.token&&(e.headers.Authorization="Bearer "+s.token)}return e},e=>Promise.reject(e)),q.interceptors.response.use(e=>e,async e=>{const s=e.config;if(s.url!=="/auth/token"&&e.response&&e.response.status===401&&!s._retry){s._retry=!0;try{return await Q().refreshToken(),q(s)}catch(n){return Promise.reject(n)}}return Promise.reject(e)})};l.useDefaults();l.setLevel(l.WARN);O.add(ge);O.add(we);O.add(qe);O.add($e);O.add(Se);O.add(xe);O.add(Ce);O.add(Qe);O.add(Oe);O.add(Ne);O.add(Le);O.add(Te);no();const P=Re(dt);P.use(Ie());P.use(_e);P.use(Ae,se);P.use(Ee,Me({config:{classes:{input:"form-control",label:"form-label",help:"form-text",outer:"mb-3"}}}));P.component("FontAwesomeIcon",Je);P.mount("#app");export{M as _};
