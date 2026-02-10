(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,6919,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},70065,e=>{"use strict";var t=e.i(29511),r=e.i(47163);function o({className:e,...o}){return(0,t.jsx)("div",{"data-slot":"card",className:(0,r.cn)("flex flex-col gap-4 border-[3px] border-foreground bg-background text-foreground rounded-none shadow-none p-4",e),...o})}function i({className:e,...o}){return(0,t.jsx)("div",{"data-slot":"card-header",className:(0,r.cn)("flex flex-col gap-1 border-b-[3px] border-foreground pb-3",e),...o})}function n({className:e,...o}){return(0,t.jsx)("div",{"data-slot":"card-title",className:(0,r.cn)("font-bold text-lg leading-tight",e),...o})}function l({className:e,...o}){return(0,t.jsx)("div",{"data-slot":"card-content",className:(0,r.cn)("flex flex-col gap-3",e),...o})}function a({className:e,...o}){return(0,t.jsx)("div",{"data-slot":"card-footer",className:(0,r.cn)("flex items-center gap-2 border-t-[3px] border-foreground pt-3",e),...o})}e.s(["Card",()=>o,"CardContent",()=>l,"CardFooter",()=>a,"CardHeader",()=>i,"CardTitle",()=>n])},63137,e=>{"use strict";var t=e.i(29511),r=e.i(58138);function o(e){if(!e)return null;let t=e.replace("#","");return 3===t.length?t.split("").map(e=>parseInt(e+e,16)):6===t.length?[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)]:null}function i(e,t,o){let[i,n]=(0,r.useState)(e||t);return(0,r.useEffect)(()=>{function r(){if(!e)return void n(t);if(e.includes("var(")){let t=e.match(/var\(([^)]+)\)/)?.[1];if(t){if(o.current){let e=getComputedStyle(o.current).getPropertyValue(t).trim();if(e)return void n(e)}if("undefined"!=typeof document){let e=getComputedStyle(document.documentElement).getPropertyValue(t).trim();if(e)return void n(e)}}}n(e)}if(r(),"undefined"!=typeof MutationObserver&&e?.includes("var(")){let e=new MutationObserver(r);return e.observe(document.documentElement,{attributes:!0,attributeFilter:["class","style"]}),()=>e.disconnect()}},[e,t,o]),i}function n({src:e,alt:n="",primaryColor:l="var(--theme-accent)",secondaryColor:a="var(--theme-ink)",className:c,style:s}){let u=(0,r.useId)(),f=`duotone-filter-${u}`,d=r.useRef(null),m=i(l,"#ffffff",d),v=i(a,"#000000",d),p=r.useMemo(()=>{let e=o(m)||[255,255,255],t=o(v)||[0,0,0],r=e[0]/255,i=e[1]/255,n=e[2]/255,l=t[0]/255,a=t[1]/255,c=t[2]/255;return[r-l,"0 0 0",l,i-a,"0 0 0",a,n-c,"0 0 0",c,"0 0 0 1 0"].join(" ")},[m,v]);return(0,t.jsxs)("div",{ref:d,className:`relative overflow-hidden ${c||""}`,style:s,children:[(0,t.jsx)("svg",{style:{position:"absolute",width:0,height:0,pointerEvents:"none"},"aria-hidden":"true",children:(0,t.jsx)("filter",{id:f,colorInterpolationFilters:"sRGB",children:(0,t.jsx)("feColorMatrix",{type:"matrix",values:p})})}),(0,t.jsx)("img",{src:e,alt:n,style:{filter:`url(#${f})`},className:"w-full h-full object-cover block"})]})}e.s(["DuotoneImage",()=>n])},62080,e=>{"use strict";var t=e.i(29511),r=e.i(48128),o=e.i(89554),i=e.i(58138);let n=`
  attribute vec2 position;
  varying vec2 v_uv;
  
  void main() {
    v_uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,l=`
  precision highp float;

  // Screen resolution (the actual display size)
  uniform vec2 u_screenResolution;
  // Canvas resolution (the low-res render target size)
  uniform vec2 u_canvasResolution;
  
  uniform float u_time;
  uniform vec3 u_fillColor;
  uniform vec3 u_strokeColor;
  uniform float u_timeScale;
  uniform float u_threshold;
  uniform float u_scale;
  uniform int u_fieldType;
  uniform float u_worldScale;

  varying vec2 v_uv;

  const int FIELD_WARPED = 0;
  const int FIELD_WAVES = 1;
  const int FIELD_SPIRAL = 2;
  const int FIELD_CHECKERBOARD_FLOW = 3;
  const int FIELD_VORONOI = 4;
  const int FIELD_TURING = 5;
  const int FIELD_FLAT = 6;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    return sin(p.x * 1.7 + sin(p.y * 1.3)) * 0.5 + 
           sin(p.y * 1.9 + cos(p.x * 1.1)) * 0.5;
  }

  float fbm(vec2 p, float time) {
    float v = 0.0;
    float a = 0.5;
    float f = 1.0;
    
    for (int i = 0; i < 4; i++) {
      v += a * noise(p * f + vec2(time * 0.3, -time * 0.2));
      f *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  float fieldWarped(vec2 p, float time) {
    float warp = fbm(p * 0.002, time);
    vec2 w = vec2(
      p.x + cos(warp * 6.0 + time) * 80.0,
      p.y + sin(warp * 6.0 - time) * 80.0
    );
    return fbm(w * 0.002, time);
  }

  float fieldWaves(vec2 p, float time) {
    float ox = sin(time * 0.3) * 120.0;
    float oy = cos(time * 0.27) * 120.0;
    vec2 n = (p + vec2(ox, oy)) * 0.002;
    return sin(n.x + time) + sin(n.y - time * 0.7) + sin((n.x + n.y) * 0.8 + time * 0.5);
  }

  float fieldSpiral(vec2 p, float time) {
    vec2 c = p * 0.002;
    float r = length(c);
    float a = atan(c.y, c.x);
    float spin = a * 3.0 + time * 0.6;
    float wave = sin(r * 8.0 - time);
    return sin(spin + wave) + fbm(c * 1.5, time * 0.7);
  }

  float fieldCheckerboardFlow(vec2 p, float time) {
    float size = 40.0;
    vec2 v = vec2(22.0, 14.0);
    vec2 f = p + time * v;
    vec2 c = floor(f / size);
    return mod(c.x + c.y, 2.0);
  }

  float fieldVoronoi(vec2 p, float time) {
    float scale = 0.015;
    vec2 px = p * scale;
    vec2 ix = floor(px);
    
    float minDist = 1e9;
    
    for (int dx = -1; dx <= 1; dx++) {
      for (int dy = -1; dy <= 1; dy++) {
        vec2 cell = ix + vec2(float(dx), float(dy));
        vec2 r = vec2(hash(cell), hash(cell + vec2(19.1, 47.2)));
        vec2 offset = r + vec2(
          sin(time * 0.4 + r.x * 6.0) * 0.3,
          cos(time * 0.4 + r.y * 6.0) * 0.3
        );
        vec2 point = cell + offset;
        float d = length(point - px);
        if (d < minDist) minDist = d;
      }
    }
    return minDist;
  }

  float fieldTuring(vec2 p, float time) {
    float s = 0.01;
    vec2 ps = p * s;
    float n1 = fbm(ps, time * 0.5);
    float n2 = fbm(ps + n1, time * 0.2);
    float pattern = sin(n1 * 10.0 + n2 * 5.0);
    return (pattern + 1.0) * 0.5;
  }

  float getField(vec2 p, float time, int fieldType) {
    if (fieldType == FIELD_WARPED) return fieldWarped(p, time);
    if (fieldType == FIELD_WAVES) return fieldWaves(p, time);
    if (fieldType == FIELD_SPIRAL) return fieldSpiral(p, time);
    if (fieldType == FIELD_CHECKERBOARD_FLOW) return fieldCheckerboardFlow(p, time);
    if (fieldType == FIELD_VORONOI) return fieldVoronoi(p, time);
    if (fieldType == FIELD_TURING) return fieldTuring(p, time);
    return 0.0;
  }

  void main() {
    // Map canvas pixel to screen coordinate
    // v_uv is 0..1 across the canvas, so we map to screen resolution
    // Integer pixel coordinate of the low-res buffer
    vec2 lowPixel = floor(v_uv * u_canvasResolution);

    // Map that pixel back into full screen space
    vec2 screenPos = (lowPixel + 0.5) * (u_screenResolution / u_canvasResolution);

    // zoom around center
    vec2 center = u_screenResolution * 0.5;
    screenPos = (screenPos - center) / u_worldScale + center;

    screenPos = floor(screenPos);
    
    float time = u_time * u_timeScale;
    float val = getField(screenPos, time, u_fieldType) * u_scale;
    
    // Hard threshold
    float line = abs(sin(val)) < u_threshold ? 1.0 : 0.0;
    
    vec3 color = mix(u_fillColor, u_strokeColor, line);
    
    gl_FragColor = vec4(color, 1.0);
  }
`,a=`
  attribute vec2 position;
  varying vec2 v_uv;
  
  void main() {
    v_uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,c=`
  precision highp float;
  uniform sampler2D u_texture;
  varying vec2 v_uv;
  
  void main() {
    gl_FragColor = texture2D(u_texture, v_uv);
  }
`,s={"warped topo":0,"slow zebra":1,"spiral flow":2,"checkerboard flow":3,"voronoi drift":4,"turing reaction":5,off:6};function u(e){let t=parseInt(e.replace("#",""),16);return[(t>>16&255)/255,(t>>8&255)/255,(255&t)/255]}function f(e){return getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function d(e,t,r){let o=e.createShader(t);return o?(e.shaderSource(o,r),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS))?o:(console.error("Shader compile error:",e.getShaderInfoLog(o)),e.deleteShader(o),null):null}function m(e,t,r){let o=e.createProgram();return o?(e.attachShader(o,t),e.attachShader(o,r),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS))?o:(console.error("Program link error:",e.getProgramInfoLog(o)),e.deleteProgram(o),null):null}function v({animation:e,accentColor:r,inkColor:o,pixelScale:v=6}){let p=(0,i.useRef)(null),h=(0,i.useRef)(null),g=(0,i.useRef)(null),x=(0,i.useRef)(null),_=(0,i.useRef)(null),E=(0,i.useRef)(null),R=(0,i.useRef)({}),T=(0,i.useRef)(null),b=(0,i.useRef)(0),y=(0,i.useRef)({width:0,height:0}),w=(0,i.useRef)({width:0,height:0});return(0,i.useEffect)(()=>{let t=p.current;if(!t)return;let i=t.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"high-performance"});if(!i)return void console.error("WebGL not supported");h.current=i;let F=d(i,i.VERTEX_SHADER,n),A=d(i,i.FRAGMENT_SHADER,l);if(!F||!A)return;let S=m(i,F,A);if(!S)return;g.current=S;let P=d(i,i.VERTEX_SHADER,a),L=d(i,i.FRAGMENT_SHADER,c);if(!P||!L)return;let I=m(i,P,L);if(!I)return;x.current=I;let C=i.createTexture();if(!C)return;E.current=C;let D=i.createFramebuffer();if(!D)return;_.current=D;let U=new Float32Array([-1,-1,1,-1,-1,1,1,1]),j=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,j),i.bufferData(i.ARRAY_BUFFER,U,i.STATIC_DRAW),i.useProgram(S);let N=i.getAttribLocation(S,"position");i.enableVertexAttribArray(N),i.vertexAttribPointer(N,2,i.FLOAT,!1,0,0),R.current={screenResolution:i.getUniformLocation(S,"u_screenResolution"),canvasResolution:i.getUniformLocation(S,"u_canvasResolution"),time:i.getUniformLocation(S,"u_time"),fillColor:i.getUniformLocation(S,"u_fillColor"),strokeColor:i.getUniformLocation(S,"u_strokeColor"),timeScale:i.getUniformLocation(S,"u_timeScale"),threshold:i.getUniformLocation(S,"u_threshold"),scale:i.getUniformLocation(S,"u_scale"),fieldType:i.getUniformLocation(S,"u_fieldType"),worldScale:i.getUniformLocation(S,"u_worldScale")},i.useProgram(I);let M=i.getAttribLocation(I,"position");i.enableVertexAttribArray(M),i.vertexAttribPointer(M,2,i.FLOAT,!1,0,0);let O=i.getUniformLocation(I,"u_texture");i.uniform1i(O,0);let B=()=>{let e=Math.min(window.devicePixelRatio||1,1.25),r=Math.floor(window.innerWidth),o=Math.floor(window.innerHeight),n=Math.floor(window.screen.width*e),l=Math.floor(window.screen.height*e);w.current={width:n,height:l};let a=Math.floor(n/v),c=Math.floor(l/v),s=a*c;if(s>57600){let e=Math.sqrt(57600/s);a=Math.floor(a*e),c=Math.floor(c*e)}t.width=r,t.height=o,y.current={width:a,height:c},i.bindTexture(i.TEXTURE_2D,C),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,a,c,0,i.RGBA,i.UNSIGNED_BYTE,null),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.bindFramebuffer(i.FRAMEBUFFER,D),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,C,0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,r,o)};B();let k=()=>{let i=h.current,n=g.current,l=x.current,a=_.current,c=E.current,d=R.current,{width:m,height:v}=y.current,{width:p,height:F}=w.current;if(!i||!n||!l||!a||!c)return;let A=o||f("--theme-accent")||"#ffffff",S=r||f("--theme-ink")||"#000000",[P,L,I]=u(A),[C,D,U]=u(S);i.bindFramebuffer(i.FRAMEBUFFER,a),i.viewport(0,0,m,v),i.useProgram(n),i.uniform2f(d.screenResolution,p,F),i.uniform2f(d.canvasResolution,m,v),i.uniform1f(d.time,b.current),i.uniform3f(d.fillColor,C,D,U),i.uniform3f(d.strokeColor,P,L,I),i.uniform1f(d.timeScale,e.timeScale),i.uniform1f(d.threshold,e.threshold),i.uniform1f(d.scale,e.scale),i.uniform1f(d.worldScale,e.worldScale??1),i.uniform1i(d.fieldType,s[e.name]??0),i.drawArrays(i.TRIANGLE_STRIP,0,4),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,t.width,t.height),i.useProgram(l),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,c),i.drawArrays(i.TRIANGLE_STRIP,0,4),b.current+=1,T.current=requestAnimationFrame(k)};k();let G=()=>{document.hidden?T.current&&(cancelAnimationFrame(T.current),T.current=null):T.current||k()};return document.addEventListener("visibilitychange",G),()=>{window.removeEventListener("resize",B),document.removeEventListener("visibilitychange",G),T.current&&cancelAnimationFrame(T.current),S&&i.deleteProgram(S),I&&i.deleteProgram(I),F&&i.deleteShader(F),A&&i.deleteShader(A),P&&i.deleteShader(P),L&&i.deleteShader(L),C&&i.deleteTexture(C),D&&i.deleteFramebuffer(D)}},[e,r,o,v]),(0,t.jsx)("canvas",{ref:p,className:"fixed inset-0 pointer-events-none block canvas-pixelated",style:{width:"100vw",height:"100vh"}})}var p=e.i(54848),h=e.i(70065),g=e.i(63137),x=e.i(67881);function _(){let{animIndex:e,randomTheme:i}=(0,o.useTheme)();return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(v,{animation:r.ANIMATIONS[e]}),(0,t.jsxs)("div",{className:"relative max-w-2xl mx-auto p-4 text-foreground opacity-0 hover:opacity-100 transition-opacity",children:[(0,t.jsx)(p.TopBar,{}),(0,t.jsxs)(h.Card,{className:"mb-4 ",children:[(0,t.jsx)(h.CardHeader,{children:(0,t.jsx)(h.CardTitle,{children:"Say hi to Glorp!"})}),(0,t.jsxs)(h.CardContent,{className:"flex flex-col gap-3",children:[(0,t.jsx)(g.DuotoneImage,{src:"/glorp.png",className:"border-3"}),(0,t.jsxs)("div",{className:"flex justify-between items-center gap-2",children:[(0,t.jsxs)("div",{className:"flex text-sm leading-relaxed",children:["If you don't say hi,",(0,t.jsx)("br",{}),"he will find you,",(0,t.jsx)("br",{}),"eventually..."]}),(0,t.jsx)(x.Button,{variant:"inverted",onClick:i,className:"py-6 text-xl",children:"Hi!"})]})]}),(0,t.jsx)(h.CardFooter,{})]})]})]})}e.s(["default",()=>_],62080)}]);