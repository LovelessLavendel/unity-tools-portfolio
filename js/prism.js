/* =========================================================================
   PRISM.JS CORE ENGINE + C# LANGUAGE EXTENSION (STABLE COMPLETE VERSION)
   ========================================================================= */
var _self = "undefined" != typeof window ? window : "undefined" != typeof worker ? worker : {},
    Prism = function (e) {
        var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, t = 0, r = {
            util: {
                encode: function (e) { return e instanceof a ? new a(e.type, r.util.encode(e.content), e.alias) : "Array" === r.util.type(e) ? e.map(r.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ") },
                type: function (e) { return Object.prototype.toString.call(e).slice(8, -1) },
                objId: function (e) { return e.__id || Object.defineProperty(e, "__id", { value: ++t }), e.__id },
                clone: function e(n, t) { var a, s, i = r.util.type(n); switch (t = t || {}, i) { case "Object": if (s = r.util.objId(n), t[s]) return t[s]; for (var o in a = {}, t[s] = a, n) n.hasOwnProperty(o) && (a[o] = e(n[o], t)); return a; case "Array": return s = r.util.objId(n), t[s] ? t[s] : (a = [], t[s] = a, n.forEach(function (n, r) { a[r] = e(n, t) }), a); default: return n } }
            },
            languages: { plain: "plain", text: "text", extend: function (e, n) { var t = r.util.clone(r.languages[e]); for (var a in n) t[a] = n[a]; return t }, insertBefore: function (e, n, t, a) { var s = a[e], i = {}; for (var o in s) if (s.hasOwnProperty(o)) { if (o == n) for (var l in t) t.hasOwnProperty(l) && (i[l] = t[l]); t.hasOwnProperty(o) || (i[o] = s[o]) } return r.languages.DFS(r.languages, function (n, r) { r === s && n !== e && (this[n] = i) }), a[e] = i }, DFS: function e(n, t, a, s) { s = s || {}; var i = r.util.objId; for (var o in n) n.hasOwnProperty(o) && (t.call(n, o, n[o], a), "Object" !== r.util.type(n[o]) || s[i(n[o])] ? "Array" !== r.util.type(n[o]) || s[i(n[o])] || (s[i(n[o])] = !0, e(n[o], t, o, s)) : (s[i(n[o])] = !0, e(n[o], t, null, s))) } },
            plugins: {},
            highlight: function (e, n, t) { var s = { code: e, grammar: n, language: t }; r.tokenize(s.code, s.grammar); return a.stringify(r.util.encode(s.tokens || s.code), s.language) },
            tokenize: function (e, n) {
                var t = [e], s = n.rest; if (s) { for (var i in s) n[i] = s[i]; delete n.rest } e: for (var a in n) if (n.hasOwnProperty(a) && n[a]) {
                    var o = n[a]; o = "Array" === r.util.type(o) ? o : [o]; for (var l = 0; l < o.length; ++l) {
                        var g = o[l], c = g.inside, u = !!g.lookbehind, d = !!g.greedy, p = 0, f = g.alias; if (d && !g.pattern.global) { var h = g.pattern.toString().match(/[imsuy]*$/); g.pattern = RegExp(g.pattern.source, h + "g") } g = g.pattern || g; for (var m = 0, v = 0; m < t.length; v += t[m].length, ++m) {
                            var y = t[m]; if (t.length > e.length) break e; if (!(y instanceof a)) {
                                g.lastIndex = d ? v : 0; var k = g.exec(d ? e : y); if (k) {
                                    u && (p = k[1] ? k[1].length : 0); var b = k.index + p, w = b + (k[0].length - p); var A = y.slice(0, b - v), x = y.slice(w - v); var csharpCode = k[0].slice(p); if (A && (t.splice(m, 1, A), ++m, v += A.length), d && w > v + y.length && (w = v + y.length, csharpCode = e.slice(b, w), x = e.slice(w)), t.splice(m, 1, new a(a, c ? r.tokenize(csharpCode, c) : csharpCode, f, csharpCode, d)), x && t.splice(m + 1, 0, x), A || x) m += x ? 1 : 0, --m, v -= A ? A.length : 0
                                }
                            }
                        }
                    }
                } return t;
            }
        }; function a(e, n, t, r, s) { this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length, this.greedy = !!s } return _self.Prism = r, a.stringify = function e(n, t) { if ("string" == typeof n) return n; if ("Array" === r.util.type(n)) return n.map(function (n) { return e(n, t) }).join(""); var s = { type: n.type, content: n.content, alias: n.alias, language: t, attributes: {} }; if (s.alias) { var i = "Array" === r.util.type(s.alias) ? s.alias : [s.alias]; i.forEach(function (e) { s.attributes.class = (s.attributes.class || "") + " " + e }) } var o = ""; for (var l in s.attributes) o += l + '="' + (s.attributes[l] || "").replace(/"/g, "&quot;") + '"'; return "<span class=\"token " + s.type + '" ' + (o ? " " + o : "") + ">" + e(s.content, t) + "</span>" }, r
    }(_self);

Prism.languages.clike = {
    comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }],
    string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
    "class-name": { pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[a-z_]\w*/i, lookbehind: !0, inside: null },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--|\+\+|&&|\|\||[?.:~^%&|+\-*/=]/,
    punctuation: /[{}[\];(),.]/
};

Prism.languages.csharp = Prism.languages.extend("clike", {
    string: [{ pattern: /@"(?:""|[^"])*"/, greedy: !0 }, { pattern: /"([^"\\\r\n]|\\.)*"/, greedy: !0 }],
    "class-name": [
        { pattern: /(\b(?:class|struct|interface|enum|delegate)\s+)\w+/, lookbehind: !0 },
        { pattern: /(\b(?:new|is|as)\s+)\w+/, lookbehind: !0 },
        { pattern: /\b[A-Z]\w*(?=\s+\w+\s*[;=,])/, greedy: !0 },
        { pattern: /\b[A-Z]\w*(?=\s*<)/, greedy: !0 }
    ],
    keyword: /\b(?:abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|by|descending|dynamic|from|get|global|group|into|join|let|on|orderby|partial|remove|select|set|value|var|where|yield)\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:f|d|m)?/i
});
Prism.languages.insertBefore("csharp", "keyword", { preprocessor: { pattern: /^\s*#.*/m, alias: "property" } });
