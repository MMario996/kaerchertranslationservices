/**
 * XliffParser.gs
 *
 * Wandelt eine (uebersetzte) Rise-XLIFF in {scopeId, path, text}-Patches
 * fuer den Rise-Patcher um. Rekonstruiert dabei aus der
 * <g ctype="x-html-...">-Struktur die flachen HTML-Strings (<p>, <strong>,
 * <br> ...), die runtime-data.js erwartet.
 *
 * Verifiziert (in der Node-Referenzfassung) gegen die echte Kurs-XLIFF:
 * 127/127 Trans-Units erzeugt, alle 127 matchen den Kurs-JSON-Index.
 */

var CTYPE_TO_TAG_ = {
  "x-html-P": "p",
  "x-html-SPAN": "span",
  "x-html-STRONG": "strong",
  "x-html-EM": "em",
  "x-html-BR": "br",
  "x-html-UL": "ul",
  "x-html-LI": "li",
  "x-html-DIV": "div",
  "x-html-B": "b",
  "x-html-I": "i",
  "x-html-A": "a",
  "x-html-OL": "ol",
  "x-html-H1": "h1",
  "x-html-H2": "h2",
  "x-html-H3": "h3",
  "x-html-H4": "h4",
  "x-html-SUB": "sub",
  "x-html-SUP": "sup",
  "x-html-U": "u",
};

var VOID_TAGS_ = { br: true, hr: true, img: true };

function escapeHtml_(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Baut aus den xhtml:style/class/href/target-Attributen eines <g>-Elements
 * den HTML-Attribut-String. data-editor-id o.ae. wird bewusst ignoriert.
 */
function buildAttrs_(gEl) {
  var attrs = "";
  var attributes = gEl.getAttributes();
  for (var i = 0; i < attributes.length; i++) {
    var a = attributes[i];
    var localName = a.getName(); // lokaler Name ohne Prefix
    if (localName === "style" || localName === "class" ||
        localName === "href" || localName === "target") {
      attrs += " " + localName + '="' + escapeHtml_(a.getValue()) + '"';
    }
  }
  return attrs;
}

/**
 * Rekursiv: rendert die Kinder eines XLIFF-Knotens (source/target/g) zu HTML.
 * node ist ein XmlService Element.
 *
 * WICHTIG: In Apps Script heisst die Methode fuer "alle Kindknoten in
 * Reihenfolge" getAllContent() - getContent() erwartet einen Index.
 */
function renderNode_(node) {
  var out = "";
  var children = node.getAllContent();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var type = child.getType();

    if (type === XmlService.ContentTypes.TEXT) {
      out += escapeHtml_(child.asText().getText());
    } else if (type === XmlService.ContentTypes.CDATA) {
      out += escapeHtml_(child.asCdata().getText());
    } else if (type === XmlService.ContentTypes.ELEMENT) {
      var el = child.asElement();
      if (el.getName() === "g") {
        var ctypeAttr = el.getAttribute("ctype");
        var ctype = ctypeAttr ? ctypeAttr.getValue() : "";
        var tag = CTYPE_TO_TAG_[ctype];
        var inner = renderNode_(el);

        if (tag && VOID_TAGS_[tag]) {
          out += "<" + tag + buildAttrs_(el) + ">";
        } else if (tag) {
          out += "<" + tag + buildAttrs_(el) + ">" + inner + "</" + tag + ">";
        } else {
          out += inner; // unbekannter ctype: Tag weglassen, Inhalt behalten
        }
      } else {
        out += renderNode_(el);
      }
    }
  }
  return out;
}

function firstChildByName_(parent, name) {
  var children = parent.getChildren();
  for (var i = 0; i < children.length; i++) {
    if (children[i].getName() === name) return children[i];
  }
  return null;
}

function elementHasContent_(el) {
  var txt = el.getValue();
  if (txt && txt.trim().length > 0) return true;
  if (el.getChildren().length > 0) return true;
  return false;
}

/**
 * Hauptfunktion: XLIFF-Text -> Patches.
 */
function parseTranslatedXliffToPatches_(xliffText, options) {
  options = options || {};
  var useSourceIfNoTarget = !!options.useSourceIfNoTarget;

  var doc = XmlService.parse(xliffText);
  var root = doc.getRootElement();

  var patches = [];

  var files = getDescendantsByName_(root, "file");
  for (var f = 0; f < files.length; f++) {
    var fileEl = files[f];
    var origAttr = fileEl.getAttribute("original");
    var scopeId = origAttr ? origAttr.getValue() : "";

    var transUnits = getDescendantsByName_(fileEl, "trans-unit");
    for (var t = 0; t < transUnits.length; t++) {
      var tu = transUnits[t];
      var pathAttr = tu.getAttribute("id");
      var path = pathAttr ? pathAttr.getValue() : "";

      var targetEl = firstChildByName_(tu, "target");
      var sourceEl = firstChildByName_(tu, "source");

      var chosen = null;
      if (targetEl && elementHasContent_(targetEl)) {
        chosen = targetEl;
      } else if (useSourceIfNoTarget && sourceEl) {
        chosen = sourceEl;
      }

      if (!chosen) continue;

      var html = renderNode_(chosen);
      patches.push({ scopeId: scopeId, path: path, text: html });
    }
  }

  return patches;
}

/**
 * Sammelt alle Nachfahren-Elemente mit gegebenem lokalen Namen (rekursiv).
 */
function getDescendantsByName_(el, name) {
  var result = [];
  var children = el.getChildren();
  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.getName() === name) {
      result.push(c);
    }
    var deeper = getDescendantsByName_(c, name);
    for (var j = 0; j < deeper.length; j++) result.push(deeper[j]);
  }
  return result;
}