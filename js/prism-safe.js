/* =========================================================================
   OFFIZIELLES PRISM.JS CORE (v1.29.0) - REIN & STABIL OHNE TEXTVERDOPPLUNG
   ========================================================================= */
var _self = "undefined" != typeof window ? window : "undefined" != typeof worker ? worker : {};
var Prism = (function (_self) {
    var e = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, n = 0, t = {
        util: {
            encode: function e(n) { return n instanceof r ? new r(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ") },
            type: function (e) { return Object.prototype.toString.call(e).slice(8, -1) },
            objId: function (e) { return e.__id || Object.defineProperty(e, "__id", { value: ++n }), e.__id },
            clone: function e(n, t) { var r, a, i = t.util.type(n); switch (t = t || {}, i) { case "Object": if (a = t.util.objId(n), t[a]) return t[a]; for (var o in r = {}, t[a] = r, n) n.hasOwnProperty(o) && (r[o] = e(n[o], t)); return r; case "Array": return a = t.util.objId(n), t[a] ? t[a] : (r = [], t[a] = r, n.forEach(function (n, a) { r[a] = e(n, t) }), r); default: return n } }
        },
        languages: {
            plain: {}, text: {}, extend: function (e, n) { var r = t.util.clone(t.languages[e]); for (var a in n) r[a] = n[a]; return r },
            insertBefore: function (e, n, r, a) { var i = (a = a || t.languages)[e], o = {}; for (var l in i) if (i.hasOwnProperty(l)) { if (l == n) for (var s in r) r.hasOwnProperty(s) && (o[s] = r[s]); r.hasOwnProperty(l) || (o[l] = i[l]) } var u = a[e]; return a[e] = o, t.languages.DFS(t.languages, function (n, t) { t === u && n !== e && (this[n] = o) }), o },
            DFS: function e(n, r, a, i) { i = i || {}; var o = t.util.objId; for (var l in n) if (n.hasOwnProperty(l)) { r.call(n, l, n[l], a); var s = t.util.type(n[l]); "Object" !== s || i[o(n[l])] ? "Array" !== s || i[o(n[l])] || (i[o(n[l])] = !0, e(n[l], r, l, i)) : (i[o(n[l])] = !0, e(n[l], r, null, i)) } }
        },
        plugins: {},
        highlight: function (e, n, a) { var i = { code: e, grammar: n, language: a }; return t.tokenize(i.code, i.grammar), r.stringify(t.util.encode(i.tokens), i.language) },
        tokenize: function (e, n) {
            var r = [e], a = n.rest; if (a) { for (var i in a) n[i] = a[i]; delete n.rest } e: for (var o in n) if (n.hasOwnProperty(o) && n[o]) {
                var l = n[o]; l = Array.isArray(l) ? l : [l]; for (var s = 0; s < l.length; ++s) {
                    if (r.length > e.length) break e; var u = l[s], c = u.inside, g = !!u.lookbehind, h = !!u.greedy, f = u.alias; if (h && !u.pattern.global) { var d = u.pattern.toString().match(/[imsuy]*$/); u.pattern = RegExp(u.pattern.source, d + "g") } u = u.pattern || u; for (var p = u.lastIndex = 0, m = 0; p < r.length; m += r[p].length, ++p) {
                        var v = r[p]; if (r.length > e.length) break e; if (!(v instanceof r)) {
                            u.lastIndex = h ? m : 0; var y = u.exec(h ? e : v); if (y) {
                                g && (p = y[1] ? y[1].length : 0); var k = y.index + p, y = y[0].slice(p), b = k + y.length, w = v.slice(0, k - m), A = v.slice(b - m), x = [p, 1]; w && (++p, x.push(w), m += w.length); var O = new r(o, c ? t.tokenize(y, c) : y, f, y); if (x.push(O), A && x.push(A), r.splice.apply(r, x), h && b > m + v.length && (b = m + v.length, y = e.slice(k, b), A = e.slice(b), r.splice(p + 1, r.length), r.push(A)), w || A) p += A ? 1 : 0, --p, m -= w ? w.length : 0
                            }
                        }
                    }
                }
            } return r
        }
    }; function r(e, n, t, a) { this.type = e, this.content = n, this.alias = t, this.length = (a || "").length | 0 } return _self.Prism = t, r.stringify = function e(n, a) { if ("string" == typeof n) return n; if (Array.isArray(n)) return n.map(function (n) { return e(n, a) }).join(""); var i = { type: n.type, content: e(n.content, a), alias: n.alias, language: a, attributes: {} }; if (i.alias) { var o = Array.isArray(i.alias) ? i.alias : [i.alias]; o.forEach(function (e) { i.attributes.class = (i.attributes.class || "") + " " + e }) } var l = ""; for (var s in i.attributes) l += s + '="' + (i.attributes[s] || "").replace(/"/g, "&quot;") + '"'; return "<span class=\"token " + i.type + '"' + (l ? " " + l : "") + ">" + i.content + "</span>" }, t
})(_self);

/* =========================================================================
   OFFIZIELLE C# GRAMMATIK-REGELN
   ========================================================================= */
Prism.languages.clike = {
    'comment': [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true, greedy: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }],
    'string': { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true },
    'class-name': { pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[a-z_]\w*/i, lookbehind: true, inside: null },
    'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    'boolean': /\b(?:true|false)\b/,
    'function': /\b\w+(?=\()/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    'operator': /[<>]=?|[!=]=?=?|--|\+\+|&&|\|\||[?.:~^%&|+\-*/=]/,
    'punctuation': /[{}[\];(),.]/
};

Prism.languages.csharp = Prism.languages.extend('clike', {
    'string': [{ pattern: /@"(?:""|[^"])*"/, greedy: true }, { pattern: /"([^"\\\r\n]|\\.)*"/, greedy: true }],
    'class-name': [
        { pattern: /(\b(?:class|struct|interface|enum|delegate)\s+)\w+/, lookbehind: true },
        { pattern: /(\b(?:new|is|as)\s+)\w+/, lookbehind: true },
        { pattern: /\b[A-Z]\w*(?=\s+\w+\s*[;=,])/, greedy: true },
        { pattern: /\b[A-Z]\w*(?=\s*<)/, greedy: true }
    ],
    'keyword': /\b(?:abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|by|descending|dynamic|from|get|global|group|into|join|let|on|orderby|partial|remove|select|set|value|var|where|yield)\b/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:f|d|m)?/i
});

Prism.languages.insertBefore('csharp', 'keyword', {
    'preprocessor': { pattern: /^\s*#.*/m, alias: 'property' }
});
