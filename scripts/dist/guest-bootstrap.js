📦
237003 /scripts/guest-bootstrap.js
✄
var vs=Object.defineProperty;var Ss=(t,e)=>{for(var n in e)vs(t,n,{get:e[n],enumerable:!0})};var Ie=[],be=[],Ht="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(let t=0,e=Ht.length;t<e;++t)Ie[t]=Ht[t],be[Ht.charCodeAt(t)]=t;be[45]=62;be[95]=63;function ws(t){let e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");let n=t.indexOf("=");n===-1&&(n=e);let r=n===e?0:4-n%4;return[n,r]}function Is(t,e,n){return(e+n)*3/4-n}function Lr(t){let e=ws(t),n=e[0],r=e[1],o=new Uint8Array(Is(t,n,r)),s=0,i=r>0?n-4:n,l;for(l=0;l<i;l+=4){let a=be[t.charCodeAt(l)]<<18|be[t.charCodeAt(l+1)]<<12|be[t.charCodeAt(l+2)]<<6|be[t.charCodeAt(l+3)];o[s++]=a>>16&255,o[s++]=a>>8&255,o[s++]=a&255}if(r===2){let a=be[t.charCodeAt(l)]<<2|be[t.charCodeAt(l+1)]>>4;o[s++]=a&255}if(r===1){let a=be[t.charCodeAt(l)]<<10|be[t.charCodeAt(l+1)]<<4|be[t.charCodeAt(l+2)]>>2;o[s++]=a>>8&255,o[s++]=a&255}return o}function Cs(t){return Ie[t>>18&63]+Ie[t>>12&63]+Ie[t>>6&63]+Ie[t&63]}function Ts(t,e,n){let r=[];for(let o=e;o<n;o+=3){let s=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(t[o+2]&255);r.push(Cs(s))}return r.join("")}function Zt(t){let e=t.length,n=e%3,r=[],o=16383;for(let s=0,i=e-n;s<i;s+=o)r.push(Ts(t,s,s+o>i?i:s+o));if(n===1){let s=t[e-1];r.push(Ie[s>>2]+Ie[s<<4&63]+"==")}else if(n===2){let s=(t[e-2]<<8)+t[e-1];r.push(Ie[s>>10]+Ie[s>>4&63]+Ie[s<<2&63]+"=")}return r.join("")}function rt(t,e,n,r,o){let s,i,l=o*8-r-1,a=(1<<l)-1,c=a>>1,d=-7,p=n?o-1:0,f=n?-1:1,u=t[e+p];for(p+=f,s=u&(1<<-d)-1,u>>=-d,d+=l;d>0;)s=s*256+t[e+p],p+=f,d-=8;for(i=s&(1<<-d)-1,s>>=-d,d+=r;d>0;)i=i*256+t[e+p],p+=f,d-=8;if(s===0)s=1-c;else{if(s===a)return i?NaN:(u?-1:1)*(1/0);i=i+Math.pow(2,r),s=s-c}return(u?-1:1)*i*Math.pow(2,s-r)}function qt(t,e,n,r,o,s){let i,l,a,c=s*8-o-1,d=(1<<c)-1,p=d>>1,f=o===23?Math.pow(2,-24)-Math.pow(2,-77):0,u=r?0:s-1,_=r?1:-1,h=e<0||e===0&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(l=isNaN(e)?1:0,i=d):(i=Math.floor(Math.log(e)/Math.LN2),e*(a=Math.pow(2,-i))<1&&(i--,a*=2),i+p>=1?e+=f/a:e+=f*Math.pow(2,1-p),e*a>=2&&(i++,a/=2),i+p>=d?(l=0,i=d):i+p>=1?(l=(e*a-1)*Math.pow(2,o),i=i+p):(l=e*Math.pow(2,p-1)*Math.pow(2,o),i=0));o>=8;)t[n+u]=l&255,u+=_,l/=256,o-=8;for(i=i<<o|l,c+=o;c>0;)t[n+u]=i&255,u+=_,i/=256,c-=8;t[n+u-_]|=h*128}var xs={INSPECT_MAX_BYTES:50},Wt=2147483647;m.TYPED_ARRAY_SUPPORT=!0;Object.defineProperty(m.prototype,"parent",{enumerable:!0,get:function(){if(m.isBuffer(this))return this.buffer}});Object.defineProperty(m.prototype,"offset",{enumerable:!0,get:function(){if(m.isBuffer(this))return this.byteOffset}});function xe(t){if(t>Wt)throw new RangeError('The value "'+t+'" is invalid for option "size"');let e=new Uint8Array(t);return Object.setPrototypeOf(e,m.prototype),e}function m(t,e,n){if(typeof t=="number"){if(typeof e=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return Xt(t)}return Mr(t,e,n)}m.poolSize=8192;function Mr(t,e,n){if(typeof t=="string")return ks(t,e);if(ArrayBuffer.isView(t))return Ms(t);if(t==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(t instanceof ArrayBuffer||t&&t.buffer instanceof ArrayBuffer||t instanceof SharedArrayBuffer||t&&t.buffer instanceof SharedArrayBuffer)return Qt(t,e,n);if(typeof t=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');let r=t.valueOf&&t.valueOf();if(r!=null&&r!==t)return m.from(r,e,n);let o=js(t);if(o)return o;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof t[Symbol.toPrimitive]=="function")return m.from(t[Symbol.toPrimitive]("string"),e,n);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}m.from=function(t,e,n){return Mr(t,e,n)};Object.setPrototypeOf(m.prototype,Uint8Array.prototype);Object.setPrototypeOf(m,Uint8Array);function jr(t){if(typeof t!="number")throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function Ns(t,e,n){return jr(t),t<=0?xe(t):e!==void 0?typeof n=="string"?xe(t).fill(e,n):xe(t).fill(e):xe(t)}m.alloc=function(t,e,n){return Ns(t,e,n)};function Xt(t){return jr(t),xe(t<0?0:en(t)|0)}m.allocUnsafe=function(t){return Xt(t)};m.allocUnsafeSlow=function(t){return Xt(t)};function ks(t,e){if((typeof e!="string"||e==="")&&(e="utf8"),!m.isEncoding(e))throw new TypeError("Unknown encoding: "+e);let n=Or(t,e)|0,r=xe(n),o=r.write(t,e);return o!==n&&(r=r.slice(0,o)),r}function Kt(t){let e=t.length<0?0:en(t.length)|0,n=xe(e);for(let r=0;r<e;r+=1)n[r]=t[r]&255;return n}function Ms(t){if(t instanceof Uint8Array){let e=new Uint8Array(t);return Qt(e.buffer,e.byteOffset,e.byteLength)}return Kt(t)}function Qt(t,e,n){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(n||0))throw new RangeError('"length" is outside of buffer bounds');let r;return e===void 0&&n===void 0?r=new Uint8Array(t):n===void 0?r=new Uint8Array(t,e):r=new Uint8Array(t,e,n),Object.setPrototypeOf(r,m.prototype),r}function js(t){if(m.isBuffer(t)){let e=en(t.length)|0,n=xe(e);return n.length===0||t.copy(n,0,0,e),n}if(t.length!==void 0)return typeof t.length!="number"||Number.isNaN(t.length)?xe(0):Kt(t);if(t.type==="Buffer"&&Array.isArray(t.data))return Kt(t.data)}function en(t){if(t>=Wt)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+Wt.toString(16)+" bytes");return t|0}m.isBuffer=function(e){return e!=null&&e._isBuffer===!0&&e!==m.prototype};m.compare=function(e,n){if(e instanceof Uint8Array&&(e=m.from(e,e.offset,e.byteLength)),n instanceof Uint8Array&&(n=m.from(n,n.offset,n.byteLength)),!m.isBuffer(e)||!m.isBuffer(n))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===n)return 0;let r=e.length,o=n.length;for(let s=0,i=Math.min(r,o);s<i;++s)if(e[s]!==n[s]){r=e[s],o=n[s];break}return r<o?-1:o<r?1:0};m.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}};m.concat=function(e,n){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(e.length===0)return m.alloc(0);let r;if(n===void 0)for(n=0,r=0;r<e.length;++r)n+=e[r].length;let o=m.allocUnsafe(n),s=0;for(r=0;r<e.length;++r){let i=e[r];if(i instanceof Uint8Array)s+i.length>o.length?(m.isBuffer(i)||(i=m.from(i.buffer,i.byteOffset,i.byteLength)),i.copy(o,s)):Uint8Array.prototype.set.call(o,i,s);else if(m.isBuffer(i))i.copy(o,s);else throw new TypeError('"list" argument must be an Array of Buffers');s+=i.length}return o};function Or(t,e){if(m.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||t instanceof ArrayBuffer)return t.byteLength;if(typeof t!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);let n=t.length,r=arguments.length>2&&arguments[2]===!0;if(!r&&n===0)return 0;let o=!1;for(;;)switch(e){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":return Yt(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return n*2;case"hex":return n>>>1;case"base64":return Jr(t).length;default:if(o)return r?-1:Yt(t).length;e=(""+e).toLowerCase(),o=!0}}m.byteLength=Or;function Os(t,e,n){let r=!1;if((e===void 0||e<0)&&(e=0),e>this.length||((n===void 0||n>this.length)&&(n=this.length),n<=0)||(n>>>=0,e>>>=0,n<=e))return"";for(t||(t="utf8");;)switch(t){case"hex":return Gs(this,e,n);case"utf8":case"utf-8":return Pr(this,e,n);case"ascii":return Vs(this,e,n);case"latin1":case"binary":return Js(this,e,n);case"base64":return Bs(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return $s(this,e,n);default:if(r)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),r=!0}}m.prototype._isBuffer=!0;function Fe(t,e,n){let r=t[e];t[e]=t[n],t[n]=r}m.prototype.swap16=function(){let e=this.length;if(e%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let n=0;n<e;n+=2)Fe(this,n,n+1);return this};m.prototype.swap32=function(){let e=this.length;if(e%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let n=0;n<e;n+=4)Fe(this,n,n+3),Fe(this,n+1,n+2);return this};m.prototype.swap64=function(){let e=this.length;if(e%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let n=0;n<e;n+=8)Fe(this,n,n+7),Fe(this,n+1,n+6),Fe(this,n+2,n+5),Fe(this,n+3,n+4);return this};m.prototype.toString=function(){let e=this.length;return e===0?"":arguments.length===0?Pr(this,0,e):Os.apply(this,arguments)};m.prototype.toLocaleString=m.prototype.toString;m.prototype.equals=function(e){if(!m.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?!0:m.compare(this,e)===0};m.prototype.inspect=function(){let e="",n=xs.INSPECT_MAX_BYTES;return e=this.toString("hex",0,n).replace(/(.{2})/g,"$1 ").trim(),this.length>n&&(e+=" ... "),"<Buffer "+e+">"};m.prototype[Symbol.for("nodejs.util.inspect.custom")]=m.prototype.inspect;m.prototype.compare=function(e,n,r,o,s){if(e instanceof Uint8Array&&(e=m.from(e,e.offset,e.byteLength)),!m.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(n===void 0&&(n=0),r===void 0&&(r=e?e.length:0),o===void 0&&(o=0),s===void 0&&(s=this.length),n<0||r>e.length||o<0||s>this.length)throw new RangeError("out of range index");if(o>=s&&n>=r)return 0;if(o>=s)return-1;if(n>=r)return 1;if(n>>>=0,r>>>=0,o>>>=0,s>>>=0,this===e)return 0;let i=s-o,l=r-n,a=Math.min(i,l),c=this.slice(o,s),d=e.slice(n,r);for(let p=0;p<a;++p)if(c[p]!==d[p]){i=c[p],l=d[p];break}return i<l?-1:l<i?1:0};function Rr(t,e,n,r,o){if(t.length===0)return-1;if(typeof n=="string"?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,Number.isNaN(n)&&(n=o?0:t.length-1),n<0&&(n=t.length+n),n>=t.length){if(o)return-1;n=t.length-1}else if(n<0)if(o)n=0;else return-1;if(typeof e=="string"&&(e=m.from(e,r)),m.isBuffer(e))return e.length===0?-1:xr(t,e,n,r,o);if(typeof e=="number")return e=e&255,typeof Uint8Array.prototype.indexOf=="function"?o?Uint8Array.prototype.indexOf.call(t,e,n):Uint8Array.prototype.lastIndexOf.call(t,e,n):xr(t,[e],n,r,o);throw new TypeError("val must be string, number or Buffer")}function xr(t,e,n,r,o){let s=1,i=t.length,l=e.length;if(r!==void 0&&(r=String(r).toLowerCase(),r==="ucs2"||r==="ucs-2"||r==="utf16le"||r==="utf-16le")){if(t.length<2||e.length<2)return-1;s=2,i/=2,l/=2,n/=2}function a(d,p){return s===1?d[p]:d.readUInt16BE(p*s)}let c;if(o){let d=-1;for(c=n;c<i;c++)if(a(t,c)===a(e,d===-1?0:c-d)){if(d===-1&&(d=c),c-d+1===l)return d*s}else d!==-1&&(c-=c-d),d=-1}else for(n+l>i&&(n=i-l),c=n;c>=0;c--){let d=!0;for(let p=0;p<l;p++)if(a(t,c+p)!==a(e,p)){d=!1;break}if(d)return c}return-1}m.prototype.includes=function(e,n,r){return this.indexOf(e,n,r)!==-1};m.prototype.indexOf=function(e,n,r){return Rr(this,e,n,r,!0)};m.prototype.lastIndexOf=function(e,n,r){return Rr(this,e,n,r,!1)};function Rs(t,e,n,r){n=Number(n)||0;let o=t.length-n;r?(r=Number(r),r>o&&(r=o)):r=o;let s=e.length;r>s/2&&(r=s/2);let i;for(i=0;i<r;++i){let l=parseInt(e.substr(i*2,2),16);if(Number.isNaN(l))return i;t[n+i]=l}return i}function Ps(t,e,n,r){return vt(Yt(e,t.length-n),t,n,r)}function Fs(t,e,n,r){return vt(Ws(e),t,n,r)}function Ds(t,e,n,r){return vt(Jr(e),t,n,r)}function Us(t,e,n,r){return vt(Ks(e,t.length-n),t,n,r)}m.prototype.write=function(e,n,r,o){if(n===void 0)o="utf8",r=this.length,n=0;else if(r===void 0&&typeof n=="string")o=n,r=this.length,n=0;else if(isFinite(n))n=n>>>0,isFinite(r)?(r=r>>>0,o===void 0&&(o="utf8")):(o=r,r=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let s=this.length-n;if((r===void 0||r>s)&&(r=s),e.length>0&&(r<0||n<0)||n>this.length)throw new RangeError("Attempt to write outside buffer bounds");o||(o="utf8");let i=!1;for(;;)switch(o){case"hex":return Rs(this,e,n,r);case"utf8":case"utf-8":return Ps(this,e,n,r);case"ascii":case"latin1":case"binary":return Fs(this,e,n,r);case"base64":return Ds(this,e,n,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Us(this,e,n,r);default:if(i)throw new TypeError("Unknown encoding: "+o);o=(""+o).toLowerCase(),i=!0}};m.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function Bs(t,e,n){return e===0&&n===t.length?Zt(t):Zt(t.slice(e,n))}function Pr(t,e,n){n=Math.min(t.length,n);let r=[],o=e;for(;o<n;){let s=t[o],i=null,l=s>239?4:s>223?3:s>191?2:1;if(o+l<=n){let a,c,d,p;switch(l){case 1:s<128&&(i=s);break;case 2:a=t[o+1],(a&192)===128&&(p=(s&31)<<6|a&63,p>127&&(i=p));break;case 3:a=t[o+1],c=t[o+2],(a&192)===128&&(c&192)===128&&(p=(s&15)<<12|(a&63)<<6|c&63,p>2047&&(p<55296||p>57343)&&(i=p));break;case 4:a=t[o+1],c=t[o+2],d=t[o+3],(a&192)===128&&(c&192)===128&&(d&192)===128&&(p=(s&15)<<18|(a&63)<<12|(c&63)<<6|d&63,p>65535&&p<1114112&&(i=p))}}i===null?(i=65533,l=1):i>65535&&(i-=65536,r.push(i>>>10&1023|55296),i=56320|i&1023),r.push(i),o+=l}return zs(r)}var Nr=4096;function zs(t){let e=t.length;if(e<=Nr)return String.fromCharCode.apply(String,t);let n="",r=0;for(;r<e;)n+=String.fromCharCode.apply(String,t.slice(r,r+=Nr));return n}function Vs(t,e,n){let r="";n=Math.min(t.length,n);for(let o=e;o<n;++o)r+=String.fromCharCode(t[o]&127);return r}function Js(t,e,n){let r="";n=Math.min(t.length,n);for(let o=e;o<n;++o)r+=String.fromCharCode(t[o]);return r}function Gs(t,e,n){let r=t.length;(!e||e<0)&&(e=0),(!n||n<0||n>r)&&(n=r);let o="";for(let s=e;s<n;++s)o+=Qs[t[s]];return o}function $s(t,e,n){let r=t.slice(e,n),o="";for(let s=0;s<r.length-1;s+=2)o+=String.fromCharCode(r[s]+r[s+1]*256);return o}m.prototype.slice=function(e,n){let r=this.length;e=~~e,n=n===void 0?r:~~n,e<0?(e+=r,e<0&&(e=0)):e>r&&(e=r),n<0?(n+=r,n<0&&(n=0)):n>r&&(n=r),n<e&&(n=e);let o=this.subarray(e,n);return Object.setPrototypeOf(o,m.prototype),o};function ie(t,e,n){if(t%1!==0||t<0)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}m.prototype.readUintLE=m.prototype.readUIntLE=function(e,n,r){e=e>>>0,n=n>>>0,r||ie(e,n,this.length);let o=this[e],s=1,i=0;for(;++i<n&&(s*=256);)o+=this[e+i]*s;return o};m.prototype.readUintBE=m.prototype.readUIntBE=function(e,n,r){e=e>>>0,n=n>>>0,r||ie(e,n,this.length);let o=this[e+--n],s=1;for(;n>0&&(s*=256);)o+=this[e+--n]*s;return o};m.prototype.readUint8=m.prototype.readUInt8=function(e,n){return e=e>>>0,n||ie(e,1,this.length),this[e]};m.prototype.readUint16LE=m.prototype.readUInt16LE=function(e,n){return e=e>>>0,n||ie(e,2,this.length),this[e]|this[e+1]<<8};m.prototype.readUint16BE=m.prototype.readUInt16BE=function(e,n){return e=e>>>0,n||ie(e,2,this.length),this[e]<<8|this[e+1]};m.prototype.readUint32LE=m.prototype.readUInt32LE=function(e,n){return e=e>>>0,n||ie(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};m.prototype.readUint32BE=m.prototype.readUInt32BE=function(e,n){return e=e>>>0,n||ie(e,4,this.length),this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};m.prototype.readBigUInt64LE=function(e){e=e>>>0,He(e,"offset");let n=this[e],r=this[e+7];(n===void 0||r===void 0)&&ot(e,this.length-8);let o=n+this[++e]*2**8+this[++e]*2**16+this[++e]*2**24,s=this[++e]+this[++e]*2**8+this[++e]*2**16+r*2**24;return BigInt(o)+(BigInt(s)<<BigInt(32))};m.prototype.readBigUInt64BE=function(e){e=e>>>0,He(e,"offset");let n=this[e],r=this[e+7];(n===void 0||r===void 0)&&ot(e,this.length-8);let o=n*2**24+this[++e]*2**16+this[++e]*2**8+this[++e],s=this[++e]*2**24+this[++e]*2**16+this[++e]*2**8+r;return(BigInt(o)<<BigInt(32))+BigInt(s)};m.prototype.readIntLE=function(e,n,r){e=e>>>0,n=n>>>0,r||ie(e,n,this.length);let o=this[e],s=1,i=0;for(;++i<n&&(s*=256);)o+=this[e+i]*s;return s*=128,o>=s&&(o-=Math.pow(2,8*n)),o};m.prototype.readIntBE=function(e,n,r){e=e>>>0,n=n>>>0,r||ie(e,n,this.length);let o=n,s=1,i=this[e+--o];for(;o>0&&(s*=256);)i+=this[e+--o]*s;return s*=128,i>=s&&(i-=Math.pow(2,8*n)),i};m.prototype.readInt8=function(e,n){return e=e>>>0,n||ie(e,1,this.length),this[e]&128?(255-this[e]+1)*-1:this[e]};m.prototype.readInt16LE=function(e,n){e=e>>>0,n||ie(e,2,this.length);let r=this[e]|this[e+1]<<8;return r&32768?r|4294901760:r};m.prototype.readInt16BE=function(e,n){e=e>>>0,n||ie(e,2,this.length);let r=this[e+1]|this[e]<<8;return r&32768?r|4294901760:r};m.prototype.readInt32LE=function(e,n){return e=e>>>0,n||ie(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};m.prototype.readInt32BE=function(e,n){return e=e>>>0,n||ie(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};m.prototype.readBigInt64LE=function(e){e=e>>>0,He(e,"offset");let n=this[e],r=this[e+7];(n===void 0||r===void 0)&&ot(e,this.length-8);let o=this[e+4]+this[e+5]*2**8+this[e+6]*2**16+(r<<24);return(BigInt(o)<<BigInt(32))+BigInt(n+this[++e]*2**8+this[++e]*2**16+this[++e]*2**24)};m.prototype.readBigInt64BE=function(e){e=e>>>0,He(e,"offset");let n=this[e],r=this[e+7];(n===void 0||r===void 0)&&ot(e,this.length-8);let o=(n<<24)+this[++e]*2**16+this[++e]*2**8+this[++e];return(BigInt(o)<<BigInt(32))+BigInt(this[++e]*2**24+this[++e]*2**16+this[++e]*2**8+r)};m.prototype.readFloatLE=function(e,n){return e=e>>>0,n||ie(e,4,this.length),rt(this,e,!0,23,4)};m.prototype.readFloatBE=function(e,n){return e=e>>>0,n||ie(e,4,this.length),rt(this,e,!1,23,4)};m.prototype.readDoubleLE=function(e,n){return e=e>>>0,n||ie(e,8,this.length),rt(this,e,!0,52,8)};m.prototype.readDoubleBE=function(e,n){return e=e>>>0,n||ie(e,8,this.length),rt(this,e,!1,52,8)};function pe(t,e,n,r,o,s){if(!m.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>o||e<s)throw new RangeError('"value" argument is out of bounds');if(n+r>t.length)throw new RangeError("Index out of range")}m.prototype.writeUintLE=m.prototype.writeUIntLE=function(e,n,r,o){if(e=+e,n=n>>>0,r=r>>>0,!o){let l=Math.pow(2,8*r)-1;pe(this,e,n,r,l,0)}let s=1,i=0;for(this[n]=e&255;++i<r&&(s*=256);)this[n+i]=e/s&255;return n+r};m.prototype.writeUintBE=m.prototype.writeUIntBE=function(e,n,r,o){if(e=+e,n=n>>>0,r=r>>>0,!o){let l=Math.pow(2,8*r)-1;pe(this,e,n,r,l,0)}let s=r-1,i=1;for(this[n+s]=e&255;--s>=0&&(i*=256);)this[n+s]=e/i&255;return n+r};m.prototype.writeUint8=m.prototype.writeUInt8=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,1,255,0),this[n]=e&255,n+1};m.prototype.writeUint16LE=m.prototype.writeUInt16LE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,2,65535,0),this[n]=e&255,this[n+1]=e>>>8,n+2};m.prototype.writeUint16BE=m.prototype.writeUInt16BE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,2,65535,0),this[n]=e>>>8,this[n+1]=e&255,n+2};m.prototype.writeUint32LE=m.prototype.writeUInt32LE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,4,4294967295,0),this[n+3]=e>>>24,this[n+2]=e>>>16,this[n+1]=e>>>8,this[n]=e&255,n+4};m.prototype.writeUint32BE=m.prototype.writeUInt32BE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,4,4294967295,0),this[n]=e>>>24,this[n+1]=e>>>16,this[n+2]=e>>>8,this[n+3]=e&255,n+4};function Fr(t,e,n,r,o){Vr(e,r,o,t,n,7);let s=Number(e&BigInt(4294967295));t[n++]=s,s=s>>8,t[n++]=s,s=s>>8,t[n++]=s,s=s>>8,t[n++]=s;let i=Number(e>>BigInt(32)&BigInt(4294967295));return t[n++]=i,i=i>>8,t[n++]=i,i=i>>8,t[n++]=i,i=i>>8,t[n++]=i,n}function Dr(t,e,n,r,o){Vr(e,r,o,t,n,7);let s=Number(e&BigInt(4294967295));t[n+7]=s,s=s>>8,t[n+6]=s,s=s>>8,t[n+5]=s,s=s>>8,t[n+4]=s;let i=Number(e>>BigInt(32)&BigInt(4294967295));return t[n+3]=i,i=i>>8,t[n+2]=i,i=i>>8,t[n+1]=i,i=i>>8,t[n]=i,n+8}m.prototype.writeBigUInt64LE=function(e,n=0){return Fr(this,e,n,BigInt(0),BigInt("0xffffffffffffffff"))};m.prototype.writeBigUInt64BE=function(e,n=0){return Dr(this,e,n,BigInt(0),BigInt("0xffffffffffffffff"))};m.prototype.writeIntLE=function(e,n,r,o){if(e=+e,n=n>>>0,!o){let a=Math.pow(2,8*r-1);pe(this,e,n,r,a-1,-a)}let s=0,i=1,l=0;for(this[n]=e&255;++s<r&&(i*=256);)e<0&&l===0&&this[n+s-1]!==0&&(l=1),this[n+s]=(e/i>>0)-l&255;return n+r};m.prototype.writeIntBE=function(e,n,r,o){if(e=+e,n=n>>>0,!o){let a=Math.pow(2,8*r-1);pe(this,e,n,r,a-1,-a)}let s=r-1,i=1,l=0;for(this[n+s]=e&255;--s>=0&&(i*=256);)e<0&&l===0&&this[n+s+1]!==0&&(l=1),this[n+s]=(e/i>>0)-l&255;return n+r};m.prototype.writeInt8=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,1,127,-128),e<0&&(e=255+e+1),this[n]=e&255,n+1};m.prototype.writeInt16LE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,2,32767,-32768),this[n]=e&255,this[n+1]=e>>>8,n+2};m.prototype.writeInt16BE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,2,32767,-32768),this[n]=e>>>8,this[n+1]=e&255,n+2};m.prototype.writeInt32LE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,4,2147483647,-2147483648),this[n]=e&255,this[n+1]=e>>>8,this[n+2]=e>>>16,this[n+3]=e>>>24,n+4};m.prototype.writeInt32BE=function(e,n,r){return e=+e,n=n>>>0,r||pe(this,e,n,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[n]=e>>>24,this[n+1]=e>>>16,this[n+2]=e>>>8,this[n+3]=e&255,n+4};m.prototype.writeBigInt64LE=function(e,n=0){return Fr(this,e,n,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))};m.prototype.writeBigInt64BE=function(e,n=0){return Dr(this,e,n,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))};function Ur(t,e,n,r,o,s){if(n+r>t.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function Br(t,e,n,r,o){return e=+e,n=n>>>0,o||Ur(t,e,n,4,34028234663852886e22,-34028234663852886e22),qt(t,e,n,r,23,4),n+4}m.prototype.writeFloatLE=function(e,n,r){return Br(this,e,n,!0,r)};m.prototype.writeFloatBE=function(e,n,r){return Br(this,e,n,!1,r)};function zr(t,e,n,r,o){return e=+e,n=n>>>0,o||Ur(t,e,n,8,17976931348623157e292,-17976931348623157e292),qt(t,e,n,r,52,8),n+8}m.prototype.writeDoubleLE=function(e,n,r){return zr(this,e,n,!0,r)};m.prototype.writeDoubleBE=function(e,n,r){return zr(this,e,n,!1,r)};m.prototype.copy=function(e,n,r,o){if(!m.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),!o&&o!==0&&(o=this.length),n>=e.length&&(n=e.length),n||(n=0),o>0&&o<r&&(o=r),o===r||e.length===0||this.length===0)return 0;if(n<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(o<0)throw new RangeError("sourceEnd out of bounds");o>this.length&&(o=this.length),e.length-n<o-r&&(o=e.length-n+r);let s=o-r;return this===e?this.copyWithin(n,r,o):Uint8Array.prototype.set.call(e,this.subarray(r,o),n),s};m.prototype.fill=function(e,n,r,o){if(typeof e=="string"){if(typeof n=="string"?(o=n,n=0,r=this.length):typeof r=="string"&&(o=r,r=this.length),o!==void 0&&typeof o!="string")throw new TypeError("encoding must be a string");if(typeof o=="string"&&!m.isEncoding(o))throw new TypeError("Unknown encoding: "+o);if(e.length===1){let i=e.charCodeAt(0);(o==="utf8"&&i<128||o==="latin1")&&(e=i)}}else typeof e=="number"?e=e&255:typeof e=="boolean"&&(e=Number(e));if(n<0||this.length<n||this.length<r)throw new RangeError("Out of range index");if(r<=n)return this;n=n>>>0,r=r===void 0?this.length:r>>>0,e||(e=0);let s;if(typeof e=="number")for(s=n;s<r;++s)this[s]=e;else{let i=m.isBuffer(e)?e:m.from(e,o),l=i.length;if(l===0)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(s=0;s<r-n;++s)this[s+n]=i[s%l]}return this};var $e={};function tn(t,e,n){$e[t]=class extends n{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${t}]`,this.stack,delete this.name}get code(){return t}set code(o){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:o,writable:!0})}toString(){return`${this.name} [${t}]: ${this.message}`}}}tn("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError);tn("ERR_INVALID_ARG_TYPE",function(t,e){return`The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError);tn("ERR_OUT_OF_RANGE",function(t,e,n){let r=`The value of "${t}" is out of range.`,o=n;return Number.isInteger(n)&&Math.abs(n)>2**32?o=kr(String(n)):typeof n=="bigint"&&(o=String(n),(n>BigInt(2)**BigInt(32)||n<-(BigInt(2)**BigInt(32)))&&(o=kr(o)),o+="n"),r+=` It must be ${e}. Received ${o}`,r},RangeError);function kr(t){let e="",n=t.length,r=t[0]==="-"?1:0;for(;n>=r+4;n-=3)e=`_${t.slice(n-3,n)}${e}`;return`${t.slice(0,n)}${e}`}function Hs(t,e,n){He(e,"offset"),(t[e]===void 0||t[e+n]===void 0)&&ot(e,t.length-(n+1))}function Vr(t,e,n,r,o,s){if(t>n||t<e){let i=typeof e=="bigint"?"n":"",l;throw s>3?e===0||e===BigInt(0)?l=`>= 0${i} and < 2${i} ** ${(s+1)*8}${i}`:l=`>= -(2${i} ** ${(s+1)*8-1}${i}) and < 2 ** ${(s+1)*8-1}${i}`:l=`>= ${e}${i} and <= ${n}${i}`,new $e.ERR_OUT_OF_RANGE("value",l,t)}Hs(r,o,s)}function He(t,e){if(typeof t!="number")throw new $e.ERR_INVALID_ARG_TYPE(e,"number",t)}function ot(t,e,n){throw Math.floor(t)!==t?(He(t,n),new $e.ERR_OUT_OF_RANGE(n||"offset","an integer",t)):e<0?new $e.ERR_BUFFER_OUT_OF_BOUNDS:new $e.ERR_OUT_OF_RANGE(n||"offset",`>= ${n?1:0} and <= ${e}`,t)}var Zs=/[^+/0-9A-Za-z-_]/g;function qs(t){if(t=t.split("=")[0],t=t.trim().replace(Zs,""),t.length<2)return"";for(;t.length%4!==0;)t=t+"=";return t}function Yt(t,e){e=e||1/0;let n,r=t.length,o=null,s=[];for(let i=0;i<r;++i){if(n=t.charCodeAt(i),n>55295&&n<57344){if(!o){if(n>56319){(e-=3)>-1&&s.push(239,191,189);continue}else if(i+1===r){(e-=3)>-1&&s.push(239,191,189);continue}o=n;continue}if(n<56320){(e-=3)>-1&&s.push(239,191,189),o=n;continue}n=(o-55296<<10|n-56320)+65536}else o&&(e-=3)>-1&&s.push(239,191,189);if(o=null,n<128){if((e-=1)<0)break;s.push(n)}else if(n<2048){if((e-=2)<0)break;s.push(n>>6|192,n&63|128)}else if(n<65536){if((e-=3)<0)break;s.push(n>>12|224,n>>6&63|128,n&63|128)}else if(n<1114112){if((e-=4)<0)break;s.push(n>>18|240,n>>12&63|128,n>>6&63|128,n&63|128)}else throw new Error("Invalid code point")}return s}function Ws(t){let e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n)&255);return e}function Ks(t,e){let n,r,o,s=[];for(let i=0;i<t.length&&!((e-=2)<0);++i)n=t.charCodeAt(i),r=n>>8,o=n%256,s.push(o),s.push(r);return s}function Jr(t){return Lr(qs(t))}function vt(t,e,n,r){let o;for(o=0;o<r&&!(o+n>=e.length||o>=t.length);++o)e[o+n]=t[o];return o}var Qs=function(){let t="0123456789abcdef",e=new Array(256);for(let n=0;n<16;++n){let r=n*16;for(let o=0;o<16;++o)e[r+o]=t[n]+t[o]}return e}();var Bt={};Ss(Bt,{ArtMethod:()=>Mt,ArtStackVisitor:()=>Rn,DVM_JNI_ENV_OFFSET_SELF:()=>po,HandleVector:()=>ut,VariableSizedHandleScope:()=>pt,backtrace:()=>Kn,deoptimizeBootImage:()=>tr,deoptimizeEverything:()=>er,deoptimizeMethod:()=>Xn,ensureClassInitialized:()=>El,getAndroidApiLevel:()=>ee,getAndroidVersion:()=>ft,getApi:()=>J,getArtApexVersion:()=>Jn,getArtClassSpec:()=>$n,getArtFieldSpec:()=>Dt,getArtMethodSpec:()=>_e,getArtThreadFromEnv:()=>Ut,getArtThreadSpec:()=>We,makeArtClassLoaderVisitor:()=>Wn,makeArtClassVisitor:()=>qn,makeMethodMangler:()=>fc,makeObjectVisitorPredicate:()=>rr,revertGlobalPatches:()=>Qn,translateMethod:()=>hc,withAllArtThreadsSuspended:()=>Zn,withRunnableArtThread:()=>ye});var{pageSize:nn,pointerSize:Ys}=Process,rn=class{constructor(e){this.sliceSize=e,this.slicesPerPage=nn/e,this.pages=[],this.free=[]}allocateSlice(e,n){let r=e.near===void 0,o=n===1;if(r&&o){let s=this.free.pop();if(s!==void 0)return s}else if(n<nn){let{free:s}=this,i=s.length,l=o?null:ptr(n-1);for(let a=0;a!==i;a++){let c=s[a],d=r||this._isSliceNear(c,e),p=o||c.and(l).isNull();if(d&&p)return s.splice(a,1)[0]}}return this._allocatePage(e)}_allocatePage(e){let n=Memory.alloc(nn,e),{sliceSize:r,slicesPerPage:o}=this;for(let s=1;s!==o;s++){let i=n.add(s*r);this.free.push(i)}return this.pages.push(n),n}_isSliceNear(e,n){let r=e.add(this.sliceSize),{near:o,maxDistance:s}=n,i=Gr(o.sub(e)),l=Gr(o.sub(r));return i.compare(s)<=0&&l.compare(s)<=0}freeSlice(e){this.free.push(e)}};function Gr(t){let e=Ys===4?31:63,n=ptr(1).shl(e).not();return t.and(n)}function on(t){return new rn(t)}function de(t,e){if(e!==0)throw new Error(t+" failed: "+e)}var St={v1_0:805371904,v1_2:805372416},wt={canTagObjects:1},{pointerSize:Xs}=Process,ei={exceptions:"propagate"};function Ne(t,e){this.handle=t,this.vm=e,this.vtable=t.readPointer()}Ne.prototype.deallocate=st(47,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});Ne.prototype.getLoadedClasses=st(78,"int32",["pointer","pointer","pointer"],function(t,e,n){let r=t(this.handle,e,n);de("EnvJvmti::getLoadedClasses",r)});Ne.prototype.iterateOverInstancesOfClass=st(112,"int32",["pointer","pointer","int","pointer","pointer"],function(t,e,n,r,o){let s=t(this.handle,e,n,r,o);de("EnvJvmti::iterateOverInstancesOfClass",s)});Ne.prototype.getObjectsWithTags=st(114,"int32",["pointer","int","pointer","pointer","pointer","pointer"],function(t,e,n,r,o,s){let i=t(this.handle,e,n,r,o,s);de("EnvJvmti::getObjectsWithTags",i)});Ne.prototype.addCapabilities=st(142,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});function st(t,e,n,r){let o=null;return function(){o===null&&(o=new NativeFunction(this.vtable.add((t-1)*Xs).readPointer(),e,n,ei));let s=[o];return s=s.concat.apply(s,arguments),r.apply(this,s)}}function ke(t,e,{limit:n}){let r=t,o=null;for(let s=0;s!==n;s++){let i=Instruction.parse(r),l=e(i,o);if(l!==null)return l;r=i.next,o=i}return null}function ce(t){let e=null,n=!1;return function(...r){return n||(e=t(...r),n=!0),e}}function y(t,e){this.handle=t,this.vm=e}var It=Process.pointerSize,Oe=2,ti=28,ni=34,ri=37,oi=40,si=43,ii=46,ai=49,li=52,ci=55,di=58,ui=61,pi=64,fi=67,hi=70,_i=73,mi=76,gi=79,bi=82,yi=85,Ei=88,vi=91,Si=114,wi=117,Ii=120,Ci=123,Ti=126,Ai=129,Li=132,xi=135,Ni=138,ki=141,Mi=95,ji=96,Oi=97,Ri=98,Pi=99,Fi=100,Di=101,Ui=102,Bi=103,zi=104,Vi=105,Ji=106,Gi=107,$i=108,Hi=109,Zi=110,qi=111,Wi=112,Ki=145,Qi=146,Yi=147,Xi=148,ea=149,ta=150,na=151,ra=152,oa=153,sa=154,ia=155,aa=156,la=157,ca=158,da=159,ua=160,pa=161,fa=162,ha={pointer:ni,uint8:ri,int8:oi,uint16:si,int16:ii,int32:ai,int64:li,float:ci,double:di,void:ui},_a={pointer:pi,uint8:fi,int8:hi,uint16:_i,int16:mi,int32:gi,int64:bi,float:yi,double:Ei,void:vi},ma={pointer:Si,uint8:wi,int8:Ii,uint16:Ci,int16:Ti,int32:Ai,int64:Li,float:xi,double:Ni,void:ki},ga={pointer:Mi,uint8:ji,int8:Oi,uint16:Ri,int16:Pi,int32:Fi,int64:Di,float:Ui,double:Bi},ba={pointer:zi,uint8:Vi,int8:Ji,uint16:Gi,int16:$i,int32:Hi,int64:Zi,float:qi,double:Wi},ya={pointer:Ki,uint8:Qi,int8:Yi,uint16:Xi,int16:ea,int32:ta,int64:na,float:ra,double:oa},Ea={pointer:sa,uint8:ia,int8:aa,uint16:la,int16:ca,int32:da,int64:ua,float:pa,double:fa},Hr={exceptions:"propagate"},sn=null,gn=[];y.dispose=function(t){gn.forEach(t.deleteGlobalRef,t),gn=[]};function De(t){return gn.push(t),t}function Ct(t){return sn===null&&(sn=t.handle.readPointer()),sn}function x(t,e,n,r){let o=null;return function(){o===null&&(o=new NativeFunction(Ct(this).add(t*It).readPointer(),e,n,Hr));let s=[o];return s=s.concat.apply(s,arguments),r.apply(this,s)}}y.prototype.getVersion=x(4,"int32",["pointer"],function(t){return t(this.handle)});y.prototype.findClass=x(6,"pointer",["pointer","pointer"],function(t,e){let n=t(this.handle,Memory.allocUtf8String(e));return this.throwIfExceptionPending(),n});y.prototype.throwIfExceptionPending=function(){let t=this.exceptionOccurred();if(t.isNull())return;this.exceptionClear();let e=this.newGlobalRef(t);this.deleteLocalRef(t);let n=this.vaMethod("pointer",[])(this.handle,e,this.javaLangObject().toString),r=this.stringFromJni(n);this.deleteLocalRef(n);let o=new Error(r);throw o.$h=e,Script.bindWeak(o,va(this.vm,e)),o};function va(t,e){return function(){t.perform(n=>{n.deleteGlobalRef(e)})}}y.prototype.fromReflectedMethod=x(7,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.fromReflectedField=x(8,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.toReflectedMethod=x(9,"pointer",["pointer","pointer","pointer","uint8"],function(t,e,n,r){return t(this.handle,e,n,r)});y.prototype.getSuperclass=x(10,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.isAssignableFrom=x(11,"uint8",["pointer","pointer","pointer"],function(t,e,n){return!!t(this.handle,e,n)});y.prototype.toReflectedField=x(12,"pointer",["pointer","pointer","pointer","uint8"],function(t,e,n,r){return t(this.handle,e,n,r)});y.prototype.throw=x(13,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.exceptionOccurred=x(15,"pointer",["pointer"],function(t){return t(this.handle)});y.prototype.exceptionDescribe=x(16,"void",["pointer"],function(t){t(this.handle)});y.prototype.exceptionClear=x(17,"void",["pointer"],function(t){t(this.handle)});y.prototype.pushLocalFrame=x(19,"int32",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.popLocalFrame=x(20,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.newGlobalRef=x(21,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.deleteGlobalRef=x(22,"void",["pointer","pointer"],function(t,e){t(this.handle,e)});y.prototype.deleteLocalRef=x(23,"void",["pointer","pointer"],function(t,e){t(this.handle,e)});y.prototype.isSameObject=x(24,"uint8",["pointer","pointer","pointer"],function(t,e,n){return!!t(this.handle,e,n)});y.prototype.newLocalRef=x(25,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.allocObject=x(27,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.getObjectClass=x(31,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.isInstanceOf=x(32,"uint8",["pointer","pointer","pointer"],function(t,e,n){return!!t(this.handle,e,n)});y.prototype.getMethodId=x(33,"pointer",["pointer","pointer","pointer","pointer"],function(t,e,n,r){return t(this.handle,e,Memory.allocUtf8String(n),Memory.allocUtf8String(r))});y.prototype.getFieldId=x(94,"pointer",["pointer","pointer","pointer","pointer"],function(t,e,n,r){return t(this.handle,e,Memory.allocUtf8String(n),Memory.allocUtf8String(r))});y.prototype.getIntField=x(100,"int32",["pointer","pointer","pointer"],function(t,e,n){return t(this.handle,e,n)});y.prototype.getStaticMethodId=x(113,"pointer",["pointer","pointer","pointer","pointer"],function(t,e,n,r){return t(this.handle,e,Memory.allocUtf8String(n),Memory.allocUtf8String(r))});y.prototype.getStaticFieldId=x(144,"pointer",["pointer","pointer","pointer","pointer"],function(t,e,n,r){return t(this.handle,e,Memory.allocUtf8String(n),Memory.allocUtf8String(r))});y.prototype.getStaticIntField=x(150,"int32",["pointer","pointer","pointer"],function(t,e,n){return t(this.handle,e,n)});y.prototype.getStringLength=x(164,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.getStringChars=x(165,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.releaseStringChars=x(166,"void",["pointer","pointer","pointer"],function(t,e,n){t(this.handle,e,n)});y.prototype.newStringUtf=x(167,"pointer",["pointer","pointer"],function(t,e){let n=Memory.allocUtf8String(e);return t(this.handle,n)});y.prototype.getStringUtfChars=x(169,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.releaseStringUtfChars=x(170,"void",["pointer","pointer","pointer"],function(t,e,n){t(this.handle,e,n)});y.prototype.getArrayLength=x(171,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.newObjectArray=x(172,"pointer",["pointer","int32","pointer","pointer"],function(t,e,n,r){return t(this.handle,e,n,r)});y.prototype.getObjectArrayElement=x(173,"pointer",["pointer","pointer","int32"],function(t,e,n){return t(this.handle,e,n)});y.prototype.setObjectArrayElement=x(174,"void",["pointer","pointer","int32","pointer"],function(t,e,n,r){t(this.handle,e,n,r)});y.prototype.newBooleanArray=x(175,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newByteArray=x(176,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newCharArray=x(177,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newShortArray=x(178,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newIntArray=x(179,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newLongArray=x(180,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newFloatArray=x(181,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.newDoubleArray=x(182,"pointer",["pointer","int32"],function(t,e){return t(this.handle,e)});y.prototype.getBooleanArrayElements=x(183,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getByteArrayElements=x(184,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getCharArrayElements=x(185,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getShortArrayElements=x(186,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getIntArrayElements=x(187,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getLongArrayElements=x(188,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getFloatArrayElements=x(189,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.getDoubleArrayElements=x(190,"pointer",["pointer","pointer","pointer"],function(t,e){return t(this.handle,e,NULL)});y.prototype.releaseBooleanArrayElements=x(191,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseByteArrayElements=x(192,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseCharArrayElements=x(193,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseShortArrayElements=x(194,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseIntArrayElements=x(195,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseLongArrayElements=x(196,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseFloatArrayElements=x(197,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.releaseDoubleArrayElements=x(198,"pointer",["pointer","pointer","pointer","int32"],function(t,e,n){t(this.handle,e,n,Oe)});y.prototype.getByteArrayRegion=x(200,"void",["pointer","pointer","int","int","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setBooleanArrayRegion=x(207,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setByteArrayRegion=x(208,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setCharArrayRegion=x(209,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setShortArrayRegion=x(210,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setIntArrayRegion=x(211,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setLongArrayRegion=x(212,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setFloatArrayRegion=x(213,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.setDoubleArrayRegion=x(214,"void",["pointer","pointer","int32","int32","pointer"],function(t,e,n,r,o){t(this.handle,e,n,r,o)});y.prototype.registerNatives=x(215,"int32",["pointer","pointer","pointer","int32"],function(t,e,n,r){return t(this.handle,e,n,r)});y.prototype.monitorEnter=x(217,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.monitorExit=x(218,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.getDirectBufferAddress=x(230,"pointer",["pointer","pointer"],function(t,e){return t(this.handle,e)});y.prototype.getObjectRefType=x(232,"int32",["pointer","pointer"],function(t,e){return t(this.handle,e)});var $r=new Map;function Tt(t,e,n,r){return yn(this,"p",wa,t,e,n,r)}function bn(t,e,n,r){return yn(this,"v",Ia,t,e,n,r)}function Sa(t,e,n,r){return yn(this,"n",Ca,t,e,n,r)}function yn(t,e,n,r,o,s,i){if(i!==void 0)return n(t,r,o,s,i);let l=[r,e,o].concat(s).join("|"),a=$r.get(l);return a===void 0&&(a=n(t,r,o,s,Hr),$r.set(l,a)),a}function wa(t,e,n,r,o){return new NativeFunction(Ct(t).add(e*It).readPointer(),n,["pointer","pointer","pointer"].concat(r),o)}function Ia(t,e,n,r,o){return new NativeFunction(Ct(t).add(e*It).readPointer(),n,["pointer","pointer","pointer","..."].concat(r),o)}function Ca(t,e,n,r,o){return new NativeFunction(Ct(t).add(e*It).readPointer(),n,["pointer","pointer","pointer","pointer","..."].concat(r),o)}y.prototype.constructor=function(t,e){return bn.call(this,ti,"pointer",t,e)};y.prototype.vaMethod=function(t,e,n){let r=ha[t];if(r===void 0)throw new Error("Unsupported type: "+t);return bn.call(this,r,t,e,n)};y.prototype.nonvirtualVaMethod=function(t,e,n){let r=_a[t];if(r===void 0)throw new Error("Unsupported type: "+t);return Sa.call(this,r,t,e,n)};y.prototype.staticVaMethod=function(t,e,n){let r=ma[t];if(r===void 0)throw new Error("Unsupported type: "+t);return bn.call(this,r,t,e,n)};y.prototype.getField=function(t){let e=ga[t];if(e===void 0)throw new Error("Unsupported type: "+t);return Tt.call(this,e,t,[])};y.prototype.getStaticField=function(t){let e=ya[t];if(e===void 0)throw new Error("Unsupported type: "+t);return Tt.call(this,e,t,[])};y.prototype.setField=function(t){let e=ba[t];if(e===void 0)throw new Error("Unsupported type: "+t);return Tt.call(this,e,"void",[t])};y.prototype.setStaticField=function(t){let e=Ea[t];if(e===void 0)throw new Error("Unsupported type: "+t);return Tt.call(this,e,"void",[t])};var an=null;y.prototype.javaLangClass=function(){if(an===null){let t=this.findClass("java/lang/Class");try{let e=this.getMethodId.bind(this,t);an={handle:De(this.newGlobalRef(t)),getName:e("getName","()Ljava/lang/String;"),getSimpleName:e("getSimpleName","()Ljava/lang/String;"),getGenericSuperclass:e("getGenericSuperclass","()Ljava/lang/reflect/Type;"),getDeclaredConstructors:e("getDeclaredConstructors","()[Ljava/lang/reflect/Constructor;"),getDeclaredMethods:e("getDeclaredMethods","()[Ljava/lang/reflect/Method;"),getDeclaredFields:e("getDeclaredFields","()[Ljava/lang/reflect/Field;"),isArray:e("isArray","()Z"),isPrimitive:e("isPrimitive","()Z"),isInterface:e("isInterface","()Z"),getComponentType:e("getComponentType","()Ljava/lang/Class;")}}finally{this.deleteLocalRef(t)}}return an};var ln=null;y.prototype.javaLangObject=function(){if(ln===null){let t=this.findClass("java/lang/Object");try{let e=this.getMethodId.bind(this,t);ln={handle:De(this.newGlobalRef(t)),toString:e("toString","()Ljava/lang/String;"),getClass:e("getClass","()Ljava/lang/Class;")}}finally{this.deleteLocalRef(t)}}return ln};var cn=null;y.prototype.javaLangReflectConstructor=function(){if(cn===null){let t=this.findClass("java/lang/reflect/Constructor");try{cn={getGenericParameterTypes:this.getMethodId(t,"getGenericParameterTypes","()[Ljava/lang/reflect/Type;")}}finally{this.deleteLocalRef(t)}}return cn};var dn=null;y.prototype.javaLangReflectMethod=function(){if(dn===null){let t=this.findClass("java/lang/reflect/Method");try{let e=this.getMethodId.bind(this,t);dn={getName:e("getName","()Ljava/lang/String;"),getGenericParameterTypes:e("getGenericParameterTypes","()[Ljava/lang/reflect/Type;"),getParameterTypes:e("getParameterTypes","()[Ljava/lang/Class;"),getGenericReturnType:e("getGenericReturnType","()Ljava/lang/reflect/Type;"),getGenericExceptionTypes:e("getGenericExceptionTypes","()[Ljava/lang/reflect/Type;"),getModifiers:e("getModifiers","()I"),isVarArgs:e("isVarArgs","()Z")}}finally{this.deleteLocalRef(t)}}return dn};var un=null;y.prototype.javaLangReflectField=function(){if(un===null){let t=this.findClass("java/lang/reflect/Field");try{let e=this.getMethodId.bind(this,t);un={getName:e("getName","()Ljava/lang/String;"),getType:e("getType","()Ljava/lang/Class;"),getGenericType:e("getGenericType","()Ljava/lang/reflect/Type;"),getModifiers:e("getModifiers","()I"),toString:e("toString","()Ljava/lang/String;")}}finally{this.deleteLocalRef(t)}}return un};var pn=null;y.prototype.javaLangReflectTypeVariable=function(){if(pn===null){let t=this.findClass("java/lang/reflect/TypeVariable");try{let e=this.getMethodId.bind(this,t);pn={handle:De(this.newGlobalRef(t)),getName:e("getName","()Ljava/lang/String;"),getBounds:e("getBounds","()[Ljava/lang/reflect/Type;"),getGenericDeclaration:e("getGenericDeclaration","()Ljava/lang/reflect/GenericDeclaration;")}}finally{this.deleteLocalRef(t)}}return pn};var fn=null;y.prototype.javaLangReflectWildcardType=function(){if(fn===null){let t=this.findClass("java/lang/reflect/WildcardType");try{let e=this.getMethodId.bind(this,t);fn={handle:De(this.newGlobalRef(t)),getLowerBounds:e("getLowerBounds","()[Ljava/lang/reflect/Type;"),getUpperBounds:e("getUpperBounds","()[Ljava/lang/reflect/Type;")}}finally{this.deleteLocalRef(t)}}return fn};var hn=null;y.prototype.javaLangReflectGenericArrayType=function(){if(hn===null){let t=this.findClass("java/lang/reflect/GenericArrayType");try{hn={handle:De(this.newGlobalRef(t)),getGenericComponentType:this.getMethodId(t,"getGenericComponentType","()Ljava/lang/reflect/Type;")}}finally{this.deleteLocalRef(t)}}return hn};var _n=null;y.prototype.javaLangReflectParameterizedType=function(){if(_n===null){let t=this.findClass("java/lang/reflect/ParameterizedType");try{let e=this.getMethodId.bind(this,t);_n={handle:De(this.newGlobalRef(t)),getActualTypeArguments:e("getActualTypeArguments","()[Ljava/lang/reflect/Type;"),getRawType:e("getRawType","()Ljava/lang/reflect/Type;"),getOwnerType:e("getOwnerType","()Ljava/lang/reflect/Type;")}}finally{this.deleteLocalRef(t)}}return _n};var mn=null;y.prototype.javaLangString=function(){if(mn===null){let t=this.findClass("java/lang/String");try{mn={handle:De(this.newGlobalRef(t))}}finally{this.deleteLocalRef(t)}}return mn};y.prototype.getClassName=function(t){let e=this.vaMethod("pointer",[])(this.handle,t,this.javaLangClass().getName);try{return this.stringFromJni(e)}finally{this.deleteLocalRef(e)}};y.prototype.getObjectClassName=function(t){let e=this.getObjectClass(t);try{return this.getClassName(e)}finally{this.deleteLocalRef(e)}};y.prototype.getActualTypeArgument=function(t){let e=this.vaMethod("pointer",[])(this.handle,t,this.javaLangReflectParameterizedType().getActualTypeArguments);if(this.throwIfExceptionPending(),!e.isNull())try{return this.getTypeNameFromFirstTypeElement(e)}finally{this.deleteLocalRef(e)}};y.prototype.getTypeNameFromFirstTypeElement=function(t){if(this.getArrayLength(t)>0){let n=this.getObjectArrayElement(t,0);try{return this.getTypeName(n)}finally{this.deleteLocalRef(n)}}else return"java.lang.Object"};y.prototype.getTypeName=function(t,e){let n=this.vaMethod("pointer",[]);if(this.isInstanceOf(t,this.javaLangClass().handle))return this.getClassName(t);if(this.isInstanceOf(t,this.javaLangReflectGenericArrayType().handle))return this.getArrayTypeName(t);if(this.isInstanceOf(t,this.javaLangReflectParameterizedType().handle)){let r=n(this.handle,t,this.javaLangReflectParameterizedType().getRawType);this.throwIfExceptionPending();let o;try{o=this.getTypeName(r)}finally{this.deleteLocalRef(r)}return e&&(o+="<"+this.getActualTypeArgument(t)+">"),o}else return this.isInstanceOf(t,this.javaLangReflectTypeVariable().handle)||this.isInstanceOf(t,this.javaLangReflectWildcardType().handle),"java.lang.Object"};y.prototype.getArrayTypeName=function(t){let e=this.vaMethod("pointer",[]);if(this.isInstanceOf(t,this.javaLangClass().handle))return this.getClassName(t);if(this.isInstanceOf(t,this.javaLangReflectGenericArrayType().handle)){let n=e(this.handle,t,this.javaLangReflectGenericArrayType().getGenericComponentType);this.throwIfExceptionPending();try{return"[L"+this.getTypeName(n)+";"}finally{this.deleteLocalRef(n)}}else return"[Ljava.lang.Object;"};y.prototype.stringFromJni=function(t){let e=this.getStringChars(t);if(e.isNull())throw new Error("Unable to access string");try{let n=this.getStringLength(t);return e.readUtf16String(n)}finally{this.releaseStringChars(t,e)}};var Zr=65542,Ze=Process.pointerSize,En=Process.getCurrentThreadId(),Ue=new Map,it=new Map;function Ce(t){let e=t.vm,n=null,r=null,o=null;function s(){let l=e.readPointer(),a={exceptions:"propagate"};n=new NativeFunction(l.add(4*Ze).readPointer(),"int32",["pointer","pointer","pointer"],a),r=new NativeFunction(l.add(5*Ze).readPointer(),"int32",["pointer"],a),o=new NativeFunction(l.add(6*Ze).readPointer(),"int32",["pointer","pointer","int32"],a)}this.handle=e,this.perform=function(l){let a=Process.getCurrentThreadId(),c=i(a);if(c!==null)return l(c);let d=this._tryGetEnv(),p=d!==null;p||(d=this.attachCurrentThread(),Ue.set(a,!0)),this.link(a,d);try{return l(d)}finally{let f=a===En;if(f||this.unlink(a),!p&&!f){let u=Ue.get(a);Ue.delete(a),u&&this.detachCurrentThread()}}},this.attachCurrentThread=function(){let l=Memory.alloc(Ze);return de("VM::AttachCurrentThread",n(e,l,NULL)),new y(l.readPointer(),this)},this.detachCurrentThread=function(){de("VM::DetachCurrentThread",r(e))},this.preventDetachDueToClassLoader=function(){let l=Process.getCurrentThreadId();Ue.has(l)&&Ue.set(l,!1)},this.getEnv=function(){let l=i(Process.getCurrentThreadId());if(l!==null)return l;let a=Memory.alloc(Ze),c=o(e,a,Zr);if(c===-2)throw new Error("Current thread is not attached to the Java VM; please move this code inside a Java.perform() callback");return de("VM::GetEnv",c),new y(a.readPointer(),this)},this.tryGetEnv=function(){let l=i(Process.getCurrentThreadId());return l!==null?l:this._tryGetEnv()},this._tryGetEnv=function(){let l=this.tryGetEnvHandle(Zr);return l===null?null:new y(l,this)},this.tryGetEnvHandle=function(l){let a=Memory.alloc(Ze);return o(e,a,l)!==0?null:a.readPointer()},this.makeHandleDestructor=function(l){return()=>{this.perform(a=>{a.deleteGlobalRef(l)})}},this.link=function(l,a){let c=it.get(l);c===void 0?it.set(l,[a,1]):c[1]++},this.unlink=function(l){let a=it.get(l);a[1]===1?it.delete(l):a[1]--};function i(l){let a=it.get(l);return a===void 0?null:a[0]}s.call(this)}Ce.dispose=function(t){Ue.get(En)===!0&&(Ue.delete(En),t.detachCurrentThread())};var Ta=4,v=Process.pointerSize,{readU32:Aa,readPointer:La,writeU32:xa,writePointer:Na}=NativePointer.prototype,ka=1,Ma=8,ja=16,Nt=256,Oa=524288,Ra=2097152,uo=1073741824,Pa=524288,Fa=134217728,qr=1048576,Da=2097152,Ua=268435456,Ba=268435456,za=0,kn=3,Mn=5,Vn=ptr(1).not(),Va=2147467263,Ja=4294963200,Ft=17*v,Ga=18*v,po=12,$a=112,Ha=116,Za=0,Sn=56,Wr=4,qa=8,Wa=10,Ka=12,Qa=14,Ya=28,Xa=36,el=0,tl=1,nl=2,rl=3,ol=4,sl=5,il=6,al=7,Kr=2147483648,ll=28,dt=3*v,cl=3*v,dl=1,ul=1,fo=ce(Sl),pl=ce(Rl),_e=ce(Fl),We=ce(Dl),fl=ce(Ul),hl=ce(ql),ft=ce(Jl),ho=ce(Gl),ee=ce($l),Jn=ce(Hl),_l=ce(Yl),ml=Process.arch==="ia32"?Dc:Fc,W={exceptions:"propagate"},at={},wn=null,In=null,_o=null,oe=null,Gn=[],kt=new Map,mo=[],Cn=null,Qr=0,Yr=!1,Xr=!1,lt=null,gl=[],Tn=null,At=null;function J(){return wn===null&&(wn=bl()),wn}function bl(){let t=Process.enumerateModules().filter(u=>/^lib(art|dvm).so$/.test(u.name)).filter(u=>!/\/system\/fake-libs/.test(u.path));if(t.length===0)return null;let e=t[0],n=e.name.indexOf("art")!==-1?"art":"dalvik",r=n==="art",o={module:e,find(u){let{module:_}=this,h=_.findExportByName(u);return h===null&&(h=_.findSymbolByName(u)),h},flavor:n,addLocalReference:null};o.isApiLevel34OrApexEquivalent=r&&(o.find("_ZN3art7AppInfo29GetPrimaryApkReferenceProfileEv")!==null||o.find("_ZN3art6Thread15RunFlipFunctionEPS0_")!==null);let s=r?{functions:{JNI_GetCreatedJavaVMs:["JNI_GetCreatedJavaVMs","int",["pointer","int","pointer"]],artInterpreterToCompiledCodeBridge:function(u){this.artInterpreterToCompiledCodeBridge=u},_ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadENS_6ObjPtrINS_6mirror6ObjectEEE:["art::JavaVMExt::AddGlobalRef","pointer",["pointer","pointer","pointer"]],_ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadEPNS_6mirror6ObjectE:["art::JavaVMExt::AddGlobalRef","pointer",["pointer","pointer","pointer"]],_ZN3art17ReaderWriterMutex13ExclusiveLockEPNS_6ThreadE:["art::ReaderWriterMutex::ExclusiveLock","void",["pointer","pointer"]],_ZN3art17ReaderWriterMutex15ExclusiveUnlockEPNS_6ThreadE:["art::ReaderWriterMutex::ExclusiveUnlock","void",["pointer","pointer"]],_ZN3art22IndirectReferenceTable3AddEjPNS_6mirror6ObjectE:function(u){this["art::IndirectReferenceTable::Add"]=new NativeFunction(u,"pointer",["pointer","uint","pointer"],W)},_ZN3art22IndirectReferenceTable3AddENS_15IRTSegmentStateENS_6ObjPtrINS_6mirror6ObjectEEE:function(u){this["art::IndirectReferenceTable::Add"]=new NativeFunction(u,"pointer",["pointer","uint","pointer"],W)},_ZN3art9JavaVMExt12DecodeGlobalEPv:function(u){let _;ee()>=26?_=ml(u,["pointer","pointer"]):_=new NativeFunction(u,"pointer",["pointer","pointer"],W),this["art::JavaVMExt::DecodeGlobal"]=function(h,g,b){return _(h,b)}},_ZN3art9JavaVMExt12DecodeGlobalEPNS_6ThreadEPv:["art::JavaVMExt::DecodeGlobal","pointer",["pointer","pointer","pointer"]],_ZNK3art6Thread19DecodeGlobalJObjectEP8_jobject:["art::Thread::DecodeJObject","pointer",["pointer","pointer"]],_ZNK3art6Thread13DecodeJObjectEP8_jobject:["art::Thread::DecodeJObject","pointer",["pointer","pointer"]],_ZN3art10ThreadList10SuspendAllEPKcb:["art::ThreadList::SuspendAll","void",["pointer","pointer","bool"]],_ZN3art10ThreadList10SuspendAllEv:function(u){let _=new NativeFunction(u,"void",["pointer"],W);this["art::ThreadList::SuspendAll"]=function(h,g,b){return _(h)}},_ZN3art10ThreadList9ResumeAllEv:["art::ThreadList::ResumeAll","void",["pointer"]],_ZN3art11ClassLinker12VisitClassesEPNS_12ClassVisitorE:["art::ClassLinker::VisitClasses","void",["pointer","pointer"]],_ZN3art11ClassLinker12VisitClassesEPFbPNS_6mirror5ClassEPvES4_:function(u){let _=new NativeFunction(u,"void",["pointer","pointer","pointer"],W);this["art::ClassLinker::VisitClasses"]=function(h,g){_(h,g,NULL)}},_ZNK3art11ClassLinker17VisitClassLoadersEPNS_18ClassLoaderVisitorE:["art::ClassLinker::VisitClassLoaders","void",["pointer","pointer"]],_ZN3art2gc4Heap12VisitObjectsEPFvPNS_6mirror6ObjectEPvES5_:["art::gc::Heap::VisitObjects","void",["pointer","pointer","pointer"]],_ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE:["art::gc::Heap::GetInstances","void",["pointer","pointer","pointer","int","pointer"]],_ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEbiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE:function(u){let _=new NativeFunction(u,"void",["pointer","pointer","pointer","bool","int","pointer"],W);this["art::gc::Heap::GetInstances"]=function(h,g,b,E,C){_(h,g,b,0,E,C)}},_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEjb:["art::StackVisitor::StackVisitor","void",["pointer","pointer","pointer","uint","uint","bool"]],_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEmb:["art::StackVisitor::StackVisitor","void",["pointer","pointer","pointer","uint","size_t","bool"]],_ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE0EEEvb:["art::StackVisitor::WalkStack","void",["pointer","bool"]],_ZNK3art12StackVisitor9GetMethodEv:["art::StackVisitor::GetMethod","pointer",["pointer"]],_ZNK3art12StackVisitor16DescribeLocationEv:function(u){this["art::StackVisitor::DescribeLocation"]=xt(u,["pointer"])},_ZNK3art12StackVisitor24GetCurrentQuickFrameInfoEv:function(u){this["art::StackVisitor::GetCurrentQuickFrameInfo"]=Ql(u)},_ZN3art7Context6CreateEv:["art::Context::Create","pointer",[]],_ZN3art6Thread18GetLongJumpContextEv:["art::Thread::GetLongJumpContext","pointer",["pointer"]],_ZN3art6mirror5Class13GetDescriptorEPNSt3__112basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE:function(u){this["art::mirror::Class::GetDescriptor"]=u},_ZN3art6mirror5Class11GetLocationEv:function(u){this["art::mirror::Class::GetLocation"]=xt(u,["pointer"])},_ZN3art9ArtMethod12PrettyMethodEb:function(u){this["art::ArtMethod::PrettyMethod"]=xt(u,["pointer","bool"])},_ZN3art12PrettyMethodEPNS_9ArtMethodEb:function(u){this["art::ArtMethod::PrettyMethodNullSafe"]=xt(u,["pointer","bool"])},_ZN3art6Thread14CurrentFromGdbEv:["art::Thread::CurrentFromGdb","pointer",[]],_ZN3art6mirror6Object5CloneEPNS_6ThreadE:function(u){this["art::mirror::Object::Clone"]=new NativeFunction(u,"pointer",["pointer","pointer"],W)},_ZN3art6mirror6Object5CloneEPNS_6ThreadEm:function(u){let _=new NativeFunction(u,"pointer",["pointer","pointer","pointer"],W);this["art::mirror::Object::Clone"]=function(h,g){let b=NULL;return _(h,g,b)}},_ZN3art6mirror6Object5CloneEPNS_6ThreadEj:function(u){let _=new NativeFunction(u,"pointer",["pointer","pointer","uint"],W);this["art::mirror::Object::Clone"]=function(h,g){return _(h,g,0)}},_ZN3art3Dbg14SetJdwpAllowedEb:["art::Dbg::SetJdwpAllowed","void",["bool"]],_ZN3art3Dbg13ConfigureJdwpERKNS_4JDWP11JdwpOptionsE:["art::Dbg::ConfigureJdwp","void",["pointer"]],_ZN3art31InternalDebuggerControlCallback13StartDebuggerEv:["art::InternalDebuggerControlCallback::StartDebugger","void",["pointer"]],_ZN3art3Dbg9StartJdwpEv:["art::Dbg::StartJdwp","void",[]],_ZN3art3Dbg8GoActiveEv:["art::Dbg::GoActive","void",[]],_ZN3art3Dbg21RequestDeoptimizationERKNS_21DeoptimizationRequestE:["art::Dbg::RequestDeoptimization","void",["pointer"]],_ZN3art3Dbg20ManageDeoptimizationEv:["art::Dbg::ManageDeoptimization","void",[]],_ZN3art15instrumentation15Instrumentation20EnableDeoptimizationEv:["art::Instrumentation::EnableDeoptimization","void",["pointer"]],_ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEPKc:["art::Instrumentation::DeoptimizeEverything","void",["pointer","pointer"]],_ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEv:function(u){let _=new NativeFunction(u,"void",["pointer"],W);this["art::Instrumentation::DeoptimizeEverything"]=function(h,g){_(h)}},_ZN3art7Runtime19DeoptimizeBootImageEv:["art::Runtime::DeoptimizeBootImage","void",["pointer"]],_ZN3art15instrumentation15Instrumentation10DeoptimizeEPNS_9ArtMethodE:["art::Instrumentation::Deoptimize","void",["pointer","pointer"]],_ZN3art3jni12JniIdManager14DecodeMethodIdEP10_jmethodID:["art::jni::JniIdManager::DecodeMethodId","pointer",["pointer","pointer"]],_ZN3art3jni12JniIdManager13DecodeFieldIdEP9_jfieldID:["art::jni::JniIdManager::DecodeFieldId","pointer",["pointer","pointer"]],_ZN3art11interpreter18GetNterpEntryPointEv:["art::interpreter::GetNterpEntryPoint","pointer",[]],_ZN3art7Monitor17TranslateLocationEPNS_9ArtMethodEjPPKcPi:["art::Monitor::TranslateLocation","void",["pointer","uint32","pointer","pointer"]]},variables:{_ZN3art3Dbg9gRegistryE:function(u){this.isJdwpStarted=()=>!u.readPointer().isNull()},_ZN3art3Dbg15gDebuggerActiveE:function(u){this.isDebuggerActive=()=>!!u.readU8()}},optionals:new Set(["artInterpreterToCompiledCodeBridge","_ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadENS_6ObjPtrINS_6mirror6ObjectEEE","_ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadEPNS_6mirror6ObjectE","_ZN3art9JavaVMExt12DecodeGlobalEPv","_ZN3art9JavaVMExt12DecodeGlobalEPNS_6ThreadEPv","_ZNK3art6Thread19DecodeGlobalJObjectEP8_jobject","_ZNK3art6Thread13DecodeJObjectEP8_jobject","_ZN3art10ThreadList10SuspendAllEPKcb","_ZN3art10ThreadList10SuspendAllEv","_ZN3art11ClassLinker12VisitClassesEPNS_12ClassVisitorE","_ZN3art11ClassLinker12VisitClassesEPFbPNS_6mirror5ClassEPvES4_","_ZNK3art11ClassLinker17VisitClassLoadersEPNS_18ClassLoaderVisitorE","_ZN3art6mirror6Object5CloneEPNS_6ThreadE","_ZN3art6mirror6Object5CloneEPNS_6ThreadEm","_ZN3art6mirror6Object5CloneEPNS_6ThreadEj","_ZN3art22IndirectReferenceTable3AddEjPNS_6mirror6ObjectE","_ZN3art22IndirectReferenceTable3AddENS_15IRTSegmentStateENS_6ObjPtrINS_6mirror6ObjectEEE","_ZN3art2gc4Heap12VisitObjectsEPFvPNS_6mirror6ObjectEPvES5_","_ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE","_ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEbiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE","_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEjb","_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEmb","_ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE0EEEvb","_ZNK3art12StackVisitor9GetMethodEv","_ZNK3art12StackVisitor16DescribeLocationEv","_ZNK3art12StackVisitor24GetCurrentQuickFrameInfoEv","_ZN3art7Context6CreateEv","_ZN3art6Thread18GetLongJumpContextEv","_ZN3art6mirror5Class13GetDescriptorEPNSt3__112basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE","_ZN3art6mirror5Class11GetLocationEv","_ZN3art9ArtMethod12PrettyMethodEb","_ZN3art12PrettyMethodEPNS_9ArtMethodEb","_ZN3art3Dbg13ConfigureJdwpERKNS_4JDWP11JdwpOptionsE","_ZN3art31InternalDebuggerControlCallback13StartDebuggerEv","_ZN3art3Dbg15gDebuggerActiveE","_ZN3art15instrumentation15Instrumentation20EnableDeoptimizationEv","_ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEPKc","_ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEv","_ZN3art7Runtime19DeoptimizeBootImageEv","_ZN3art15instrumentation15Instrumentation10DeoptimizeEPNS_9ArtMethodE","_ZN3art3Dbg9StartJdwpEv","_ZN3art3Dbg8GoActiveEv","_ZN3art3Dbg21RequestDeoptimizationERKNS_21DeoptimizationRequestE","_ZN3art3Dbg20ManageDeoptimizationEv","_ZN3art3Dbg9gRegistryE","_ZN3art3jni12JniIdManager14DecodeMethodIdEP10_jmethodID","_ZN3art3jni12JniIdManager13DecodeFieldIdEP9_jfieldID","_ZN3art11interpreter18GetNterpEntryPointEv","_ZN3art7Monitor17TranslateLocationEPNS_9ArtMethodEjPPKcPi"])}:{functions:{_Z20dvmDecodeIndirectRefP6ThreadP8_jobject:["dvmDecodeIndirectRef","pointer",["pointer","pointer"]],_Z15dvmUseJNIBridgeP6MethodPv:["dvmUseJNIBridge","void",["pointer","pointer"]],_Z20dvmHeapSourceGetBasev:["dvmHeapSourceGetBase","pointer",[]],_Z21dvmHeapSourceGetLimitv:["dvmHeapSourceGetLimit","pointer",[]],_Z16dvmIsValidObjectPK6Object:["dvmIsValidObject","uint8",["pointer"]],JNI_GetCreatedJavaVMs:["JNI_GetCreatedJavaVMs","int",["pointer","int","pointer"]]},variables:{gDvmJni:function(u){this.gDvmJni=u},gDvm:function(u){this.gDvm=u}}},{functions:i={},variables:l={},optionals:a=new Set}=s,c=[];for(let[u,_]of Object.entries(i)){let h=o.find(u);h!==null?typeof _=="function"?_.call(o,h):o[_[0]]=new NativeFunction(h,_[1],_[2],W):a.has(u)||c.push(u)}for(let[u,_]of Object.entries(l)){let h=o.find(u);h!==null?_.call(o,h):a.has(u)||c.push(u)}if(c.length>0)throw new Error("Java API only partially available; please file a bug. Missing: "+c.join(", "));let d=Memory.alloc(v),p=Memory.alloc(Ta);if(de("JNI_GetCreatedJavaVMs",o.JNI_GetCreatedJavaVMs(d,1,p)),p.readInt()===0)return null;if(o.vm=d.readPointer(),r){let u=ee(),_;u>=27?_=33554432:u>=24?_=16777216:_=0,o.kAccCompileDontBother=_;let h=o.vm.add(v).readPointer();o.artRuntime=h;let g=fo(o),b=g.offset,E=b.instrumentation;o.artInstrumentation=E!==null?h.add(E):null,Jn()>=36e7&&o.artInstrumentation!=null&&(o.artInstrumentation=o.artInstrumentation.readPointer()),o.artHeap=h.add(b.heap).readPointer(),o.artThreadList=h.add(b.threadList).readPointer();let A=h.add(b.classLinker).readPointer(),M=Pl(h,g).offset,O=A.add(M.quickResolutionTrampoline).readPointer(),k=A.add(M.quickImtConflictTrampoline).readPointer(),N=A.add(M.quickGenericJniTrampoline).readPointer(),S=A.add(M.quickToInterpreterBridgeTrampoline).readPointer();o.artClassLinker={address:A,quickResolutionTrampoline:O,quickImtConflictTrampoline:k,quickGenericJniTrampoline:N,quickToInterpreterBridgeTrampoline:S};let L=new Ce(o);o.artQuickGenericJniTrampoline=An(N,L),o.artQuickToInterpreterBridge=An(S,L),o.artQuickResolutionTrampoline=An(O,L),o["art::JavaVMExt::AddGlobalRef"]===void 0&&(o["art::JavaVMExt::AddGlobalRef"]=kc(o)),o["art::JavaVMExt::DecodeGlobal"]===void 0&&(o["art::JavaVMExt::DecodeGlobal"]=Mc(o)),o["art::ArtMethod::PrettyMethod"]===void 0&&(o["art::ArtMethod::PrettyMethod"]=o["art::ArtMethod::PrettyMethodNullSafe"]),o["art::interpreter::GetNterpEntryPoint"]!==void 0?o.artNterpEntryPoint=o["art::interpreter::GetNterpEntryPoint"]():o.artNterpEntryPoint=o.find("ExecuteNterpImpl"),oe=tc(o,L),Pc(o);let j=null;Object.defineProperty(o,"jvmti",{get(){return j===null&&(j=[yl(L,this.artRuntime)]),j[0]}})}let f=e.enumerateImports().filter(u=>u.name.indexOf("_Z")===0).reduce((u,_)=>(u[_.name]=_.address,u),{});return o.$new=new NativeFunction(f._Znwm||f._Znwj,"pointer",["ulong"],W),o.$delete=new NativeFunction(f._ZdlPv,"void",["pointer"],W),_o=r?Dn:Un,o}function yl(t,e){let n=null;return t.perform(()=>{let r=J().find("_ZN3art7Runtime18EnsurePluginLoadedEPKcPNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEE");if(r===null)return;let o=new NativeFunction(r,"bool",["pointer","pointer","pointer"]),s=Memory.alloc(v);if(!o(e,Memory.allocUtf8String("libopenjdkjvmti.so"),s))return;let l=St.v1_2|1073741824,a=t.tryGetEnvHandle(l);if(a===null)return;n=new Ne(a,t);let c=Memory.alloc(8);c.writeU64(wt.canTagObjects),n.addCapabilities(c)!==0&&(n=null)}),n}function El(t,e){J().flavor==="art"&&t.getClassName(e)}function vl(t){return{offset:v===4?{globalsLock:32,globals:72}:{globalsLock:64,globals:112}}}function Sl(t){let e=t.vm,n=t.artRuntime,r=v===4?200:384,o=r+100*v,s=ee(),i=ho(),{isApiLevel34OrApexEquivalent:l}=t,a=null;for(let d=r;d!==o;d+=v)if(n.add(d).readPointer().equals(e)){let f,u=null;s>=33||i==="Tiramisu"||l?(f=[d-4*v],u=d-v):s>=30||i==="R"?(f=[d-3*v,d-4*v],u=d-v):s>=29?f=[d-2*v]:s>=27?f=[d-dt-3*v]:f=[d-dt-2*v];for(let _ of f){let h=_-v,g=h-v,b;l?b=g-9*v:s>=24?b=g-8*v:s>=23?b=g-7*v:b=g-4*v;let E={offset:{heap:b,threadList:g,internTable:h,classLinker:_,jniIdManager:u}};if(go(n,E)!==null){a=E;break}}break}if(a===null)throw new Error("Unable to determine Runtime field offsets");let c=Jn()>=36e7;return a.offset.instrumentation=c?Ll(t):Il(t),a.offset.jniIdsIndirection=Ml(t),a}var wl={ia32:eo,x64:eo,arm:Cl,arm64:Tl};function Il(t){let e=t["art::Runtime::DeoptimizeBootImage"];return e===void 0?null:ke(e,wl[Process.arch],{limit:30})}function eo(t){if(t.mnemonic!=="lea")return null;let e=t.operands[1].value.disp;return e<256||e>1024?null:e}function Cl(t){if(t.mnemonic!=="add.w")return null;let e=t.operands;if(e.length!==3)return null;let n=e[2];return n.type!=="imm"?null:n.value}function Tl(t){if(t.mnemonic!=="add")return null;let e=t.operands;if(e.length!==3||e[0].value==="sp"||e[1].value==="sp")return null;let n=e[2];if(n.type!=="imm")return null;let r=n.value.valueOf();return r<256||r>1024?null:r}var Al={ia32:to,x64:to,arm:xl,arm64:Nl};function Ll(t){let e=t["art::Runtime::DeoptimizeBootImage"];return e===void 0?null:ke(e,Al[Process.arch],{limit:30})}function to(t){if(t.mnemonic!=="mov")return null;let e=t.operands;if(e[0].value!=="rax")return null;let r=e[1];if(r.type!=="mem")return null;let o=r.value;if(o.base!=="rdi")return null;let s=o.disp;return s<256||s>1024?null:s}function xl(t){return null}function Nl(t){if(t.mnemonic!=="ldr")return null;let e=t.operands;if(e[0].value==="x0")return null;let n=e[1].value;if(n.base!=="x0")return null;let r=n.disp;return r<256||r>1024?null:r}var kl={ia32:no,x64:no,arm:jl,arm64:Ol};function Ml(t){let e=t.find("_ZN3art7Runtime12SetJniIdTypeENS_9JniIdTypeE");if(e===null)return null;let n=ke(e,kl[Process.arch],{limit:20});if(n===null)throw new Error("Unable to determine Runtime.jni_ids_indirection_ offset");return n}function no(t){return t.mnemonic==="cmp"?t.operands[0].value.disp:null}function jl(t){return t.mnemonic==="ldr.w"?t.operands[1].value.disp:null}function Ol(t,e){if(e===null)return null;let{mnemonic:n}=t,{mnemonic:r}=e;return n==="cmp"&&r==="ldr"||n==="bl"&&r==="str"?e.operands[1].value.disp:null}function Rl(){let e={"4-21":136,"4-22":136,"4-23":172,"4-24":196,"4-25":196,"4-26":196,"4-27":196,"4-28":212,"4-29":172,"4-30":180,"4-31":180,"8-21":224,"8-22":224,"8-23":296,"8-24":344,"8-25":344,"8-26":352,"8-27":352,"8-28":392,"8-29":328,"8-30":336,"8-31":336}[`${v}-${ee()}`];if(e===void 0)throw new Error("Unable to determine Instrumentation field offsets");return{offset:{forcedInterpretOnly:4,deoptimizationEnabled:e}}}function Pl(t,e){let n=go(t,e);if(n===null)throw new Error("Unable to determine ClassLinker field offsets");return n}function go(t,e){if(In!==null)return In;let{classLinker:n,internTable:r}=e.offset,o=t.add(n).readPointer(),s=t.add(r).readPointer(),i=v===4?100:200,l=i+100*v,a=ee(),c=null;for(let d=i;d!==l;d+=v)if(o.add(d).readPointer().equals(s)){let f;a>=30||ho()==="R"?f=6:a>=29?f=4:a>=23?f=3:f=5;let u=d+f*v,_;a>=23?_=u-2*v:_=u-3*v,c={offset:{quickResolutionTrampoline:_,quickImtConflictTrampoline:u-v,quickGenericJniTrampoline:u,quickToInterpreterBridgeTrampoline:u+v}};break}return c!==null&&(In=c),c}function $n(t){let n=null;return t.perform(r=>{let o=Dt(t),s=_e(t),i={artArrayLengthSize:4,artArrayEntrySize:o.size,artArrayMax:50},l={artArrayLengthSize:v,artArrayEntrySize:s.size,artArrayMax:100},a=(f,u,_)=>{let h=f.add(u).readPointer();if(h.isNull())return null;let g=_===4?h.readU32():h.readU64().valueOf();return g<=0?null:{length:g,data:h.add(_)}},c=(f,u,_,h)=>{try{let g=a(f,u,h.artArrayLengthSize);if(g===null)return!1;let b=Math.min(g.length,h.artArrayMax);for(let E=0;E!==b;E++)if(g.data.add(E*h.artArrayEntrySize).equals(_))return!0}catch{}return!1},d=r.findClass("java/lang/Thread"),p=r.newGlobalRef(d);try{let f;ye(t,r,N=>{f=J()["art::JavaVMExt::DecodeGlobal"](t,N,p)});let u=so(r.getFieldId(p,"name","Ljava/lang/String;")),_=so(r.getStaticFieldId(p,"MAX_PRIORITY","I")),h=-1,g=-1;for(let N=0;N!==256;N+=4)h===-1&&c(f,N,_,i)&&(h=N),g===-1&&c(f,N,u,i)&&(g=N);if(g===-1||h===-1)throw new Error("Unable to find fields in java/lang/Thread; please file a bug");let b=g!==h?h:0,E=g,C=-1,A=Yn(r.getMethodId(p,"getName","()Ljava/lang/String;"));for(let N=0;N!==256;N+=4)C===-1&&c(f,N,A,l)&&(C=N);if(C===-1)throw new Error("Unable to find methods in java/lang/Thread; please file a bug");let M=-1,k=a(f,C,l.artArrayLengthSize).length;for(let N=C;N!==256;N+=4)if(f.add(N).readU16()===k){M=N;break}if(M===-1)throw new Error("Unable to find copied methods in java/lang/Thread; please file a bug");n={offset:{ifields:E,methods:C,sfields:b,copiedMethodsOffset:M}}}finally{r.deleteLocalRef(d),r.deleteGlobalRef(p)}}),n}function Fl(t){let e=J(),n;return t.perform(r=>{let o=r.findClass("android/os/Process"),s=Yn(r.getStaticMethodId(o,"getElapsedCpuTime","()J"));r.deleteLocalRef(o);let i=Process.getModuleByName("libandroid_runtime.so"),l=i.base,a=l.add(i.size),c=ee(),d=c<=21?8:v,p=ka|Ma|ja|Nt,f=~(uo|Ua|Da)>>>0,u=null,_=null,h=2;for(let E=0;E!==64&&h!==0;E+=4){let C=s.add(E);if(u===null){let A=C.readPointer();A.compare(l)>=0&&A.compare(a)<0&&(u=E,h--)}_===null&&(C.readU32()&f)===p&&(_=E,h--)}if(h!==0)throw new Error("Unable to determine ArtMethod field offsets");let g=u+d;n={size:c<=21?g+32:g+v,offset:{jniCode:u,quickCode:g,accessFlags:_}},"artInterpreterToCompiledCodeBridge"in e&&(n.offset.interpreterCode=u-d)}),n}function Dt(t){let e=ee();return e>=23?{size:16,offset:{accessFlags:4}}:e>=21?{size:24,offset:{accessFlags:12}}:null}function Dl(t){let e=ee(),n;return t.perform(r=>{let o=Ut(r),s=r.handle,i=null,l=null,a=null,c=null,d=null,p=null;for(let f=144;f!==256;f+=v)if(o.add(f).readPointer().equals(s)){l=f-6*v,d=f-4*v,p=f+2*v,e<=22&&(l-=v,i=l-v-9*8-3*4,a=f+6*v,d-=v,p-=v),c=f+9*v,e<=22&&(c+=2*v+4,v===8&&(c+=4)),e>=23&&(c+=v);break}if(c===null)throw new Error("Unable to determine ArtThread field offsets");n={offset:{isExceptionReportedToInstrumentation:i,exception:l,throwLocation:a,topHandleScope:c,managedStack:d,self:p}}}),n}function Ul(){return ee()>=23?{offset:{topQuickFrame:0,link:v}}:{offset:{topQuickFrame:2*v,link:0}}}var Bl={ia32:ro,x64:ro,arm:zl,arm64:Vl};function An(t,e){let n;return e.perform(r=>{let o=Ut(r),s=Bl[Process.arch],i=Instruction.parse(t),l=s(i);l!==null?n=o.add(l).readPointer():n=t}),n}function ro(t){return t.mnemonic==="jmp"?t.operands[0].value.disp:null}function zl(t){return t.mnemonic==="ldr.w"?t.operands[1].value.disp:null}function Vl(t){return t.mnemonic==="ldr"?t.operands[1].value.disp:null}function Ut(t){return t.handle.add(v).readPointer()}function Jl(){return Hn("ro.build.version.release")}function Gl(){return Hn("ro.build.version.codename")}function $l(){return parseInt(Hn("ro.build.version.sdk"),10)}function Hl(){try{let t=File.readAllText("/proc/self/mountinfo"),e=null,n=new Map;for(let o of t.trimEnd().split(`
`)){let s=o.split(" "),i=s[4];if(!i.startsWith("/apex/com.android.art"))continue;let l=s[10];i.includes("@")?n.set(l,i.split("@")[1]):e=l}let r=n.get(e);return r!==void 0?parseInt(r):oo()}catch{return oo()}}function oo(){return ee()*1e7}var Ln=null,Zl=92;function Hn(t){Ln===null&&(Ln=new NativeFunction(Process.getModuleByName("libc.so").getExportByName("__system_property_get"),"int",["pointer","pointer"],W));let e=Memory.alloc(Zl);return Ln(Memory.allocUtf8String(t),e),e.readUtf8String()}function ye(t,e,n){let r=hl(t,e),o=Ut(e).toString();if(at[o]=n,r(e.handle),at[o]!==void 0)throw delete at[o],new Error("Unable to perform state transition; please file a bug")}function ql(t,e){let n=new NativeCallback(Wl,"void",["pointer"]);return Eo(t,e,n)}function Wl(t){let e=t.toString(),n=at[e];delete at[e],n(t)}function Zn(t){let e=J(),n=e.artThreadList;e["art::ThreadList::SuspendAll"](n,Memory.allocUtf8String("frida"),!1?1:0);try{t()}finally{e["art::ThreadList::ResumeAll"](n)}}var jn=class{constructor(e){let n=Memory.alloc(4*v),r=n.add(v);n.writePointer(r);let o=new NativeCallback((s,i)=>e(i)===!0?1:0,"bool",["pointer","pointer"]);r.add(2*v).writePointer(o),this.handle=n,this._onVisit=o}};function qn(t){return J()["art::ClassLinker::VisitClasses"]instanceof NativeFunction?new jn(t):new NativeCallback(n=>t(n)===!0?1:0,"bool",["pointer","pointer"])}var On=class{constructor(e){let n=Memory.alloc(4*v),r=n.add(v);n.writePointer(r);let o=new NativeCallback((s,i)=>{e(i)},"void",["pointer","pointer"]);r.add(2*v).writePointer(o),this.handle=n,this._onVisit=o}};function Wn(t){return new On(t)}var Kl={"include-inlined-frames":0,"skip-inlined-frames":1},Rn=class{constructor(e,n,r,o=0,s=!0){let i=J(),l=512,a=3*v,c=Memory.alloc(l+a);i["art::StackVisitor::StackVisitor"](c,e,n,Kl[r],o,s?1:0);let d=c.add(l);c.writePointer(d);let p=new NativeCallback(this._visitFrame.bind(this),"bool",["pointer"]);d.add(2*v).writePointer(p),this.handle=c,this._onVisitFrame=p;let f=c.add(v===4?12:24);this._curShadowFrame=f,this._curQuickFrame=f.add(v),this._curQuickFramePc=f.add(2*v),this._curOatQuickMethodHeader=f.add(3*v),this._getMethodImpl=i["art::StackVisitor::GetMethod"],this._descLocImpl=i["art::StackVisitor::DescribeLocation"],this._getCQFIImpl=i["art::StackVisitor::GetCurrentQuickFrameInfo"]}walkStack(e=!1){J()["art::StackVisitor::WalkStack"](this.handle,e?1:0)}_visitFrame(){return this.visitFrame()?1:0}visitFrame(){throw new Error("Subclass must implement visitFrame")}getMethod(){let e=this._getMethodImpl(this.handle);return e.isNull()?null:new Mt(e)}getCurrentQuickFramePc(){return this._curQuickFramePc.readPointer()}getCurrentQuickFrame(){return this._curQuickFrame.readPointer()}getCurrentShadowFrame(){return this._curShadowFrame.readPointer()}describeLocation(){let e=new Rt;return this._descLocImpl(e,this.handle),e.disposeToString()}getCurrentOatQuickMethodHeader(){return this._curOatQuickMethodHeader.readPointer()}getCurrentQuickFrameInfo(){return this._getCQFIImpl(this.handle)}},Mt=class{constructor(e){this.handle=e}prettyMethod(e=!0){let n=new Rt;return J()["art::ArtMethod::PrettyMethod"](n,this.handle,e?1:0),n.disposeToString()}toString(){return`ArtMethod(handle=${this.handle})`}};function Ql(t){return function(e){let n=Memory.alloc(12);return _l(t)(n,e),{frameSizeInBytes:n.readU32(),coreSpillMask:n.add(4).readU32(),fpSpillMask:n.add(8).readU32()}}}function Yl(t){let e=NULL;switch(Process.arch){case"ia32":e=qe(32,n=>{n.putMovRegRegOffsetPtr("ecx","esp",4),n.putMovRegRegOffsetPtr("edx","esp",8),n.putCallAddressWithArguments(t,["ecx","edx"]),n.putMovRegReg("esp","ebp"),n.putPopReg("ebp"),n.putRet()});break;case"x64":e=qe(32,n=>{n.putPushReg("rdi"),n.putCallAddressWithArguments(t,["rsi"]),n.putPopReg("rdi"),n.putMovRegPtrReg("rdi","rax"),n.putMovRegOffsetPtrReg("rdi",8,"edx"),n.putRet()});break;case"arm":e=qe(16,n=>{n.putCallAddressWithArguments(t,["r0","r1"]),n.putPopRegs(["r0","lr"]),n.putMovRegReg("pc","lr")});break;case"arm64":e=qe(64,n=>{n.putPushRegReg("x0","lr"),n.putCallAddressWithArguments(t,["x1"]),n.putPopRegReg("x2","lr"),n.putStrRegRegOffset("x0","x2",0),n.putStrRegRegOffset("w1","x2",8),n.putRet()});break}return new NativeFunction(e,"void",["pointer","pointer"],W)}var Xl={ia32:globalThis.X86Relocator,x64:globalThis.X86Relocator,arm:globalThis.ThumbRelocator,arm64:globalThis.Arm64Relocator},Pn={ia32:globalThis.X86Writer,x64:globalThis.X86Writer,arm:globalThis.ThumbWriter,arm64:globalThis.Arm64Writer};function qe(t,e){Cn===null&&(Cn=Memory.alloc(Process.pageSize));let n=Cn.add(Qr),r=Process.arch,o=Pn[r];return Memory.patchCode(n,t,s=>{let i=new o(s,{pc:n});if(e(i),i.flush(),i.offset>t)throw new Error(`Wrote ${i.offset}, exceeding maximum of ${t}`)}),Qr+=t,r==="arm"?n.or(1):n}function ec(t,e){nc(e),ac(e)}function tc(t,e){let n=We(e).offset,r=fl().offset,o=`
#include <gum/guminterceptor.h>

extern GMutex lock;
extern GHashTable * methods;
extern GHashTable * replacements;
extern gpointer last_seen_art_method;

extern gpointer get_oat_quick_method_header_impl (gpointer method, gpointer pc);

void
init (void)
{
  g_mutex_init (&lock);
  methods = g_hash_table_new_full (NULL, NULL, NULL, NULL);
  replacements = g_hash_table_new_full (NULL, NULL, NULL, NULL);
}

void
finalize (void)
{
  g_hash_table_unref (replacements);
  g_hash_table_unref (methods);
  g_mutex_clear (&lock);
}

gboolean
is_replacement_method (gpointer method)
{
  gboolean is_replacement;

  g_mutex_lock (&lock);

  is_replacement = g_hash_table_contains (replacements, method);

  g_mutex_unlock (&lock);

  return is_replacement;
}

gpointer
get_replacement_method (gpointer original_method)
{
  gpointer replacement_method;

  g_mutex_lock (&lock);

  replacement_method = g_hash_table_lookup (methods, original_method);

  g_mutex_unlock (&lock);

  return replacement_method;
}

void
set_replacement_method (gpointer original_method,
                        gpointer replacement_method)
{
  g_mutex_lock (&lock);

  g_hash_table_insert (methods, original_method, replacement_method);
  g_hash_table_insert (replacements, replacement_method, original_method);

  g_mutex_unlock (&lock);
}

void
synchronize_replacement_methods (guint quick_code_offset,
                                 void * nterp_entrypoint,
                                 void * quick_to_interpreter_bridge)
{
  GHashTableIter iter;
  gpointer hooked_method, replacement_method;

  g_mutex_lock (&lock);

  g_hash_table_iter_init (&iter, methods);
  while (g_hash_table_iter_next (&iter, &hooked_method, &replacement_method))
  {
    void ** quick_code;

    *((uint32_t *) replacement_method) = *((uint32_t *) hooked_method);

    quick_code = hooked_method + quick_code_offset;
    if (*quick_code == nterp_entrypoint)
      *quick_code = quick_to_interpreter_bridge;
  }

  g_mutex_unlock (&lock);
}

void
delete_replacement_method (gpointer original_method)
{
  gpointer replacement_method;

  g_mutex_lock (&lock);

  replacement_method = g_hash_table_lookup (methods, original_method);
  if (replacement_method != NULL)
  {
    g_hash_table_remove (methods, original_method);
    g_hash_table_remove (replacements, replacement_method);
  }

  g_mutex_unlock (&lock);
}

gpointer
translate_method (gpointer method)
{
  gpointer translated_method;

  g_mutex_lock (&lock);

  translated_method = g_hash_table_lookup (replacements, method);

  g_mutex_unlock (&lock);

  return (translated_method != NULL) ? translated_method : method;
}

gpointer
find_replacement_method_from_quick_code (gpointer method,
                                         gpointer thread)
{
  gpointer replacement_method;
  gpointer managed_stack;
  gpointer top_quick_frame;
  gpointer link_managed_stack;
  gpointer * link_top_quick_frame;

  replacement_method = get_replacement_method (method);
  if (replacement_method == NULL)
    return NULL;

  /*
   * Stack check.
   *
   * Return NULL to indicate that the original method should be invoked, otherwise
   * return a pointer to the replacement ArtMethod.
   *
   * If the caller is our own JNI replacement stub, then a stack transition must
   * have been pushed onto the current thread's linked list.
   *
   * Therefore, we invoke the original method if the following conditions are met:
   *   1- The current managed stack is empty.
   *   2- The ArtMethod * inside the linked managed stack's top quick frame is the
   *      same as our replacement.
   */
  managed_stack = thread + ${n.managedStack};
  top_quick_frame = *((gpointer *) (managed_stack + ${r.topQuickFrame}));
  if (top_quick_frame != NULL)
    return replacement_method;

  link_managed_stack = *((gpointer *) (managed_stack + ${r.link}));
  if (link_managed_stack == NULL)
    return replacement_method;

  link_top_quick_frame = GSIZE_TO_POINTER (*((gsize *) (link_managed_stack + ${r.topQuickFrame})) & ~((gsize) 1));
  if (link_top_quick_frame == NULL || *link_top_quick_frame != replacement_method)
    return replacement_method;

  return NULL;
}

void
on_interpreter_do_call (GumInvocationContext * ic)
{
  gpointer method, replacement_method;

  method = gum_invocation_context_get_nth_argument (ic, 0);

  replacement_method = get_replacement_method (method);
  if (replacement_method != NULL)
    gum_invocation_context_replace_nth_argument (ic, 0, replacement_method);
}

gpointer
on_art_method_get_oat_quick_method_header (gpointer method,
                                           gpointer pc)
{
  if (is_replacement_method (method))
    return NULL;

  return get_oat_quick_method_header_impl (method, pc);
}

void
on_art_method_pretty_method (GumInvocationContext * ic)
{
  const guint this_arg_index = ${Process.arch==="arm64"?0:1};
  gpointer method;

  method = gum_invocation_context_get_nth_argument (ic, this_arg_index);
  if (method == NULL)
    gum_invocation_context_replace_nth_argument (ic, this_arg_index, last_seen_art_method);
  else
    last_seen_art_method = method;
}

void
on_leave_gc_concurrent_copying_copying_phase (GumInvocationContext * ic)
{
  GHashTableIter iter;
  gpointer hooked_method, replacement_method;

  g_mutex_lock (&lock);

  g_hash_table_iter_init (&iter, methods);
  while (g_hash_table_iter_next (&iter, &hooked_method, &replacement_method))
    *((uint32_t *) replacement_method) = *((uint32_t *) hooked_method);

  g_mutex_unlock (&lock);
}
`,s=8,i=v,l=v,a=v,d=Memory.alloc(s+i+l+a),p=d.add(s),f=p.add(i),u=f.add(l),_=t.find(v===4?"_ZN3art9ArtMethod23GetOatQuickMethodHeaderEj":"_ZN3art9ArtMethod23GetOatQuickMethodHeaderEm"),h=new CModule(o,{lock:d,methods:p,replacements:f,last_seen_art_method:u,get_oat_quick_method_header_impl:_??ptr("0xdeadbeef")}),g={exceptions:"propagate",scheduling:"exclusive"};return{handle:h,replacedMethods:{isReplacement:new NativeFunction(h.is_replacement_method,"bool",["pointer"],g),get:new NativeFunction(h.get_replacement_method,"pointer",["pointer"],g),set:new NativeFunction(h.set_replacement_method,"void",["pointer","pointer"],g),synchronize:new NativeFunction(h.synchronize_replacement_methods,"void",["uint","pointer","pointer"],g),delete:new NativeFunction(h.delete_replacement_method,"void",["pointer"],g),translate:new NativeFunction(h.translate_method,"pointer",["pointer"],g),findReplacementFromQuickCode:h.find_replacement_method_from_quick_code},getOatQuickMethodHeaderImpl:_,hooks:{Interpreter:{doCall:h.on_interpreter_do_call},ArtMethod:{getOatQuickMethodHeader:h.on_art_method_get_oat_quick_method_header,prettyMethod:h.on_art_method_pretty_method},Gc:{copyingPhase:{onLeave:h.on_leave_gc_concurrent_copying_copying_phase},runFlip:{onEnter:h.on_leave_gc_concurrent_copying_copying_phase}}}}}function nc(t){Xr||(Xr=!0,rc(t),oc(),sc(),ic())}function rc(t){let e=J();[e.artQuickGenericJniTrampoline,e.artQuickToInterpreterBridge,e.artQuickResolutionTrampoline].forEach(r=>{Memory.protect(r,32,"rwx");let o=new Ot(r);o.activate(t),mo.push(o)})}function oc(){let t=J(),e=ee(),{isApiLevel34OrApexEquivalent:n}=t,r;if(e<=22)r=/^_ZN3art11interpreter6DoCallILb[0-1]ELb[0-1]EEEbPNS_6mirror9ArtMethodEPNS_6ThreadERNS_11ShadowFrameEPKNS_11InstructionEtPNS_6JValueE$/;else if(e<=33&&!n)r=/^_ZN3art11interpreter6DoCallILb[0-1]ELb[0-1]EEEbPNS_9ArtMethodEPNS_6ThreadERNS_11ShadowFrameEPKNS_11InstructionEtPNS_6JValueE$/;else if(n)r=/^_ZN3art11interpreter6DoCallILb[0-1]EEEbPNS_9ArtMethodEPNS_6ThreadERNS_11ShadowFrameEPKNS_11InstructionEtbPNS_6JValueE$/;else throw new Error("Unable to find method invocation in ART; please file a bug");let o=t.module,s=[...o.enumerateExports(),...o.enumerateSymbols()].filter(i=>r.test(i.name));if(s.length===0)throw new Error("Unable to find method invocation in ART; please file a bug");for(let i of s)Interceptor.attach(i.address,oe.hooks.Interpreter.doCall)}function sc(){let t=J(),n=t.module.findSymbolByName("_ZN3art2gc4Heap22CollectGarbageInternalENS0_9collector6GcTypeENS0_7GcCauseEbj");if(n===null)return;let{artNterpEntryPoint:r,artQuickToInterpreterBridge:o}=t,s=_e(t.vm).offset.quickCode;Interceptor.attach(n,{onLeave(){oe.replacedMethods.synchronize(s,r,o)}})}function ic(){let t=[["_ZN3art11ClassLinker26VisiblyInitializedCallback22MarkVisiblyInitializedEPNS_6ThreadE","e90340f8 : ff0ff0ff"],["_ZN3art11ClassLinker26VisiblyInitializedCallback29AdjustThreadVisibilityCounterEPNS_6ThreadEl","7f0f00f9 : 1ffcffff"]],e=J(),n=e.module;for(let[r,o]of t){let s=n.findSymbolByName(r);if(s===null)continue;let i=Memory.scanSync(s,8192,o);if(i.length===0)return;let{artNterpEntryPoint:l,artQuickToInterpreterBridge:a}=e,c=_e(e.vm).offset.quickCode;Interceptor.attach(i[0].address,function(){oe.replacedMethods.synchronize(c,l,a)});return}}function ac(t){if(Yr)return;if(Yr=!0,!cc()){let{getOatQuickMethodHeaderImpl:s}=oe;if(s===null)return;try{Interceptor.replace(s,oe.hooks.ArtMethod.getOatQuickMethodHeader)}catch{}}let e=ee(),n=null,r=J();e>28?n=r.find("_ZN3art2gc9collector17ConcurrentCopying12CopyingPhaseEv"):e>22&&(n=r.find("_ZN3art2gc9collector17ConcurrentCopying12MarkingPhaseEv")),n!==null&&Interceptor.attach(n,oe.hooks.Gc.copyingPhase);let o=null;o=r.find("_ZN3art6Thread15RunFlipFunctionEPS0_"),o===null&&(o=r.find("_ZN3art6Thread15RunFlipFunctionEPS0_b")),o!==null&&Interceptor.attach(o,oe.hooks.Gc.runFlip)}var lc={arm:{signatures:[{pattern:["b0 68","01 30","0c d0","1b 98",":","c0 ff","c0 ff","00 ff","00 2f"],validateMatch:xn},{pattern:["d8 f8 08 00","01 30","0c d0","1b 98",":","f0 ff ff 0f","ff ff","00 ff","00 2f"],validateMatch:xn},{pattern:["b0 68","01 30","40 f0 c3 80","00 25",":","c0 ff","c0 ff","c0 fb 00 d0","ff f8"],validateMatch:xn}],instrument:uc},arm64:{signatures:[{pattern:["0a 40 b9","1f 05 00 31","40 01 00 54","88 39 00 f0",":","fc ff ff","1f fc ff ff","1f 00 00 ff","00 00 00 9f"],offset:1,validateMatch:Nn},{pattern:["0a 40 b9","1f 05 00 31","40 01 00 54","00 0e 40 f9",":","fc ff ff","1f fc ff ff","1f 00 00 ff","00 fc ff ff"],offset:1,validateMatch:Nn},{pattern:["0a 40 b9","1f 05 00 31","01 34 00 54","e0 03 1f aa",":","fc ff ff","1f fc ff ff","1f 00 00 ff","e0 ff ff ff"],offset:1,validateMatch:Nn}],instrument:pc}};function xn({address:t,size:e}){let n=Instruction.parse(t.or(1)),[r,o]=n.operands,s=o.value.base,i=r.value,l=Instruction.parse(n.next.add(2)),a=ptr(l.operands[0].value),c=l.address.add(l.size),d,p;return l.mnemonic==="beq"?(d=c,p=a):(d=a,p=c),ke(d.or(1),f,{limit:3});function f(u){let{mnemonic:_}=u;if(!(_==="ldr"||_==="ldr.w"))return null;let{base:h,disp:g}=u.operands[1].value;return h===s&&g===20?{methodReg:s,scratchReg:i,target:{whenTrue:a,whenRegularMethod:d,whenRuntimeMethod:p}}:null}}function Nn({address:t,size:e}){let[n,r]=Instruction.parse(t).operands,o=r.value.base,s="x"+n.value.substring(1),i=Instruction.parse(t.add(8)),l=ptr(i.operands[0].value),a=t.add(12),c,d;return i.mnemonic==="b.eq"?(c=a,d=l):(c=l,d=a),ke(c,p,{limit:3});function p(f){if(f.mnemonic!=="ldr")return null;let{base:u,disp:_}=f.operands[1].value;return u===o&&_===24?{methodReg:o,scratchReg:s,target:{whenTrue:l,whenRegularMethod:c,whenRuntimeMethod:d}}:null}}function cc(){if(ee()<31)return!1;let t=lc[Process.arch];if(t===void 0)return!1;let e=t.signatures.map(({pattern:r,offset:o=0,validateMatch:s=dc})=>({pattern:new MatchPattern(r.join("")),offset:o,validateMatch:s})),n=[];for(let{base:r,size:o}of J().module.enumerateRanges("--x"))for(let{pattern:s,offset:i,validateMatch:l}of e){let a=Memory.scanSync(r,o,s).map(({address:c,size:d})=>({address:c.sub(i),size:d+i})).filter(c=>{let d=l(c);return d===null?!1:(c.validationResult=d,!0)});n.push(...a)}return n.length===0?!1:(n.forEach(t.instrument),!0)}function dc(){return{}}var jt=class{constructor(e,n,r){this.address=e,this.size=n,this.originalCode=e.readByteArray(n),this.trampoline=r}revert(){Memory.patchCode(this.address,this.size,e=>{e.writeByteArray(this.originalCode)})}};function uc({address:t,size:e,validationResult:n}){let{methodReg:r,target:o}=n,s=Memory.alloc(Process.pageSize),i=e;Memory.patchCode(s,256,l=>{let a=new ThumbWriter(l,{pc:s}),c=new ThumbRelocator(t,a);for(let _=0;_!==2;_++)c.readOne();c.writeAll(),c.readOne(),c.skipOne(),a.putBCondLabel("eq","runtime_or_replacement_method");let d=[45,237,16,10];a.putBytes(d);let p=["r0","r1","r2","r3"];a.putPushRegs(p),a.putCallAddressWithArguments(oe.replacedMethods.isReplacement,[r]),a.putCmpRegImm("r0",0),a.putPopRegs(p);let f=[189,236,16,10];a.putBytes(f),a.putBCondLabel("ne","runtime_or_replacement_method"),a.putBLabel("regular_method"),c.readOne();let u=c.input.address.equals(o.whenRegularMethod);for(a.putLabel(u?"regular_method":"runtime_or_replacement_method"),c.writeOne();i<10;){let _=c.readOne();if(_===0){i=10;break}i=_}c.writeAll(),a.putBranchAddress(t.add(i+1)),a.putLabel(u?"runtime_or_replacement_method":"regular_method"),a.putBranchAddress(o.whenTrue),a.flush()}),Gn.push(new jt(t,i,s)),Memory.patchCode(t,i,l=>{let a=new ThumbWriter(l,{pc:t});a.putLdrRegAddress("pc",s.or(1)),a.flush()})}function pc({address:t,size:e,validationResult:n}){let{methodReg:r,scratchReg:o,target:s}=n,i=Memory.alloc(Process.pageSize);Memory.patchCode(i,256,l=>{let a=new Arm64Writer(l,{pc:i}),c=new Arm64Relocator(t,a);for(let _=0;_!==2;_++)c.readOne();c.writeAll(),c.readOne(),c.skipOne(),a.putBCondLabel("eq","runtime_or_replacement_method");let d=["d0","d1","d2","d3","d4","d5","d6","d7","x0","x1","x2","x3","x4","x5","x6","x7","x8","x9","x10","x11","x12","x13","x14","x15","x16","x17"],p=d.length;for(let _=0;_!==p;_+=2)a.putPushRegReg(d[_],d[_+1]);a.putCallAddressWithArguments(oe.replacedMethods.isReplacement,[r]),a.putCmpRegReg("x0","xzr");for(let _=p-2;_>=0;_-=2)a.putPopRegReg(d[_],d[_+1]);a.putBCondLabel("ne","runtime_or_replacement_method"),a.putBLabel("regular_method"),c.readOne();let f=c.input,u=f.address.equals(s.whenRegularMethod);a.putLabel(u?"regular_method":"runtime_or_replacement_method"),c.writeOne(),a.putBranchAddress(f.next),a.putLabel(u?"runtime_or_replacement_method":"regular_method"),a.putBranchAddress(s.whenTrue),a.flush()}),Gn.push(new jt(t,e,i)),Memory.patchCode(t,e,l=>{let a=new Arm64Writer(l,{pc:t});a.putLdrRegAddress(o,i),a.putBrReg(o),a.flush()})}function fc(t){return new _o(t)}function hc(t){return oe.replacedMethods.translate(t)}function Kn(t,e={}){let{limit:n=16}=e,r=t.getEnv();return lt===null&&(lt=_c(t,r)),lt.backtrace(r,n)}function _c(t,e){let n=J(),r=Memory.alloc(Process.pointerSize),o=new CModule(`
#include <glib.h>
#include <stdbool.h>
#include <string.h>
#include <gum/gumtls.h>
#include <json-glib/json-glib.h>

typedef struct _ArtBacktrace ArtBacktrace;
typedef struct _ArtStackFrame ArtStackFrame;

typedef struct _ArtStackVisitor ArtStackVisitor;
typedef struct _ArtStackVisitorVTable ArtStackVisitorVTable;

typedef struct _ArtClass ArtClass;
typedef struct _ArtMethod ArtMethod;
typedef struct _ArtThread ArtThread;
typedef struct _ArtContext ArtContext;

typedef struct _JNIEnv JNIEnv;

typedef struct _StdString StdString;
typedef struct _StdTinyString StdTinyString;
typedef struct _StdLargeString StdLargeString;

typedef enum {
  STACK_WALK_INCLUDE_INLINED_FRAMES,
  STACK_WALK_SKIP_INLINED_FRAMES,
} StackWalkKind;

struct _StdTinyString
{
  guint8 unused;
  gchar data[(3 * sizeof (gpointer)) - 1];
};

struct _StdLargeString
{
  gsize capacity;
  gsize size;
  gchar * data;
};

struct _StdString
{
  union
  {
    guint8 flags;
    StdTinyString tiny;
    StdLargeString large;
  };
};

struct _ArtBacktrace
{
  GChecksum * id;
  GArray * frames;
  gchar * frames_json;
};

struct _ArtStackFrame
{
  ArtMethod * method;
  gsize dexpc;
  StdString description;
};

struct _ArtStackVisitorVTable
{
  void (* unused1) (void);
  void (* unused2) (void);
  bool (* visit) (ArtStackVisitor * visitor);
};

struct _ArtStackVisitor
{
  ArtStackVisitorVTable * vtable;

  guint8 padding[512];

  ArtStackVisitorVTable vtable_storage;

  ArtBacktrace * backtrace;
};

struct _ArtMethod
{
  guint32 declaring_class;
  guint32 access_flags;
};

extern GumTlsKey current_backtrace;

extern void (* perform_art_thread_state_transition) (JNIEnv * env);

extern ArtContext * art_make_context (ArtThread * thread);

extern void art_stack_visitor_init (ArtStackVisitor * visitor, ArtThread * thread, void * context, StackWalkKind walk_kind,
    size_t num_frames, bool check_suspended);
extern void art_stack_visitor_walk_stack (ArtStackVisitor * visitor, bool include_transitions);
extern ArtMethod * art_stack_visitor_get_method (ArtStackVisitor * visitor);
extern void art_stack_visitor_describe_location (StdString * description, ArtStackVisitor * visitor);
extern ArtMethod * translate_method (ArtMethod * method);
extern void translate_location (ArtMethod * method, guint32 pc, const gchar ** source_file, gint32 * line_number);
extern void get_class_location (StdString * result, ArtClass * klass);
extern void cxx_delete (void * mem);
extern unsigned long strtoul (const char * str, char ** endptr, int base);

static bool visit_frame (ArtStackVisitor * visitor);
static void art_stack_frame_destroy (ArtStackFrame * frame);

static void append_jni_type_name (GString * s, const gchar * name, gsize length);

static void std_string_destroy (StdString * str);
static gchar * std_string_get_data (StdString * str);

void
init (void)
{
  current_backtrace = gum_tls_key_new ();
}

void
finalize (void)
{
  gum_tls_key_free (current_backtrace);
}

ArtBacktrace *
_create (JNIEnv * env,
         guint limit)
{
  ArtBacktrace * bt;

  bt = g_new (ArtBacktrace, 1);
  bt->id = g_checksum_new (G_CHECKSUM_SHA1);
  bt->frames = (limit != 0)
      ? g_array_sized_new (FALSE, FALSE, sizeof (ArtStackFrame), limit)
      : g_array_new (FALSE, FALSE, sizeof (ArtStackFrame));
  g_array_set_clear_func (bt->frames, (GDestroyNotify) art_stack_frame_destroy);
  bt->frames_json = NULL;

  gum_tls_key_set_value (current_backtrace, bt);

  perform_art_thread_state_transition (env);

  gum_tls_key_set_value (current_backtrace, NULL);

  return bt;
}

void
_on_thread_state_transition_complete (ArtThread * thread)
{
  ArtContext * context;
  ArtStackVisitor visitor = {
    .vtable_storage = {
      .visit = visit_frame,
    },
  };

  context = art_make_context (thread);

  art_stack_visitor_init (&visitor, thread, context, STACK_WALK_SKIP_INLINED_FRAMES, 0, true);
  visitor.vtable = &visitor.vtable_storage;
  visitor.backtrace = gum_tls_key_get_value (current_backtrace);

  art_stack_visitor_walk_stack (&visitor, false);

  cxx_delete (context);
}

static bool
visit_frame (ArtStackVisitor * visitor)
{
  ArtBacktrace * bt = visitor->backtrace;
  ArtStackFrame frame;
  const gchar * description, * dexpc_part;

  frame.method = art_stack_visitor_get_method (visitor);

  art_stack_visitor_describe_location (&frame.description, visitor);

  description = std_string_get_data (&frame.description);
  if (strstr (description, " '<") != NULL)
    goto skip;

  dexpc_part = strstr (description, " at dex PC 0x");
  if (dexpc_part == NULL)
    goto skip;
  frame.dexpc = strtoul (dexpc_part + 13, NULL, 16);

  g_array_append_val (bt->frames, frame);

  g_checksum_update (bt->id, (guchar *) &frame.method, sizeof (frame.method));
  g_checksum_update (bt->id, (guchar *) &frame.dexpc, sizeof (frame.dexpc));

  return true;

skip:
  std_string_destroy (&frame.description);
  return true;
}

static void
art_stack_frame_destroy (ArtStackFrame * frame)
{
  std_string_destroy (&frame->description);
}

void
_destroy (ArtBacktrace * backtrace)
{
  g_free (backtrace->frames_json);
  g_array_free (backtrace->frames, TRUE);
  g_checksum_free (backtrace->id);
  g_free (backtrace);
}

const gchar *
_get_id (ArtBacktrace * backtrace)
{
  return g_checksum_get_string (backtrace->id);
}

const gchar *
_get_frames (ArtBacktrace * backtrace)
{
  GArray * frames = backtrace->frames;
  JsonBuilder * b;
  guint i;
  JsonNode * root;

  if (backtrace->frames_json != NULL)
    return backtrace->frames_json;

  b = json_builder_new_immutable ();

  json_builder_begin_array (b);

  for (i = 0; i != frames->len; i++)
  {
    ArtStackFrame * frame = &g_array_index (frames, ArtStackFrame, i);
    gchar * description, * ret_type, * paren_open, * paren_close, * arg_types, * token, * method_name, * class_name;
    GString * signature;
    gchar * cursor;
    ArtMethod * translated_method;
    StdString location;
    gsize dexpc;
    const gchar * source_file;
    gint32 line_number;

    description = std_string_get_data (&frame->description);

    ret_type = strchr (description, '\\'') + 1;

    paren_open = strchr (ret_type, '(');
    paren_close = strchr (paren_open, ')');
    *paren_open = '\\0';
    *paren_close = '\\0';

    arg_types = paren_open + 1;

    token = strrchr (ret_type, '.');
    *token = '\\0';

    method_name = token + 1;

    token = strrchr (ret_type, ' ');
    *token = '\\0';

    class_name = token + 1;

    signature = g_string_sized_new (128);

    append_jni_type_name (signature, class_name, method_name - class_name - 1);
    g_string_append_c (signature, ',');
    g_string_append (signature, method_name);
    g_string_append (signature, ",(");

    if (arg_types != paren_close)
    {
      for (cursor = arg_types; cursor != NULL;)
      {
        gsize length;
        gchar * next;

        token = strstr (cursor, ", ");
        if (token != NULL)
        {
          length = token - cursor;
          next = token + 2;
        }
        else
        {
          length = paren_close - cursor;
          next = NULL;
        }

        append_jni_type_name (signature, cursor, length);

        cursor = next;
      }
    }

    g_string_append_c (signature, ')');

    append_jni_type_name (signature, ret_type, class_name - ret_type - 1);

    translated_method = translate_method (frame->method);
    dexpc = (translated_method == frame->method) ? frame->dexpc : 0;

    get_class_location (&location, GSIZE_TO_POINTER (translated_method->declaring_class));

    translate_location (translated_method, dexpc, &source_file, &line_number);

    json_builder_begin_object (b);

    json_builder_set_member_name (b, "signature");
    json_builder_add_string_value (b, signature->str);

    json_builder_set_member_name (b, "origin");
    json_builder_add_string_value (b, std_string_get_data (&location));

    json_builder_set_member_name (b, "className");
    json_builder_add_string_value (b, class_name);

    json_builder_set_member_name (b, "methodName");
    json_builder_add_string_value (b, method_name);

    json_builder_set_member_name (b, "methodFlags");
    json_builder_add_int_value (b, translated_method->access_flags);

    json_builder_set_member_name (b, "fileName");
    json_builder_add_string_value (b, source_file);

    json_builder_set_member_name (b, "lineNumber");
    json_builder_add_int_value (b, line_number);

    json_builder_end_object (b);

    std_string_destroy (&location);
    g_string_free (signature, TRUE);
  }

  json_builder_end_array (b);

  root = json_builder_get_root (b);
  backtrace->frames_json = json_to_string (root, FALSE);
  json_node_unref (root);

  return backtrace->frames_json;
}

static void
append_jni_type_name (GString * s,
                      const gchar * name,
                      gsize length)
{
  gchar shorty = '\\0';
  gsize i;

  switch (name[0])
  {
    case 'b':
      if (strncmp (name, "boolean", length) == 0)
        shorty = 'Z';
      else if (strncmp (name, "byte", length) == 0)
        shorty = 'B';
      break;
    case 'c':
      if (strncmp (name, "char", length) == 0)
        shorty = 'C';
      break;
    case 'd':
      if (strncmp (name, "double", length) == 0)
        shorty = 'D';
      break;
    case 'f':
      if (strncmp (name, "float", length) == 0)
        shorty = 'F';
      break;
    case 'i':
      if (strncmp (name, "int", length) == 0)
        shorty = 'I';
      break;
    case 'l':
      if (strncmp (name, "long", length) == 0)
        shorty = 'J';
      break;
    case 's':
      if (strncmp (name, "short", length) == 0)
        shorty = 'S';
      break;
    case 'v':
      if (strncmp (name, "void", length) == 0)
        shorty = 'V';
      break;
  }

  if (shorty != '\\0')
  {
    g_string_append_c (s, shorty);

    return;
  }

  if (length > 2 && name[length - 2] == '[' && name[length - 1] == ']')
  {
    g_string_append_c (s, '[');
    append_jni_type_name (s, name, length - 2);

    return;
  }

  g_string_append_c (s, 'L');

  for (i = 0; i != length; i++)
  {
    gchar ch = name[i];
    if (ch != '.')
      g_string_append_c (s, ch);
    else
      g_string_append_c (s, '/');
  }

  g_string_append_c (s, ';');
}

static void
std_string_destroy (StdString * str)
{
  bool is_large = (str->flags & 1) != 0;
  if (is_large)
    cxx_delete (str->large.data);
}

static gchar *
std_string_get_data (StdString * str)
{
  bool is_large = (str->flags & 1) != 0;
  return is_large ? str->large.data : str->tiny.data;
}
`,{current_backtrace:Memory.alloc(Process.pointerSize),perform_art_thread_state_transition:r,art_make_context:n["art::Thread::GetLongJumpContext"]??n["art::Context::Create"],art_stack_visitor_init:n["art::StackVisitor::StackVisitor"],art_stack_visitor_walk_stack:n["art::StackVisitor::WalkStack"],art_stack_visitor_get_method:n["art::StackVisitor::GetMethod"],art_stack_visitor_describe_location:n["art::StackVisitor::DescribeLocation"],translate_method:oe.replacedMethods.translate,translate_location:n["art::Monitor::TranslateLocation"],get_class_location:n["art::mirror::Class::GetLocation"],cxx_delete:n.$delete,strtoul:Process.getModuleByName("libc.so").getExportByName("strtoul")}),s=new NativeFunction(o._create,"pointer",["pointer","uint"],W),i=new NativeFunction(o._destroy,"void",["pointer"],W),l={exceptions:"propagate",scheduling:"exclusive"},a=new NativeFunction(o._get_id,"pointer",["pointer"],l),c=new NativeFunction(o._get_frames,"pointer",["pointer"],l),d=Eo(t,e,o._on_thread_state_transition_complete);o._performData=d,r.writePointer(d),o.backtrace=(f,u)=>{let _=s(f,u),h=new Fn(_);return Script.bindWeak(h,p.bind(null,_)),h};function p(f){i(f)}return o.getId=f=>a(f).readUtf8String(),o.getFrames=f=>JSON.parse(c(f).readUtf8String()),o}var Fn=class{constructor(e){this.handle=e}get id(){return lt.getId(this.handle)}get frames(){return lt.getFrames(this.handle)}};function Qn(){kt.forEach(t=>{t.vtablePtr.writePointer(t.vtable),t.vtableCountPtr.writeS32(t.vtableCount)}),kt.clear();for(let t of mo.splice(0))t.deactivate();for(let t of Gn.splice(0))t.revert()}function Yn(t){return bo(t,"art::jni::JniIdManager::DecodeMethodId")}function so(t){return bo(t,"art::jni::JniIdManager::DecodeFieldId")}function bo(t,e){let n=J(),r=fo(n).offset,o=r.jniIdManager,s=r.jniIdsIndirection;if(o!==null&&s!==null){let i=n.artRuntime;if(i.add(s).readInt()!==za){let a=i.add(o).readPointer();return n[e](a,t)}}return t}var mc={ia32:gc,x64:bc,arm:yc,arm64:Ec};function gc(t,e,n,r,o){let s=We(o).offset,i=_e(o).offset,l;return Memory.patchCode(t,128,a=>{let c=new X86Writer(a,{pc:t}),d=new X86Relocator(e,c),p=[15,174,4,36],f=[15,174,12,36];c.putPushax(),c.putMovRegReg("ebp","esp"),c.putAndRegU32("esp",4294967280),c.putSubRegImm("esp",512),c.putBytes(p),c.putMovRegFsU32Ptr("ebx",s.self),c.putCallAddressWithAlignedArguments(oe.replacedMethods.findReplacementFromQuickCode,["eax","ebx"]),c.putTestRegReg("eax","eax"),c.putJccShortLabel("je","restore_registers","no-hint"),c.putMovRegOffsetPtrReg("ebp",7*4,"eax"),c.putLabel("restore_registers"),c.putBytes(f),c.putMovRegReg("esp","ebp"),c.putPopax(),c.putJccShortLabel("jne","invoke_replacement","no-hint");do l=d.readOne();while(l<n&&!d.eoi);d.writeAll(),d.eoi||c.putJmpAddress(e.add(l)),c.putLabel("invoke_replacement"),c.putJmpRegOffsetPtr("eax",i.quickCode),c.flush()}),l}function bc(t,e,n,r,o){let s=We(o).offset,i=_e(o).offset,l;return Memory.patchCode(t,256,a=>{let c=new X86Writer(a,{pc:t}),d=new X86Relocator(e,c),p=[15,174,4,36],f=[15,174,12,36];c.putPushax(),c.putMovRegReg("rbp","rsp"),c.putAndRegU32("rsp",4294967280),c.putSubRegImm("rsp",512),c.putBytes(p),c.putMovRegGsU32Ptr("rbx",s.self),c.putCallAddressWithAlignedArguments(oe.replacedMethods.findReplacementFromQuickCode,["rdi","rbx"]),c.putTestRegReg("rax","rax"),c.putJccShortLabel("je","restore_registers","no-hint"),c.putMovRegOffsetPtrReg("rbp",8*8,"rax"),c.putLabel("restore_registers"),c.putBytes(f),c.putMovRegReg("rsp","rbp"),c.putPopax(),c.putJccShortLabel("jne","invoke_replacement","no-hint");do l=d.readOne();while(l<n&&!d.eoi);d.writeAll(),d.eoi||c.putJmpAddress(e.add(l)),c.putLabel("invoke_replacement"),c.putJmpRegOffsetPtr("rdi",i.quickCode),c.flush()}),l}function yc(t,e,n,r,o){let s=_e(o).offset,i=e.and(Vn),l;return Memory.patchCode(t,128,a=>{let c=new ThumbWriter(a,{pc:t}),d=new ThumbRelocator(i,c),p=[45,237,16,10],f=[189,236,16,10];c.putPushRegs(["r1","r2","r3","r5","r6","r7","r8","r10","r11","lr"]),c.putBytes(p),c.putSubRegRegImm("sp","sp",8),c.putStrRegRegOffset("r0","sp",0),c.putCallAddressWithArguments(oe.replacedMethods.findReplacementFromQuickCode,["r0","r9"]),c.putCmpRegImm("r0",0),c.putBCondLabel("eq","restore_registers"),c.putStrRegRegOffset("r0","sp",0),c.putLabel("restore_registers"),c.putLdrRegRegOffset("r0","sp",0),c.putAddRegRegImm("sp","sp",8),c.putBytes(f),c.putPopRegs(["lr","r11","r10","r8","r7","r6","r5","r3","r2","r1"]),c.putBCondLabel("ne","invoke_replacement");do l=d.readOne();while(l<n&&!d.eoi);d.writeAll(),d.eoi||c.putLdrRegAddress("pc",e.add(l)),c.putLabel("invoke_replacement"),c.putLdrRegRegOffset("pc","r0",s.quickCode),c.flush()}),l}function Ec(t,e,n,{availableScratchRegs:r},o){let s=_e(o).offset,i;return Memory.patchCode(t,256,l=>{let a=new Arm64Writer(l,{pc:t}),c=new Arm64Relocator(e,a);a.putPushRegReg("d0","d1"),a.putPushRegReg("d2","d3"),a.putPushRegReg("d4","d5"),a.putPushRegReg("d6","d7"),a.putPushRegReg("x1","x2"),a.putPushRegReg("x3","x4"),a.putPushRegReg("x5","x6"),a.putPushRegReg("x7","x20"),a.putPushRegReg("x21","x22"),a.putPushRegReg("x23","x24"),a.putPushRegReg("x25","x26"),a.putPushRegReg("x27","x28"),a.putPushRegReg("x29","lr"),a.putSubRegRegImm("sp","sp",16),a.putStrRegRegOffset("x0","sp",0),a.putCallAddressWithArguments(oe.replacedMethods.findReplacementFromQuickCode,["x0","x19"]),a.putCmpRegReg("x0","xzr"),a.putBCondLabel("eq","restore_registers"),a.putStrRegRegOffset("x0","sp",0),a.putLabel("restore_registers"),a.putLdrRegRegOffset("x0","sp",0),a.putAddRegRegImm("sp","sp",16),a.putPopRegReg("x29","lr"),a.putPopRegReg("x27","x28"),a.putPopRegReg("x25","x26"),a.putPopRegReg("x23","x24"),a.putPopRegReg("x21","x22"),a.putPopRegReg("x7","x20"),a.putPopRegReg("x5","x6"),a.putPopRegReg("x3","x4"),a.putPopRegReg("x1","x2"),a.putPopRegReg("d6","d7"),a.putPopRegReg("d4","d5"),a.putPopRegReg("d2","d3"),a.putPopRegReg("d0","d1"),a.putBCondLabel("ne","invoke_replacement");do i=c.readOne();while(i<n&&!c.eoi);if(c.writeAll(),!c.eoi){let d=Array.from(r)[0];a.putLdrRegAddress(d,e.add(i)),a.putBrReg(d)}a.putLabel("invoke_replacement"),a.putLdrRegRegOffset("x16","x0",s.quickCode),a.putBrReg("x16"),a.flush()}),i}var vc={ia32:io,x64:io,arm:Sc,arm64:wc};function io(t,e,n){Memory.patchCode(t,16,r=>{let o=new X86Writer(r,{pc:t});o.putJmpAddress(e),o.flush()})}function Sc(t,e,n){let r=t.and(Vn);Memory.patchCode(r,16,o=>{let s=new ThumbWriter(o,{pc:r});s.putLdrRegAddress("pc",e.or(1)),s.flush()})}function wc(t,e,n){Memory.patchCode(t,16,r=>{let o=new Arm64Writer(r,{pc:t});n===16?o.putLdrRegAddress("x16",e):o.putAdrpRegAddress("x16",e),o.putBrReg("x16"),o.flush()})}var Ic={ia32:5,x64:16,arm:8,arm64:16},Ot=class{constructor(e){this.quickCode=e,this.quickCodeAddress=Process.arch==="arm"?e.and(Vn):e,this.redirectSize=0,this.trampoline=null,this.overwrittenPrologue=null,this.overwrittenPrologueLength=0}_canRelocateCode(e,n){let r=Pn[Process.arch],o=Xl[Process.arch],{quickCodeAddress:s}=this,i=new r(s),l=new o(s,i),a;if(Process.arch==="arm64"){let c=new Set(["x16","x17"]);do{let d=l.readOne(),p=new Set(c),{read:f,written:u}=l.input.regsAccessed;for(let _ of[f,u])for(let h of _){let g;h.startsWith("w")?g="x"+h.substring(1):g=h,p.delete(g)}if(p.size===0)break;a=d,c=p}while(a<e&&!l.eoi);n.availableScratchRegs=c}else do a=l.readOne();while(a<e&&!l.eoi);return a>=e}_allocateTrampoline(){At===null&&(At=on(v===4?128:256));let e=Ic[Process.arch],n,r,o=1,s={};if(v===4||this._canRelocateCode(e,s))n=e,r={};else{let i;Process.arch==="x64"?(n=5,i=Va):Process.arch==="arm64"&&(n=8,i=Ja,o=4096),r={near:this.quickCodeAddress,maxDistance:i}}return this.redirectSize=n,this.trampoline=At.allocateSlice(r,o),s}_destroyTrampoline(){At.freeSlice(this.trampoline)}activate(e){let n=this._allocateTrampoline(),{trampoline:r,quickCode:o,redirectSize:s}=this,i=mc[Process.arch],l=i(r,o,s,n,e);this.overwrittenPrologueLength=l,this.overwrittenPrologue=Memory.dup(this.quickCodeAddress,l);let a=vc[Process.arch];a(o,r,s)}deactivate(){let{quickCodeAddress:e,overwrittenPrologueLength:n}=this,r=Pn[Process.arch];Memory.patchCode(e,n,o=>{let s=new r(o,{pc:e}),{overwrittenPrologue:i}=this;s.putBytes(i.readByteArray(n)),s.flush()}),this._destroyTrampoline()}};function Cc(t){let e=J(),{module:n,artClassLinker:r}=e;return t.equals(r.quickGenericJniTrampoline)||t.equals(r.quickToInterpreterBridgeTrampoline)||t.equals(r.quickResolutionTrampoline)||t.equals(r.quickImtConflictTrampoline)||t.compare(n.base)>=0&&t.compare(n.base.add(n.size))<0}var Dn=class{constructor(e){let n=Yn(e);this.methodId=n,this.originalMethod=null,this.hookedMethodId=n,this.replacementMethodId=null,this.interceptor=null}replace(e,n,r,o,s){let{kAccCompileDontBother:i,artNterpEntryPoint:l}=s;this.originalMethod=ao(this.methodId,o);let a=this.originalMethod.accessFlags;if((a&Ba)!==0&&Tc()){let u=this.originalMethod.jniCode;this.hookedMethodId=u.add(2*v).readPointer(),this.originalMethod=ao(this.hookedMethodId,o)}let{hookedMethodId:c}=this,d=Lc(c,o);this.replacementMethodId=d,Lt(d,{jniCode:e,accessFlags:(a&~(Ra|Oa|qr)|Nt|i)>>>0,quickCode:s.artClassLinker.quickGenericJniTrampoline,interpreterCode:s.artInterpreterToCompiledCodeBridge},o);let p=uo|Fa|qr;(a&Nt)===0&&(p|=Pa),Lt(c,{accessFlags:(a&~p|i)>>>0},o);let f=this.originalMethod.quickCode;if(l!==null&&f.equals(l)&&Lt(c,{quickCode:s.artQuickToInterpreterBridge},o),!Cc(f)){let u=new Ot(f);u.activate(o),this.interceptor=u}oe.replacedMethods.set(c,d),ec(c,o)}revert(e){let{hookedMethodId:n,interceptor:r}=this;Lt(n,this.originalMethod,e),oe.replacedMethods.delete(n),r!==null&&(r.deactivate(),this.interceptor=null)}resolveTarget(e,n,r,o){return this.hookedMethodId}};function Tc(){return ee()<28}function ao(t,e){let r=_e(e).offset;return["jniCode","accessFlags","quickCode","interpreterCode"].reduce((o,s)=>{let i=r[s];if(i===void 0)return o;let l=t.add(i),a=s==="accessFlags"?Aa:La;return o[s]=a.call(l),o},{})}function Lt(t,e,n){let o=_e(n).offset;Object.keys(e).forEach(s=>{let i=o[s];if(i===void 0)return;let l=t.add(i);(s==="accessFlags"?xa:Na).call(l,e[s])})}var Un=class{constructor(e){this.methodId=e,this.originalMethod=null}replace(e,n,r,o,s){let{methodId:i}=this;this.originalMethod=Memory.dup(i,Sn);let l=r.reduce((f,u)=>f+u.size,0);n&&l++;let a=(i.add(Wr).readU32()|Nt)>>>0,c=l,d=0,p=l;i.add(Wr).writeU32(a),i.add(Wa).writeU16(c),i.add(Ka).writeU16(d),i.add(Qa).writeU16(p),i.add(Xa).writeU32(Ac(i)),s.dvmUseJNIBridge(i,e)}revert(e){Memory.copy(this.methodId,this.originalMethod,Sn)}resolveTarget(e,n,r,o){let s=r.handle.add(po).readPointer(),i;if(n)i=o.dvmDecodeIndirectRef(s,e.$h);else{let f=e.$borrowClassHandle(r);i=o.dvmDecodeIndirectRef(s,f.value),f.unref(r)}let l;n?l=i.add(Za).readPointer():l=i;let a=l.toString(16),c=kt.get(a);if(c===void 0){let f=l.add(Ha),u=l.add($a),_=f.readPointer(),h=u.readS32(),g=h*v,b=Memory.alloc(2*g);Memory.copy(b,_,g),f.writePointer(b),c={classObject:l,vtablePtr:f,vtableCountPtr:u,vtable:_,vtableCount:h,shadowVtable:b,shadowVtableCount:h,targetMethods:new Map},kt.set(a,c)}let d=this.methodId.toString(16),p=c.targetMethods.get(d);if(p===void 0){p=Memory.dup(this.originalMethod,Sn);let f=c.shadowVtableCount++;c.shadowVtable.add(f*v).writePointer(p),p.add(qa).writeU16(f),c.vtableCountPtr.writeS32(c.shadowVtableCount),c.targetMethods.set(d,p)}return p}};function Ac(t){if(Process.arch!=="ia32")return Kr;let e=t.add(Ya).readPointer().readCString();if(e===null||e.length===0||e.length>65535)return Kr;let n;switch(e[0]){case"V":n=el;break;case"F":n=tl;break;case"D":n=nl;break;case"J":n=rl;break;case"Z":case"B":n=al;break;case"C":n=il;break;case"S":n=sl;break;default:n=ol;break}let r=0;for(let o=e.length-1;o>0;o--){let s=e[o];r+=s==="D"||s==="J"?2:1}return n<<ll|r}function Lc(t,e){let n=J();if(ee()<23){let r=n["art::Thread::CurrentFromGdb"]();return n["art::mirror::Object::Clone"](t,r)}return Memory.dup(t,_e(e).size)}function Xn(t,e,n){yo(t,e,Mn,n)}function er(t,e){yo(t,e,kn)}function tr(t,e){let n=J();if(ee()<26)throw new Error("This API is only available on Android >= 8.0");ye(t,e,r=>{n["art::Runtime::DeoptimizeBootImage"](n.artRuntime)})}function yo(t,e,n,r){let o=J();if(ee()<24)throw new Error("This API is only available on Android >= 7.0");ye(t,e,s=>{if(ee()<30){if(!o.isJdwpStarted()){let l=xc(o);gl.push(l)}o.isDebuggerActive()||o["art::Dbg::GoActive"]();let i=Memory.alloc(8+v);switch(i.writeU32(n),n){case kn:break;case Mn:i.add(8).writePointer(r);break;default:throw new Error("Unsupported deoptimization kind")}o["art::Dbg::RequestDeoptimization"](i),o["art::Dbg::ManageDeoptimization"]()}else{let i=o.artInstrumentation;if(i===null)throw new Error("Unable to find Instrumentation class in ART; please file a bug");let l=o["art::Instrumentation::EnableDeoptimization"];switch(l!==void 0&&(i.add(pl().offset.deoptimizationEnabled).readU8()||l(i)),n){case kn:o["art::Instrumentation::DeoptimizeEverything"](i,Memory.allocUtf8String("frida"));break;case Mn:o["art::Instrumentation::Deoptimize"](i,r);break;default:throw new Error("Unsupported deoptimization kind")}}})}var Bn=class{constructor(){let e=Process.getModuleByName("libart.so"),n=e.getExportByName("_ZN3art4JDWP12JdwpAdbState6AcceptEv"),r=e.getExportByName("_ZN3art4JDWP12JdwpAdbState15ReceiveClientFdEv"),o=lo(),s=lo();this._controlFd=o[0],this._clientFd=s[0];let i=null;i=Interceptor.attach(n,function(l){let a=l[0];Memory.scanSync(a.add(8252),256,"00 ff ff ff ff 00")[0].address.add(1).writeS32(o[1]),i.detach()}),Interceptor.replace(r,new NativeCallback(function(l){return Interceptor.revert(r),s[1]},"int",["pointer"])),Interceptor.flush(),this._handshakeRequest=this._performHandshake()}async _performHandshake(){let e=new UnixInputStream(this._clientFd,{autoClose:!1}),n=new UnixOutputStream(this._clientFd,{autoClose:!1}),r=[74,68,87,80,45,72,97,110,100,115,104,97,107,101];try{await n.writeAll(r),await e.readAll(r.length)}catch{}}};function xc(t){let e=new Bn;t["art::Dbg::SetJdwpAllowed"](1);let n=Nc();t["art::Dbg::ConfigureJdwp"](n);let r=t["art::InternalDebuggerControlCallback::StartDebugger"];return r!==void 0?r(NULL):t["art::Dbg::StartJdwp"](),e}function Nc(){let t=ee()<28?2:3,e=0,n=t,r=!0,o=!1,s=e,i=8+dt+2,l=Memory.alloc(i);return l.writeU32(n).add(4).writeU8(r?1:0).add(1).writeU8(o?1:0).add(1).add(dt).writeU16(s),l}function lo(){Tn===null&&(Tn=new NativeFunction(Process.getModuleByName("libc.so").getExportByName("socketpair"),"int",["int","int","int","pointer"]));let t=Memory.alloc(8);if(Tn(dl,ul,0,t)===-1)throw new Error("Unable to create socketpair for JDWP");return[t.readS32(),t.add(4).readS32()]}function kc(t){let e=vl().offset,n=t.vm.add(e.globalsLock),r=t.vm.add(e.globals),o=t["art::IndirectReferenceTable::Add"],s=t["art::ReaderWriterMutex::ExclusiveLock"],i=t["art::ReaderWriterMutex::ExclusiveUnlock"],l=0;return function(a,c,d){s(n,c);try{return o(r,l,d)}finally{i(n,c)}}}function Mc(t){let e=t["art::Thread::DecodeJObject"];if(e===void 0)throw new Error("art::Thread::DecodeJObject is not available; please file a bug");return function(n,r,o){return e(r,o)}}var jc={ia32:co,x64:co,arm:Oc,arm64:Rc};function Eo(t,e,n){let r=J(),o=e.handle.readPointer(),s,i=r.find("_ZN3art3JNIILb1EE14ExceptionClearEP7_JNIEnv");i!==null?s=i:s=o.add(Ft).readPointer();let l,a=r.find("_ZN3art3JNIILb1EE10FatalErrorEP7_JNIEnvPKc");a!==null?l=a:l=o.add(Ga).readPointer();let c=jc[Process.arch];if(c===void 0)throw new Error("Not yet implemented for "+Process.arch);let d=null,p=We(t).offset,f=p.exception,u=new Set,_=p.isExceptionReportedToInstrumentation;_!==null&&u.add(_);let h=p.throwLocation;h!==null&&(u.add(h),u.add(h+v),u.add(h+2*v));let g=65536,b=Memory.alloc(g);return Memory.patchCode(b,g,E=>{d=c(E,b,s,l,f,u,n)}),d._code=b,d._callback=n,d}function co(t,e,n,r,o,s,i){let l={},a=new Set,c=[n];for(;c.length>0;){let h=c.shift();if(Object.values(l).some(({begin:M,end:O})=>h.compare(M)>=0&&h.compare(O)<0))continue;let b=h.toString(),E={begin:h},C=null,A=!1;do{if(h.equals(r)){A=!0;break}let M=Instruction.parse(h);C=M;let O=l[M.address.toString()];if(O!==void 0){delete l[O.begin.toString()],l[b]=O,O.begin=E.begin,E=null;break}let k=null;switch(M.mnemonic){case"jmp":k=ptr(M.operands[0].value),A=!0;break;case"je":case"jg":case"jle":case"jne":case"js":k=ptr(M.operands[0].value);break;case"ret":A=!0;break}k!==null&&(a.add(k.toString()),c.push(k),c.sort((N,S)=>N.compare(S))),h=M.next}while(!A);E!==null&&(E.end=C.address.add(C.size),l[b]=E)}let d=Object.keys(l).map(h=>l[h]);d.sort((h,g)=>h.begin.compare(g.begin));let p=l[n.toString()];d.splice(d.indexOf(p),1),d.unshift(p);let f=new X86Writer(t,{pc:e}),u=!1,_=null;return d.forEach(h=>{let g=h.end.sub(h.begin).toInt32(),b=new X86Relocator(h.begin,f),E;for(;(E=b.readOne())!==0;){let C=b.input,{mnemonic:A}=C,M=C.address.toString();a.has(M)&&f.putLabel(M);let O=!0;switch(A){case"jmp":f.putJmpNearLabel(fe(C.operands[0])),O=!1;break;case"je":case"jg":case"jle":case"jne":case"js":f.putJccNearLabel(A,fe(C.operands[0]),"no-hint"),O=!1;break;case"mov":{let[k,N]=C.operands;if(k.type==="mem"&&N.type==="imm"){let S=k.value,L=S.disp;if(L===o&&N.value.valueOf()===0){if(_=S.base,f.putPushfx(),f.putPushax(),f.putMovRegReg("xbp","xsp"),v===4)f.putAndRegU32("esp",4294967280);else{let j=_!=="rdi"?"rdi":"rsi";f.putMovRegU64(j,uint64("0xfffffffffffffff0")),f.putAndRegReg("rsp",j)}f.putCallAddressWithAlignedArguments(i,[_]),f.putMovRegReg("xsp","xbp"),f.putPopax(),f.putPopfx(),u=!0,O=!1}else s.has(L)&&S.base===_&&(O=!1)}break}case"call":{let k=C.operands[0];k.type==="mem"&&k.value.disp===Ft&&(v===4?(f.putPopReg("eax"),f.putMovRegRegOffsetPtr("eax","eax",4),f.putPushReg("eax")):f.putMovRegRegOffsetPtr("rdi","rdi",8),f.putCallAddressWithArguments(i,[]),u=!0,O=!1);break}}if(O?b.writeAll():b.skipOne(),E===g)break}b.dispose()}),f.dispose(),u||nr(),new NativeFunction(e,"void",["pointer"],W)}function Oc(t,e,n,r,o,s,i){let l={},a=new Set,c=ptr(1).not(),d=[n];for(;d.length>0;){let b=d.shift();if(Object.values(l).some(({begin:L,end:j})=>b.compare(L)>=0&&b.compare(j)<0))continue;let C=b.and(c),A=C.toString(),M=b.and(1),O={begin:C},k=null,N=!1,S=0;do{if(b.equals(r)){N=!0;break}let L=Instruction.parse(b),{mnemonic:j}=L;k=L;let R=b.and(c).toString(),D=l[R];if(D!==void 0){delete l[D.begin.toString()],l[A]=D,D.begin=O.begin,O=null;break}let U=S===0,F=null;switch(j){case"b":F=ptr(L.operands[0].value),N=U;break;case"beq.w":case"beq":case"bne":case"bne.w":case"bgt":F=ptr(L.operands[0].value);break;case"cbz":case"cbnz":F=ptr(L.operands[1].value);break;case"pop.w":U&&(N=L.operands.filter(z=>z.value==="pc").length===1);break}switch(j){case"it":S=1;break;case"itt":S=2;break;case"ittt":S=3;break;case"itttt":S=4;break;default:S>0&&S--;break}F!==null&&(a.add(F.toString()),d.push(F.or(M)),d.sort((z,X)=>z.compare(X))),b=L.next}while(!N);O!==null&&(O.end=k.address.add(k.size),l[A]=O)}let p=Object.keys(l).map(b=>l[b]);p.sort((b,E)=>b.begin.compare(E.begin));let f=l[n.and(c).toString()];p.splice(p.indexOf(f),1),p.unshift(f);let u=new ThumbWriter(t,{pc:e}),_=!1,h=null,g=null;return p.forEach(b=>{let E=new ThumbRelocator(b.begin,u),C=b.begin,A=b.end,M=0;do{if(E.readOne()===0)throw new Error("Unexpected end of block");let k=E.input;C=k.address,M=k.size;let{mnemonic:N}=k,S=C.toString();a.has(S)&&u.putLabel(S);let L=!0;switch(N){case"b":u.putBLabel(fe(k.operands[0])),L=!1;break;case"beq.w":u.putBCondLabelWide("eq",fe(k.operands[0])),L=!1;break;case"bne.w":u.putBCondLabelWide("ne",fe(k.operands[0])),L=!1;break;case"beq":case"bne":case"bgt":u.putBCondLabelWide(N.substr(1),fe(k.operands[0])),L=!1;break;case"cbz":{let j=k.operands;u.putCbzRegLabel(j[0].value,fe(j[1])),L=!1;break}case"cbnz":{let j=k.operands;u.putCbnzRegLabel(j[0].value,fe(j[1])),L=!1;break}case"str":case"str.w":{let j=k.operands[1].value,w=j.disp;if(w===o){h=j.base;let R=h!=="r4"?"r4":"r5",D=["r0","r1","r2","r3",R,"r9","r12","lr"];u.putPushRegs(D),u.putMrsRegReg(R,"apsr-nzcvq"),u.putCallAddressWithArguments(i,[h]),u.putMsrRegReg("apsr-nzcvq",R),u.putPopRegs(D),_=!0,L=!1}else s.has(w)&&j.base===h&&(L=!1);break}case"ldr":{let[j,w]=k.operands;if(w.type==="mem"){let R=w.value;R.base[0]==="r"&&R.disp===Ft&&(g=j.value)}break}case"blx":k.operands[0].value===g&&(u.putLdrRegRegOffset("r0","r0",4),u.putCallAddressWithArguments(i,["r0"]),_=!0,g=null,L=!1);break}L?E.writeAll():E.skipOne()}while(!C.add(M).equals(A));E.dispose()}),u.dispose(),_||nr(),new NativeFunction(e.or(1),"void",["pointer"],W)}function Rc(t,e,n,r,o,s,i){let l={},a=new Set,c=[n];for(;c.length>0;){let b=c.shift();if(Object.values(l).some(({begin:k,end:N})=>b.compare(k)>=0&&b.compare(N)<0))continue;let C=b.toString(),A={begin:b},M=null,O=!1;do{if(b.equals(r)){O=!0;break}let k;try{k=Instruction.parse(b)}catch(L){if(b.readU32()===0){O=!0;break}else throw L}M=k;let N=l[k.address.toString()];if(N!==void 0){delete l[N.begin.toString()],l[C]=N,N.begin=A.begin,A=null;break}let S=null;switch(k.mnemonic){case"b":S=ptr(k.operands[0].value),O=!0;break;case"b.eq":case"b.ne":case"b.le":case"b.gt":S=ptr(k.operands[0].value);break;case"cbz":case"cbnz":S=ptr(k.operands[1].value);break;case"tbz":case"tbnz":S=ptr(k.operands[2].value);break;case"ret":O=!0;break}S!==null&&(a.add(S.toString()),c.push(S),c.sort((L,j)=>L.compare(j))),b=k.next}while(!O);A!==null&&(A.end=M.address.add(M.size),l[C]=A)}let d=Object.keys(l).map(b=>l[b]);d.sort((b,E)=>b.begin.compare(E.begin));let p=l[n.toString()];d.splice(d.indexOf(p),1),d.unshift(p);let f=new Arm64Writer(t,{pc:e});f.putBLabel("performTransition");let u=e.add(f.offset);f.putPushAllXRegisters(),f.putCallAddressWithArguments(i,["x0"]),f.putPopAllXRegisters(),f.putRet(),f.putLabel("performTransition");let _=!1,h=null,g=null;return d.forEach(b=>{let E=b.end.sub(b.begin).toInt32(),C=new Arm64Relocator(b.begin,f),A;for(;(A=C.readOne())!==0;){let M=C.input,{mnemonic:O}=M,k=M.address.toString();a.has(k)&&f.putLabel(k);let N=!0;switch(O){case"b":f.putBLabel(fe(M.operands[0])),N=!1;break;case"b.eq":case"b.ne":case"b.le":case"b.gt":f.putBCondLabel(O.substr(2),fe(M.operands[0])),N=!1;break;case"cbz":{let S=M.operands;f.putCbzRegLabel(S[0].value,fe(S[1])),N=!1;break}case"cbnz":{let S=M.operands;f.putCbnzRegLabel(S[0].value,fe(S[1])),N=!1;break}case"tbz":{let S=M.operands;f.putTbzRegImmLabel(S[0].value,S[1].value.valueOf(),fe(S[2])),N=!1;break}case"tbnz":{let S=M.operands;f.putTbnzRegImmLabel(S[0].value,S[1].value.valueOf(),fe(S[2])),N=!1;break}case"str":{let S=M.operands,L=S[0].value,j=S[1].value,w=j.disp;L==="xzr"&&w===o?(h=j.base,f.putPushRegReg("x0","lr"),f.putMovRegReg("x0",h),f.putBlImm(u),f.putPopRegReg("x0","lr"),_=!0,N=!1):s.has(w)&&j.base===h&&(N=!1);break}case"ldr":{let S=M.operands,L=S[1].value;L.base[0]==="x"&&L.disp===Ft&&(g=S[0].value);break}case"blr":M.operands[0].value===g&&(f.putLdrRegRegOffset("x0","x0",8),f.putCallAddressWithArguments(i,["x0"]),_=!0,g=null,N=!1);break}if(N?C.writeAll():C.skipOne(),A===E)break}C.dispose()}),f.dispose(),_||nr(),new NativeFunction(e,"void",["pointer"],W)}function nr(){throw new Error("Unable to parse ART internals; please file a bug")}function Pc(t){let e=t["art::ArtMethod::PrettyMethod"];e!==void 0&&(Interceptor.attach(e.impl,oe.hooks.ArtMethod.prettyMethod),Interceptor.flush())}function fe(t){return ptr(t.value).toString()}function Fc(t,e){return new NativeFunction(t,"pointer",e,W)}function Dc(t,e){let n=new NativeFunction(t,"void",["pointer"].concat(e),W);return function(){let r=Memory.alloc(v);return n(r,...arguments),r.readPointer()}}function xt(t,e){let{arch:n}=Process;switch(n){case"ia32":case"arm64":{let r;n==="ia32"?r=qe(64,i=>{let l=1+e.length,a=l*4;i.putSubRegImm("esp",a);for(let c=0;c!==l;c++){let d=c*4;i.putMovRegRegOffsetPtr("eax","esp",a+4+d),i.putMovRegOffsetPtrReg("esp",d,"eax")}i.putCallAddress(t),i.putAddRegImm("esp",a-4),i.putRet()}):r=qe(32,i=>{i.putMovRegReg("x8","x0"),e.forEach((l,a)=>{i.putMovRegReg("x"+a,"x"+(a+1))}),i.putLdrRegAddress("x7",t),i.putBrReg("x7")});let o=new NativeFunction(r,"void",["pointer"].concat(e),W),s=function(...i){o(...i)};return s.handle=r,s.impl=t,s}default:{let r=new NativeFunction(t,"void",["pointer"].concat(e),W);return r.impl=t,r}}}var Rt=class{constructor(){this.handle=Memory.alloc(dt)}dispose(){let[e,n]=this._getData();n||J().$delete(e)}disposeToString(){let e=this.toString();return this.dispose(),e}toString(){let[e]=this._getData();return e.readUtf8String()}_getData(){let e=this.handle,n=(e.readU8()&1)===0;return[n?e.add(1):e.add(2*v).readPointer(),n]}},zn=class{$delete(){this.dispose(),J().$delete(this)}constructor(e,n){this.handle=e,this._begin=e,this._end=e.add(v),this._storage=e.add(2*v),this._elementSize=n}init(){this.begin=NULL,this.end=NULL,this.storage=NULL}dispose(){J().$delete(this.begin)}get begin(){return this._begin.readPointer()}set begin(e){this._begin.writePointer(e)}get end(){return this._end.readPointer()}set end(e){this._end.writePointer(e)}get storage(){return this._storage.readPointer()}set storage(e){this._storage.writePointer(e)}get size(){return this.end.sub(this.begin).toInt32()/this._elementSize}},ut=class t extends zn{static $new(){let e=new t(J().$new(cl));return e.init(),e}constructor(e){super(e,v)}get handles(){let e=[],n=this.begin,r=this.end;for(;!n.equals(r);)e.push(n.readPointer()),n=n.add(v);return e}},Uc=0,vo=v,So=vo+4,Bc=-1,Pt=class t{$delete(){this.dispose(),J().$delete(this)}constructor(e){this.handle=e,this._link=e.add(Uc),this._numberOfReferences=e.add(vo)}init(e,n){this.link=e,this.numberOfReferences=n}dispose(){}get link(){return new t(this._link.readPointer())}set link(e){this._link.writePointer(e)}get numberOfReferences(){return this._numberOfReferences.readS32()}set numberOfReferences(e){this._numberOfReferences.writeS32(e)}},wo=Gc(So),Io=wo+v,zc=Io+v,pt=class t extends Pt{static $new(e,n){let r=new t(J().$new(zc));return r.init(e,n),r}constructor(e){super(e),this._self=e.add(wo),this._currentScope=e.add(Io);let o=(64-v-4-4)/4;this._scopeLayout=ct.layoutForCapacity(o),this._topHandleScopePtr=null}init(e,n){let r=e.add(We(n).offset.topHandleScope);this._topHandleScopePtr=r,super.init(r.readPointer(),Bc),this.self=e,this.currentScope=ct.$new(this._scopeLayout),r.writePointer(this)}dispose(){this._topHandleScopePtr.writePointer(this.link);let e;for(;(e=this.currentScope)!==null;){let n=e.link;e.$delete(),this.currentScope=n}}get self(){return this._self.readPointer()}set self(e){this._self.writePointer(e)}get currentScope(){let e=this._currentScope.readPointer();return e.isNull()?null:new ct(e,this._scopeLayout)}set currentScope(e){this._currentScope.writePointer(e)}newHandle(e){return this.currentScope.newHandle(e)}},ct=class t extends Pt{static $new(e){let n=new t(J().$new(e.size),e);return n.init(),n}constructor(e,n){super(e);let{offset:r}=n;this._refsStorage=e.add(r.refsStorage),this._pos=e.add(r.pos),this._layout=n}init(){super.init(NULL,this._layout.numberOfReferences),this.pos=0}get pos(){return this._pos.readU32()}set pos(e){this._pos.writeU32(e)}newHandle(e){let n=this.pos,r=this._refsStorage.add(n*4);return r.writeS32(e.toInt32()),this.pos=n+1,r}static layoutForCapacity(e){let n=So,r=n+e*4;return{size:r+4,numberOfReferences:e,offset:{refsStorage:n,pos:r}}}},Vc={arm:function(t,e){let n=Process.pageSize,r=Memory.alloc(n);Memory.protect(r,n,"rwx");let o=new NativeCallback(e,"void",["pointer"]);r._onMatchCallback=o;let s=[26625,18947,17041,53505,19202,18200,18288,48896],i=s.length*2,l=i+4,a=l+4;return Memory.patchCode(r,a,function(c){s.forEach((d,p)=>{c.add(p*2).writeU16(d)}),c.add(i).writeS32(t),c.add(l).writePointer(o)}),r.or(1)},arm64:function(t,e){let n=Process.pageSize,r=Memory.alloc(n);Memory.protect(r,n,"rwx");let o=new NativeCallback(e,"void",["pointer"]);r._onMatchCallback=o;let s=[3107979265,402653378,1795293247,1409286241,1476395139,3592355936,3596551104],i=s.length*4,l=i+4,a=l+8;return Memory.patchCode(r,a,function(c){s.forEach((d,p)=>{c.add(p*4).writeU32(d)}),c.add(i).writeS32(t),c.add(l).writePointer(o)}),r}};function rr(t,e){return(Vc[Process.arch]||Jc)(t,e)}function Jc(t,e){return new NativeCallback(n=>{n.readS32()===t&&e(n)},"void",["pointer","pointer"])}function Gc(t){let e=t%v;return e!==0?t+v-e:t}var $c=4,{pointerSize:V}=Process,Hc=256,Zc=65536,qc=131072,Wc=33554432,Kc=67108864,Qc=134217728,Be={exceptions:"propagate"},Lo=ce(dd),Yc=ce(pd),Xc=ce(ad),or=null,sr=!1,zt=new Map,ht=new Map;function Te(){return or===null&&(or=ed()),or}function ed(){let t=Process.enumerateModules().filter(a=>/jvm.(dll|dylib|so)$/.test(a.name));if(t.length===0)return null;let e=t[0],n={flavor:"jvm"},r=Process.platform==="windows"?[{module:e,functions:{JNI_GetCreatedJavaVMs:["JNI_GetCreatedJavaVMs","int",["pointer","int","pointer"]],JVM_Sleep:["JVM_Sleep","void",["pointer","pointer","long"]],"VMThread::execute":["VMThread::execute","void",["pointer"]],"Method::size":["Method::size","int",["int"]],"Method::set_native_function":["Method::set_native_function","void",["pointer","pointer","int"]],"Method::clear_native_function":["Method::clear_native_function","void",["pointer"]],"Method::jmethod_id":["Method::jmethod_id","pointer",["pointer"]],"ClassLoaderDataGraph::classes_do":["ClassLoaderDataGraph::classes_do","void",["pointer"]],"NMethodSweeper::sweep_code_cache":["NMethodSweeper::sweep_code_cache","void",[]],"OopMapCache::flush_obsolete_entries":["OopMapCache::flush_obsolete_entries","void",["pointer"]]},variables:{"VM_RedefineClasses::`vftable'":function(a){this.vtableRedefineClasses=a},"VM_RedefineClasses::doit":function(a){this.redefineClassesDoIt=a},"VM_RedefineClasses::doit_prologue":function(a){this.redefineClassesDoItPrologue=a},"VM_RedefineClasses::doit_epilogue":function(a){this.redefineClassesDoItEpilogue=a},"VM_RedefineClasses::allow_nested_vm_operations":function(a){this.redefineClassesAllow=a},"NMethodSweeper::_traversals":function(a){this.traversals=a},"NMethodSweeper::_should_sweep":function(a){this.shouldSweep=a}},optionals:[]}]:[{module:e,functions:{JNI_GetCreatedJavaVMs:["JNI_GetCreatedJavaVMs","int",["pointer","int","pointer"]],_ZN6Method4sizeEb:["Method::size","int",["int"]],_ZN6Method19set_native_functionEPhb:["Method::set_native_function","void",["pointer","pointer","int"]],_ZN6Method21clear_native_functionEv:["Method::clear_native_function","void",["pointer"]],_ZN6Method24restore_unshareable_infoEP10JavaThread:["Method::restore_unshareable_info","void",["pointer","pointer"]],_ZN6Method24restore_unshareable_infoEP6Thread:["Method::restore_unshareable_info","void",["pointer","pointer"]],_ZN6Method11link_methodERK12methodHandleP10JavaThread:["Method::link_method","void",["pointer","pointer","pointer"]],_ZN6Method10jmethod_idEv:["Method::jmethod_id","pointer",["pointer"]],_ZN6Method10clear_codeEv:function(a){let c=new NativeFunction(a,"void",["pointer"],Be);this["Method::clear_code"]=function(d){c(d)}},_ZN6Method10clear_codeEb:function(a){let c=new NativeFunction(a,"void",["pointer","int"],Be),d=0;this["Method::clear_code"]=function(p){c(p,d)}},_ZN18VM_RedefineClasses19mark_dependent_codeEP13InstanceKlass:["VM_RedefineClasses::mark_dependent_code","void",["pointer","pointer"]],_ZN18VM_RedefineClasses20flush_dependent_codeEv:["VM_RedefineClasses::flush_dependent_code","void",[]],_ZN18VM_RedefineClasses20flush_dependent_codeEP13InstanceKlassP6Thread:["VM_RedefineClasses::flush_dependent_code","void",["pointer","pointer","pointer"]],_ZN18VM_RedefineClasses20flush_dependent_codeE19instanceKlassHandleP6Thread:["VM_RedefineClasses::flush_dependent_code","void",["pointer","pointer","pointer"]],_ZN19ResolvedMethodTable21adjust_method_entriesEPb:["ResolvedMethodTable::adjust_method_entries","void",["pointer"]],_ZN15MemberNameTable21adjust_method_entriesEP13InstanceKlassPb:["MemberNameTable::adjust_method_entries","void",["pointer","pointer","pointer"]],_ZN17ConstantPoolCache21adjust_method_entriesEPb:function(a){let c=new NativeFunction(a,"void",["pointer","pointer"],Be);this["ConstantPoolCache::adjust_method_entries"]=function(d,p,f){c(d,f)}},_ZN17ConstantPoolCache21adjust_method_entriesEP13InstanceKlassPb:function(a){let c=new NativeFunction(a,"void",["pointer","pointer","pointer"],Be);this["ConstantPoolCache::adjust_method_entries"]=function(d,p,f){c(d,p,f)}},_ZN20ClassLoaderDataGraph10classes_doEP12KlassClosure:["ClassLoaderDataGraph::classes_do","void",["pointer"]],_ZN20ClassLoaderDataGraph22clean_deallocate_listsEb:["ClassLoaderDataGraph::clean_deallocate_lists","void",["int"]],_ZN10JavaThread27thread_from_jni_environmentEP7JNIEnv_:["JavaThread::thread_from_jni_environment","pointer",["pointer"]],_ZN8VMThread7executeEP12VM_Operation:["VMThread::execute","void",["pointer"]],_ZN11OopMapCache22flush_obsolete_entriesEv:["OopMapCache::flush_obsolete_entries","void",["pointer"]],_ZN14NMethodSweeper11force_sweepEv:["NMethodSweeper::force_sweep","void",[]],_ZN14NMethodSweeper16sweep_code_cacheEv:["NMethodSweeper::sweep_code_cache","void",[]],_ZN14NMethodSweeper17sweep_in_progressEv:["NMethodSweeper::sweep_in_progress","bool",[]],JVM_Sleep:["JVM_Sleep","void",["pointer","pointer","long"]]},variables:{_ZN18VM_RedefineClasses14_the_class_oopE:function(a){this.redefineClass=a},_ZN18VM_RedefineClasses10_the_classE:function(a){this.redefineClass=a},_ZN18VM_RedefineClasses25AdjustCpoolCacheAndVtable8do_klassEP5Klass:function(a){this.doKlass=a},_ZN18VM_RedefineClasses22AdjustAndCleanMetadata8do_klassEP5Klass:function(a){this.doKlass=a},_ZTV18VM_RedefineClasses:function(a){this.vtableRedefineClasses=a},_ZN18VM_RedefineClasses4doitEv:function(a){this.redefineClassesDoIt=a},_ZN18VM_RedefineClasses13doit_prologueEv:function(a){this.redefineClassesDoItPrologue=a},_ZN18VM_RedefineClasses13doit_epilogueEv:function(a){this.redefineClassesDoItEpilogue=a},_ZN18VM_RedefineClassesD0Ev:function(a){this.redefineClassesDispose0=a},_ZN18VM_RedefineClassesD1Ev:function(a){this.redefineClassesDispose1=a},_ZNK18VM_RedefineClasses26allow_nested_vm_operationsEv:function(a){this.redefineClassesAllow=a},_ZNK18VM_RedefineClasses14print_on_errorEP12outputStream:function(a){this.redefineClassesOnError=a},_ZN13InstanceKlass33create_new_default_vtable_indicesEiP10JavaThread:function(a){this.createNewDefaultVtableIndices=a},_ZN13InstanceKlass33create_new_default_vtable_indicesEiP6Thread:function(a){this.createNewDefaultVtableIndices=a},_ZN19Abstract_VM_Version19jre_release_versionEv:function(a){let d=new NativeFunction(a,"pointer",[],Be)().readCString();this.version=d.startsWith("1.8")?8:d.startsWith("9.")?9:parseInt(d.slice(0,2),10),this.versionS=d},_ZN14NMethodSweeper11_traversalsE:function(a){this.traversals=a},_ZN14NMethodSweeper21_sweep_fractions_leftE:function(a){this.fractions=a},_ZN14NMethodSweeper13_should_sweepE:function(a){this.shouldSweep=a}},optionals:["_ZN6Method24restore_unshareable_infoEP10JavaThread","_ZN6Method24restore_unshareable_infoEP6Thread","_ZN6Method11link_methodERK12methodHandleP10JavaThread","_ZN6Method10clear_codeEv","_ZN6Method10clear_codeEb","_ZN18VM_RedefineClasses19mark_dependent_codeEP13InstanceKlass","_ZN18VM_RedefineClasses20flush_dependent_codeEv","_ZN18VM_RedefineClasses20flush_dependent_codeEP13InstanceKlassP6Thread","_ZN18VM_RedefineClasses20flush_dependent_codeE19instanceKlassHandleP6Thread","_ZN19ResolvedMethodTable21adjust_method_entriesEPb","_ZN15MemberNameTable21adjust_method_entriesEP13InstanceKlassPb","_ZN17ConstantPoolCache21adjust_method_entriesEPb","_ZN17ConstantPoolCache21adjust_method_entriesEP13InstanceKlassPb","_ZN20ClassLoaderDataGraph22clean_deallocate_listsEb","_ZN10JavaThread27thread_from_jni_environmentEP7JNIEnv_","_ZN14NMethodSweeper11force_sweepEv","_ZN14NMethodSweeper17sweep_in_progressEv","_ZN18VM_RedefineClasses14_the_class_oopE","_ZN18VM_RedefineClasses10_the_classE","_ZN18VM_RedefineClasses25AdjustCpoolCacheAndVtable8do_klassEP5Klass","_ZN18VM_RedefineClasses22AdjustAndCleanMetadata8do_klassEP5Klass","_ZN18VM_RedefineClassesD0Ev","_ZN18VM_RedefineClassesD1Ev","_ZNK18VM_RedefineClasses14print_on_errorEP12outputStream","_ZN13InstanceKlass33create_new_default_vtable_indicesEiP10JavaThread","_ZN13InstanceKlass33create_new_default_vtable_indicesEiP6Thread","_ZN14NMethodSweeper21_sweep_fractions_leftE"]}],o=[];if(r.forEach(function(a){let c=a.module,d=a.functions||{},p=a.variables||{},f=new Set(a.optionals||[]),u=c.enumerateExports().reduce(function(h,g){return h[g.name]=g,h},{}),_=c.enumerateSymbols().reduce(function(h,g){return h[g.name]=g,h},u);Object.keys(d).forEach(function(h){let g=_[h];if(g!==void 0){let b=d[h];typeof b=="function"?b.call(n,g.address):n[b[0]]=new NativeFunction(g.address,b[1],b[2],Be)}else f.has(h)||o.push(h)}),Object.keys(p).forEach(function(h){let g=_[h];g!==void 0?p[h].call(n,g.address):f.has(h)||o.push(h)})}),o.length>0)throw new Error("Java API only partially available; please file a bug. Missing: "+o.join(", "));let s=Memory.alloc(V),i=Memory.alloc($c);if(de("JNI_GetCreatedJavaVMs",n.JNI_GetCreatedJavaVMs(s,1,i)),i.readInt()===0)return null;n.vm=s.readPointer();let l=Process.platform==="windows"?{$new:["??2@YAPEAX_K@Z","pointer",["ulong"]],$delete:["??3@YAXPEAX@Z","void",["pointer"]]}:{$new:["_Znwm","pointer",["ulong"]],$delete:["_ZdlPv","void",["pointer"]]};for(let[a,[c,d,p]]of Object.entries(l)){let f=Module.findGlobalExportByName(c);if(f===null&&(f=DebugSymbol.fromName(c).address,f.isNull()))throw new Error(`unable to find C++ allocator API, missing: '${c}'`);n[a]=new NativeFunction(f,d,p,Be)}return n.jvmti=td(n),n["JavaThread::thread_from_jni_environment"]===void 0&&(n["JavaThread::thread_from_jni_environment"]=rd(n)),n}function td(t){let e=new Ce(t),n;return e.perform(()=>{let r=e.tryGetEnvHandle(St.v1_0);if(r===null)throw new Error("JVMTI not available");n=new Ne(r,e);let o=Memory.alloc(8);o.writeU64(wt.canTagObjects);let s=n.addCapabilities(o);de("getEnvJvmti::AddCapabilities",s)}),n}var nd={x64:od};function rd(t){let e=null,n=nd[Process.arch];if(n!==void 0){let o=new Ce(t).perform(s=>s.handle.readPointer().add(6*V).readPointer());e=ke(o,n,{limit:11})}return e===null?()=>{throw new Error("Unable to make thread_from_jni_environment() helper for the current architecture")}:r=>r.add(e)}function od(t){if(t.mnemonic!=="lea")return null;let{base:e,disp:n}=t.operands[1].value;return e==="rdi"&&n<0?n:null}function xo(t,e){}var ir=class{constructor(e){this.methodId=e,this.method=e.readPointer(),this.originalMethod=null,this.newMethod=null,this.resolved=null,this.impl=null,this.key=e.toString(16)}replace(e,n,r,o,s){let{key:i}=this,l=ht.get(i);l!==void 0&&(ht.delete(i),this.method=l.method,this.originalMethod=l.originalMethod,this.newMethod=l.newMethod,this.resolved=l.resolved),this.impl=e,zt.set(i,this),Co(o)}revert(e){let{key:n}=this;zt.delete(n),ht.set(n,this),Co(e)}resolveTarget(e,n,r,o){let{resolved:s,originalMethod:i,methodId:l}=this;if(s!==null)return s;if(i===null)return l;i.oldMethod.vtableIndexPtr.writeS32(-2);let c=Memory.alloc(V);return c.writePointer(this.method),this.resolved=c,c}};function Co(t){sr||(sr=!0,Script.nextTick(sd,t))}function sd(t){let e=new Map(zt),n=new Map(ht);zt.clear(),ht.clear(),sr=!1,t.perform(r=>{let o=Te(),s=o["JavaThread::thread_from_jni_environment"](r.handle),i=!1;No(()=>{e.forEach(l=>{let{method:a,originalMethod:c,impl:d,methodId:p,newMethod:f}=l;c===null?(l.originalMethod=Mo(a),l.newMethod=ld(a,d,s),To(l.newMethod,p,s)):o["Method::set_native_function"](f.method,d,0)}),n.forEach(l=>{let{originalMethod:a,methodId:c,newMethod:d}=l;if(a!==null){cd(a);let p=a.oldMethod;p.oldMethod=d,To(p,c,s),i=!0}})}),i&&id(r.handle)})}function id(t){let{fractions:e,shouldSweep:n,traversals:r,"NMethodSweeper::sweep_code_cache":o,"NMethodSweeper::sweep_in_progress":s,"NMethodSweeper::force_sweep":i,JVM_Sleep:l}=Te();if(i!==void 0)Thread.sleep(.05),i(),Thread.sleep(.05),i();else{let a=r.readS64(),c=a+2;for(;c>a;)e.writeS32(1),l(t,NULL,50),s()||No(()=>{Thread.sleep(.05)}),n.readU8()===0&&(e.writeS32(1),o()),a=r.readS64()}}function No(t,e,n){let{execute:r,vtable:o,vtableSize:s,doItOffset:i,prologueOffset:l,epilogueOffset:a}=Xc(),c=Memory.dup(o,s),d=Memory.alloc(V*25);d.writePointer(c);let p=new NativeCallback(t,"void",["pointer"]);c.add(i).writePointer(p);let f=null;e!==void 0&&(f=new NativeCallback(e,"int",["pointer"]),c.add(l).writePointer(f));let u=null;n!==void 0&&(u=new NativeCallback(n,"void",["pointer"]),c.add(a).writePointer(u)),r(d)}function ad(){let{vtableRedefineClasses:t,redefineClassesDoIt:e,redefineClassesDoItPrologue:n,redefineClassesDoItEpilogue:r,redefineClassesOnError:o,redefineClassesAllow:s,redefineClassesDispose0:i,redefineClassesDispose1:l,"VMThread::execute":a}=Te(),c=t.add(2*V),d=15*V,p=Memory.dup(c,d),f=new NativeCallback(()=>{},"void",["pointer"]),u,_,h;for(let g=0;g!==d;g+=V){let b=p.add(g),E=b.readPointer();o!==void 0&&E.equals(o)||i!==void 0&&E.equals(i)||l!==void 0&&E.equals(l)?b.writePointer(f):E.equals(e)?u=g:E.equals(n)?(_=g,b.writePointer(s)):E.equals(r)&&(h=g,b.writePointer(f))}return{execute:a,emptyCallback:f,vtable:p,vtableSize:d,doItOffset:u,prologueOffset:_,epilogueOffset:h}}function ko(t){return new ir(t)}function To(t,e,n){let{method:r,oldMethod:o}=t,s=Te();t.methodsArray.add(t.methodIndex*V).writePointer(r),t.vtableIndex>=0&&t.vtable.add(t.vtableIndex*V).writePointer(r),e.writePointer(r),o.accessFlagsPtr.writeU32((o.accessFlags|Zc|qc)>>>0);let i=s["OopMapCache::flush_obsolete_entries"];if(i!==void 0){let{oopMapCache:_}=t;_.isNull()||i(_)}let l=s["VM_RedefineClasses::mark_dependent_code"],a=s["VM_RedefineClasses::flush_dependent_code"];l!==void 0?(l(NULL,t.instanceKlass),a()):a(NULL,t.instanceKlass,n);let c=Memory.alloc(1);c.writeU8(1),s["ConstantPoolCache::adjust_method_entries"](t.cache,t.instanceKlass,c);let d=Memory.alloc(3*V),p=Memory.alloc(V);p.writePointer(s.doKlass),d.writePointer(p),d.add(V).writePointer(n),d.add(2*V).writePointer(n),s.redefineClass!==void 0&&s.redefineClass.writePointer(t.instanceKlass),s["ClassLoaderDataGraph::classes_do"](d);let f=s["ResolvedMethodTable::adjust_method_entries"];if(f!==void 0)f(c);else{let{memberNames:_}=t;if(!_.isNull()){let h=s["MemberNameTable::adjust_method_entries"];h!==void 0&&h(_,t.instanceKlass,c)}}let u=s["ClassLoaderDataGraph::clean_deallocate_lists"];u!==void 0&&u(0)}function ld(t,e,n){let r=Te(),o=Mo(t);o.constPtr.writePointer(o.const);let s=(o.accessFlags|Hc|Wc|Kc|Qc)>>>0;if(o.accessFlagsPtr.writeU32(s),o.signatureHandler.writePointer(NULL),o.adapter.writePointer(NULL),o.i2iEntry.writePointer(NULL),r["Method::clear_code"](o.method),o.dataPtr.writePointer(NULL),o.countersPtr.writePointer(NULL),o.stackmapPtr.writePointer(NULL),r["Method::clear_native_function"](o.method),r["Method::set_native_function"](o.method,e,0),r["Method::restore_unshareable_info"](o.method,n),r.version>=17){let i=Memory.alloc(2*V);i.writePointer(o.method),i.add(V).writePointer(n),r["Method::link_method"](o.method,i,n)}return o}function Mo(t){let e=Lo(),n=t.add(e.method.constMethodOffset).readPointer(),r=n.add(e.constMethod.sizeOffset).readS32()*V,o=Memory.alloc(r+e.method.size);Memory.copy(o,n,r);let s=o.add(r);Memory.copy(s,t,e.method.size);let i=Ao(s,o,r),l=Ao(t,n,r);return i.oldMethod=l,i}function Ao(t,e,n){let r=Te(),o=Lo(),s=t.add(o.method.constMethodOffset),i=t.add(o.method.methodDataOffset),l=t.add(o.method.methodCountersOffset),a=t.add(o.method.accessFlagsOffset),c=a.readU32(),d=o.getAdapterPointer(t,e),p=t.add(o.method.i2iEntryOffset),f=t.add(o.method.signatureHandlerOffset),u=e.add(o.constMethod.constantPoolOffset).readPointer(),_=e.add(o.constMethod.stackmapDataOffset),h=u.add(o.constantPool.instanceKlassOffset).readPointer(),g=u.add(o.constantPool.cacheOffset).readPointer(),b=Yc(),E=h.add(b.methodsOffset).readPointer(),C=E.readS32(),A=E.add(V),M=e.add(o.constMethod.methodIdnumOffset).readU16(),O=t.add(o.method.vtableIndexOffset),k=O.readS32(),N=h.add(b.vtableOffset),S=h.add(b.oopMapCacheOffset).readPointer(),L=r.version>=10?h.add(b.memberNamesOffset).readPointer():NULL;return{method:t,methodSize:o.method.size,const:e,constSize:n,constPtr:s,dataPtr:i,countersPtr:l,stackmapPtr:_,instanceKlass:h,methodsArray:A,methodsCount:C,methodIndex:M,vtableIndex:k,vtableIndexPtr:O,vtable:N,accessFlags:c,accessFlagsPtr:a,adapter:d,i2iEntry:p,signatureHandler:f,memberNames:L,cache:g,oopMapCache:S}}function cd(t){let{oldMethod:e}=t;e.accessFlagsPtr.writeU32(e.accessFlags),e.vtableIndexPtr.writeS32(e.vtableIndex)}function dd(){let t=Te(),{version:e}=t,n;e>=17?n="method:early":e>=9&&e<=16?n="const-method":n="method:late";let o=t["Method::size"](1)*V,s=V,i=2*V,l=3*V,a=4*V,c=n==="method:early"?V:0,d=a+c,p=d+4,f=p+4+8,u=f+V,_=c!==0?a:u,h=o-2*V,g=o-V,b=8,E=b+V,C=E+V,A=n==="const-method"?V:0,M=C+A,O=M+14,k=2*V,N=3*V;return{getAdapterPointer:A!==0?function(L,j){return j.add(C)}:function(L,j){return L.add(_)},method:{size:o,constMethodOffset:s,methodDataOffset:i,methodCountersOffset:l,accessFlagsOffset:d,vtableIndexOffset:p,i2iEntryOffset:f,nativeFunctionOffset:h,signatureHandlerOffset:g},constMethod:{constantPoolOffset:b,stackmapDataOffset:E,sizeOffset:M,methodIdnumOffset:O},constantPool:{cacheOffset:k,instanceKlassOffset:N}}}var ud={x64:fd};function pd(){let{version:t,createNewDefaultVtableIndices:e}=Te(),n=ud[Process.arch];if(n===void 0)throw new Error(`Missing vtable offset parser for ${Process.arch}`);let r=ke(e,n,{limit:32});if(r===null)throw new Error("Unable to deduce vtable offset");let o=t>=10&&t<=11||t>=15?17:18,s=r-7*V,i=r-17*V,l=r-o*V;return{vtableOffset:r,methodsOffset:s,memberNamesOffset:i,oopMapCacheOffset:l}}function fd(t){if(t.mnemonic!=="mov")return null;let e=t.operands[0];if(e.type!=="mem")return null;let{value:n}=e;if(n.scale!==1)return null;let{disp:r}=n;return r<256?null:r+16}var jo=J;try{ft()}catch{jo=Te}var _t=jo;var hd=`#include <json-glib/json-glib.h>
#include <string.h>

#define kAccStatic 0x0008
#define kAccConstructor 0x00010000

typedef struct _Model Model;
typedef struct _EnumerateMethodsContext EnumerateMethodsContext;

typedef struct _JavaApi JavaApi;
typedef struct _JavaClassApi JavaClassApi;
typedef struct _JavaMethodApi JavaMethodApi;
typedef struct _JavaFieldApi JavaFieldApi;

typedef struct _JNIEnv JNIEnv;
typedef guint8 jboolean;
typedef gint32 jint;
typedef jint jsize;
typedef gpointer jobject;
typedef jobject jclass;
typedef jobject jstring;
typedef jobject jarray;
typedef jarray jobjectArray;
typedef gpointer jfieldID;
typedef gpointer jmethodID;

typedef struct _jvmtiEnv jvmtiEnv;
typedef enum
{
  JVMTI_ERROR_NONE = 0
} jvmtiError;

typedef struct _ArtApi ArtApi;
typedef guint32 ArtHeapReference;
typedef struct _ArtObject ArtObject;
typedef struct _ArtClass ArtClass;
typedef struct _ArtClassLinker ArtClassLinker;
typedef struct _ArtClassVisitor ArtClassVisitor;
typedef struct _ArtClassVisitorVTable ArtClassVisitorVTable;
typedef struct _ArtMethod ArtMethod;
typedef struct _ArtString ArtString;

typedef union _StdString StdString;
typedef struct _StdStringShort StdStringShort;
typedef struct _StdStringLong StdStringLong;

typedef void (* ArtVisitClassesFunc) (ArtClassLinker * linker, ArtClassVisitor * visitor);
typedef const char * (* ArtGetClassDescriptorFunc) (ArtClass * klass, StdString * storage);
typedef void (* ArtPrettyMethodFunc) (StdString * result, ArtMethod * method, jboolean with_signature);

struct _Model
{
  GHashTable * members;
};

struct _EnumerateMethodsContext
{
  GPatternSpec * class_query;
  GPatternSpec * method_query;
  jboolean include_signature;
  jboolean ignore_case;
  jboolean skip_system_classes;
  GHashTable * groups;
};

struct _JavaClassApi
{
  jmethodID get_declared_methods;
  jmethodID get_declared_fields;
};

struct _JavaMethodApi
{
  jmethodID get_name;
  jmethodID get_modifiers;
};

struct _JavaFieldApi
{
  jmethodID get_name;
  jmethodID get_modifiers;
};

struct _JavaApi
{
  jvmtiEnv * jvmti;
  JavaClassApi clazz;
  JavaMethodApi method;
  JavaFieldApi field;
};

struct _JNIEnv
{
  gpointer * functions;
};

struct _jvmtiEnv
{
  gpointer * functions;
};

struct _ArtApi
{
  gboolean available;

  guint class_offset_ifields;
  guint class_offset_methods;
  guint class_offset_sfields;
  guint class_offset_copied_methods_offset;

  guint method_size;
  guint method_offset_access_flags;

  guint field_size;
  guint field_offset_access_flags;

  guint alignment_padding;

  ArtClassLinker * linker;
  ArtVisitClassesFunc visit_classes;
  ArtGetClassDescriptorFunc get_class_descriptor;
  ArtPrettyMethodFunc pretty_method;

  void (* free) (gpointer mem);
};

struct _ArtObject
{
  ArtHeapReference klass;
  ArtHeapReference monitor;
};

struct _ArtClass
{
  ArtObject parent;

  ArtHeapReference class_loader;
};

struct _ArtClassVisitor
{
  ArtClassVisitorVTable * vtable;
  gpointer user_data;
};

struct _ArtClassVisitorVTable
{
  void (* reserved1) (ArtClassVisitor * self);
  void (* reserved2) (ArtClassVisitor * self);
  jboolean (* visit) (ArtClassVisitor * self, ArtClass * klass);
};

struct _ArtString
{
  ArtObject parent;

  gint32 count;
  guint32 hash_code;

  union
  {
    guint16 value[0];
    guint8 value_compressed[0];
  };
};

struct _StdStringShort
{
  guint8 size;
  gchar data[(3 * sizeof (gpointer)) - sizeof (guint8)];
};

struct _StdStringLong
{
  gsize capacity;
  gsize size;
  gchar * data;
};

union _StdString
{
  StdStringShort s;
  StdStringLong l;
};

static void model_add_method (Model * self, const gchar * name, jmethodID id, jint modifiers);
static void model_add_field (Model * self, const gchar * name, jfieldID id, jint modifiers);
static void model_free (Model * model);

static jboolean collect_matching_class_methods (ArtClassVisitor * self, ArtClass * klass);
static gchar * finalize_method_groups_to_json (GHashTable * groups);
static GPatternSpec * make_pattern_spec (const gchar * pattern, jboolean ignore_case);
static gchar * class_name_from_signature (const gchar * signature);
static gchar * format_method_signature (const gchar * name, const gchar * signature);
static void append_type (GString * output, const gchar ** type);

static gpointer read_art_array (gpointer object_base, guint field_offset, guint length_size, guint * length);

static void std_string_destroy (StdString * str);
static gchar * std_string_c_str (StdString * self);

extern GMutex lock;
extern GArray * models;
extern JavaApi java_api;
extern ArtApi art_api;

void
init (void)
{
  g_mutex_init (&lock);
  models = g_array_new (FALSE, FALSE, sizeof (Model *));
}

void
finalize (void)
{
  guint n, i;

  n = models->len;
  for (i = 0; i != n; i++)
  {
    Model * model = g_array_index (models, Model *, i);
    model_free (model);
  }

  g_array_unref (models);
  g_mutex_clear (&lock);
}

Model *
model_new (jclass class_handle,
           gpointer class_object,
           JNIEnv * env)
{
  Model * model;
  GHashTable * members;
  jvmtiEnv * jvmti = java_api.jvmti;
  gpointer * funcs = env->functions;
  jmethodID (* from_reflected_method) (JNIEnv *, jobject) = funcs[7];
  jfieldID (* from_reflected_field) (JNIEnv *, jobject) = funcs[8];
  jobject (* to_reflected_method) (JNIEnv *, jclass, jmethodID, jboolean) = funcs[9];
  jobject (* to_reflected_field) (JNIEnv *, jclass, jfieldID, jboolean) = funcs[12];
  void (* delete_local_ref) (JNIEnv *, jobject) = funcs[23];
  jobject (* call_object_method) (JNIEnv *, jobject, jmethodID, ...) = funcs[34];
  jint (* call_int_method) (JNIEnv *, jobject, jmethodID, ...) = funcs[49];
  const char * (* get_string_utf_chars) (JNIEnv *, jstring, jboolean *) = funcs[169];
  void (* release_string_utf_chars) (JNIEnv *, jstring, const char *) = funcs[170];
  jsize (* get_array_length) (JNIEnv *, jarray) = funcs[171];
  jobject (* get_object_array_element) (JNIEnv *, jobjectArray, jsize) = funcs[173];
  jsize n, i;

  model = g_new (Model, 1);

  members = g_hash_table_new_full (g_str_hash, g_str_equal, g_free, g_free);
  model->members = members;

  if (jvmti != NULL)
  {
    gpointer * jf = jvmti->functions - 1;
    jvmtiError (* deallocate) (jvmtiEnv *, void * mem) = jf[47];
    jvmtiError (* get_class_methods) (jvmtiEnv *, jclass, jint *, jmethodID **) = jf[52];
    jvmtiError (* get_class_fields) (jvmtiEnv *, jclass, jint *, jfieldID **) = jf[53];
    jvmtiError (* get_field_name) (jvmtiEnv *, jclass, jfieldID, char **, char **, char **) = jf[60];
    jvmtiError (* get_field_modifiers) (jvmtiEnv *, jclass, jfieldID, jint *) = jf[62];
    jvmtiError (* get_method_name) (jvmtiEnv *, jmethodID, char **, char **, char **) = jf[64];
    jvmtiError (* get_method_modifiers) (jvmtiEnv *, jmethodID, jint *) = jf[66];
    jint method_count;
    jmethodID * methods;
    jint field_count;
    jfieldID * fields;
    char * name;
    jint modifiers;

    get_class_methods (jvmti, class_handle, &method_count, &methods);
    for (i = 0; i != method_count; i++)
    {
      jmethodID method = methods[i];

      get_method_name (jvmti, method, &name, NULL, NULL);
      get_method_modifiers (jvmti, method, &modifiers);

      model_add_method (model, name, method, modifiers);

      deallocate (jvmti, name);
    }
    deallocate (jvmti, methods);

    get_class_fields (jvmti, class_handle, &field_count, &fields);
    for (i = 0; i != field_count; i++)
    {
      jfieldID field = fields[i];

      get_field_name (jvmti, class_handle, field, &name, NULL, NULL);
      get_field_modifiers (jvmti, class_handle, field, &modifiers);

      model_add_field (model, name, field, modifiers);

      deallocate (jvmti, name);
    }
    deallocate (jvmti, fields);
  }
  else if (art_api.available)
  {
    gpointer elements;
    guint n, i;
    const guint field_arrays[] = {
      art_api.class_offset_ifields,
      art_api.class_offset_sfields
    };
    guint field_array_cursor;
    gboolean merged_fields = art_api.class_offset_sfields == 0;

    elements = read_art_array (class_object, art_api.class_offset_methods, sizeof (gsize), NULL);
    n = *(guint16 *) (class_object + art_api.class_offset_copied_methods_offset);
    for (i = 0; i != n; i++)
    {
      jmethodID id;
      guint32 access_flags;
      jboolean is_static;
      jobject method, name;
      const char * name_str;
      jint modifiers;

      id = elements + (i * art_api.method_size);

      access_flags = *(guint32 *) (id + art_api.method_offset_access_flags);
      if ((access_flags & kAccConstructor) != 0)
        continue;
      is_static = (access_flags & kAccStatic) != 0;
      method = to_reflected_method (env, class_handle, id, is_static);
      name = call_object_method (env, method, java_api.method.get_name);
      name_str = get_string_utf_chars (env, name, NULL);
      modifiers = access_flags & 0xffff;

      model_add_method (model, name_str, id, modifiers);

      release_string_utf_chars (env, name, name_str);
      delete_local_ref (env, name);
      delete_local_ref (env, method);
    }

    for (field_array_cursor = 0; field_array_cursor != G_N_ELEMENTS (field_arrays); field_array_cursor++)
    {
      jboolean is_static;

      if (field_arrays[field_array_cursor] == 0)
        continue;

      if (!merged_fields)
        is_static = field_array_cursor == 1;

      elements = read_art_array (class_object, field_arrays[field_array_cursor], sizeof (guint32), &n);
      for (i = 0; i != n; i++)
      {
        jfieldID id;
        guint32 access_flags;
        jobject field, name;
        const char * name_str;
        jint modifiers;

        id = elements + (i * art_api.field_size);

        access_flags = *(guint32 *) (id + art_api.field_offset_access_flags);
        if (merged_fields)
          is_static = (access_flags & kAccStatic) != 0;
        field = to_reflected_field (env, class_handle, id, is_static);
        name = call_object_method (env, field, java_api.field.get_name);
        name_str = get_string_utf_chars (env, name, NULL);
        modifiers = access_flags & 0xffff;

        model_add_field (model, name_str, id, modifiers);

        release_string_utf_chars (env, name, name_str);
        delete_local_ref (env, name);
        delete_local_ref (env, field);
      }
    }
  }
  else
  {
    jobject elements;

    elements = call_object_method (env, class_handle, java_api.clazz.get_declared_methods);
    n = get_array_length (env, elements);
    for (i = 0; i != n; i++)
    {
      jobject method, name;
      const char * name_str;
      jmethodID id;
      jint modifiers;

      method = get_object_array_element (env, elements, i);
      name = call_object_method (env, method, java_api.method.get_name);
      name_str = get_string_utf_chars (env, name, NULL);
      id = from_reflected_method (env, method);
      modifiers = call_int_method (env, method, java_api.method.get_modifiers);

      model_add_method (model, name_str, id, modifiers);

      release_string_utf_chars (env, name, name_str);
      delete_local_ref (env, name);
      delete_local_ref (env, method);
    }
    delete_local_ref (env, elements);

    elements = call_object_method (env, class_handle, java_api.clazz.get_declared_fields);
    n = get_array_length (env, elements);
    for (i = 0; i != n; i++)
    {
      jobject field, name;
      const char * name_str;
      jfieldID id;
      jint modifiers;

      field = get_object_array_element (env, elements, i);
      name = call_object_method (env, field, java_api.field.get_name);
      name_str = get_string_utf_chars (env, name, NULL);
      id = from_reflected_field (env, field);
      modifiers = call_int_method (env, field, java_api.field.get_modifiers);

      model_add_field (model, name_str, id, modifiers);

      release_string_utf_chars (env, name, name_str);
      delete_local_ref (env, name);
      delete_local_ref (env, field);
    }
    delete_local_ref (env, elements);
  }

  g_mutex_lock (&lock);
  g_array_append_val (models, model);
  g_mutex_unlock (&lock);

  return model;
}

static void
model_add_method (Model * self,
                  const gchar * name,
                  jmethodID id,
                  jint modifiers)
{
  GHashTable * members = self->members;
  gchar * key, type;
  const gchar * value;

  if (name[0] == '$')
    key = g_strdup_printf ("_%s", name);
  else
    key = g_strdup (name);

  type = (modifiers & kAccStatic) != 0 ? 's' : 'i';

  value = g_hash_table_lookup (members, key);
  if (value == NULL)
    g_hash_table_insert (members, key, g_strdup_printf ("m:%c0x%zx", type, id));
  else
    g_hash_table_insert (members, key, g_strdup_printf ("%s:%c0x%zx", value, type, id));
}

static void
model_add_field (Model * self,
                 const gchar * name,
                 jfieldID id,
                 jint modifiers)
{
  GHashTable * members = self->members;
  gchar * key, type;

  if (name[0] == '$')
    key = g_strdup_printf ("_%s", name);
  else
    key = g_strdup (name);
  while (g_hash_table_contains (members, key))
  {
    gchar * new_key = g_strdup_printf ("_%s", key);
    g_free (key);
    key = new_key;
  }

  type = (modifiers & kAccStatic) != 0 ? 's' : 'i';

  g_hash_table_insert (members, key, g_strdup_printf ("f:%c0x%zx", type, id));
}

static void
model_free (Model * model)
{
  g_hash_table_unref (model->members);

  g_free (model);
}

gboolean
model_has (Model * self,
           const gchar * member)
{
  return g_hash_table_contains (self->members, member);
}

const gchar *
model_find (Model * self,
            const gchar * member)
{
  return g_hash_table_lookup (self->members, member);
}

gchar *
model_list (Model * self)
{
  GString * result;
  GHashTableIter iter;
  guint i;
  const gchar * name;

  result = g_string_sized_new (128);

  g_string_append_c (result, '[');

  g_hash_table_iter_init (&iter, self->members);
  for (i = 0; g_hash_table_iter_next (&iter, (gpointer *) &name, NULL); i++)
  {
    if (i > 0)
      g_string_append_c (result, ',');

    g_string_append_c (result, '"');
    g_string_append (result, name);
    g_string_append_c (result, '"');
  }

  g_string_append_c (result, ']');

  return g_string_free (result, FALSE);
}

gchar *
enumerate_methods_art (const gchar * class_query,
                       const gchar * method_query,
                       jboolean include_signature,
                       jboolean ignore_case,
                       jboolean skip_system_classes)
{
  gchar * result;
  EnumerateMethodsContext ctx;
  ArtClassVisitor visitor;
  ArtClassVisitorVTable visitor_vtable = { NULL, };

  ctx.class_query = make_pattern_spec (class_query, ignore_case);
  ctx.method_query = make_pattern_spec (method_query, ignore_case);
  ctx.include_signature = include_signature;
  ctx.ignore_case = ignore_case;
  ctx.skip_system_classes = skip_system_classes;
  ctx.groups = g_hash_table_new_full (NULL, NULL, NULL, NULL);

  visitor.vtable = &visitor_vtable;
  visitor.user_data = &ctx;

  visitor_vtable.visit = collect_matching_class_methods;

  art_api.visit_classes (art_api.linker, &visitor);

  result = finalize_method_groups_to_json (ctx.groups);

  g_hash_table_unref (ctx.groups);
  g_pattern_spec_free (ctx.method_query);
  g_pattern_spec_free (ctx.class_query);

  return result;
}

static jboolean
collect_matching_class_methods (ArtClassVisitor * self,
                                ArtClass * klass)
{
  EnumerateMethodsContext * ctx = self->user_data;
  const char * descriptor;
  StdString descriptor_storage = { 0, };
  gchar * class_name = NULL;
  gchar * class_name_copy = NULL;
  const gchar * normalized_class_name;
  JsonBuilder * group;
  size_t class_name_length;
  GHashTable * seen_method_names;
  gpointer elements;
  guint n, i;

  if (ctx->skip_system_classes && klass->class_loader == 0)
    goto skip_class;

  descriptor = art_api.get_class_descriptor (klass, &descriptor_storage);
  if (descriptor[0] != 'L')
    goto skip_class;

  class_name = class_name_from_signature (descriptor);

  if (ctx->ignore_case)
  {
    class_name_copy = g_utf8_strdown (class_name, -1);
    normalized_class_name = class_name_copy;
  }
  else
  {
    normalized_class_name = class_name;
  }

  if (!g_pattern_match_string (ctx->class_query, normalized_class_name))
    goto skip_class;

  group = NULL;
  class_name_length = strlen (class_name);
  seen_method_names = ctx->include_signature ? NULL : g_hash_table_new_full (g_str_hash, g_str_equal, g_free, NULL);

  elements = read_art_array (klass, art_api.class_offset_methods, sizeof (gsize), NULL);
  n = *(guint16 *) ((gpointer) klass + art_api.class_offset_copied_methods_offset);
  for (i = 0; i != n; i++)
  {
    ArtMethod * method;
    guint32 access_flags;
    jboolean is_constructor;
    StdString method_name = { 0, };
    const gchar * bare_method_name;
    gchar * bare_method_name_copy = NULL;
    const gchar * normalized_method_name;
    gchar * normalized_method_name_copy = NULL;

    method = elements + (i * art_api.method_size);

    access_flags = *(guint32 *) ((gpointer) method + art_api.method_offset_access_flags);
    is_constructor = (access_flags & kAccConstructor) != 0;

    art_api.pretty_method (&method_name, method, ctx->include_signature);
    bare_method_name = std_string_c_str (&method_name);
    if (ctx->include_signature)
    {
      const gchar * return_type_end, * name_begin;
      GString * name;

      return_type_end = strchr (bare_method_name, ' ');
      name_begin = return_type_end + 1 + class_name_length + 1;
      if (is_constructor && g_str_has_prefix (name_begin, "<clinit>"))
        goto skip_method;

      name = g_string_sized_new (64);

      if (is_constructor)
      {
        g_string_append (name, "$init");
        g_string_append (name, strchr (name_begin, '>') + 1);
      }
      else
      {
        g_string_append (name, name_begin);
      }
      g_string_append (name, ": ");
      g_string_append_len (name, bare_method_name, return_type_end - bare_method_name);

      bare_method_name_copy = g_string_free (name, FALSE);
      bare_method_name = bare_method_name_copy;
    }
    else
    {
      const gchar * name_begin;

      name_begin = bare_method_name + class_name_length + 1;
      if (is_constructor && strcmp (name_begin, "<clinit>") == 0)
        goto skip_method;

      if (is_constructor)
        bare_method_name = "$init";
      else
        bare_method_name += class_name_length + 1;
    }

    if (seen_method_names != NULL && g_hash_table_contains (seen_method_names, bare_method_name))
      goto skip_method;

    if (ctx->ignore_case)
    {
      normalized_method_name_copy = g_utf8_strdown (bare_method_name, -1);
      normalized_method_name = normalized_method_name_copy;
    }
    else
    {
      normalized_method_name = bare_method_name;
    }

    if (!g_pattern_match_string (ctx->method_query, normalized_method_name))
      goto skip_method;

    if (group == NULL)
    {
      group = g_hash_table_lookup (ctx->groups, GUINT_TO_POINTER (klass->class_loader));
      if (group == NULL)
      {
        group = json_builder_new_immutable ();
        g_hash_table_insert (ctx->groups, GUINT_TO_POINTER (klass->class_loader), group);

        json_builder_begin_object (group);

        json_builder_set_member_name (group, "loader");
        json_builder_add_int_value (group, klass->class_loader);

        json_builder_set_member_name (group, "classes");
        json_builder_begin_array (group);
      }

      json_builder_begin_object (group);

      json_builder_set_member_name (group, "name");
      json_builder_add_string_value (group, class_name);

      json_builder_set_member_name (group, "methods");
      json_builder_begin_array (group);
    }

    json_builder_add_string_value (group, bare_method_name);

    if (seen_method_names != NULL)
      g_hash_table_add (seen_method_names, g_strdup (bare_method_name));

skip_method:
    g_free (normalized_method_name_copy);
    g_free (bare_method_name_copy);
    std_string_destroy (&method_name);
  }

  if (seen_method_names != NULL)
    g_hash_table_unref (seen_method_names);

  if (group == NULL)
    goto skip_class;

  json_builder_end_array (group);
  json_builder_end_object (group);

skip_class:
  g_free (class_name_copy);
  g_free (class_name);
  std_string_destroy (&descriptor_storage);

  return TRUE;
}

gchar *
enumerate_methods_jvm (const gchar * class_query,
                       const gchar * method_query,
                       jboolean include_signature,
                       jboolean ignore_case,
                       jboolean skip_system_classes,
                       JNIEnv * env)
{
  gchar * result;
  GPatternSpec * class_pattern, * method_pattern;
  GHashTable * groups;
  gpointer * ef = env->functions;
  jobject (* new_global_ref) (JNIEnv *, jobject) = ef[21];
  void (* delete_local_ref) (JNIEnv *, jobject) = ef[23];
  jboolean (* is_same_object) (JNIEnv *, jobject, jobject) = ef[24];
  jvmtiEnv * jvmti = java_api.jvmti;
  gpointer * jf = jvmti->functions - 1;
  jvmtiError (* deallocate) (jvmtiEnv *, void * mem) = jf[47];
  jvmtiError (* get_class_signature) (jvmtiEnv *, jclass, char **, char **) = jf[48];
  jvmtiError (* get_class_methods) (jvmtiEnv *, jclass, jint *, jmethodID **) = jf[52];
  jvmtiError (* get_class_loader) (jvmtiEnv *, jclass, jobject *) = jf[57];
  jvmtiError (* get_method_name) (jvmtiEnv *, jmethodID, char **, char **, char **) = jf[64];
  jvmtiError (* get_loaded_classes) (jvmtiEnv *, jint *, jclass **) = jf[78];
  jint class_count, class_index;
  jclass * classes;

  class_pattern = make_pattern_spec (class_query, ignore_case);
  method_pattern = make_pattern_spec (method_query, ignore_case);
  groups = g_hash_table_new_full (NULL, NULL, NULL, NULL);

  if (get_loaded_classes (jvmti, &class_count, &classes) != JVMTI_ERROR_NONE)
    goto emit_results;

  for (class_index = 0; class_index != class_count; class_index++)
  {
    jclass klass = classes[class_index];
    jobject loader = NULL;
    gboolean have_loader = FALSE;
    char * signature = NULL;
    gchar * class_name = NULL;
    gchar * class_name_copy = NULL;
    const gchar * normalized_class_name;
    jint method_count, method_index;
    jmethodID * methods = NULL;
    JsonBuilder * group = NULL;
    GHashTable * seen_method_names = NULL;

    if (skip_system_classes)
    {
      if (get_class_loader (jvmti, klass, &loader) != JVMTI_ERROR_NONE)
        goto skip_class;
      have_loader = TRUE;

      if (loader == NULL)
        goto skip_class;
    }

    if (get_class_signature (jvmti, klass, &signature, NULL) != JVMTI_ERROR_NONE)
      goto skip_class;

    class_name = class_name_from_signature (signature);

    if (ignore_case)
    {
      class_name_copy = g_utf8_strdown (class_name, -1);
      normalized_class_name = class_name_copy;
    }
    else
    {
      normalized_class_name = class_name;
    }

    if (!g_pattern_match_string (class_pattern, normalized_class_name))
      goto skip_class;

    if (get_class_methods (jvmti, klass, &method_count, &methods) != JVMTI_ERROR_NONE)
      goto skip_class;

    if (!include_signature)
      seen_method_names = g_hash_table_new_full (g_str_hash, g_str_equal, g_free, NULL);

    for (method_index = 0; method_index != method_count; method_index++)
    {
      jmethodID method = methods[method_index];
      const gchar * method_name;
      char * method_name_value = NULL;
      char * method_signature_value = NULL;
      gchar * method_name_copy = NULL;
      const gchar * normalized_method_name;
      gchar * normalized_method_name_copy = NULL;

      if (get_method_name (jvmti, method, &method_name_value, include_signature ? &method_signature_value : NULL, NULL) != JVMTI_ERROR_NONE)
        goto skip_method;
      method_name = method_name_value;

      if (method_name[0] == '<')
      {
        if (strcmp (method_name, "<init>") == 0)
          method_name = "$init";
        else if (strcmp (method_name, "<clinit>") == 0)
          goto skip_method;
      }

      if (include_signature)
      {
        method_name_copy = format_method_signature (method_name, method_signature_value);
        method_name = method_name_copy;
      }

      if (seen_method_names != NULL && g_hash_table_contains (seen_method_names, method_name))
        goto skip_method;

      if (ignore_case)
      {
        normalized_method_name_copy = g_utf8_strdown (method_name, -1);
        normalized_method_name = normalized_method_name_copy;
      }
      else
      {
        normalized_method_name = method_name;
      }

      if (!g_pattern_match_string (method_pattern, normalized_method_name))
        goto skip_method;

      if (group == NULL)
      {
        if (!have_loader && get_class_loader (jvmti, klass, &loader) != JVMTI_ERROR_NONE)
          goto skip_method;

        if (loader == NULL)
        {
          group = g_hash_table_lookup (groups, NULL);
        }
        else
        {
          GHashTableIter iter;
          jobject cur_loader;
          JsonBuilder * cur_group;

          g_hash_table_iter_init (&iter, groups);
          while (g_hash_table_iter_next (&iter, (gpointer *) &cur_loader, (gpointer *) &cur_group))
          {
            if (cur_loader != NULL && is_same_object (env, cur_loader, loader))
            {
              group = cur_group;
              break;
            }
          }
        }

        if (group == NULL)
        {
          jobject l;
          gchar * str;

          l = (loader != NULL) ? new_global_ref (env, loader) : NULL;

          group = json_builder_new_immutable ();
          g_hash_table_insert (groups, l, group);

          json_builder_begin_object (group);

          json_builder_set_member_name (group, "loader");
          str = g_strdup_printf ("0x%" G_GSIZE_MODIFIER "x", GPOINTER_TO_SIZE (l));
          json_builder_add_string_value (group, str);
          g_free (str);

          json_builder_set_member_name (group, "classes");
          json_builder_begin_array (group);
        }

        json_builder_begin_object (group);

        json_builder_set_member_name (group, "name");
        json_builder_add_string_value (group, class_name);

        json_builder_set_member_name (group, "methods");
        json_builder_begin_array (group);
      }

      json_builder_add_string_value (group, method_name);

      if (seen_method_names != NULL)
        g_hash_table_add (seen_method_names, g_strdup (method_name));

skip_method:
      g_free (normalized_method_name_copy);
      g_free (method_name_copy);
      deallocate (jvmti, method_signature_value);
      deallocate (jvmti, method_name_value);
    }

skip_class:
    if (group != NULL)
    {
      json_builder_end_array (group);
      json_builder_end_object (group);
    }

    if (seen_method_names != NULL)
      g_hash_table_unref (seen_method_names);

    deallocate (jvmti, methods);

    g_free (class_name_copy);
    g_free (class_name);
    deallocate (jvmti, signature);

    if (loader != NULL)
      delete_local_ref (env, loader);

    delete_local_ref (env, klass);
  }

  deallocate (jvmti, classes);

emit_results:
  result = finalize_method_groups_to_json (groups);

  g_hash_table_unref (groups);
  g_pattern_spec_free (method_pattern);
  g_pattern_spec_free (class_pattern);

  return result;
}

static gchar *
finalize_method_groups_to_json (GHashTable * groups)
{
  GString * result;
  GHashTableIter iter;
  guint i;
  JsonBuilder * group;

  result = g_string_sized_new (1024);

  g_string_append_c (result, '[');

  g_hash_table_iter_init (&iter, groups);
  for (i = 0; g_hash_table_iter_next (&iter, NULL, (gpointer *) &group); i++)
  {
    JsonNode * root;
    gchar * json;

    if (i > 0)
      g_string_append_c (result, ',');

    json_builder_end_array (group);
    json_builder_end_object (group);

    root = json_builder_get_root (group);
    json = json_to_string (root, FALSE);
    g_string_append (result, json);
    g_free (json);
    json_node_unref (root);

    g_object_unref (group);
  }

  g_string_append_c (result, ']');

  return g_string_free (result, FALSE);
}

static GPatternSpec *
make_pattern_spec (const gchar * pattern,
                   jboolean ignore_case)
{
  GPatternSpec * spec;

  if (ignore_case)
  {
    gchar * str = g_utf8_strdown (pattern, -1);
    spec = g_pattern_spec_new (str);
    g_free (str);
  }
  else
  {
    spec = g_pattern_spec_new (pattern);
  }

  return spec;
}

static gchar *
class_name_from_signature (const gchar * descriptor)
{
  gchar * result, * c;

  result = g_strdup (descriptor + 1);

  for (c = result; *c != '\\0'; c++)
  {
    if (*c == '/')
      *c = '.';
  }

  c[-1] = '\\0';

  return result;
}

static gchar *
format_method_signature (const gchar * name,
                         const gchar * signature)
{
  GString * sig;
  const gchar * cursor;
  gint arg_index;

  sig = g_string_sized_new (128);

  g_string_append (sig, name);

  cursor = signature;
  arg_index = -1;
  while (TRUE)
  {
    const gchar c = *cursor;

    if (c == '(')
    {
      g_string_append_c (sig, c);
      cursor++;
      arg_index = 0;
    }
    else if (c == ')')
    {
      g_string_append_c (sig, c);
      cursor++;
      break;
    }
    else
    {
      if (arg_index >= 1)
        g_string_append (sig, ", ");

      append_type (sig, &cursor);

      if (arg_index != -1)
        arg_index++;
    }
  }

  g_string_append (sig, ": ");
  append_type (sig, &cursor);

  return g_string_free (sig, FALSE);
}

static void
append_type (GString * output,
             const gchar ** type)
{
  const gchar * cursor = *type;

  switch (*cursor)
  {
    case 'Z':
      g_string_append (output, "boolean");
      cursor++;
      break;
    case 'B':
      g_string_append (output, "byte");
      cursor++;
      break;
    case 'C':
      g_string_append (output, "char");
      cursor++;
      break;
    case 'S':
      g_string_append (output, "short");
      cursor++;
      break;
    case 'I':
      g_string_append (output, "int");
      cursor++;
      break;
    case 'J':
      g_string_append (output, "long");
      cursor++;
      break;
    case 'F':
      g_string_append (output, "float");
      cursor++;
      break;
    case 'D':
      g_string_append (output, "double");
      cursor++;
      break;
    case 'V':
      g_string_append (output, "void");
      cursor++;
      break;
    case 'L':
    {
      gchar ch;

      cursor++;
      for (; (ch = *cursor) != ';'; cursor++)
      {
        g_string_append_c (output, (ch != '/') ? ch : '.');
      }
      cursor++;

      break;
    }
    case '[':
      *type = cursor + 1;
      append_type (output, type);
      g_string_append (output, "[]");
      return;
    default:
      g_string_append (output, "BUG");
      cursor++;
  }

  *type = cursor;
}

void
dealloc (gpointer mem)
{
  g_free (mem);
}

static gpointer
read_art_array (gpointer object_base,
                guint field_offset,
                guint length_size,
                guint * length)
{
  gpointer result, header;
  guint n;

  header = GSIZE_TO_POINTER (*(guint64 *) (object_base + field_offset));
  if (header != NULL)
  {
    result = header + length_size;
    if (length_size == sizeof (guint32))
      n = *(guint32 *) header;
    else
      n = *(guint64 *) header;
  }
  else
  {
    result = NULL;
    n = 0;
  }

  if (length != NULL)
    *length = n;

  return result;
}

static void
std_string_destroy (StdString * str)
{
  if ((str->l.capacity & 1) != 0)
    art_api.free (str->l.data);
}

static gchar *
std_string_c_str (StdString * self)
{
  if ((self->l.capacity & 1) != 0)
    return self->l.data;

  return self->s.data;
}
`,_d=/(.+)!([^/]+)\/?([isu]+)?/,Ee=null,Ro=null,ze=class t{static build(e,n){return Oo(n),Ro(e,n,r=>new t(Ee.new(e,r,n)))}static enumerateMethods(e,n,r){Oo(r);let o=e.match(_d);if(o===null)throw new Error("Invalid query; format is: class!method -- see documentation of Java.enumerateMethods(query) for details");let s=Memory.allocUtf8String(o[1]),i=Memory.allocUtf8String(o[2]),l=!1,a=!1,c=!1,d=o[3];d!==void 0&&(l=d.indexOf("s")!==-1,a=d.indexOf("i")!==-1,c=d.indexOf("u")!==-1);let p;if(n.jvmti!==null){let f=Ee.enumerateMethodsJvm(s,i,Ke(l),Ke(a),Ke(c),r);try{p=JSON.parse(f.readUtf8String()).map(u=>{let _=ptr(u.loader);return u.loader=_.isNull()?null:_,u})}finally{Ee.dealloc(f)}}else ye(r.vm,r,f=>{let u=Ee.enumerateMethodsArt(s,i,Ke(l),Ke(a),Ke(c));try{let _=n["art::JavaVMExt::AddGlobalRef"],{vm:h}=n;p=JSON.parse(u.readUtf8String()).map(g=>{let b=g.loader;return g.loader=b!==0?_(h,f,ptr(b)):null,g})}finally{Ee.dealloc(u)}});return p}constructor(e){this.handle=e}has(e){return Ee.has(this.handle,Memory.allocUtf8String(e))!==0}find(e){return Ee.find(this.handle,Memory.allocUtf8String(e)).readUtf8String()}list(){let e=Ee.list(this.handle);try{return JSON.parse(e.readUtf8String())}finally{Ee.dealloc(e)}}};function Oo(t){Ee===null&&(Ee=md(t),Ro=gd(Ee,t.vm))}function md(t){let e=_t(),{jvmti:n=null}=e,{pointerSize:r}=Process,o=8,s=r,i=7*r,l=10*4+5*r,a=o+s+i+l,d=Memory.alloc(a),p=d.add(o),f=p.add(s),{getDeclaredMethods:u,getDeclaredFields:_}=t.javaLangClass(),h=t.javaLangReflectMethod(),g=t.javaLangReflectField(),b=f;[n!==null?n:NULL,u,_,h.getName,h.getModifiers,g.getName,g.getModifiers].forEach(k=>{b=b.writePointer(k).add(r)});let E=f.add(i),{vm:C}=t;if(e.flavor==="art"){let k;if(n!==null)k=[0,0,0,0];else{let j=$n(C).offset;k=[j.ifields,j.methods,j.sfields,j.copiedMethodsOffset]}let N=_e(C),S=Dt(C),L=E;[1,...k,N.size,N.offset.accessFlags,S.size,S.offset.accessFlags,4294967295].forEach(j=>{L=L.writeUInt(j).add(4)}),[e.artClassLinker.address,e["art::ClassLinker::VisitClasses"],e["art::mirror::Class::GetDescriptor"],e["art::ArtMethod::PrettyMethod"],Process.getModuleByName("libc.so").getExportByName("free")].forEach((j,w)=>{j===void 0&&(j=NULL),L=L.writePointer(j).add(r)})}let A=new CModule(hd,{lock:d,models:p,java_api:f,art_api:E}),M={exceptions:"propagate"},O={exceptions:"propagate",scheduling:"exclusive"};return{handle:A,new:new NativeFunction(A.model_new,"pointer",["pointer","pointer","pointer"],M),has:new NativeFunction(A.model_has,"bool",["pointer","pointer"],O),find:new NativeFunction(A.model_find,"pointer",["pointer","pointer"],O),list:new NativeFunction(A.model_list,"pointer",["pointer"],O),enumerateMethodsArt:new NativeFunction(A.enumerate_methods_art,"pointer",["pointer","pointer","bool","bool","bool"],M),enumerateMethodsJvm:new NativeFunction(A.enumerate_methods_jvm,"pointer",["pointer","pointer","bool","bool","bool","pointer"],M),dealloc:new NativeFunction(A.dealloc,"void",["pointer"],O)}}function gd(t,e){let n=_t();if(n.flavor!=="art")return bd;let r=n["art::JavaVMExt::DecodeGlobal"];return function(o,s,i){let l;return ye(e,s,a=>{let c=r(e,a,o);l=i(c)}),l}}function bd(t,e,n){return n(NULL)}function Ke(t){return t?1:0}var mt=class{constructor(e,n){this.items=new Map,this.capacity=e,this.destroy=n}dispose(e){let{items:n,destroy:r}=this;n.forEach(o=>{r(o,e)}),n.clear()}get(e){let{items:n}=this,r=n.get(e);return r!==void 0&&(n.delete(e),n.set(e,r)),r}set(e,n,r){let{items:o}=this,s=o.get(e);if(s!==void 0)o.delete(e),this.destroy(s,r);else if(o.size===this.capacity){let i=o.keys().next().value,l=o.get(i);o.delete(i),this.destroy(l,r)}o.set(e,n)}};var gt=1,cr=256,Po=65536,yd=305419896,Fo=32,Do=12,Uo=8,Bo=8,zo=4,Vo=4,Jo=12,Ed=0,vd=1,Sd=2,wd=3,Id=4,Cd=5,Td=6,Ad=4096,Ld=4097,xd=4099,Nd=8192,kd=8193,Md=8194,jd=8195,Od=8196,Rd=8198,Pd=24,Fd=28,Dd=2,Ud=24,Go=m.from([3,0,7,14,0]),ar="Ldalvik/annotation/Throws;",Bd=m.from([0]);function zd(t){let e=new dr,n=Object.assign({},t);return e.addClass(n),e.build()}var dr=class{constructor(){this.classes=[]}addClass(e){this.classes.push(e)}build(){let e=Gd(this.classes),{classes:n,interfaces:r,fields:o,methods:s,protos:i,parameters:l,annotationDirectories:a,annotationSets:c,throwsAnnotations:d,types:p,strings:f}=e,u=0,_=0,h=8,g=12,b=20,E=112;u+=E;let C=u,A=f.length*Vo;u+=A;let M=u,O=p.length*zo;u+=O;let k=u,N=i.length*Do;u+=N;let S=u,L=o.length*Uo;u+=L;let j=u,w=s.length*Bo;u+=w;let R=u,D=n.length*Fo;u+=D;let U=u,F=c.map(T=>{let P=u;return T.offset=P,u+=4+T.items.length*4,P}),z=n.reduce((T,P)=>(P.classData.constructorMethods.forEach(H=>{let[,q,Z]=H;(q&cr)===0&&Z>=0&&(H.push(u),T.push({offset:u,superConstructor:Z}),u+=Ud)}),T),[]);a.forEach(T=>{T.offset=u,u+=16+T.methods.length*8});let X=r.map(T=>{u=lr(u,4);let P=u;return T.offset=P,u+=4+2*T.types.length,P}),te=l.map(T=>{u=lr(u,4);let P=u;return T.offset=P,u+=4+2*T.types.length,P}),ae=[],Q=f.map(T=>{let P=u,B=m.from(me(T.length)),H=m.from(T,"utf8"),q=m.concat([B,H,Bd]);return ae.push(q),u+=q.length,P}),se=z.map(T=>{let P=u;return u+=Go.length,P}),Y=d.map(T=>{let P=Jd(T);return T.offset=u,u+=P.length,P}),ne=n.map((T,P)=>{T.classData.offset=u;let B=Vd(T);return u+=B.length,B}),we=0,tt=0;u=lr(u,4);let $=u,he=r.length+l.length,Le=4+(o.length>0?1:0)+2+c.length+z.length+a.length+(he>0?1:0)+1+se.length+d.length+n.length+1,Pe=4+Le*Jo;u+=Pe;let je=u-U,Ge=u,I=m.alloc(Ge);I.write(`dex
035`),I.writeUInt32LE(Ge,32),I.writeUInt32LE(E,36),I.writeUInt32LE(yd,40),I.writeUInt32LE(we,44),I.writeUInt32LE(tt,48),I.writeUInt32LE($,52),I.writeUInt32LE(f.length,56),I.writeUInt32LE(C,60),I.writeUInt32LE(p.length,64),I.writeUInt32LE(M,68),I.writeUInt32LE(i.length,72),I.writeUInt32LE(k,76),I.writeUInt32LE(o.length,80),I.writeUInt32LE(o.length>0?S:0,84),I.writeUInt32LE(s.length,88),I.writeUInt32LE(j,92),I.writeUInt32LE(n.length,96),I.writeUInt32LE(R,100),I.writeUInt32LE(je,104),I.writeUInt32LE(U,108),Q.forEach((T,P)=>{I.writeUInt32LE(T,C+P*Vo)}),p.forEach((T,P)=>{I.writeUInt32LE(T,M+P*zo)}),i.forEach((T,P)=>{let[B,H,q]=T,Z=k+P*Do;I.writeUInt32LE(B,Z),I.writeUInt32LE(H,Z+4),I.writeUInt32LE(q!==null?q.offset:0,Z+8)}),o.forEach((T,P)=>{let[B,H,q]=T,Z=S+P*Uo;I.writeUInt16LE(B,Z),I.writeUInt16LE(H,Z+2),I.writeUInt32LE(q,Z+4)}),s.forEach((T,P)=>{let[B,H,q]=T,Z=j+P*Bo;I.writeUInt16LE(B,Z),I.writeUInt16LE(H,Z+2),I.writeUInt32LE(q,Z+4)}),n.forEach((T,P)=>{let{interfaces:B,annotationsDirectory:H}=T,q=B!==null?B.offset:0,Z=H!==null?H.offset:0,nt=0,ge=R+P*Fo;I.writeUInt32LE(T.index,ge),I.writeUInt32LE(T.accessFlags,ge+4),I.writeUInt32LE(T.superClassIndex,ge+8),I.writeUInt32LE(q,ge+12),I.writeUInt32LE(T.sourceFileIndex,ge+16),I.writeUInt32LE(Z,ge+20),I.writeUInt32LE(T.classData.offset,ge+24),I.writeUInt32LE(nt,ge+28)}),c.forEach((T,P)=>{let{items:B}=T,H=F[P];I.writeUInt32LE(B.length,H),B.forEach((q,Z)=>{I.writeUInt32LE(q.offset,H+4+Z*4)})}),z.forEach((T,P)=>{let{offset:B,superConstructor:H}=T,q=1,Z=1,nt=1,ge=0,Et=4;I.writeUInt16LE(q,B),I.writeUInt16LE(Z,B+2),I.writeUInt16LE(nt,B+4),I.writeUInt16LE(ge,B+6),I.writeUInt32LE(se[P],B+8),I.writeUInt32LE(Et,B+12),I.writeUInt16LE(4208,B+16),I.writeUInt16LE(H,B+18),I.writeUInt16LE(0,B+20),I.writeUInt16LE(14,B+22)}),a.forEach(T=>{let P=T.offset,B=0,H=0,q=T.methods.length,Z=0;I.writeUInt32LE(B,P),I.writeUInt32LE(H,P+4),I.writeUInt32LE(q,P+8),I.writeUInt32LE(Z,P+12),T.methods.forEach((nt,ge)=>{let Et=P+16+ge*8,[ys,Es]=nt;I.writeUInt32LE(ys,Et),I.writeUInt32LE(Es.offset,Et+4)})}),r.forEach((T,P)=>{let B=X[P];I.writeUInt32LE(T.types.length,B),T.types.forEach((H,q)=>{I.writeUInt16LE(H,B+4+q*2)})}),l.forEach((T,P)=>{let B=te[P];I.writeUInt32LE(T.types.length,B),T.types.forEach((H,q)=>{I.writeUInt16LE(H,B+4+q*2)})}),ae.forEach((T,P)=>{T.copy(I,Q[P])}),se.forEach(T=>{Go.copy(I,T)}),Y.forEach((T,P)=>{T.copy(I,d[P].offset)}),ne.forEach((T,P)=>{T.copy(I,n[P].classData.offset)}),I.writeUInt32LE(Le,$);let le=[[Ed,1,_],[vd,f.length,C],[Sd,p.length,M],[wd,i.length,k]];o.length>0&&le.push([Id,o.length,S]),le.push([Cd,s.length,j]),le.push([Td,n.length,R]),c.forEach((T,P)=>{le.push([xd,T.items.length,F[P]])}),z.forEach(T=>{le.push([kd,1,T.offset])}),a.forEach(T=>{le.push([Rd,1,T.offset])}),he>0&&le.push([Ld,he,X.concat(te)[0]]),le.push([Md,f.length,Q[0]]),se.forEach(T=>{le.push([jd,1,T])}),d.forEach(T=>{le.push([Od,1,T.offset])}),n.forEach(T=>{le.push([Nd,1,T.classData.offset])}),le.push([Ad,1,$]),le.forEach((T,P)=>{let[B,H,q]=T,Z=$+4+P*Jo;I.writeUInt16LE(B,Z),I.writeUInt32LE(H,Z+4),I.writeUInt32LE(q,Z+8)});let Ar=new Checksum("sha1");return Ar.update(I.slice(g+b)),m.from(Ar.getDigest()).copy(I,g),I.writeUInt32LE(Kd(I,g),h),I}};function Vd(t){let{instanceFields:e,constructorMethods:n,virtualMethods:r}=t.classData;return m.from([0].concat(me(e.length)).concat(me(n.length)).concat(me(r.length)).concat(e.reduce((s,[i,l])=>s.concat(me(i)).concat(me(l)),[])).concat(n.reduce((s,[i,l,,a])=>s.concat(me(i)).concat(me(l)).concat(me(a||0)),[])).concat(r.reduce((s,[i,l])=>s.concat(me(i)).concat(me(l)).concat([0]),[])))}function Jd(t){let{thrownTypes:e}=t;return m.from([Dd].concat(me(t.type)).concat([1]).concat(me(t.value)).concat([Fd,e.length]).concat(e.reduce((n,r)=>(n.push(Pd,r),n),[])))}function Gd(t){let e=new Set,n=new Set,r={},o=[],s=[],i={},l=new Set,a=new Set;t.forEach(w=>{let{name:R,superClass:D,sourceFileName:U}=w;e.add("this"),e.add(R),n.add(R),e.add(D),n.add(D),e.add(U),w.interfaces.forEach(F=>{e.add(F),n.add(F)}),w.fields.forEach(F=>{let[z,X]=F;e.add(z),e.add(X),n.add(X),o.push([w.name,X,z])}),w.methods.some(([F])=>F==="<init>")||(w.methods.unshift(["<init>","V",[]]),l.add(R)),w.methods.forEach(F=>{let[z,X,te,ae=[],Q]=F;e.add(z);let se=c(X,te),Y=null;if(ae.length>0){let ne=ae.slice();ne.sort(),Y=ne.join("|");let we=i[Y];we===void 0&&(we={id:Y,types:ne},i[Y]=we),e.add(ar),n.add(ar),ae.forEach(tt=>{e.add(tt),n.add(tt)}),e.add("value")}if(s.push([w.name,se,z,Y,Q]),z==="<init>"){a.add(R+"|"+se);let ne=D+"|"+se;l.has(R)&&!a.has(ne)&&(s.push([D,se,z,null,0]),a.add(ne))}})});function c(w,R){let D=[w].concat(R),U=D.join("|");if(r[U]!==void 0)return U;e.add(w),n.add(w),R.forEach(z=>{e.add(z),n.add(z)});let F=D.map(Wd).join("");return e.add(F),r[U]=[U,F,w,R],U}let d=Array.from(e);d.sort();let p=d.reduce((w,R,D)=>(w[R]=D,w),{}),f=Array.from(n).map(w=>p[w]);f.sort($o);let u=f.reduce((w,R,D)=>(w[d[R]]=D,w),{}),_=Object.keys(r).map(w=>r[w]);_.sort(Hd);let h={},g=_.map(w=>{let[,R,D,U]=w,F;if(U.length>0){let z=U.join("|");F=h[z],F===void 0&&(F={types:U.map(X=>u[X]),offset:-1},h[z]=F)}else F=null;return[p[R],u[D],F]}),b=_.reduce((w,R,D)=>{let[U]=R;return w[U]=D,w},{}),E=Object.keys(h).map(w=>h[w]),C=o.map(w=>{let[R,D,U]=w;return[u[R],u[D],p[U]]});C.sort(Zd);let A=s.map(w=>{let[R,D,U,F,z]=w;return[u[R],b[D],p[U],F,z]});A.sort(qd);let M=Object.keys(i).map(w=>i[w]).map(w=>({id:w.id,type:u[ar],value:p.value,thrownTypes:w.types.map(R=>u[R]),offset:-1})),O=M.map(w=>({id:w.id,items:[w],offset:-1})),k=O.reduce((w,R,D)=>(w[R.id]=D,w),{}),N={},S=[],L=t.map(w=>{let R=u[w.name],D=gt,U=u[w.superClass],F,z=w.interfaces.map($=>u[$]);if(z.length>0){z.sort($o);let $=z.join("|");F=N[$],F===void 0&&(F={types:z,offset:-1},N[$]=F)}else F=null;let X=p[w.sourceFileName],te=A.reduce(($,he,Le)=>{let[Pe,je,Ge,I,le]=he;return Pe===R&&$.push([Le,Ge,I,je,le]),$},[]),ae=null,Q=te.filter(([,,$])=>$!==null).map(([$,,he])=>[$,O[k[he]]]);Q.length>0&&(ae={methods:Q,offset:-1},S.push(ae));let se=C.reduce(($,he,Le)=>{let[Pe]=he;return Pe===R&&$.push([Le>0?1:0,gt]),$},[]),Y=p["<init>"],ne=te.filter(([,$])=>$===Y).map(([$,,,he])=>{if(l.has(w.name)){let Le=-1,Pe=A.length;for(let je=0;je!==Pe;je++){let[Ge,I,le]=A[je];if(Ge===U&&le===Y&&I===he){Le=je;break}}return[$,gt|Po,Le]}else return[$,gt|Po|cr,-1]}),we=$d(te.filter(([,$])=>$!==Y).map(([$,,,,he])=>[$,he|gt|cr]));return{index:R,accessFlags:D,superClassIndex:U,interfaces:F,sourceFileIndex:X,annotationsDirectory:ae,classData:{instanceFields:se,constructorMethods:ne,virtualMethods:we,offset:-1}}}),j=Object.keys(N).map(w=>N[w]);return{classes:L,interfaces:j,fields:C,methods:A,protos:g,parameters:E,annotationDirectories:S,annotationSets:O,throwsAnnotations:M,types:f,strings:d}}function $d(t){let e=0;return t.map(([n,r],o)=>{let s;return o===0?s=[n,r]:s=[n-e,r],e=n,s})}function $o(t,e){return t-e}function Hd(t,e){let[,,n,r]=t,[,,o,s]=e;if(n<o)return-1;if(n>o)return 1;let i=r.join("|"),l=s.join("|");return i<l?-1:i>l?1:0}function Zd(t,e){let[n,r,o]=t,[s,i,l]=e;return n!==s?n-s:o!==l?o-l:r-i}function qd(t,e){let[n,r,o]=t,[s,i,l]=e;return n!==s?n-s:o!==l?o-l:r-i}function Wd(t){let e=t[0];return e==="L"||e==="["?"L":t}function me(t){if(t<=127)return[t];let e=[],n=!1;do{let r=t&127;t>>=7,n=t!==0,n&&(r|=128),e.push(r)}while(n);return e}function lr(t,e){let n=t%e;return n===0?t:t+e-n}function Kd(t,e){let n=1,r=0,o=t.length;for(let s=e;s<o;s++)n=(n+t[s])%65521,r=(r+n)%65521;return(r<<16|n)>>>0}var Ho=zd;var Qd=1,ur=null,Zo=null;function qo(t){ur=t}function pr(t,e,n){let r=Qe(t);return r===null&&(t.indexOf("[")===0?r=fr(t,e,n):(t[0]==="L"&&t[t.length-1]===";"&&(t=t.substring(1,t.length-1)),r=Xd(t,e,n))),Object.assign({className:t},r)}var Wo={boolean:{name:"Z",type:"uint8",size:1,byteSize:1,defaultValue:!1,isCompatible(t){return typeof t=="boolean"},fromJni(t){return!!t},toJni(t){return t?1:0},read(t){return t.readU8()},write(t,e){t.writeU8(e)},toString(){return this.name}},byte:{name:"B",type:"int8",size:1,byteSize:1,defaultValue:0,isCompatible(t){return Number.isInteger(t)&&t>=-128&&t<=127},fromJni:ve,toJni:ve,read(t){return t.readS8()},write(t,e){t.writeS8(e)},toString(){return this.name}},char:{name:"C",type:"uint16",size:1,byteSize:2,defaultValue:0,isCompatible(t){if(typeof t!="string"||t.length!==1)return!1;let e=t.charCodeAt(0);return e>=0&&e<=65535},fromJni(t){return String.fromCharCode(t)},toJni(t){return t.charCodeAt(0)},read(t){return t.readU16()},write(t,e){t.writeU16(e)},toString(){return this.name}},short:{name:"S",type:"int16",size:1,byteSize:2,defaultValue:0,isCompatible(t){return Number.isInteger(t)&&t>=-32768&&t<=32767},fromJni:ve,toJni:ve,read(t){return t.readS16()},write(t,e){t.writeS16(e)},toString(){return this.name}},int:{name:"I",type:"int32",size:1,byteSize:4,defaultValue:0,isCompatible(t){return Number.isInteger(t)&&t>=-2147483648&&t<=2147483647},fromJni:ve,toJni:ve,read(t){return t.readS32()},write(t,e){t.writeS32(e)},toString(){return this.name}},long:{name:"J",type:"int64",size:2,byteSize:8,defaultValue:0,isCompatible(t){return typeof t=="number"||t instanceof Int64},fromJni:ve,toJni:ve,read(t){return t.readS64()},write(t,e){t.writeS64(e)},toString(){return this.name}},float:{name:"F",type:"float",size:1,byteSize:4,defaultValue:0,isCompatible(t){return typeof t=="number"},fromJni:ve,toJni:ve,read(t){return t.readFloat()},write(t,e){t.writeFloat(e)},toString(){return this.name}},double:{name:"D",type:"double",size:2,byteSize:8,defaultValue:0,isCompatible(t){return typeof t=="number"},fromJni:ve,toJni:ve,read(t){return t.readDouble()},write(t,e){t.writeDouble(e)},toString(){return this.name}},void:{name:"V",type:"void",size:0,byteSize:0,defaultValue:void 0,isCompatible(t){return t===void 0},fromJni(){},toJni(){return NULL},toString(){return this.name}}},Yd=new Set(Object.values(Wo).map(t=>t.name));function Qe(t){let e=Wo[t];return e!==void 0?e:null}function Xd(t,e,n){let r=n._types[e?1:0],o=r[t];return o!==void 0||(t==="java.lang.Object"?o=eu(n):o=tu(t,e,n),r[t]=o),o}function eu(t){return{name:"Ljava/lang/Object;",type:"pointer",size:1,defaultValue:NULL,isCompatible(e){return e===null?!0:e===void 0?!1:e.$h instanceof NativePointer?!0:typeof e=="string"},fromJni(e,n,r){return e.isNull()?null:t.cast(e,t.use("java.lang.Object"),r)},toJni(e,n){return e===null?NULL:typeof e=="string"?n.newStringUtf(e):e.$h}}}function tu(t,e,n){let r=null,o=null,s=null;function i(){return r===null&&(r=n.use(t).class),r}function l(c){let d=i();return o===null&&(o=d.isInstance.overload("java.lang.Object")),o.call(d,c)}function a(){if(s===null){let c=i();s=n.use("java.lang.String").class.isAssignableFrom(c)}return s}return{name:Ve(t),type:"pointer",size:1,defaultValue:NULL,isCompatible(c){return c===null?!0:c===void 0?!1:c.$h instanceof NativePointer?l(c):typeof c=="string"&&a()},fromJni(c,d,p){return c.isNull()?null:a()&&e?d.stringFromJni(c):n.cast(c,n.use(t),p)},toJni(c,d){return c===null?NULL:typeof c=="string"?d.newStringUtf(c):c.$h},toString(){return this.name}}}var nu=[["Z","boolean"],["B","byte"],["C","char"],["D","double"],["F","float"],["I","int"],["J","long"],["S","short"]].reduce((t,[e,n])=>(t["["+e]=ru("["+e,n),t),{});function ru(t,e){let n=y.prototype,r=lu(e),o={typeName:e,newArray:n["new"+r+"Array"],setRegion:n["set"+r+"ArrayRegion"],getElements:n["get"+r+"ArrayElements"],releaseElements:n["release"+r+"ArrayElements"]};return{name:t,type:"pointer",size:1,defaultValue:NULL,isCompatible(s){return au(s,e)},fromJni(s,i,l){return su(s,o,i,l)},toJni(s,i){return iu(s,o,i)}}}function fr(t,e,n){let r=nu[t];if(r!==void 0)return r;if(t.indexOf("[")!==0)throw new Error("Unsupported type: "+t);let o=t.substring(1),s=pr(o,e,n),i=0,l=o.length;for(;i!==l&&o[i]==="[";)i++;o=o.substring(i),o[0]==="L"&&o[o.length-1]===";"&&(o=o.substring(1,o.length-1));let a=o.replace(/\./g,"/");Yd.has(a)?a="[".repeat(i)+a:a="[".repeat(i)+"L"+a+";";let c="["+a;return o="[".repeat(i)+o,{name:t.replace(/\./g,"/"),type:"pointer",size:1,defaultValue:NULL,isCompatible(d){return d===null?!0:typeof d!="object"||d.length===void 0?!1:d.every(function(p){return s.isCompatible(p)})},fromJni(d,p,f){if(d.isNull())return null;let u=[],_=p.getArrayLength(d);for(let h=0;h!==_;h++){let g=p.getObjectArrayElement(d,h);try{u.push(s.fromJni(g,p))}finally{p.deleteLocalRef(g)}}try{u.$w=n.cast(d,n.use(c),f)}catch{n.use("java.lang.reflect.Array").newInstance(n.use(o).class,0),u.$w=n.cast(d,n.use(c),f)}return u.$dispose=ou,u},toJni(d,p){if(d===null)return NULL;if(!(d instanceof Array))throw new Error("Expected an array");let f=d.$w;if(f!==void 0)return f.$h;let u=d.length,h=n.use(o).$borrowClassHandle(p);try{let g=p.newObjectArray(u,h.value,NULL);p.throwIfExceptionPending();for(let b=0;b!==u;b++){let E=s.toJni(d[b],p);try{p.setObjectArrayElement(g,b,E)}finally{s.type==="pointer"&&p.getObjectRefType(E)===Qd&&p.deleteLocalRef(E)}p.throwIfExceptionPending()}return g}finally{h.unref(p)}}}}function ou(){let t=this.length;for(let e=0;e!==t;e++){let n=this[e];if(n===null)continue;let r=n.$dispose;if(r===void 0)break;r.call(n)}this.$w.$dispose()}function su(t,e,n,r){if(t.isNull())return null;let o=Qe(e.typeName),s=n.getArrayLength(t);return new Vt(t,e,o,s,n,r)}function iu(t,e,n){if(t===null)return NULL;let r=t.$h;if(r!==void 0)return r;let o=t.length,s=Qe(e.typeName),i=e.newArray.call(n,o);if(i.isNull())throw new Error("Unable to construct array");if(o>0){let l=s.byteSize,a=s.write,c=s.toJni,d=Memory.alloc(o*s.byteSize);for(let p=0;p!==o;p++)a(d.add(p*l),c(t[p]));e.setRegion.call(n,i,0,o,d),n.throwIfExceptionPending()}return i}function au(t,e){if(t===null)return!0;if(t instanceof Vt)return t.$s.typeName===e;if(!(typeof t=="object"&&t.length!==void 0))return!1;let r=Qe(e);return Array.prototype.every.call(t,o=>r.isCompatible(o))}function Vt(t,e,n,r,o,s=!0){if(s){let i=o.newGlobalRef(t);this.$h=i,this.$r=Script.bindWeak(this,o.vm.makeHandleDestructor(i))}else this.$h=t,this.$r=null;return this.$s=e,this.$t=n,this.length=r,new Proxy(this,Zo)}Zo={has(t,e){return e in t?!0:t.tryParseIndex(e)!==null},get(t,e,n){let r=t.tryParseIndex(e);return r===null?t[e]:t.readElement(r)},set(t,e,n,r){let o=t.tryParseIndex(e);return o===null?(t[e]=n,!0):(t.writeElement(o,n),!0)},ownKeys(t){let e=[],{length:n}=t;for(let r=0;r!==n;r++){let o=r.toString();e.push(o)}return e.push("length"),e},getOwnPropertyDescriptor(t,e){return t.tryParseIndex(e)!==null?{writable:!0,configurable:!0,enumerable:!0}:Object.getOwnPropertyDescriptor(t,e)}};Object.defineProperties(Vt.prototype,{$dispose:{enumerable:!0,value(){let t=this.$r;t!==null&&(this.$r=null,Script.unbindWeak(t))}},$clone:{value(t){return new Vt(this.$h,this.$s,this.$t,this.length,t)}},tryParseIndex:{value(t){if(typeof t=="symbol")return null;let e=parseInt(t);return isNaN(e)||e<0||e>=this.length?null:e}},readElement:{value(t){return this.withElements(e=>{let n=this.$t;return n.fromJni(n.read(e.add(t*n.byteSize)))})}},writeElement:{value(t,e){let{$h:n,$s:r,$t:o}=this,s=ur.getEnv(),i=Memory.alloc(o.byteSize);o.write(i,o.toJni(e)),r.setRegion.call(s,n,t,1,i)}},withElements:{value(t){let{$h:e,$s:n}=this,r=ur.getEnv(),o=n.getElements.call(r,e);if(o.isNull())throw new Error("Unable to get array elements");try{return t(o)}finally{n.releaseElements.call(r,e,o)}}},toJSON:{value(){let{length:t,$t:e}=this,{byteSize:n,fromJni:r,read:o}=e;return this.withElements(s=>{let i=[];for(let l=0;l!==t;l++){let a=r(o(s.add(l*n)));i.push(a)}return i})}},toString:{value(){return this.toJSON().toString()}}});function Ve(t){return"L"+t.replace(/\./g,"/")+";"}function lu(t){return t.charAt(0).toUpperCase()+t.slice(1)}function ve(t){return t}var cu=4,{ensureClassInitialized:Ko,makeMethodMangler:ns}=Bt,du=8,mr=1,yt=2,Me=3,hr=1,gr=2,Jt=1,rs=2,Qo=Symbol("PENDING_USE"),Yo="/data/local/tmp",{getCurrentThreadId:$t,pointerSize:bt}=Process,ue={state:"empty",factories:[],loaders:null,Integer:null},G=null,K=null,os=null,ss=null,is=null,as=null,ls=null,Xo=null,_r=null,Xe=new Map,Re=class t{static _initialize(e,n){G=e,K=n,os=n.flavor==="art",n.flavor==="jvm"&&(Ko=xo,ns=ko)}static _disposeAll(e){ue.factories.forEach(n=>{n._dispose(e)})}static get(e){let n=Nu(),r=n.factories[0];if(e===null)return r;let o=n.loaders.get(e);if(o!==null){let i=r.cast(o,n.Integer);return n.factories[i.intValue()]}let s=new t;return s.loader=e,s.cacheDir=r.cacheDir,Er(s,e),s}constructor(){this.cacheDir=Yo,this.codeCacheDir=Yo+"/dalvik-cache",this.tempFileNaming={prefix:"frida",suffix:""},this._classes={},this._classHandles=new mt(10,pu),this._patchedMethods=new Set,this._loader=null,this._types=[{},{}],ue.factories.push(this)}_dispose(e){Array.from(this._patchedMethods).forEach(n=>{n.implementation=null}),this._patchedMethods.clear(),Qn(),this._classHandles.dispose(e),this._classes={}}get loader(){return this._loader}set loader(e){let n=this._loader===null&&e!==null;this._loader=e,n&&ue.state==="ready"&&this===ue.factories[0]&&Er(this,e)}use(e,n={}){let r=n.cache!=="skip",o=r?this._getUsedClass(e):void 0;if(o===void 0)try{let s=G.getEnv(),{_loader:i}=this,l=i!==null?hu(e,i,s):fu(e);o=this._make(e,l,s)}finally{r&&this._setUsedClass(e,o)}return o}_getUsedClass(e){let n;for(;(n=this._classes[e])===Qo;)Thread.sleep(.05);return n===void 0&&(this._classes[e]=Qo),n}_setUsedClass(e,n){n!==void 0?this._classes[e]=n:delete this._classes[e]}_make(e,n,r){let o=uu(),s=Object.create(Sr.prototype,{[Symbol.for("n")]:{value:e},$n:{get(){return this[Symbol.for("n")]}},[Symbol.for("C")]:{value:o},$C:{get(){return this[Symbol.for("C")]}},[Symbol.for("w")]:{value:null,writable:!0},$w:{get(){return this[Symbol.for("w")]},set(a){this[Symbol.for("w")]=a}},[Symbol.for("_s")]:{writable:!0},$_s:{get(){return this[Symbol.for("_s")]},set(a){this[Symbol.for("_s")]=a}},[Symbol.for("c")]:{value:[null]},$c:{get(){return this[Symbol.for("c")]}},[Symbol.for("m")]:{value:new Map},$m:{get(){return this[Symbol.for("m")]}},[Symbol.for("l")]:{value:null,writable:!0},$l:{get(){return this[Symbol.for("l")]},set(a){this[Symbol.for("l")]=a}},[Symbol.for("gch")]:{value:n},$gch:{get(){return this[Symbol.for("gch")]}},[Symbol.for("f")]:{value:this},$f:{get(){return this[Symbol.for("f")]}}});o.prototype=s;let i=new o(null);s[Symbol.for("w")]=i,s.$w=i;let l=i.$borrowClassHandle(r);try{let a=l.value;Ko(r,a),s.$l=ze.build(a,r)}finally{l.unref(r)}return i}retain(e){let n=G.getEnv();return e.$clone(n)}cast(e,n,r){let o=G.getEnv(),s=e.$h;s===void 0&&(s=e);let i=n.$borrowClassHandle(o);try{if(!o.isInstanceOf(s,i.value))throw new Error(`Cast from '${o.getObjectClassName(s)}' to '${n.$n}' isn't possible`)}finally{i.unref(o)}let l=n.$C;return new l(s,Jt,o,r)}wrap(e,n,r){let o=n.$C,s=new o(e,Jt,r,!1);return s.$r=Script.bindWeak(s,G.makeHandleDestructor(e)),s}array(e,n){let r=G.getEnv(),o=Qe(e);o!==null&&(e=o.name);let s=fr("["+e,!1,this),i=s.toJni(n,r);return s.fromJni(i,r,!0)}registerClass(e){let n=G.getEnv(),r=[];try{let o=this.use("java.lang.Class"),s=n.javaLangReflectMethod(),i=n.vaMethod("pointer",[]),l=e.name,a=e.implements||[],c=e.superClass||this.use("java.lang.Object"),d=[],p=[],f={name:Ve(l),sourceFileName:Mu(l),superClass:Ve(c.$n),interfaces:a.map(S=>Ve(S.$n)),fields:d,methods:p},u=a.slice();a.forEach(S=>{Array.prototype.slice.call(S.class.getInterfaces()).forEach(L=>{let j=this.cast(L,o).getCanonicalName();u.push(this.use(j))})});let _=e.fields||{};Object.getOwnPropertyNames(_).forEach(S=>{let L=this._getType(_[S]);d.push([S,L.name])});let h={},g={};u.forEach(S=>{let L=S.$borrowClassHandle(n);r.push(L);let j=L.value;S.$ownMembers.filter(w=>S[w].overloads!==void 0).forEach(w=>{let R=S[w],D=R.overloads,U=D.map(F=>es(w,F.returnType,F.argumentTypes));h[w]=[R,U,j],D.forEach((F,z)=>{let X=U[z];g[X]=[F,j]})})});let b=e.methods||{},C=Object.keys(b).reduce((S,L)=>{let j=b[L],w=L==="$init"?"<init>":L;return j instanceof Array?S.push(...j.map(R=>[w,R])):S.push([w,j]),S},[]),A=[];C.forEach(([S,L])=>{let j=Me,w,R,D=[],U;if(typeof L=="function"){let te=h[S];if(te!==void 0&&Array.isArray(te)){let[ae,Q,se]=te;if(Q.length>1)throw new Error(`More than one overload matching '${S}': signature must be specified`);delete g[Q[0]];let Y=ae.overloads[0];j=Y.type,w=Y.returnType,R=Y.argumentTypes,U=L;let ne=n.toReflectedMethod(se,Y.handle,0),we=i(n.handle,ne,s.getGenericExceptionTypes);D=vr(n,we).map(Ve),n.deleteLocalRef(we),n.deleteLocalRef(ne)}else w=this._getType("void"),R=[],U=L}else{if(L.isStatic&&(j=yt),w=this._getType(L.returnType||"void"),R=(L.argumentTypes||[]).map(Q=>this._getType(Q)),U=L.implementation,typeof U!="function")throw new Error("Expected a function implementation for method: "+S);let te=es(S,w,R),ae=g[te];if(ae!==void 0){let[Q,se]=ae;delete g[te],j=Q.type,w=Q.returnType,R=Q.argumentTypes;let Y=n.toReflectedMethod(se,Q.handle,0),ne=i(n.handle,Y,s.getGenericExceptionTypes);D=vr(n,ne).map(Ve),n.deleteLocalRef(ne),n.deleteLocalRef(Y)}}let F=w.name,z=R.map(te=>te.name),X="("+z.join("")+")"+F;p.push([S,F,z,D,j===yt?du:0]),A.push([S,X,j,w,R,U])});let M=Object.keys(g);if(M.length>0)throw new Error("Missing implementation for: "+M.join(", "));let O=Gt.fromBuffer(Ho(f),this);try{O.load()}finally{O.file.delete()}let k=this.use(e.name),N=C.length;if(N>0){let S=3*bt,L=Memory.alloc(N*S),j=[],w=[];A.forEach(([U,F,z,X,te,ae],Q)=>{let se=Memory.allocUtf8String(U),Y=Memory.allocUtf8String(F),ne=cs(U,k,z,X,te,ae);L.add(Q*S).writePointer(se),L.add(Q*S+bt).writePointer(Y),L.add(Q*S+2*bt).writePointer(ne),w.push(se,Y),j.push(ne)});let R=k.$borrowClassHandle(n);r.push(R);let D=R.value;n.registerNatives(D,L,N),n.throwIfExceptionPending(),k.$nativeMethods=j}return k}finally{r.forEach(o=>{o.unref(n)})}}choose(e,n){let r=G.getEnv(),{flavor:o}=K;if(o==="jvm")this._chooseObjectsJvm(e,r,n);else if(o==="art"){let s=K["art::gc::Heap::VisitObjects"]===void 0;if(s&&K["art::gc::Heap::GetInstances"]===void 0)return this._chooseObjectsJvm(e,r,n);ye(G,r,i=>{s?this._chooseObjectsArtPreA12(e,r,i,n):this._chooseObjectsArtLegacy(e,r,i,n)})}else this._chooseObjectsDalvik(e,r,n)}_chooseObjectsJvm(e,n,r){let o=this.use(e),{jvmti:s}=K,i=1,l=3,a=o.$borrowClassHandle(n),c=int64(a.value.toString());try{let d=new NativeCallback((b,E,C,A)=>(C.writeS64(c),i),"int",["int64","int64","pointer","pointer"]);s.iterateOverInstancesOfClass(a.value,l,d,a.value);let p=Memory.alloc(8);p.writeS64(c);let f=Memory.alloc(cu),u=Memory.alloc(bt);s.getObjectsWithTags(1,p,f,u,NULL);let _=f.readS32(),h=u.readPointer(),g=[];for(let b=0;b!==_;b++)g.push(h.add(b*bt).readPointer());s.deallocate(h);try{for(let b of g){let E=this.cast(b,o);if(r.onMatch(E)==="stop")break}r.onComplete()}finally{g.forEach(b=>{n.deleteLocalRef(b)})}}finally{a.unref(n)}}_chooseObjectsArtPreA12(e,n,r,o){let s=this.use(e),i=pt.$new(r,G),l,a=s.$borrowClassHandle(n);try{let f=K["art::JavaVMExt::DecodeGlobal"](K.vm,r,a.value);l=i.newHandle(f)}finally{a.unref(n)}let c=0,d=ut.$new();K["art::gc::Heap::GetInstances"](K.artHeap,i,l,c,d);let p=d.handles.map(f=>n.newGlobalRef(f));d.$delete(),i.$delete();try{for(let f of p){let u=this.cast(f,s);if(o.onMatch(u)==="stop")break}o.onComplete()}finally{p.forEach(f=>{n.deleteGlobalRef(f)})}}_chooseObjectsArtLegacy(e,n,r,o){let s=this.use(e),i=[],l=K["art::JavaVMExt::AddGlobalRef"],a=K.vm,c,d=s.$borrowClassHandle(n);try{c=K["art::JavaVMExt::DecodeGlobal"](a,r,d.value).toInt32()}finally{d.unref(n)}let p=rr(c,f=>{i.push(l(a,r,f))});K["art::gc::Heap::VisitObjects"](K.artHeap,p,NULL);try{for(let f of i){let u=this.cast(f,s);if(o.onMatch(u)==="stop")break}}finally{i.forEach(f=>{n.deleteGlobalRef(f)})}o.onComplete()}_chooseObjectsDalvik(e,n,r){let o=this.use(e);if(K.addLocalReference===null){let i=Process.getModuleByName("libdvm.so"),l;switch(Process.arch){case"arm":l="2d e9 f0 41 05 46 15 4e 0c 46 7e 44 11 b3 43 68";break;case"ia32":l="8d 64 24 d4 89 5c 24 1c 89 74 24 20 e8 ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? 85 d2";break}Memory.scan(i.base,i.size,l,{onMatch:(a,c)=>{let d;if(Process.arch==="arm")a=a.or(1),d=new NativeFunction(a,"pointer",["pointer","pointer"]);else{let p=Memory.alloc(Process.pageSize);Memory.patchCode(p,16,f=>{let u=new X86Writer(f,{pc:p});u.putMovRegRegOffsetPtr("eax","esp",4),u.putMovRegRegOffsetPtr("edx","esp",8),u.putJmpAddress(a),u.flush()}),d=new NativeFunction(p,"pointer",["pointer","pointer"]),d._thunk=p}return K.addLocalReference=d,G.perform(p=>{s(this,p)}),"stop"},onError(a){},onComplete(){K.addLocalReference===null&&r.onComplete()}})}else s(this,n);function s(i,l){let{DVM_JNI_ENV_OFFSET_SELF:a}=Bt,c=l.handle.add(a).readPointer(),d,p=o.$borrowClassHandle(l);try{d=K.dvmDecodeIndirectRef(c,p.value)}finally{p.unref(l)}let f=d.toMatchPattern(),u=K.dvmHeapSourceGetBase(),h=K.dvmHeapSourceGetLimit().sub(u).toInt32();Memory.scan(u,h,f,{onMatch:(g,b)=>{K.dvmIsValidObject(g)&&G.perform(E=>{let C=E.handle.add(a).readPointer(),A,M=K.addLocalReference(C,g);try{A=i.cast(M,o)}finally{E.deleteLocalRef(M)}if(r.onMatch(A)==="stop")return"stop"})},onError(g){},onComplete(){r.onComplete()}})}}openClassFile(e){return new Gt(e,null,this)}_getType(e,n=!0){return pr(e,n,this)}};function uu(){return function(t,e,n,r){return Sr.call(this,t,e,n,r)}}function Sr(t,e,n,r=!0){if(t!==null)if(r){let o=n.newGlobalRef(t);this.$h=o,this.$r=Script.bindWeak(this,G.makeHandleDestructor(o))}else this.$h=t,this.$r=null;else this.$h=null,this.$r=null;return this.$t=e,new Proxy(this,ss)}ss={has(t,e){return e in t?!0:t.$has(e)},get(t,e,n){if(typeof e!="string"||e.startsWith("$")||e==="class")return t[e];let r=t.$find(e);return r!==null?r(n):t[e]},set(t,e,n,r){return t[e]=n,!0},ownKeys(t){return t.$list()},getOwnPropertyDescriptor(t,e){return Object.prototype.hasOwnProperty.call(t,e)?Object.getOwnPropertyDescriptor(t,e):{writable:!1,configurable:!0,enumerable:!0}}};Object.defineProperties(Sr.prototype,{[Symbol.for("new")]:{enumerable:!1,get(){return this.$getCtor("allocAndInit")}},$new:{enumerable:!0,get(){return this[Symbol.for("new")]}},[Symbol.for("alloc")]:{enumerable:!1,value(){let t=G.getEnv(),e=this.$borrowClassHandle(t);try{let n=t.allocObject(e.value);return this.$f.cast(n,this)}finally{e.unref(t)}}},$alloc:{enumerable:!0,get(){return this[Symbol.for("alloc")]}},[Symbol.for("init")]:{enumerable:!1,get(){return this.$getCtor("initOnly")}},$init:{enumerable:!0,get(){return this[Symbol.for("init")]}},[Symbol.for("dispose")]:{enumerable:!1,value(){let t=this.$r;t!==null&&(this.$r=null,Script.unbindWeak(t)),this.$h!==null&&(this.$h=void 0)}},$dispose:{enumerable:!0,get(){return this[Symbol.for("dispose")]}},[Symbol.for("clone")]:{enumerable:!1,value(t){let e=this.$C;return new e(this.$h,this.$t,t)}},$clone:{value(t){return this[Symbol.for("clone")](t)}},[Symbol.for("class")]:{enumerable:!1,get(){let t=G.getEnv(),e=this.$borrowClassHandle(t);try{let n=this.$f;return n.cast(e.value,n.use("java.lang.Class"))}finally{e.unref(t)}}},class:{enumerable:!0,get(){return this[Symbol.for("class")]}},[Symbol.for("className")]:{enumerable:!1,get(){let t=this.$h;return t===null?this.$n:G.getEnv().getObjectClassName(t)}},$className:{enumerable:!0,get(){return this[Symbol.for("className")]}},[Symbol.for("ownMembers")]:{enumerable:!1,get(){return this.$l.list()}},$ownMembers:{enumerable:!0,get(){return this[Symbol.for("ownMembers")]}},[Symbol.for("super")]:{enumerable:!1,get(){let t=G.getEnv(),e=this.$s.$C;return new e(this.$h,rs,t)}},$super:{enumerable:!0,get(){return this[Symbol.for("super")]}},[Symbol.for("s")]:{enumerable:!1,get(){let t=Object.getPrototypeOf(this),e=t.$_s;if(e===void 0){let n=G.getEnv(),r=this.$borrowClassHandle(n);try{let o=n.getSuperclass(r.value);if(o.isNull())e=null;else try{let s=n.getClassName(o),i=t.$f;if(e=i._getUsedClass(s),e===void 0)try{let l=_u(this);e=i._make(s,l,n)}finally{i._setUsedClass(s,e)}}finally{n.deleteLocalRef(o)}}finally{r.unref(n)}t.$_s=e}return e}},$s:{get(){return this[Symbol.for("s")]}},[Symbol.for("isSameObject")]:{enumerable:!1,value(t){return G.getEnv().isSameObject(t.$h,this.$h)}},$isSameObject:{value(t){return this[Symbol.for("isSameObject")](t)}},[Symbol.for("getCtor")]:{enumerable:!1,value(t){let e=this.$c,n=e[0];if(n===null){let r=G.getEnv(),o=this.$borrowClassHandle(r);try{n=mu(o.value,this.$w,r),e[0]=n}finally{o.unref(r)}}return n[t]}},$getCtor:{value(t){return this[Symbol.for("getCtor")](t)}},[Symbol.for("borrowClassHandle")]:{enumerable:!1,value(t){let e=this.$n,n=this.$f._classHandles,r=n.get(e);return r===void 0&&(r=new wr(this.$gch(t),t),n.set(e,r,t)),r.ref()}},$borrowClassHandle:{value(t){return this[Symbol.for("borrowClassHandle")](t)}},[Symbol.for("copyClassHandle")]:{enumerable:!1,value(t){let e=this.$borrowClassHandle(t);try{return t.newLocalRef(e.value)}finally{e.unref(t)}}},$copyClassHandle:{value(t){return this[Symbol.for("copyClassHandle")](t)}},[Symbol.for("getHandle")]:{enumerable:!1,value(t){let e=this.$h;if(e===void 0)throw new Error("Wrapper is disposed; perhaps it was borrowed from a hook instead of calling Java.retain() to make a long-lived wrapper?");return e}},$getHandle:{value(t){return this[Symbol.for("getHandle")](t)}},[Symbol.for("list")]:{enumerable:!1,value(){let t=this.$s,e=t!==null?t.$list():[],n=this.$l;return Array.from(new Set(e.concat(n.list())))}},$list:{get(){return this[Symbol.for("list")]}},[Symbol.for("has")]:{enumerable:!1,value(t){if(this.$m.has(t)||this.$l.has(t))return!0;let r=this.$s;return!!(r!==null&&r.$has(t))}},$has:{value(t){return this[Symbol.for("has")](t)}},[Symbol.for("find")]:{enumerable:!1,value(t){let e=this.$m,n=e.get(t);if(n!==void 0)return n;let o=this.$l.find(t);if(o!==null){let i=G.getEnv(),l=this.$borrowClassHandle(i);try{n=gu(t,o,l.value,this.$w,i)}finally{l.unref(i)}return e.set(t,n),n}let s=this.$s;return s!==null?s.$find(t):null}},$find:{value(t){return this[Symbol.for("find")](t)}},[Symbol.for("toJSON")]:{enumerable:!1,value(){let t=this.$n;if(this.$h===null)return`<class: ${t}>`;let n=this.$className;return t===n?`<instance: ${t}>`:`<instance: ${t}, $className: ${n}>`}},toJSON:{get(){return this[Symbol.for("toJSON")]}}});function wr(t,e){this.value=e.newGlobalRef(t),e.deleteLocalRef(t),this.refs=1}wr.prototype.ref=function(){return this.refs++,this};wr.prototype.unref=function(t){--this.refs===0&&t.deleteGlobalRef(this.value)};function pu(t,e){t.unref(e)}function fu(t){let e=t.replace(/\./g,"/");return function(n){let r=$t();us(r);try{return n.findClass(e)}finally{ps(r)}}}function hu(t,e,n){return _r===null&&(Xo=n.vaMethod("pointer",["pointer"]),_r=e.loadClass.overload("java.lang.String").handle),n=null,function(r){let o=r.newStringUtf(t),s=$t();us(s);try{let i=Xo(r.handle,e.$h,_r,o);return r.throwIfExceptionPending(),i}finally{ps(s),r.deleteLocalRef(o)}}}function _u(t){return function(e){let n=t.$borrowClassHandle(e);try{return e.getSuperclass(n.value)}finally{n.unref(e)}}}function mu(t,e,n){let{$n:r,$f:o}=e,s=ku(r),i=n.javaLangClass(),l=n.javaLangReflectConstructor(),a=n.vaMethod("pointer",[]),c=n.vaMethod("uint8",[]),d=[],p=[],f=o._getType(r,!1),u=o._getType("void",!1),_=a(n.handle,t,i.getDeclaredConstructors);try{let h=n.getArrayLength(_);if(h!==0)for(let g=0;g!==h;g++){let b,E,C=n.getObjectArrayElement(_,g);try{b=n.fromReflectedMethod(C),E=a(n.handle,C,l.getGenericParameterTypes)}finally{n.deleteLocalRef(C)}let A;try{A=vr(n,E).map(M=>o._getType(M))}finally{n.deleteLocalRef(E)}d.push(Ye(s,e,mr,b,f,A,n)),p.push(Ye(s,e,Me,b,u,A,n))}else{if(c(n.handle,t,i.isInterface))throw new Error("cannot instantiate an interface");let b=n.javaLangObject(),E=n.getMethodId(b,"<init>","()V");d.push(Ye(s,e,mr,E,f,[],n)),p.push(Ye(s,e,Me,E,u,[],n))}}finally{n.deleteLocalRef(_)}if(p.length===0)throw new Error("no supported overloads");return{allocAndInit:br(d),initOnly:br(p)}}function gu(t,e,n,r,o){return e.startsWith("m")?bu(t,e,n,r,o):Au(t,e,n,r,o)}function bu(t,e,n,r,o){let{$f:s}=r,i=e.split(":").slice(1),l=o.javaLangReflectMethod(),a=o.vaMethod("pointer",[]),c=o.vaMethod("uint8",[]),d=i.map(f=>{let u=f[0]==="s"?yt:Me,_=ptr(f.substr(1)),h,g=[],b=o.toReflectedMethod(n,_,u===yt?1:0);try{let E=!!c(o.handle,b,l.isVarArgs),C=a(o.handle,b,l.getGenericReturnType);o.throwIfExceptionPending();try{h=s._getType(o.getTypeName(C))}finally{o.deleteLocalRef(C)}let A=a(o.handle,b,l.getParameterTypes);try{let M=o.getArrayLength(A);for(let O=0;O!==M;O++){let k=o.getObjectArrayElement(A,O),N;try{N=E&&O===M-1?o.getArrayTypeName(k):o.getTypeName(k)}finally{o.deleteLocalRef(k)}let S=s._getType(N);g.push(S)}}finally{o.deleteLocalRef(A)}}catch{return null}finally{o.deleteLocalRef(b)}return Ye(t,r,u,_,h,g,o)}).filter(f=>f!==null);if(d.length===0)throw new Error("No supported overloads");t==="valueOf"&&Iu(d);let p=br(d);return function(f){return p}}function br(t){let e=yu();return Object.setPrototypeOf(e,is),e._o=t,e}function yu(){let t=function(){return t.invoke(this,arguments)};return t}is=Object.create(Function.prototype,{overloads:{enumerable:!0,get(){return this._o}},overload:{value(...t){let e=this._o,n=t.length,r=t.join(":");for(let o=0;o!==e.length;o++){let s=e[o],{argumentTypes:i}=s;if(i.length!==n)continue;if(i.map(a=>a.className).join(":")===r)return s}yr(this.methodName,this.overloads,"specified argument types do not match any of:")}},methodName:{enumerable:!0,get(){return this._o[0].methodName}},holder:{enumerable:!0,get(){return this._o[0].holder}},type:{enumerable:!0,get(){return this._o[0].type}},handle:{enumerable:!0,get(){return Je(this),this._o[0].handle}},implementation:{enumerable:!0,get(){return Je(this),this._o[0].implementation},set(t){Je(this),this._o[0].implementation=t}},returnType:{enumerable:!0,get(){return Je(this),this._o[0].returnType}},argumentTypes:{enumerable:!0,get(){return Je(this),this._o[0].argumentTypes}},canInvokeWith:{enumerable:!0,get(t){return Je(this),this._o[0].canInvokeWith}},clone:{enumerable:!0,value(t){return Je(this),this._o[0].clone(t)}},invoke:{value(t,e){let n=this._o,r=t.$h!==null;for(let o=0;o!==n.length;o++){let s=n[o];if(s.canInvokeWith(e)){if(s.type===Me&&!r){let i=this.methodName;if(i==="toString")return`<class: ${t.$n}>`;throw new Error(i+": cannot call instance method without an instance")}return s.apply(t,e)}}if(this.methodName==="toString")return`<class: ${t.$n}>`;yr(this.methodName,this.overloads,"argument types do not match any of:")}}});function es(t,e,n){return`${e.className} ${t}(${n.map(r=>r.className).join(", ")})`}function Je(t){let e=t._o;e.length>1&&yr(e[0].methodName,e,"has more than one overload, use .overload(<signature>) to choose from:")}function yr(t,e,n){let o=e.slice().sort((s,i)=>s.argumentTypes.length-i.argumentTypes.length).map(s=>s.argumentTypes.length>0?".overload('"+s.argumentTypes.map(l=>l.className).join("', '")+"')":".overload()");throw new Error(`${t}(): ${n}
	${o.join(`
	`)}`)}function Ye(t,e,n,r,o,s,i,l){let a=o.type,c=s.map(f=>f.type);i===null&&(i=G.getEnv());let d,p;return n===Me?(d=i.vaMethod(a,c,l),p=i.nonvirtualVaMethod(a,c,l)):n===yt?(d=i.staticVaMethod(a,c,l),p=d):(d=i.constructor(c,l),p=d),Eu([t,e,n,r,o,s,d,p])}function Eu(t){let e=vu();return Object.setPrototypeOf(e,as),e._p=t,e}function vu(){let t=function(){return t.invoke(this,arguments)};return t}as=Object.create(Function.prototype,{methodName:{enumerable:!0,get(){return this._p[0]}},holder:{enumerable:!0,get(){return this._p[1]}},type:{enumerable:!0,get(){return this._p[2]}},handle:{enumerable:!0,get(){return this._p[3]}},implementation:{enumerable:!0,get(){let t=this._r;return t!==void 0?t:null},set(t){let e=this._p,n=e[1];if(e[2]===mr)throw new Error("Reimplementing $new is not possible; replace implementation of $init instead");let o=this._r;if(o!==void 0&&(n.$f._patchedMethods.delete(this),o._m.revert(G),this._r=void 0),t!==null){let[s,i,l,a,c,d]=e,p=cs(s,i,l,c,d,t,this),f=ns(a);p._m=f,this._r=p,f.replace(p,l===Me,d,G,K),n.$f._patchedMethods.add(this)}}},returnType:{enumerable:!0,get(){return this._p[4]}},argumentTypes:{enumerable:!0,get(){return this._p[5]}},canInvokeWith:{enumerable:!0,value(t){let e=this._p[5];return t.length!==e.length?!1:e.every((n,r)=>n.isCompatible(t[r]))}},clone:{enumerable:!0,value(t){let e=this._p.slice(0,6);return Ye(...e,null,t)}},invoke:{value(t,e){let n=G.getEnv(),r=this._p,o=r[2],s=r[4],i=r[5],l=this._r,a=o===Me,c=e.length,d=2+c;n.pushLocalFrame(d);let p=null;try{let f;a?f=t.$getHandle():(p=t.$borrowClassHandle(n),f=p.value);let u,_=t.$t;l===void 0?u=r[3]:(u=l._m.resolveTarget(t,a,n,K),os&&l._c.has($t())&&(_=rs));let h=[n.handle,f,u];for(let E=0;E!==c;E++)h.push(i[E].toJni(e[E],n));let g;_===Jt?g=r[6]:(g=r[7],a&&h.splice(2,0,t.$copyClassHandle(n)));let b=g.apply(null,h);return n.throwIfExceptionPending(),s.fromJni(b,n,!0)}finally{p!==null&&p.unref(n),n.popLocalFrame(NULL)}}},toString:{enumerable:!0,value(){return`function ${this.methodName}(${this.argumentTypes.map(t=>t.className).join(", ")}): ${this.returnType.className}`}}});function cs(t,e,n,r,o,s,i=null){let l=new Set,a=Su([t,e,n,r,o,s,i,l]),c=new NativeCallback(a,r.type,["pointer","pointer"].concat(o.map(d=>d.type)));return c._c=l,c}function Su(t){return function(){return wu(arguments,t)}}function wu(t,e){let n=new y(t[0],G),[r,o,s,i,l,a,c,d]=e,p=[],f;if(s===Me){let h=o.$C;f=new h(t[1],Jt,n,!1)}else f=o;let u=$t();n.pushLocalFrame(3);let _=!0;G.link(u,n);try{d.add(u);let h;c===null||!Xe.has(u)?h=a:h=c;let g=[],b=t.length-2;for(let A=0;A!==b;A++){let O=l[A].fromJni(t[2+A],n,!1);g.push(O),p.push(O)}let E=h.apply(f,g);if(!i.isCompatible(E))throw new Error(`Implementation for ${r} expected return value compatible with ${i.className}`);let C=i.toJni(E,n);return i.type==="pointer"&&(C=n.popLocalFrame(C),_=!1,p.push(E)),C}catch(h){let g=h.$h;return g!==void 0?n.throw(g):Script.nextTick(()=>{throw h}),i.defaultValue}finally{G.unlink(u),_&&n.popLocalFrame(NULL),d.delete(u),p.forEach(h=>{if(h===null)return;let g=h.$dispose;g!==void 0&&g.call(h)})}}function Iu(t){let{holder:e,type:n}=t[0];t.some(o=>o.type===n&&o.argumentTypes.length===0)||t.push(Cu([e,n]))}function Cu(t){let e=Tu();return Object.setPrototypeOf(e,ls),e._p=t,e}function Tu(){return function(){return this}}ls=Object.create(Function.prototype,{methodName:{enumerable:!0,get(){return"valueOf"}},holder:{enumerable:!0,get(){return this._p[0]}},type:{enumerable:!0,get(){return this._p[1]}},handle:{enumerable:!0,get(){return NULL}},implementation:{enumerable:!0,get(){return null},set(t){}},returnType:{enumerable:!0,get(){let t=this.holder;return t.$f.use(t.$n)}},argumentTypes:{enumerable:!0,get(){return[]}},canInvokeWith:{enumerable:!0,value(t){return t.length===0}},clone:{enumerable:!0,value(t){throw new Error("Invalid operation")}}});function Au(t,e,n,r,o){let s=e[2]==="s"?hr:gr,i=ptr(e.substr(3)),{$f:l}=r,a,c=o.toReflectedField(n,i,s===hr?1:0);try{a=o.vaMethod("pointer",[])(o.handle,c,o.javaLangReflectField().getGenericType),o.throwIfExceptionPending()}finally{o.deleteLocalRef(c)}let d;try{d=l._getType(o.getTypeName(a))}finally{o.deleteLocalRef(a)}let p,f,u=d.type;return s===hr?(p=o.getStaticField(u),f=o.setStaticField(u)):(p=o.getField(u),f=o.setField(u)),Lu([s,d,i,p,f])}function Lu(t){return function(e){return new ds([e].concat(t))}}function ds(t){this._p=t}Object.defineProperties(ds.prototype,{value:{enumerable:!0,get(){let[t,e,n,r,o]=this._p,s=G.getEnv();s.pushLocalFrame(4);let i=null;try{let l;if(e===gr){if(l=t.$getHandle(),l===null)throw new Error("Cannot access an instance field without an instance")}else i=t.$borrowClassHandle(s),l=i.value;let a=o(s.handle,l,r);return s.throwIfExceptionPending(),n.fromJni(a,s,!0)}finally{i!==null&&i.unref(s),s.popLocalFrame(NULL)}},set(t){let[e,n,r,o,,s]=this._p,i=G.getEnv();i.pushLocalFrame(4);let l=null;try{let a;if(n===gr){if(a=e.$getHandle(),a===null)throw new Error("Cannot access an instance field without an instance")}else l=e.$borrowClassHandle(i),a=l.value;if(!r.isCompatible(t))throw new Error(`Expected value compatible with ${r.className}`);let c=r.toJni(t,i);s(i.handle,a,o,c),i.throwIfExceptionPending()}finally{l!==null&&l.unref(i),i.popLocalFrame(NULL)}}},holder:{enumerable:!0,get(){return this._p[0]}},fieldType:{enumerable:!0,get(){return this._p[1]}},fieldReturnType:{enumerable:!0,get(){return this._p[2]}},toString:{enumerable:!0,value(){let t=`Java.Field{holder: ${this.holder}, fieldType: ${this.fieldType}, fieldReturnType: ${this.fieldReturnType}, value: ${this.value}}`;return t.length<200?t:`Java.Field{
	holder: ${this.holder},
	fieldType: ${this.fieldType},
	fieldReturnType: ${this.fieldReturnType},
	value: ${this.value},
}`.split(`
`).map(n=>n.length>200?n.slice(0,n.indexOf(" ")+1)+"...,":n).join(`
`)}}});var Gt=class t{static fromBuffer(e,n){let r=ts(n),o=r.getCanonicalPath().toString(),s=new File(o,"w");return s.write(e.buffer),s.close(),xu(o,n),new t(o,r,n)}constructor(e,n,r){this.path=e,this.file=n,this._factory=r}load(){let{_factory:e}=this,{codeCacheDir:n}=e,r=e.use("dalvik.system.DexClassLoader"),o=e.use("java.io.File"),s=this.file;if(s===null&&(s=e.use("java.io.File").$new(this.path)),!s.exists())throw new Error("File not found");o.$new(n).mkdirs(),e.loader=r.$new(s.getCanonicalPath(),n,null,e.loader),G.preventDetachDueToClassLoader()}getClassNames(){let{_factory:e}=this,n=e.use("dalvik.system.DexFile"),r=ts(e),o=n.loadDex(this.path,r.getCanonicalPath(),0),s=[],i=o.entries();for(;i.hasMoreElements();)s.push(i.nextElement().toString());return s}};function ts(t){let{cacheDir:e,tempFileNaming:n}=t,r=t.use("java.io.File"),o=r.$new(e);return o.mkdirs(),r.createTempFile(n.prefix,n.suffix+".dex",o)}function xu(t,e){e.use("java.io.File").$new(t).setWritable(!1,!1)}function Nu(){switch(ue.state){case"empty":{ue.state="pending";let t=ue.factories[0],e=t.use("java.util.HashMap"),n=t.use("java.lang.Integer");ue.loaders=e.$new(),ue.Integer=n;let r=t.loader;return r!==null&&Er(t,r),ue.state="ready",ue}case"pending":do Thread.sleep(.05);while(ue.state==="pending");return ue;case"ready":return ue}}function Er(t,e){let{factories:n,loaders:r,Integer:o}=ue,s=o.$new(n.indexOf(t));r.put(e,s);for(let i=e.getParent();i!==null&&!r.containsKey(i);i=i.getParent())r.put(i,s)}function us(t){let e=Xe.get(t);e===void 0&&(e=0),e++,Xe.set(t,e)}function ps(t){let e=Xe.get(t);if(e===void 0)throw new Error(`Thread ${t} is not ignored`);e--,e===0?Xe.delete(t):Xe.set(t,e)}function ku(t){return t.slice(t.lastIndexOf(".")+1)}function vr(t,e){let n=[],r=t.getArrayLength(e);for(let o=0;o!==r;o++){let s=t.getObjectArrayElement(e,o);try{n.push(t.getTypeName(s))}finally{t.deleteLocalRef(s)}}return n}function Mu(t){let e=t.split(".");return e[e.length-1]+".java"}var ju=4,fs=Process.pointerSize,Ir=class{ACC_PUBLIC=1;ACC_PRIVATE=2;ACC_PROTECTED=4;ACC_STATIC=8;ACC_FINAL=16;ACC_SYNCHRONIZED=32;ACC_BRIDGE=64;ACC_VARARGS=128;ACC_NATIVE=256;ACC_ABSTRACT=1024;ACC_STRICT=2048;ACC_SYNTHETIC=4096;constructor(){this.classFactory=null,this.ClassFactory=Re,this.vm=null,this.api=null,this._initialized=!1,this._apiError=null,this._wakeupHandler=null,this._pollListener=null,this._pendingMainOps=[],this._pendingVmOps=[],this._cachedIsAppProcess=null;try{this._tryInitialize()}catch{}}_tryInitialize(){if(this._initialized)return!0;if(this._apiError!==null)throw this._apiError;let e;try{e=_t(),this.api=e}catch(r){throw this._apiError=r,r}if(e===null)return!1;let n=new Ce(e);return this.vm=n,qo(n),Re._initialize(n,e),this.classFactory=new Re,this._initialized=!0,!0}_dispose(){if(this.api===null)return;let{vm:e}=this;e.perform(n=>{Re._disposeAll(n),y.dispose(n)}),Script.nextTick(()=>{Ce.dispose(e)})}get available(){return this._tryInitialize()}get androidVersion(){return ft()}synchronized(e,n){let{$h:r=e}=e;if(!(r instanceof NativePointer))throw new Error("Java.synchronized: the first argument `obj` must be either a pointer or a Java instance");let o=this.vm.getEnv();de("VM::MonitorEnter",o.monitorEnter(r));try{n()}finally{o.monitorExit(r)}}enumerateLoadedClasses(e){this._checkAvailable();let{flavor:n}=this.api;n==="jvm"?this._enumerateLoadedClassesJvm(e):n==="art"?this._enumerateLoadedClassesArt(e):this._enumerateLoadedClassesDalvik(e)}enumerateLoadedClassesSync(){let e=[];return this.enumerateLoadedClasses({onMatch(n){e.push(n)},onComplete(){}}),e}enumerateClassLoaders(e){this._checkAvailable();let{flavor:n}=this.api;if(n==="jvm")this._enumerateClassLoadersJvm(e);else if(n==="art")this._enumerateClassLoadersArt(e);else throw new Error("Enumerating class loaders is not supported on Dalvik")}enumerateClassLoadersSync(){let e=[];return this.enumerateClassLoaders({onMatch(n){e.push(n)},onComplete(){}}),e}_enumerateLoadedClassesJvm(e){let{api:n,vm:r}=this,{jvmti:o}=n,s=r.getEnv(),i=Memory.alloc(ju),l=Memory.alloc(fs);o.getLoadedClasses(i,l);let a=i.readS32(),c=l.readPointer(),d=[];for(let p=0;p!==a;p++)d.push(c.add(p*fs).readPointer());o.deallocate(c);try{for(let p of d){let f=s.getClassName(p);e.onMatch(f,p)}e.onComplete()}finally{d.forEach(p=>{s.deleteLocalRef(p)})}}_enumerateClassLoadersJvm(e){this.choose("java.lang.ClassLoader",e)}_enumerateLoadedClassesArt(e){let{vm:n,api:r}=this,o=n.getEnv(),s=r["art::JavaVMExt::AddGlobalRef"],{vm:i}=r;ye(n,o,l=>{let a=qn(c=>{let d=s(i,l,c);try{let p=o.getClassName(d);e.onMatch(p,d)}finally{o.deleteGlobalRef(d)}return!0});r["art::ClassLinker::VisitClasses"](r.artClassLinker.address,a)}),e.onComplete()}_enumerateClassLoadersArt(e){let{classFactory:n,vm:r,api:o}=this,s=r.getEnv(),i=o["art::ClassLinker::VisitClassLoaders"];if(i===void 0)throw new Error("This API is only available on Android >= 7.0");let l=n.use("java.lang.ClassLoader"),a=[],c=o["art::JavaVMExt::AddGlobalRef"],{vm:d}=o;ye(r,s,p=>{let f=Wn(u=>(a.push(c(d,p,u)),!0));Zn(()=>{i(o.artClassLinker.address,f)})});try{a.forEach(p=>{let f=n.cast(p,l);e.onMatch(f)})}finally{a.forEach(p=>{s.deleteGlobalRef(p)})}e.onComplete()}_enumerateLoadedClassesDalvik(e){let{api:n}=this,r=ptr("0xcbcacccd"),o=172,s=8,l=n.gDvm.add(o).readPointer(),a=l.readS32(),d=l.add(12).readPointer(),p=a*s;for(let f=0;f<p;f+=s){let _=d.add(f).add(4).readPointer();if(_.isNull()||_.equals(r))continue;let g=_.add(24).readPointer().readUtf8String();if(g.startsWith("L")){let b=g.substring(1,g.length-1).replace(/\//g,".");e.onMatch(b)}}e.onComplete()}enumerateMethods(e){let{classFactory:n}=this,r=this.vm.getEnv(),o=n.use("java.lang.ClassLoader");return ze.enumerateMethods(e,this.api,r).map(s=>{let i=s.loader;return s.loader=i!==null?n.wrap(i,o,r):null,s})}scheduleOnMainThread(e){this.performNow(()=>{this._pendingMainOps.push(e);let{_wakeupHandler:n}=this;if(n===null){let{classFactory:r}=this,o=r.use("android.os.Handler"),s=r.use("android.os.Looper");n=o.$new(s.getMainLooper()),this._wakeupHandler=n}this._pollListener===null&&(this._pollListener=Interceptor.attach(Process.getModuleByName("libc.so").getExportByName("epoll_wait"),this._makePollHook()),Interceptor.flush()),n.sendEmptyMessage(1)})}_makePollHook(){let e=Process.id,{_pendingMainOps:n}=this;return function(){if(this.threadId!==e)return;let r;for(;(r=n.shift())!==void 0;)try{r()}catch(o){Script.nextTick(()=>{throw o})}}}perform(e){if(this._checkAvailable(),!this._isAppProcess()||this.classFactory.loader!==null)try{this.vm.perform(e)}catch(n){Script.nextTick(()=>{throw n})}else this._pendingVmOps.push(e),this._pendingVmOps.length===1&&this._performPendingVmOpsWhenReady()}performNow(e){return this._checkAvailable(),this.vm.perform(()=>{let{classFactory:n}=this;if(this._isAppProcess()&&n.loader===null){let o=n.use("android.app.ActivityThread").currentApplication();o!==null&&hs(n,o)}return e()})}_performPendingVmOpsWhenReady(){this.vm.perform(()=>{let{classFactory:e}=this,n=e.use("android.app.ActivityThread"),r=n.currentApplication();if(r!==null){hs(e,r),this._performPendingVmOps();return}let o=this,s=!1,i="early",l=n.handleBindApplication;l.implementation=function(d){if(d.instrumentationName.value!==null){i="late";let f=e.use("android.app.LoadedApk").makeApplication;f.implementation=function(u,_){return s||(s=!0,_s(e,this),o._performPendingVmOps()),f.apply(this,arguments)}}l.apply(this,arguments)};let c=n.getPackageInfo.overloads.map(d=>[d.argumentTypes.length,d]).sort(([d],[p])=>p-d).map(([d,p])=>p)[0];c.implementation=function(...d){let p=c.call(this,...d);return!s&&i==="early"&&(s=!0,_s(e,p),o._performPendingVmOps()),p}})}_performPendingVmOps(){let{vm:e,_pendingVmOps:n}=this,r;for(;(r=n.shift())!==void 0;)try{e.perform(r)}catch(o){Script.nextTick(()=>{throw o})}}use(e,n){return this.classFactory.use(e,n)}openClassFile(e){return this.classFactory.openClassFile(e)}choose(e,n){this.classFactory.choose(e,n)}retain(e){return this.classFactory.retain(e)}cast(e,n){return this.classFactory.cast(e,n)}array(e,n){return this.classFactory.array(e,n)}backtrace(e){return Kn(this.vm,e)}isMainThread(){let e=this.classFactory.use("android.os.Looper"),n=e.getMainLooper(),r=e.myLooper();return r===null?!1:n.$isSameObject(r)}registerClass(e){return this.classFactory.registerClass(e)}deoptimizeEverything(){let{vm:e}=this;return er(e,e.getEnv())}deoptimizeBootImage(){let{vm:e}=this;return tr(e,e.getEnv())}deoptimizeMethod(e){let{vm:n}=this;return Xn(n,n.getEnv(),e)}_checkAvailable(){if(!this.available)throw new Error("Java API not available")}_isAppProcess(){let e=this._cachedIsAppProcess;if(e===null){if(this.api.flavor==="jvm")return e=!1,this._cachedIsAppProcess=e,e;let n=new NativeFunction(Module.getGlobalExportByName("readlink"),"pointer",["pointer","pointer","pointer"],{exceptions:"propagate"}),r=Memory.allocUtf8String("/proc/self/exe"),o=1024,s=Memory.alloc(o),i=n(r,s,ptr(o)).toInt32();if(i!==-1){let l=s.readUtf8String(i);e=/^\/system\/bin\/app_process/.test(l)}else e=!0;this._cachedIsAppProcess=e}return e}};function hs(t,e){let n=t.use("android.os.Process");t.loader=e.getClassLoader(),n.myUid()===n.SYSTEM_UID.value?(t.cacheDir="/data/system",t.codeCacheDir="/data/dalvik-cache"):"getCodeCacheDir"in e?(t.cacheDir=e.getCacheDir().getCanonicalPath(),t.codeCacheDir=e.getCodeCacheDir().getCanonicalPath()):(t.cacheDir=e.getFilesDir().getCanonicalPath(),t.codeCacheDir=e.getCacheDir().getCanonicalPath())}function _s(t,e){let n=t.use("java.io.File");t.loader=e.getClassLoader();let r=n.$new(e.getDataDir()).getCanonicalPath();t.cacheDir=r,t.codeCacheDir=r+"/cache"}var Cr=new Ir;Script.bindWeak(Cr,()=>{Cr._dispose()});var Se=Cr;var Tr="top.niunaijun.blackbox.instrumentation.GuestRuntimeRegistry",ms=40,gs=250,Ae=null,et=null;function Ou(){try{return Se.use(Tr)}catch{let e=null;return Se.enumerateClassLoaders({onMatch(n){if(e===null)try{n.loadClass(Tr),e=Se.ClassFactory.get(n).use(Tr)}catch{}},onComplete(){}}),e}}function bs(t){Se.perform(()=>{if(Ae=Ou(),Ae!==null&&(et=Ae.getGuestClassLoader(),et!==null)){Se.classFactory.loader=et,console.log("[FridaBox] package="+Ae.getGuestPackageName()),console.log("[FridaBox] process="+Ae.getGuestProcessName()),console.log("[FridaBox] userId="+Ae.getGuestUserId()),console.log("[FridaBox] virtualProcessId="+Ae.getVirtualProcessId()),console.log("[FridaBox] source="+Ae.getGuestSourceDir()),console.log("[FridaBox] ClassLoader="+et.toString());return}t+1<ms?setTimeout(()=>bs(t+1),gs):console.error("[FridaBox] guest ClassLoader unavailable after "+ms*gs+" ms")})}bs(0);rpc.exports={info(){return Se.performNow(()=>Ae===null?{error:"registry unavailable"}:JSON.parse(Ae.describe()))},useclass(t){return Se.performNow(()=>{if(et===null)throw new Error("guest ClassLoader is not ready");return Se.classFactory.loader=et,Se.use(t).$className})},enumerateloadedclasses(t){let e=t||"";return Se.performNow(()=>Se.enumerateLoadedClassesSync().filter(n=>n.indexOf(e)===0))},enumeratemodules(){return Process.enumerateModules().map(t=>({name:t.name,base:t.base.toString(),path:t.path}))}};
