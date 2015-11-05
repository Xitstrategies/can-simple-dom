/*can-simple-dom@0.2.21#simple-dom/document/element*/
'use strict';
var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
};
var Node = _interopRequire(require('./node.js'));
function Element(tagName, ownerDocument) {
    tagName = tagName.toUpperCase();
    this.nodeConstructor(1, tagName, null, ownerDocument);
    this.style = new Style(this);
    this.attributes = [];
    this.tagName = tagName;
}
Element.prototype = Object.create(Node.prototype);
Element.prototype.constructor = Element;
Element.prototype.nodeConstructor = Node;
Element.prototype._cloneNode = function () {
    var node = this.ownerDocument.createElement(this.tagName);
    node.attributes = this.attributes.map(function (attr) {
        return {
            name: attr.name,
            value: attr.value,
            specified: attr.specified
        };
    });
    return node;
};
Element.prototype.getAttribute = function (_name) {
    var attributes = this.attributes;
    var name = _name.toLowerCase();
    var attr;
    for (var i = 0, l = attributes.length; i < l; i++) {
        attr = attributes[i];
        if (attr.name === name) {
            return attr.value;
        }
    }
    return null;
};
Element.prototype.setAttribute = function () {
    return this._setAttribute.apply(this, arguments);
};
Element.prototype._setAttribute = function (_name, value) {
    var attributes = this.attributes;
    var name = _name.toLowerCase();
    var attr;
    for (var i = 0, l = attributes.length; i < l; i++) {
        attr = attributes[i];
        if (attr.name === name) {
            attr.value = value;
            return;
        }
    }
    attributes.push({
        name: name,
        value: value,
        specified: true
    });
    attributes[name] = value;
};
Element.prototype.removeAttribute = function (name) {
    var attributes = this.attributes;
    for (var i = 0, l = attributes.length; i < l; i++) {
        var attr = attributes[i];
        if (attr.name === name) {
            attributes.splice(i, 1);
            delete attributes[name];
            return;
        }
    }
};
Element.prototype.getElementsByTagName = function (name) {
    name = name.toUpperCase();
    var elements = [];
    var cur = this.firstChild;
    while (cur) {
        if (cur.nodeType === Node.ELEMENT_NODE) {
            if (cur.nodeName === name || name === '*') {
                elements.push(cur);
            }
            elements.push.apply(elements, cur.getElementsByTagName(name));
        }
        cur = cur.nextSibling;
    }
    return elements;
};
Element.prototype.contains = function (child) {
    child = child.parentNode;
    while (child) {
        if (child === this) {
            return true;
        }
        child = child.parentNode;
    }
    return false;
};
Element.prototype.getElementById = function (id) {
    var cur = this.firstChild, child;
    while (cur) {
        if (cur.attributes && cur.attributes.length) {
            var attr;
            for (var i = 0, len = cur.attributes.length; i < len; i++) {
                attr = cur.attributes[i];
                if (attr.name === 'id' && attr.value === id) {
                    return cur;
                }
            }
        }
        if (cur.getElementById) {
            child = cur.getElementById(id);
            if (child) {
                return child;
            }
        }
        cur = cur.nextSibling;
    }
};
function Style(node) {
    this.__node = node;
}
if (Object.defineProperty) {
    Object.defineProperty(Element.prototype, 'className', {
        get: function () {
            return this._className;
        },
        set: function (val) {
            this._setAttribute('class', val);
            this._className = val;
        }
    });
    Object.defineProperty(Style.prototype, 'cssText', {
        get: function () {
            return this.__node.getAttribute('style') || '';
        },
        set: function (val) {
            this.__node._setAttribute('style', val);
        }
    });
}
module.exports = Element;