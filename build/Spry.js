;// SpryCSVDataSet.js - version 0.2 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Spry.Data.CSVDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	this.firstRowAsHeaders = true;
	this.columnNames = [];

	Spry.Utils.setOptions(this, dataSetOptions);
}; // End of Spry.Data.CSVDataSet() constructor.

Spry.Data.CSVDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.CSVDataSet.prototype.constructor = Spry.Data.CSVDataSet;

// Override the inherited version of getDataRefStrings() with our
// own version that returns the strings memebers we maintain that
// may have data references in them.

Spry.Data.CSVDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	return strArr;
};

Spry.Data.CSVDataSet.prototype.getDocument = function() { return this.doc; };

// Utility routine for copying properties from one object to another.

Spry.Data.CSVDataSet.cleanFieldString = function(str)
{
	str = str.replace(/\s*(\r\n)\s*/g, "$1");
	str = str.replace(/^[ \t]*"?|"?\s*,?\s*$/g, "");
	return str.replace(/""/g, '"');
};

Spry.Data.CSVDataSet.prototype.columnNumberToColumnName = function(colNum)
{
	var colName = this.columnNames[colNum];
	if (!colName)
		colName = "column" + colNum;
	return colName;
};

// Translate the raw CSV string (rawDataDoc) into an array of row objects.

Spry.Data.CSVDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var data = new Array();
	var dataHash = new Object();

	var s = rawDataDoc ? rawDataDoc : "";
	var strLen = s.length;
	var i = 0;
	var done = false;

	var firstRowAsHeaders = this.firstRowAsHeaders;

	var searchStartIndex = 0;
	var regexp = /([ \t]*"([^"]|"")*"[ \t]*,?)|([ \t]*[^",\r\n]+[ \t]*,?)|[ \t]*(\r\n|\r|\n)/mg;

	var results = regexp.exec(s);
	var rowObj = null;
	var columnNum = -1;
	var rowID = 0;

	while (results && results[0])
	{
		var f = Spry.Data.CSVDataSet.cleanFieldString(results[0]);
		if (f == "\r\n" || f == "\r" || f == "\n")
		{
			if (!firstRowAsHeaders)
			{
				rowObj.ds_RowID = rowID++;
				data.push(rowObj);
				dataHash[rowObj.ds_RowID] = rowObj;
				rowObj = null;
			}
			firstRowAsHeaders = false;
			columnNum = -1;
		}
		else
		{
			if (firstRowAsHeaders)
				this.columnNames[++columnNum] = f;
			else
			{
				if (++columnNum == 0)
					rowObj = new Object;
				rowObj[this.columnNumberToColumnName(columnNum)] = f;
			}
		}

		searchStartIndex = regexp.lastIndex;
		results = regexp.exec(s);
	}
	
	this.doc = rawDataDoc;
	this.data = data;
	this.dataHash = dataHash;
	this.dataWasLoaded = (this.doc != null);
};
;// SpryDOMUtils.js - version 0.6 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

//////////////////////////////////////////////////////////////////////
//
// Define Prototype's $() convenience function, but make sure it is
// namespaced under Spry so that we avoid collisions with other
// toolkits.
//
//////////////////////////////////////////////////////////////////////

Spry.$ = function(element)
{
	if (arguments.length > 1)
	{
		for (var i = 0, elements = [], length = arguments.length; i < length; i++)
			elements.push(Spry.$(arguments[i]));
		return elements;
	}
	if (typeof element == 'string')
		element = document.getElementById(element);
	return element;
};

//////////////////////////////////////////////////////////////////////
//
// DOM Utils
//
//////////////////////////////////////////////////////////////////////

Spry.Utils.setAttribute = function(ele, name, value)
{
	ele = Spry.$(ele);
	if (!ele || !name)
		return;

	// IE doesn't allow you to set the "class" attribute. You
	// have to set the className property instead.

	if (name == "class")
		ele.className = value;
	else
		ele.setAttribute(name, value);
};

Spry.Utils.removeAttribute = function(ele, name)
{
	ele = Spry.$(ele);
	if (!ele || !name)
		return;

	try
	{
		ele.removeAttribute(name);

		// IE doesn't allow you to remove the "class" attribute.
		// It requires you to remove "className" instead, so go
		// ahead and try to remove that too.
		//
		// XXX: We should add a check for IE here instead of doing
		// it for every browser.

		if (name == "class")
			ele.removeAttribute("className");
	} catch(e) {}
};

Spry.Utils.addClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Utils.removeClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (Spry.Utils.hasClassName(ele, className))
		ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Utils.toggleClassName = function(ele, className)
{
	if (Spry.Utils.hasClassName(ele, className))
		Spry.Utils.removeClassName(ele, className);
	else
		Spry.Utils.addClassName(ele, className);
};

Spry.Utils.hasClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || !ele.className || ele.className.search(new RegExp("\\b" + className + "\\b")) == -1)
		return false;
	return true;
};

Spry.Utils.camelizeString = function(str)
{
	var cStr = "";
	var a = str.split("-");
	for (var i = 0; i < a.length; i++)
	{
		var s = a[i];
		if (s)
			cStr = cStr ? (cStr + s.charAt(0).toUpperCase() + s.substring(1)) : s;
	}
	return cStr;
};

Spry.Utils.styleStringToObject = function(styleStr)
{
	var o = {};
	if (styleStr)
	{
		pvA = styleStr.split(";");
		for (var i = 0; i < pvA.length; i++)
		{
			var pv = pvA[i];
			if (pv && pv.indexOf(":") != -1)
			{
				var nvA = pv.split(":");
				var n = nvA[0].replace(/^\s*|\s*$/g, "");			
				var v = nvA[1].replace(/^\s*|\s*$/g, "");
				if (n && v)
					o[Spry.Utils.camelizeString(n)] = v;
			}
		}
	}
	return o;
};

Spry.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		if (!Spry.Utils.eventListenerIsBoundToElement(element, eventType, handler, capture))
		{
			element = Spry.$(element);
			handler = Spry.Utils.bindEventListenerToElement(element, eventType, handler, capture);
			if (element.addEventListener)
				element.addEventListener(eventType, handler, capture);
			else if (element.attachEvent)
				element.attachEvent("on" + eventType, handler);
		}
	}
	catch (e) {}
};

Spry.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
			element = Spry.$(element);
			handler = Spry.Utils.unbindEventListenerFromElement(element, eventType, handler, capture);
			if (element.removeEventListener)
				element.removeEventListener(eventType, handler, capture);
			else if (element.detachEvent)
				element.detachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.eventListenerHash = {};
Spry.Utils.nextEventListenerID = 1;

Spry.Utils.getHashForElementAndHandler = function(element, eventType, handler, capture)
{
	var hash = null;
	element = Spry.$(element);
	if (element)
	{
		if (typeof element.spryEventListenerID == "undefined")
			element.spryEventListenerID = "e" + (Spry.Utils.nextEventListenerID++);
		if (typeof handler.spryEventHandlerID == "undefined")
			handler.spryEventHandlerID = "h" + (Spry.Utils.nextEventListenerID++);	
		hash = element.spryEventListenerID + "-" + handler.spryEventHandlerID + "-" + eventType + (capture?"-capture":"");
	}
	return hash;
};

Spry.Utils.eventListenerIsBoundToElement = function(element, eventType, handler, capture)
{
	element = Spry.$(element);
	var hash = Spry.Utils.getHashForElementAndHandler(element, eventType, handler, capture);
	return Spry.Utils.eventListenerHash[hash] != undefined;
};

Spry.Utils.bindEventListenerToElement = function(element, eventType, handler, capture)
{
	element = Spry.$(element);
	var hash = Spry.Utils.getHashForElementAndHandler(element, eventType, handler, capture);
	if (Spry.Utils.eventListenerHash[hash])
		return Spry.Utils.eventListenerHash[hash];
	return Spry.Utils.eventListenerHash[hash] = function(e)
	{
		e = e || window.event;

		if (!e.preventDefault) e.preventDefault = function() { this.returnValue = false; };
		if (!e.stopPropagation) e.stopPropagation = function() { this.cancelBubble = true; };

		var result = handler.call(element, e);
		if (result == false)
		{
			e.preventDefault();
			e.stopPropagation();
		}
		return result;
	};
};

Spry.Utils.unbindEventListenerFromElement = function(element, eventType, handler, capture)
{
	element = Spry.$(element);
	var hash = Spry.Utils.getHashForElementAndHandler(element, eventType, handler, capture);
	if (Spry.Utils.eventListenerHash[hash])
	{
		handler = Spry.Utils.eventListenerHash[hash];
		Spry.Utils.eventListenerHash[hash] = undefined;
	}
	return handler;
};

Spry.Utils.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

Spry.Utils.getAncestor = function(ele, selector)
{
	ele = Spry.$(ele);
	if (ele)
	{
		var s = Spry.$$.tokenizeSequence(selector ? selector : "*")[0];
		var t = s ? s[0] : null;
		if (t)
		{
			var p = ele.parentNode;
			while (p)
			{
				if (t.match(p))
					return p;
				p = p.parentNode;
			}
		}
	}
	return null;
};

//////////////////////////////////////////////////////////////////////
//
// CSS Selector Matching
//
//////////////////////////////////////////////////////////////////////

Spry.$$ = function(selectorSequence, rootNode)
{
	if (!rootNode)
		rootNode = document;
	else
		rootNode = Spry.$(rootNode);

	var sequences = Spry.$$.tokenizeSequence(selectorSequence);

	var matches = [];
	Spry.$$.addExtensions(matches);
	++Spry.$$.queryID;

	var nid = 0;
	var ns = sequences.length;
	for (var i = 0; i < ns; i++)
	{
		var m = Spry.$$.processTokens(sequences[i], rootNode);
		var nm = m.length;
		for (var j = 0; j < nm; j++)
		{
			var n = m[j];
			if (!n.spry$$ID)
			{
				n.spry$$ID = ++nid;
				matches.push(n);
			}
		}
	}

	var nm = matches.length;
	for (i = 0; i < nm; i++)
		matches[i].spry$$ID = undefined;

	return matches;
};

Spry.$$.cache = {};
Spry.$$.queryID = 0;

Spry.$$.Token = function()
{
	this.type = Spry.$$.Token.SELECTOR;
	this.name = "*";
	this.id = "";
	this.classes = [];
	this.attrs = [];
	this.pseudos = [];
};

Spry.$$.Token.Attr = function(n, v)
{
	this.name = n;
	this.value = v ? new RegExp(v) : undefined;
};

Spry.$$.Token.PseudoClass = function(pstr)
{
	this.name = pstr.replace(/\(.*/, "");
	this.arg = pstr.replace(/^[^\(\)]*\(?\s*|\)\s*$/g, "");
	this.func = Spry.$$.pseudoFuncs[this.name];
};

Spry.$$.Token.SELECTOR = 0;
Spry.$$.Token.COMBINATOR = 1;

Spry.$$.Token.prototype.match = function(ele, nameAlreadyMatches)
{
	if (this.type == Spry.$$.Token.COMBINATOR)
		return false;
	if (!nameAlreadyMatches && this.name != '*' && this.name != ele.nodeName.toLowerCase())
		return false;
	if (this.id && this.id != ele.id)
		return false;
	var classes = this.classes;
	var len = classes.length;
	for (var i = 0; i < len; i++)
	{
		if (!ele.className || !classes[i].value.test(ele.className))
			return false;
	}

	var attrs = this.attrs;
	len = attrs.length;
	for (var i = 0; i < len; i++)
	{
		var a = attrs[i];
		var an = ele.attributes.getNamedItem(a.name);
		if (!an || (!a.value && an.nodeValue == undefined) || (a.value && !a.value.test(an.nodeValue)))
			return false;
	}

	var ps = this.pseudos;
	var len = ps.length;
	for (var i = 0; i < len; i++)
	{
		var p = ps[i];
		if (p && p.func && !p.func(p.arg, ele, this))
			return false;
	}

	return true;
};

Spry.$$.Token.prototype.getNodeNameIfTypeMatches = function(ele)
{
	var nodeName = ele.nodeName.toLowerCase();
	if (this.name != '*')
	{
		if (this.name != nodeName)
			return null;
		return this.name;
	}
	return nodeName;
};

Spry.$$.escapeRegExpCharsRE = /\/|\.|\*|\+|\(|\)|\[|\]|\{|\}|\\|\|/g;

Spry.$$.tokenizeSequence = function(s)
{
	var cc = Spry.$$.cache[s];
	if (cc) return cc;

	// Attribute Selector: /(\[[^\"'~\^\$\*\|\]=]+([~\^\$\*\|]?=\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\])/g
	// Simple Selector:    /((:[^\.#:\s,>~\+\[\]]+\(([^\(\)]+|\([^\(\)]*\))*\))|[\.#:]?[^\.#:\s,>~\+\[\]]+)/g
	// Combinator:         /(\s*[\s,>~\+]\s*)/g

	var tokenExpr = /(\[[^\"'~\^\$\*\|\]=]+([~\^\$\*\|]?=\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\])|((:[^\.#:\s,>~\+\[\]]+\(([^\(\)]+|\([^\(\)]*\))*\))|[\.#:]?[^\.#:\s,>~\+\[\]]+)|(\s*[\s,>~\+]\s*)/g;

	var tkn = new Spry.$$.Token;
	var sequence = [];
	sequence.push(tkn);
	var tokenSequences = [];
	tokenSequences.push(sequence);

	s = s.replace(/^\s*|\s*$/, "");

	var expMatch = tokenExpr.exec(s);
	while (expMatch)
	{
		var tstr = expMatch[0];
		var c = tstr.charAt(0);
		switch (c)
		{
			case '.':
				tkn.classes.push(new Spry.$$.Token.Attr("class", "\\b" + tstr.substr(1) + "\\b"));
				break;
			case '#':
				tkn.id = tstr.substr(1);
				break;
			case ':':
				tkn.pseudos.push(new Spry.$$.Token.PseudoClass(tstr));
				break;
			case '[':
				var attrComps = tstr.match(/\[([^\"'~\^\$\*\|\]=]+)(([~\^\$\*\|]?=)\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\]/);
				var name = attrComps[1];				
				var matchType = attrComps[3];
				var val = attrComps[4];
				if (val)
				{
					val = val.replace(/^['"]|['"]$/g, "");
					val = val.replace(Spry.$$.escapeRegExpCharsRE, '\\$&');
				}

				var matchStr = undefined;

				switch(matchType)
				{
					case "=":
						matchStr = "^" + val + "$";
						break;
					case "^=":
						matchStr = "^" + val;
						break;
					case "$=":
						matchStr = val + "$";
						break;
					case "~=":
					case "|=":
						matchStr = "\\b" + val + "\\b";
						break;
					case "*=":
						matchStr = val;
						break;
				}

				tkn.attrs.push(new Spry.$$.Token.Attr(name, matchStr));
				break;
			default:
				var combiMatch = tstr.match(/^\s*([\s,~>\+])\s*$/);
				if (combiMatch)
				{
					if (combiMatch[1] == ',')
					{
						sequence = new Array;
						tokenSequences.push(sequence);
						tkn = new Spry.$$.Token;
						sequence.push(tkn);
					}
					else
					{
						tkn = new Spry.$$.Token;
						tkn.type = Spry.$$.Token.COMBINATOR;
						tkn.name = combiMatch[1];
						sequence.push(tkn);
						tkn = new Spry.$$.Token();
						sequence.push(tkn);
					}
				}
				else
					tkn.name = tstr.toLowerCase();
				break;
		}
		expMatch = tokenExpr.exec(s);
	}

	Spry.$$.cache[s] = tokenSequences;

	return tokenSequences;
};

Spry.$$.combinatorFuncs = {
	// Element Descendant

	" ": function(nodes, token)
	{
		var uid = ++Spry.$$.uniqueID;
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i];
			if (uid != n.spry$$uid)
			{
				// n.spry$$uid = uid;
				var ea = nodes[i].getElementsByTagName(token.name);
				var ne = ea.length;
				for (var j = 0; j < ne; j++)
				{
					var e = ea[j];
					if (token.match(e, true))
						results.push(e);
					e.spry$$uid = uid;
				}
			}
		}
		return results;
	},

	// Element Child

	">": function(nodes, token)
	{
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i].firstChild;
			while (n)
			{
				if (n.nodeType == 1 /* Node.ELEMENT_NODE */ && token.match(n))
					results.push(n);
				n = n.nextSibling;
			}
		}
		return results;
	},

	// Element Immediately Preceded By

	"+": function(nodes, token)
	{
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i].nextSibling;
			while (n && n.nodeType != 1 /* Node.ELEMENT_NODE */)
				n = n.nextSibling;
			if (n && token.match(n))
				results.push(n);
		}
		return results;
	},

	// Element Preceded By

	"~": function(nodes, token)
	{
		var uid = ++Spry.$$.uniqueID;
		var results = [];
		var nn = nodes.length;
		for (var i = 0; i < nn; i++)
		{
			var n = nodes[i].nextSibling;
			while (n)
			{
				if (n.nodeType == 1 /* Node.ELEMENT_NODE */)
				{
					if (uid == n.spry$$uid)
						break;

					if (token.match(n))
					{
						results.push(n);
						n.spry$$uid = uid;
					}
				}
				n = n.nextSibling;
			}
		}
		return results;
	}
};

Spry.$$.uniqueID = 0;

Spry.$$.pseudoFuncs = {
	":first-child": function(arg, node, token)
	{
		var n = node.previousSibling;
		while (n)
		{
			if (n.nodeType == 1) return false; // Node.ELEMENT_NODE
			n = n.previousSibling;
		}

		return true;
	},

	":last-child": function(arg, node, token)
	{
		var n = node.nextSibling;
		while (n)
		{
			if (n.nodeType == 1) // Node.ELEMENT_NODE
				return false;
			n = n.nextSibling;
		}
		return true;
	},

	":empty": function(arg, node, token)
	{
		var n = node.firstChild;
		while (n)
		{
			switch(n.nodeType)
			{
				case 1: // Node.ELEMENT_NODE
				case 3: // Node.TEXT_NODE
				case 4: // Node.CDATA_NODE
				case 5: // Node.ENTITY_REFERENCE_NODE
					return false;
			}
			n = n.nextSibling;
		}
		return true;
	},

	":nth-child": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token);
	},

	":nth-last-child": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token, true);
	},

	":nth-of-type": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token, false, true);
	},
	
	":nth-last-of-type": function(arg, node, token)
	{
		return Spry.$$.nthChild(arg, node, token, true, true);
	},
	
	":first-of-type": function(arg, node, token)
	{
		var nodeName = token.getNodeNameIfTypeMatches(node);
		if (!nodeName) return false;

		var n = node.previousSibling;
		while (n)
		{
			if (n.nodeType == 1 && nodeName == n.nodeName.toLowerCase()) return false; // Node.ELEMENT_NODE
			n = n.previousSibling;
		}

		return true;
	},

	":last-of-type": function(arg, node, token)
	{
		var nodeName = token.getNodeNameIfTypeMatches(node);
		if (!nodeName) return false;

		var n = node.nextSibling;
		while (n)
		{
			if (n.nodeType == 1 && nodeName == n.nodeName.toLowerCase()) // Node.ELEMENT_NODE
				return false;
			n = n.nextSibling;
		}
		return true;
	},

	":only-child": function(arg, node, token)
	{
		var f = Spry.$$.pseudoFuncs;
		return f[":first-child"](arg, node, token) && f[":last-child"](arg, node, token);
	},

	":only-of-type": function(arg, node, token)
	{
		var f = Spry.$$.pseudoFuncs;
		return f[":first-of-type"](arg, node, token) && f[":last-of-type"](arg, node, token);
	},

	":not": function(arg, node, token)
	{
		var s = Spry.$$.tokenizeSequence(arg)[0];
		var t = s ? s[0] : null;
		return !t || !t.match(node);
	},

	":enabled": function(arg, node, token)
	{
		return !node.disabled;
	},

	":disabled": function(arg, node, token)
	{
		return node.disabled;
	},

	":checked": function(arg, node, token)
	{
		return node.checked;
	},

	":root": function(arg, node, token)
	{
		return node.parentNode && node.ownerDocument && node.parentNode == node.ownerDocument;
	}
};

Spry.$$.nthRegExp = /((-|[0-9]+)?n)?([+-]?[0-9]*)/;

Spry.$$.nthCache = {
	  "even": { a: 2, b: 0, mode: 1, invalid: false }
	, "odd":  { a: 2, b: 1, mode: 1, invalid: false }
	, "2n":   { a: 2, b: 0, mode: 1, invalid: false }
	, "2n+1": { a: 2, b: 1, mode: 1, invalid: false }
};

Spry.$$.parseNthChildString = function(str)
{
	var o = Spry.$$.nthCache[str];
	if (!o)
	{
		var m = str.match(Spry.$$.nthRegExp);
		var n = m[1];
		var a = m[2];
		var b = m[3];

		if (!a)
		{
			// An 'a' value was not specified. Was there an 'n' present?
			// If so, we treat it as an increment of 1, otherwise we're
			// in no-repeat mode.

			a = n ? 1 : 0;
		}
		else if (a == "-")
		{
			// The string is using the "-n" short-hand which is
			// short for -1.

			a = -1;
		}
		else
		{
			// An integer repeat value for 'a' was specified. Convert
			// it into number.

			a = parseInt(a, 10);
		}

		// If a 'b' value was specified, turn it into a number.
		// If no 'b' value was specified, default to zero.

		b = b ? parseInt(b, 10) : 0;

		// Figure out the mode:
		//
		// -1 - repeat backwards
		//  0 - no repeat
		//  1 - repeat forwards

		var mode = (a == 0) ? 0 : ((a > 0) ? 1 : -1);
		var invalid = false;

		// Fix up 'a' and 'b' for proper repeating.

		if (a > 0 && b < 0)
		{
			b = b % a;
			b = ((b=(b%a)) < 0) ? a + b : b;
		}
		else if (a < 0)
		{
			if (b < 0)
				invalid = true;
			else
				a = Math.abs(a);
		}

		o = new Object;
		o.a = a;
		o.b = b;
		o.mode = mode;
		o.invalid = invalid;

		Spry.$$.nthCache[str] = o;
	}

	return o;
};

Spry.$$.nthChild = function(arg, node, token, fromLastSib, matchNodeName)
{
	if (matchNodeName)
	{
		var nodeName = token.getNodeNameIfTypeMatches(node);
		if (!nodeName) return false;
	}

	var o = Spry.$$.parseNthChildString(arg);

	if (o.invalid)
		return false;

	var qidProp = "spry$$ncQueryID";
	var posProp = "spry$$ncPos";
	var countProp = "spry$$ncCount";
	if (matchNodeName)
	{
		qidProp += nodeName;
		posProp += nodeName;
		countProp += nodeName;
	}

	var parent = node.parentNode;
	if (parent[qidProp] != Spry.$$.queryID)
	{
		var pos = 0;
		parent[qidProp] = Spry.$$.queryID;
		var c = parent.firstChild;
		while (c)
		{
			if (c.nodeType == 1 && (!matchNodeName || nodeName == c.nodeName.toLowerCase()))
				c[posProp] = ++pos;
			c = c.nextSibling;
		}
		parent[countProp] = pos;
	}

	pos = node[posProp];
	if (fromLastSib)
		pos = parent[countProp] - pos + 1;

/*
	var sib = fromLastSib ? "nextSibling" : "previousSibling";

	var pos = 1;
	var n = node[sib];
	while (n)
	{
		if (n.nodeType == 1 && (!matchNodeName || nodeName == n.nodeName.toLowerCase()))
		{
			if (n == node) break;
			++pos;
		}
		n = n[sib];
	}
*/

	if (o.mode == 0) // Exact match
		return pos == o.b;
	if (o.mode > 0) // Forward Repeat
		return (pos < o.b) ? false : (!((pos - o.b) % o.a));
	return (pos > o.b) ? false : (!((o.b - pos) % o.a)); // Backward Repeat
};

Spry.$$.processTokens = function(tokens, root)
{
	var numTokens = tokens.length;
	var nodeSet = [ root ];
	var combiFunc = null;

	for (var i = 0; i < numTokens && nodeSet.length > 0; i++)
	{
		var t = tokens[i];
		if (t.type == Spry.$$.Token.SELECTOR)
		{
			if (combiFunc)
			{
				nodeSet = combiFunc(nodeSet, t);
				combiFunc = null;
			}
			else
				nodeSet = Spry.$$.getMatchingElements(nodeSet, t);
		}
		else // Spry.$$.Token.COMBINATOR
			combiFunc = Spry.$$.combinatorFuncs[t.name];
	}
	return nodeSet;
};

Spry.$$.getMatchingElements = function(nodes, token)
{
	var results = [];
	if (token.id)
	{
		n = nodes[0];
		if (n && n.ownerDocument)
		{
			var e = n.ownerDocument.getElementById(token.id);
			if (e)
			{
				// XXX: We need to make sure that the element
				//      we found is actually underneath the root
				//      we were given!

				if (token.match(e))
					results.push(e);
			}
			return results;
		}
	}

	var nn = nodes.length;
	for (var i = 0; i < nn; i++)
	{
		var n = nodes[i];
		// if (token.match(n)) results.push(n);
		
		var ea = n.getElementsByTagName(token.name);
		var ne = ea.length;
		for (var j = 0; j < ne; j++)
		{
			var e = ea[j];
			if (token.match(e, true))
				results.push(e);
		}
	}
	return results;
};

/*
Spry.$$.dumpSequences = function(sequences)
{
	Spry.Debug.trace("<hr />Number of Sequences: " + sequences.length);
	for (var i = 0; i < sequences.length; i++)
	{
		var str = "";
		var s = sequences[i];
		Spry.Debug.trace("<hr />Sequence " + i + " -- Tokens: " + s.length);
		for (var j = 0; j < s.length; j++)
		{
			var t = s[j];
			if (t.type == Spry.$$.Token.SELECTOR)
			{
				str += "  SELECTOR:\n    Name: " + t.name + "\n    ID: " + t.id + "\n    Attrs:\n";
				for (var k = 0; k < t.classes.length; k++)
					str += "      " + t.classes[k].name + ": " + t.classes[k].value + "\n";
				for (var k = 0; k < t.attrs.length; k++)
					str += "      " + t.attrs[k].name + ": " + t.attrs[k].value + "\n";
				str += "    Pseudos:\n";
				for (var k = 0; k < t.pseudos.length; k++)
					str += "      " + t.pseudos[k].name + (t.pseudos[k].arg ? "(" + t.pseudos[k].arg + ")" : "") + "\n";
			}
			else
			{
				str += "  COMBINATOR:\n    Name: '" + t.name + "'\n"; 
			}
		}
		Spry.Debug.trace("<pre>" + Spry.Utils.encodeEntities(str) + "</pre>");
	}
};
*/

Spry.$$.addExtensions = function(a)
{
	for (var f in Spry.$$.Results)
		a[f] = Spry.$$.Results[f];
};

Spry.$$.Results = {};

Spry.$$.Results.forEach = function(func)
{
	var n = this.length;
	for (var i = 0; i < n; i++)
		func(this[i]);
	return this;
};

Spry.$$.Results.setAttribute = function(name, value)
{
	return this.forEach(function(n) { Spry.Utils.setAttribute(n, name, value); });
};

Spry.$$.Results.removeAttribute = function(name)
{
	return this.forEach(function(n) { Spry.Utils.removeAttribute(n, name); });
};

Spry.$$.Results.addClassName = function(className)
{
	return this.forEach(function(n) { Spry.Utils.addClassName(n, className); });
};

Spry.$$.Results.removeClassName = function(className)
{
	return this.forEach(function(n) { Spry.Utils.removeClassName(n, className); });
};

Spry.$$.Results.toggleClassName = function(className)
{
	return this.forEach(function(n) { Spry.Utils.toggleClassName(n, className); });
};

Spry.$$.Results.addEventListener = function(eventType, handler, capture, bindHandler)
{
	return this.forEach(function(n) { Spry.Utils.addEventListener(n, eventType, handler, capture, bindHandler); });
};

Spry.$$.Results.removeEventListener = function(eventType, handler, capture)
{
	return this.forEach(function(n) { Spry.Utils.removeEventListener(n, eventType, handler, capture); });
};

Spry.$$.Results.setStyle = function(style)
{
	if (style)
	{
		style = Spry.Utils.styleStringToObject(style);
		this.forEach(function(n)
		{
			for (var p in style)
				try { n.style[p] = style[p]; } catch (e) {}
		});
	}
	return this;
};

Spry.$$.Results.setProperty = function(prop, value)
{
	if (prop)
	{
		if (typeof prop == "string")
		{
			var p = {};
			p[prop] = value;
			prop = p;
		}

		this.forEach(function(n)
		{
			for (var p in prop)
				try { n[p] = prop[p]; } catch (e) {}
		});
	}
	return this;
};
;// SpryData.js - version 0.45 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {};

//////////////////////////////////////////////////////////////////////
//
// Spry.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.msProgIDs = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0"];

Spry.Utils.createXMLHttpRequest = function()
{
	var req = null;
	try
	{
		// Try to use the ActiveX version of XMLHttpRequest. This will
		// allow developers to load file URLs in IE7 when running in the
		// local zone.

		if (window.ActiveXObject)
		{
			while (!req && Spry.Utils.msProgIDs.length)
			{
				try { req = new ActiveXObject(Spry.Utils.msProgIDs[0]); } catch (e) { req = null; }
				if (!req)
					Spry.Utils.msProgIDs.splice(0, 1);
			}
		}

		// We're either running in a non-IE browser, or we failed to
		// create the ActiveX version of the XMLHttpRequest object.
		// Try to use the native version of XMLHttpRequest if it exists.

		if (!req && window.XMLHttpRequest)
			req = new XMLHttpRequest();
	}
	catch (e) { req = null;	}

	if (!req)
		Spry.Debug.reportError("Failed to create an XMLHttpRequest object!" );

	return req;
};

Spry.Utils.loadURL = function(method, url, async, callback, opts)
{
	var req = new Spry.Utils.loadURL.Request();
	req.method = method;
	req.url = url;
	req.async = async;
	req.successCallback = callback;
	Spry.Utils.setOptions(req, opts);

	try
	{
		req.xhRequest = Spry.Utils.createXMLHttpRequest();
		if (!req.xhRequest)
			return null;

		if (req.async)
			req.xhRequest.onreadystatechange = function() { Spry.Utils.loadURL.callback(req); };

		req.xhRequest.open(req.method, req.url, req.async, req.username, req.password);

		if (req.headers)
		{
			for (var name in req.headers)
				req.xhRequest.setRequestHeader(name, req.headers[name]);
		}

		req.xhRequest.send(req.postData);

		if (!req.async)
			Spry.Utils.loadURL.callback(req);
	}
	catch(e)
	{
		if (req.errorCallback)
			req.errorCallback(req);
		else
			Spry.Debug.reportError("Exception caught while loading " + url + ": " + e);
		req = null;
	}

	return req;
};

Spry.Utils.loadURL.callback = function(req)
{
	if (!req || req.xhRequest.readyState != 4)
		return;
	if (req.successCallback && (req.xhRequest.status == 200 || req.xhRequest.status == 0))
		req.successCallback(req);
	else if (req.errorCallback)
		req.errorCallback(req);
};

Spry.Utils.loadURL.Request = function()
{
	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
		this[props[i]] = null;

	this.method = "GET";
	this.async = true;
	this.headers = {};
};

Spry.Utils.loadURL.Request.props = [ "method", "url", "async", "username", "password", "postData", "successCallback", "errorCallback", "headers", "userData", "xhRequest" ];

Spry.Utils.loadURL.Request.prototype.extractRequestOptions = function(opts, undefineRequestProps)
{
	if (!opts)
		return;

	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
	{
		var prop = props[i];
		if (opts[prop] != undefined)
		{
			this[prop] = opts[prop];
			if (undefineRequestProps)
				opts[prop] = undefined;
		}
	}
};

Spry.Utils.loadURL.Request.prototype.clone = function()
{
	var props = Spry.Utils.loadURL.Request.props;
	var numProps = props.length;
	var req = new Spry.Utils.loadURL.Request;
	for (var i = 0; i < numProps; i++)
		req[props[i]] = this[props[i]];
	if (this.headers)
	{
		req.headers = {};
		Spry.Utils.setOptions(req.headers, this.headers);
	}
	return req;
};

Spry.Utils.setInnerHTML = function(ele, str, preventScripts)
{
	if (!ele)
		return;
	ele = Spry.$(ele);
	var scriptExpr = "<script[^>]*>(.|\s|\n|\r)*?</script>";
	ele.innerHTML = str.replace(new RegExp(scriptExpr, "img"), "");

	if (preventScripts)
		return;

	var matches = str.match(new RegExp(scriptExpr, "img"));
	if (matches)
	{
		var numMatches = matches.length;
		for (var i = 0; i < numMatches; i++)
		{
			var s = matches[i].replace(/<script[^>]*>[\s\r\n]*(<\!--)?|(-->)?[\s\r\n]*<\/script>/img, "");
			Spry.Utils.eval(s);
		}
	}
};

Spry.Utils.updateContent = function (ele, url, finishFunc, opts)
{
	Spry.Utils.loadURL("GET", url, true, function(req)
	{
		Spry.Utils.setInnerHTML(ele, req.xhRequest.responseText);
		if (finishFunc)
			finishFunc(ele, url);
	}, opts);
};

//////////////////////////////////////////////////////////////////////
//
// Functions from SpryDOMUtils.js
//   - These have been left in for backwards compatibility, but they
//     should only be defined if Spry.$$ (SpryDOMUtils.js) is not
//     already included.
//   - If SpryDOMUtils.js is included *after* SpryData.js, these
//     functions will be replaced with the latest versions in
//     SpryDOMUtils.js.
//
//////////////////////////////////////////////////////////////////////

if (!Spry.$$)
{
Spry.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = Spry.$(element);
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = Spry.$(element);
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spry.Utils.addLoadListener = function(handler)
{
	if (typeof window.addEventListener != 'undefined')
		window.addEventListener('load', handler, false);
	else if (typeof document.addEventListener != 'undefined')
		document.addEventListener('load', handler, false);
	else if (typeof window.attachEvent != 'undefined')
		window.attachEvent('onload', handler);
};

Spry.Utils.addClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1))
		return;
	ele.className += (ele.className ? " " : "") + className;
};

Spry.Utils.removeClassName = function(ele, className)
{
	ele = Spry.$(ele);
	if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1))
		return;
	ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
};

Spry.Utils.getObjectByName = function(name)
{
	var result = null;
	if (name)
	{
		var lu = window;
		var objPath = name.split(".");
		for (var i = 0; lu && i < objPath.length; i++)
		{
			result = lu[objPath[i]];
			lu = result;
		}
	}
	return result;
};

//////////////////////////////////////////////////////////////////////
//
// Define Prototype's $() convenience function, but make sure it is
// namespaced under Spry so that we avoid collisions with other
// toolkits.
//
//////////////////////////////////////////////////////////////////////

Spry.$ = function(element)
{
	if (arguments.length > 1)
	{
		for (var i = 0, elements = [], length = arguments.length; i < length; i++)
			elements.push(Spry.$(arguments[i]));
		return elements;
	}
	if (typeof element == 'string')
		element = document.getElementById(element);
	return element;
};
} // if (!Spry.$$)

//////////////////////////////////////////////////////////////////////

Spry.Utils.eval = function(str)
{
	// Call this method from your JS function when
	// you don't want the JS expression to access or
	// interfere with any local variables in your JS
	// function.

	return eval(str);
};

Spry.Utils.escapeQuotesAndLineBreaks = function(str)
{
	if (str)
	{
		str = str.replace(/\\/g, "\\\\");
		str = str.replace(/["']/g, "\\$&");
		str = str.replace(/\n/g, "\\n");
		str = str.replace(/\r/g, "\\r");
	}
	return str;
};

Spry.Utils.encodeEntities = function(str)
{
	if (str && str.search(/[&<>"]/) != -1)
	{
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
	}
	return str
};

Spry.Utils.decodeEntities = function(str)
{
	var d = Spry.Utils.decodeEntities.div;
	if (!d)
	{
		d = document.createElement('div');
		Spry.Utils.decodeEntities.div = d;
		if (!d) return str;
	}
	d.innerHTML = str;
	if (d.childNodes.length == 1 && d.firstChild.nodeType == 3 /* Node.TEXT_NODE */ && d.firstChild.nextSibling == null)
		str = d.firstChild.data;
	else
	{
		// Hmmm, innerHTML processing of str produced content
		// we weren't expecting, so just replace entities we
		// expect folks will use in node attributes that contain
		// JavaScript.
		str = str.replace(/&lt;/gi, "<");
		str = str.replace(/&gt;/gi, ">");
		str = str.replace(/&quot;/gi, "\"");
		str = str.replace(/&amp;/gi, "&");
	}
	return str;
};

Spry.Utils.fixupIETagAttributes = function(inStr)
{
	var outStr = "";

	// Break the tag string into 3 pieces.

	var tagStart = inStr.match(/^<[^\s>]+\s*/)[0];
	var tagEnd = inStr.match(/\s*\/?>$/)[0];
	var tagAttrs = inStr.replace(/^<[^\s>]+\s*|\s*\/?>/g, "");

	// Write out the start of the tag.
	outStr += tagStart;

	// If the tag has attributes, parse it out manually to avoid accidentally fixing up
	// attributes that contain JavaScript expressions.

	if (tagAttrs)
	{
		var startIndex = 0;
		var endIndex = 0;

		while (startIndex < tagAttrs.length)
		{
			// Find the '=' char of the attribute.
			while (tagAttrs.charAt(endIndex) != '=' && endIndex < tagAttrs.length)
				++endIndex;

			// If we are at the end of the string, just write out what we've
			// collected.

			if (endIndex >= tagAttrs.length)
			{
				outStr += tagAttrs.substring(startIndex, endIndex);
				break;
			}

			// Step past the '=' character and write out what we've
			// collected so far.

			++endIndex;
			outStr += tagAttrs.substring(startIndex, endIndex);
			startIndex = endIndex;

			if (tagAttrs.charAt(endIndex) == '"' || tagAttrs.charAt(endIndex) == "'")
			{
				// Attribute is quoted. Advance us past the quoted value!
				var savedIndex = endIndex++;
				while (endIndex < tagAttrs.length)
				{
					if (tagAttrs.charAt(endIndex) == tagAttrs.charAt(savedIndex))
					{
						endIndex++;
						break;
					}
					else if (tagAttrs.charAt(endIndex) == "\\")
						endIndex++;
					endIndex++;
				}

				outStr += tagAttrs.substring(startIndex, endIndex);
				startIndex = endIndex;
			}
			else
			{
				// This attribute value wasn't quoted! Wrap it with quotes and
				// write out everything till we hit a space, or the end of the
				// string.

				outStr += "\"";

				var sIndex = tagAttrs.slice(endIndex).search(/\s/);
				endIndex = (sIndex != -1) ? (endIndex + sIndex) : tagAttrs.length;
				outStr += tagAttrs.slice(startIndex, endIndex);
				outStr += "\"";
				startIndex = endIndex;
			}
		}
	}

	outStr += tagEnd;

	// Write out the end of the tag.
	return outStr;
};

Spry.Utils.fixUpIEInnerHTML = function(inStr)
{
	var outStr = "";

	// Create a regular expression that will match:
	//     <!--
	//     <![CDATA[
	//     <tag>
	//     -->
	//     ]]>
	//     ]]&gt;   // Yet another workaround for an IE innerHTML bug.
	//
	// The idea here is that we only want to fix up attribute values on tags that
	// are not in any comments or CDATA.

	var regexp = new RegExp("<\\!--|<\\!\\[CDATA\\[|<\\w+[^<>]*>|-->|\\]\\](>|\&gt;)", "g");
	var searchStartIndex = 0;
	var skipFixUp = 0;

	while (inStr.length)
	{
		var results = regexp.exec(inStr);
		if (!results || !results[0])
		{
			outStr += inStr.substr(searchStartIndex, inStr.length - searchStartIndex);
			break;
		}

		if (results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the inStr.
			// Create a string token for everything that precedes the match.
			outStr += inStr.substr(searchStartIndex, results.index - searchStartIndex);
		}

		if (results[0] == "<!--" || results[0] == "<![CDATA[")
		{
			++skipFixUp;
			outStr += results[0];
		}
		else if (results[0] == "-->" || results[0] == "]]>" || (skipFixUp && results[0] == "]]&gt;"))
		{
			--skipFixUp;
			outStr += results[0];
		}
		else if (!skipFixUp && results[0].charAt(0) == '<')
			outStr += Spry.Utils.fixupIETagAttributes(results[0]);
		else
			outStr += results[0];

		searchStartIndex = regexp.lastIndex;
	}

	return outStr;
};

Spry.Utils.stringToXMLDoc = function(str)
{
	var xmlDoc = null;

	try
	{
		// Attempt to parse the string using the IE method.

		var xmlDOMObj = new ActiveXObject("Microsoft.XMLDOM");
		xmlDOMObj.async = false;
		xmlDOMObj.loadXML(str);
		xmlDoc = xmlDOMObj;
	}
	catch (e)
	{
		// The IE method didn't work. Try the Mozilla way.

		try
		{
			var domParser = new DOMParser;
			xmlDoc = domParser.parseFromString(str, 'text/xml');
		}
		catch (e)
		{
			Spry.Debug.reportError("Caught exception in Spry.Utils.stringToXMLDoc(): " + e + "\n");
			xmlDoc = null;
		}
	}

	return xmlDoc;
};

Spry.Utils.serializeObject = function(obj)
{
	// Create a JSON representation of a given object.

	var str = "";
	var firstItem = true;

	if (obj == null || obj == undefined)
		return str + obj;

	var objType = typeof obj;

	if (objType == "number" || objType == "boolean")
		str += obj;
	else if (objType == "string")
		str += "\"" + Spry.Utils.escapeQuotesAndLineBreaks(obj) + "\"";
	else if (obj.constructor == Array)
	{
		str += "[";
		for (var i = 0; i < obj.length; i++)
		{
			if (!firstItem)
				str += ", ";
			str += Spry.Utils.serializeObject(obj[i]);
			firstItem = false;
		}
		str += "]";
	}
	else if (objType == "object")
	{
		str += "{";
		for (var p in obj)
		{
			if (!firstItem)
				str += ", ";
			str += "\"" + p + "\": " + Spry.Utils.serializeObject(obj[p]);
			firstItem = false;
		}
		str += "}";
	}
	return str;
};

Spry.Utils.getNodesByFunc = function(root, func)
{
	var nodeStack = new Array;
	var resultArr = new Array;
	var node = root;

	while (node)
	{
		if (func(node))
			resultArr.push(node);

		if (node.hasChildNodes())
		{
			nodeStack.push(node);
			node = node.firstChild;
		}
		else
		{
			if (node == root)
				node = null;
			else
				try { node = node.nextSibling; } catch (e) { node = null; };
		}

		while (!node && nodeStack.length > 0)
		{
			node = nodeStack.pop();
			if (node == root)
				node = null;
			else
				try { node = node.nextSibling; } catch (e) { node = null; }
		}
	}

	if (nodeStack && nodeStack.length > 0)
		Spry.Debug.trace("-- WARNING: Spry.Utils.getNodesByFunc() failed to traverse all nodes!\n");

	return resultArr;
};

// XXX: UNUSED FUNCTION
Spry.Utils.getFirstChildWithNodeName = function(node, nodeName)
{
	var child = node.firstChild;

	while (child)
	{
		if (child.nodeName == nodeName)
			return child;
		child = child.nextSibling;
	}

	return null;
};

Spry.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;

	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spry.Utils.SelectionManager = {};
Spry.Utils.SelectionManager.selectionGroups = new Object;

Spry.Utils.SelectionManager.SelectionGroup = function()
{
	this.selectedElements = new Array;
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.select = function(element, className, multiSelect)
{
	var selObj = null;

	if (!multiSelect)
	{
		// Multiple selection is not enabled, so clear any
		// selected elements from our list.

		this.clearSelection();
	}
	else
	{
		// Multiple selection is enabled, so check to see if element
		// is already in the array. If it is, make sure the className
		// is the className that was passed in.

		for (var i = 0; i < this.selectedElements.length; i++)
		{
			selObj = this.selectedElements[i].element;

			if (selObj.element == element)
			{
				if (selObj.className != className)
				{
					Spry.Utils.removeClassName(element, selObj.className);
					Spry.Utils.addClassName(element, className);
				}
				return;
			}
		}
	}

	// Add the element to our list of selected elements.

	selObj = new Object;
	selObj.element = element;
	selObj.className = className;
	this.selectedElements.push(selObj);
	Spry.Utils.addClassName(element, className);
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.unSelect = function(element)
{
	for (var i = 0; i < this.selectedElements.length; i++)
	{
		var selObj = this.selectedElements[i].element;

		if (selObj.element == element)
		{
			Spry.Utils.removeClassName(selObj.element, selObj.className);
			return;
		}
	}
};

Spry.Utils.SelectionManager.SelectionGroup.prototype.clearSelection = function()
{
	var selObj = null;

	do
	{
		selObj = this.selectedElements.shift();
		if (selObj)
			Spry.Utils.removeClassName(selObj.element, selObj.className);
	}
	while (selObj);
};

Spry.Utils.SelectionManager.getSelectionGroup = function(selectionGroupName)
{
	if (!selectionGroupName)
		return null;

	var groupObj = Spry.Utils.SelectionManager.selectionGroups[selectionGroupName];

	if (!groupObj)
	{
		groupObj = new Spry.Utils.SelectionManager.SelectionGroup();
		Spry.Utils.SelectionManager.selectionGroups[selectionGroupName] = groupObj;
	}

	return groupObj;
};

Spry.Utils.SelectionManager.select = function(selectionGroupName, element, className, multiSelect)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.select(element, className, multiSelect);
};

Spry.Utils.SelectionManager.unSelect = function(selectionGroupName, element)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.unSelect(element, className);
};

Spry.Utils.SelectionManager.clearSelection = function(selectionGroupName)
{
	var groupObj = Spry.Utils.SelectionManager.getSelectionGroup(selectionGroupName);

	if (!groupObj)
		return;

	groupObj.clearSelection();
};

Spry.Utils.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Utils.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
	{
		if (this.observers[i] == observer)
			return;
	}
	this.observers[len] = observer;
};

Spry.Utils.Notifier.prototype.removeObserver = function(observer)
{
	if (!observer)
		return;

	for (var i = 0; i < this.observers.length; i++)
	{
		if (this.observers[i] == observer)
		{
			this.observers.splice(i, 1);
			break;
		}
	}
};

Spry.Utils.Notifier.prototype.notifyObservers = function(methodName, data)
{
	if (!methodName)
		return;

	if (!this.suppressNotifications)
	{
		var len = this.observers.length;
		for (var i = 0; i < len; i++)
		{
			var obs = this.observers[i];
			if (obs)
			{
				if (typeof obs == "function")
					obs(methodName, this, data);
				else if (obs[methodName])
					obs[methodName](this, data);
			}
		}
	}
};

Spry.Utils.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Utils.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Debug
//
//////////////////////////////////////////////////////////////////////

Spry.Debug = {};
Spry.Debug.enableTrace = true;
Spry.Debug.debugWindow = null;
Spry.Debug.onloadDidFire = false;

Spry.Utils.addLoadListener(function() { Spry.Debug.onloadDidFire = true; Spry.Debug.flushQueuedMessages(); });

Spry.Debug.flushQueuedMessages = function()
{
	if (Spry.Debug.flushQueuedMessages.msgs)
	{
		var msgs = Spry.Debug.flushQueuedMessages.msgs;
		for (var i = 0; i < msgs.length; i++)
			Spry.Debug.debugOut(msgs[i].msg, msgs[i].color);
		Spry.Debug.flushQueuedMessages.msgs = null;
	}
};

Spry.Debug.createDebugWindow = function()
{
	if (!Spry.Debug.enableTrace || Spry.Debug.debugWindow || !Spry.Debug.onloadDidFire)
		return;
	try
	{
		Spry.Debug.debugWindow = document.createElement("div");
		var div = Spry.Debug.debugWindow;
		div.style.fontSize = "12px";
		div.style.fontFamily = "console";
		div.style.position = "absolute";
		div.style.width = "400px";
		div.style.height = "300px";
		div.style.overflow = "auto";
		div.style.border = "solid 1px black";
		div.style.backgroundColor = "white";
		div.style.color = "black";
		div.style.bottom = "0px";
		div.style.right = "0px";
		// div.style.opacity = "0.5";
		// div.style.filter = "alpha(opacity=50)";
		div.setAttribute("id", "SpryDebugWindow");
		document.body.appendChild(Spry.Debug.debugWindow);
	}
	catch (e) {}
};

Spry.Debug.debugOut = function(str, bgColor)
{
	if (!Spry.Debug.debugWindow)
	{
		Spry.Debug.createDebugWindow();
		if (!Spry.Debug.debugWindow)
		{
			if (!Spry.Debug.flushQueuedMessages.msgs)
				Spry.Debug.flushQueuedMessages.msgs = new Array;
			Spry.Debug.flushQueuedMessages.msgs.push({msg: str, color: bgColor});
			return;
		}
	}

	var d = document.createElement("div");
	if (bgColor)
		d.style.backgroundColor = bgColor;
	d.innerHTML = str;
	Spry.Debug.debugWindow.appendChild(d);
};

Spry.Debug.trace = function(str)
{
	Spry.Debug.debugOut(str);
};

Spry.Debug.reportError = function(str)
{
	Spry.Debug.debugOut(str, "red");
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data
//
//////////////////////////////////////////////////////////////////////

Spry.Data = {};
Spry.Data.regionsArray = {};
Spry.Data.initRegionsOnLoad = true;

Spry.Data.initRegions = function(rootNode)
{
	rootNode = rootNode ? Spry.$(rootNode) : document.body;

	var lastRegionFound = null;

	var regions = Spry.Utils.getNodesByFunc(rootNode, function(node)
	{
		try
		{
			if (node.nodeType != 1 /* Node.ELEMENT_NODE */)
				return false;

			// Region elements must have an spryregion attribute with a
			// non-empty value. An id attribute is also required so we can
			// reference the region by name if necessary.

			var attrName = "spry:region";
			var attr = node.attributes.getNamedItem(attrName);
			if (!attr)
			{
				attrName = "spry:detailregion";
				attr = node.attributes.getNamedItem(attrName);
			}
			if (attr)
			{
				if (lastRegionFound)
				{
					var parent = node.parentNode;
					while (parent)
					{
						if (parent == lastRegionFound)
						{
							Spry.Debug.reportError("Found a nested " + attrName + " in the following markup. Nested regions are currently not supported.<br/><pre>" + Spry.Utils.encodeEntities(parent.innerHTML) + "</pre>");
							return false;
						}
						parent = parent.parentNode;
					}
				}

				if (attr.value)
				{
					attr = node.attributes.getNamedItem("id");
					if (!attr || !attr.value)
					{
						// The node is missing an id attribute so add one.
						node.setAttribute("id", "spryregion" + (++Spry.Data.initRegions.nextUniqueRegionID));
					}

					lastRegionFound = node;
					return true;
				}
				else
					Spry.Debug.reportError(attrName + " attributes require one or more data set names as values!");
			}
		}
		catch(e) {}
		return false;
	});

	var name, dataSets, i;
	var newRegions = [];

	for (i = 0; i < regions.length; i++)
	{
		var rgn = regions[i];

		var isDetailRegion = false;

		// Get the region name.
		name = rgn.attributes.getNamedItem("id").value;

		attr = rgn.attributes.getNamedItem("spry:region");
		if (!attr)
		{
			attr = rgn.attributes.getNamedItem("spry:detailregion");
			isDetailRegion = true;
		}

		if (!attr.value)
		{
			Spry.Debug.reportError("spry:region and spry:detailregion attributes require one or more data set names as values!");
			continue;
		}

		// Remove the spry:region or spry:detailregion attribute so it doesn't appear in
		// the output generated by our processing of the dynamic region.
		rgn.attributes.removeNamedItem(attr.nodeName);

		// Remove the hiddenRegionCSS class from the rgn.
		Spry.Utils.removeClassName(rgn, Spry.Data.Region.hiddenRegionClassName);

		// Get the DataSets that should be bound to the region.
		dataSets = Spry.Data.Region.strToDataSetsArray(attr.value);

		if (!dataSets.length)
		{
			Spry.Debug.reportError("spry:region or spry:detailregion attribute has no data set!");
			continue;
		}

		var hasBehaviorAttributes = false;
		var hasSpryContent = false;
		var dataStr = "";

		var parent = null;
		var regionStates = {};
		var regionStateMap = {};

		// Check if there are any attributes on the region node that remap
		// the default states.

		attr = rgn.attributes.getNamedItem("spry:readystate");
		if (attr && attr.value)
			regionStateMap["ready"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:errorstate");
		if (attr && attr.value)
			regionStateMap["error"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:loadingstate");
		if (attr && attr.value)
			regionStateMap["loading"] = attr.value;
		attr = rgn.attributes.getNamedItem("spry:expiredstate");
		if (attr && attr.value)
			regionStateMap["expired"] = attr.value;

		// Find all of the processing instruction regions in the region.
		// Insert comments around the regions we find so we can identify them
		// easily when tokenizing the region html string.

		var piRegions = Spry.Utils.getNodesByFunc(rgn, function(node)
		{
			try
			{
				if (node.nodeType == 1 /* ELEMENT_NODE */)
				{
					var attributes = node.attributes;
					var numPI = Spry.Data.Region.PI.orderedInstructions.length;
					var lastStartComment = null;
					var lastEndComment = null;

					for (var i = 0; i < numPI; i++)
					{
						var piName = Spry.Data.Region.PI.orderedInstructions[i];
						var attr = attributes.getNamedItem(piName);
						if (!attr)
							continue;

						var piDesc = Spry.Data.Region.PI.instructions[piName];
						var childrenOnly = (node == rgn) ? true : piDesc.childrenOnly;
						var openTag = piDesc.getOpenTag(node, piName);
						var closeTag = piDesc.getCloseTag(node, piName);

						if (childrenOnly)
						{
								var oComment = document.createComment(openTag);
								var cComment = document.createComment(closeTag);

								if (!lastStartComment)
									node.insertBefore(oComment, node.firstChild);
								else
									node.insertBefore(oComment, lastStartComment.nextSibling);
								lastStartComment = oComment;

								if (!lastEndComment)
									node.appendChild(cComment);
								else
									node.insertBefore(cComment, lastEndComment);
								lastEndComment = cComment;
						}
						else
						{
							var parent = node.parentNode;
							parent.insertBefore(document.createComment(openTag), node);
							parent.insertBefore(document.createComment(closeTag), node.nextSibling);
						}

						// If this is a spry:state processing instruction, record the state name
						// so we know that we should re-generate the region if we ever see that state.

						if (piName == "spry:state")
							regionStates[attr.value] = true;

						node.removeAttribute(piName);
					}

					if (Spry.Data.Region.enableBehaviorAttributes)
					{
						var bAttrs = Spry.Data.Region.behaviorAttrs;
						for (var behaviorAttrName in bAttrs)
						{
							var bAttr = attributes.getNamedItem(behaviorAttrName);
							if (bAttr)
							{
								hasBehaviorAttributes = true;
								if (bAttrs[behaviorAttrName].setup)
									bAttrs[behaviorAttrName].setup(node, bAttr.value);
							}
						}
					}
				}
			}
			catch(e) {}
			return false;
		});

		// Get the data in the region.
		dataStr = rgn.innerHTML;

		// Argh! IE has an innerHTML bug where it will remove the quotes around any
		// attribute value that it thinks is a single word. This includes removing quotes
		// around our data references which is problematic since a single data reference
		// can be replaced with multiple words. If we are running in IE, we have to call
		// fixUpIEInnerHTML to get around this problem.

		if (window.ActiveXObject && !Spry.Data.Region.disableIEInnerHTMLFixUp && dataStr.search(/=\{/) != -1)
		{
			if (Spry.Data.Region.debug)
				Spry.Debug.trace("<hr />Performing IE innerHTML fix up of Region: " + name + "<br /><br />" + Spry.Utils.encodeEntities(dataStr));

			dataStr = Spry.Utils.fixUpIEInnerHTML(dataStr);
		}

		if (Spry.Data.Region.debug)
			Spry.Debug.trace("<hr />Region template markup for '" + name + "':<br /><br />" + Spry.Utils.encodeEntities(dataStr));

		if (!hasSpryContent)
		{
			// Clear the region.
			rgn.innerHTML = "";
		}

		// Create a Spry.Data.Region object for this region.
		var region = new Spry.Data.Region(rgn, name, isDetailRegion, dataStr, dataSets, regionStates, regionStateMap, hasBehaviorAttributes);
		Spry.Data.regionsArray[region.name] = region;
		newRegions.push(region);
	}

	for (var i = 0; i < newRegions.length; i++)
		newRegions[i].updateContent();
};

Spry.Data.initRegions.nextUniqueRegionID = 0;

Spry.Data.updateRegion = function(regionName)
{
	if (!regionName || !Spry.Data.regionsArray || !Spry.Data.regionsArray[regionName])
		return;

	try { Spry.Data.regionsArray[regionName].updateContent(); }
	catch(e) { Spry.Debug.reportError("Spry.Data.updateRegion(" + regionName + ") caught an exception: " + e + "\n"); }
};

Spry.Data.getRegion = function(regionName)
{
	return Spry.Data.regionsArray[regionName];
};


Spry.Data.updateAllRegions = function()
{
	if (!Spry.Data.regionsArray)
		return;

	for (var regionName in Spry.Data.regionsArray)
		Spry.Data.updateRegion(regionName);
};

Spry.Data.getDataSetByName = function(dataSetName)
{
	// Currently, there is no registry of mappings between
	// data set names and data set objects. For now, the assumption
	// is that the user has declared and created a data set in the
	// global space.
	//
	// We check for the presence of a global variable with the
	// specified name, and then make sure that its value is an
	// object with at least 2 of the data set base functions defined.

	var ds = window[dataSetName];
	if (typeof ds != "object" || !ds.getData || !ds.filter)
		return null;
	return ds;
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.DataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.DataSet = function(options)
{
	Spry.Utils.Notifier.call(this);

	this.name = "";
	this.internalID = Spry.Data.DataSet.nextDataSetID++;
	this.curRowID = 0;
	this.data = [];
	this.unfilteredData = null;
	this.dataHash = {};
	this.columnTypes = {};
	this.filterFunc = null;		// non-destructive filter function
	this.filterDataFunc = null;	// destructive filter function

	this.distinctOnLoad = false;
	this.distinctFieldsOnLoad = null;
	this.sortOnLoad = null;
	this.sortOrderOnLoad = "ascending";
	this.keepSorted = false;

	this.dataWasLoaded = false;
	this.pendingRequest = null;

	this.lastSortColumns = [];
	this.lastSortOrder = "";

	this.loadIntervalID = 0;

	Spry.Utils.setOptions(this, options);
};

Spry.Data.DataSet.prototype = new Spry.Utils.Notifier();
Spry.Data.DataSet.prototype.constructor = Spry.Data.DataSet;

Spry.Data.DataSet.prototype.getData = function(unfiltered)
{
	return (unfiltered && this.unfilteredData) ? this.unfilteredData : this.data;
};

Spry.Data.DataSet.prototype.getUnfilteredData = function()
{
	// XXX: Deprecated.
	return this.getData(true);
};

Spry.Data.DataSet.prototype.getLoadDataRequestIsPending = function()
{
	return this.pendingRequest != null;
};

Spry.Data.DataSet.prototype.getDataWasLoaded = function()
{
	return this.dataWasLoaded;
};

Spry.Data.DataSet.prototype.getValue = function(valueName, rowContext)
{
	var result = undefined;

	// If a rowContext is not defined, we default to
	// using the current row.

	if (!rowContext)
		rowContext = this.getCurrentRow();

	switch(valueName)
	{
		case "ds_RowNumber":
			result = this.getRowNumber(rowContext);
			break;
		case "ds_RowNumberPlus1":
			result = this.getRowNumber(rowContext) + 1;
			break;
		case "ds_RowCount":
			result = this.getRowCount();
			break;
		case "ds_UnfilteredRowCount":
			result = this.getRowCount(true);
			break;
		case "ds_CurrentRowNumber":
			result = this.getCurrentRowNumber();
			break;
		case "ds_CurrentRowID":
			result = this.getCurrentRowID();
			break;
		case "ds_EvenOddRow":
			result = (this.getRowNumber(rowContext) % 2) ? Spry.Data.Region.evenRowClassName : Spry.Data.Region.oddRowClassName;
			break;
		case "ds_SortOrder":
			result = this.getSortOrder();
			break;
		case "ds_SortColumn":
			result = this.getSortColumn();
			break;
		default:
			// We have an unknown value, check to see if the current
			// row has column value that matches the valueName.
			if (rowContext)
				result = rowContext[valueName];
			break;
	}

	return result;
};

Spry.Data.DataSet.prototype.setDataFromArray = function(arr, fireSyncLoad)
{
	this.notifyObservers("onPreLoad");

	this.unfilteredData = null;
	this.filteredData = null;
	this.data = [];
	this.dataHash = {};

	var arrLen = arr.length;

	for (var i = 0; i < arrLen; i++)
	{
		var row = arr[i];
		if (row.ds_RowID == undefined)
			row.ds_RowID = i;
		this.dataHash[row.ds_RowID] = row;
		this.data.push(row);
	}

	this.loadData(fireSyncLoad);
};

Spry.Data.DataSet.prototype.loadData = function(syncLoad)
{
	// The idea here is that folks using the base class DataSet directly
	// would change the data in the DataSet manually and then call loadData()
	// to fire off an async notifications to say that it was ready for consumption.
	//
	// Firing off data changed notificataions synchronously from this method
	// can wreak havoc with complicated master/detail regions that use data sets
	// that have master/detail relationships with other data sets. Our data set
	// logic already handles async data loading nicely so we use a timer to fire
	// off the data changed notification to insure that it happens after this
	// function is finished and the JS stack unwinds.
	//
	// Other classes that derive from this class and load data synchronously
	// inside their loadData() implementation should also fire off an async
	// notification in this same manner to avoid this same problem.

	var self = this;

	this.pendingRequest = new Object;
	this.dataWasLoaded = false;

	var loadCallbackFunc = function()
	{
		self.pendingRequest = null;
		self.dataWasLoaded = true;

		self.applyColumnTypes();

		self.disableNotifications();
		self.filterAndSortData();
		self.enableNotifications();

		self.notifyObservers("onPostLoad");
		self.notifyObservers("onDataChanged");
	};

	if (syncLoad)
		loadCallbackFunc();
	else
		this.pendingRequest.timer = setTimeout(loadCallbackFunc, 0);
};


Spry.Data.DataSet.prototype.filterAndSortData = function()
{
	// If there is a data filter installed, run it.

	if (this.filterDataFunc)
		this.filterData(this.filterDataFunc, true);

	// If the distinct flag was set, run through all the records in the recordset
	// and toss out any that are duplicates.

	if (this.distinctOnLoad)
		this.distinct(this.distinctFieldsOnLoad);

	// If sortOnLoad was set, sort the data based on the columns
	// specified in sortOnLoad.

	if (this.keepSorted && this.getSortColumn())
		this.sort(this.lastSortColumns, this.lastSortOrder);
	else if (this.sortOnLoad)
		this.sort(this.sortOnLoad, this.sortOrderOnLoad);

	// If there is a view filter installed, run it.

	if (this.filterFunc)
		this.filter(this.filterFunc, true);

	// The default "current" row is the first row of the data set.
	if (this.data && this.data.length > 0)
		this.curRowID = this.data[0]['ds_RowID'];
	else
		this.curRowID = 0;
};

Spry.Data.DataSet.prototype.cancelLoadData = function()
{
	if (this.pendingRequest && this.pendingRequest.timer)
		clearTimeout(this.pendingRequest.timer);
	this.pendingRequest = null;
};

Spry.Data.DataSet.prototype.getRowCount = function(unfiltered)
{
	var rows = this.getData(unfiltered);
	return rows ? rows.length : 0;
};

Spry.Data.DataSet.prototype.getRowByID = function(rowID)
{
	if (!this.data)
		return null;
	return this.dataHash[rowID];
};

Spry.Data.DataSet.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	var rows = this.getData(unfiltered);
	if (rows && rowNumber >= 0 && rowNumber < rows.length)
		return rows[rowNumber];
	return null;
};

Spry.Data.DataSet.prototype.getCurrentRow = function()
{
	return this.getRowByID(this.curRowID);
};

Spry.Data.DataSet.prototype.setCurrentRow = function(rowID)
{
	if (this.curRowID == rowID)
		return;

	var nData = { oldRowID: this.curRowID, newRowID: rowID };
	this.curRowID = rowID;
	this.notifyObservers("onCurrentRowChanged", nData);
};

Spry.Data.DataSet.prototype.getRowNumber = function(row, unfiltered)
{
	if (row)
	{
		var rows = this.getData(unfiltered);
		if (rows && rows.length)
		{
			var numRows = rows.length;
			for (var i = 0; i < numRows; i++)
			{
				if (rows[i] == row)
					return i;
			}
		}
	}
	return -1;
};

Spry.Data.DataSet.prototype.getCurrentRowNumber = function()
{
	return this.getRowNumber(this.getCurrentRow());
};

Spry.Data.DataSet.prototype.getCurrentRowID = function()
{
	return this.curRowID;
};

Spry.Data.DataSet.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (!this.data || rowNumber >= this.data.length)
	{
		Spry.Debug.trace("Invalid row number: " + rowNumber + "\n");
		return;
	}

	var rowID = this.data[rowNumber]["ds_RowID"];

	if (rowID == undefined || this.curRowID == rowID)
		return;

	this.setCurrentRow(rowID);
};

Spry.Data.DataSet.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	var results = [];
	var rows = this.getData(unfiltered);
	if (rows)
	{
		var numRows = rows.length;
		for (var i = 0; i < numRows; i++)
		{
			var row = rows[i];
			var matched = true;

			for (var colName in valueObj)
			{
				if (valueObj[colName] != row[colName])
				{
					matched = false;
					break;
				}
			}

			if (matched)
			{
				if (firstMatchOnly)
					return row;
				results.push(row);
			}
		}
	}

	return firstMatchOnly ? null : results;
};

Spry.Data.DataSet.prototype.setColumnType = function(columnNames, columnType)
{
	if (columnNames)
	{
		if (typeof columnNames == "string")
			columnNames = [ columnNames ];
		for (var i = 0; i < columnNames.length; i++)
			this.columnTypes[columnNames[i]] = columnType;
	}
};

Spry.Data.DataSet.prototype.getColumnType = function(columnName)
{
	if (this.columnTypes[columnName])
		return this.columnTypes[columnName];
	return "string";
};

Spry.Data.DataSet.prototype.applyColumnTypes = function()
{
	var rows = this.getData(true);
	var numRows = rows.length;
	var colNames = [];

	if (numRows < 1)
		return;

	for (var cname in this.columnTypes)
	{
		var ctype = this.columnTypes[cname];
		if (ctype != "string")
		{
			for (var i = 0; i < numRows; i++)
			{
				var row = rows[i];
				var val = row[cname];
				if (val != undefined)
				{
					if (ctype == "number")
						row[cname] = new Number(val);
					else if (ctype == "html")
						row[cname] = Spry.Utils.decodeEntities(val);
				}
			}
		}
	}
};

Spry.Data.DataSet.prototype.distinct = function(columnNames)
{
	if (this.data)
	{
		var oldData = this.data;
		this.data = [];
		this.dataHash = {};
		var dataChanged = false;

		var alreadySeenHash = {};
		var i = 0;

		var keys = [];

		if (typeof columnNames == "string")
			keys = [columnNames];
		else if (columnNames)
			keys = columnNames;
		else
			for (var recField in oldData[0])
				keys[i++] = recField;

		for (var i = 0; i < oldData.length; i++)
		{
			var rec = oldData[i];
			var hashStr = "";
			for (var j=0; j < keys.length; j++)
			{
				recField = keys[j];
				if (recField != "ds_RowID")
				{
					if (hashStr)
						hashStr += ",";
					hashStr += recField + ":" + "\"" + rec[recField] + "\"";
				}
			}
			if (!alreadySeenHash[hashStr])
			{
				this.data.push(rec);
				this.dataHash[rec['ds_RowID']] = rec;
				alreadySeenHash[hashStr] = true;
			}
			else
				dataChanged = true;
		}
		if (dataChanged)
			this.notifyObservers('onDataChanged');
	}
};

Spry.Data.DataSet.prototype.getSortColumn = function() {
	return (this.lastSortColumns && this.lastSortColumns.length > 0) ? this.lastSortColumns[0] : "";
};

Spry.Data.DataSet.prototype.getSortOrder = function() {
	return this.lastSortOrder ? this.lastSortOrder : "";
};

Spry.Data.DataSet.prototype.sort = function(columnNames, sortOrder)
{
	// columnNames can be either the name of a column to
	// sort on, or an array of column names, but it can't be
	// null/undefined.

	if (!columnNames)
		return;

	// If only one column name was specified for sorting, do a
	// secondary sort on ds_RowID so we get a stable sort order.

	if (typeof columnNames == "string")
		columnNames = [ columnNames, "ds_RowID" ];
	else if (columnNames.length < 2 && columnNames[0] != "ds_RowID")
		columnNames.push("ds_RowID");

	if (!sortOrder)
		sortOrder = "toggle";

	if (sortOrder == "toggle")
	{
		if (this.lastSortColumns.length > 0 && this.lastSortColumns[0] == columnNames[0] && this.lastSortOrder == "ascending")
			sortOrder = "descending";
		else
			sortOrder = "ascending";
	}

	if (sortOrder != "ascending" && sortOrder != "descending")
	{
		Spry.Debug.reportError("Invalid sort order type specified: " + sortOrder + "\n");
		return;
	}

	var nData = {
		oldSortColumns: this.lastSortColumns,
		oldSortOrder: this.lastSortOrder,
		newSortColumns: columnNames,
		newSortOrder: sortOrder
	};
	this.notifyObservers("onPreSort", nData);

	var cname = columnNames[columnNames.length - 1];
	var sortfunc = Spry.Data.DataSet.prototype.sort.getSortFunc(cname, this.getColumnType(cname), sortOrder);

	for (var i = columnNames.length - 2; i >= 0; i--)
	{
		cname = columnNames[i];
		sortfunc = Spry.Data.DataSet.prototype.sort.buildSecondarySortFunc(Spry.Data.DataSet.prototype.sort.getSortFunc(cname, this.getColumnType(cname), sortOrder), sortfunc);
	}

	if (this.unfilteredData)
	{
		this.unfilteredData.sort(sortfunc);
		if (this.filterFunc)
			this.filter(this.filterFunc, true);
	}
	else
		this.data.sort(sortfunc);

	this.lastSortColumns = columnNames.slice(0); // Copy the array.
	this.lastSortOrder = sortOrder;

	this.notifyObservers("onPostSort", nData);
};

Spry.Data.DataSet.prototype.sort.getSortFunc = function(prop, type, order)
{
	var sortfunc = null;
	if (type == "number")
	{
		if (order == "ascending")
			sortfunc = function(a, b)
			{
				a = a[prop]; b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? 1 : -1);
				return a-b;
			};
		else // order == "descending"
			sortfunc = function(a, b)
			{
				a = a[prop]; b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? -1 : 1);
				return b-a;
			};
	}
	else if (type == "date")
	{
		if (order == "ascending")
			sortfunc = function(a, b)
			{
				var dA = a[prop];
				var dB = b[prop];
				dA = dA ? (new Date(dA)) : 0;
				dB = dB ? (new Date(dB)) : 0;
				return dA - dB;
			};
		else // order == "descending"
			sortfunc = function(a, b)
			{
				var dA = a[prop];
				var dB = b[prop];
				dA = dA ? (new Date(dA)) : 0;
				dB = dB ? (new Date(dB)) : 0;
				return dB - dA;
			};
	}
	else // type == "string" || type == "html"
	{
		if (order == "ascending")
			sortfunc = function(a, b){
				a = a[prop];
				b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? 1 : -1);
				var tA = a.toString();
				var tB = b.toString();
				var tA_l = tA.toLowerCase();
				var tB_l = tB.toLowerCase();
				var min_len = tA.length > tB.length ? tB.length : tA.length;

				for (var i=0; i < min_len; i++)
				{
					var a_l_c = tA_l.charAt(i);
					var b_l_c = tB_l.charAt(i);
					var a_c = tA.charAt(i);
					var b_c = tB.charAt(i);
					if (a_l_c > b_l_c)
						return 1;
					else if (a_l_c < b_l_c)
						return -1;
					else if (a_c > b_c)
						return 1;
					else if (a_c < b_c)
						return -1;
				}
				if(tA.length == tB.length)
					return 0;
				else if (tA.length > tB.length)
					return 1;
				return -1;
			};
		else // order == "descending"
			sortfunc = function(a, b){
				a = a[prop];
				b = b[prop];
				if (a == undefined || b == undefined)
					return (a == b) ? 0 : (a ? -1 : 1);
				var tA = a.toString();
				var tB = b.toString();
				var tA_l = tA.toLowerCase();
				var tB_l = tB.toLowerCase();
				var min_len = tA.length > tB.length ? tB.length : tA.length;
				for (var i=0; i < min_len; i++)
				{
					var a_l_c = tA_l.charAt(i);
					var b_l_c = tB_l.charAt(i);
					var a_c = tA.charAt(i);
					var b_c = tB.charAt(i);
					if (a_l_c > b_l_c)
						return -1;
					else if (a_l_c < b_l_c)
						return 1;
					else if (a_c > b_c)
						return -1;
					else if (a_c < b_c)
						return 1;
				}
				if(tA.length == tB.length)
					return 0;
				else if (tA.length > tB.length)
					return -1;
				return 1;
			};
	}

	return sortfunc;
};

Spry.Data.DataSet.prototype.sort.buildSecondarySortFunc = function(funcA, funcB)
{
	return function(a, b)
	{
		var ret = funcA(a, b);
		if (ret == 0)
			ret = funcB(a, b);
		return ret;
	};
};

Spry.Data.DataSet.prototype.filterData = function(filterFunc, filterOnly)
{
	// This is a destructive filter function.

	var dataChanged = false;

	if (!filterFunc)
	{
		// Caller wants to remove the filter.

		this.filterDataFunc = null;
		dataChanged = true;
	}
	else
	{
		this.filterDataFunc = filterFunc;

		if (this.dataWasLoaded && ((this.unfilteredData && this.unfilteredData.length) || (this.data && this.data.length)))
		{
			if (this.unfilteredData)
			{
				this.data = this.unfilteredData;
				this.unfilteredData = null;
			}

			var oldData = this.data;
			this.data = [];
			this.dataHash = {};

			for (var i = 0; i < oldData.length; i++)
			{
				var newRow = filterFunc(this, oldData[i], i);
				if (newRow)
				{
					this.data.push(newRow);
					this.dataHash[newRow["ds_RowID"]] = newRow;
				}
			}

			dataChanged = true;
		}
	}

	if (dataChanged)
	{
		if (!filterOnly)
		{
			this.disableNotifications();
			if (this.filterFunc)
				this.filter(this.filterFunc, true);
			this.enableNotifications();
		}

		this.notifyObservers("onDataChanged");
	}
};

Spry.Data.DataSet.prototype.filter = function(filterFunc, filterOnly)
{
	// This is a non-destructive filter function.

	var dataChanged = false;

	if (!filterFunc)
	{
		if (this.filterFunc && this.unfilteredData)
		{
			// Caller wants to remove the filter. Restore the unfiltered
			// data and trigger a data changed notification.

			this.data = this.unfilteredData;
			this.unfilteredData = null;
			this.filterFunc = null;
			dataChanged = true;
		}
	}
	else
	{
		this.filterFunc = filterFunc;

		if (this.dataWasLoaded && (this.unfilteredData || (this.data && this.data.length)))
		{
			if (!this.unfilteredData)
				this.unfilteredData = this.data;

			var udata = this.unfilteredData;
			this.data = [];

			for (var i = 0; i < udata.length; i++)
			{
				var newRow = filterFunc(this, udata[i], i);

				if (newRow)
					this.data.push(newRow);
			}

			dataChanged = true;
		}
	}

	if (dataChanged)
		this.notifyObservers("onDataChanged");
};

Spry.Data.DataSet.prototype.startLoadInterval = function(interval)
{
	this.stopLoadInterval();
	if (interval > 0)
	{
		var self = this;
		this.loadInterval = interval;
		this.loadIntervalID = setInterval(function() { self.loadData(); }, interval);
	}
};

Spry.Data.DataSet.prototype.stopLoadInterval = function()
{
	if (this.loadIntervalID)
		clearInterval(this.loadIntervalID);
	this.loadInterval = 0;
	this.loadIntervalID = null;
};

Spry.Data.DataSet.nextDataSetID = 0;

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.HTTPSourceDataSet
// base class for any DataSet that uses external
//
//////////////////////////////////////////////////////////////////////

Spry.Data.HTTPSourceDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our DataSet base class so that
	// our base class properties get defined. We'll call setOptions
	// manually after we set up our HTTPSourceDataSet properties.

	Spry.Data.DataSet.call(this);

	// HTTPSourceDataSet Properties:

	this.url = dataSetURL;
	this.dataSetsForDataRefStrings = new Array;
	this.hasDataRefStrings = false;
	this.useCache = true;

	this.setRequestInfo(dataSetOptions, true);

	Spry.Utils.setOptions(this, dataSetOptions, true);

	this.recalculateDataSetDependencies();

	if (this.loadInterval > 0)
		this.startLoadInterval(this.loadInterval);
}; // End of Spry.Data.HTTPSourceDataSet() constructor.

Spry.Data.HTTPSourceDataSet.prototype = new Spry.Data.DataSet();
Spry.Data.HTTPSourceDataSet.prototype.constructor = Spry.Data.HTTPSourceDataSet;

Spry.Data.HTTPSourceDataSet.prototype.setRequestInfo = function(requestInfo, undefineRequestProps)
{
	// Create a loadURL request object to store any load options
	// the caller specified. We'll fill in the URL at the last minute
	// before we make the actual load request because our URL needs
	// to be processed at the last possible minute in case it contains
	// data references.

	this.requestInfo = new Spry.Utils.loadURL.Request();
	this.requestInfo.extractRequestOptions(requestInfo, undefineRequestProps);

	// If the caller wants to use "POST" to fetch the data, but didn't
	// provide the content type, default to x-www-form-urlencoded.

	if (this.requestInfo.method == "POST")
	{
		if (!this.requestInfo.headers)
			this.requestInfo.headers = {};
		if (!this.requestInfo.headers['Content-Type'])
			this.requestInfo.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
	}
};

Spry.Data.HTTPSourceDataSet.prototype.recalculateDataSetDependencies = function()
{
	this.hasDataRefStrings = false;

	// Clear all old callbacks that may have been registered.

	var i = 0;
	for (i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		if (ds)
			ds.removeObserver(this);
	}

	// Now run through the strings that may contain data references and figure
	// out what data sets they require. Note that the data references in these
	// strings must be fully qualified with a data set name. (ex: {dsDataSetName::columnName})

	this.dataSetsForDataRefStrings = new Array();

	var regionStrs = this.getDataRefStrings();

	var dsCount = 0;

	for (var n = 0; n < regionStrs.length; n++)
	{
		var tokens = Spry.Data.Region.getTokensFromStr(regionStrs[n]);

		for (i = 0; tokens && i < tokens.length; i++)
		{
			if (tokens[i].search(/{[^}:]+::[^}]+}/) != -1)
			{
				var dsName = tokens[i].replace(/^\{|::.*\}/g, "");
				var ds = null;
				if (!this.dataSetsForDataRefStrings[dsName])
				{
					ds = Spry.Data.getDataSetByName(dsName);
					if (dsName && ds)
					{
						// The dataSetsForDataRefStrings array serves as both an
						// array of data sets and a hash lookup by name.

						this.dataSetsForDataRefStrings[dsName] = ds;
						this.dataSetsForDataRefStrings[dsCount++] = ds;
						this.hasDataRefStrings = true;
					}
				}
			}
		}
	}

	// Set up observers on any data sets our URL depends on.

	for (i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		ds.addObserver(this);
	}
};

Spry.Data.HTTPSourceDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	if (this.requestInfo && this.requestInfo.postData) strArr.push(this.requestInfo.postData);
	return strArr;
};

Spry.Data.HTTPSourceDataSet.prototype.attemptLoadData = function()
{
	// We only want to trigger a load when all of our data sets have data!
	for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
	{
		var ds = this.dataSetsForDataRefStrings[i];
		if (ds.getLoadDataRequestIsPending() || !ds.getDataWasLoaded())
			return;
	}

	this.loadData();
};

Spry.Data.HTTPSourceDataSet.prototype.onCurrentRowChanged = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.HTTPSourceDataSet.prototype.onPostSort = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.HTTPSourceDataSet.prototype.onDataChanged = function(ds, data)
{
	this.attemptLoadData();
};

Spry.Data.HTTPSourceDataSet.prototype.loadData = function()
{
	if (!this.url)
		return;

	this.cancelLoadData();

	var url = this.url;
	var postData = this.requestInfo.postData;

	if (this.hasDataRefStrings)
	{
		var allDataSetsReady = true;

		for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
		{
			var ds = this.dataSetsForDataRefStrings[i];
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the load of this data set!
				ds.loadData();
				allDataSetsReady = false;
			}
		}

		// If our data sets aren't ready, just return. We'll
		// get called back to load our data when they are all
		// done.

		if (!allDataSetsReady)
			return;

		url = Spry.Data.Region.processDataRefString(null, this.url, this.dataSetsForDataRefStrings);
		if (!url)
			return;

		if (postData && (typeof postData) == "string")
			postData = Spry.Data.Region.processDataRefString(null, postData, this.dataSetsForDataRefStrings);
	}

	this.notifyObservers("onPreLoad");

	this.data = null;
	this.dataWasLoaded = false;
	this.unfilteredData = null;
	this.dataHash = null;
	this.curRowID = 0;

	// At this point the url should've been processed if it contained any
	// data references. Set the url of the requestInfo structure and pass it
	// to LoadManager.loadData().

	var req = this.requestInfo.clone();
	req.url = url;
	req.postData = postData;

	this.pendingRequest = new Object;
	this.pendingRequest.data = Spry.Data.HTTPSourceDataSet.LoadManager.loadData(req, this, this.useCache);
};

Spry.Data.HTTPSourceDataSet.prototype.cancelLoadData = function()
{
	if (this.pendingRequest)
	{
		Spry.Data.HTTPSourceDataSet.LoadManager.cancelLoadData(this.pendingRequest.data, this);
		this.pendingRequest = null;
	}
};

Spry.Data.HTTPSourceDataSet.prototype.getURL = function() { return this.url; };
Spry.Data.HTTPSourceDataSet.prototype.setURL = function(url, requestOptions)
{
	if (this.url == url)
	{
		// The urls match so we may not have to do anything, but
		// before we bail early, check to see if the method and
		// postData that was last used was the same. If there is a
		// difference, we need to process the new URL.

		if (!requestOptions || (this.requestInfo.method == requestOptions.method && (requestOptions.method != "POST" || this.requestInfo.postData == requestOptions.postData)))
			return;
	}

	this.url = url;

	this.setRequestInfo(requestOptions);

	this.cancelLoadData();
	this.recalculateDataSetDependencies();
	this.dataWasLoaded = false;
};

Spry.Data.HTTPSourceDataSet.prototype.setDataFromDoc = function(rawDataDoc)
{
	this.pendingRequest = null;

	this.loadDataIntoDataSet(rawDataDoc);
	this.applyColumnTypes();

	this.disableNotifications();
	this.filterAndSortData();
	this.enableNotifications();

	this.notifyObservers("onPostLoad");
	this.notifyObservers("onDataChanged");
};

Spry.Data.HTTPSourceDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	// this method needs to be overwritten by the descendent classes;
	// internal data structures (data & dataHash) have to load data from the source document (ResponseText | ResponseDoc);

	this.dataHash = new Object;
	this.data = new Array;
	this.dataWasLoaded = true;
};

Spry.Data.HTTPSourceDataSet.prototype.xhRequestProcessor = function(xhRequest)
{
	// This method needs to be overwritten by the descendent classes if other objects (like responseXML)
	// are going to be used as a data source
	// This implementation returns the responseText from xhRequest

	var resp = xhRequest.responseText;

	if (xhRequest.status == 200 || xhRequest.status == 0)
		return resp;
	return null;
};

Spry.Data.HTTPSourceDataSet.prototype.sessionExpiredChecker = function(req)
{
	if (req.xhRequest.responseText == 'session expired')
		return true;
	return false;
};

Spry.Data.HTTPSourceDataSet.prototype.setSessionExpiredChecker = function(checker)
{
	this.sessionExpiredChecker = checker;
};


Spry.Data.HTTPSourceDataSet.prototype.onRequestResponse = function(cachedRequest, req)
{
	this.setDataFromDoc(cachedRequest.rawData);
};

Spry.Data.HTTPSourceDataSet.prototype.onRequestError = function(cachedRequest, req)
{
	this.notifyObservers("onLoadError", req);
	// Spry.Debug.reportError("Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.loadDataCallback(" + req.xhRequest.status + ") failed to load: " + req.url + "\n");
};

Spry.Data.HTTPSourceDataSet.prototype.onRequestSessionExpired = function(cachedRequest, req)
{
	this.notifyObservers("onSessionExpired", req);
	//Spry.Debug.reportError("Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.loadDataCallback(" + req.xhRequest.status + ") failed to load: " + req.url + "\n");
};


Spry.Data.HTTPSourceDataSet.LoadManager = {};
Spry.Data.HTTPSourceDataSet.LoadManager.cache = [];

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest = function(reqInfo, xhRequestProcessor, sessionExpiredChecker)
{
	Spry.Utils.Notifier.call(this);

	this.reqInfo = reqInfo;
	this.rawData = null;
	this.timer = null;
	this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED;
	this.xhRequestProcessor = xhRequestProcessor;
	this.sessionExpiredChecker = sessionExpiredChecker;
};

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype = new Spry.Utils.Notifier();
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.constructor = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest;

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED      = 1;
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED  = 2;
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED     = 3;
Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL = 4;

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.loadDataCallback = function(req)
{
	if (req.xhRequest.readyState != 4)
		return;

	var rawData = null;
	if (this.xhRequestProcessor) rawData = this.xhRequestProcessor(req.xhRequest);

	if (this.sessionExpiredChecker)
	{
		Spry.Utils.setOptions(req, {'rawData': rawData}, false);
		if (this.sessionExpiredChecker(req))
		{
			this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED;
			this.notifyObservers("onRequestSessionExpired", req);
			this.observers.length = 0;
			return;
		}
	}

	if (!rawData)
	{
		this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED;
		this.notifyObservers("onRequestError", req);
		this.observers.length = 0; // Clear the observers list.
		return;
	}

	this.rawData = rawData;
	this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL;

	// Notify all of the cached request's observers!
	this.notifyObservers("onRequestResponse", req);

	// Clear the observers list.
	this.observers.length = 0;
};

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.loadData = function()
{
	// IE will synchronously fire our loadDataCallback() during the call
	// to an async Spry.Utils.loadURL() if the data for the url is already
	// in the browser's local cache. This can wreak havoc with complicated master/detail
	// regions that use data sets that have master/detail relationships with other
	// data sets. Our data set logic already handles async data loading nicely so we
	// use a timer to fire off the async Spry.Utils.loadURL() call to insure that any
	// data loading happens asynchronously after this function is finished.

	var self = this;
	this.cancelLoadData();
	this.rawData = null;
	this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED;

	var reqInfo = this.reqInfo.clone();
	reqInfo.successCallback = function(req) { self.loadDataCallback(req); };
	reqInfo.errorCallback = reqInfo.successCallback;

	this.timer = setTimeout(function()
	{
		self.timer = null;
		Spry.Utils.loadURL(reqInfo.method, reqInfo.url, reqInfo.async, reqInfo.successCallback, reqInfo);
	}, 0);
};

Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.cancelLoadData = function()
{
	if (this.state == Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
	{
		if (this.timer)
		{
			this.timer.clearTimeout();
			this.timer = null;
		}

		this.rawData = null;
		this.state = Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED;
	}
};

Spry.Data.HTTPSourceDataSet.LoadManager.getCacheKey = function(reqInfo)
{
	return reqInfo.method + "::" + reqInfo.url + "::" + reqInfo.postData + "::" + reqInfo.username;
};

Spry.Data.HTTPSourceDataSet.LoadManager.loadData = function(reqInfo, ds, useCache)
{
	if (!reqInfo)
		return null;

	var cacheObj = null;
	var cacheKey = null;

	if (useCache)
	{
		cacheKey = Spry.Data.HTTPSourceDataSet.LoadManager.getCacheKey(reqInfo);
		cacheObj = Spry.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey];
	}

	if (cacheObj)
	{
		if (cacheObj.state == Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
		{
			if (ds)
				cacheObj.addObserver(ds);
			return cacheObj;
		}
		else if (cacheObj.state == Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL)
		{
			// Data is already cached so if we have a data set, trigger an async call
			// that tells it to load its data.
			if (ds)
				setTimeout(function() { ds.setDataFromDoc(cacheObj.rawData); }, 0);
			return cacheObj;
		}
	}

	// We're either loading this url for the first time, or an error occurred when
	// we last tried to load it, or the caller requested a forced load.

	if (!cacheObj)
	{
		cacheObj = new Spry.Data.HTTPSourceDataSet.LoadManager.CachedRequest(reqInfo, (ds ? ds.xhRequestProcessor : null), (ds ? ds.sessionExpiredChecker : null));

		if (useCache)
		{
			Spry.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey] = cacheObj;

			// Add an observer that will remove the cacheObj from the cache
			// if there is a load request failure.
			cacheObj.addObserver({ onRequestError: function() { Spry.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey] = undefined; }});
		}
	}

	if (ds)
		cacheObj.addObserver(ds);

	cacheObj.loadData();

	return cacheObj;
};

Spry.Data.HTTPSourceDataSet.LoadManager.cancelLoadData = function(cacheObj, ds)
{
	if (cacheObj)
	{
		if (ds)
			cacheObj.removeObserver(ds);
		else
			cacheObj.cancelLoadData();
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.XMLDataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.XMLDataSet = function(dataSetURL, dataSetPath, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	this.xpath = dataSetPath;
	this.doc = null;
	this.subPaths = [];
	this.entityEncodeStrings = true;

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	// Callers are allowed to pass either a string, an object or an array of
	// strings and/or objects for the 'subPaths' option, so make sure we normalize
	// the subPaths value to be an array.

	var jwType = typeof this.subPaths;
	if (jwType == "string" || (jwType == "object" && this.subPaths.constructor != Array))
		this.subPaths = [ this.subPaths ];
}; // End of Spry.Data.XMLDataSet() constructor.

Spry.Data.XMLDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.XMLDataSet.prototype.constructor = Spry.Data.XMLDataSet;


Spry.Data.XMLDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	if (this.xpath) strArr.push(this.xpath);
	if (this.requestInfo && this.requestInfo.postData) strArr.push(this.requestInfo.postData);
	return strArr;
};

Spry.Data.XMLDataSet.prototype.getDocument = function() { return this.doc; };
Spry.Data.XMLDataSet.prototype.getXPath = function() { return this.xpath; };
Spry.Data.XMLDataSet.prototype.setXPath = function(path)
{
	if (this.xpath != path)
	{
		this.xpath = path;
		if (this.dataWasLoaded && this.doc)
		{
			this.notifyObservers("onPreLoad");
			this.setDataFromDoc(this.doc);
		}
	}
};

Spry.Data.XMLDataSet.nodeContainsElementNode = function(node)
{
	if (node)
	{
		node = node.firstChild;

		while (node)
		{
			if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
				return true;

			node = node.nextSibling;
		}
	}
	return false;
};

Spry.Data.XMLDataSet.getNodeText = function(node, encodeText, encodeCData)
{
	var txt = "";

	if (!node)
		return;

	try
	{
		var child = node.firstChild;

		while (child)
		{
			try
			{
				if (child.nodeType == 3 /* TEXT_NODE */)
					txt += encodeText ? Spry.Utils.encodeEntities(child.data) : child.data;
				else if (child.nodeType == 4 /* CDATA_SECTION_NODE */)
					txt += encodeCData ? Spry.Utils.encodeEntities(child.data) : child.data;
			} catch (e) { Spry.Debug.reportError("Spry.Data.XMLDataSet.getNodeText() exception caught: " + e + "\n"); }

			child = child.nextSibling;
		}
	}
	catch (e) { Spry.Debug.reportError("Spry.Data.XMLDataSet.getNodeText() exception caught: " + e + "\n"); }

	return txt;
};

Spry.Data.XMLDataSet.createObjectForNode = function(node, encodeText, encodeCData)
{
	if (!node)
		return null;

	var obj = new Object();
	var i = 0;
	var attr = null;

	try
	{
		for (i = 0; i < node.attributes.length; i++)
		{
			attr = node.attributes[i];
			if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
				obj["@" + attr.name] = attr.value;
		}
	}
	catch (e)
	{
		Spry.Debug.reportError("Spry.Data.XMLDataSet.createObjectForNode() caught exception while accessing attributes: " + e + "\n");
	}

	var child = node.firstChild;

	if (child && !child.nextSibling && child.nodeType != 1 /* Node.ELEMENT_NODE */)
	{
		// We have a single child and it's not an element. It must
		// be the text value for this node. Add it to the record set and
		// give it the column the same name as the node.

		obj[node.nodeName] = Spry.Data.XMLDataSet.getNodeText(node, encodeText, encodeCData);
	}

	while (child)
	{
		// Add the text value for each child element. Note that
		// We skip elements that have element children (sub-elements)
		// because we don't handle multi-level data sets right now.

		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			if (!Spry.Data.XMLDataSet.nodeContainsElementNode(child))
			{
				obj[child.nodeName] = Spry.Data.XMLDataSet.getNodeText(child, encodeText, encodeCData);

				// Now add properties for any attributes on the child. The property
				// name will be of the form "<child.nodeName>/@<attr.name>".
				try
				{
					var namePrefix = child.nodeName + "/@";

					for (i = 0; i < child.attributes.length; i++)
					{
						attr = child.attributes[i];
						if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
							obj[namePrefix + attr.name] = attr.value;
					}
				}
				catch (e)
				{
					Spry.Debug.reportError("Spry.Data.XMLDataSet.createObjectForNode() caught exception while accessing attributes: " + e + "\n");
				}
			}
		}

		child = child.nextSibling;
	}

	return obj;
};

Spry.Data.XMLDataSet.getRecordSetFromXMLDoc = function(xmlDoc, path, suppressColumns, entityEncodeStrings)
{
	if (!xmlDoc || !path)
		return null;

	var recordSet = new Object();
	recordSet.xmlDoc = xmlDoc;
	recordSet.xmlPath = path;
	recordSet.dataHash = new Object;
	recordSet.data = new Array;
	recordSet.getData = function() { return this.data; };

	// Use the XPath library to find the nodes that will
	// make up our data set. The result should be an array
	// of subtrees that we need to flatten.

	var ctx = new ExprContext(xmlDoc);
	var pathExpr = xpathParse(path);
	var e = pathExpr.evaluate(ctx);

	// XXX: Note that we should check the result type of the evaluation
	// just in case it's a boolean, string, or number value instead of
	// a node set.

	var nodeArray = e.nodeSetValue();

	var isDOMNodeArray = true;

	if (nodeArray && nodeArray.length > 0)
		isDOMNodeArray = nodeArray[0].nodeType != 2 /* Node.ATTRIBUTE_NODE */;

	var nextID = 0;

	var encodeText = true;
	var encodeCData = false;
	if (typeof entityEncodeStrings == "boolean")
		encodeText = encodeCData = entityEncodeStrings;

	// We now have the set of nodes that make up our data set
	// so process each one.

	for (var i = 0; i < nodeArray.length; i++)
	{
		var rowObj = null;

		if (suppressColumns)
			rowObj = new Object;
		else
		{
			if (isDOMNodeArray)
				rowObj = Spry.Data.XMLDataSet.createObjectForNode(nodeArray[i], encodeText, encodeCData);
			else // Must be a Node.ATTRIBUTE_NODE array.
			{
				rowObj = new Object;
				rowObj["@" + nodeArray[i].name] = nodeArray[i].value;
			}
		}

		if (rowObj)
		{
			// We want to make sure that every row has a unique ID and since we
			// we don't know which column, if any, in this recordSet is a unique
			// identifier, we generate a unique ID ourselves and store it under
			// the ds_RowID column in the row object.

			rowObj['ds_RowID'] = nextID++;
			rowObj['ds_XMLNode'] = nodeArray[i];
			recordSet.dataHash[rowObj['ds_RowID']] = rowObj;
			recordSet.data.push(rowObj);
		}
	}

	return recordSet;
};

Spry.Data.XMLDataSet.PathNode = function(path)
{
	this.path = path;
	this.subPaths = [];
	this.xpath = "";
};

Spry.Data.XMLDataSet.PathNode.prototype.addSubPath = function(path)
{
	var node = this.findSubPath(path);
	if (!node)
	{
		node = new Spry.Data.XMLDataSet.PathNode(path);
		this.subPaths.push(node);
	}
	return node;
};

Spry.Data.XMLDataSet.PathNode.prototype.findSubPath = function(path)
{
	var numSubPaths = this.subPaths.length;
	for (var i = 0; i < numSubPaths; i++)
	{
		var subPath = this.subPaths[i];
		if (path == subPath.path)
			return subPath;
	}
	return null;
};

Spry.Data.XMLDataSet.PathNode.prototype.consolidate = function()
{
	// This method recursively runs through the path tree and
	// tries to flatten any nodes that have no XPath and one child.
	// The flattening involves merging the parent's path component
	// with its child path component.

	var numSubPaths = this.subPaths.length;
	if (!this.xpath && numSubPaths == 1)
	{
		// Consolidate!
		var subPath = this.subPaths[0];
		this.path += ((subPath[0] != "/") ? "/" : "") + subPath.path;
		this.xpath = subPath.xpath;
		this.subPaths = subPath.subPaths;
		this.consolidate();
		return;
	}

	for (var i = 0; i < numSubPaths; i++)
		this.subPaths[i].consolidate();
};

/* This method is commented out so that it gets stripped when the file
   is minimized. Please do not remove this from the full version of the
   file! It is needed for debugging.

Spry.Data.XMLDataSet.PathNode.prototype.dump = function(indentStr)
{
	var didPre = false;
	var result = "";
	if (!indentStr)
	{
		indentStr = "";
		didPre = true;
		result = "<pre>";
	}
	result += indentStr + "<strong>" + this.path + "</strong>" + (this.xpath ? " <em>-- xpath(" + Spry.Utils.encodeEntities(this.xpath) + ")</em>" : "") + "\n";
	var numSubPaths = this.subPaths.length;
	indentStr += "    ";
	for (var i = 0; i < numSubPaths; i++)
		result += this.subPaths[i].dump(indentStr);
	if (didPre)
		result += "</pre>";
	return result;
};
*/

Spry.Data.XMLDataSet.prototype.convertXPathsToPathTree = function(xpathArray)
{
	var xpaLen = xpathArray.length;
	var root = new Spry.Data.XMLDataSet.PathNode("");

	for (var i = 0; i < xpaLen; i++)
	{
		// Convert any "//" in the XPath to our placeholder value.
		// We need to do that so they don't get removed when we split the
		// path into components.

		var xpath = xpathArray[i];
		var cleanXPath = xpath.replace(/\/\//g, "/__SPRYDS__");
		cleanXPath = cleanXPath.replace(/^\//, ""); // Strip any leading slash.
		var pathItems = cleanXPath.split(/\//);
		var pathItemsLen = pathItems.length;

		// Now add each path component to our tree.

		var node = root;
		for (var j = 0; j < pathItemsLen; j++)
		{
			// If this path component has a placeholder in it, convert it
			// back to a double slash.

			var path = pathItems[j].replace(/__SPRYDS__/, "//");
			node = node.addSubPath(path);
		}

		// Now add the full xpath to the node that represents the
		// last path component in our path.

		node.xpath = xpath;
	}

	// Now that we have a tree of nodes. Tell the root to consolidate
	// itself so we get a tree that is as flat as possible. This reduces
	// the number of XPaths we will have to flatten.

	root.consolidate();
	return root;
};

Spry.Data.XMLDataSet.prototype.flattenSubPaths = function(rs, subPaths)
{
	if (!rs || !subPaths)
		return;

	var numSubPaths = subPaths.length;
	if (numSubPaths < 1)
		return;

	var data = rs.data;
	var dataHash = {};

	// Convert all of the templated subPaths to XPaths with real values.
	// We also need a "cleaned" version of the XPath which contains no
	// expressions in it, so that we can pre-pend it to the column names
	// of any nested data we find.

	var xpathArray = [];
	var cleanedXPathArray = [];

	for (var i = 0; i < numSubPaths; i++)
	{
		// The elements of the subPaths array can be XPath strings,
		// or objects that describe a path with nested sub-paths below
		// it, so make sure we properly extract out the XPath to use.

		var subPath = subPaths[i];
		if (typeof subPath == "object")
			subPath = subPath.path;
		if (!subPath)
			subPath = "";

		// Convert any data references in the XPath to real values!

		xpathArray[i] = Spry.Data.Region.processDataRefString(null, subPath, this.dataSetsForDataRefStrings);

		// Create a clean version of the XPath by stripping out any
		// expressions it may contain.

		cleanedXPathArray[i] = xpathArray[i].replace(/\[.*\]/g, "");
	}

	// For each row of the base record set passed in, generate a flattened
	// recordset from each subPath, and then join the results with the base
	// row. The row from the base data set will be duplicated to match the
	// number of rows matched by the subPath. The results are then merged.

	var row;
	var numRows = data.length;
	var newData = [];

	// Iterate over each row of the base record set.

	for (var i = 0; i < numRows; i++)
	{
		row = data[i];
		var newRows = [ row ];

		// Iterate over every subPath passed into this function.

		for (var j = 0; j < numSubPaths; j++)
		{
			// Search for all nodes that match the given XPath underneath
			// the XML node for the base row and flatten the data into
			// a tabular recordset structure.

			var newRS = Spry.Data.XMLDataSet.getRecordSetFromXMLDoc(row.ds_XMLNode, xpathArray[j], (subPaths[j].xpath ? false : true), this.entityEncodeStrings);

			// If this subPath has additional subPaths beneath it,
			// flatten and join them with the recordset we just created.

			if (newRS && newRS.data && newRS.data.length)
			{
				if (typeof subPaths[j] == "object" && subPaths[j].subPaths)
				{
					// The subPaths property can be either an XPath string,
					// an Object describing a subPath and paths beneath it,
					// or an Array of XPath strings or objects. We need to
					// normalize these variations into an array to simplify
					// our processing.

					var sp = subPaths[j].subPaths;
					spType = typeof sp;
					if (spType == "string")
						sp = [ sp ];
					else if (spType == "object" && spType.constructor == Object)
						sp = [ sp ];

					// Now that we have a normalized array of sub paths, flatten
					// them and join them to the recordSet we just calculated.

					this.flattenSubPaths(newRS, sp);
				}

				var newRSData = newRS.data;
				var numRSRows = newRSData.length;

				var cleanedXPath = cleanedXPathArray[j] + "/";

				var numNewRows = newRows.length;
				var joinedRows = [];

				// Iterate over all rows in our newRows array. Note that the
				// contents of newRows changes after the execution of this
				// loop, allowing us to perform more joins when more than
				// one subPath is specified.

				for (var k = 0; k < numNewRows; k++)
				{
					var newRow = newRows[k];

					// Iterate over all rows in the record set generated
					// from the current subPath. We are going to create
					// m*n rows for the joined table, where m is the number
					// of rows in the newRows array, and n is the number of
					// rows in the current subPath recordset.

					for (var l = 0; l < numRSRows; l++)
					{
						// Create a new row that will house the join result.

						var newRowObj = new Object;
						var newRSRow = newRSData[l];

						// Copy the columns from the newRow into our row
						// object.

						for (prop in newRow)
							newRowObj[prop] = newRow[prop];

						// Copy the data from the current row of the record set
						// into our new row object, but make sure to store the
						// data in columns that have the subPath prepended to
						// it so that it doesn't collide with any columns from
						// the newRows row data.

						for (var prop in newRSRow)
						{
							// The new propery name will have the subPath used prepended to it.
							var newPropName = cleanedXPath + prop;

							// We need to handle the case where the tag name of the node matched
							// by the XPath has a value. In that specific case, the name of the
							// property should be the cleanedXPath itself. For example:
							//
							//	<employees>
							//		<employee>Bob</employee>
							//		<employee>Joe</employee>
							//	</employees>
							//
							// XPath: /employees/employee
							//
							// The property name that contains "Bob" and "Joe" will be "employee".
							// So in our new row, we need to call this column "/employees/employee"
							// instead of "/employees/employee/employee" which would be incorrect.

							if (cleanedXPath == (prop + "/") || cleanedXPath.search(new RegExp("\\/" + prop + "\\/$")) != -1)
								newPropName = cleanedXPathArray[j];

							// Copy the props to the new object using the new property name.

							newRowObj[newPropName] = newRSRow[prop];
						}

						// Now add this row to the array that tracks all of the new
						// rows we've just created.

						joinedRows.push(newRowObj);
					}
				}

				// Set the newRows array equal to our joinedRows we just created,
				// so that when we flatten the data for the next subPath, it gets
				// joined with our new set of rows.

				newRows = joinedRows;
			}
		}

		newData = newData.concat(newRows);
	}

	// Now that we have a new set of joined rows, we need to run through
	// all of the rows and make sure they all have a unique row ID and
	// rebuild our dataHash.

	data = newData;
	numRows = data.length;

	for (i = 0; i < numRows; i++)
	{
		row = data[i];
		row.ds_RowID = i;
		dataHash[row.ds_RowID] = row;
	}

	// We're all done, so stuff the new data and dataHash
	// back into the base recordSet.

	rs.data = data;
	rs.dataHash = dataHash;
};

Spry.Data.XMLDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var rs = null;
	var mainXPath = Spry.Data.Region.processDataRefString(null, this.xpath, this.dataSetsForDataRefStrings);
	var subPaths = this.subPaths;
	var suppressColumns = false;

	if (this.subPaths && this.subPaths.length > 0)
	{
		// Some subPaths were specified. Convert any data references in each subPath
		// to real data. While we're at it, convert any subPaths that are relative
		// to our main XPath to absolute paths.

		var processedSubPaths = [];
		var numSubPaths = subPaths.length;
		for (var i = 0; i < numSubPaths; i++)
		{
			var subPathStr = Spry.Data.Region.processDataRefString(null, subPaths[i], this.dataSetsForDataRefStrings);
			if (subPathStr.charAt(0) != '/')
				subPathStr = mainXPath + "/" + subPathStr;
			processedSubPaths.push(subPathStr);
		}

		// We need to add our main XPath to the set of subPaths and generate a path
		// tree so we can find the XPath to the common parent of all the paths, just
		// in case the user specified a path that was outside of our main XPath.

		processedSubPaths.unshift(mainXPath);
		var commonParent = this.convertXPathsToPathTree(processedSubPaths);

		// The root node of the resulting path tree should contain the XPath
		// to the common parent. Make this the XPath we generate our initial
		// set of rows from so we can group the results of flattening the other
		// subPaths in predictable/expected manner.

		mainXPath = commonParent.path;
		subPaths = commonParent.subPaths;

		// If the XPath to the common parent we calculated isn't our main XPath
		// or any of the subPaths specified by the user, it is used purely for
		// grouping and joining the data we will flatten. We don't want to include
		// any of the columns for the rows created for the common parent XPath since
		// the user did not ask for it.

		suppressColumns = commonParent.xpath ? false : true;
	}

	rs = Spry.Data.XMLDataSet.getRecordSetFromXMLDoc(rawDataDoc, mainXPath, suppressColumns, this.entityEncodeStrings);

	if (!rs)
	{
		Spry.Debug.reportError("Spry.Data.XMLDataSet.loadDataIntoDataSet() failed to create dataSet '" + this.name + "'for '" + this.xpath + "' - " + this.url + "\n");
		return;
	}

	// Now that we have our base set of rows, flatten any additional subPaths
	// specified by the user.

	this.flattenSubPaths(rs, subPaths);

	this.doc = rs.xmlDoc;
	this.data = rs.data;
	this.dataHash = rs.dataHash;
	this.dataWasLoaded = (this.doc != null);
};

Spry.Data.XMLDataSet.prototype.xhRequestProcessor = function(xhRequest)
{
	// XMLDataSet uses the responseXML from the xhRequest

	var resp = xhRequest.responseXML;
	var manualParseRequired = false;

	if (xhRequest.status != 200)
	{
		if (xhRequest.status == 0)
		{
			// The page that is attempting to load data was probably loaded with
			// a file:// url. Mozilla based browsers will actually provide the complete DOM
			// tree for the data, but IE provides an empty document node so try to parse
			// the xml text manually to create a dom tree we can use.

			if (xhRequest.responseText && (!resp || !resp.firstChild))
				manualParseRequired = true;
		}
	}
	else if (!resp)
	{
		// The server said it sent us data, but for some reason we don't have
		// an XML DOM document. Some browsers won't auto-create an XML DOM
		// unless the server used a content-type of "text/xml" or "application/xml".
		// Try to manually parse the XML string, just in case the server
		// gave us an unexpected Content-Type.

		manualParseRequired = true;
	}

	if (manualParseRequired)
		resp = Spry.Utils.stringToXMLDoc(xhRequest.responseText);

	if (!resp  || !resp.firstChild || resp.firstChild.nodeName == "parsererror")
		return null;

	return resp;
};

Spry.Data.XMLDataSet.prototype.sessionExpiredChecker = function(req)
{
	if (req.xhRequest.responseText == 'session expired')
		return true;
	else
	{
		if (req.rawData)
		{
			var firstChild = req.rawData.documentElement.firstChild;
			if (firstChild && firstChild.nodeValue == "session expired")
				return true;
		}
	}
	return false;
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.Region
//
//////////////////////////////////////////////////////////////////////

Spry.Data.Region = function(regionNode, name, isDetailRegion, data, dataSets, regionStates, regionStateMap, hasBehaviorAttributes)
{
	this.regionNode = regionNode;
	this.name = name;
	this.isDetailRegion = isDetailRegion;
	this.data = data;
	this.dataSets = dataSets;
	this.hasBehaviorAttributes = hasBehaviorAttributes;
	this.tokens = null;
	this.currentState = null;
	this.states = { ready: true };
	this.stateMap = {};

	Spry.Utils.setOptions(this.states, regionStates);
	Spry.Utils.setOptions(this.stateMap, regionStateMap);

	// Add the region as an observer to the dataSet!
	for (var i = 0; i < this.dataSets.length; i++)
	{
		var ds = this.dataSets[i];

		try
		{
			if (ds)
				ds.addObserver(this);
		}
		catch(e) { Spry.Debug.reportError("Failed to add '" + this.name + "' as a dataSet observer!\n"); }
	}
}; // End of Spry.Data.Region() constructor.

Spry.Data.Region.hiddenRegionClassName = "SpryHiddenRegion";
Spry.Data.Region.evenRowClassName = "even";
Spry.Data.Region.oddRowClassName = "odd";
Spry.Data.Region.notifiers = {};
Spry.Data.Region.evalScripts = true;

Spry.Data.Region.addObserver = function(regionID, observer)
{
	var n = Spry.Data.Region.notifiers[regionID];
	if (!n)
	{
		n = new Spry.Utils.Notifier();
		Spry.Data.Region.notifiers[regionID] = n;
	}
	n.addObserver(observer);
};

Spry.Data.Region.removeObserver = function(regionID, observer)
{
	var n = Spry.Data.Region.notifiers[regionID];
	if (n)
		n.removeObserver(observer);
};

Spry.Data.Region.notifyObservers = function(methodName, region, data)
{
	var n = Spry.Data.Region.notifiers[region.name];
	if (n)
	{
		var dataObj = {};
		if (data && typeof data == "object")
			dataObj = data;
		else
			dataObj.data = data;

		dataObj.region = region;
		dataObj.regionID = region.name;
		dataObj.regionNode = region.regionNode;

		n.notifyObservers(methodName, dataObj);
	}
};

Spry.Data.Region.RS_Error = 0x01;
Spry.Data.Region.RS_LoadingData = 0x02;
Spry.Data.Region.RS_PreUpdate = 0x04;
Spry.Data.Region.RS_PostUpdate = 0x08;

Spry.Data.Region.prototype.getState = function()
{
	return this.currentState;
};

Spry.Data.Region.prototype.mapState = function(stateName, newStateName)
{
	this.stateMap[stateName] = newStateName;
};

Spry.Data.Region.prototype.getMappedState = function(stateName)
{
	var mappedState = this.stateMap[stateName];
	return mappedState ? mappedState : stateName;
};

Spry.Data.Region.prototype.setState = function(stateName, suppressNotfications)
{
	var stateObj = { state: stateName, mappedState: this.getMappedState(stateName) };
	if (!suppressNotfications)
		Spry.Data.Region.notifyObservers("onPreStateChange", this, stateObj);

	this.currentState = stateObj.mappedState ? stateObj.mappedState : stateName;

	// If the region has content that is specific to this
	// state, regenerate the region so that its markup is updated.

	if (this.states[stateName])
	{
		var notificationData = { state: this.currentState };
		if (!suppressNotfications)
			Spry.Data.Region.notifyObservers("onPreUpdate", this, notificationData);

		// Make the region transform the xml data. The result is
		// a string that we need to parse and insert into the document.

		var str = this.transform();

		// Clear out any previous transformed content.
		// this.clearContent();

		if (Spry.Data.Region.debug)
			Spry.Debug.trace("<hr />Generated region markup for '" + this.name + "':<br /><br />" + Spry.Utils.encodeEntities(str));

		// Now insert the new transformed content into the document.
		Spry.Utils.setInnerHTML(this.regionNode, str, !Spry.Data.Region.evalScripts);

		// Now run through the content looking for attributes
		// that tell us what behaviors to attach to each element.
		if (this.hasBehaviorAttributes)
			this.attachBehaviors();

		if (!suppressNotfications)
			Spry.Data.Region.notifyObservers("onPostUpdate", this, notificationData);
	}

	if (!suppressNotfications)
		Spry.Data.Region.notifyObservers("onPostStateChange", this, stateObj);
};

Spry.Data.Region.prototype.getDataSets = function()
{
	return this.dataSets;
};

Spry.Data.Region.prototype.addDataSet = function(aDataSet)
{
	if (!aDataSet)
		return;

	if (!this.dataSets)
		this.dataSets = new Array;

	// Check to see if the data set is already in our list.

	for (var i = 0; i < this.dataSets.length; i++)
	{
		if (this.dataSets[i] == aDataSet)
			return; // It's already in our list!
	}

	this.dataSets.push(aDataSet);
	aDataSet.addObserver(this);
};

Spry.Data.Region.prototype.removeDataSet = function(aDataSet)
{
	if (!aDataSet || this.dataSets)
		return;

	for (var i = 0; i < this.dataSets.length; i++)
	{
		if (this.dataSets[i] == aDataSet)
		{
			this.dataSets.splice(i, 1);
			aDataSet.removeObserver(this);
			return;
		}
	}
};

Spry.Data.Region.prototype.onPreLoad = function(dataSet)
{
	if (this.currentState != "loading")
		this.setState("loading");
};

Spry.Data.Region.prototype.onLoadError = function(dataSet)
{
	if (this.currentState != "error")
		this.setState("error");
	Spry.Data.Region.notifyObservers("onError", this);
};

Spry.Data.Region.prototype.onSessionExpired = function(dataSet)
{
	if (this.currentState != "expired")
		this.setState("expired");
	Spry.Data.Region.notifyObservers("onExpired", this);
};

Spry.Data.Region.prototype.onCurrentRowChanged = function(dataSet, data)
{
	if (this.isDetailRegion)
		this.updateContent();
};

Spry.Data.Region.prototype.onPostSort = function(dataSet, data)
{
	this.updateContent();
};

Spry.Data.Region.prototype.onDataChanged = function(dataSet, data)
{
	this.updateContent();
};

Spry.Data.Region.enableBehaviorAttributes = true;
Spry.Data.Region.behaviorAttrs = {};

Spry.Data.Region.behaviorAttrs["spry:select"] =
{
	attach: function(rgn, node, value)
	{
		var selectGroupName = null;
		try { selectGroupName = node.attributes.getNamedItem("spry:selectgroup").value; } catch (e) {}
		if (!selectGroupName)
			selectGroupName = "default";

		Spry.Utils.addEventListener(node, "click", function(event) { Spry.Utils.SelectionManager.select(selectGroupName, node, value); }, false);

		if (node.attributes.getNamedItem("spry:selected"))
			Spry.Utils.SelectionManager.select(selectGroupName, node, value);
	}
};

Spry.Data.Region.behaviorAttrs["spry:hover"] =
{
	attach: function(rgn, node, value)
	{
		Spry.Utils.addEventListener(node, "mouseover", function(event){ Spry.Utils.addClassName(node, value); }, false);
		Spry.Utils.addEventListener(node, "mouseout", function(event){ Spry.Utils.removeClassName(node, value); }, false);
	}
};

Spry.Data.Region.setUpRowNumberForEvenOddAttr = function(node, attr, value, rowNumAttrName)
{
	// The format for the spry:even and spry:odd attributes are as follows:
	//
	// <div spry:even="dataSetName cssEvenClassName" spry:odd="dataSetName cssOddClassName">
	//
	// The dataSetName is optional, and if not specified, the first data set
	// listed for the region is used.
	//
	// cssEvenClassName and cssOddClassName are required and *must* be specified. They can be
	// any user defined CSS class name.

	if (!value)
	{
		Spry.Debug.showError("The " + attr + " attribute requires a CSS class name as its value!");
		node.attributes.removeNamedItem(attr);
		return;
	}

	var dsName = "";
	var valArr = value.split(/\s/);
	if (valArr.length > 1)
	{
		// Extract out the data set name and reset the attribute so
		// that it only contains the CSS class name to use.

		dsName = valArr[0];
		node.setAttribute(attr, valArr[1]);
	}

	// Tag the node with an attribute that will allow us to fetch the row
	// number used when it is written out during the re-generation process.

	node.setAttribute(rowNumAttrName, "{" + (dsName ? (dsName + "::") : "") + "ds_RowNumber}");
};

Spry.Data.Region.behaviorAttrs["spry:even"] =
{
	setup: function(node, value)
	{
		Spry.Data.Region.setUpRowNumberForEvenOddAttr(node, "spry:even", value, "spryevenrownumber");
	},

	attach: function(rgn, node, value)
	{
		if (value)
		{
			rowNumAttr = node.attributes.getNamedItem("spryevenrownumber");
			if (rowNumAttr && rowNumAttr.value)
			{
				var rowNum = parseInt(rowNumAttr.value);
				if (rowNum % 2)
					Spry.Utils.addClassName(node, value);
			}
		}
		node.removeAttribute("spry:even");
		node.removeAttribute("spryevenrownumber");
	}
};

Spry.Data.Region.behaviorAttrs["spry:odd"] =
{
	setup: function(node, value)
	{
		Spry.Data.Region.setUpRowNumberForEvenOddAttr(node, "spry:odd", value, "spryoddrownumber");
	},

	attach: function(rgn, node, value)
	{
		if (value)
		{
			rowNumAttr = node.attributes.getNamedItem("spryoddrownumber");
			if (rowNumAttr && rowNumAttr.value)
			{
				var rowNum = parseInt(rowNumAttr.value);
				if (rowNum % 2 == 0)
					Spry.Utils.addClassName(node, value);
			}
		}
		node.removeAttribute("spry:odd");
		node.removeAttribute("spryoddrownumber");
	}
};

Spry.Data.Region.setRowAttrClickHandler = function(node, dsName, rowAttr, funcName)
{
		if (dsName)
		{
			var ds = Spry.Data.getDataSetByName(dsName);
			if (ds)
			{
				rowIDAttr = node.attributes.getNamedItem(rowAttr);
				if (rowIDAttr)
				{
					var rowAttrVal = rowIDAttr.value;
					if (rowAttrVal)
						Spry.Utils.addEventListener(node, "click", function(event){ ds[funcName](rowAttrVal); }, false);
				}
			}
		}
};

Spry.Data.Region.behaviorAttrs["spry:setrow"] =
{
	setup: function(node, value)
	{
		if (!value)
		{
			Spry.Debug.reportError("The spry:setrow attribute requires a data set name as its value!");
			node.removeAttribute("spry:setrow");
			return;
		}

		// Tag the node with an attribute that will allow us to fetch the id of the
		// row used when it is written out during the re-generation process.

		node.setAttribute("spryrowid", "{" + value + "::ds_RowID}");
	},

	attach: function(rgn, node, value)
	{
		Spry.Data.Region.setRowAttrClickHandler(node, value, "spryrowid", "setCurrentRow");
		node.removeAttribute("spry:setrow");
		node.removeAttribute("spryrowid");
	}
};

Spry.Data.Region.behaviorAttrs["spry:setrownumber"] =
{
	setup: function(node, value)
	{
		if (!value)
		{
			Spry.Debug.reportError("The spry:setrownumber attribute requires a data set name as its value!");
			node.removeAttribute("spry:setrownumber");
			return;
		}

		// Tag the node with an attribute that will allow us to fetch the row number
		// of the row used when it is written out during the re-generation process.

		node.setAttribute("spryrownumber", "{" + value + "::ds_RowID}");
	},

	attach: function(rgn, node, value)
	{
		Spry.Data.Region.setRowAttrClickHandler(node, value, "spryrownumber", "setCurrentRowNumber");
		node.removeAttribute("spry:setrownumber");
		node.removeAttribute("spryrownumber");
	}
};

Spry.Data.Region.behaviorAttrs["spry:sort"] =
{
	attach: function(rgn, node, value)
	{
		if (!value)
			return;

		// The format of a spry:sort attribute is as follows:
		//
		// <div spry:sort="dataSetName column1Name column2Name ... sortOrderName">
		//
		// The dataSetName and sortOrderName are optional, but when specified, they
		// must appear in the order mentioned above. If the dataSetName is not specified,
		// the first data set listed for the region is used. If the sortOrderName is not
		// specified, the sort defaults to "toggle".
		//
		// The user *must* specify at least one column name.

		var ds = rgn.getDataSets()[0];
		var sortOrder = "toggle";

		var colArray = value.split(/\s/);
		if (colArray.length > 1)
		{
			// Check the first string in the attribute to see if a data set was
			// specified. If so, make sure we use it for the sort.

			var specifiedDS = Spry.Data.getDataSetByName(colArray[0]);
			if (specifiedDS)
			{
				ds = specifiedDS;
				colArray.shift();
			}

			// Check to see if the last string in the attribute is the name of
			// a sort order. If so, use that sort order during the sort.

			if (colArray.length > 1)
			{
				var str = colArray[colArray.length - 1];
				if (str == "ascending" || str == "descending" || str == "toggle")
				{
					sortOrder = str;
					colArray.pop();
				}
			}
		}

		// If we have a data set and some column names, add a non-destructive
		// onclick handler that will perform a toggle sort on the data set.

		if (ds && colArray.length > 0)
			Spry.Utils.addEventListener(node, "click", function(event){ ds.sort(colArray, sortOrder); }, false);

		node.removeAttribute("spry:sort");
	}
};

Spry.Data.Region.prototype.attachBehaviors = function()
{
	var rgn = this;
	Spry.Utils.getNodesByFunc(this.regionNode, function(node)
	{
		if (!node || node.nodeType != 1 /* Node.ELEMENT_NODE */)
			return false;
		try
		{
			var bAttrs = Spry.Data.Region.behaviorAttrs;
			for (var bAttrName in bAttrs)
			{
				var attr = node.attributes.getNamedItem(bAttrName);
				if (attr)
				{
					var behavior = bAttrs[bAttrName];
					if (behavior && behavior.attach)
						behavior.attach(rgn, node, attr.value);
				}
			}
		} catch(e) {}

		return false;
	});
};

Spry.Data.Region.prototype.updateContent = function()
{
	var allDataSetsReady = true;

	var dsArray = this.getDataSets();

	if (!dsArray || dsArray.length < 1)
	{
		Spry.Debug.reportError("updateContent(): Region '" + this.name + "' has no data set!\n");
		return;
	}

	for (var i = 0; i < dsArray.length; i++)
	{
		var ds = dsArray[i];

		if (ds)
		{
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the loading of the data if it hasn't happened yet.
				ds.loadData();
				allDataSetsReady = false;
			}
		}
	}

	if (!allDataSetsReady)
	{
		Spry.Data.Region.notifyObservers("onLoadingData", this);

		// Just return, this method will get called again automatically
		// as each data set load completes!
		return;
	}

	this.setState("ready");
};

Spry.Data.Region.prototype.clearContent = function()
{
	this.regionNode.innerHTML = "";
};

Spry.Data.Region.processContentPI = function(inStr)
{
	var outStr = "";
	var regexp = /<!--\s*<\/?spry:content\s*[^>]*>\s*-->/mg;
	var searchStartIndex = 0;
	var processingContentTag = 0;

	while (inStr.length)
	{
		var results = regexp.exec(inStr);
		if (!results || !results[0])
		{
			outStr += inStr.substr(searchStartIndex, inStr.length - searchStartIndex);
			break;
		}

		if (!processingContentTag && results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the inStr.
			// Create a string token for everything that precedes the match.
			outStr += inStr.substr(searchStartIndex, results.index - searchStartIndex);
		}

		if (results[0].search(/<\//) != -1)
		{
			--processingContentTag;
			if (processingContentTag)
				Spry.Debug.reportError("Nested spry:content regions are not allowed!\n");
		}
		else
		{
			++processingContentTag;
			var dataRefStr = results[0].replace(/.*\bdataref="/, "");
			outStr += dataRefStr.replace(/".*$/, "");
		}

		searchStartIndex = regexp.lastIndex;
	}

	return outStr;
};

Spry.Data.Region.prototype.tokenizeData = function(dataStr)
{
	// If there is no data, there's nothing to do.
	if (!dataStr)
		return null;

	var rootToken = new Spry.Data.Region.Token(Spry.Data.Region.Token.LIST_TOKEN, null, null, null);
	var tokenStack = new Array;
	var parseStr = Spry.Data.Region.processContentPI(dataStr);

	tokenStack.push(rootToken);

	// Create a regular expression that will match one of the following:
	//
	//   <spry:repeat select="regionName" test="true">
	//   </spry:repeat>
	//   {valueReference}
	var regexp = /((<!--\s*){0,1}<\/{0,1}spry:[^>]+>(\s*-->){0,1})|((\{|%7[bB])[^\}\s%]+(\}|%7[dD]))/mg;
	var searchStartIndex = 0;

	while(parseStr.length)
	{
		var results = regexp.exec(parseStr);
		var token = null;

		if (!results || !results[0])
		{
			// If we get here, the rest of the parseStr should be
			// just a plain string. Create a token for it and then
			// break out of the list.
			var str = parseStr.substr(searchStartIndex, parseStr.length - searchStartIndex);
			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.STRING_TOKEN, null, str, str);
			tokenStack[tokenStack.length - 1].addChild(token);
			break;
		}

		if (results.index != searchStartIndex)
		{
			// We found a match but it's not at the start of the parseStr.
			// Create a string token for everything that precedes the match.
			var str = parseStr.substr(searchStartIndex, results.index - searchStartIndex);
			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.STRING_TOKEN, null, str, str);
			tokenStack[tokenStack.length - 1].addChild(token);
		}

		// We found a string that needs to be turned into a token. Create a token
		// for it and then update parseStr for the next iteration.
		if (results[0].search(/^({|%7[bB])/) != -1 /* results[0].charAt(0) == '{' */)
		{
			var valueName = results[0];
			var regionStr = results[0];

			// Strip off brace and url encode brace chars inside the valueName.

			valueName = valueName.replace(/^({|%7[bB])/, "");
			valueName = valueName.replace(/(}|%7[dD])$/, "");

			// Check to see if our value begins with the name of a data set.
			// For example: {dataSet:tokenValue}. If it is, we need to save
			// the data set name so we know which data set to use to get the
			// value for the token during the region transform.

			var dataSetName = null;
			var splitArray = valueName.split(/::/);

			if (splitArray.length > 1)
			{
				dataSetName = splitArray[0];
				valueName = splitArray[1];
			}

			// Convert any url encoded braces to regular brace chars.

			regionStr = regionStr.replace(/^%7[bB]/, "{");
			regionStr = regionStr.replace(/%7[dD]$/, "}");

			// Now create a token for the placeholder.

			token = new Spry.Data.Region.Token(Spry.Data.Region.Token.VALUE_TOKEN, dataSetName, valueName, new String(regionStr));
			tokenStack[tokenStack.length - 1].addChild(token);
		}
		else if (results[0].charAt(0) == '<')
		{
			// Extract out the name of the processing instruction.
			var piName = results[0].replace(/^(<!--\s*){0,1}<\/?/, "");
			piName = piName.replace(/>(\s*-->){0,1}|\s.*$/, "");

			if (results[0].search(/<\//) != -1 /* results[0].charAt(1) == '/' */)
			{
				// We found a processing instruction close tag. Pop the top of the
				// token stack!
				//
				// XXX: We need to make sure that the close tag name matches the one
				//      on the top of the token stack!
				if (tokenStack[tokenStack.length - 1].tokenType != Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
				{
					Spry.Debug.reportError("Invalid processing instruction close tag: " + piName + " -- " + results[0] + "\n");
					return null;
				}

				tokenStack.pop();
			}
			else
			{
				// Create the processing instruction token, add it as a child of the token
				// at the top of the token stack, and then push it on the stack so that it
				// becomes the parent of any tokens between it and its close tag.

				var piDesc = Spry.Data.Region.PI.instructions[piName];

				if (piDesc)
				{
					var dataSet = null;

					var selectedDataSetName = "";
					if (results[0].search(/^.*\bselect=\"/) != -1)
					{
						selectedDataSetName = results[0].replace(/^.*\bselect=\"/, "");
						selectedDataSetName = selectedDataSetName.replace(/".*$/, "");

						if (selectedDataSetName)
						{
							dataSet = Spry.Data.getDataSetByName(selectedDataSetName);
							if (!dataSet)
							{
								Spry.Debug.reportError("Failed to retrieve data set (" + selectedDataSetName + ") for " + piName + "\n");
								selectedDataSetName = "";
							}
						}
					}

					// Check if the repeat has a test attribute.
					var jsExpr = null;
					if (results[0].search(/^.*\btest=\"/) != -1)
					{
						jsExpr = results[0].replace(/^.*\btest=\"/, "");
						jsExpr = jsExpr.replace(/".*$/, "");
						jsExpr = Spry.Utils.decodeEntities(jsExpr);
					}

					// Check if the instruction has a state name specified.
					var regionState = null;
					if (results[0].search(/^.*\bname=\"/) != -1)
					{
						regionState = results[0].replace(/^.*\bname=\"/, "");
						regionState = regionState.replace(/".*$/, "");
						regionState = Spry.Utils.decodeEntities(regionState);
					}

					var piData = new Spry.Data.Region.Token.PIData(piName, selectedDataSetName, jsExpr, regionState);

					token = new Spry.Data.Region.Token(Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN, dataSet, piData, new String(results[0]));

					tokenStack[tokenStack.length - 1].addChild(token);
					tokenStack.push(token);
				}
				else
				{
					Spry.Debug.reportError("Unsupported region processing instruction: " + results[0] + "\n");
					return null;
				}
			}
		}
		else
		{
			Spry.Debug.reportError("Invalid region token: " + results[0] + "\n");
			return null;
		}

		searchStartIndex = regexp.lastIndex;
	}

	return rootToken;
};

Spry.Data.Region.prototype.callScriptFunction = function(funcName, processContext)
{
	var result = undefined;

	funcName = funcName.replace(/^\s*\{?\s*function::\s*|\s*\}?\s*$/g, "");
	var func = Spry.Utils.getObjectByName(funcName);
	if (func)
		result = func(this.name, function() { return processContext.getValueFromDataSet.apply(processContext, arguments); });

	return result;
};

Spry.Data.Region.prototype.evaluateExpression = function(exprStr, processContext)
{
	var result = undefined;

	try
	{
		if (exprStr.search(/^\s*function::/) != -1)
			result = this.callScriptFunction(exprStr, processContext);
		else
			result = Spry.Utils.eval(Spry.Data.Region.processDataRefString(processContext, exprStr, null, true));
	}
	catch(e)
	{
		Spry.Debug.trace("Caught exception in Spry.Data.Region.prototype.evaluateExpression() while evaluating: " + Spry.Utils.encodeEntities(exprStr) + "\n    Exception:" + e + "\n");
	}

	return result;
};

Spry.Data.Region.prototype.processTokenChildren = function(outputArr, token, processContext)
{
	var children = token.children;
	var len = children.length;

	for (var i = 0; i < len; i++)
		this.processTokens(outputArr, children[i], processContext);
};

Spry.Data.Region.prototype.processTokens = function(outputArr, token, processContext)
{
	var i = 0;

	switch(token.tokenType)
	{
		case Spry.Data.Region.Token.LIST_TOKEN:
			this.processTokenChildren(outputArr, token, processContext);
			break;
		case Spry.Data.Region.Token.STRING_TOKEN:
			outputArr.push(token.data);
			break;
		case Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN:
			if (token.data.name == "spry:repeat")
			{
				var dataSet = null;

				if (token.dataSet)
					dataSet = token.dataSet;
				else
					dataSet = this.dataSets[0];

				if (dataSet)
				{
					var dsContext = processContext.getDataSetContext(dataSet);
					if (!dsContext)
					{
						Spry.Debug.reportError("processTokens() failed to get a data set context!\n");
						break;
					}

					dsContext.pushState();

					var dataSetRows = dsContext.getData();
					var numRows = dataSetRows.length;
					for (i = 0; i < numRows; i++)
					{
						dsContext.setRowIndex(i);
						var testVal = true;

						if (token.data.jsExpr)
							testVal = this.evaluateExpression(token.data.jsExpr, processContext);

						if (testVal)
							this.processTokenChildren(outputArr, token, processContext);
					}
					dsContext.popState();
				}
			}
			else if (token.data.name == "spry:if")
			{
				var testVal = true;

				if (token.data.jsExpr)
					testVal = this.evaluateExpression(token.data.jsExpr, processContext);

				if (testVal)
					this.processTokenChildren(outputArr, token, processContext);
			}
			else if (token.data.name == "spry:choose")
			{
				var defaultChild = null;
				var childToProcess = null;
				var testVal = false;
				var j = 0;

				// All of the children of the spry:choose token should be of the type spry:when or spry:default.
				// Run through all of the spry:when children and see if any of their test expressions return true.
				// If one does, then process its children tokens. If none of the test expressions return true,
				// process the spry:default token's children, if it exists.

				for (j = 0; j < token.children.length; j++)
				{
					var child = token.children[j];
					if (child.tokenType == Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
					{
						if (child.data.name == "spry:when")
						{
							if (child.data.jsExpr)
							{
								testVal = this.evaluateExpression(child.data.jsExpr, processContext);

								if (testVal)
								{
									childToProcess = child;
									break;
								}
							}
						}
						else if (child.data.name == "spry:default")
							defaultChild = child;
					}
				}

				// If we didn't find a match, use the token for the default case.

				if (!childToProcess && defaultChild)
					childToProcess = defaultChild;

				if (childToProcess)
					this.processTokenChildren(outputArr, childToProcess, processContext);
			}
			else if (token.data.name == "spry:state")
			{
				var testVal = true;

				if (!token.data.regionState || token.data.regionState == this.currentState)
					this.processTokenChildren(outputArr, token, processContext);
			}
			else
			{
				Spry.Debug.reportError("processTokens(): Unknown processing instruction: " + token.data.name + "\n");
				return "";
			}
			break;
		case Spry.Data.Region.Token.VALUE_TOKEN:

			var dataSet = token.dataSet;
			var val = undefined;

			if (dataSet && dataSet == "function")
			{
				// This value token doesn't contain a data set data reference, it
				// contains a function call, so call it.

				val = this.callScriptFunction(token.data, processContext);
			}
			else
			{
				if (!dataSet && this.dataSets && this.dataSets.length > 0 && this.dataSets[0])
				{
					// No dataSet was specified by the token, so use whatever the first
					// data set specified in the region.
	
					dataSet = this.dataSets[0];
				}
				if (!dataSet)
				{
					Spry.Debug.reportError("processTokens(): Value reference has no data set specified: " + token.regionStr + "\n");
					return "";
				}
	
				val = processContext.getValueFromDataSet(dataSet, token.data);
			}

			if (typeof val != "undefined")
				outputArr.push(val + "");

			break;
		default:
			Spry.Debug.reportError("processTokens(): Invalid token type: " + token.regionStr + "\n");
			break;
	}
};

Spry.Data.Region.prototype.transform = function()
{
	if (this.data && !this.tokens)
		this.tokens = this.tokenizeData(this.data);

	if (!this.tokens)
		return "";

	processContext = new Spry.Data.Region.ProcessingContext(this);
	if (!processContext)
		return "";

	// Now call processTokens to transform our tokens into real data strings.
	// We use an array to gather the strings during processing as a performance
	// enhancement for IE to avoid n-square problems of adding to an existing
	// string. For example:
	//
	//     for (var i = 0; i < token.children.length; i++)
	//       outputStr += this.processTokens(token.children[i], processContext);
	//
	// Using an array with a final join reduced one of our test cases  from over
	// a minute to about 15 seconds.

	var outputArr = [ "" ];
	this.processTokens(outputArr, this.tokens, processContext);
	return outputArr.join("");
};

Spry.Data.Region.PI = {};
Spry.Data.Region.PI.instructions = {};

Spry.Data.Region.PI.buildOpenTagForValueAttr = function(ele, piName, attrName)
{
	if (!ele || !piName)
		return "";

	var jsExpr = "";

	try
	{
		var testAttr = ele.attributes.getNamedItem(piName);
		if (testAttr && testAttr.value)
			jsExpr = Spry.Utils.encodeEntities(testAttr.value);
	}
	catch (e) { jsExpr = ""; }

	if (!jsExpr)
	{
		Spry.Debug.reportError(piName + " attribute requires a JavaScript expression that returns true or false!\n");
		return "";
	}

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " " + attrName +"=\"" + jsExpr + "\">";
};

Spry.Data.Region.PI.buildOpenTagForTest = function(ele, piName)
{
	return Spry.Data.Region.PI.buildOpenTagForValueAttr(ele, piName, "test");
};

Spry.Data.Region.PI.buildOpenTagForState = function(ele, piName)
{
	return Spry.Data.Region.PI.buildOpenTagForValueAttr(ele, piName, "name");
};

Spry.Data.Region.PI.buildOpenTagForRepeat = function(ele, piName)
{
	if (!ele || !piName)
		return "";

	var selectAttrStr = "";

	try
	{
		var selectAttr = ele.attributes.getNamedItem(piName);
		if (selectAttr && selectAttr.value)
		{
			selectAttrStr = selectAttr.value;
			selectAttrStr = selectAttrStr.replace(/\s/g, "");
		}
	}
	catch (e) { selectAttrStr = ""; }

	if (!selectAttrStr)
	{
		Spry.Debug.reportError(piName + " attribute requires a data set name!\n");
		return "";
	}

	var testAttrStr = "";

	try
	{
		var testAttr = ele.attributes.getNamedItem("spry:test");
		if (testAttr)
		{
			if (testAttr.value)
				testAttrStr = " test=\"" + Spry.Utils.encodeEntities(testAttr.value) + "\"";
			ele.attributes.removeNamedItem(testAttr.nodeName);
		}
	}
	catch (e) { testAttrStr = ""; }

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " select=\"" + selectAttrStr + "\"" + testAttrStr + ">";
};

Spry.Data.Region.PI.buildOpenTagForContent = function(ele, piName)
{
	if (!ele || !piName)
		return "";

	var dataRefStr = "";

	try
	{
		var contentAttr = ele.attributes.getNamedItem(piName);
		if (contentAttr && contentAttr.value)
			dataRefStr = Spry.Utils.encodeEntities(contentAttr.value);
	}
	catch (e) { dataRefStr = ""; }

	if (!dataRefStr)
	{
		Spry.Debug.reportError(piName + " attribute requires a data reference!\n");
		return "";
	}

	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + " dataref=\"" + dataRefStr + "\">";
};

Spry.Data.Region.PI.buildOpenTag = function(ele, piName)
{
	return "<" + Spry.Data.Region.PI.instructions[piName].tagName + ">";
};

Spry.Data.Region.PI.buildCloseTag = function(ele, piName)
{
	return "</" + Spry.Data.Region.PI.instructions[piName].tagName + ">";
};

Spry.Data.Region.PI.instructions["spry:state"] = { tagName: "spry:state", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForState, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:if"] = { tagName: "spry:if", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForTest, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:repeat"] = { tagName: "spry:repeat", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForRepeat, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:repeatchildren"] = { tagName: "spry:repeat", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTagForRepeat, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:choose"] = { tagName: "spry:choose", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTag, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:when"] = { tagName: "spry:when", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTagForTest, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:default"] = { tagName: "spry:default", childrenOnly: false, getOpenTag: Spry.Data.Region.PI.buildOpenTag, getCloseTag: Spry.Data.Region.PI.buildCloseTag };
Spry.Data.Region.PI.instructions["spry:content"] = { tagName: "spry:content", childrenOnly: true, getOpenTag: Spry.Data.Region.PI.buildOpenTagForContent, getCloseTag: Spry.Data.Region.PI.buildCloseTag };

Spry.Data.Region.PI.orderedInstructions = [ "spry:state", "spry:if", "spry:repeat", "spry:repeatchildren", "spry:choose", "spry:when", "spry:default", "spry:content" ];

Spry.Data.Region.getTokensFromStr = function(str)
{
	// XXX: This will need to be modified if we support
	// tokens that use javascript between the braces!
	if (!str)
		return null;
	return str.match(/{[^}]+}/g);
};

Spry.Data.Region.processDataRefString = function(processingContext, regionStr, dataSetsToUse, isJSExpr)
{
	if (!regionStr)
		return "";

	if (!processingContext && !dataSetsToUse)
		return regionStr;

	var resultStr = "";
	var re = new RegExp("\\{([^\\}:]+::)?[^\\}]+\\}", "g");
	var startSearchIndex = 0;

	while (startSearchIndex < regionStr.length)
	{
		var reArray = re.exec(regionStr);
		if (!reArray || !reArray[0])
		{
			resultStr += regionStr.substr(startSearchIndex, regionStr.length - startSearchIndex);
			return resultStr;
		}

		if (reArray.index != startSearchIndex)
			resultStr += regionStr.substr(startSearchIndex, reArray.index - startSearchIndex);

		var dsName = "";
		if (reArray[0].search(/^\{[^}:]+::/) != -1)
			dsName = reArray[0].replace(/^\{|::.*/g, "");

		var fieldName = reArray[0].replace(/^\{|.*::|\}/g, "");
		var row = null;

		var val = "";

		if (processingContext)
			val = processingContext.getValueFromDataSet(dsName, fieldName);
		else
		{
			var ds = dsName ? dataSetsToUse[dsName] : dataSetsToUse[0];
			if (ds)
				val = ds.getValue(fieldName);
		}

		if (typeof val != "undefined")
		{
			val += ""; // Make sure val is converted to a string.
			resultStr += isJSExpr ? Spry.Utils.escapeQuotesAndLineBreaks(val) : val;
		}

		if (startSearchIndex == re.lastIndex)
		{
			// On IE if there was a match near the end of the string, it sometimes
			// leaves re.lastIndex pointing to the value it had before the last time
			// we called re.exec. We check for this case to prevent an infinite loop!
			// We need to write out any text in regionStr that comes after the last
			// match.

			var leftOverIndex = reArray.index + reArray[0].length;
			if (leftOverIndex < regionStr.length)
				resultStr += regionStr.substr(leftOverIndex);

			break;
		}

		startSearchIndex = re.lastIndex;
	}

	return resultStr;
};

Spry.Data.Region.strToDataSetsArray = function(str, returnRegionNames)
{
	var dataSetsArr = new Array;
	var foundHash = {};

	if (!str)
		return dataSetsArr;

	str = str.replace(/\s+/g, " ");
	str = str.replace(/^\s|\s$/g, "");
	var arr = str.split(/ /);


	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i] && !Spry.Data.Region.PI.instructions[arr[i]])
		{
			try {
				var dataSet = Spry.Data.getDataSetByName(arr[i]);

				if (!foundHash[arr[i]])
				{
					if (returnRegionNames)
						dataSetsArr.push(arr[i]);
					else
						dataSetsArr.push(dataSet);
					foundHash[arr[i]] = true;
				}
			}
			catch (e) { /* Spry.Debug.trace("Caught exception: " + e + "\n"); */ }
		}
	}

	return dataSetsArr;
};

Spry.Data.Region.DSContext = function(dataSet, processingContext)
{
	var m_dataSet = dataSet;
	var m_processingContext = processingContext;
	var m_curRowIndexArray = [ { rowIndex: -1 } ]; // -1 means return whatever the current row is inside the data set.
	var m_parent = null;
	var m_children = [];

	// Private Methods:

	var getInternalRowIndex = function() { return m_curRowIndexArray[m_curRowIndexArray.length - 1].rowIndex; };

	// Public Methods:
	this.resetAll = function() { m_curRowIndexArray = [ { rowIndex: m_dataSet.getCurrentRow() } ] };
	this.getDataSet = function() { return m_dataSet; };
	this.getNumRows = function(unfiltered)
	{
		var data = this.getCurrentState().data;
		return data ? data.length : m_dataSet.getRowCount(unfiltered);
	};
	this.getData = function()
	{
		var data = this.getCurrentState().data;
		return data ? data : m_dataSet.getData();
	};
	this.setData = function(data)
	{
		this.getCurrentState().data = data;
	};
	this.getValue = function(valueName, rowContext)
	{
		var result = "";
		var curState = this.getCurrentState();
		var ds = curState.nestedDS ? curState.nestedDS : this.getDataSet();
		if (ds)
			result = ds.getValue(valueName, rowContext);
		return result;
	};
	this.getCurrentRow = function()
	{
		if (m_curRowIndexArray.length < 2 || getInternalRowIndex() < 0)
			return m_dataSet.getCurrentRow();

		var data = this.getData();
		var curRowIndex = getInternalRowIndex();

		if (curRowIndex < 0 || curRowIndex > data.length)
		{
			Spry.Debug.reportError("Invalid index used in Spry.Data.Region.DSContext.getCurrentRow()!\n");
			return null;
		}

		return data[curRowIndex];
	};
	this.getRowIndex = function()
	{
		var curRowIndex = getInternalRowIndex();
		if (curRowIndex >= 0)
			return curRowIndex;

		return m_dataSet.getRowNumber(m_dataSet.getCurrentRow());
	};
	this.setRowIndex = function(rowIndex)
	{
		this.getCurrentState().rowIndex = rowIndex;

		var data = this.getData();
		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
			m_children[i].syncDataWithParentRow(this, rowIndex, data);
	};
	this.syncDataWithParentRow = function(parentDSContext, rowIndex, parentData)
	{
		var row = parentData[rowIndex];
		if (row)
		{
			nestedDS = m_dataSet.getNestedDataSetForParentRow(row);
			if (nestedDS)
			{
				var currentState = this.getCurrentState();
				currentState.nestedDS = nestedDS;
				currentState.data = nestedDS.getData();
				currentState.rowIndex = nestedDS.getCurrentRowNumber();

				// getCurrentRowNumber() will return a -1 if the nestedDS has
				// no data in it. If the rowIndex is -1, we need to reset it back to
				// zero so the dsContext doesn't attempt to use the *real* current
				// row of the data set.

				currentState.rowIndex = currentState.rowIndex < 0 ? 0 : currentState.rowIndex;

				var numChildren = m_children.length;
				for (var i = 0; i < numChildren; i++)
					m_children[i].syncDataWithParentRow(this, currentState.rowIndex, currentState.data);
			}
		}
	};
	this.pushState = function()
	{
		var curState = this.getCurrentState();
		var newState = new Object;
		newState.rowIndex = curState.rowIndex;
		newState.data = curState.data;
		newState.nestedDS = curState.nestedDS;

		m_curRowIndexArray.push(newState);

		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
			m_children[i].pushState();
	};
	this.popState = function()
	{
		if (m_curRowIndexArray.length < 2)
		{
			// Our array should always have at least one element in it!
			Spry.Debug.reportError("Stack underflow in Spry.Data.Region.DSContext.popState()!\n");
			return;
		}

		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
			m_children[i].popState();

		m_curRowIndexArray.pop();
	};
	this.getCurrentState = function()
	{
		return m_curRowIndexArray[m_curRowIndexArray.length - 1];
	};
	this.addChild = function(childDSContext)
	{
		var numChildren = m_children.length;
		for (var i = 0; i < numChildren; i++)
		{
			if (m_children[i] == childDSContext)
				return;
		}
		m_children.push(childDSContext);
	};
};

Spry.Data.Region.ProcessingContext = function(region)
{
	this.region = region;
	this.dataSetContexts = [];

	if (region && region.dataSets)
	{
		// Run through each data set in the list and check to see if we need
		// to add its parent to the list of data sets we track.
		var dsArray = region.dataSets.slice(0);
		var dsArrayLen = dsArray.length;
		for (var i = 0; i < dsArrayLen; i++)
		{
			var ds = region.dataSets[i];
			while (ds && ds.getParentDataSet)
			{
				var doesExist = false;
				ds = ds.getParentDataSet();
				if (ds && this.indexOf(dsArray, ds) == -1)
					dsArray.push(ds);
			}
		}

		// Create a data set context for every data set in our list.

		for (i = 0; i < dsArray.length; i++)
			this.dataSetContexts.push(new Spry.Data.Region.DSContext(dsArray[i], this));

		// Now run through the list of data set contexts and wire up the parent/child
		// relationships so that notifications get dispatched as expected.

		var dsContexts = this.dataSetContexts;
		var numDSContexts = dsContexts.length;

		for (i = 0; i < numDSContexts; i++)
		{
			var dsc = dsContexts[i];
			var ds = dsc.getDataSet();
			if (ds.getParentDataSet)
			{
				var parentDS = ds.getParentDataSet();
				if (parentDS)
				{
					var pdsc = this.getDataSetContext(parentDS);
					if (pdsc) pdsc.addChild(dsc);
				}
			}
		}
	}
};

Spry.Data.Region.ProcessingContext.prototype.indexOf = function(arr, item)
{
	// Given an array, return the index of item in that array
	// or -1 if it doesn't exist.

	if (arr)
	{
		var arrLen = arr.length;
		for (var i = 0; i < arrLen; i++)
			if (arr[i] == item)
				return i;
	}
	return -1;
};

Spry.Data.Region.ProcessingContext.prototype.getDataSetContext = function(dataSet)
{
	if (!dataSet)
	{
		// We were called without a specified data set or
		// data set name. Assume the caller wants the first
		// data set in the processing context.

		if (this.dataSetContexts.length > 0)
			return this.dataSetContexts[0];
		return null;
	}

	if (typeof dataSet == 'string')
	{
		dataSet = Spry.Data.getDataSetByName(dataSet);
		if (!dataSet)
			return null;
	}

	for (var i = 0; i < this.dataSetContexts.length; i++)
	{
		var dsc = this.dataSetContexts[i];
		if (dsc.getDataSet() == dataSet)
			return dsc;
	}

	return null;
};

Spry.Data.Region.ProcessingContext.prototype.getValueFromDataSet = function()
{
	var dsName = "";
	var columnName = "";

	if (arguments.length > 1)
	{
		// The caller is passing in the data set name and the
		// name of the data reference separately.

		dsName = arguments[0];
		columnName = arguments[1];
	}
	else
	{
		// The caller is passing a single string which can be in one
		// of the following forms:
		//
		//    "columnName"
		//    "dsName::columnName"
		//    "{columnName}"
		//    "{dsName::columnName}"

		var dataRef = arguments[0].replace(/\s*{\s*|\s*}\s*/g, "");
		if (dataRef.search("::") != -1)
		{
			dsName = dataRef.replace(/::.*/, "");
			columnName = dataRef.replace(/.*::/, "");
		}
		else
			columnName = dataRef;
	}

	var result = "";
	var dsContext = this.getDataSetContext(dsName);
	if (dsContext)
		result = dsContext.getValue(columnName, dsContext.getCurrentRow());
	else
		Spry.Debug.reportError("getValueFromDataSet: Failed to get " + dsName + " context for the " + this.region.regionNode.id + " region.\n");

	return result;
};

// Define a short-hand name for developers.
Spry.Data.Region.ProcessingContext.prototype.$v = Spry.Data.Region.ProcessingContext.prototype.getValueFromDataSet;

Spry.Data.Region.ProcessingContext.prototype.getCurrentRowForDataSet = function(dataSet)
{
	var dsc = this.getDataSetContext(dataSet);
	if (dsc)
		return dsc.getCurrentRow();
	return null;
};

Spry.Data.Region.Token = function(tokenType, dataSet, data, regionStr)
{
	var self = this;
	this.tokenType = tokenType;
	this.dataSet = dataSet;
	this.data = data;
	this.regionStr = regionStr;
	this.parent = null;
	this.children = null;
};

Spry.Data.Region.Token.prototype.addChild = function(child)
{
	if (!child)
		return;

	if (!this.children)
		this.children = new Array;

	this.children.push(child);
	child.parent = this;
};

Spry.Data.Region.Token.LIST_TOKEN                   = 0;
Spry.Data.Region.Token.STRING_TOKEN                 = 1;
Spry.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN = 2;
Spry.Data.Region.Token.VALUE_TOKEN                  = 3;

Spry.Data.Region.Token.PIData = function(piName, data, jsExpr, regionState)
{
	var self = this;
	this.name = piName;
	this.data = data;
	this.jsExpr = jsExpr;
	this.regionState = regionState;
};

Spry.Utils.addLoadListener(function() { setTimeout(function() { if (Spry.Data.initRegionsOnLoad) Spry.Data.initRegions(); }, 0); });
;// SpryDataExtensions.js - version 0.4 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

//////////////////////////////////////////////////////////////////////
//
// Support for multiple non-destructive filters on a Data Set.
//
//////////////////////////////////////////////////////////////////////

Spry.Data.DataSet.multiFilterFuncs = {};
Spry.Data.DataSet.multiFilterFuncs.and = function(ds, row, rowNumber, filters)
{
	if (filters)
	{
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			row = filters[i](ds, row, rowNumber);
			if (!row)
				break;
		}
	}
	return row;
};

Spry.Data.DataSet.multiFilterFuncs.or = function(ds, row, rowNumber, filters)
{
	if (filters && filters.length > 0)
	{
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			var savedRow = row;
			row = filters[i](ds, row, rowNumber);
			if (row)
				return row;
			row = savedRow;
		}
		return null;
	}
	return row;
};

Spry.Data.DataSet.prototype.getMultiFilterFunc = function()
{
	var func = Spry.Data.DataSet.multiFilterFuncs[this.getFilterMode()];
	if (!func)
		func = Spry.Data.DataSet.multiFilterFuncs["and"];
	var filters = this.activeFilters;
	return function(ds, row, rowNumber) { return func(ds, row, rowNumber, filters); };
};

Spry.Data.DataSet.prototype.addFilter = function(filterFunc, doApplyFilters)
{
	if (!this.hasFilter(filterFunc))
	{
		if (!this.activeFilters)
			this.activeFilters = [];
		this.activeFilters.push(filterFunc);
	}
	if (doApplyFilters)
		this.applyFilters();
};

Spry.Data.DataSet.prototype.removeFilter = function(filterFunc, doApplyFilters)
{
	var filters = this.activeFilters;
	if (filters)
	{
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			if (filters[i] == filterFunc)
			{
				this.activeFilters.splice(i, 1);
				if (doApplyFilters)
					this.applyFilters();
				return;
			}
		}
	}
};

Spry.Data.DataSet.prototype.removeAllFilters = function(doApplyFilters)
{
	var filters = this.activeFilters;
	if (filters && filters.length > 0)
	{
		this.activeFilters = [];
		if (doApplyFilters)
			this.applyFilters();
	}
};

Spry.Data.DataSet.prototype.getFilters = function(filterFunc)
{
	if (!this.activeFilters)
		this.activeFilters = [];
	return this.activeFilters;
};

Spry.Data.DataSet.prototype.applyFilters = function()
{
	if (this.activeFilters && this.activeFilters.length > 0)
		this.filter(this.getMultiFilterFunc());
	else
		this.filter(null);
};

Spry.Data.DataSet.prototype.hasFilter = function(filterFunc)
{
	if (!this.activeFilters && this.activeFilters > 0)
	{
		var filters = this.activeFilters;
		var numFilters = filters.length;
		for (var i = 0; i < numFilters; i++)
		{
			if (filters[i] == filterFunc)
				return true;
		}
	}
	return false;
};

Spry.Data.DataSet.prototype.getFilterMode = function()
{
	return this.filterMode ? this.filterMode : "and";
};

Spry.Data.DataSet.prototype.setFilterMode = function(mode, doApplyFilters)
{
	var oldMode = this.getFilterMode();
	this.filterMode = mode;
	if (doApplyFilters)
		this.applyFilters();
	return oldMode;
};
;// SpryDataSetShell.js - version 0.1 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Spry.Data.DataSetShell = function(ds, options)
{
	this.currentDS = ds;
	this.options = options;

	Spry.Data.DataSet.call(this, options);

	if (this.currentDS)
		this.currentDS.addObserver(this.getObserverFunc(this.currentDS));
};

Spry.Data.DataSetShell.prototype = new Spry.Data.DataSet();
Spry.Data.DataSetShell.prototype.constructor = Spry.Data.DataSetShell.prototype;

Spry.Data.DataSetShell.prototype.getObserverFunc = function(ds)
{
	var self = this;
	return function(notificationType, notifier, data) { self.notifyObservers(notificationType, data); };
};

Spry.Data.DataSetShell.prototype.setInternalDataSet = function(ds, loadDS)
{
	var cds = this.currentDS;
	if (cds != ds)
	{
		var wasLoaded = ds.getDataWasLoaded();

		if (wasLoaded)
			this.notifyObservers("onPreLoad");

		if (cds)
			cds.removeObserver(this.getObserverFunc(cds));

		this.currentDS = ds;
		ds.addObserver(this.getObserverFunc(ds));

		if (wasLoaded)
		{
			this.notifyObservers("onPostLoad");
			this.notifyObservers("onDataChanged");
		}
		else if (loadDS)
			ds.loadData();
	}
};

Spry.Data.DataSetShell.prototype.getInternalDataSet = function()
{
	return this.currentDS;
};

Spry.Data.DataSetShell.prototype.getNestedDataSetForParentRow = function(parentRow)
{
	return this.currentDS ? this.currentDS.getNestedDataSetForParentRow() : null;
};

Spry.Data.DataSetShell.prototype.getParentDataSet = function()
{
	if (this.currentDS && this.currentDS.getParentDataSet)
		return this.currentDS.getParentDataSet();
	return null;
};

Spry.Data.DataSetShell.prototype.loadData = function()
{
	if (this.currentDS && !this.currentDS.getLoadDataRequestIsPending())
		this.currentDS.loadData();
};

Spry.Data.DataSetShell.prototype.getData = function(unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getData(unfiltered);
	return [];
};

Spry.Data.DataSetShell.prototype.getLoadDataRequestIsPending = function()
{
	return this.currentDS ? this.currentDS.getLoadDataRequestIsPending() : false;
};

Spry.Data.DataSetShell.prototype.getDataWasLoaded = function()
{
	return this.currentDS ? this.currentDS.getDataWasLoaded() : false;
};

Spry.Data.DataSetShell.prototype.setDataFromArray = function(arr, fireSyncLoad)
{
	if (this.currentDS)
		this.currentDS.setDataFromArray(arr, fireSyncLoad);
};

Spry.Data.DataSetShell.prototype.cancelLoadData = function()
{
	if (this.currentDS)
		this.currentDS.cancelLoadData();
};

Spry.Data.DataSetShell.prototype.getRowCount = function(unfiltered)
{
	return this.currentDS ? this.currentDS.getRowCount(unfiltered) : 0;
};

Spry.Data.DataSetShell.prototype.getRowByID = function(rowID)
{
	return this.currentDS ? this.currentDS.getRowByID(rowID) : undefined;
};

Spry.Data.DataSetShell.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	return this.currentDS ? this.currentDS.getRowByRowNumber(rowNumber, unfiltered) : null;
};

Spry.Data.DataSetShell.prototype.getCurrentRow = function()
{
	return this.currentDS ? this.currentDS.getCurrentRow(): null;
};

Spry.Data.DataSetShell.prototype.setCurrentRow = function(rowID)
{
	if (this.currentDS)
		this.currentDS.setCurrentRow(rowID);
};

Spry.Data.DataSetShell.prototype.getRowNumber = function(row)
{
	return this.currentDS ? this.currentDS.getRowNumber(row) : 0;
};

Spry.Data.DataSetShell.prototype.getCurrentRowNumber = function()
{
	return this.currentDS ? this.currentDS.getCurrentRowNumber(): 0;
};

Spry.Data.DataSetShell.prototype.getCurrentRowID = function()
{
	return this.currentDS ? this.currentDS.getCurrentRowID() : 0;
};

Spry.Data.DataSetShell.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (this.currentDS)
		this.currentDS.setCurrentRowNumber(rowNumber);
};

Spry.Data.DataSetShell.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	if (this.currentDS)
		return this.currentDS.findRowsWithColumnValues(valueObj, firstMatchOnly, unfiltered);
	return firstMatchOnly ? null : [];
};

Spry.Data.DataSetShell.prototype.setColumnType = function(columnNames, columnType)
{
	if (this.currentDS)
		this.currentDS.setColumnType(columnNames, columnType);
};

Spry.Data.DataSetShell.prototype.getColumnType = function(columnName)
{
	return this.currentDS ? this.currentDS.getColumnType(columnName) : "string";
};

Spry.Data.DataSetShell.prototype.distinct = function(columnNames)
{
	if (this.currentDS)
		this.currentDS.distinct(columnNames);
};

Spry.Data.DataSetShell.prototype.getSortColumn = function()
{
	return this.currentDS ? this.currentDS.getSortColumn() : "";
};

Spry.Data.DataSetShell.prototype.getSortOrder = function()
{
	return this.currentDS ? this.currentDS.getSortOrder() : "";
};

Spry.Data.DataSetShell.prototype.sort = function(columnNames, sortOrder)
{
	if (this.currentDS)
		this.currentDS.sort(columnNames, sortOrder);
};

Spry.Data.DataSetShell.prototype.filterData = function(filterFunc, filterOnly)
{
	if (this.currentDS)
		this.currentDS.filterData(filterFunc, filterOnly);
};

Spry.Data.DataSetShell.prototype.filter = function(filterFunc, filterOnly)
{
	if (this.currentDS)
		this.currentDS.filter(filterFunc, filterOnly);
};;// SpryDebug.js - version 0.9 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {};

Spry.BrowserSniff = function()
{
	var b = navigator.appName.toString();
	var up = navigator.platform.toString();
	var ua = navigator.userAgent.toString();

	this.mozilla = this.ie = this.opera = this.safari = false;
	var re_opera = /Opera.([0-9\.]*)/i;
	var re_msie = /MSIE.([0-9\.]*)/i;
	var re_gecko = /gecko/i;
	var re_safari = /(applewebkit|safari)\/([\d\.]*)/i;
	var r = false;
	
	if ( (r = ua.match(re_opera))) {
		this.opera = true;
		this.version = parseFloat(r[1]);
	} else if ( (r = ua.match(re_msie))) {
		this.ie = true;
		this.version = parseFloat(r[1]);
	} else if ( (r = ua.match(re_safari))) {
		this.safari = true;
		this.version = parseFloat(r[2]);
	} else if (ua.match(re_gecko)) {
		var re_gecko_version = /rv:\s*([0-9\.]+)/i;
		r = ua.match(re_gecko_version);
		this.mozilla = true;
		this.version = parseFloat(r[1]);
	}
	this.windows = this.mac = this.linux = false;

	this.Platform = ua.match(/windows/i) ? "windows" :
					(ua.match(/linux/i) ? "linux" :
					(ua.match(/mac/i) ? "mac" :
					ua.match(/unix/i)? "unix" : "unknown"));
	this[this.Platform] = true;
	this.v = this.version;

	if (this.safari && this.mac && this.mozilla) {
		this.mozilla = false;
	}
};

Spry.is = new Spry.BrowserSniff();

Spry.Debugger = function(){
	var self = this;
	this.onunloaddocument = function(){
			var rmvListener = Spry.Debugger.Utils.removeEvListener;
			rmvListener(window, 'beforeunload', self.unloadfunc, false);
			rmvListener(window, 'load', self.loadfunc, false);
			rmvListener(self.jstext, 'keydown', self.dkfunc, false);
			rmvListener(self.jstext, 'keypress', self.dkfunc, false);
			rmvListener(self.closediv,'click', self.cdwfunc, false);
			rmvListener(self.cleardiv,'click', self.cldwfunc, false);
			rmvListener(self.maximdiv,'click', self.mdwfunc, false);
			rmvListener(self.headdiv, 'mousedown', self.mddwfunc, false);
			rmvListener(self.headdiv, 'mouseup', this.mudwfunc, false);
			rmvListener(document.body, 'mousemove', self.mmdwfunc, false);
			for (var k in self){
				var t = typeof self[k];
				if (t != "function"){
					if (t == "object" && self[k].innerHTML)
						self[k].innerHTML = '';

					self[k] = null;
				}
			}
	};

	this.myerrorhandler = function( errType, errURL, errLineNum )
	{
		try{
			self.out('<div class="error">' + self.explode(errType + " \n " + errURL + ' on line: ' + errLineNum, 0) + '<br style="clear: both;" /></div>');
		}catch(err){alert(err.message);}
		return false;
	};

	if (window.XMLHttpRequest && window.XMLHttpRequest.prototype){
		window.XMLHttpRequest.prototype.debugopen = window.XMLHttpRequest.prototype.open;
		window.XMLHttpRequest.prototype.open = function(method, url, asyncFlag, username, password){
				var self = this;
				// Firefox
				if (this.addEventListener){
					this.addEventListener("load", function(){Spry.Debugger.Utils.logXHRequest(self, method, url);}, false);
				// Opera
				}else if (window.opera){
					var a = this.onreadystatechange;
					this.onreadystatechange = function(){if (typeof a == 'function')a(); Spry.Debugger.Utils.logXHRequest(self, method, url);};
				}
			return this.debugopen(method, url, asyncFlag, username, password);
		};
	}

	this.unloadfunc = function(e){self.onunloaddocument()};
	this.loadfunc = function(e){self.init()};
	Spry.Debugger.Utils.addEvListener(window, 'beforeunload', this.unloadfunc, false);
	Spry.Debugger.Utils.addEvListener(window, 'load', this.loadfunc, false);
	window.onerror = this.myerrorhandler;
};

Spry.Debugger.prototype.init = function(){
	var w = document.getElementById('debugdiv');
	if (!w){
		var debugwindow = document.createElement('div');
		var headdiv = document.createElement('div');
		var closediv = document.createElement('div');
		var maximdiv = document.createElement('div');
		var invdiv = document.createElement('div');
		var textdiv = document.createElement('div');
		var consolediv = document.createElement('div');
		var cleardiv = document.createElement('div');
		var iframe = document.createElement('iframe');

		var scripts = document.getElementsByTagName('script');
		var link = '';
		for (var k=0; k< scripts.length; k++){
			if (scripts[k].src != null && scripts[k].src != '' && scripts[k].src.match(/SpryDebug.js$/)){
				link = scripts[k].src.replace(/SpryDebug.js/, '../css/SpryDebug.css');
				break;
			}
		}
		if (link != ''){
			var cssfile = document.createElement("link");
			cssfile.setAttribute("rel", "stylesheet");
			cssfile.setAttribute("type", "text/css");
			cssfile.setAttribute("href", link);
			document.getElementsByTagName("head").item(0).appendChild(cssfile);
		}
		textdiv.id = 'textdiv';
		textdiv.innerHTML = '<ol><li>Click the (left) button above.</li><li>Click on the page element to introspect. The red outline shows the current selection.</li></ol>';
		headdiv.id = 'headdiv';
		closediv.id = 'closediv';
		closediv.innerHTML = 'x';

		maximdiv.id = 'maximdiv';
		maximdiv.innerHTML = '<div></div>';

		cleardiv.id = 'cleardiv';
		cleardiv.innerHTML = 'clear';

		invdiv.id = 'invdiv';
		invdiv.innerHTML = 'o';

		debugwindow.id = 'debugdiv';

		iframe.src = 'javascript:""';
		iframe.frameBorder = '0';
		iframe.scrolling = 'no';
		iframe.id = 'debugIframe';

		//scroll in the visible area on refresh
		setTimeout(function(){
			try{
				var top = 0;
				if (document.documentElement && document.documentElement.scrollTop)
					var top = parseInt(document.documentElement.scrollTop, 10);
				else if (document.body)
					var top = parseInt(document.body.scrollTop, 10);

				top = top + 10;
				if ( !isNaN(top) && top > 10)
					debugwindow.style.top = top+'px';
			}catch(silent){alert(silent.message);}
		}, 500);

		consolediv.id = 'consolediv';
		consolediv.innerHTML = '<form id="debugForm" action="#" method="get" onsubmit="return debug.jseval();"><input type="text" id="debugtext" name="debugtext" /><input type="submit" id="submitform" /><div id="debuggersuggestions"></div></form>';

		document.body.appendChild(debugwindow);
		debugwindow.appendChild(headdiv);
		debugwindow.appendChild(textdiv);
		debugwindow.appendChild(consolediv);
		headdiv.appendChild(closediv);
		headdiv.appendChild(maximdiv);
		headdiv.appendChild(cleardiv);
		headdiv.appendChild(invdiv);
		debugwindow.parentNode.appendChild(iframe);
		this.jstext = document.getElementById('debugtext');
		this.jstext.setAttribute('AutoComplete', 'off');
		var self = this;

		this.dkfunc = function(e){return self.debuggerKey(e)};
		this.cdwfunc = function(e){return self.closeDebugWindow(e)};
		this.cldwfunc = function(e){return self.clearDebugWindow(e)};
		this.mdwfunc = function(e){return self.maximDebugWindow(e)};
		this.mddwfunc = function(e){return self.mousedownDebugWindow(e)};
		this.mmdwfunc = function(e){return self.mousemoveDebugWindow(e)};
		this.mudwfunc = function(e){return self.mouseupDebugWindow(e)};
		this.imdfunc = function(e){return self.introspectPage(e)};
		var addEv = Spry.Debugger.Utils.addEvListener;
		addEv(self.jstext, 'keydown', this.dkfunc, false);
		addEv(closediv,'click', this.cdwfunc, false);
		addEv(cleardiv,'click', this.cldwfunc, false);
		addEv(invdiv,'click', this.imdfunc, false);
		addEv(maximdiv,'click', this.mdwfunc, false);
		addEv(headdiv, 'mousedown', this.mddwfunc, false);
		addEv(document.body, 'mousemove', this.mmdwfunc, false);
		addEv(headdiv, 'mouseup', this.mudwfunc, false);
		this.debugdiv = debugwindow;
		this.jshints = document.getElementById('debuggersuggestions');
		this.headdiv = headdiv;
		this.closediv = closediv;
		this.maximdiv = maximdiv;
		this.textdiv = textdiv;
		this.consolediv = consolediv;
		this.cleardiv = cleardiv;
	}
	// clear stack
	this.out();
	setTimeout(function(){if (Spry.is.ie && Spry.is.version < 7)
	{
			iframe.style.height = debugwindow.offsetHeight + 'px';
			iframe.style.width = debugwindow.offsetWidth + 'px';
	}},0);
};
Spry.Debugger.prototype.introspectPage = function(e){
	if (this.introspRun && this.introspRun == true){
		this.introspRun = false;
		self.stopHi();
	}else{
		this.introspRun = true;
		if (typeof this.hiElTop == 'undefined'){
			var self = this;
			Spry.Debugger.Utils.addEvListener(document, 'mouseover', function(ev){
				if (!self.introspRun) return;
					ev = ev || event;
					var el;
					if (Spry.is.mozilla)
						el = ev.target;
					else
						el = ev.srcElement;

					if (self.hiEl && el == self.hiEl)
						return true;
					
					if (!self.prevT || self.prevT != ev.target)
					{
						self.highlight(el, self.prevT);
						self.prevT = el;
					} 
					Spry.Debugger.Utils.stopEvent(ev);
					return false;
			}, true); 
			Spry.Debugger.Utils.addEvListener(document, 'mousedown', function(ev){
				ev = ev || event;
				if (!self.introspRun) return;
				var el;
				if (Spry.is.mozilla)
					el = ev.target;
				else
					el = ev.srcElement;

				if (el != self.invdiv)
					self.log(el);

				self.stopHi();
				self.introspRun = false;
				Spry.Debugger.Utils.stopEvent(ev);
				return false;
			}, true);
		}
	}
};
Spry.Debugger.prototype.highlight = function(targ){
	if (typeof this.introspRun == 'undefined' || !this.introspRun){
		return;
	}
	if (!this.hiElTop){
		this.hiElTop = document.createElement('div');
		this.hiElTop.id = 'highlighterTop';
		this.hiElRight = document.createElement('div');
		this.hiElRight.id = 'highlighterRight';
		this.hiElBottom = document.createElement('div');
		this.hiElBottom.id = 'highlighterBottom';
		this.hiElLeft = document.createElement('div');
		this.hiElLeft.id = 'highlighterLeft';

		document.body.appendChild(this.hiElTop);
		document.body.appendChild(this.hiElBottom);
		document.body.appendChild(this.hiElLeft);
		document.body.appendChild(this.hiElRight);
	}
	if (targ != this.hiElTop && targ != this.hiElLeft && targ != this.hiElBottom && targ != this.hiElRight){
		try{
		var tmp = Spry.Debugger.Utils.getBorderBox(targ);
		this.hiElBottom.style.width = this.hiElTop.style.width = tmp.width + 'px';
		this.hiElRight.style.height = this.hiElLeft.style.height = tmp.height + 'px';
		this.hiElRight.style.top = this.hiElLeft.style.top = this.hiElTop.style.top = tmp.y + 'px';
		this.hiElBottom.style.left = this.hiElLeft.style.left = this.hiElTop.style.left = tmp.x + 'px';
		this.hiElBottom.style.top = (tmp.y + tmp.height - 1) + 'px';
		this.hiElRight.style.left = (tmp.x + tmp.width - 1) + 'px';
		}catch(eroare){}
	}
};
Spry.Debugger.prototype.stopHi = function(){
	try{
	this.hiElBottom.style.top = this.hiElLeft.style.top = this.hiElRight.style.top = this.hiElTop.style.top =
	this.hiElBottom.style.left = this.hiElLeft.style.left = this.hiElRight.style.left = this.hiElTop.style.left =
	this.hiElBottom.style.width = this.hiElLeft.style.width = this.hiElRight.style.width = this.hiElTop.style.width =
	this.hiElBottom.style.height = this.hiElLeft.style.height = this.hiElRight.style.height = this.hiElTop.style.height = "0px";
	}catch(error){};
};
Spry.Debugger.prototype.debuggerKey = function(e){
	e = e || event;
	if (e && e.keyCode){
		switch (e.keyCode){
			case 9:
				var l = [];
				var b = this.jstext.value.replace(/.*\(/,'');
				var a = b.replace(/\.?[^.]*$/,'');
				if (a == '') a = 'window';
				a = 'var c = ' + a;
				try{eval(a)}catch(e){};
				if (typeof c != 'undefined' && c){
					inner = '';
					debug.out();
					for (var k in c){
							if (k.toLowerCase().indexOf(b.toLowerCase().replace(/.*\./, '')) == 0){
								if (k.toUpperCase() == k)
									continue;
								try{
									if (k != 'domConfig' && typeof c[k] == 'function'){
										k += '(';
									}
								}catch(e){this.myerrorhandler('debug.debuggerKey: '+ k +'()' + e.message, 'debug.js',152);}

								l[l.length] = k;
							}
					}
					for (var j = 0; j < l.length; j++)
						inner+='<div onmouseover="this.style.backgroundColor=\'#CCCCCC\'" onmouseout="this.style.backgroundColor=\'\'" onclick="debug.jstext.value = debug.jstext.value.replace(/\.[^.]*$/, \'.\') + \'' + l[j] + '\'; debug.jshints.style.display = \'none\'" class="debuggersuggest">' + l[j] + '</div>';

					if (inner.length != 0){
						this.jshints.innerHTML = inner;
						this.jshints.style.display = 'block';
					}
				}
				this.jstext.focus();
				Spry.Debugger.Utils.stopEvent(e);
				return false;
				break;
			case 40:
			case 38:
				if (this.jshints.style.display != 'block'){
					Spry.Debugger.Utils.stopEvent(e);
					return false;
				}
				var ch = this.jshints.getElementsByTagName('div');
				var prev = -1;
				if (ch && ch.length){
					prev = ch.length;
				}
				var next = false;
				var found = false;
				for (var k = 0; k < ch.length; k++)
				{
					if (next)
					{
						ch[k].style.backgroundColor = '#CCCCCC';
						this.debuggerScroll(ch[k]);
						break;
					}
					if (ch[k].style.backgroundColor.toUpperCase() == '#CCCCCC' || ch[k].style.backgroundColor == 'rgb(204, 204, 204)')
					{
						ch[k].style.backgroundColor = '';
						found = true;
						if (e.keyCode == 40)
						{
							next = true;
							continue;
						}
						else
						{
							ch[prev].style.backgroundColor = '#CCCCCC';
							this.debuggerScroll(ch[prev]);
							break;
						}
					}
					prev = k;
				}
				if (!found || (next && k == ch.length))
				{
					ch[0].style.backgroundColor = '#CCCCCC';
					this.debuggerScroll(ch[0]);
				}
				Spry.Debugger.Utils.stopEvent(e);
				return false;
				break;
			case 13:
				if (this.jshints.style.display != 'block')
					return true;

				var ch = this.jshints.getElementsByTagName('div');
				for (var k=0; k < ch.length ;k++)
					if (ch[k].style.backgroundColor.toUpperCase() == '#CCCCCC' || ch[k].style.backgroundColor == 'rgb(204, 204, 204)'){
						this.jstext.value = this.jstext.value.replace(/\.[^.]*$/, '.') + ch[k].innerHTML;
						this.jshints.style.display = 'none';
						Spry.Debugger.Utils.stopEvent(e);
						return false;
					}
				Spry.Debugger.Utils.stopEvent(e);
				return false;
				break;
			default:
				this.jshints.style.display = 'none';
				break;
		}
	}
};
Spry.Debugger.prototype.debuggerScroll = function(el){
		var a = this.jshints;
		var h = 100;
		if (el.offsetTop < a.scrollTop)
			a.scrollTop = el.offsetTop;
		else if (el.offsetTop + el.offsetHeight > a.scrollTop + h)
		{
			// the 5 pixels make the latest option more visible.
			a.scrollTop = el.offsetTop + el.offsetHeight - h + 5;
			if (a.scrollTop < 0)
				a.scrollTop = 0;
		}
};
Spry.Debugger.prototype.jseval = function(){
	if (!this.history)
		this.history = [];
	try{
		var val = this.jstext.value;
		this.history[this.history.length] = val;
		val = 'var tmp = ' + val + '; if (tmp){ var asd = false; try{debug.log("<div><span class=\\\"commandExecResultsLabel\\\">Command Execution Result</span>:" + debug.explode(tmp, 0) + "</div>")}catch(asd){}}';
		var bug = false;
		try{
			eval(val);
		}catch(bug){alert(bug.message)}

		if (bug && bug.message){
			eval(this.jstext.value);
		}
	}catch(e){this.myerrorhandler(e.message, ' debug.console ', 255);}
	this.jstext.value = '';
	return false;
};

Spry.Debugger.prototype.dumpObjectEl = function(e, k, depth){
	if (k == 'domConfig') return;

	var ctrl='';
	try{
		var tipe = typeof e[k];
		if (tipe == 'unknown') return '<div class="varlabel">'+k+'</div><div class="varvalue">value unknown</div>';
		if (tipe != 'function'){
			if (typeof k == 'number' || k.toUpperCase() != k){
				ctrl += '<div class="varlabel';

				if (tipe == 'object' && e[k] != null && depth < 1)
					ctrl += ' objectlabel';
				ctrl += '">' + k + '</div><div class="varvalue">';
	
				if (tipe == 'object' && e[k] != null && depth < 1)
					ctrl += '<a href="#" onclick="Spry.Debugger.Utils.makeVisible(this); return false;">';

				if (tipe == 'undefined'){
					ctrl += 'undefined';
				}else if (e[k] == null){
					ctrl += 'null';
				}else if (tipe == 'string'){
					if (e[k] == ''){
						ctrl += '""';
					}else if (e[k].match(/^#[0-9a-z]{3,6}$/) || e[k].indexOf('rgb(') == 0){
						var color = e[k];
						if (e[k].indexOf('rgb(') == 0)
							color = '#' + parseInt(e[k].substr(e[k].indexOf('(')+1, e[k].indexOf(',') - e[k].indexOf('(')-1),10).toString(16) + "" + parseInt(e[k].substr(e[k].indexOf(',') +1 ,e[k].lastIndexOf(',') - e[k].indexOf(',')-1),10).toString(16) + "" + parseInt(e[k].substr(e[k].lastIndexOf(',')+1, e[k].indexOf(')') - e[k].lastIndexOf(',')-1),10).toString(16);

						ctrl += '<span style="color:' + color + '">' + e[k] + '</span>';
					}else{
						ctrl += e[k].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />');
					}
				}else{
					try{
						ctrl += e[k];
					}catch(e){ctrl += '[object ?!]';}
				}
				if (tipe == 'object' && e[k] != null && depth < 1){
					ctrl += '</a>';
					try{
							ctrl += this.explode(e[k], depth + 1);
						}catch(erp){};
				}
				ctrl+= '</div>';
			}
		}
	}catch(errr){};
	return ctrl;
};
Spry.Debugger.prototype.explode = function (e, depth){
	try{
		var ctrl = '';
		var ctrl_al = '';

		if (typeof depth == 'undefined')
			depth = 0;

		ctrl += '<div class="dumptable' + ((depth > 0)?' hidedump' : '') + '">';
		switch (typeof e){
			case 'object':
				if ( typeof e.length == 'undefined' || (e.length > 0 && typeof e.push == 'undefined')){
					for (var k in e){
						if (k != 'domConfig' && typeof e[k] != 'function'){
							ctrl += this.dumpObjectEl(e, k, depth);
							try{
							if (k == 'style' && depth == 0){
								var css = '';
								if (document.defaultView && document.defaultView.getComputedStyle)
									css = document.defaultView.getComputedStyle(e, null);
								else if (e.currentStyle) 
									css = e.currentStyle;
								ctrl += '<div class="varlabel computed">[Computed Style]:</div><div class="varvalue">[<a href="#" onclick="Spry.Debugger.Utils.makeVisible(this); return false;">STYLE</a>]';
								ctrl += this.explode(css, 1);
								ctrl += '</div>';
							}
							}catch(arr){alert(arr.message);}
						}else{
							ctrl_al += ', ' + k + '()';
						}
					}
					if (ctrl_al.length > 0){
						ctrl_al = ctrl_al.substring(2);
						ctrl += '<div class="varlabel">FUNCTIONS:</div>';
						ctrl += '<div class="varvalue" colspan="2">' + ctrl_al + '</div>';
					}
				}else{
					if (e.length == 0){
						ctrl += '<div class="specialvaluedump" colspan="2">Empty Array</div>';
					}else{
						ctrl += '<div class="varlabel">Length</div><div class="varvalue">'+e.length+'</div>';
						for (var k = 0; k < e.length; k++)
							ctrl += this.dumpObjectEl(e, k, depth);
					}
				}
				break;
			case 'string':
				var len = e.length;
				var content = e;
			  if (e.indexOf('<')){
						var content = e.replace(/</ig ,'&lt;').replace(/>/ig, '&gt;');
						content = '<pre>' + content + '</pre>';
				}
				ctrl += '<div class="varlabel">string(' + len + '):</div><div class="varvalue"> ' + content +'</div>';
				break;
			case 'function':
				try{
					var a = ''+e;
					ctrl += '<div class="varlabel">function()</div><div class="varvalue"><pre> ' + a.replace(/</g, '&lt;').replace(/>/g, '&gt;') +'</pre></div>';
				}catch(e){this.log(e.message)};
				break;
			case 'undefined':
				ctrl += '<div class="specialvaluedump" colspan=2><i>undefined</i></div>';
				break;
			case 'number':
				var type = parseInt(e, 10) == e ? 'Integer:' : (parseFloat(e) == e ? 'Float:' : 'Number:');
				ctrl +=  '<div class="varlabel">'+type+'</div><div class="varvalue">' + e +'</div>';
				break;
			case 'boolean':
				ctrl +=  '<div class="varlabel">Boolean:</div><div class="varvalue">' + e +'</div>';
		}
		ctrl += '<br class="clear" /></div>';
		return ctrl;

	}catch(e){this.out('Spry.Debugger.explode error: ' + e.message);}
};

//public static methods
Spry.Debugger.prototype.log = function (){
	var t = arguments;
	var self = this;
	setTimeout(function(){
		var ctrl = '';
		if (t.length > 0)
				for (var j =0; j < t.length; j++)
					ctrl += self.explode(t[j], 0);

		self.out(ctrl);
	}, 10);
};

Spry.Debugger.prototype.out = function(str, notype){
	if (typeof buffer == 'undefined')
		buffer = '';

	var t = this.textdiv;
	var self = this;

	if (t){
		if (!t.innerHTML)
			t.innerHTML = '';
		
		setTimeout(function(){
			if (buffer.length > 0){
				t.innerHTML += buffer;
				buffer = '';
			}
			if (typeof str == 'string'){
				var scrollSave = self.textdiv.scrollHeight;
				t.innerHTML += str + '<br class="clear" />';
				self.textdiv.scrollTop = scrollSave;
			}
		}, 0);

	}else{
		setTimeout(function(){self.out();}, 400);
		if (typeof str == 'string')
			buffer += str+'<br class="clear" />';
	}
};

Spry.Debugger.prototype.closeDebugWindow = function(e){
	var dw = this.debugdiv;

	if (this.textdiv.style.display == 'none'){
		this.textdiv.style.display = '';
		dw.style.height = '500px';
	}else{
		this.textdiv.style.display = 'none';
		dw.style.height = '14px';
	}
	return true;
};
Spry.Debugger.prototype.clearDebugWindow = function(e){
	this.textdiv.innerHTML = '';
	return true;
};
Spry.Debugger.prototype.maximDebugWindow = function(){
	var main = this.debugdiv;
	if (this.textdiv)
		this.textdiv.style.display = 'block';
	
	if (!main.className)
		main.className = '';		

	if (main.className.indexOf('maximized') == -1){
		this.left = main.style.left;
		main.className += 'maximized';
		main.style.left = '0';
		if (document.documentElement){
			main.style.height = document.documentElement.clientHeight;
			main.style.width = document.documentElement.clientWidth;
		}
	}else{
		main.className = main.className.replace(/maximized/i, '');
		main.style.left = this.left;
		main.style.height = '';
		main.style.width = '';
	}
	var layer = document.getElementById('debugIframe');
	if (layer){
		layer.style.top = main.style.top;
		layer.style.left = main.style.left;
		layer.style.height = main.offsetHeight;
		layer.style.width = main.offsetWidth;
	}
	return true;
};
Spry.Debugger.prototype.mousedownDebugWindow = function (e){
	e = e || event;
	var mainarea = this.debugdiv;
	if (!this.startDrag){
		this.startDrag = true;
		initialX = e.screenX;
		initialY = e.screenY;
		topX = mainarea.offsetLeft;
		topY = mainarea.offsetTop;
	}
	return false;
};

Spry.Debugger.prototype.mouseupDebugWindow = function (e){
	if (this.startDrag){
		if (Spry.is.ie)
			this.debugdiv.style.filter = 'alpha(opacity=100)';
		else
			this.debugdiv.style.opacity = 1;
		this.startDrag = false;
	}
	return false;
};

Spry.Debugger.prototype.mousemoveDebugWindow = function (e){
	e = e||event;
	if (this.startDrag){
		if (Spry.is.ie)
			this.debugdiv.style.filter = 'alpha(opacity=60)';
		else
			this.debugdiv.style.opacity = 0.6;
		var x = e.screenX - initialX;
		var y = e.screenY - initialY;
		this.debugdiv.style.left = (topX + x) + 'px';
		this.debugdiv.style.top = (topY + y) + 'px';
		var layer = document.getElementById('debugIframe');
		if (layer){
			layer.style.top = this.debugdiv.style.top;
			layer.style.left = this.debugdiv.style.left;
		}
	}
	return false;
};

////////////////////////////////////////////////////////////////
//
// Spry.Debugger.Utils
//
/////////////////////////////////////////////////////////////////

if (!Spry.Debugger.Utils) Spry.Debugger.Utils = {};
Spry.Debugger.Utils.camelize = function(stringToCamelize)
{
	if (stringToCamelize.indexOf('-') == -1){
		return stringToCamelize;	
	}
	var oStringList = stringToCamelize.split('-');
	var isFirstEntry = true;
	var camelizedString = '';

	for(var i=0; i < oStringList.length; i++)
	{
		if(oStringList[i].length>0)
		{
			if(isFirstEntry)
			{
				camelizedString = oStringList[i];
				isFirstEntry = false;
			}
			else
			{
				var s = oStringList[i];
				camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
			}
		}
	}

	return camelizedString;
};
Spry.Debugger.Utils.getStyleProp = function(element, prop)
{
	var value;
	try
	{
		if (element.style)
			value = element.style[Spry.Debugger.Utils.camelize(prop)];

		if (!value)
		{
			if (document.defaultView && document.defaultView.getComputedStyle)
			{
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(prop) : null;
			}
			else if (element.currentStyle) 
			{
					value = element.currentStyle[Spry.Debugger.Utils.camelize(prop)];
			}
		}
	}
	catch (e) {}

	return value == 'auto' ? null : value;
};
Spry.Debugger.Utils.getIntProp = function(element, prop){
	var a = parseInt(Spry.Debugger.Utils.getStyleProp(element, prop),10);
	if (isNaN(a))
		return 0;
	return a;
};
Spry.Debugger.Utils.getBorderBox = function (el, doc) {
	doc = doc || document;
	if (typeof(el) == 'string') {
		el = doc.getElementById(el);
	}

	if (!el) {
		return false;
	}

	if (el.parentNode === null || Spry.Debugger.Utils.getStyleProp(el, 'display') == 'none') {
		//element must be visible to have a box
		return false;
	}

	var ret = {x:0, y:0, width:0, height:0};
	var parent = null;
	var box;

	if (el.getBoundingClientRect) { // IE
		box = el.getBoundingClientRect();
		var scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
		var scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;
		ret.x = box.left + scrollLeft;
		ret.y = box.top + scrollTop;
		ret.width = box.right - box.left;
		ret.height = box.bottom - box.top;
	} else if (doc.getBoxObjectFor) { // gecko
		box = doc.getBoxObjectFor(el);
		ret.x = box.x;
		ret.y = box.y;
		ret.width = box.width;
		ret.height = box.height;
		var btw = Spry.Debugger.Utils.getIntProp(el, "border-top-width");
		var blw = Spry.Debugger.Utils.getIntProp(el, "border-left-width");
		ret.x -= blw;
		ret.y -= btw;
	} else { // safari/opera
		ret.x = el.offsetLeft;
		ret.y = el.offsetTop;
		ret.width = el.offsetWidth;
		ret.height = el.offsetHeight;
		parent = el.offsetParent;
		if (parent != el) {
			while (parent) {
				ret.x += parent.offsetLeft;
				ret.y += parent.offsetTop;
				parent = parent.offsetParent;
			}
		}
		var blw = Spry.Debugger.Utils.getIntProp(el, "border-left-width");
		var btw = Spry.Debugger.Utils.getIntProp(el, "border-top-width");
		ret.x -= blw;
		ret.y -= btw;
		// opera & (safari absolute) incorrectly account for body offsetTop
		if (Spry.is.opera || Spry.is.safari && Spry.Debugger.Utils.getStyleProp(el, 'position') == 'absolute')
			ret.y -= doc.body.offsetTop;
	}
	if (el.parentNode)
			parent = el.parentNode;
	else
		parent = null;
	if (parent.nodeName){
		var cas = parent.nodeName.toUpperCase();
		while (parent && cas != 'BODY' && cas != 'HTML') {
			cas = parent.nodeName.toUpperCase();
			ret.x -= parent.scrollLeft;
			ret.y -= parent.scrollTop;
			if (parent.parentNode)
				parent = parent.parentNode;
			else
				parent = null;
		}
	}
	// adjust the margin
	var gi = Spry.Debugger.Utils.getIntProp;
	var btw = gi(el, "margin-top");
	var blw = gi(el, "margin-left");
	var bbw = gi(el, "margin-bottom");
	var brw = gi(el, "margin-right");
	ret.x -= blw;
	ret.y -= btw;
	ret.height += btw + bbw;
	ret.width += blw + brw;
	return ret;
};
Spry.Debugger.Utils.removeEvListener = function(el, eventType, handler, capture){
	try{
		if (el.removeEventListener)
			el.removeEventListener(eventType, handler, capture);
		else if (el.detachEvent)
			el.detachEvent("on" + eventType, handler, capture);
	}catch (e) {}
};
Spry.Debugger.Utils.addEvListener = function(el, eventType, handler, capture){
	try{
		if (el.addEventListener)
			el.addEventListener(eventType, handler, capture);
		else if (el.attachEvent)
			el.attachEvent("on" + eventType, handler);
	}catch (e) {}
};
Spry.Debugger.Utils.stopEvent = function(e){
	try{
		if (e){
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;

			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		}
	}catch (e){}
};
Spry.Debugger.Utils.logXHRequest = function(req, m, url){
	if (req.readyState == 4){
		var uniqIdHeader = (new Date()).getTime() + '' + Math.random();
		var uniqIdContent = (new Date()).getTime() + '' + Math.random();
		var o = '<div class="urldump">' + m + ' ' + url + ' <a href="#" onclick="Spry.Debugger.Utils.makeVisible(\''+uniqIdHeader+'\', false); Spry.Debugger.Utils.makeVisible(\''+uniqIdContent+'\'); return false;">Content</a> | <a href="#" onclick="Spry.Debugger.Utils.makeVisible(\''+uniqIdContent+'\', false); Spry.Debugger.Utils.makeVisible(\''+uniqIdHeader+'\'); return false;"> Headers</a>';
		o += '<div><div class="contenturldump hidedump" id="'+uniqIdContent+'"><pre>' + req.responseText.replace(/</g, '&lt;') + '</pre></div></div>';
		var k = req.getAllResponseHeaders();
		o += '<div><div class="contenturldump hidedump" id="' + uniqIdHeader + '"><pre>' + k + '</pre></div></div>';
		debug.out(o);
	}
};

Spry.Debugger.Utils.makeVisible = function(el, visible){
	el = Spry.Debugger.Utils.getElement(el);
	if (typeof visible != 'undefined')
	{
		if (visible == 'block'){
			el.style.display = 'block';
		}else{
			el.style.display = 'none';	
		}
		return;
	}
  if (el.parentNode)
	{
		var l = el.parentNode.getElementsByTagName('div');
		var b = false;
		for (var i = 0; i < l.length; i++){
			if (l[i].className.match(/hidedump/)){
				b = l[i];
				break;
			}	
		}
		if (b){
			var tmp = b.style.display || Spry.Debugger.Utils.getStyleProp(b, 'display');
			if (tmp && tmp == 'block'){
				b.style.display =  'none';
				//b.innerHTML = b.innerHTML.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}else{
				//b.innerHTML = b.innerHTML.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
				b.style.display =  'block';
			}
		}
	}
};
Spry.Debugger.Utils.getElement = function(el){
	if (typeof el == 'string')
		return document.getElementById(el);
	return el;
};
if (typeof debug == 'undefined' || typeof debug.toString == 'undefined'){
	var debug = new Spry.Debugger();
	if (typeof console == 'undefined'){
		var console = debug;	
	}
};
;// Spry.Effect.js - version 0.38 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry;

if (!Spry) Spry = {};

Spry.forwards = 1; // const
Spry.backwards = 2; // const

if (!Spry.Effect) Spry.Effect = {};

Spry.Effect.Transitions = {
	linearTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + (time / duration) * change;
	},
	sinusoidalTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + ((-Math.cos((time/duration)*Math.PI)/2) + 0.5) * change;
	},
	squareTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + Math.pow(time/duration, 2) * change;
	},
	squarerootTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + Math.sqrt(time/duration) * change;
	},
	fifthTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + Math.sqrt((-Math.cos((time/duration)*Math.PI)/2) + 0.5) * change;
	},
	circleTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		var pos = time/duration;
		return begin + Math.sqrt(1 - Math.pow((pos-1), 2))* change;
	},
	pulsateTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		return begin + (0.5 + Math.sin(17*time/duration)/2) * change;
	},
	growSpecificTransition: function(time, begin, change, duration)
	{
		if (time > duration) return change+begin;
		var pos = time/duration;
		return begin + (5 * Math.pow(pos, 3) - 6.4 * Math.pow(pos, 2) + 2 * pos) * change;
	}
};
for (var trans in Spry.Effect.Transitions)
{
	Spry[trans] = Spry.Effect.Transitions[trans];
}
//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Registry
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Registry = function()
{
	this.effects = [];
};

Spry.Effect.Registry.prototype.getRegisteredEffect = function(element, options) 
{
	var a = {};
	a.element = Spry.Effect.getElement(element);
	a.options = options;

	for (var i=0; i<this.effects.length; i++)
		if (this.effectsAreTheSame(this.effects[i], a))
			return this.effects[i].effect;

	return false;
};

Spry.Effect.Registry.prototype.addEffect = function(effect, element, options)
{
	if (!this.getRegisteredEffect(element, options))
	{
		var len = this.effects.length;
		this.effects[len] = {};
		var eff = this.effects[len];
		eff.effect = effect;
		eff.element = Spry.Effect.getElement(element);
		eff.options = options;
	}
};

Spry.Effect.Registry.prototype.effectsAreTheSame = function(effectA, effectB)
{
	if (effectA.element != effectB.element)
		return false;

	var compare = Spry.Effect.Utils.optionsAreIdentical(effectA.options, effectB.options);
	// reset finish and setup functions
	if (compare)
	{
		if (typeof effectB.options.setup == 'function')
			effectA.options.setup = effectB.options.setup;

		if (typeof effectB.options.finish == 'function')
			effectA.options.finish = effectB.options.finish;
	}		

	return compare;
};

var SpryRegistry = new Spry.Effect.Registry;

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Effect.Utils) Spry.Effect.Utils = {};

Spry.Effect.Utils.showError = function(msg)
{
	alert('Spry.Effect ERR: ' + msg);
};
Spry.Effect.Utils.showInitError = function(effect){
	Spry.Effect.Utils.showError('The ' + effect + ' class can\'t be accessed as a static function anymore. '+ "\n" + 'Please read Spry Effects migration documentation.');
	return false;
};
Spry.Effect.Utils.Position = function()
{
	this.x = 0; // left
	this.y = 0; // top
	this.units = "px";
};

Spry.Effect.Utils.Rectangle = function()
{
	this.width = 0;
	this.height = 0;
	this.units = "px";
};

Spry.Effect.Utils.intToHex = function(integerNum) 
{
	var result = integerNum.toString(16);
	if (result.length == 1)
		result = "0" + result;
	return result;
};

Spry.Effect.Utils.hexToInt = function(hexStr)
{
	return parseInt(hexStr, 16);
};

Spry.Effect.Utils.rgb = function(redInt, greenInt, blueInt)
{
	var intToHex = Spry.Effect.Utils.intToHex;
	var redHex = intToHex(redInt);
	var greenHex = intToHex(greenInt);
	var blueHex = intToHex(blueInt);
	compositeColorHex = redHex.concat(greenHex, blueHex).toUpperCase();
	compositeColorHex = '#' + compositeColorHex;
	return compositeColorHex;
};

Spry.Effect.Utils.longColorVersion = function(color){
	if ( color.match(/^#[0-9a-f]{3}$/i) ){
		var tmp = color.split('');
		var color = '#';
		for (var i = 1; i < tmp.length; i++){
			color += tmp[i] + '' + tmp[i];	
		}
	}
	return color;
};

Spry.Effect.Utils.camelize = function(stringToCamelize)
{
	if (stringToCamelize.indexOf('-') == -1){
		return stringToCamelize;	
	}
	var oStringList = stringToCamelize.split('-');
	var isFirstEntry = true;
	var camelizedString = '';

	for(var i=0; i < oStringList.length; i++)
	{
		if(oStringList[i].length>0)
		{
			if(isFirstEntry)
			{
				camelizedString = oStringList[i];
				isFirstEntry = false;
			}
			else
			{
				var s = oStringList[i];
				camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
			}
		}
	}

	return camelizedString;
};

Spry.Effect.Utils.isPercentValue = function(value)
{
	var result = false;
	if (typeof value == 'string' && value.length > 0 && value.lastIndexOf("%") > 0)
		result = true;

	return result;
};

Spry.Effect.Utils.getPercentValue = function(value)
{
	var result = 0;
	try
	{
		result = Number(value.substring(0, value.lastIndexOf("%")));
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.Utils.getPercentValue: ' + e);}
	return result;
};

Spry.Effect.Utils.getPixelValue = function(value)
{
	var result = 0;
	if (typeof value == 'number') return value;
	var unitIndex = value.lastIndexOf("px");
	if ( unitIndex == -1)
		unitIndex = value.length;
	try
	{
		result = parseInt(value.substring(0, unitIndex), 10);
	}
	catch (e){}
	return result;
};

Spry.Effect.Utils.getFirstChildElement = function(node)
{
	if (node)
	{
		var childCurr = node.firstChild;
		while (childCurr)
		{
			if (childCurr.nodeType == 1) // Node.ELEMENT_NODE
				return childCurr;

			childCurr = childCurr.nextSibling;
		}
	}

	return null;
};

Spry.Effect.Utils.fetchChildImages = function(startEltIn, targetImagesOut)
{
	if(!startEltIn  || startEltIn.nodeType != 1 || !targetImagesOut)
		return;

	if(startEltIn.hasChildNodes())
	{
		var childImages = startEltIn.getElementsByTagName('img');
		var imageCnt = childImages.length;
		for(var i=0; i<imageCnt; i++)
		{
			var imgCurr = childImages[i];
			var dimensionsCurr = Spry.Effect.getDimensions(imgCurr);
			targetImagesOut.push([imgCurr,dimensionsCurr.width,dimensionsCurr.height]);
		}
	}
};

Spry.Effect.Utils.optionsAreIdentical = function(optionsA, optionsB)
{
	if(optionsA == null && optionsB == null)
		return true;

	if(optionsA != null && optionsB != null)
	{
		var objectCountA = 0;
		var objectCountB = 0;

		for (var propA in optionsA) objectCountA++;
		for (var propB in optionsB) objectCountB++;

		if(objectCountA != objectCountB)
			return false;

		for (var prop in optionsA)
		{
			var typeA = typeof optionsA[prop];
			var typeB = typeof optionsB[prop];
			if ( typeA != typeB || (typeA != 'undefined' && optionsA[prop] != optionsB[prop]))
				return false;
		}

		return true;
	}

	return false;
};

Spry.Effect.Utils.DoEffect = function (effectName, element, options)
{
	if (!options)
		var options = {};

	options.name = effectName;
	var ef = SpryRegistry.getRegisteredEffect(element, options);
	if (!ef)
	{
		ef = new Spry.Effect[effectName](element, options);
		SpryRegistry.addEffect(ef, element, options);
	}
	ef.start();
	return true;
};
//////////////////////////////////////////////////////////////////////
//
//  The notification class
//
//////////////////////////////////////////////////////////////////////
if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Utils.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
		if (this.observers[i] == observer) return;

	this.observers[len] = observer;
};

Spry.Utils.Notifier.prototype.removeObserver = function(observer)
{
	if (!observer)
		return;

	for (var i = 0; i < this.observers.length; i++)
	{
		if (this.observers[i] == observer)
		{
			this.observers.splice(i, 1);
			break;
		}
	}
};

Spry.Utils.Notifier.prototype.notifyObservers = function(methodName, data)
{
	if (!methodName)
		return;

	if (!this.suppressNotifications)
	{
		var len = this.observers.length;
		for (var i = 0; i < len; i++)
		{
			var obs = this.observers[i];
			if (obs)
			{
				if (typeof obs == "function")
					obs(methodName, this, data);
				else if (obs[methodName])
					obs[methodName](this, data);
			}
		}
	}
};

Spry.Utils.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Effect.Utils.showError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Utils.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};

//////////////////////////////////////////////////////////////////////
//
// DHTML manipulation
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.getElement = function(ele)
{
	var element = ele;
	if (typeof ele == "string")
		element = document.getElementById(ele);

	if (element == null) 
		Spry.Effect.Utils.showError('Element "' + ele + '" not found.');
	
	return element;
};

Spry.Effect.getStyleProp = function(element, prop)
{
	var value;
	var camelized = Spry.Effect.Utils.camelize(prop);
	try
	{
		if (element.style)
			value = element.style[camelized];

		if (!value)
		{
			if (document.defaultView && document.defaultView.getComputedStyle)
			{
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(prop) : null;
			}
			else if (element.currentStyle) 
			{
					value = element.currentStyle[camelized];
			}
		}
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.getStyleProp: ' + e);}

	return value == 'auto' ? null : value;
};

Spry.Effect.setStyleProp = function(element, prop, value)
{
	try
	{
		element.style[Spry.Effect.Utils.camelize(prop)] = value;
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.setStyleProp: ' + e);}
};

Spry.Effect.getStylePropRegardlessOfDisplayState = function(element, prop, displayElement)
{
	var refElement = displayElement ? displayElement : element;
	var displayOrig = Spry.Effect.getStyleProp(refElement, 'display');
	var visibilityOrig = Spry.Effect.getStyleProp(refElement, 'visibility');

	if(displayOrig == 'none')
	{
		Spry.Effect.setStyleProp(refElement, 'visibility', 'hidden');
		Spry.Effect.setStyleProp(refElement, 'display', 'block');

		if(window.opera) // opera needs focus to calculate the size for hidden elements
			refElement.focus();
	}

	var styleProp = Spry.Effect.getStyleProp(element, prop);

	if(displayOrig == 'none') // reset the original values
	{
		Spry.Effect.setStyleProp(refElement, 'display', 'none');
		Spry.Effect.setStyleProp(refElement, 'visibility', visibilityOrig);
	}
	return styleProp;
};

Spry.Effect.makePositioned = function(element)
{
	var pos = Spry.Effect.getStyleProp(element, 'position');
	if (!pos || pos == 'static')
	{
		element.style.position = 'relative';

		// Opera returns the offset relative to the positioning context, when an
		// element is position relative but top and left have not been defined
		if (window.opera)
		{
			element.style.top = 0;
			element.style.left = 0;
		}
	}
};

Spry.Effect.isInvisible = function(element)
{
	var propDisplay = Spry.Effect.getStyleProp(element, 'display');
	if (propDisplay && propDisplay.toLowerCase() == 'none')
		return true;

	var propVisible = Spry.Effect.getStyleProp(element, 'visibility');
	if (propVisible && propVisible.toLowerCase() == 'hidden')
		return true;

	return false;
};

Spry.Effect.enforceVisible = function(element)
{
	var propDisplay = Spry.Effect.getStyleProp(element, 'display');
	if (propDisplay && propDisplay.toLowerCase() == 'none')
		Spry.Effect.setStyleProp(element, 'display', 'block');

	var propVisible = Spry.Effect.getStyleProp(element, 'visibility');
	if (propVisible && propVisible.toLowerCase() == 'hidden')
		Spry.Effect.setStyleProp(element, 'visibility', 'visible');
};

Spry.Effect.makeClipping = function(element)
{
	var overflow = Spry.Effect.getStyleProp(element, 'overflow');
	if (!overflow || (overflow.toLowerCase() != 'hidden' && overflow.toLowerCase() != 'scroll'))
	{
		// IE 7 bug: set overflow property to hidden changes the element height to 0
		// -> therefore we save the height before changing the overflow property and set the old size back
		var heightCache = 0;
		var needsCache = /MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent);
		if(needsCache)
			heightCache = Spry.Effect.getDimensionsRegardlessOfDisplayState(element).height;

		Spry.Effect.setStyleProp(element, 'overflow', 'hidden');

		if(needsCache)
			Spry.Effect.setStyleProp(element, 'height', heightCache+'px');
	}
};

Spry.Effect.cleanWhitespace = function(element) 
{
	var childCountInit = element.childNodes.length;
  for (var i = childCountInit - 1; i >= 0; i--) {
  	var node = element.childNodes[i];
		if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
			try
			{
				element.removeChild(node);
			}
			catch (e) {Spry.Effect.Utils.showError('Spry.Effect.cleanWhitespace: ' + e);}
	}
};

Spry.Effect.getComputedStyle = function(element)
{
	return /MSIE/.test(navigator.userAgent) ? element.currentStyle : document.defaultView.getComputedStyle(element, null);
};

Spry.Effect.getDimensions = function(element)
{
	var dimensions = new Spry.Effect.Utils.Rectangle;
	var computedStyle = null;

	if (element.style.width && /px/i.test(element.style.width))
		dimensions.width = parseInt(element.style.width, 10); // without padding
	else
	{
		computedStyle = Spry.Effect.getComputedStyle(element);
		var tryComputedStyle = computedStyle && computedStyle.width && /px/i.test(computedStyle.width);

		if (tryComputedStyle)
			dimensions.width = parseInt(computedStyle.width, 10); // without padding, includes css

		if (!tryComputedStyle || dimensions.width == 0) // otherwise we might run into problems on safari and opera (mac only)
			dimensions.width = element.offsetWidth;   // includes padding
	}

	if (element.style.height && /px/i.test(element.style.height))
		dimensions.height = parseInt(element.style.height, 10); // without padding
	else
	{
		if (!computedStyle)
			computedStyle = Spry.Effect.getComputedStyle(element);

		var tryComputedStyle = computedStyle && computedStyle.height && /px/i.test(computedStyle.height);

		if (tryComputedStyle)
			dimensions.height = parseInt(computedStyle.height, 10); // without padding, includes css

		if(!tryComputedStyle || dimensions.height == 0) // otherwise we might run into problems on safari and opera (mac only)
			dimensions.height = element.offsetHeight;   // includes padding
	}
	return dimensions;
};

Spry.Effect.getDimensionsRegardlessOfDisplayState = function(element, displayElement)
{
	// If the displayElement display property is set to 'none', we temporarily set its
	// visibility state to 'hidden' to be able to calculate the dimension.

	var refElement = displayElement ? displayElement : element;
	var displayOrig = Spry.Effect.getStyleProp(refElement, 'display');
	var visibilityOrig = Spry.Effect.getStyleProp(refElement, 'visibility');

	if(displayOrig == 'none')
	{
		Spry.Effect.setStyleProp(refElement, 'visibility', 'hidden');
		Spry.Effect.setStyleProp(refElement, 'display', 'block');

		if(window.opera) // opera needs focus to calculate the size for hidden elements
			refElement.focus();
	}

	var dimensions = Spry.Effect.getDimensions(element);

	if(displayOrig == 'none') // reset the original values
	{
		Spry.Effect.setStyleProp(refElement, 'display', 'none');
		Spry.Effect.setStyleProp(refElement, 'visibility', visibilityOrig);
	}
	return dimensions;
};

Spry.Effect.getOpacity = function(element)
{
  var o = Spry.Effect.getStyleProp(element, "opacity");
  if (typeof o == 'undefined' || o == null)
    o = 1.0;
  return o;
};

Spry.Effect.getBgColor = function(ele)
{
  return Spry.Effect.getStyleProp(ele, "background-color");
};

Spry.Effect.intPropStyle = function(e, prop){
		var i = parseInt(Spry.Effect.getStyleProp(e, prop), 10);
		if (isNaN(i))
			return 0;
		return i;
};

Spry.Effect.getPosition = function(element)
{
	var position = new Spry.Effect.Utils.Position;
	var computedStyle = null;

	if (element.style.left  && /px/i.test(element.style.left))
		position.x = parseInt(element.style.left, 10); // without padding
	else
	{
		computedStyle = Spry.Effect.getComputedStyle(element);
		var tryComputedStyle = computedStyle && computedStyle.left && /px/i.test(computedStyle.left);

		if (tryComputedStyle)
			position.x = parseInt(computedStyle.left, 10); // without padding, includes css

		if(!tryComputedStyle || position.x == 0) // otherwise we might run into problems on safari and opera (mac only)
			position.x = element.offsetLeft;   // includes padding
	}

	if (element.style.top && /px/i.test(element.style.top))
		position.y = parseInt(element.style.top, 10); // without padding
	else
	{
		if (!computedStyle)
			computedStyle = Spry.Effect.getComputedStyle(element);

    var tryComputedStyle = computedStyle && computedStyle.top && /px/i.test(computedStyle.top);

		if (tryComputedStyle)
			position.y = parseInt(computedStyle.top, 10); // without padding, includes css

		if(!tryComputedStyle || position.y == 0) // otherwise we might run into problems on safari and opera (mac only)
			position.y = element.offsetTop;   // includes padding
	}
	return position;
};

Spry.Effect.getOffsetPosition = Spry.Effect.getPosition; // deprecated

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Animator
// (base class)
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Animator = function(options)
{
	Spry.Utils.Notifier.call(this);
	
	this.name = 'Animator';
	this.element = null;
	this.startMilliseconds = 0;
	this.repeat = 'none';
	this.isRunning = false;
	this.timer = null;
	this.cancelRemaining = 0;

	if (!options)
		var options = {};

	if (options.toggle)
		this.direction = false;
	else
		this.direction = Spry.forwards;
	
	var self = this;
	if (options.setup != null)
		this.addObserver({onPreEffect: function(){try{self.options.setup(self.element, self);}catch(e){Spry.Effect.Utils.showError('Spry.Effect.Animator.prototype.start: setup callback: ' + e);}}});

	if (options.finish != null)
		this.addObserver({onPostEffect: function(){try{self.options.finish(self.element, self);}catch(e){Spry.Effect.Utils.showError('Spry.Effect.Animator.prototype.stop: finish callback: ' + e);}}});

	this.options = {
		duration: 1000,
		toggle: false,
		transition: Spry.linearTransition,
		interval: 16 // ca. 62 fps
	};

	this.setOptions(options);
	if (options.transition)
		this.setTransition(options.transition);

	if (options.fps)
		this.setFps(options.fps);
};
Spry.Effect.Animator.prototype = new Spry.Utils.Notifier();
Spry.Effect.Animator.prototype.constructor = Spry.Utils.Animator;

Spry.Effect.Animator.prototype.notStaticAnimator = true;

Spry.Effect.Animator.prototype.setOptions = function(options)
{
	if (!options)
		return;
	for (var prop in options)
		this.options[prop] = options[prop];
};
Spry.Effect.Animator.prototype.setTransition = function(transition){
	if (typeof transition == 'number' || transition == "1" || transition == "2")
		switch (parseInt(transition,10))
		{
			case 1: transition = Spry.linearTransition; break;
			case 2: transition = Spry.sinusoidalTransition; break;
			default: Spry.Effect.Utils.showError('unknown transition');
		}

	else if (typeof transition == 'string')
	{
		if (typeof window[transition] == 'function')
			transition = window[transition];
		else if (typeof Spry[transition] == 'function')
			transition = Spry[transition];
		else
			Spry.Effect.Utils.showError('unknown transition');
	}

	this.options.transition = transition;
	if (typeof this.effectsArray != 'undefined'){
		var l = this.effectsArray.length;
		for (var i = 0; i < l; i++)
				this.effectsArray[i].effect.setTransition(transition);
	}
};

Spry.Effect.Animator.prototype.setDuration = function(duration){
	this.options.duration = duration;
	if (typeof this.effectsArray != 'undefined')
	{
		var l = this.effectsArray.length;
		for (var i = 0; i < l; i++)
		{
			this.effectsArray[i].effect.setDuration(duration);
		}
	}
};

Spry.Effect.Animator.prototype.setFps = function(fps){
	this.options.interval = parseInt(1000 / fps, 10);
	this.options.fps = fps;
	if (typeof this.effectsArray != 'undefined')
	{
		var l = this.effectsArray.length;
		for (var i = 0; i < l; i++)
		{
			this.effectsArray[i].effect.setFps(fps);
		}
	}
};

Spry.Effect.Animator.prototype.start = function(withoutTimer)
{
	if (!this.element)
		return;

	if (arguments.length == 0)
		withoutTimer = false;

	if (this.isRunning)
		this.cancel();

	this.prepareStart();
	var currDate = new Date();
	this.startMilliseconds = currDate.getTime();

	if (this.element.id)
		this.element = document.getElementById(this.element.id);

	if (this.cancelRemaining != 0 && this.options.toggle)
	{
		if (this.cancelRemaining < 1 && typeof this.options.transition == 'function')
		{
			var startTime = 0;
			var stopTime = this.options.duration;
			var start = 0;
			var stop = 1;
			var emergency = 0;
			this.cancelRemaining = Math.round(this.cancelRemaining * 1000) / 1000;
			var found = false;
			var middle = 0;
			while (!found)
			{
				if (emergency++ > this.options.duration) break;
				var half = startTime + ((stopTime - startTime) / 2);
				middle = Math.round(this.options.transition(half, 1, -1, this.options.duration) * 1000) / 1000;
				if (middle == this.cancelRemaining)
				{
					this.startMilliseconds -= half;
					found = true;
				}
				if (middle < this.cancelRemaining)
				{
					stopTime = half;
					stop = middle;
				}
				else
				{
					startTime = half;
					start = middle;
				}
			}
		}
		this.cancelRemaining = 0;
	}
	this.notifyObservers('onPreEffect', this);

	if (withoutTimer == false)
	{
		var self = this;
		this.timer = setInterval(function() { self.drawEffect(); }, this.options.interval);
	}
	this.isRunning = true;
};
Spry.Effect.Animator.prototype.stopFlagReset = function()
{
	if (this.timer)
	{
		clearInterval(this.timer);
		this.timer = null;
	}
	this.startMilliseconds = 0;
};
Spry.Effect.Animator.prototype.stop = function()
{
	this.stopFlagReset();
	this.notifyObservers('onPostEffect', this);
	this.isRunning = false;
};

Spry.Effect.Animator.prototype.cancel = function()
{
	var elapsed = this.getElapsedMilliseconds();
	if (this.startMilliseconds > 0 && elapsed < this.options.duration)
		this.cancelRemaining = this.options.transition(elapsed, 0, 1, this.options.duration);

	this.stopFlagReset();
	this.notifyObservers('onCancel', this);
	this.isRunning = false;
};

Spry.Effect.Animator.prototype.drawEffect = function()
{
	var isRunning = true;

	this.notifyObservers('onStep', this);
	var timeElapsed = this.getElapsedMilliseconds();

	if (typeof this.options.transition != 'function'){
		Spry.Effect.Utils.showError('unknown transition');
		return;
	}
	this.animate();

	if (timeElapsed > this.options.duration)
	{
		isRunning = false;
		this.stop();
	}
	return isRunning;
};

Spry.Effect.Animator.prototype.getElapsedMilliseconds = function()
{
	if (this.startMilliseconds > 0)
	{
		var currDate = new Date();
		return (currDate.getTime() - this.startMilliseconds);
	}
	return 0;
};

Spry.Effect.Animator.prototype.doToggle = function()
{
	if (!this.direction)
	{
		this.direction = Spry.forwards;
		return;
	}
	if (this.options.toggle == true)
	{
		if (this.direction == Spry.forwards)
		{
			this.direction = Spry.backwards;
			this.notifyObservers('onToggle', this);
		} 
		else if (this.direction == Spry.backwards)
		{
			this.direction = Spry.forwards;
		}
	}
};

Spry.Effect.Animator.prototype.prepareStart = function()
{
		if (this.options && this.options.toggle)
			this.doToggle();
};

Spry.Effect.Animator.prototype.animate = function(){};
Spry.Effect.Animator.prototype.onStep = function(el)
{
	if (el != this)
		this.notifyObservers('onStep', this);
};
//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Move
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Move = function(element, fromPos, toPos, options)
{
	this.dynamicFromPos = false;
	if (arguments.length == 3)
	{
		options = toPos;
		toPos = fromPos;
		fromPos = Spry.Effect.getPosition(element);
		this.dynamicFromPos = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Move';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

	if (fromPos.units != toPos.units)
		Spry.Effect.Utils.showError('Spry.Effect.Move: Conflicting units (' + fromPos.units + ', ' + toPos.units + ')');

	this.units = fromPos.units;
	this.startX = Number(fromPos.x);
	this.stopX = Number(toPos.x);
	this.startY = Number(fromPos.y);
	this.stopY = Number(toPos.y);
};

Spry.Effect.Move.prototype = new Spry.Effect.Animator();
Spry.Effect.Move.prototype.constructor = Spry.Effect.Move;

Spry.Effect.Move.prototype.animate = function()
{
	var left = 0;
	var top = 0;
	var floor = Math.floor;
	var elapsed = this.getElapsedMilliseconds();
	if (this.direction == Spry.forwards)
	{
		left = floor(this.options.transition(elapsed, this.startX, this.stopX - this.startX, this.options.duration));
		top = floor(this.options.transition(elapsed, this.startY, this.stopY - this.startY, this.options.duration));
	}
	else if (this.direction == Spry.backwards)
	{
		left = floor(this.options.transition(elapsed, this.stopX, this.startX - this.stopX, this.options.duration));
		top = floor(this.options.transition(elapsed, this.stopY, this.startY - this.stopY, this.options.duration));
	}

	this.element.style.left = left + this.units;
	this.element.style.top = top + this.units;
};

Spry.Effect.Move.prototype.prepareStart = function()
{
	if (this.options && this.options.toggle)
		this.doToggle();

	if (this.dynamicFromPos == true)
	{
		var fromPos = Spry.Effect.getPosition(this.element);
		this.startX = fromPos.x;
		this.startY = fromPos.y;
		
		this.rangeMoveX = this.startX - this.stopX;
		this.rangeMoveY= this.startY - this.stopY;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Size
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Size = function(element, fromRect, toRect, options)
{
	this.dynamicFromRect = false;

	if (arguments.length == 3)
	{
		options = toRect;
		toRect = fromRect;
		fromRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.dynamicFromRect = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Size';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

	element = this.element;

	if (fromRect.units != toRect.units)
	{
		Spry.Effect.Utils.showError('Spry.Effect.Size: Conflicting units (' + fromRect.units + ', ' + toRect.units + ')');
		return false;
	}

	this.units = fromRect.units;

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	this.originalWidth = originalRect.width;
	this.originalHeight = originalRect.height;

	this.startWidth = fromRect.width;
	this.startHeight = fromRect.height;
	this.stopWidth = toRect.width;
	this.stopHeight = toRect.height;
	this.childImages = new Array();

	if (this.options.useCSSBox){
		Spry.Effect.makePositioned(this.element);
		var intProp = Spry.Effect.intPropStyle;
		this.startFromBorder_top = intProp(element, 'border-top-width');
		this.startFromBorder_bottom = intProp(element, 'border-bottom-width');
		this.startFromBorder_left = intProp(element, 'border-left-width');
		this.startFromBorder_right = intProp(element, 'border-right-width');
		this.startFromPadding_top = intProp(element, 'padding-top');
		this.startFromPadding_bottom = intProp(element, 'padding-bottom');
		this.startFromPadding_left = intProp(element, 'padding-left');
		this.startFromPadding_right = intProp(element, 'padding-right');
		this.startFromMargin_top = intProp(element, 'margin-top');
		this.startFromMargin_bottom = intProp(element, 'margin-bottom');
		this.startFromMargin_right = intProp(element, 'margin-right');
		this.startFromMargin_left = intProp(element, 'margin-left');
		this.startLeft = intProp(element, 'left');
		this.startTop = intProp(element, 'top');
	}

	if(this.options.scaleContent)
		Spry.Effect.Utils.fetchChildImages(element, this.childImages);

	this.fontFactor = 1.0;
	var fontSize = Spry.Effect.getStyleProp(this.element, 'font-size');
	if(fontSize && /em\s*$/.test(fontSize))
		this.fontFactor = parseFloat(fontSize);

	var isPercent = Spry.Effect.Utils.isPercentValue;

	if (isPercent(this.startWidth))
	{
		var startWidthPercent = Spry.Effect.Utils.getPercentValue(this.startWidth);
		this.startWidth = originalRect.width * (startWidthPercent / 100);
	}

	if (isPercent(this.startHeight))
	{
		var startHeightPercent = Spry.Effect.Utils.getPercentValue(this.startHeight);
		this.startHeight = originalRect.height * (startHeightPercent / 100);
	}

	if (isPercent(this.stopWidth))
	{
		var stopWidthPercent = Spry.Effect.Utils.getPercentValue(this.stopWidth);
		this.stopWidth = originalRect.width * (stopWidthPercent / 100);
	}

	if (isPercent(this.stopHeight))
	{
		var stopHeightPercent = Spry.Effect.Utils.getPercentValue(this.stopHeight);
		this.stopHeight = originalRect.height * (stopHeightPercent / 100);
	}

	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Size.prototype = new Spry.Effect.Animator();
Spry.Effect.Size.prototype.constructor = Spry.Effect.Size;

Spry.Effect.Size.prototype.animate = function()
{
	var width = 0;
	var height = 0;
	var fontSize = 0;
	var direction = 0;
	var floor = Math.floor;
	var elapsed = this.getElapsedMilliseconds();

	if (this.direction == Spry.forwards) {
		width = floor(this.options.transition(elapsed, this.startWidth, this.stopWidth - this.startWidth, this.options.duration));
		height = floor(this.options.transition(elapsed, this.startHeight, this.stopHeight - this.startHeight, this.options.duration));
		direction = 1;
	} else if (this.direction == Spry.backwards) {
		width = floor(this.options.transition(elapsed, this.stopWidth, this.startWidth - this.stopWidth, this.options.duration));
		height = floor(this.options.transition(elapsed, this.stopHeight, this.startHeight - this.stopHeight, this.options.duration));
		direction = -1;
	}

	var propFactor = width/this.originalWidth;
	fontSize = this.fontFactor * propFactor;

	var elStyle = this.element.style;
	if (width < 0)
		width = 0;
	
	if (height < 0)
		height = 0;

	elStyle.width = width + this.units;
	elStyle.height = height + this.units;

	if (typeof this.options.useCSSBox != 'undefined' && this.options.useCSSBox == true)
	{
		var intProp = Spry.Effect.intPropStyle;
		var origTop = intProp(this.element, 'top');
		var origLeft = intProp(this.element, 'left');
		var origMarginTop = intProp(this.element, 'margin-top');
		var origMarginLeft = intProp(this.element, 'margin-left');

		var widthFactor = propFactor;
		var heightFactor = height / this.originalHeight;
		var border_top = floor(this.startFromBorder_top * heightFactor);
		var border_bottom = floor(this.startFromBorder_bottom * heightFactor);
		var border_left = floor(this.startFromBorder_left * widthFactor);
		var border_right = floor(this.startFromBorder_right * widthFactor);
		var padding_top = floor(this.startFromPadding_top * heightFactor);
		var padding_bottom = floor(this.startFromPadding_bottom * heightFactor);
		var padding_left = floor(this.startFromPadding_left * widthFactor);
		var padding_right = floor(this.startFromPadding_right * widthFactor);
		var margin_top = floor(this.startFromMargin_top * heightFactor);
		var margin_bottom = floor(this.startFromMargin_bottom * heightFactor);
		var margin_right = floor(this.startFromMargin_right * widthFactor);
		var margin_left = floor(this.startFromMargin_left * widthFactor);

		elStyle.borderTopWidth = border_top + this.units;
		elStyle.borderBottomWidth = border_bottom + this.units;
		elStyle.borderLeftWidth = border_left + this.units;
		elStyle.borderRightWidth = border_right + this.units;
		elStyle.paddingTop = padding_top + this.units;
		elStyle.paddingBottom = padding_bottom + this.units;
		elStyle.paddingLeft = padding_left + this.units;
		elStyle.paddingRight = padding_right + this.units;
		elStyle.marginTop  = margin_top + this.units;
		elStyle.marginBottom = margin_bottom + this.units;
		elStyle.marginLeft = margin_left + this.units;
		elStyle.marginRight = margin_right + this.units;

		// compensate the margin shrinking
		elStyle.left = floor(origLeft + origMarginLeft - margin_left) + this.units;
		elStyle.top = floor(origTop + origMarginTop - margin_top) + this.units;
	}

	if (this.options.scaleContent)
	{

		for(var i=0; i < this.childImages.length; i++)
		{
			this.childImages[i][0].style.width = propFactor * this.childImages[i][1] + this.units;
			this.childImages[i][0].style.height = propFactor * this.childImages[i][2] + this.units;
		}
		this.element.style.fontSize = fontSize + 'em';
	}

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Size.prototype.prepareStart = function()
{
	if (this.options && this.options.toggle)
		this.doToggle();	

	if (this.dynamicFromRect == true)
	{
		var fromRect = Spry.Effect.getDimensions(this.element);
		this.startWidth = fromRect.width;
		this.startHeight = fromRect.height;

		this.widthRange = this.startWidth - this.stopWidth;
		this.heightRange = this.startHeight - this.stopHeight;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Opacity = function(element, startOpacity, stopOpacity, options)
{
	this.dynamicStartOpacity = false;
	if (arguments.length == 3)
	{
		options = stopOpacity;
		stopOpacity = startOpacity;
		startOpacity = Spry.Effect.getOpacity(element);
		this.dynamicStartOpacity = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Opacity';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

 	// make this work on IE on elements without 'layout'
	if(/MSIE/.test(navigator.userAgent) && (!this.element.hasLayout))
		Spry.Effect.setStyleProp(this.element, 'zoom', '1');

	this.startOpacity = startOpacity;
	this.stopOpacity = stopOpacity;
	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Opacity.prototype = new Spry.Effect.Animator();
Spry.Effect.Opacity.prototype.constructor = Spry.Effect.Opacity;

Spry.Effect.Opacity.prototype.animate = function()
{
	var opacity = 0;
	var elapsed = this.getElapsedMilliseconds();
	if (this.direction == Spry.forwards) 
		opacity = this.options.transition(elapsed, this.startOpacity, this.stopOpacity - this.startOpacity, this.options.duration);
	else if (this.direction == Spry.backwards) 
		opacity = this.options.transition(elapsed, this.stopOpacity, this.startOpacity - this.stopOpacity, this.options.duration);

	if (opacity < 0)
		opacity = 0;

	if(/MSIE/.test(navigator.userAgent))
	{
		var tmpval = Spry.Effect.getStyleProp(this.element,'filter');
		if (tmpval){
			tmpval = tmpval.replace(/alpha\(opacity=[0-9]{1,3}\)/g, '');
		}
		this.element.style.filter = tmpval + "alpha(opacity=" + Math.floor(opacity * 100) + ")";
	}
	else
		this.element.style.opacity = opacity;

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Opacity.prototype.prepareStart = function()
{
	if (this.options && this.options.toggle)
		this.doToggle();	

	if (this.dynamicStartOpacity == true)
	{
		this.startOpacity = Spry.Effect.getOpacity(this.element);
		this.opacityRange = this.startOpacity - this.stopOpacity;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Color
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Color = function(element, startColor, stopColor, options)
{
	this.dynamicStartColor = false;
	if (arguments.length == 3)
	{
		options = stopColor;
		stopColor = startColor;
		startColor = Spry.Effect.getBgColor(element);
		this.dynamicStartColor = true;
	}
	
	Spry.Effect.Animator.call(this, options);

	this.name = 'Color';
	this.element = Spry.Effect.getElement(element);
	if (!this.element)
		return;

	this.startColor = startColor;
	this.stopColor = stopColor;
	this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
	this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
	this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
	this.stopRedColor = Spry.Effect.Utils.hexToInt(stopColor.substr(1,2));
	this.stopGreenColor = Spry.Effect.Utils.hexToInt(stopColor.substr(3,2));
	this.stopBlueColor = Spry.Effect.Utils.hexToInt(stopColor.substr(5,2));
};

Spry.Effect.Color.prototype = new Spry.Effect.Animator();
Spry.Effect.Color.prototype.constructor = Spry.Effect.Color;

Spry.Effect.Color.prototype.animate = function()
{
	var redColor = 0;
	var greenColor = 0;
	var blueColor = 0;
	var floor = Math.floor;
	var elapsed = this.getElapsedMilliseconds();

	if (this.direction == Spry.forwards)
	{
		redColor = floor(this.options.transition(elapsed, this.startRedColor, this.stopRedColor - this.startRedColor, this.options.duration));
		greenColor = floor(this.options.transition(elapsed, this.startGreenColor, this.stopGreenColor - this.startGreenColor, this.options.duration));
		blueColor = floor(this.options.transition(elapsed, this.startBlueColor, this.stopBlueColor - this.startBlueColor, this.options.duration));
	}
	else if (this.direction == Spry.backwards)
	{
		redColor = floor(this.options.transition(elapsed, this.stopRedColor, this.startRedColor - this.stopRedColor, this.options.duration));
		greenColor = floor(this.options.transition(elapsed, this.stopGreenColor, this.startGreenColor - this.stopGreenColor, this.options.duration));
		blueColor = floor(this.options.transition(elapsed, this.stopBlueColor, this.startBlueColor - this.stopBlueColor, this.options.duration));
	}

	this.element.style.backgroundColor = Spry.Effect.Utils.rgb(redColor, greenColor, blueColor);
};

Spry.Effect.Color.prototype.prepareStart = function() 
{
	if (this.options && this.options.toggle)
		this.doToggle();

	if (this.dynamicStartColor == true)
	{
		this.startColor = Spry.Effect.getBgColor(element);
		this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
		this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
		this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
		this.redColorRange = this.startRedColor - this.stopRedColor;
		this.greenColorRange = this.startGreenColor - this.stopGreenColor;
		this.blueColorRange = this.startBlueColor - this.stopBlueColor;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Cluster
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Cluster = function(options)
{
	Spry.Effect.Animator.call(this, options);

	this.name = 'Cluster';
	this.effectsArray = new Array();
	this.currIdx = -1;
	var _ClusteredEffect = function(effect, kind)
	{
		this.effect = effect;
		this.kind = kind; // "parallel" or "queue"
		this.isRunning = false;
	};

	this.ClusteredEffect = _ClusteredEffect;
};

Spry.Effect.Cluster.prototype = new Spry.Effect.Animator();
Spry.Effect.Cluster.prototype.constructor = Spry.Effect.Cluster;

Spry.Effect.Cluster.prototype.setInterval = function(interval){
	var l = this.effectsArray.length;
	this.options.interval = interval;
	for (var i = 0; i < l; i++)
	{
		this.effectsArray[i].effect.setInterval(interval);
	}
};
Spry.Effect.Cluster.prototype.drawEffect = function()
{
	var isRunning = true;
	var allEffectsDidRun = false;
	var baseEffectIsStillRunning = false;
	var evalNextEffectsRunning = false;

	if ((this.currIdx == -1 && this.direction == Spry.forwards) || (this.currIdx == this.effectsArray.length && this.direction == Spry.backwards))
		this.initNextEffectsRunning();

	var start = this.direction == Spry.forwards ? 0 : this.effectsArray.length-1;
	var stop = this.direction == Spry.forwards ? this.effectsArray.length : -1;
	var step = this.direction == Spry.forwards ? 1 : -1;
	for (var i = start; i != stop; i+=step)
	{
		if (this.effectsArray[i].isRunning == true)
		{
			baseEffectIsStillRunning = this.effectsArray[i].effect.drawEffect();
			if (baseEffectIsStillRunning == false && i == this.currIdx)
			{
				this.effectsArray[i].isRunning = false;
				evalNextEffectsRunning = true;
			}
		}
	}

	if (evalNextEffectsRunning == true)
		allEffectsDidRun = this.initNextEffectsRunning();

	if (allEffectsDidRun == true) {
		this.stop();
		isRunning = false;
		for (var i = 0; i < this.effectsArray.length; i++)
			this.effectsArray[i].isRunning = false;

		this.currIdx = this.direction == Spry.forwards ? this.effectsArray.length: -1;
	}
	return isRunning;
};

Spry.Effect.Cluster.prototype.initNextEffectsRunning = function()
{
	var allEffectsDidRun = false;
	var step = this.direction == Spry.forwards ? 1 : -1;
	var stop = this.direction == Spry.forwards ? this.effectsArray.length : -1;
	this.currIdx+=step;
	if ( (this.currIdx > (this.effectsArray.length - 1) && this.direction == Spry.forwards) || (this.currIdx < 0 && this.direction == Spry.backwards))
		allEffectsDidRun = true;
	else
		for (var i = this.currIdx; i != stop; i+=step)
		{
			if ((i > this.currIdx && this.direction == Spry.forwards || i < this.currIdx && this.direction == Spry.backwards) && this.effectsArray[i].kind == "queue")
				break;
			this.effectsArray[i].effect.start(true);
			this.effectsArray[i].isRunning = true;
			this.currIdx = i;
		}

	return allEffectsDidRun;
};

Spry.Effect.Cluster.prototype.toggleCluster = function()
{
	if (!this.direction)
	{
		this.direction = Spry.forwards;
		return;
	}

	if (this.options.toggle == true)
	{
		if (this.direction == Spry.forwards)
		{
			this.direction = Spry.backwards;
			this.notifyObservers('onToggle', this);
			this.currIdx = this.effectsArray.length;
		}
		else if (this.direction == Spry.backwards)
		{
			this.direction = Spry.forwards;
			this.currIdx = -1;
		}
	}
	else
	{
		if (this.direction == Spry.forwards)
			this.currIdx = -1;
		else if (this.direction == Spry.backwards)
			this.currIdx = this.effectsArray.length;
	}
};

Spry.Effect.Cluster.prototype.doToggle = function()
{
	this.toggleCluster();

	// toggle all effects of the cluster, too
	for (var i = 0; i < this.effectsArray.length; i++)
	{
		if (this.effectsArray[i].effect.options && (this.effectsArray[i].effect.options.toggle != null))
			if (this.effectsArray[i].effect.options.toggle == true)
				this.effectsArray[i].effect.doToggle();
	}
};

Spry.Effect.Cluster.prototype.cancel = function()
{
	for (var i = 0; i < this.effectsArray.length; i++)
		if (this.effectsArray[i].effect.isRunning)
			this.effectsArray[i].effect.cancel();
	
	var elapsed = this.getElapsedMilliseconds();
	if (this.startMilliseconds > 0 && elapsed < this.options.duration)
		this.cancelRemaining = this.options.transition(elapsed, 0, 1, this.options.duration);
	this.stopFlagReset();
	this.notifyObservers('onCancel', this);
	this.isRunning = false;
};

Spry.Effect.Cluster.prototype.addNextEffect = function(effect)
{
	effect.addObserver(this);
	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "queue");
	if (this.effectsArray.length == 1)
	{
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

Spry.Effect.Cluster.prototype.addParallelEffect = function(effect)
{
	if (this.effectsArray.length == 0 || this.effectsArray[this.effectsArray.length-1].kind != 'parallel')
		effect.addObserver(this);

	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "parallel");
	if (this.effectsArray.length == 1)
	{
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

Spry.Effect.Cluster.prototype.prepareStart = function()
{
	this.toggleCluster();
};

//////////////////////////////////////////////////////////////////////
//
// Combination effects
// Custom effects can be build by combining basic effect bahaviour
// like Move, Size, Color, Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Fade = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Fade');

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Fade';
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var fromOpacity = 0.0;
	var toOpacity = 100.0;
	var doToggle = false;
	var transition = Spry.fifthTransition;
	var fps = 60;
	var originalOpacity = 0;
	if(/MSIE/.test(navigator.userAgent))
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'filter').replace(/alpha\(opacity=([0-9]{1,3})\)/g, '$1'), 10);
	else
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'opacity') * 100, 10);

	if (isNaN(originalOpacity))
		originalOpacity = 100;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null){
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromOpacity = Spry.Effect.Utils.getPercentValue(options.from) * originalOpacity / 100;
			else
				fromOpacity = options.from;
		}
		if (options.to != null)
		{	
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toOpacity = Spry.Effect.Utils.getPercentValue(options.to) * originalOpacity / 100;
			else
				toOpacity = options.to;
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) transition = options.transition;
		if (options.fps != null) fps = options.fps;
		else this.options.transition = transition;
	}

	fromOpacity = fromOpacity/ 100.0;
	toOpacity = toOpacity / 100.0;

	options = {duration: durationInMilliseconds, toggle: doToggle, transition: transition, from: fromOpacity, to: toOpacity, fps: fps};
	var fadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	this.addNextEffect(fadeEffect);
};

Spry.Effect.Fade.prototype = new Spry.Effect.Cluster();
Spry.Effect.Fade.prototype.constructor = Spry.Effect.Fade;

Spry.Effect.Blind = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Blind'); 

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Blind';
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var kindOfTransition = Spry.circleTransition;
	var fps = 60;
	var doScaleContent = false;

	Spry.Effect.makeClipping(element);

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var fromHeightPx  = originalRect.height;
	var toHeightPx    = 0;
	var optionFrom = options ? options.from : originalRect.height;
	var optionTo   = options ? options.to : 0;
	var fullCSSBox = false;


	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromHeightPx = Spry.Effect.Utils.getPercentValue(options.from) * originalRect.height / 100;
			else
				fromHeightPx = Spry.Effect.Utils.getPixelValue(options.from);
		}
		if (options.to != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toHeightPx = Spry.Effect.Utils.getPercentValue(options.to) * originalRect.height / 100;
			else
				toHeightPx = Spry.Effect.Utils.getPixelValue(options.to);
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
		if (options.useCSSBox != null) fullCSSBox = options.useCSSBox;
	}

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = originalRect.width;
	fromRect.height = fromHeightPx;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalRect.width;
	toRect.height = toHeightPx;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, useCSSBox: fullCSSBox, from: optionFrom, to: optionTo, fps: fps};
	var blindEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addNextEffect(blindEffect);
};

Spry.Effect.Blind.prototype = new Spry.Effect.Cluster();
Spry.Effect.Blind.prototype.constructor = Spry.Effect.Blind;

Spry.Effect.Highlight = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Highlight'); 

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Highlight';
	var durationInMilliseconds = 1000;
	var toColor = "#ffffff";
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var fps = 60;
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var fromColor = Spry.Effect.getBgColor(element);
	if (fromColor == "transparent") fromColor = "#ffff99";

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromColor = options.from;
		if (options.to != null) toColor = options.to;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}

	if ( fromColor.indexOf('rgb') != -1 )
		var fromColor = Spry.Effect.Utils.rgb(parseInt(fromColor.substring(fromColor.indexOf('(')+1, fromColor.indexOf(',')),10), parseInt(fromColor.substring(fromColor.indexOf(',')+1, fromColor.lastIndexOf(',')),10), parseInt(fromColor.substring(fromColor.lastIndexOf(',')+1, fromColor.indexOf(')')),10));

	if ( toColor.indexOf('rgb') != -1 )
		var toColor = Spry.Effect.Utils.rgb(parseInt(toColor.substring(toColor.indexOf('(')+1, toColor.indexOf(',')),10), parseInt(toColor.substring(toColor.indexOf(',')+1, toColor.lastIndexOf(',')),10), parseInt(toColor.substring(toColor.lastIndexOf(',')+1, toColor.indexOf(')')),10));

	var fromColor = Spry.Effect.Utils.longColorVersion(fromColor);
	var toColor = Spry.Effect.Utils.longColorVersion(toColor);

	this.restoreBackgroundImage = Spry.Effect.getStyleProp(element, 'background-image');

	options = {duration: durationInMilliseconds, toggle: doToggle, transition: kindOfTransition, fps: fps};
	var highlightEffect = new Spry.Effect.Color(element, fromColor, toColor, options);
	this.addNextEffect(highlightEffect);

	this.addObserver({
		onPreEffect:
		function(effect){
			Spry.Effect.setStyleProp(effect.element, 'background-image', 'none');
		},
		onPostEffect:
		function(effect){
			Spry.Effect.setStyleProp(effect.element, 'background-image', effect.restoreBackgroundImage);

			if (effect.direction == Spry.forwards && effect.options.restoreColor)
				Spry.Effect.setStyleProp(element, 'background-color', effect.options.restoreColor);		
		}
	});
};

Spry.Effect.Highlight.prototype = new Spry.Effect.Cluster();
Spry.Effect.Highlight.prototype.constructor = Spry.Effect.Highlight;

Spry.Effect.Slide = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Slide'); 

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Slide';
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var fps = 60;
	var slideHorizontally = false;
	var firstChildElt = Spry.Effect.Utils.getFirstChildElement(element);
	var direction = -1;

	// IE 7 does not clip static positioned elements -> make element position relative
	if(/MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
		Spry.Effect.makePositioned(element);

	Spry.Effect.makeClipping(element);

	// for IE 6 on win: check if position is static or fixed -> not supported and would cause trouble
	if(/MSIE 6.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
	{
		var pos = Spry.Effect.getStyleProp(element, 'position');
		if(pos && (pos == 'static' || pos == 'fixed'))
		{
			Spry.Effect.setStyleProp(element, 'position', 'relative');
			Spry.Effect.setStyleProp(element, 'top', '');
			Spry.Effect.setStyleProp(element, 'left', '');
		}
	}

	if(firstChildElt)
	{
		Spry.Effect.makePositioned(firstChildElt);
		Spry.Effect.makeClipping(firstChildElt);
  
		var childRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(firstChildElt, element);
		Spry.Effect.setStyleProp(firstChildElt, 'width', childRect.width + 'px');
	}

	var fromDim = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);

	var initDim = new Spry.Effect.Utils.Rectangle();
	var toDim = new Spry.Effect.Utils.Rectangle();
	initDim.width = toDim.width = fromDim.width;
	initDim.height = toDim.height = fromDim.height;

	if (!this.options.to){
		if (!options)
			options = {};

		options.to = '0%';
	}

	if (options && options.horizontal !== null && options.horizontal === true)
		slideHorizontally = true;

	if (options.duration != null) durationInMilliseconds = options.duration;

	if (options.from != null)
	{
		if(slideHorizontally)
		{
				if (Spry.Effect.Utils.isPercentValue(options.from))
					fromDim.width = initDim.width * Spry.Effect.Utils.getPercentValue(options.from) / 100;
				else
					fromDim.width = Spry.Effect.Utils.getPixelValue(options.from);
		}
		else
		{
				if (Spry.Effect.Utils.isPercentValue(options.from))
					fromDim.height = initDim.height * Spry.Effect.Utils.getPercentValue(options.from) / 100;
				else
					fromDim.height = Spry.Effect.Utils.getPixelValue(options.from);
		}
	}

	if (options.to != null)
	{
			if(slideHorizontally)
			{
				if (Spry.Effect.Utils.isPercentValue(options.to))
					toDim.width = initDim.width * Spry.Effect.Utils.getPercentValue(options.to) / 100;
				else
					toDim.width = Spry.Effect.Utils.getPixelValue(options.to);
			}
			else
			{
				if (Spry.Effect.Utils.isPercentValue(options.to))
					toDim.height = initDim.height * Spry.Effect.Utils.getPercentValue(options.to) / 100;
				else
					toDim.height = Spry.Effect.Utils.getPixelValue(options.to);
		}
	}
	if (options.toggle != null) doToggle = options.toggle;
	if (options.transition != null) kindOfTransition = options.transition;
	if (options.fps != null) fps = options.fps;

	options = {duration: durationInMilliseconds, transition: kindOfTransition, scaleContent: false, toggle:doToggle, fps: fps};
	var size = new Spry.Effect.Size(element, fromDim, toDim, options);
	this.addParallelEffect(size);

	if ( (fromDim.width < toDim.width && slideHorizontally) || (fromDim.height < toDim.height && !slideHorizontally))
		direction = 1;
	
	var fromPos = new Spry.Effect.Utils.Position();
	var toPos = new Spry.Effect.Utils.Position();
	toPos.x = fromPos.x = Spry.Effect.intPropStyle(firstChildElt, 'left');
	toPos.y = fromPos.y = Spry.Effect.intPropStyle(firstChildElt, 'top');
	toPos.units = fromPos.units;

	if (slideHorizontally)
		toPos.x = parseInt(fromPos.x + direction * (fromDim.width - toDim.width), 10);
	else
		toPos.y = parseInt(fromPos.y + direction * (fromDim.height - toDim.height), 10);

	if (direction == 1){
		var tmp = fromPos;
		var fromPos = toPos;
		var toPos = tmp;
	}

	options = {duration: durationInMilliseconds, transition: kindOfTransition, toggle:doToggle, from: fromPos, to: toPos, fps: fps};
	var move = new Spry.Effect.Move(firstChildElt, fromPos, toPos, options);
	this.addParallelEffect(move);
};

Spry.Effect.Slide.prototype = new Spry.Effect.Cluster();
Spry.Effect.Slide.prototype.constructor = Spry.Effect.Slide;

Spry.Effect.Grow = function (element, options) 
{
	if (!element)
		return;
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Grow');

	Spry.Effect.Cluster.call(this, options);

	this.name = 'Grow';
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var doScaleContent = true;
	var calcHeight = false;
	var growFromCenter = true;
	var fullCSSBox = false;
	var kindOfTransition = Spry.squareTransition;
	var fps = 60;
	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;

	Spry.Effect.makeClipping(element);

	var dimRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var originalWidth = dimRect.width;
	var originalHeight = dimRect.height;
	var propFactor = (originalWidth == 0) ? 1 :originalHeight/originalWidth;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = 0;
	fromRect.height = 0;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalWidth;
	toRect.height = originalHeight;

	var optionFrom = options ? options.from : dimRect.width;
	var optionTo   = options ? options.to : 0;
	var pixelValue = Spry.Effect.Utils.getPixelValue;

	if (options)
	{
		if (options.growCenter != null) growFromCenter = options.growCenter;
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.useCSSBox != null) fullCSSBox = options.useCSSBox;
		if (options.scaleContent != null) doScaleContent = options.scaleContent;
		if (options.from != null) 
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
			{
				fromRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
				fromRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
			}
			else
			{
				if(calcHeight)
				{
					fromRect.height = pixelValue(options.from);
					fromRect.width  = pixelValue(options.from) / propFactor;
				}
				else
				{
					fromRect.width = pixelValue(options.from);
					fromRect.height = propFactor * pixelValue(options.from);
				}
			}
		}
		if (options.to != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
			{
				toRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
				toRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
			}
			else
			{
				if(calcHeight)
				{
					toRect.height = pixelValue(options.to);
					toRect.width  = pixelValue(options.to) / propFactor;
				}
				else
				{
					toRect.width = pixelValue(options.to);
					toRect.height = propFactor * pixelValue(options.to);
				}
			}
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, useCSSBox: fullCSSBox, fps: fps};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addParallelEffect(sizeEffect);

	if(growFromCenter)
	{
		Spry.Effect.makePositioned(element);

		var startOffsetPosition = new Spry.Effect.Utils.Position();
		startOffsetPosition.x = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "left"), 10);
		startOffsetPosition.y = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "top"), 10);	
		if (!startOffsetPosition.x) startOffsetPosition.x = 0;
		if (!startOffsetPosition.y) startOffsetPosition.y = 0;

		options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, from: optionFrom, to: optionTo, fps: fps};
		var fromPos = new Spry.Effect.Utils.Position;
		fromPos.x = startOffsetPosition.x + (originalWidth - fromRect.width) / 2.0;
		fromPos.y = startOffsetPosition.y + (originalHeight - fromRect.height) / 2.0;

		var toPos = new Spry.Effect.Utils.Position;
		toPos.x = startOffsetPosition.x + (originalWidth - toRect.width) / 2.0;
		toPos.y = startOffsetPosition.y + (originalHeight - toRect.height) / 2.0;

		var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options);
		this.addParallelEffect(moveEffect);
	}
};

Spry.Effect.Grow.prototype = new Spry.Effect.Cluster();
Spry.Effect.Grow.prototype.constructor = Spry.Effect.Grow;

Spry.Effect.Shake = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Shake'); 

	Spry.Effect.Cluster.call(this, options);

	// toggle is not supported
	this.options.direction = false;
	if (this.options.toggle)
		this.options.toggle = false;

	this.name = 'Shake';

	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 100;
	var kindOfTransition = Spry.linearTransition;
	var fps = 60;
	var steps = 4;

	if (options)
	{
		if (options.duration != null) steps = Math.ceil(this.options.duration / durationInMilliseconds) - 1;
		if (options.fps != null) fps = options.fps;
		if (options.transition != null) kindOfTransition = options.transition;
	}

	Spry.Effect.makePositioned(element);
	
	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"), 10);
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"), 10);
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	var centerPos = new Spry.Effect.Utils.Position;
	centerPos.x = startOffsetPosition.x;
	centerPos.y = startOffsetPosition.y;

	var rightPos = new Spry.Effect.Utils.Position;
	rightPos.x = startOffsetPosition.x + 20;
	rightPos.y = startOffsetPosition.y + 0;

	var leftPos = new Spry.Effect.Utils.Position;
	leftPos.x = startOffsetPosition.x + -20;
	leftPos.y = startOffsetPosition.y + 0;

	options = {duration:Math.ceil(durationInMilliseconds / 2), toggle:false, fps: fps, transition: kindOfTransition};
	var effect = new Spry.Effect.Move(element, centerPos, rightPos, options);
	this.addNextEffect(effect);

	options = {duration:durationInMilliseconds, toggle:false, fps:fps, transition: kindOfTransition};
	var effectToRight = new Spry.Effect.Move(element, rightPos, leftPos, options);
	var effectToLeft = new Spry.Effect.Move(element, leftPos, rightPos, options);

	for (var i=0; i < steps; i++)
	{
		if (i % 2 == 0)
			this.addNextEffect(effectToRight);
		else
			this.addNextEffect(effectToLeft);
	}
	var pos = (steps % 2 == 0) ? rightPos: leftPos;

	options = {duration:Math.ceil(durationInMilliseconds / 2), toggle:false, fps: fps, transition: kindOfTransition};
	var effect = new Spry.Effect.Move(element, pos, centerPos, options);
	this.addNextEffect(effect);
};
Spry.Effect.Shake.prototype = new Spry.Effect.Cluster();
Spry.Effect.Shake.prototype.constructor = Spry.Effect.Shake;
Spry.Effect.Shake.prototype.doToggle = function(){};

Spry.Effect.Squish = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Squish');

	if (!options)
		options = {};
	if (!options.to)
		options.to = '0%';
	if (!options.from)
		options.from = '100%';

	options.growCenter = false;
	Spry.Effect.Grow.call(this, element, options);
	this.name = 'Squish';
};
Spry.Effect.Squish.prototype = new Spry.Effect.Grow();
Spry.Effect.Squish.prototype.constructor = Spry.Effect.Squish;

Spry.Effect.Pulsate = function (element, options) 
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Pulsate');

	Spry.Effect.Cluster.call(this, options);

	// toggle is not supported
	this.options.direction = false;
	if (this.options.toggle)
		this.options.toggle = false;

	var element = Spry.Effect.getElement(element);
	var originalOpacity = 0;
	this.element = element;
	if (!this.element)
		return;

	this.name = 'Pulsate';
	var durationInMilliseconds = 100;
	var fromOpacity = 100.0;
	var toOpacity = 0.0;
	var doToggle = false;
	var kindOfTransition = Spry.linearTransition;
	var fps = 60;
	if(/MSIE/.test(navigator.userAgent))
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'filter').replace(/alpha\(opacity=([0-9]{1,3})\)/g, '$1'), 10);
	else
		originalOpacity = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(this.element, 'opacity') * 100, 10);

	if (isNaN(originalOpacity)){
		originalOpacity = 100;
	}

	if (options)
	{
		if (options.from != null){
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromOpacity = Spry.Effect.Utils.getPercentValue(options.from) * originalOpacity / 100;
			else
				fromOpacity = options.from;
		}
		if (options.to != null)
		{	
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toOpacity = Spry.Effect.Utils.getPercentValue(options.to) * originalOpacity / 100;
			else
				toOpacity = options.to;
		}
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, fps:fps};
	fromOpacity = fromOpacity / 100.0;
	toOpacity = toOpacity / 100.0;

	var fadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	var appearEffect = new Spry.Effect.Opacity(element, toOpacity, fromOpacity, options);
	var steps = parseInt(this.options.duration / 200, 10);
	for (var i=0; i < steps; i++){ 
		this.addNextEffect(fadeEffect);
		this.addNextEffect(appearEffect);
	}
};
Spry.Effect.Pulsate.prototype = new Spry.Effect.Cluster();
Spry.Effect.Pulsate.prototype.constructor = Spry.Effect.Pulsate;
Spry.Effect.Pulsate.prototype.doToggle = function(){};

Spry.Effect.Puff = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Puff'); 

	Spry.Effect.Cluster.call(this, options);

	var element = Spry.Effect.getElement(element);
	this.element = element;	
	if (!this.element)
		return;
	this.name = 'Puff';
	var doToggle = false;
	var doScaleContent = false;
	var durationInMilliseconds = 1000;
	var kindOfTransition = Spry.fifthTransition;
	var fps = 60;

	Spry.Effect.makePositioned(element); // for move

	if (options){
		if (options.toggle != null) doToggle = options.toggle;
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.fps != null) fps = options.fps;
	}
	var originalRect = Spry.Effect.getDimensions(element);
	var startWidth = originalRect.width;
	var startHeight = originalRect.height;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition: kindOfTransition, fps: fps};

	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	this.addParallelEffect(opacityEffect);

	var fromPos = Spry.Effect.getPosition(element);

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startWidth / 2.0 * -1.0;
	toPos.y = startHeight / 2.0 * -1.0;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, from: fromPos, to: toPos, fps: fps};
	var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options);
	this.addParallelEffect(moveEffect);

	var self = this;
	this.addObserver({
		onPreEffect:function(){if (self.direction == Spry.backwards){self.element.style.display = 'block';}},
		onPostEffect: function(){if (self.direction == Spry.forwards){self.element.style.display = 'none';}}
	});
};
Spry.Effect.Puff.prototype = new Spry.Effect.Cluster;
Spry.Effect.Puff.prototype.constructor = Spry.Effect.Puff;

Spry.Effect.DropOut = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('DropOut');

	Spry.Effect.Cluster.call(this, options);

	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	var durationInMilliseconds = 1000;
	var fps = 60;
	var kindOfTransition = Spry.fifthTransition;
	var direction = Spry.forwards;
	var doToggle = false;
	this.name = 'DropOut';

	Spry.Effect.makePositioned(element);

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.fps != null) fps = options.fps;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.dropIn != null) direction = -1;
	}

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"), 10);
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"), 10);	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 0;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 0;
	toPos.y = startOffsetPosition.y + (direction * 160);

	options = {from:fromPos, to:toPos, duration:durationInMilliseconds, toggle:doToggle, transition: kindOfTransition, fps: fps};
	var moveEffect = new Spry.Effect.Move(element, options.from, options.to, options);
	this.addParallelEffect(moveEffect);

	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	options = {duration:durationInMilliseconds, toggle:doToggle, transition: kindOfTransition, fps: fps};
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	this.addParallelEffect(opacityEffect);

	var self = this;
	this.addObserver({
		onPreEffect:function(){self.element.style.display = 'block';},
		onPostEffect: function(){if (self.direction == Spry.forwards){self.element.style.display = 'none';}}
	});

};
Spry.Effect.DropOut.prototype = new Spry.Effect.Cluster();
Spry.Effect.DropOut.prototype.constructor = Spry.Effect.DropOut;

Spry.Effect.Fold = function (element, options)
{
	if (!this.notStaticAnimator)
		return Spry.Effect.Utils.showInitError('Fold');

	Spry.Effect.Cluster.call(this, options);

	var element = Spry.Effect.getElement(element);
	this.element = element;
	if (!this.element)
		return;
	this.name = 'Fold';
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var doScaleContent = true;
	var fullCSSBox = false;
	var kindOfTransition = Spry.fifthTransition;
	var fps = fps;
	
	Spry.Effect.makeClipping(element);

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var startWidth = originalRect.width;
	var startHeight = originalRect.height;

	var stopWidth = startWidth;
	var stopHeight = startHeight / 5;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = Math.ceil(options.duration/2);
		if (options.toggle != null) doToggle = options.toggle;
		if (options.useCSSBox != null) fullCSSBox = options.useCSSBox; 
		if (options.fps != null) fps = options.fps;
		if (options.transition != null) kindOfTransition = options.transition;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent, useCSSBox: fullCSSBox, transition: kindOfTransition, fps: fps};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addNextEffect(sizeEffect);

	fromRect.width = toRect.width;
	fromRect.height = toRect.height;
	toRect.width = '0%';
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	this.addNextEffect(sizeEffect);
};

Spry.Effect.Fold.prototype = new Spry.Effect.Cluster();
Spry.Effect.Fold.prototype.constructor = Spry.Effect.Fold;

//////////////////////////////////////////////////////////////
// 																													//
// The names of some of the static effect functions 		 		//
// changed in Spry 1.5. These wrappers will insure that we 	//
// remain compatible with previous versions of Spry.				//
// 																													//
//////////////////////////////////////////////////////////////

Spry.Effect.DoFade = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Fade', element, options);
};

Spry.Effect.DoBlind = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Blind', element, options);
};

Spry.Effect.DoHighlight = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Highlight', element, options);
};

Spry.Effect.DoSlide = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Slide', element, options);
};

Spry.Effect.DoGrow = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Grow', element, options);
};

Spry.Effect.DoShake = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Shake', element, options);
};

Spry.Effect.DoSquish = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Squish', element, options);
};

Spry.Effect.DoPulsate = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Pulsate', element, options);
};

Spry.Effect.DoPuff = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Puff', element, options);
};

Spry.Effect.DoDropOut = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('DropOut', element, options);
};

Spry.Effect.DoFold = function (element, options)
{
	return Spry.Effect.Utils.DoEffect('Fold', element, options);
};
;// SpryHTMLDataSet.js - version 0.20 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

//////////////////////////////////////////////////////////////////////
//
// Spry.Data.HTMLDataSet
//
//////////////////////////////////////////////////////////////////////

Spry.Data.HTMLDataSet = function(dataSetURL, sourceElementID, dataSetOptions)
{
	this.sourceElementID = sourceElementID; // ID of the html element to be used as a data source
	this.sourceElement = null;  			      // The actual html element to be used as a data source

	this.sourceWasInitialized = false;
	this.usesExternalFile = (dataSetURL != null) ? true : false;
	
	this.firstRowAsHeaders = true;
	this.useColumnsAsRows = false;
	this.columnNames = null;
	this.hideDataSourceElement = true;
	
	this.rowSelector = null;
	this.dataSelector = null;

	this.tableModeEnabled = true;

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);
};


Spry.Data.HTMLDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.HTMLDataSet.prototype.constructor = Spry.Data.HTMLDataSet;


Spry.Data.HTMLDataSet.prototype.getDataRefStrings = function() 
{
	var dep = [];
	if (this.url) 
		dep.push(this.url);
	if (typeof this.sourceElementID == "string") 
		dep.push(this.sourceElementID);
	
	return dep;
};

Spry.Data.HTMLDataSet.prototype.setDisplay = function(ele, display)
{
	if( ele )
		ele.style.display = display;
};

Spry.Data.HTMLDataSet.prototype.initDataSource = function(callLoadData)
{
	if (!this.loadDependentDataSets())
		return;
	if (!this.usesExternalFile)
	{
		this.setSourceElement();
		if (this.hideDataSourceElement)
			this.setDisplay(this.sourceElement, "none");
	}
	//this.sourceWasInitialized = true;
};


Spry.Data.HTMLDataSet.prototype.setSourceElement = function (externalDataElement)
{
   // externalDataElement is the container that holds the data imported from the external file.
	this.sourceElement = null;
	if (!this.sourceElementID) 
	{
	  if (externalDataElement)
  	  this.sourceElement = externalDataElement;
  	else
  	{
  	  this.hideDataSourceElement = false;
  	  this.sourceElement = document.body;
  	}
	  return; 
	}
	
	var sourceElementID = Spry.Data.Region.processDataRefString(null, this.sourceElementID, this.dataSetsForDataRefStrings);
	if (!this.usesExternalFile)
	   this.sourceElement = Spry.$(sourceElementID);
	else
    if (externalDataElement) 
    {
      var foundElement = false;
      // looking for the specified ID in the current element node
      var sources = Spry.Utils.getNodesByFunc(externalDataElement, function(node)
    	{
    	    if (foundElement) 
    	      return false;
    			if (node.nodeType != 1)
    				return false;
    			if (node.id && node.id.toLowerCase() == sourceElementID.toLowerCase())
    			{
    			  foundElement = true;
    			  return true;
    			}
      });
      this.sourceElement = sources[0];
    }
    
	if (!this.sourceElement) 
		Spry.Debug.reportError("Spry.Data.HTMLDataSet: '" + sourceElementID + "' is not a valid element ID");
};


Spry.Data.HTMLDataSet.prototype.getSourceElement = function() { return this.sourceElement; };
Spry.Data.HTMLDataSet.prototype.getSourceElementID = function() { return this.sourceElementID; };
Spry.Data.HTMLDataSet.prototype.setSourceElementID = function(sourceElementID)
{
	if (this.sourceElementID != sourceElementID)
	{
		this.sourceElementID = sourceElementID;
		this.recalculateDataSetDependencies();
		this.dataWasLoaded = false;
	}
};

Spry.Data.HTMLDataSet.prototype.getDataSelector = function() { return this.dataSelector; };
Spry.Data.HTMLDataSet.prototype.setDataSelector = function(dataSelector)
{ 
  if (this.dataSelector != dataSelector)
  {
     this.dataSelector = dataSelector;
  	 this.dataWasLoaded = false;
  }
};

Spry.Data.HTMLDataSet.prototype.getRowSelector = function() { return this.rowSelector; };
Spry.Data.HTMLDataSet.prototype.setRowSelector = function(rowSelector)
{ 
  if (this.rowSelector != rowSelector)
  {
     this.rowSelector = rowSelector;
  	 this.dataWasLoaded = false;
  }
};


Spry.Data.HTMLDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var responseText = rawDataDoc;
	responseText = Spry.Data.HTMLDataSet.cleanupSource(responseText);

	var div = document.createElement("div");
	div.id = "htmlsource" + this.internalID;
	div.innerHTML = responseText;

	this.setSourceElement(div);
	if (this.sourceElement)
	{
		var parsedStructure = this.getDataFromSourceElement();
		if (parsedStructure) 
		{
			this.dataHash = parsedStructure.dataHash;
			this.data = parsedStructure.data;
		}		
	}
	this.dataWasLoaded = true;
	div = null;
};


Spry.Data.HTMLDataSet.prototype.loadDependentDataSets = function() 
{
	if (this.hasDataRefStrings)
	{
		var allDataSetsReady = true;

		for (var i = 0; i < this.dataSetsForDataRefStrings.length; i++)
		{
			var ds = this.dataSetsForDataRefStrings[i];
			if (ds.getLoadDataRequestIsPending())
				allDataSetsReady = false;
			else if (!ds.getDataWasLoaded())
			{
				// Kick off the load of this data set!
				ds.loadData();
				allDataSetsReady = false;
			}
		}

		// If our data sets aren't ready, just return. We'll
		// get called back to load our data when they are all
		// done.

		if (!allDataSetsReady)
			return false;
	}
	return true;
};


Spry.Data.HTMLDataSet.prototype.loadData = function()
{
	this.cancelLoadData();
	this.initDataSource();
	
	var self = this;
	if (!this.usesExternalFile) 
	{
		this.notifyObservers("onPreLoad");
		
		this.dataHash = new Object;
		this.data = new Array;
		this.dataWasLoaded = false;
		this.unfilteredData = null;
		this.curRowID = 0;
		
		this.pendingRequest = new Object;
		this.pendingRequest.timer = setTimeout(function()
		{
			self.pendingRequest = null;
			var parsedStructure = self.getDataFromSourceElement();
			if (parsedStructure) 
			{
				self.dataHash = parsedStructure.dataHash;
				self.data = parsedStructure.data;
			}
			self.dataWasLoaded = true;
			
			self.disableNotifications();
			self.filterAndSortData();
			self.enableNotifications();
			
			self.notifyObservers("onPostLoad");
			self.notifyObservers("onDataChanged");	
		}, 0); 
	}
	else 
	{
		var url = Spry.Data.Region.processDataRefString(null, this.url, this.dataSetsForDataRefStrings);

		var postData = this.requestInfo.postData;
		if (postData && (typeof postData) == "string") 
			postData = Spry.Data.Region.processDataRefString(null, postData, this.dataSetsForDataRefStrings);
		this.notifyObservers("onPreLoad");
		
	
		this.dataHash = new Object;
		this.data = new Array;
		this.dataWasLoaded = false;
		this.unfilteredData = null;
		this.curRowID = 0;

		var req = this.requestInfo.clone();
		req.url = url;
		req.postData = postData;
	
		this.pendingRequest = new Object;
		this.pendingRequest.data = Spry.Data.HTTPSourceDataSet.LoadManager.loadData(req, this, this.useCache);
	}
};


Spry.Data.HTMLDataSet.cleanupSource = function (source)
{
	// Cleans the content by replacing the src/href with spry_src 
	// This prevents browser to load the external resources.
  source = source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi, function(a,b,c) {
			//b=tag name,c=tag attributes
			return '<' + b + c.replace(/\b(src|href)\s*=/gi, function(a, b) {
				//b=attribute name
				return 'spry_'+ b + '=';
			}) + '>';
		});
	return source;
};


Spry.Data.HTMLDataSet.undoCleanupSource = function (source)
{
	// Undo cleanup. See the cleanupSource function
	source = source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi, function(a,b,c) {
			//b=tag name,c=tag attributes
			return '<' + b + c.replace(/\bspry_(src|href)\s*=/gi, function(a, b) {
				//b=attribute name
				return b + '=';
			}) + '>';
		});
	return source;
};


Spry.Data.HTMLDataSet.normalizeColumnName = function(colName) 
{
  // Removes the tags from column names values
  // Replaces spaces with underscore
	colName = colName.replace(/(?:^[\s\t]+|[\s\t]+$)/gi, "");
	colName = colName.replace(/<\/?([a-z]+)([^>]+)>/gi, "");
	colName = colName.replace(/[\s\t]+/gi, "_");
	return colName;
};


Spry.Data.HTMLDataSet.prototype.getDataFromSourceElement = function() 
{
	if (!this.sourceElement) 
    return null;

	var extractedData;
	var usesTable = (this.tableModeEnabled && this.sourceElement.nodeName.toLowerCase() == "table");
	if (usesTable)
		extractedData = this.getDataFromHTMLTable();
	else
		extractedData = this.getDataFromNestedStructure();

	if (!extractedData)
     return null;

	// Flip Columns / Rows
	if (this.useColumnsAsRows) 
	{
	   var flipedData = new Array;
	   // Get columns and put them as rows 
	   for (var rowIdx = 0; rowIdx < extractedData.length; rowIdx++)
	   {
	     var row = extractedData[rowIdx];
	     for (var cellIdx = 0; cellIdx < row.length; cellIdx++) 
	     {
	       if (!flipedData[cellIdx]) flipedData[cellIdx] = new Array;
	       flipedData[cellIdx][rowIdx]= row[cellIdx];
	     }
	   }
	   extractedData = flipedData;
	}

	// Build the data structure for the DataSet
	var parsedStructure = new Object();
	parsedStructure.dataHash = new Object;
	parsedStructure.data = new Array;
	
	if (extractedData.length == 0) 
	   return parsedStructure;
	   
	 
	// Get the column names
	// this.firstRowAsHeaders is used only if the source of data is a TABLE
	var columnNames = new Array;
	var firstRowOfData = extractedData[0];
	for (var cellIdx=0; cellIdx < firstRowOfData.length; cellIdx++)
	{
	  if (usesTable && this.firstRowAsHeaders) columnNames[cellIdx] = Spry.Data.HTMLDataSet.normalizeColumnName(firstRowOfData[cellIdx]);
	  else columnNames[cellIdx] = "column" + cellIdx;
	}
  
  // Check if column names are being overwritten using the optional columnNames parameter
  if (this.columnNames && this.columnNames.length) 
  {
    if (this.columnNames.length < columnNames.length) 
        Spry.Debug.reportError("Too few elements in the columnNames array. The columNames length must match the actual number of columns." );
    else
       for (var i=0; i < columnNames.length; i++) {
         if (this.columnNames[i]) columnNames[i] = this.columnNames[i];
    }
  }
  
  // Place the extracted data into a dataset kind of structure
	var nextID = 0;
	var firstDataRowIndex = (usesTable && this.firstRowAsHeaders) ? 1: 0;

	for (var rowIdx = firstDataRowIndex; rowIdx < extractedData.length; rowIdx++)
	{
		var row = extractedData[rowIdx];
		if (columnNames.length != row.length)
		{
			Spry.Debug.reportError("Unbalanced column names for row #" + (rowIdx+1) + ". Skipping row." );
			continue;
		}

		var rowObj = {};
		for (var cellIdx = 0; cellIdx < row.length; cellIdx++)
       rowObj[columnNames[cellIdx]] = row[cellIdx];

    rowObj['ds_RowID'] = nextID++;
    parsedStructure.dataHash[rowObj['ds_RowID']] = rowObj;
    parsedStructure.data.push(rowObj);
	}
	return parsedStructure;
};


Spry.Data.HTMLDataSet.getElementChildren = function(element)
{
	var children = [];
	var child = element.firstChild;
	while (child)
	{
		if (child.nodeType == 1)
			children.push(child);
		child = child.nextSibling;
	}
	return children;
};


// This method extracts data from a TABLE structure
// It knows how to handle both colspan and rowspan

Spry.Data.HTMLDataSet.prototype.getDataFromHTMLTable = function()
{
  var tHead = this.sourceElement.tHead;
  var tBody = this.sourceElement.tBodies[0];
  
  var rowsHead = [];
  var rowsBody = [];
  if (tHead) rowsHead = Spry.Data.HTMLDataSet.getElementChildren(tHead);
  if (tBody) rowsBody = Spry.Data.HTMLDataSet.getElementChildren(tBody);
  
  var extractedData = new Array;
  var rows = rowsHead.concat(rowsBody);
  if (this.rowSelector) rows = Spry.Data.HTMLDataSet.applySelector(rows, this.rowSelector);
  for (var rowIdx = 0; rowIdx < rows.length; rowIdx++)
  {
     var row = rows[rowIdx];
     
     var dataRow;
     if (extractedData[rowIdx]) dataRow = extractedData[rowIdx];
     else dataRow = new Array;
     
     var offset = 0;
     var cells = row.cells;
     if (this.dataSelector) cells = Spry.Data.HTMLDataSet.applySelector(cells, this.dataSelector);
     for (var cellIdx=0; cellIdx < cells.length; cellIdx++)
     {
       var cell = cells[cellIdx];
       var nextCellIndex = cellIdx + offset;
       
       // Find the next available position
       while (dataRow[nextCellIndex])
       {
          offset ++;
          nextCellIndex ++;
       }
       var cellValue = Spry.Data.HTMLDataSet.undoCleanupSource(cell.innerHTML);
       dataRow[nextCellIndex] = cellValue;
       
       // Handle collspan
       var colspan = cell.colSpan;
       if (colspan == 0) colspan = 1;
       var startOffset = offset;
       for (var offIdx = 1; offIdx < colspan; offIdx++)
       {
         offset ++;
         nextCellIndex = cellIdx + offset;
         dataRow[nextCellIndex] = cellValue;
       }
       
       // Handle rowspan
       var rowspan = cell.rowSpan;
       if (rowspan == 0) rowspan = 1;
       for (var rowOffIdx = 1; rowOffIdx < rowspan; rowOffIdx++)
       {
         nextRowIndex = rowIdx + rowOffIdx;
         var nextDataRow;
         if (extractedData[nextRowIndex]) nextDataRow = extractedData[nextRowIndex];
         else nextDataRow = new Array;
         
         var rowSpanCellOffset = startOffset;
         for (var offIdx = 0; offIdx < colspan; offIdx++)
         {
           nextCellIndex = cellIdx + rowSpanCellOffset;
           nextDataRow[nextCellIndex] = cellValue;
           rowSpanCellOffset ++;
         }
         extractedData[nextRowIndex] = nextDataRow;
       }
      }
     extractedData[rowIdx] = dataRow;
  }
  return extractedData;
};



// This method extracts data from any HTML structure
// It uses rowSelector and dataSelector in order to build a three level nested structure - 
// Either one: rowSelector or dataSelector can miss

Spry.Data.HTMLDataSet.prototype.getDataFromNestedStructure = function()
{
  var extractedData = new Array;
  
  if (this.sourceElementID && !this.rowSelector && !this.dataSelector) 
  {
     // The whole sourceElementID is a single row, single cell structure;
     extractedData[0] = [Spry.Data.HTMLDataSet.undoCleanupSource(this.sourceElement.innerHTML)];
     return extractedData;
  }
  
  var self = this;
  // Get the rows
  var rows = [];
  if (!this.rowSelector)
     // If no rowSelector, there will be only one row
     rows = [this.sourceElement];
  else
     rows = Spry.Utils.getNodesByFunc(this.sourceElement, function(node) { 
            return Spry.Data.HTMLDataSet.evalSelector(node, self.sourceElement, self.rowSelector); 
           }); 
           
  // Get the data columns
  for (var rowIdx = 0; rowIdx < rows.length; rowIdx++)
  {
    var row = rows[rowIdx];
    // Get the cells that actually hold the data for each row
    var cells = [];
    if (!this.dataSelector)
      // If no dataSelector, the whole row is extracted as one cell row.
      cells = [row];
    else
      cells = Spry.Utils.getNodesByFunc(row, function(node) { 
               return Spry.Data.HTMLDataSet.evalSelector(node, row, self.dataSelector); 
              });
              
    extractedData[rowIdx] = new Array;
    for (var cellIdx = 0; cellIdx < cells.length; cellIdx ++)
       extractedData[rowIdx][cellIdx] = Spry.Data.HTMLDataSet.undoCleanupSource(cells[cellIdx].innerHTML);
  }
  return extractedData;
};

// Applies a css selector on a collection and returns the resulting elements
Spry.Data.HTMLDataSet.applySelector = function(collection, selector, root)
{
   var newCollection = [];
   for (var idx = 0; idx < collection.length; idx++)
   {
     var node = collection[idx];
     if (Spry.Data.HTMLDataSet.evalSelector(node, root?root:node.parentNode, selector))
        newCollection.push(node);
   }
   return newCollection;
};

// Checks if a specified node matches the specified css selector
Spry.Data.HTMLDataSet.evalSelector = function (node, root, selector)
{
  if (node.nodeType != 1)
 		return false;
 	if (node == root)
 	  return false;
 	  
 	// Comma delimited selectors can be passed in
 	// The node is selected if it matches one of the selectors
 	// #myID1, div#myID2, #myID3
  var selectors = selector.split(",");
  for (var idx = 0; idx < selectors.length; idx ++)
  {
    var currentSelector = selectors[idx].replace(/^\s+/, "").replace(/\s+$/, "");
   	var tagName = null;
   	var className = null;
   	var id = null;
   	
   	// Accepted values for the selector:
   	// DIV.myClass | DIV | .myClass | *.myClass
   	// DIV#myID | #myID
   	// > DIV.myClass : > points to the direct descendents
   	
   	var selected = true;
   	if (currentSelector.substring(0,1) == ">") 
   	{
   	    // Looking for direct descendants only
   	    if (node.parentNode != root) 
   	      selected = false;
   	    else
   	      currentSelector = currentSelector.substring(1).replace(/^\s+/, "");
   	}
   	if (selected) 
   	{
     	tagName = currentSelector.toLowerCase();
     	if (currentSelector.indexOf(".") != -1)
     	{
     	  var parts = currentSelector.split(".");
     	  tagName = parts[0];
     	  className = parts[1];
     	}
     	else if (currentSelector.indexOf("#") != -1)
     	{
     	  var parts = currentSelector.split("#");
     	  tagName = parts[0];
     	  id = parts[1];
     	}
   	}
   	if (selected && tagName != '' && tagName != '*')
   	    if (node.nodeName.toLowerCase() != tagName) 
   	       selected = false;
   	if (selected && id && node.id != id)
   	    selected = false;
    	if (selected && className && node.className.search(new RegExp('\\b' + className + '\\b', 'i')) ==-1) 
   	    selected = false;
   	if (selected)
   	 return true;
  }
  return false;
};
;// SpryImageLoader.js - version 0.2 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.ImageLoader = function()
{
	this.queue = [];
	this.timerID = 0;
	this.currentEntry = null;
};

Spry.Utils.ImageLoader.prototype.start = function()
{
	if (!this.timerID)
	{
		var self = this;
		this.timerID = setTimeout(function()
		{
			self.timerID = 0;
			self.processQueue();
		}, 0);
	}
};

Spry.Utils.ImageLoader.prototype.stop = function()
{
	if (this.currentEntry)
	{
		var entry = this.currentEntry;
		entry.loader.onload = null;
		entry.loader.src = "";
		entry.loader = null;
		this.currentEntry = null;
		this.queue.unshift(entry);
	}

	if (this.timerID)
		clearTimeout(this.timerID);

	this.timerID = 0;
};

Spry.Utils.ImageLoader.prototype.clearQueue = function()
{
	this.stop();
	this.queue.length = 0;
};

Spry.Utils.ImageLoader.prototype.load = function(url, callback, priority)
{
	if (url)
	{
		if (typeof priority == "undefined")
			priority = 0;
		this.queue.push({ url: url, callback: callback, priority: priority });

		// Entries in the queue are sorted by priority. Those entries
		// with a higher priority are at the start of the queue, while
		// those with lower priority are pushed towards the end. If an
		// entry has the same priority as something already in the queue,
		// it gets processed in the order they were received.

		this.queue.sort(function(a,b){ return (a.priority > b.priority) ? -1 : ((a.priority < b.priority) ? 1 : 0); });
		this.start();
	}
};

Spry.Utils.ImageLoader.prototype.processQueue = function()
{
	if (this.queue.length < 1)
		return;

	var entry = this.currentEntry = this.queue.shift();
	var loader = entry.loader = new Image;
	var self = this;

	loader.onload = function()
	{
		self.currentEntry = null;
		if (entry.callback)
			entry.callback(entry.url, entry.loader);
		if (self.queue.length > 0)
			self.start();
	};

	loader.onerror = function()
	{
		// If a load fails, keep the queue going!
		self.currentEntry = null;
		if (self.queue.length > 0)
			self.start();
	};

	this.currentLoader = loader;
	loader.src = entry.url;
};
;// SpryJSONDataSet.js - version 0.6 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Spry.Data.JSONDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	this.path = "";
	this.pathIsObjectOfArrays = false;
	this.doc = null;
	this.subPaths = [];
	this.useParser = false;
	this.preparseFunc = null;

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	// Callers are allowed to pass either a string, an object or an array of
	// strings and/or objects for the 'subPaths' option, so make sure we normalize
	// the subPaths value to be an array.

	var jwType = typeof this.subPaths;
	if (jwType == "string" || (jwType == "object" && this.subPaths.constructor != Array))
		this.subPaths = [ this.subPaths ];
}; // End of Spry.Data.JSONDataSet() constructor.

Spry.Data.JSONDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.JSONDataSet.prototype.constructor = Spry.Data.JSONDataSet;

// Override the inherited version of getDataRefStrings() with our
// own version that returns the strings memebers we maintain that
// may have data references in them.

Spry.Data.JSONDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	if (this.path) strArr.push(this.path);
	if (this.requestInfo && this.requestInfo.postData) strArr.push(this.requestInfo.postData);
	return strArr;
};

Spry.Data.JSONDataSet.prototype.getDocument = function() { return this.doc; };
Spry.Data.JSONDataSet.prototype.getPath = function() { return this.path; };
Spry.Data.JSONDataSet.prototype.setPath = function(path)
{
	if (this.path != path)
	{
		this.path = path;
		if (this.dataWasLoaded && this.doc)
		{
			this.notifyObservers("onPreLoad");
			this.setDataFromDoc(this.doc);
		}
	}
};

// A recursive method that returns all objects that match the given object path.

Spry.Data.JSONDataSet.getMatchingObjects = function(path, jsonObj)
{
	var results = [];

	if (path && jsonObj)
	{
		var prop = "";
		var leftOverPath = "";

		var offset = path.search(/\./);
		if (offset != -1)
		{
			prop = path.substring(0, offset);
			leftOverPath = path.substring(offset + 1);
		}
		else
			prop = path;

		var matches = [];

		if (prop && typeof jsonObj == "object")
		{
			var obj = jsonObj[prop];
			var objType = typeof obj;
			if (objType != undefined && objType != null)
			{
				if (obj && objType == "object" && obj.constructor == Array)
					matches = matches.concat(obj);
				else
					matches.push(obj);
			}
		}

		var numMatches = matches.length;
		if (leftOverPath)
		{
			for (var i = 0; i < numMatches; i++)
				results = results.concat(Spry.Data.JSONDataSet.getMatchingObjects(leftOverPath, matches[i]));
		}
		else
			results = matches;
	}

	return results;
};

// Flatten the specified object into a row object that can be added
// to a record set.

Spry.Data.JSONDataSet.flattenObject = function(obj, basicColumnName)
{
	// If obj is a basic type (null, string, boolean, or number), we need
	// to store it under a column name in our row object. If the caller supplied
	// a column name, use that, if not use our default "column0".

	var basicName = basicColumnName ? basicColumnName : "column0";

	// If obj is an object, copy its properties into our row object. If obj
	// is a basic type, then store it in the row under the column name specified
	// by basicName.

	var row = new Object;
	var objType = typeof obj;
	if (objType == "object")
		Spry.Data.JSONDataSet.copyProps(row, obj);
	else
		row[basicName] = obj;

	// Make sure we note the original JSON object we used to create
	// this row. It may be needed if we need to flatten other sub-paths.

	row.ds_JSONObject = obj;
	return row;
};

// Utility routine for copying properties from one object to another.

Spry.Data.JSONDataSet.copyProps = function(dstObj, srcObj, suppressObjProps)
{
	if (srcObj && dstObj)
	{
		for (var prop in srcObj)
		{
			if (suppressObjProps && typeof srcObj[prop] == "object")
				continue;
			dstObj[prop] = srcObj[prop];
		}
	}
	return dstObj;
};

// Given an object created from JSON data, and an object path, find all the
// matching objects and flatten them into rows of data.

Spry.Data.JSONDataSet.flattenDataIntoRecordSet = function(jsonObj, path, pathIsObjectOfArrays)
{
	var rs = new Object;
	rs.data = [];
	rs.dataHash = {};

	if (!path)
		path = "";

	var obj = jsonObj;
	var objType = typeof obj;
	var basicColName = "";

	// Handle the basic non-object data types.

	if (objType != "object" || !obj)
	{
		// JSON has a null data type which we translate
		// into a data set with no rows. All other data types
		// translate into a data set with a single row with a
		// column named "column0" which contains the actual
		// data.

		if (obj != null)
		{
			var row = new Object;
			row.column0 = obj;
			row.ds_RowID = 0;
			rs.data.push(row);
			rs.dataHash[row.ds_RowID] = row;
		}
		return rs;
	}

	var matches = [];

	if (obj.constructor == Array)
	{
		var arrLen = obj.length;

		// We have a top-level array. If the array is empty,
		// then there's nothing for us to do.

		if (arrLen < 1)
			return rs;

		// XXX: We are making a big assumption here that all of the
		// elements within the array are of the same type!
		//
		// If the elements are of a basic data type, we create
		// a row for each element and add it as a row to the data set.

		var eleType = typeof obj[0];

		if (eleType != "object")
		{
			for (var i = 0; i < arrLen; i++)
			{
				var row = new Object;
				row.column0 = obj[i];
				row.ds_RowID = i;
				rs.data.push(row);
				rs.dataHash[row.ds_RowID] = row;
			}
			return rs;
		}
		
		// The elements within the array are objects.
		//
		// XXX: If they are arrays, bail, because we don't handle
		// arrays within arrays right now!

		if (obj[0].constructor == Array)
			return rs;

		// We have an array of objects. If we have a path, use it
		// to fetch the data the user is interested in from each element
		// in the array and append the results to our matches array.
		// If no path was specified, just add the element to the matches
		// array.

		if (path)
		{
			for (var i = 0; i < arrLen; i++)
				matches = matches.concat(Spry.Data.JSONDataSet.getMatchingObjects(path, obj[i]));
		}
		else
		{
			for (var i = 0; i < arrLen; i++)
				matches.push(obj[i]);
		}
	}
	else
	{
		// We have a top-level object. If the user has specified a path,
		// use it to extract out the data they are interested in. If no
		// path was specified, then just copy 
		
		if (path)
			matches = Spry.Data.JSONDataSet.getMatchingObjects(path, obj);
		else
			matches.push(obj);
	}

	var numMatches = matches.length;
	if (path && numMatches >= 1 && typeof matches[0] != "object")
		basicColName = path.replace(/.*\./, "");

	if (!pathIsObjectOfArrays)
	{
		for (var i = 0; i < numMatches; i++)
		{
			var row = Spry.Data.JSONDataSet.flattenObject(matches[i], basicColName, pathIsObjectOfArrays);
			row.ds_RowID = i;
			rs.dataHash[i] = row;
			rs.data.push(row);
		}
	}
	else
	{
		// Each object that was matched contains properties that are the column names
		// of our rows. The value of each property is an array of values for that column. This
		// means the data for each row is inverted and spread across multiple arrays. We expect arrays of
		// objects, so run through all of the arrays and build up row objects and add them
		// to our record set.

		var rowID = 0;

		for (var i = 0; i < numMatches; i++)
		{
			var obj = matches[i];
			var colNames = [];
			var maxNumRows = 0;
			for (var propName in obj)
			{
				var prop = obj[propName];
				var propyType = typeof prop;
				if (propyType == 'object' && prop.constructor == Array)
				{
					colNames.push(propName);
					maxNumRows = Math.max(maxNumRows, obj[propName].length);
				}
			}

			var numColNames = colNames.length;
			for (var j = 0; j < maxNumRows; j++)
			{
				var row = new Object;
				for (var k = 0; k < numColNames; k++)
				{
					var colName = colNames[k];
					row[colName] = obj[colName][j];
				}
				row.ds_RowID = rowID++;
				rs.dataHash[row.ds_RowID] = row;
				rs.data.push(row);
			}
		}
	}

	return rs;
};

// For each JSON object used to create the rows in the specified recordset,
// find the data the matches the specified subPaths, flatten them, and append
// them to the rows of the record set.

Spry.Data.JSONDataSet.prototype.flattenSubPaths = function(rs, subPaths)
{
	if (!rs || !subPaths)
		return;

	var numSubPaths = subPaths.length;
	if (numSubPaths < 1)
		return;

	var data = rs.data;
	var dataHash = {};

	// Convert all of the templated subPaths to object paths with real values.
	// We also need a "cleaned" version of the object path which contains no
	// expressions in it, so that we can pre-pend it to the column names
	// of any nested data we find.

	var pathArray = [];
	var cleanedPathArray = [];
	var isObjectOfArraysArr = [];

	for (var i = 0; i < numSubPaths; i++)
	{
		// The elements of the subPaths array can be path strings,
		// or objects that describe a path with nested sub-paths below
		// it, so make sure we properly extract out the object path to use.

		var subPath = subPaths[i];
		if (typeof subPath == "object")
		{
			isObjectOfArraysArr[i] = subPath.pathIsObjectOfArrays;
			subPath = subPath.path;
		}
		if (!subPath)
			subPath = "";

		// Convert any data references in the object path to real values!

		pathArray[i] = Spry.Data.Region.processDataRefString(null, subPath, this.dataSetsForDataRefStrings);

		// Create a clean version of the object path by stripping out any
		// expressions it may contain.

		cleanedPathArray[i] = pathArray[i].replace(/\[.*\]/g, "");
	}

	// For each row of the base record set passed in, generate a flattened
	// recordset from each subPath, and then join the results with the base
	// row. The row from the base data set will be duplicated to match the
	// number of rows matched by the subPath. The results are then merged.

	var row;
	var numRows = data.length;
	var newData = [];

	// Iterate over each row of the base record set.

	for (var i = 0; i < numRows; i++)
	{
		row = data[i];
		var newRows = [ row ];

		// Iterate over every subPath passed into this function.

		for (var j = 0; j < numSubPaths; j++)
		{
			// Search for all nodes that match the given path underneath
			// the JSON Object for the base row and flatten the data into
			// a tabular recordset structure.

			var newRS = Spry.Data.JSONDataSet.flattenDataIntoRecordSet(row.ds_JSONObject, pathArray[j], isObjectOfArraysArr[j]);

			// If this subPath has additional subPaths beneath it,
			// flatten and join them with the recordset we just created.

			if (newRS && newRS.data && newRS.data.length)
			{
				if (typeof subPaths[j] == "object" && subPaths[j].subPaths)
				{
					// The subPaths property can be either an object path string,
					// an Object describing a subPath and paths beneath it,
					// or an Array of object path strings or objects. We need to
					// normalize these variations into an array to simplify
					// our processing.
	
					var sp = subPaths[j].subPaths;
					spType = typeof sp;
					if (spType == "string")
						sp = [ sp ];
					else if (spType == "object" && spType.constructor == Object)
						sp = [ sp ];
	
					// Now that we have a normalized array of sub paths, flatten
					// them and join them to the recordSet we just calculated.
	
					this.flattenSubPaths(newRS, sp);
				}
	
				var newRSData = newRS.data;
				var numRSRows = newRSData.length;
	
				var cleanedPath = cleanedPathArray[j] + ".";
				
				var numNewRows = newRows.length;
				var joinedRows = [];
	
				// Iterate over all rows in our newRows array. Note that the
				// contents of newRows changes after the execution of this
				// loop, allowing us to perform more joins when more than
				// one subPath is specified.
	
				for (var k = 0; k < numNewRows; k++)
				{
					var newRow = newRows[k];
	
					// Iterate over all rows in the record set generated
					// from the current subPath. We are going to create
					// m*n rows for the joined table, where m is the number
					// of rows in the newRows array, and n is the number of
					// rows in the current subPath recordset.
	
					for (var l = 0; l < numRSRows; l++)
					{
						// Create a new row that will house the join result.
	
						var newRowObj = new Object;
						var newRSRow = newRSData[l];
	
						// Copy the data from the current row of the record set
						// into our new row object, but make sure to store the
						// data in columns that have the subPath prepended to
						// it so that it doesn't collide with any columns from
						// the newRows row data.
	
						// Copy the props to the new object using the new property name.
						for (var prop in newRSRow)	
						{
							// The new propery name will have the subPath used prepended to it.
							var newPropName = cleanedPath + prop;
	
							// We need to handle the case where the property name of the object matched
							// by the object path has a value. In that specific case, the name of the
							// property should be the cleanedPath itself. For example:
							//
							//	{
							//		"employees":
							//			{
							//				"employee":
							//					[
							//						"Bob",
							//						"Joe"
							//					]
							//			}
							//	}
							//
							// Object Path: employees.employee
							//
							// The property name that contains "Bob" and "Joe" will be "employee".
							// So in our new row, we need to call this column "employees.employee"
							// instead of "employees.employee.employee" which would be incorrect.
	
							if (cleanedPath == prop || cleanedPath.search(new RegExp("\\." + prop + "\\.$")) != -1)
								newPropName = cleanedPathArray[j];
	
							// Copy the props to the new object using the new property name.

							newRowObj[newPropName] = newRSRow[prop];
						}
	
						// Now copy the columns from the newRow into our row
						// object.

						Spry.Data.JSONDataSet.copyProps(newRowObj, newRow);
	
						// Now add this row to the array that tracks all of the new
						// rows we've just created.
	
						joinedRows.push(newRowObj);
					}
				}

				// Set the newRows array equal to our joinedRows we just created,
				// so that when we flatten the data for the next subPath, it gets
				// joined with our new set of rows.

				newRows = joinedRows;
			}
		}

		newData = newData.concat(newRows);
	}

	// Now that we have a new set of joined rows, we need to run through
	// all of the rows and make sure they all have a unique row ID and
	// rebuild our dataHash.

	data = newData;
	numRows = data.length;

	for (i = 0; i < numRows; i++)
	{
		row = data[i];
		row.ds_RowID = i;
		dataHash[row.ds_RowID] = row;
	}

	// We're all done, so stuff the new data and dataHash
	// back into the base recordSet.

	rs.data = data;
	rs.dataHash = dataHash;
};

Spry.Data.JSONDataSet.prototype.parseJSON = function(str, filter)
{
	// The implementation of this JSON Parser is from the json.js (2007-03-20)
	// reference implementation from json.org. It was modified to accept the
	// JSON string as an arg, and throw a generic Error.
	//
	// Parsing happens in three stages. In the first stage, we run the text against
	// a regular expression which looks for non-JSON characters. We are especially
	// concerned with '()' and 'new' because they can cause invocation, and '='
	// because it can cause mutation. But just to be safe, we will reject all
	// unexpected characters.

	try
	{
		if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(str))
		{
			// In the second stage we use the eval function to compile the text into a
			// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
			// in JavaScript: it can begin a block or an object literal. We wrap the text
			// in parens to eliminate the ambiguity.

			var j = eval('(' + str + ')');

			// In the optional third stage, we recursively walk the new structure, passing
			// each name/value pair to a filter function for possible transformation.

			if (typeof filter === 'function')
			{
				function walk(k, v)
				{
					if (v && typeof v === 'object')
					{
						for (var i in v)
						{
							if (v.hasOwnProperty(i))
							{
								v[i] = walk(i, v[i]);
							}
						}
					}
					return filter(k, v);
				}

				j = walk('', j);
			}
			return j;
		}
	} catch (e) {
		// Fall through if the regexp test fails.
	}
	throw new Error("Failed to parse JSON string.");
};

Spry.Data.JSONDataSet.prototype.syncColumnTypesToData = function()
{
	// Run through every column in the first row and set the column type
	// to match the type of the value currently in the column, but only
	// if the column type is not already set.
	//
	// For the sake of performance, there are a couple of big assumptions
	// being made here. Specifically, we are assuming that *every* row in the
	// data set has the same set of column names defined, and that the value
	// for a specific column has the same type as a value in the same column
	// in any other row.

	var row = this.getData()[0];
	for (var colName in row)
	{
		if (!this.columnTypes[colName])
		{
			var type = typeof row[colName];
			if (type == "number")
				this.setColumnType(colName, type);
		}
	}
};

// Translate the raw JSON string (rawDataDoc) into an object, find the
// data within the object we are interested in, and flatten it into
// a set of rows for our data set.

Spry.Data.JSONDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	if (this.preparseFunc)
		rawDataDoc = this.preparseFunc(this, rawDataDoc);

	var jsonObj;
	try	{ jsonObj = this.useParser ? this.parseJSON(rawDataDoc) : eval("(" + rawDataDoc + ")"); }
	catch(e)
	{
		Spry.Debug.reportError("Caught exception in JSONDataSet.loadDataIntoDataSet: " + e);
		jsonObj = {};
	}

	if (jsonObj == null)
		jsonObj = "null";

	var rs = Spry.Data.JSONDataSet.flattenDataIntoRecordSet(jsonObj, Spry.Data.Region.processDataRefString(null, this.path, this.dataSetsForDataRefStrings), this.pathIsObjectOfArrays);

	this.flattenSubPaths(rs, this.subPaths);

	this.doc = rawDataDoc;
	this.docObj = jsonObj;
	this.data = rs.data;
	this.dataHash = rs.dataHash;
	this.dataWasLoaded = (this.doc != null);

	this.syncColumnTypesToData();
};
;// SpryNestedJSONDataSet.js - version 0.5 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Spry.Data.NestedJSONDataSet = function(parentDataSet, jpath, options)
{
	this.parentDataSet = parentDataSet;
	this.jpath = jpath;
	this.nestedDataSets = [];
	this.nestedDataSetsHash = {};
	this.currentDS = null;
	this.currentDSAncestor = null;
	this.options = options;
	this.ignoreOnDataChanged = false;

	Spry.Data.DataSet.call(this, options);

	parentDataSet.addObserver(this);
};

Spry.Data.NestedJSONDataSet.prototype = new Spry.Data.DataSet();
Spry.Data.NestedJSONDataSet.prototype.constructor = Spry.Data.NestedJSONDataSet.prototype;

Spry.Data.NestedJSONDataSet.prototype.getParentDataSet = function()
{
	return this.parentDataSet;
};

Spry.Data.NestedJSONDataSet.prototype.getNestedDataSetForParentRow = function(parentRow)
{
	// Return the internal nested data set associated with the parent's
	// specified row object.
	
	var jsonNode = parentRow.ds_JSONObject;
	if (jsonNode && this.nestedDataSets)
	{
		// Before we go through all of the trouble of looking up the data set
		// we want, check to see if it is already our current data set!
		
		if (this.currentDSAncestor && this.currentDSAncestor == jsonNode)
			return this.currentDS;

		// The caller is asking for a data set that isn't our current one.
		// Manually walk through all of the data sets we have, and return the
		// one that is associated with jsonNode.

		var nDSArr = this.nestedDataSets;
		var nDSArrLen = nDSArr.length;
		for (var i = 0; i < nDSArrLen; i++)
		{
			var dsObj = nDSArr[i];
			if (dsObj && jsonNode == dsObj.ancestor)
				return dsObj.dataSet;
		}
	}
	return null;
};

Spry.Data.NestedJSONDataSet.prototype.getNestedJSONDataSetsArray = function()
{
	// Return an array of all of our internal nested data sets.

	var resultsArray = [];
	if (this.nestedDataSets)
	{
		var arrDS = this.nestedDataSets;
		var numDS = this.nestedDataSets.length;
		for (var i = 0; i < numDS; i++)
			resultsArray.push(arrDS[i].dataSet);
	}
	return resultsArray;
};

Spry.Data.NestedJSONDataSet.prototype.onDataChanged = function(notifier, data)
{
	// This function gets called any time the *parent* data set gets changed.

	if (!this.ignoreOnDataChanged)
		this.loadData();
};

Spry.Data.NestedJSONDataSet.prototype.onCurrentRowChanged = function(notifier, data)
{
	// The current row for our parent data set changed. We need to sync
	// our internal state so that our current data set is the nested data
	// for the parent's current row.
	//
	// From the outside, this appears as if the *entire* data inside this
	// data set changes. We don't want any of our nested child data sets
	// to recalculate their internal nested data structures, we simply want
	// them to select the correct one from the set they already have. To do
	// this, we dispatch a pre and post context change message that allows
	// them to figure out what is going on, and that they can safely ignore
	// any onDataChanged message they get from their parent.

	this.notifyObservers("onPreParentContextChange");
	this.currentDS = null;
	this.currentDSAncestor = null;
	var pCurRow = this.parentDataSet.getCurrentRow();
	if (pCurRow)
	{
		var nestedDS = this.getNestedDataSetForParentRow(pCurRow);
		if (nestedDS)
		{
			this.currentDS = nestedDS;
			this.currentDSAncestor = pCurRow.ds_JSONObject;
		}
	}
	this.notifyObservers("onDataChanged");
	this.notifyObservers("onPostParentContextChange");
	this.ignoreOnDataChanged = false;
};

// If we get an onPostParentContextChange, we want to treat it as if we got an
// onCurrentRowChanged message from our parent, that way, we don't have to recalculate
// any of our internal data, we just have to select the correct data set
// that matches our parent's current row.

Spry.Data.NestedJSONDataSet.prototype.onPostParentContextChange = Spry.Data.NestedJSONDataSet.prototype.onCurrentRowChanged;
Spry.Data.NestedJSONDataSet.prototype.onPreParentContextChange = function(notifier, data)
{
	this.ignoreOnDataChanged = true;
};

Spry.Data.NestedJSONDataSet.prototype.filterAndSortData = function()
{
	// This method is almost identical to the one from the
	// DataSet base class, except that it does not set the
	// current row id.

	// If there is a data filter installed, run it.

	if (this.filterDataFunc)
		this.filterData(this.filterDataFunc, true);

	// If the distinct flag was set, run through all the records in the recordset
	// and toss out any that are duplicates.

	if (this.distinctOnLoad)
		this.distinct(this.distinctFieldsOnLoad);

	// If sortOnLoad was set, sort the data based on the columns
	// specified in sortOnLoad.

	if (this.keepSorted && this.getSortColumn())
		this.sort(this.lastSortColumns, this.lastSortOrder);
	else if (this.sortOnLoad)
		this.sort(this.sortOnLoad, this.sortOrderOnLoad);

	// If there is a view filter installed, run it.

	if (this.filterFunc)
		this.filter(this.filterFunc, true);
};

Spry.Data.NestedJSONDataSet.prototype.loadData = function()
{
	var parentDS = this.parentDataSet;

	if (!parentDS || parentDS.getLoadDataRequestIsPending() || !this.jpath)
		return;

	if (!parentDS.getDataWasLoaded())
	{
		// Someone is asking us to load our data, but our parent
		// hasn't even initiated a load yet. Tell our parent to
		// load its data, so we can get our data!

		parentDS.loadData();
		return;
	}

	this.notifyObservers("onPreLoad");

	this.nestedDataSets = [];
	this.currentDS = null;
	this.currentDSAncestor = null;

	this.data = [];
	this.dataHash = {};

	var self = this;

	var ancestorDS = [ parentDS ];
	if (parentDS.getNestedJSONDataSetsArray)
		ancestorDS = parentDS.getNestedJSONDataSetsArray();

	var currentAncestor = null;
	var currentAncestorRow = parentDS.getCurrentRow();
	if (currentAncestorRow)
		currentAncestor = currentAncestorRow.ds_JSONObject;

	var numAncestors = ancestorDS.length;
	for (var i = 0; i < numAncestors; i++)
	{
		// Run through each row of *every* ancestor data set and create
		// a nested data set.

		var aDS = ancestorDS[i];
		var aData = aDS.getData(true);
		if (aData)
		{
			var aDataLen = aData.length;
			for (var j = 0; j < aDataLen; j++)
			{
				var row = aData[j];
				if (row && row.ds_JSONObject)
				{
					// Create an internal nested data set for this row.

					var ds = new Spry.Data.DataSet(this.options);

					// Make sure the internal nested data set has the same set
					// of columnTypes as the nested data set itself.

					for (var cname in this.columnTypes)
						ds.setColumnType(cname, this.columnTypes[cname]);

					// Flatten any data that matches our XPath and stuff it into
					// our new nested data set.

					var dataArr = Spry.Data.JSONDataSet.flattenDataIntoRecordSet(row.ds_JSONObject, this.jpath);
					ds.setDataFromArray(dataArr.data, true);

					// Create an object that stores the relationship between our
					// internal nested data set, and the ancestor node that was used
					// extract the data for the data set.

					var dsObj = new Object;
					dsObj.ancestor = row.ds_JSONObject;
					dsObj.dataSet = ds;

					this.nestedDataSets.push(dsObj);

					// If this ancestor is the one for our parent's current row,
					// make the current data set our current data set.

					if (row.ds_JSONObject == currentAncestor)
					{
						this.currentDS = ds;
						this.currentDSAncestor = this.ds_JSONObject;
					}
		
					// Add an observer on the nested data set so that whenever it dispatches
					// a notifications, we forward it on as if we generated the notification.
		
					ds.addObserver(function(notificationType, notifier, data){ if (notifier == self.currentDS) setTimeout(function() { self.notifyObservers(notificationType, data); }, 0); });
				}
			}
		}
	}

	this.pendingRequest = new Object;
	this.dataWasLoaded = false;

	this.pendingRequest.timer = setTimeout(function() {
		self.pendingRequest = null;
		self.dataWasLoaded = true;

		self.disableNotifications();
		self.filterAndSortData();
		self.enableNotifications();

		self.notifyObservers("onPostLoad");
		self.notifyObservers("onDataChanged");
	}, 0);
};

Spry.Data.NestedJSONDataSet.prototype.getData = function(unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getData(unfiltered);
	return [];
};

Spry.Data.NestedJSONDataSet.prototype.getRowCount = function(unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getRowCount(unfiltered);
	return 0;
};

Spry.Data.NestedJSONDataSet.prototype.getRowByID = function(rowID)
{
	if (this.currentDS)
		return this.currentDS.getRowByID(rowID);
	return undefined;
};

Spry.Data.NestedJSONDataSet.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getRowByRowNumber(rowNumber, unfiltered);
	return null;
};

Spry.Data.NestedJSONDataSet.prototype.getCurrentRow = function()
{
	if (this.currentDS)
		return this.currentDS.getCurrentRow();
	return null;
};

Spry.Data.NestedJSONDataSet.prototype.setCurrentRow = function(rowID)
{
	if (this.currentDS)
		return this.currentDS.setCurrentRow(rowID);
};

Spry.Data.NestedJSONDataSet.prototype.getRowNumber = function(row)
{
	if (this.currentDS)
		return this.currentDS.getRowNumber(row);
	return 0;
};

Spry.Data.NestedJSONDataSet.prototype.getCurrentRowNumber = function()
{
	if (this.currentDS)
		return this.currentDS.getCurrentRowNumber();
	return 0;
};

Spry.Data.NestedJSONDataSet.prototype.getCurrentRowID = function()
{
	if (this.currentDS)
		return this.currentDS.getCurrentRowID();
	return 0;
};

Spry.Data.NestedJSONDataSet.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (this.currentDS)
		return this.currentDS.setCurrentRowNumber(rowNumber);
};

Spry.Data.NestedJSONDataSet.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	if (this.currentDS)
		return this.currentDS.findRowsWithColumnValues(valueObj, firstMatchOnly, unfiltered);
	return firstMatchOnly ? null : [];
};

Spry.Data.NestedJSONDataSet.prototype.setColumnType = function(columnNames, columnType)
{
	if (columnNames)
	{
		// Make sure the nested JSON data set tracks the column types
		// that the user sets so that if our data changes, we can re-apply
		// the column types.

		Spry.Data.DataSet.prototype.setColumnType.call(this, columnNames, columnType);

		// Now apply the column types to any internal nested data sets
		// that exist.

		var dsArr = this.nestedDataSets;
		var dsArrLen = dsArr.length;
		for (var i = 0; i < dsArrLen; i++)
			dsArr[i].dataSet.setColumnType(columnNames, columnType);
	}
};

Spry.Data.NestedJSONDataSet.prototype.getColumnType = function(columnName)
{
	if (this.currentDS)
		return this.currentDS.getColumnType(columnName);
	return "string";
};

Spry.Data.NestedJSONDataSet.prototype.distinct = function(columnNames)
{
	if (columnNames)
	{
		var dsArr = this.nestedDataSets;
		var dsArrLen = dsArr.length;
		for (var i = 0; i < dsArrLen; i++)
			dsArr[i].dataSet.distinct(columnNames);
	}
};

Spry.Data.NestedJSONDataSet.prototype.sort = function(columnNames, sortOrder)
{
	if (columnNames)
	{
		// Forward the sort request to all internal data sets.

		var dsArr = this.nestedDataSets;
		var dsArrLen = dsArr.length;
		for (var i = 0; i < dsArrLen; i++)
			dsArr[i].dataSet.sort(columnNames, sortOrder);

		// Make sure we store a local copy of the last sort order
		// column so we can restore it if new data is loaded.

		if (dsArrLen > 0)
		{
			var ds = dsArr[0].dataSet;
			this.lastSortColumns = ds.lastSortColumns.slice(0); // Copy the array.
			this.lastSortOrder = ds.lastSortOrder;
		}
	}
};

Spry.Data.NestedJSONDataSet.prototype.filterData = function(filterFunc, filterOnly)
{
	// Store a copy of the filterFunc so we can apply it
	// if the data set loads new data.

	this.filterDataFunc = filterFunc;

	// Now set the filterFunc on all of the internal
	// data sets.

	var dsArr = this.nestedDataSets;
	var dsArrLen = dsArr.length;
	for (var i = 0; i < dsArrLen; i++)
		dsArr[i].dataSet.filterData(filterFunc, filterOnly);
};

Spry.Data.NestedJSONDataSet.prototype.filter = function(filterFunc, filterOnly)
{
	// Store a copy of the filterFunc so we can apply it
	// if the data set loads new data.

	this.filterFunc = filterFunc;

	// Now set the filterFunc on all of the internal
	// data sets.

	var dsArr = this.nestedDataSets;
	var dsArrLen = dsArr.length;
	for (var i = 0; i < dsArrLen; i++)
		dsArr[i].dataSet.filter(filterFunc, filterOnly);
};
;// SpryNestedXMLDataSet.js - version 0.7 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Spry.Data.NestedXMLDataSet = function(parentDataSet, xpath, options)
{
	this.parentDataSet = parentDataSet;
	this.xpath = xpath;
	this.nestedDataSets = [];
	this.nestedDataSetsHash = {};
	this.currentDS = null;
	this.currentDSAncestor = null;
	this.options = options;
	this.ignoreOnDataChanged = false;
	this.entityEncodeStrings = parentDataSet ? parentDataSet.entityEncodeStrings : true;

	Spry.Data.DataSet.call(this, options);

	parentDataSet.addObserver(this);
};

Spry.Data.NestedXMLDataSet.prototype = new Spry.Data.DataSet();
Spry.Data.NestedXMLDataSet.prototype.constructor = Spry.Data.NestedXMLDataSet.prototype;

Spry.Data.NestedXMLDataSet.prototype.getParentDataSet = function()
{
	return this.parentDataSet;
};

Spry.Data.NestedXMLDataSet.prototype.getNestedDataSetForParentRow = function(parentRow)
{
	// Return the internal nested data set associated with the parent's
	// specified row object.
	
	var xmlNode = parentRow.ds_XMLNode;
	if (xmlNode && this.nestedDataSets)
	{
		// Before we go through all of the trouble of looking up the data set
		// we want, check to see if it is already our current data set!
		
		if (this.currentDSAncestor && this.currentDSAncestor == xmlNode)
			return this.currentDS;

		// The caller is asking for a data set that isn't our current one.
		// Manually walk through all of the data sets we have, and return the
		// one that is associated with xmlNode.

		var nDSArr = this.nestedDataSets;
		var nDSArrLen = nDSArr.length;
		for (var i = 0; i < nDSArrLen; i++)
		{
			var dsObj = nDSArr[i];
			if (dsObj && xmlNode == dsObj.ancestor)
				return dsObj.dataSet;
		}
	}
	return null;
};

Spry.Data.NestedXMLDataSet.prototype.getNestedXMLDataSetsArray = function()
{
	// Return an array of all of our internal nested data sets.

	var resultsArray = [];
	if (this.nestedDataSets)
	{
		var arrDS = this.nestedDataSets;
		var numDS = this.nestedDataSets.length;
		for (var i = 0; i < numDS; i++)
			resultsArray.push(arrDS[i].dataSet);
	}
	return resultsArray;
};

Spry.Data.NestedXMLDataSet.prototype.onDataChanged = function(notifier, data)
{
	// This function gets called any time the *parent* data set gets changed.

	if (!this.ignoreOnDataChanged)
		this.loadData();
};

Spry.Data.NestedXMLDataSet.prototype.onCurrentRowChanged = function(notifier, data)
{
	// The current row for our parent data set changed. We need to sync
	// our internal state so that our current data set is the nested data
	// for the parent's current row.
	//
	// From the outside, this appears as if the *entire* data inside this
	// data set changes. We don't want any of our nested child data sets
	// to recalculate their internal nested data structures, we simply want
	// them to select the correct one from the set they already have. To do
	// this, we dispatch a pre and post context change message that allows
	// them to figure out what is going on, and that they can safely ignore
	// any onDataChanged message they get from their parent.

	this.notifyObservers("onPreParentContextChange");
	this.currentDS = null;
	this.currentDSAncestor = null;
	var pCurRow = this.parentDataSet.getCurrentRow();
	if (pCurRow)
	{
		var nestedDS = this.getNestedDataSetForParentRow(pCurRow);
		if (nestedDS)
		{
			this.currentDS = nestedDS;
			this.currentDSAncestor = pCurRow.ds_XMLNode;
		}
	}
	this.notifyObservers("onDataChanged");
	this.notifyObservers("onPostParentContextChange");
	this.ignoreOnDataChanged = false;
};

// If we get an onPostParentContextChange, we want to treat it as if we got an
// onCurrentRowChanged message from our parent, that way, we don't have to recalculate
// any of our internal data, we just have to select the correct data set
// that matches our parent's current row.

Spry.Data.NestedXMLDataSet.prototype.onPostParentContextChange = Spry.Data.NestedXMLDataSet.prototype.onCurrentRowChanged;
Spry.Data.NestedXMLDataSet.prototype.onPreParentContextChange = function(notifier, data)
{
	this.ignoreOnDataChanged = true;
};

Spry.Data.NestedXMLDataSet.prototype.filterAndSortData = function()
{
	// This method is almost identical to the one from the
	// DataSet base class, except that it does not set the
	// current row id.

	// If there is a data filter installed, run it.

	if (this.filterDataFunc)
		this.filterData(this.filterDataFunc, true);

	// If the distinct flag was set, run through all the records in the recordset
	// and toss out any that are duplicates.

	if (this.distinctOnLoad)
		this.distinct(this.distinctFieldsOnLoad);

	// If sortOnLoad was set, sort the data based on the columns
	// specified in sortOnLoad.

	if (this.keepSorted && this.getSortColumn())
		this.sort(this.lastSortColumns, this.lastSortOrder);
	else if (this.sortOnLoad)
		this.sort(this.sortOnLoad, this.sortOrderOnLoad);

	// If there is a view filter installed, run it.

	if (this.filterFunc)
		this.filter(this.filterFunc, true);
};

Spry.Data.NestedXMLDataSet.prototype.loadData = function()
{
	var parentDS = this.parentDataSet;

	if (!parentDS || parentDS.getLoadDataRequestIsPending() || !this.xpath)
		return;

	if (!parentDS.getDataWasLoaded())
	{
		// Someone is asking us to load our data, but our parent
		// hasn't even initiated a load yet. Tell our parent to
		// load its data, so we can get our data!

		parentDS.loadData();
		return;
	}

	this.notifyObservers("onPreLoad");

	this.nestedDataSets = [];
	this.currentDS = null;
	this.currentDSAncestor = null;

	this.data = [];
	this.dataHash = {};

	var self = this;

	var ancestorDS = [ parentDS ];
	if (parentDS.getNestedXMLDataSetsArray)
		ancestorDS = parentDS.getNestedXMLDataSetsArray();

	var currentAncestor = null;
	var currentAncestorRow = parentDS.getCurrentRow();
	if (currentAncestorRow)
		currentAncestor = currentAncestorRow.ds_XMLNode;

	var numAncestors = ancestorDS.length;
	for (var i = 0; i < numAncestors; i++)
	{
		// Run through each row of *every* ancestor data set and create
		// a nested data set.

		var aDS = ancestorDS[i];
		var aData = aDS.getData(true);
		if (aData)
		{
			var aDataLen = aData.length;
			for (var j = 0; j < aDataLen; j++)
			{
				var row = aData[j];
				if (row && row.ds_XMLNode)
				{
					// Create an internal nested data set for this row.

					var ds = new Spry.Data.DataSet(this.options);

					// Make sure the internal nested data set has the same set
					// of columnTypes as the nested data set itself.

					for (var cname in this.columnTypes)
						ds.setColumnType(cname, this.columnTypes[cname]);

					// Flatten any data that matches our XPath and stuff it into
					// our new nested data set.

					var dataArr = Spry.Data.XMLDataSet.getRecordSetFromXMLDoc(row.ds_XMLNode, this.xpath, false, this.entityEncodeStrings);
					ds.setDataFromArray(dataArr.data, true);

					// Create an object that stores the relationship between our
					// internal nested data set, and the ancestor node that was used
					// extract the data for the data set.

					var dsObj = new Object;
					dsObj.ancestor = row.ds_XMLNode;
					dsObj.dataSet = ds;

					this.nestedDataSets.push(dsObj);

					// If this ancestor is the one for our parent's current row,
					// make the current data set our current data set.

					if (row.ds_XMLNode == currentAncestor)
					{
						this.currentDS = ds;
						this.currentDSAncestor = this.ds_XMLNode;
					}
		
					// Add an observer on the nested data set so that whenever it dispatches
					// a notifications, we forward it on as if we generated the notification.
		
					ds.addObserver(function(notificationType, notifier, data){ if (notifier == self.currentDS) setTimeout(function() { self.notifyObservers(notificationType, data); }, 0); });
				}
			}
		}
	}

	this.pendingRequest = new Object;
	this.dataWasLoaded = false;

	this.pendingRequest.timer = setTimeout(function() {
		self.pendingRequest = null;
		self.dataWasLoaded = true;

		self.disableNotifications();
		self.filterAndSortData();
		self.enableNotifications();

		self.notifyObservers("onPostLoad");
		self.notifyObservers("onDataChanged");
	}, 0);
};

Spry.Data.NestedXMLDataSet.prototype.getData = function(unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getData(unfiltered);
	return [];
};

Spry.Data.NestedXMLDataSet.prototype.getRowCount = function(unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getRowCount(unfiltered);
	return 0;
};

Spry.Data.NestedXMLDataSet.prototype.getRowByID = function(rowID)
{
	if (this.currentDS)
		return this.currentDS.getRowByID(rowID);
	return undefined;
};

Spry.Data.NestedXMLDataSet.prototype.getRowByRowNumber = function(rowNumber, unfiltered)
{
	if (this.currentDS)
		return this.currentDS.getRowByRowNumber(rowNumber, unfiltered);
	return null;
};

Spry.Data.NestedXMLDataSet.prototype.getCurrentRow = function()
{
	if (this.currentDS)
		return this.currentDS.getCurrentRow();
	return null;
};

Spry.Data.NestedXMLDataSet.prototype.setCurrentRow = function(rowID)
{
	if (this.currentDS)
		return this.currentDS.setCurrentRow(rowID);
};

Spry.Data.NestedXMLDataSet.prototype.getRowNumber = function(row)
{
	if (this.currentDS)
		return this.currentDS.getRowNumber(row);
	return 0;
};

Spry.Data.NestedXMLDataSet.prototype.getCurrentRowNumber = function()
{
	if (this.currentDS)
		return this.currentDS.getCurrentRowNumber();
	return 0;
};

Spry.Data.NestedXMLDataSet.prototype.getCurrentRowID = function()
{
	if (this.currentDS)
		return this.currentDS.getCurrentRowID();
	return 0;
};

Spry.Data.NestedXMLDataSet.prototype.setCurrentRowNumber = function(rowNumber)
{
	if (this.currentDS)
		return this.currentDS.setCurrentRowNumber(rowNumber);
};

Spry.Data.NestedXMLDataSet.prototype.findRowsWithColumnValues = function(valueObj, firstMatchOnly, unfiltered)
{
	if (this.currentDS)
		return this.currentDS.findRowsWithColumnValues(valueObj, firstMatchOnly, unfiltered);
	return firstMatchOnly ? null : [];
};

Spry.Data.NestedXMLDataSet.prototype.setColumnType = function(columnNames, columnType)
{
	if (columnNames)
	{
		// Make sure the nested xml data set tracks the column types
		// that the user sets so that if our data changes, we can re-apply
		// the column types.

		Spry.Data.DataSet.prototype.setColumnType.call(this, columnNames, columnType);

		// Now apply the column types to any internal nested data sets
		// that exist.

		var dsArr = this.nestedDataSets;
		var dsArrLen = dsArr.length;
		for (var i = 0; i < dsArrLen; i++)
			dsArr[i].dataSet.setColumnType(columnNames, columnType);
	}
};

Spry.Data.NestedXMLDataSet.prototype.getColumnType = function(columnName)
{
	if (this.currentDS)
		return this.currentDS.getColumnType(columnName);
	return "string";
};

Spry.Data.NestedXMLDataSet.prototype.distinct = function(columnNames)
{
	if (columnNames)
	{
		var dsArr = this.nestedDataSets;
		var dsArrLen = dsArr.length;
		for (var i = 0; i < dsArrLen; i++)
			dsArr[i].dataSet.distinct(columnNames);
	}
};

Spry.Data.NestedXMLDataSet.prototype.sort = function(columnNames, sortOrder)
{
	if (columnNames)
	{
		// Forward the sort request to all internal data sets.

		var dsArr = this.nestedDataSets;
		var dsArrLen = dsArr.length;
		for (var i = 0; i < dsArrLen; i++)
			dsArr[i].dataSet.sort(columnNames, sortOrder);

		// Make sure we store a local copy of the last sort order
		// column so we can restore it if new data is loaded.

		if (dsArrLen > 0)
		{
			var ds = dsArr[0].dataSet;
			this.lastSortColumns = ds.lastSortColumns.slice(0); // Copy the array.
			this.lastSortOrder = ds.lastSortOrder;
		}
	}
};

Spry.Data.NestedXMLDataSet.prototype.filterData = function(filterFunc, filterOnly)
{
	// Store a copy of the filterFunc so we can apply it
	// if the data set loads new data.

	this.filterDataFunc = filterFunc;

	// Now set the filterFunc on all of the internal
	// data sets.

	var dsArr = this.nestedDataSets;
	var dsArrLen = dsArr.length;
	for (var i = 0; i < dsArrLen; i++)
		dsArr[i].dataSet.filterData(filterFunc, filterOnly);
};

Spry.Data.NestedXMLDataSet.prototype.filter = function(filterFunc, filterOnly)
{
	// Store a copy of the filterFunc so we can apply it
	// if the data set loads new data.

	this.filterFunc = filterFunc;

	// Now set the filterFunc on all of the internal
	// data sets.

	var dsArr = this.nestedDataSets;
	var dsArrLen = dsArr.length;
	for (var i = 0; i < dsArrLen; i++)
		dsArr[i].dataSet.filter(filterFunc, filterOnly);
};

Spry.Data.NestedXMLDataSet.prototype.setXPath = function(path)
{
	if (this.xpath != path)
	{
		this.xpath = path;
		this.loadData();
	}
};;// SpryNotifier.js - version 0.1 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.Notifier = function()
{
	this.observers = [];
	this.suppressNotifications = 0;
};

Spry.Utils.Notifier.prototype.addObserver = function(observer)
{
	if (!observer)
		return;

	// Make sure the observer isn't already on the list.

	var len = this.observers.length;
	for (var i = 0; i < len; i++)
	{
		if (this.observers[i] == observer)
			return;
	}
	this.observers[len] = observer;
};

Spry.Utils.Notifier.prototype.removeObserver = function(observer)
{
	if (!observer)
		return;

	for (var i = 0; i < this.observers.length; i++)
	{
		if (this.observers[i] == observer)
		{
			this.observers.splice(i, 1);
			break;
		}
	}
};

Spry.Utils.Notifier.prototype.notifyObservers = function(methodName, data)
{
	if (!methodName)
		return;

	if (!this.suppressNotifications)
	{
		var len = this.observers.length;
		for (var i = 0; i < len; i++)
		{
			var obs = this.observers[i];
			if (obs)
			{
				if (typeof obs == "function")
					obs(methodName, this, data);
				else if (obs[methodName])
					obs[methodName](this, data);
			}
		}
	}
};

Spry.Utils.Notifier.prototype.enableNotifications = function()
{
	if (--this.suppressNotifications < 0)
	{
		this.suppressNotifications = 0;
		Spry.Debug.reportError("Unbalanced enableNotifications() call!\n");
	}
};

Spry.Utils.Notifier.prototype.disableNotifications = function()
{
	++this.suppressNotifications;
};
;// SpryPagedView.js - version 0.7 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Data) Spry.Data = {};

Spry.Data.PagedView = function(ds, options)
{
	Spry.Data.DataSet.call(this);

	this.ds = ds;

	// The max number of rows in a given page.

	this.pageSize = 10;

	// The unfiltered row index of the first item on the
	// current page.

	this.pageOffset = 0;

	// Does the user want the last page of data to always
	// be a full page? Default allows the last page to be
	// less than a page full.

	this.forceFullPages = false;

	// The unfiltered row index of the first item on the
	// current page. This may differ from the value in
	// this.pageOffset when forceFullPages is true and
	// the last page is being viewed.

	this.pageFirstItemOffset = 0;

	// Does the user want to use zero-based page indexes?
	// Default is one-based.

	this.useZeroBasedIndexes = false;

	// Does the user want to force the current row of the
	// data set being paged to always be on the current page?

	this.setCurrentRowOnPageChange = false;

	Spry.Utils.setOptions(this, options);

	// Set the adjustmentValue *after* options are set.
	// adjustmentValue is used in calculations to make sure
	// we calculate correct values in either zero-based or
	// one-based page index mode.

	this.adjustmentValue = 1;
	if (!this.useZeroBasedIndexes)
		this.adjustmentValue = 0;

	// Init the pageStop after the options are set.
	this.pageStop = this.pageOffset + this.pageSize;

	// Set up a dependency on the data set that was
	// passed into our constructor.

	this.ds.addObserver(this);

	// Extract and pre-process any data in the data set
	// if it exists.

	this.preProcessData();

	// Set up an initial filter if necessary on this data set so that
	// any data that is loaded is paged immediately.

	if (this.pageSize > 0)
		this.filter(this.getFilterFunc());
};

Spry.Data.PagedView.prototype = new Spry.Data.DataSet();
Spry.Data.PagedView.prototype.constructor = Spry.Data.PagedView;

Spry.Data.PagedView.prototype.setCurrentRow = function(rowID)
{
	// Pass on any setCurrentRow calls to the data set we
	// depend on.

	if (this.ds)
		this.ds.setCurrentRow(rowID);
};

Spry.Data.PagedView.prototype.setCurrentRowNumber = function(rowNumber)
{
	// Pass on any setCurrentRowNumber calls to the data set we
	// depend on.

	if (this.ds)
		this.ds.setCurrentRowNumber(rowNumber);
};

Spry.Data.PagedView.prototype.sort = function(columnNames, sortOrder)
{
	// We try to discourage developers from sorting the "view"
	// for a data set instead of the "view itself, but since this
	// "view" is implemented as a data set, some still insist on
	// sorting the "view".

	if (!columnNames)
		return;

	// We need to calculate the sort order and the set of columnNames
	// we are going to use so we can pass it when we fire off our
	// onPreSort and onPostSort notifications.

	if (typeof columnNames == "string")
		columnNames = [ columnNames, "ds_RowID" ];
	else if (columnNames.length < 2 && columnNames[0] != "ds_RowID")
		columnNames.push("ds_RowID");

	if (!sortOrder)
		sortOrder = "toggle";

	if (sortOrder == "toggle")
	{
		if (this.lastSortColumns.length > 0 && this.lastSortColumns[0] == columnNames[0] && this.lastSortOrder == "ascending")
			sortOrder = "descending";
		else
			sortOrder = "ascending";
	}

	var nData = {
		oldSortColumns: this.lastSortColumns,
		oldSortOrder: this.lastSortOrder,
		newSortColumns: columnNames,
		newSortOrder: sortOrder
	};


	this.notifyObservers("onPreSort", nData);

	// Disable notifications so that when we call our inherited
	// sort function, no notifications get fired off. We want to
	// delay any onPostSort notification until *after* we get a chance
	// to update our pager columns and reset the view to the first
	// page.

	this.disableNotifications();

	Spry.Data.DataSet.prototype.sort.call(this, columnNames, sortOrder);
	this.updatePagerColumns();
	this.firstPage();

	this.enableNotifications();

	this.notifyObservers("onPostSort", nData);
};

Spry.Data.PagedView.prototype.loadData = function()
{
	// Pass on any loadData requests to the data set we
	// depend on. This data set will automatically be notified
	// when the data set we depend on is done loading and will
	// update our data at that point.

	if (!this.ds || this.ds.getLoadDataRequestIsPending())
		return;

	if (!this.ds.getDataWasLoaded())
	{
		this.ds.loadData();
		return;
	}

	Spry.Data.DataSet.prototype.loadData.call(this);
};

Spry.Data.PagedView.prototype.onDataChanged = function(notifier, data)
{
	// The data in the data set we depend on has changed.
	// We need to extract and pre-process its data.

	this.setPageOffset(0);
	this.preProcessData();
};

Spry.Data.PagedView.prototype.onCurrentRowChanged = function(notifier, data)
{
	// this.preProcessData();
	var self = this;
	setTimeout(function() { self.notifyObservers("onCurrentRowChanged", data); }, 0);
};

Spry.Data.PagedView.prototype.onPostSort = Spry.Data.PagedView.prototype.onDataChanged;

Spry.Data.PagedView.prototype.updatePagerColumns = function()
{
	var rows = this.getData(true);
	if (!rows || rows.length < 1)
		return;

	var numRows = rows.length;
	var pageSize = (this.pageSize > 0) ? this.pageSize : numRows;
	var firstItem = 1;
	var lastItem = firstItem + pageSize - 1;
	lastItem = (lastItem < firstItem) ? firstItem : (lastItem > numRows ? numRows : lastItem);

	var pageNum = 1;
	var pageCount = parseInt((numRows + pageSize - 1) / pageSize);
	var pageItemCount = Math.min(numRows, pageSize);

	for (var i = 0; i < numRows; i++)
	{
		itemIndex = i + 1;
		if (itemIndex > lastItem)
		{
			firstItem = itemIndex;
			lastItem = firstItem + this.pageSize - 1;
			lastItem = (lastItem > numRows) ? numRows : lastItem;
			pageItemCount = Math.min(lastItem - firstItem + 1, pageSize);
			++pageNum;
		}
		var row = rows[i];
		if (row)
		{
			row.ds_PageNumber = pageNum;
			row.ds_PageSize = this.pageSize;
			row.ds_PageItemRowNumber = i;
			row.ds_PageItemNumber = itemIndex;
			row.ds_PageFirstItemNumber = firstItem;
			row.ds_PageLastItemNumber = lastItem;
			row.ds_PageItemCount = pageItemCount;
			row.ds_PageCount = pageCount;
			row.ds_PageTotalItemCount = numRows;
		}
	}
};

Spry.Data.PagedView.prototype.preProcessData = function()
{
	if (!this.ds || !this.ds.getDataWasLoaded())
		return;

	this.notifyObservers("onPreLoad");

	this.unfilteredData = null;
	this.data = [];
	this.dataHash = {};
	var rows = this.ds.getData();

	if (rows)
	{
		// Make a copy of the rows in the data set we are
		// going to page. We need to do this because we are going to
		// add custom columns to the rows that the Pager manages.

		var numRows = rows.length;

		for (var i = 0; i < numRows; i++)
		{
			var row = rows[i];
			var newRow = new Object();
			Spry.Utils.setOptions(newRow, row);
			this.data.push(newRow);
			this.dataHash[newRow.ds_RowID] = newRow;
		}

		if (numRows > 0)
			this.curRowID = rows[0].ds_RowID;
		this.updatePagerColumns();
	}

	// this.notifyObservers("onPostLoad");

	this.loadData();
};

Spry.Data.PagedView.prototype.getFilterFunc = function()
{
	var self = this;
	return function(ds, row, rowNumber) {
		if (rowNumber < self.pageOffset || rowNumber >= self.pageStop)
			return null;
		return row;
	};
};

Spry.Data.PagedView.prototype.setPageOffset = function(offset)
{
	var numRows = this.getData(true).length;

	this.pageFirstItemOffset = (offset < 0) ? 0 : offset;

	if (this.forceFullPages && offset > (numRows - this.pageSize))
		offset = numRows - this.pageSize;

	if (offset < 0)
		offset = 0;

	this.pageOffset = offset;
	this.pageStop = offset + this.pageSize;
};

Spry.Data.PagedView.prototype.filterDataSet = function(offset)
{
	if (this.pageSize < 1)
		return;

	this.setPageOffset(offset);

	// We need to reset the Pager's current row to the first
	// item in the page so that any regions that use the built-in
	// pager data references get refreshed to the correct data values.

	var rows = this.getData(true);
	if (rows && rows.length && rows[this.pageFirstItemOffset])
		this.curRowID = rows[this.pageFirstItemOffset].ds_RowID;

	if (this.setCurrentRowOnPageChange)
		this.ds.setCurrentRow(this.curRowID);

	// Re-apply our non-destructive filter on the ds:
	this.filter(this.getFilterFunc());
};

Spry.Data.PagedView.prototype.getPageCount = function()
{
	return parseInt((this.getData(true).length + this.pageSize - 1) / this.pageSize);
};

Spry.Data.PagedView.prototype.getCurrentPage = function()
{
	return parseInt((((this.pageFirstItemOffset != this.pageOffset) ? this.pageFirstItemOffset : this.pageOffset) + this.pageSize) / this.pageSize) - this.adjustmentValue;
};

Spry.Data.PagedView.prototype.goToPage = function(pageNum)
{
	pageNum = parseInt(pageNum);

	var numPages = this.getPageCount();
	if ((pageNum + this.adjustmentValue) < 1 || (pageNum + this.adjustmentValue) > numPages)
		return;
	var newOffset = (pageNum - 1 + this.adjustmentValue) * this.pageSize;
	this.filterDataSet(newOffset);
};

Spry.Data.PagedView.prototype.goToPageContainingRowID = function(rowID)
{
	this.goToPageContainingRowNumber(this.getRowNumber(this.getRowByID(rowID), true));
};

Spry.Data.PagedView.prototype.goToPageContainingRowNumber = function(rowNumber)
{
	// rowNumber should be the zero based index of the row in the
	// unfiltered data set!

	this.goToPage(this.getPageForRowNumber(rowNumber));
};

Spry.Data.PagedView.prototype.goToPageContainingItemNumber = function(itemNumber)
{
	// Item number is the same as the unfiltered row number plus one, so just subract
	// one to get the row number we need.

	this.goToPageContainingRowNumber(itemNumber - 1);
};

Spry.Data.PagedView.prototype.firstPage = function()
{
	this.goToPage(1 - this.adjustmentValue);
};

Spry.Data.PagedView.prototype.lastPage = function()
{
	this.goToPage(this.getPageCount() - this.adjustmentValue);
};

Spry.Data.PagedView.prototype.previousPage = function()
{
	this.goToPage(this.getCurrentPage() - 1);
};

Spry.Data.PagedView.prototype.nextPage = function()
{
	this.goToPage(this.getCurrentPage() + 1);
};

Spry.Data.PagedView.prototype.getPageForRowID = function(rowID)
{
	return this.getPageForRowNumber(this.getRowNumber(this.getRowByID(rowID), true));
};

Spry.Data.PagedView.prototype.getPageForRowNumber = function(rowNumber)
{
	return parseInt(rowNumber / this.pageSize) + 1 - this.adjustmentValue;
};

Spry.Data.PagedView.prototype.getPageForItemNumber = function(itemNumber)
{
	return this.getPageForRowNumber(itemNumber - 1);
};

Spry.Data.PagedView.prototype.getPageSize = function()
{
	return this.pageSize;
};

Spry.Data.PagedView.prototype.setPageSize = function(pageSize)
{
	if (this.pageSize == pageSize)
		return;

	if (pageSize < 1)
	{
		// The caller is trying to shut off paging. Remove the filter
		// we installed on the data set.

		this.pageSize = 0;
		this.setPageOffset(0);
		this.updatePagerColumns();
		this.filter(null);
	}
	else if (this.pageSize < 1)
	{
		this.pageSize = pageSize;
		this.setPageOffset(0);
		this.updatePagerColumns();
		this.filterDataSet(this.pageOffset);
	}
	else
	{
		// The caller is adjusting the pageSize, so go to the page
		// that contains the current pageOffset.

		this.pageSize = pageSize;
		this.updatePagerColumns();
		this.goToPage(this.getPageForRowNumber(this.pageFirstItemOffset));
	}
};

Spry.Data.PagedView.prototype.getPagingInfo = function()
{
	return new Spry.Data.PagedView.PagingInfo(this);
};

Spry.Data.PagedView.PagingInfo = function(pagedView)
{
	Spry.Data.DataSet.call(this);
	this.pagedView = pagedView;
	pagedView.addObserver(this);
};

Spry.Data.PagedView.PagingInfo.prototype = new Spry.Data.DataSet();
Spry.Data.PagedView.PagingInfo.prototype.constructor = Spry.Data.PagedView.PagingInfo;

Spry.Data.PagedView.PagingInfo.prototype.onDataChanged = function(notifier, data)
{
	this.extractInfo();
};

Spry.Data.PagedView.PagingInfo.prototype.onPostSort = Spry.Data.PagedView.PagingInfo.prototype.onDataChanged;

Spry.Data.PagedView.PagingInfo.prototype.extractInfo = function()
{
	var pv = this.pagedView;
	if (!pv || !pv.getDataWasLoaded())
		return;

	this.notifyObservers("onPreLoad");

	this.unfilteredData = null;
	this.data = [];
	this.dataHash = {};
	var rows = pv.getData(true);

	if (rows)
	{
		var numRows = rows.length;
		var numPages = pv.getPageCount();
		var i = 0;
		var id = 0;

		while (i < numRows)
		{
			var row = rows[i];
			var newRow = new Object();
			newRow.ds_RowID = id++;
			this.data.push(newRow);
			this.dataHash[newRow.ds_RowID] = newRow;
			
			newRow.ds_PageNumber = row.ds_PageNumber;
			newRow.ds_PageSize = row.ds_PageSize;
			newRow.ds_PageCount = row.ds_PageCount;
			newRow.ds_PageFirstItemNumber = row.ds_PageFirstItemNumber;
			newRow.ds_PageLastItemNumber = row.ds_PageLastItemNumber;
			newRow.ds_PageItemCount = row.ds_PageItemCount;
			newRow.ds_PageTotalItemCount = row.ds_PageTotalItemCount;
			i += newRow.ds_PageSize;
		}
		
		if (numRows > 0)
		{
			var self = this;
			var func = function(notificationType, notifier, data) {
				if (notificationType != "onPostLoad")
					return;
				self.removeObserver(func);
				self.setCurrentRowNumber(pv.getCurrentPage() - (pv.useZeroBasedIndexes ? 0 : 1));
 			};
			this.addObserver(func);
		}
	}

	// this.notifyObservers("onPostLoad");

	this.loadData();
};
;// SpryTSVDataSet.js - version 0.2 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Spry.Data.TSVDataSet = function(dataSetURL, dataSetOptions)
{
	// Call the constructor for our HTTPSourceDataSet base class so that
	// our base class properties get defined.

	Spry.Data.HTTPSourceDataSet.call(this, dataSetURL, dataSetOptions);

	this.delimiter = "\t";
	this.firstRowAsHeaders = true;
	this.columnNames = [];
	this.columnNames = [];

	Spry.Utils.setOptions(this, dataSetOptions);
}; // End of Spry.Data.TSVDataSet() constructor.

Spry.Data.TSVDataSet.prototype = new Spry.Data.HTTPSourceDataSet();
Spry.Data.TSVDataSet.prototype.constructor = Spry.Data.TSVDataSet;

// Override the inherited version of getDataRefStrings() with our
// own version that returns the strings memebers we maintain that
// may have data references in them.

Spry.Data.TSVDataSet.prototype.getDataRefStrings = function()
{
	var strArr = [];
	if (this.url) strArr.push(this.url);
	return strArr;
};

Spry.Data.TSVDataSet.prototype.getDocument = function() { return this.doc; };

Spry.Data.TSVDataSet.prototype.columnNumberToColumnName = function(colNum)
{
	var colName = this.columnNames[colNum];
	if (!colName)
		colName = "column" + colNum;
	return colName;
};

// Translate the raw TSV string (rawDataDoc) into an array of row objects.

Spry.Data.TSVDataSet.prototype.loadDataIntoDataSet = function(rawDataDoc)
{
	var data = new Array();
	var dataHash = new Object();

	var s = rawDataDoc ? rawDataDoc : "";
	var strLen = s.length;
	var i = 0;
	var done = false;

	var firstRowAsHeaders = this.firstRowAsHeaders;

	var searchStartIndex = 0;
	var regexp = /[^\r\n]+|(\r\n|\r|\n)/mg;

	var results = regexp.exec(s);
	var rowObj = null;
	var columnNum = -1;
	var rowID = 0;

	while (results && results[0])
	{
		var r = results[0];
		if (r == "\r\n" || r == "\r" || r == "\n")
		{
			if (!firstRowAsHeaders)
			{
				rowObj.ds_RowID = rowID++;
				data.push(rowObj);
				dataHash[rowObj.ds_RowID] = rowObj;
				rowObj = null;
			}
			firstRowAsHeaders = false;
			columnNum = -1;
		}
		else
		{
			var fields = r.split(this.delimiter);
			for (var i = 0; i < fields.length; i++)
			{
				if (firstRowAsHeaders)
						this.columnNames[++columnNum] = fields[i];
				else
				{
					if (++columnNum == 0)
						rowObj = new Object;
					rowObj[this.columnNumberToColumnName(columnNum)] = fields[i];
				}
			}
		}

		searchStartIndex = regexp.lastIndex;
		results = regexp.exec(s);
	}
	
	this.doc = rawDataDoc;
	this.data = data;
	this.dataHash = dataHash;
	this.dataWasLoaded = (this.doc != null);
};
;// SpryURLUtils.js - version 0.1 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

// Spry.Utils.urlComponentToObject
//
// Given a URL component of name value pairs, it returns an object that has the
// the URL component names as properties, and the URL component values as the value
// of those properties.
//
// The paramSeparator and nameValueSeparator args are optional. If not specified,
// the default paramSeparator is '&' and the default nameValueSeparator is '='.

Spry.Utils.urlComponentToObject = function(ucStr, paramSeparator, nameValueSeparator)
{
	var o = new Object;
	if (ucStr)
	{
		if (!paramSeparator) paramSeparator = "&";
		if (!nameValueSeparator) nameValueSeparator = "=";
		var params = ucStr.split(paramSeparator);
		for (var i = 0; i < params.length; i++)
		{
			var a = params[i].split(nameValueSeparator);
			var n = decodeURIComponent(a[0]?a[0]:"");
			var v = decodeURIComponent(a[1]?a[1]:"");
			if (v.match(/^0$|^[1-9]\d*$/))
				v = parseInt(v);
			if (typeof o[n] == "undefined")
				o[n] = v;
			else			
			{
				if (typeof o[n] != "object")
				{
					var t = o[n];
					o[n] = new Array;
					o[n].push(t);
				}
				o[n].push(v);
			}
		}
	}
	return o;
};

// Spry.Utils.getLocationHashParamsAsObject
//
// Returns window.location.hash as an object that has the the URL component
// names as properties, and the URL component values as the value of those properties.

Spry.Utils.getLocationHashParamsAsObject = function(paramSeparator, nameValueSeparator)
{
	return Spry.Utils.urlComponentToObject(window.location.hash.replace(/^#/, ""), paramSeparator, nameValueSeparator);
};

// Spry.Utils.getLocationParamsAsObject
//
// Returns window.location.search as an object that has the the URL component
// names as properties, and the URL component values as the value of those properties.

Spry.Utils.getLocationParamsAsObject = function()
{
	return Spry.Utils.urlComponentToObject(window.location.search.replace(/^\?/, ""));
};

// Spry.Utils.getURLHashParamsAsObject
//
// Given a url string, extracts out the URL component that follows the '#' character
// and returns an object that has the the URL component names as properties, and the
// URL component values as the value of those properties.
//
// The paramSeparator and nameValueSeparator args are optional. If not specified,
// the default paramSeparator is '&' and the default nameValueSeparator is '='.

Spry.Utils.getURLHashParamsAsObject = function(url, paramSeparator, nameValueSeparator)
{
	var i;
	if (url && (i = url.search("#")) >= 0)
		return Spry.Utils.urlComponentToObject(url.substr(i+1), paramSeparator, nameValueSeparator);
	return new Object;
};

// Spry.Utils.getURLParamsAsObject
//
// Given a url string, extracts out the URL component that follows the '?' character
// and returns an object that has the the URL component names as properties, and the
// URL component values as the value of those properties.

Spry.Utils.getURLParamsAsObject = function(url)
{
	var s;
	if (url && (s = url.match(/\?[^#]*/)) && s)
		return Spry.Utils.urlComponentToObject(s[0].replace(/^\?/, ""));
	return new Object;
};
;// SpryUtils.js - version 0.3 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};


Spry.Utils.submitForm = function(form, callback, opts)
{
	if (!form)
		return true;

	if ( typeof form == 'string' )
		form = Spry.$(form) || document.forms[form];

	var frmOpts = {};
	frmOpts.method = form.getAttribute('method');
	frmOpts.url = form.getAttribute('action') || document.location.href;
	frmOpts.enctype = form.getAttribute('enctype');

	Spry.Utils.setOptions(frmOpts, opts);

	var submitData = Spry.Utils.extractParamsFromForm(form, frmOpts.elements);
	if (frmOpts.additionalData)
		submitData += "&" + frmOpts.additionalData;

	if (!frmOpts.enctype || frmOpts.enctype.toLowerCase() != 'multipart/form-data')
	{
		// Ajax submission of a form doesn't work for multipart/form-data!
		frmOpts.method = (frmOpts.method && frmOpts.method.toLowerCase() == "post") ? 'POST' : 'GET';
		if (frmOpts.method == "GET")
		{
			// Data will be submitted in the url.
			if (frmOpts.url.indexOf('?') == -1)
				frmOpts.url += '?';
			else
				frmOpts.url += '&';
			frmOpts.url += submitData;
		}
		else
		{
			// Send Content-Type header.
			if (!frmOpts.headers) frmOpts.headers = {};
			if (!frmOpts.headers['Content-Type'] || frmOpts.headers['Content-Type'].indexOf("application/x-www-form-urlencoded") ==-1 )
				frmOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded';

			// Set the postData
			frmOpts.postData = submitData;
		}

		Spry.Utils.loadURL(frmOpts.method, frmOpts.url, true, callback, frmOpts);
		return false;
	}

	// Native submission when 'multipart/form-data' is used.
	return true;
};


Spry.Utils.extractParamsFromForm = function (form, elements)
{
	if (!form)
		return '';

	if ( typeof form == 'string' )
		form = document.getElementById(form) || document.forms[form];

	var formElements;
	if (elements)
		formElements = ',' + elements.join(',') + ',';

	var compStack = new Array(); // key=value pairs

	var el;
	for (var i = 0; i < form.elements.length; i++ )
	{
		el = form.elements[i];
		if (el.disabled || !el.name)
		{
			// Don't submit disabled elements.
			// Don't submit elements without name.
			continue;
		}

		if (!el.type)
		{
			// It seems that this element doesn't have a type set,
			// so skip it.
			continue;
		}

		if (formElements && formElements.indexOf(',' + el.name + ',')==-1)
			continue;

		switch(el.type.toLowerCase())
		{
			case 'text':
			case 'password':
			case 'textarea':
			case 'hidden':
			case 'submit':
				compStack.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value));
				break;
			case 'select-one':
				var value = '';
				var opt;
				if (el.selectedIndex >= 0) {
					opt = el.options[el.selectedIndex];
					value = opt.value || opt.text;
				}
				compStack.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(value));
				break;
			case 'select-multiple':
				for (var j = 0; j < el.length; j++)
				{
					if (el.options[j].selected)
					{
						value = el.options[j].value || el.options[j].text;
						compStack.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(value));
					}
				}
				break;
			case 'checkbox':
			case 'radio':
				if (el.checked)
					compStack.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value));
				break;
			default:
			// file, button, reset
			break;
			}
		}
	return compStack.join('&');
};
;// SpryXML.js - version 0.4 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.XML) Spry.XML = {}; if (!Spry.XML.Schema) Spry.XML.Schema = {};

Spry.XML.Schema.Node = function(nodeName)
{
	this.nodeName = nodeName;
	this.isAttribute = false;
	this.appearsMoreThanOnce = false;
	this.children = new Array;
};

Spry.XML.Schema.Node.prototype.toString = function (indentStr)
{
	if (!indentStr)
		indentStr = "";

	var str = indentStr + this.nodeName;

	if (this.appearsMoreThanOnce)
		str += " (+)";

	str += "\n";

	var newIndentStr = indentStr + "    ";

	for (var $childName in this.children)
	{
		var child = this.children[$childName];
		if (child.isAttribute)
			str += newIndentStr + child.nodeName + "\n";
		else
			str += child.toString(newIndentStr);
	}

	return str;
};

Spry.XML.Schema.mapElementIntoSchemaNode = function(ele, schemaNode)
{
	if (!ele || !schemaNode)
		return;

	// Add all attributes as children to schemaNode!

	var i = 0;
	for (i = 0; i < ele.attributes.length; i++)
	{
		var attr = ele.attributes.item(i);
		if (attr && attr.nodeType == 2 /* Node.ATTRIBUTE_NODE */)
		{
			var attrName = "@" + attr.name;

			// We don't track the number of times an attribute appears
			// in a given element so we only handle the case where the
			// attribute doesn't already exist in the schemaNode.children array.

			if (!schemaNode.children[attrName])
			{
				var attrObj = new Spry.XML.Schema.Node(attrName);
				attrObj.isAttribute = true;
				schemaNode.children[attrName] = attrObj;
			}
		}
	}

	// Now add all of element's element children as children of schemaNode!

	var child = ele.firstChild;
	var namesSeenSoFar = new Array;
  
	while (child)
	{
		if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
		{
			var childSchemaNode = schemaNode.children[child.nodeName];

			if (!childSchemaNode)
			{
				childSchemaNode = new Spry.XML.Schema.Node(child.nodeName);
				if (childSchemaNode)
					schemaNode.children[child.nodeName] = childSchemaNode;
			}

			if (childSchemaNode)
			{
				if (namesSeenSoFar[childSchemaNode.nodeName])
					childSchemaNode.appearsMoreThanOnce = true;
				else
					namesSeenSoFar[childSchemaNode.nodeName] = true;
			}

			Spry.XML.Schema.mapElementIntoSchemaNode(child, childSchemaNode);
		}

		child = child.nextSibling;
	} 
};

Spry.XML.getSchemaForElement = function(ele)
{
	if (!ele)
		return null;

	schemaNode = new Spry.XML.Schema.Node(ele.nodeName);
	Spry.XML.Schema.mapElementIntoSchemaNode(ele, schemaNode);

	return schemaNode;
};

Spry.XML.getSchema = function(xmlDoc)
{
	if (!xmlDoc)
		return null;

	// Find the first element in the document that doesn't start with "xml".
	// According to the XML spec tags with names that start with "xml" are reserved
	// for future use.

	var node = xmlDoc.firstChild;

	while (node)
	{
		if (node.nodeType == 1 /* Node.ELEMENT_NODE */)
			break;

		node = node.nextSibling;
	}

	return Spry.XML.getSchemaForElement(node);
};

Spry.XML.nodeHasValue = function(node)
{
	if (node)
	{
		var child = node.firstChild;
		if (child && child.nextSibling == null && (child.nodeType == 3 /* Node.TEXT_NODE */ || child.nodeType == 4 /* CDATA_SECTION_NODE */))
			return true;
	}
	return false;
};

Spry.XML.XObject = function()
{
};

Spry.XML.XObject.prototype._value = function()
{
	var val = this["#text"];
	if (val != undefined)
		return val;
	return this["#cdata-section"];
};

Spry.XML.XObject.prototype._hasValue = function()
{
	return this._value() != undefined;
};

Spry.XML.XObject.prototype._valueIsText = function()
{
	return this["#text"] != undefined;
};

Spry.XML.XObject.prototype._valueIsCData = function()
{
	return this["#cdata-section"] != undefined;
};

Spry.XML.XObject.prototype._propertyIsArray = function(prop)
{
	var val = this[prop];
	if (val == undefined)
		return false;
	return (typeof val == "object" && val.constructor == Array);
};

Spry.XML.XObject.prototype._getPropertyAsArray = function(prop)
{
	var arr = [];
	var val = this[prop];
	if (val != undefined)
	{
		if (typeof val == "object" && val.constructor == Array)
			return val;
		arr.push(val);
	}
	return arr;
};

Spry.XML.XObject.prototype._getProperties = function()
{
	var props = [];
	for (var p in this)
	{
		if (!/^_/.test(p))
			props.push(p);
	}
	return props;
};

Spry.XML.nodeToObject = function(node)
{
	if (!node)
		return null;

	var obj = new Spry.XML.XObject();

	// Add all attributes as properties of the object.

	for (var i = 0; i < node.attributes.length; i++)
	{
		var attr = node.attributes[i];
		var attrName = "@" + attr.name;
		obj[attrName] = attr.value;
	}

	var child;

	if (Spry.XML.nodeHasValue(node))
	{	
		try
		{
			child = node.firstChild;

			if (child.nodeType == 3 /* TEXT_NODE */)
				obj[child.nodeName] = Spry.Utils.encodeEntities(child.data);
			else if (child.nodeType == 4 /* CDATA_SECTION_NODE */)
				obj[child.nodeName] = child.data;
		} catch (e) { Spry.Debug.reportError("Spry.XML.nodeToObject() exception caught: " + e + "\n"); }
	}
	else
	{
		// The node has no value, so run through any element children
		// it may have and add them as properties.

		child = node.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			{
				var isArray = false;
				var tagName = child.nodeName;
				if (obj[tagName])
				{
					if (obj[tagName].constructor != Array)
					{
						var curValue = obj[tagName];
						obj[tagName] = new Array;
						obj[tagName].push(curValue);
					}
					isArray = true;
				}

				var childObj = Spry.XML.nodeToObject(child);
				
				if (isArray)
					obj[tagName].push(childObj);
				else
					obj[tagName] = childObj;
			}
			child = child.nextSibling;
		}
	}
	return obj;
};

// Spry.XML.documentToObject - Utility method for creating a
// JavaScript object with properties and nested objects that
// mirror an XML document tree structure.
//
// Sample XML:
//
//		<employees>
//			<employee id="1000">
//				<name>John Doe</name>
//			</employee>
//			<employee id="2000">
//				<name><![CDATA[Jane Smith]]></name>
//			</employee>
//		</employees>
//
// Object returned by documentToObject():
//
//		{
//			employees:
//				{
//					employee:
//						[
//							{
//								@id: "1000",
//								name: { "#text": "John Doe" }
//							},
//							{
//								@id: "2000",
//								name: { "#cdata-section": "Jane Smith" }
//							}
//						]
//				}
//		}

Spry.XML.documentToObject = function(xmlDoc)
{
	var obj = null;
	if (xmlDoc && xmlDoc.firstChild)
	{
		var child = xmlDoc.firstChild;
		while (child)
		{
			if (child.nodeType == 1 /* Node.ELEMENT_NODE */)
			{
				obj = new Spry.XML.XObject();
				obj[child.nodeName] = Spry.XML.nodeToObject(child);
				break;
			}
			child = child.nextSibling;
		}
	}
	return obj;
};
;;// xpath.js - version 0.7 - Spry Pre-Release 1.6.1
//
// Code from xmltoken.js.
//
// Copyright 2006 Google Inc.
// All Rights Reserved
//
// Defines regular expression patterns to extract XML tokens from string.
// See <http://www.w3.org/TR/REC-xml/#sec-common-syn>,
// <http://www.w3.org/TR/xml11/#sec-common-syn> and
// <http://www.w3.org/TR/REC-xml-names/#NT-NCName> for the specifications.
//
// Author: Junji Takagi <jtakagi@google.com>

// Detect whether RegExp supports Unicode characters or not.

var REGEXP_UNICODE = function() {
  var tests = [' ', '\u0120', -1,  // Konquerer 3.4.0 fails here.
               '!', '\u0120', -1,
               '\u0120', '\u0120', 0,
               '\u0121', '\u0120', -1,
               '\u0121', '\u0120|\u0121', 0,
               '\u0122', '\u0120|\u0121', -1,
               '\u0120', '[\u0120]', 0,  // Safari 2.0.3 fails here.
               '\u0121', '[\u0120]', -1,
               '\u0121', '[\u0120\u0121]', 0,  // Safari 2.0.3 fails here.
               '\u0122', '[\u0120\u0121]', -1,
               '\u0121', '[\u0120-\u0121]', 0,  // Safari 2.0.3 fails here.
               '\u0122', '[\u0120-\u0121]', -1];
  for (var i = 0; i < tests.length; i += 3) {
    if (tests[i].search(new RegExp(tests[i + 1])) != tests[i + 2]) {
      return false;
    }
  }
  return true;
}();

// Common tokens in XML 1.0 and XML 1.1.

var XML_S = '[ \t\r\n]+';
var XML_EQ = '(' + XML_S + ')?=(' + XML_S + ')?';
var XML_CHAR_REF = '&#[0-9]+;|&#x[0-9a-fA-F]+;';

// XML 1.0 tokens.

var XML10_VERSION_INFO = XML_S + 'version' + XML_EQ + '("1\\.0"|' + "'1\\.0')";
var XML10_BASE_CHAR = (REGEXP_UNICODE) ?
  '\u0041-\u005a\u0061-\u007a\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff' +
  '\u0100-\u0131\u0134-\u013e\u0141-\u0148\u014a-\u017e\u0180-\u01c3' +
  '\u01cd-\u01f0\u01f4-\u01f5\u01fa-\u0217\u0250-\u02a8\u02bb-\u02c1\u0386' +
  '\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc' +
  '\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c' +
  '\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb' +
  '\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0586\u05d0-\u05ea' +
  '\u05f0-\u05f2\u0621-\u063a\u0641-\u064a\u0671-\u06b7\u06ba-\u06be' +
  '\u06c0-\u06ce\u06d0-\u06d3\u06d5\u06e5-\u06e6\u0905-\u0939\u093d' +
  '\u0958-\u0961\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2' +
  '\u09b6-\u09b9\u09dc-\u09dd\u09df-\u09e1\u09f0-\u09f1\u0a05-\u0a0a' +
  '\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36' +
  '\u0a38-\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8b\u0a8d' +
  '\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9' +
  '\u0abd\u0ae0\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30' +
  '\u0b32-\u0b33\u0b36-\u0b39\u0b3d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b85-\u0b8a' +
  '\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4' +
  '\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0c05-\u0c0c\u0c0e-\u0c10' +
  '\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c60-\u0c61\u0c85-\u0c8c' +
  '\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cde\u0ce0-\u0ce1' +
  '\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d60-\u0d61' +
  '\u0e01-\u0e2e\u0e30\u0e32-\u0e33\u0e40-\u0e45\u0e81-\u0e82\u0e84' +
  '\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5' +
  '\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0\u0eb2-\u0eb3\u0ebd\u0ec0-\u0ec4' +
  '\u0f40-\u0f47\u0f49-\u0f69\u10a0-\u10c5\u10d0-\u10f6\u1100\u1102-\u1103' +
  '\u1105-\u1107\u1109\u110b-\u110c\u110e-\u1112\u113c\u113e\u1140\u114c' +
  '\u114e\u1150\u1154-\u1155\u1159\u115f-\u1161\u1163\u1165\u1167\u1169' +
  '\u116d-\u116e\u1172-\u1173\u1175\u119e\u11a8\u11ab\u11ae-\u11af' +
  '\u11b7-\u11b8\u11ba\u11bc-\u11c2\u11eb\u11f0\u11f9\u1e00-\u1e9b' +
  '\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d' +
  '\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc' +
  '\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec' +
  '\u1ff2-\u1ff4\u1ff6-\u1ffc\u2126\u212a-\u212b\u212e\u2180-\u2182' +
  '\u3041-\u3094\u30a1-\u30fa\u3105-\u312c\uac00-\ud7a3' :
  'A-Za-z';
var XML10_IDEOGRAPHIC = (REGEXP_UNICODE) ?
  '\u4e00-\u9fa5\u3007\u3021-\u3029' :
  '';
var XML10_COMBINING_CHAR = (REGEXP_UNICODE) ?
  '\u0300-\u0345\u0360-\u0361\u0483-\u0486\u0591-\u05a1\u05a3-\u05b9' +
  '\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05c4\u064b-\u0652\u0670\u06d6-\u06dc' +
  '\u06dd-\u06df\u06e0-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0901-\u0903\u093c' +
  '\u093e-\u094c\u094d\u0951-\u0954\u0962-\u0963\u0981-\u0983\u09bc\u09be' +
  '\u09bf\u09c0-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09d7\u09e2-\u09e3\u0a02' +
  '\u0a3c\u0a3e\u0a3f\u0a40-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a70-\u0a71' +
  '\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0b01-\u0b03' +
  '\u0b3c\u0b3e-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b82-\u0b83' +
  '\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0c01-\u0c03\u0c3e-\u0c44' +
  '\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c82-\u0c83\u0cbe-\u0cc4' +
  '\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0d02-\u0d03\u0d3e-\u0d43' +
  '\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1' +
  '\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39' +
  '\u0f3e\u0f3f\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad' +
  '\u0fb1-\u0fb7\u0fb9\u20d0-\u20dc\u20e1\u302a-\u302f\u3099\u309a' :
  '';
var XML10_DIGIT = (REGEXP_UNICODE) ?
  '\u0030-\u0039\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef' +
  '\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be7-\u0bef\u0c66-\u0c6f' +
  '\u0ce6-\u0cef\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29' :
  '0-9';
var XML10_EXTENDER = (REGEXP_UNICODE) ?
  '\u00b7\u02d0\u02d1\u0387\u0640\u0e46\u0ec6\u3005\u3031-\u3035' +
  '\u309d-\u309e\u30fc-\u30fe' :
  '';
var XML10_LETTER = XML10_BASE_CHAR + XML10_IDEOGRAPHIC;
var XML10_NAME_CHAR = XML10_LETTER + XML10_DIGIT + '\\._:' +
                      XML10_COMBINING_CHAR + XML10_EXTENDER + '-';
var XML10_NAME = '[' + XML10_LETTER + '_:][' + XML10_NAME_CHAR + ']*';

var XML10_ENTITY_REF = '&' + XML10_NAME + ';';
var XML10_REFERENCE = XML10_ENTITY_REF + '|' + XML_CHAR_REF;
var XML10_ATT_VALUE = '"(([^<&"]|' + XML10_REFERENCE + ')*)"|' +
                      "'(([^<&']|" + XML10_REFERENCE + ")*)'";
var XML10_ATTRIBUTE =
  '(' + XML10_NAME + ')' + XML_EQ + '(' + XML10_ATT_VALUE + ')';

// XML 1.1 tokens.
// TODO(jtakagi): NameStartChar also includes \u10000-\ueffff.
// ECMAScript Language Specifiction defines UnicodeEscapeSequence as
// "\u HexDigit HexDigit HexDigit HexDigit" and we may need to use
// surrogate pairs, but any browser doesn't support surrogate paris in
// character classes of regular expression, so avoid including them for now.

var XML11_VERSION_INFO = XML_S + 'version' + XML_EQ + '("1\\.1"|' + "'1\\.1')";
var XML11_NAME_START_CHAR = (REGEXP_UNICODE) ?
  ':A-Z_a-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d' +
  '\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff' +
  '\uf900-\ufdcf\ufdf0-\ufffd' :
  ':A-Z_a-z';
var XML11_NAME_CHAR = XML11_NAME_START_CHAR +
  ((REGEXP_UNICODE) ? '\\.0-9\u00b7\u0300-\u036f\u203f-\u2040-' : '\\.0-9-');
var XML11_NAME = '[' + XML11_NAME_START_CHAR + '][' + XML11_NAME_CHAR + ']*';

var XML11_ENTITY_REF = '&' + XML11_NAME + ';';
var XML11_REFERENCE = XML11_ENTITY_REF + '|' + XML_CHAR_REF;
var XML11_ATT_VALUE = '"(([^<&"]|' + XML11_REFERENCE + ')*)"|' +
                      "'(([^<&']|" + XML11_REFERENCE + ")*)'";
var XML11_ATTRIBUTE =
  '(' + XML11_NAME + ')' + XML_EQ + '(' + XML11_ATT_VALUE + ')';

// XML Namespace tokens.
// Used in XML parser and XPath parser.

var XML_NC_NAME_CHAR = XML10_LETTER + XML10_DIGIT + '\\._' +
                       XML10_COMBINING_CHAR + XML10_EXTENDER + '-';
var XML_NC_NAME = '[' + XML10_LETTER + '_][' + XML_NC_NAME_CHAR + ']*';


// Code from dom.js.
//
// Based on <http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/
// core.html#ID-1950641247>
var DOM_ELEMENT_NODE = 1;
var DOM_ATTRIBUTE_NODE = 2;
var DOM_TEXT_NODE = 3;
var DOM_CDATA_SECTION_NODE = 4;
var DOM_ENTITY_REFERENCE_NODE = 5;
var DOM_ENTITY_NODE = 6;
var DOM_PROCESSING_INSTRUCTION_NODE = 7;
var DOM_COMMENT_NODE = 8;
var DOM_DOCUMENT_NODE = 9;
var DOM_DOCUMENT_TYPE_NODE = 10;
var DOM_DOCUMENT_FRAGMENT_NODE = 11;
var DOM_NOTATION_NODE = 12;

// Code from util.js.
//
// Copyright 2005 Google
//
// Author: Steffen Meschkat <mesch@google.com>
//
// Miscellaneous utility and placeholder functions.

// Dummy implmentation for the logging functions. Replace by something
// useful when you want to debug.
function xpathLog(msg) {};
function xsltLog(msg) {};
function xsltLogXml(msg) {};

// Throws an exception if false.
function assert(b) {
  if (!b) {
    throw "Assertion failed";
  }
}

// Splits a string s at all occurrences of character c. This is like
// the split() method of the string object, but IE omits empty
// strings, which violates the invariant (s.split(x).join(x) == s).
function stringSplit(s, c) {
  var a = s.indexOf(c);
  if (a == -1) {
    return [ s ];
  }
  var parts = [];
  parts.push(s.substr(0,a));
  while (a != -1) {
    var a1 = s.indexOf(c, a + 1);
    if (a1 != -1) {
      parts.push(s.substr(a + 1, a1 - a - 1));
    } else {
      parts.push(s.substr(a + 1));
    }
    a = a1;
  }
  return parts;
}

// Applies the given function to each element of the array, preserving
// this, and passing the index.
function mapExec(array, func) {
  for (var i = 0; i < array.length; ++i) {
    func.call(this, array[i], i);
  }
}

// Returns an array that contains the return value of the given
// function applied to every element of the input array.
function mapExpr(array, func) {
  var ret = [];
  for (var i = 0; i < array.length; ++i) {
    ret.push(func(array[i]));
  }
  return ret;
};

// Reverses the given array in place.
function reverseInplace(array) {
  for (var i = 0; i < array.length / 2; ++i) {
    var h = array[i];
    var ii = array.length - i - 1;
    array[i] = array[ii];
    array[ii] = h;
  }
}

// Removes value from array. Returns the number of instances of value
// that were removed from array.
function removeFromArray(array, value, opt_notype) {
  var shift = 0;
  for (var i = 0; i < array.length; ++i) {
    if (array[i] === value || (opt_notype && array[i] == value)) {
      array.splice(i--, 1);
      shift++;
    }
  }
  return shift;
}

// Shallow-copies an array.
function copyArray(dst, src) {
  for (var i = 0; i < src.length; ++i) {
    dst.push(src[i]);
  }
}

// Returns the text value of a node; for nodes without children this
// is the nodeValue, for nodes with children this is the concatenation
// of the value of all children.
function xmlValue(node) {
  if (!node) {
    return '';
  }

  var ret = '';
  if (node.nodeType == DOM_TEXT_NODE ||
      node.nodeType == DOM_CDATA_SECTION_NODE ||
      node.nodeType == DOM_ATTRIBUTE_NODE) {
    ret += node.nodeValue;

  } else if (node.nodeType == DOM_ELEMENT_NODE ||
             node.nodeType == DOM_DOCUMENT_NODE ||
             node.nodeType == DOM_DOCUMENT_FRAGMENT_NODE) {
    for (var i = 0; i < node.childNodes.length; ++i) {
      ret += arguments.callee(node.childNodes[i]);
    }
  }
  return ret;
}

// Code from xpath.js.
//
// Copyright 2005 Google Inc.
// All Rights Reserved
//
// An XPath parser and evaluator written in JavaScript. The
// implementation is complete except for functions handling
// namespaces.
//
// Reference: [XPATH] XPath Specification
// <http://www.w3.org/TR/1999/REC-xpath-19991116>.
//
//
// The API of the parser has several parts:
//
// 1. The parser function xpathParse() that takes a string and returns
// an expession object.
//
// 2. The expression object that has an evaluate() method to evaluate the
// XPath expression it represents. (It is actually a hierarchy of
// objects that resembles the parse tree, but an application will call
// evaluate() only on the top node of this hierarchy.)
//
// 3. The context object that is passed as an argument to the evaluate()
// method, which represents the DOM context in which the expression is
// evaluated.
//
// 4. The value object that is returned from evaluate() and represents
// values of the different types that are defined by XPath (number,
// string, boolean, and node-set), and allows to convert between them.
//
// These parts are near the top of the file, the functions and data
// that are used internally follow after them.
//
//
// Author: Steffen Meschkat <mesch@google.com>


// The entry point for the parser.
//
// @param expr a string that contains an XPath expression.
// @return an expression object that can be evaluated with an
// expression context.

function xpathParse(expr) {
  xpathLog('parse ' + expr);
  xpathParseInit();

  var cached = xpathCacheLookup(expr);
  if (cached) {
    xpathLog(' ... cached');
    return cached;
  }

  // Optimize for a few common cases: simple attribute node tests
  // (@id), simple element node tests (page), variable references
  // ($address), numbers (4), multi-step path expressions where each
  // step is a plain element node test
  // (page/overlay/locations/location).

  if (expr.match(/^(\$|@)?\w+$/i)) {
    var ret = makeSimpleExpr(expr);
    xpathParseCache[expr] = ret;
    xpathLog(' ... simple');
    return ret;
  }

  if (expr.match(/^\w+(\/\w+)*$/i)) {
    var ret = makeSimpleExpr2(expr);
    xpathParseCache[expr] = ret;
    xpathLog(' ... simple 2');
    return ret;
  }

  var cachekey = expr; // expr is modified during parse

  var stack = [];
  var ahead = null;
  var previous = null;
  var done = false;

  var parse_count = 0;
  var lexer_count = 0;
  var reduce_count = 0;

  while (!done) {
    parse_count++;
    expr = expr.replace(/^\s*/, '');
    previous = ahead;
    ahead = null;

    var rule = null;
    var match = '';
    for (var i = 0; i < xpathTokenRules.length; ++i) {
      var result = xpathTokenRules[i].re.exec(expr);
      lexer_count++;
      if (result && result.length > 0 && result[0].length > match.length) {
        rule = xpathTokenRules[i];
        match = result[0];
        break;
      }
    }

    // Special case: allow operator keywords to be element and
    // variable names.

    // NOTE(mesch): The parser resolves conflicts by looking ahead,
    // and this is the only case where we look back to
    // disambiguate. So this is indeed something different, and
    // looking back is usually done in the lexer (via states in the
    // general case, called "start conditions" in flex(1)). Also,the
    // conflict resolution in the parser is not as robust as it could
    // be, so I'd like to keep as much off the parser as possible (all
    // these precedence values should be computed from the grammar
    // rules and possibly associativity declarations, as in bison(1),
    // and not explicitly set.

    if (rule &&
        (rule == TOK_DIV ||
         rule == TOK_MOD ||
         rule == TOK_AND ||
         rule == TOK_OR) &&
        (!previous ||
         previous.tag == TOK_AT ||
         previous.tag == TOK_DSLASH ||
         previous.tag == TOK_SLASH ||
         previous.tag == TOK_AXIS ||
         previous.tag == TOK_DOLLAR)) {
      rule = TOK_QNAME;
    }

    if (rule) {
      expr = expr.substr(match.length);
      xpathLog('token: ' + match + ' -- ' + rule.label);
      ahead = {
        tag: rule,
        match: match,
        prec: rule.prec ?  rule.prec : 0, // || 0 is removed by the compiler
        expr: makeTokenExpr(match)
      };

    } else {
      xpathLog('DONE');
      done = true;
    }

    while (xpathReduce(stack, ahead)) {
      reduce_count++;
      xpathLog('stack: ' + stackToString(stack));
    }
  }

  xpathLog('stack: ' + stackToString(stack));

  if (stack.length != 1) {
    throw 'XPath parse error ' + cachekey + ':\n' + stackToString(stack);
  }

  var result = stack[0].expr;
  xpathParseCache[cachekey] = result;

  xpathLog('XPath parse: ' + parse_count + ' / ' +
           lexer_count + ' / ' + reduce_count);

  return result;
}

var xpathParseCache = {};

function xpathCacheLookup(expr) {
  return xpathParseCache[expr];
}

function xpathReduce(stack, ahead) {
  var cand = null;

  if (stack.length > 0) {
    var top = stack[stack.length-1];
    var ruleset = xpathRules[top.tag.key];

    if (ruleset) {
      for (var i = 0; i < ruleset.length; ++i) {
        var rule = ruleset[i];
        var match = xpathMatchStack(stack, rule[1]);
        if (match.length) {
          cand = {
            tag: rule[0],
            rule: rule,
            match: match
          };
          cand.prec = xpathGrammarPrecedence(cand);
          break;
        }
      }
    }
  }

  var ret;
  if (cand && (!ahead || cand.prec > ahead.prec ||
               (ahead.tag.left && cand.prec >= ahead.prec))) {
    for (var i = 0; i < cand.match.matchlength; ++i) {
      stack.pop();
    }

    xpathLog('reduce ' + cand.tag.label + ' ' + cand.prec +
             ' ahead ' + (ahead ? ahead.tag.label + ' ' + ahead.prec +
                          (ahead.tag.left ? ' left' : '')
                          : ' none '));

    var matchexpr = mapExpr(cand.match, function(m) { return m.expr; });
    cand.expr = cand.rule[3].apply(null, matchexpr);

    stack.push(cand);
    ret = true;

  } else {
    if (ahead) {
      xpathLog('shift ' + ahead.tag.label + ' ' + ahead.prec +
               (ahead.tag.left ? ' left' : '') +
               ' over ' + (cand ? cand.tag.label + ' ' +
                           cand.prec : ' none'));
      stack.push(ahead);
    }
    ret = false;
  }
  return ret;
}

function xpathMatchStack(stack, pattern) {

  // NOTE(mesch): The stack matches for variable cardinality are
  // greedy but don't do backtracking. This would be an issue only
  // with rules of the form A* A, i.e. with an element with variable
  // cardinality followed by the same element. Since that doesn't
  // occur in the grammar at hand, all matches on the stack are
  // unambiguous.

  var S = stack.length;
  var P = pattern.length;
  var p, s;
  var match = [];
  match.matchlength = 0;
  var ds = 0;
  for (p = P - 1, s = S - 1; p >= 0 && s >= 0; --p, s -= ds) {
    ds = 0;
    var qmatch = [];
    if (pattern[p] == Q_MM) {
      p -= 1;
      match.push(qmatch);
      while (s - ds >= 0 && stack[s - ds].tag == pattern[p]) {
        qmatch.push(stack[s - ds]);
        ds += 1;
        match.matchlength += 1;
      }

    } else if (pattern[p] == Q_01) {
      p -= 1;
      match.push(qmatch);
      while (s - ds >= 0 && ds < 2 && stack[s - ds].tag == pattern[p]) {
        qmatch.push(stack[s - ds]);
        ds += 1;
        match.matchlength += 1;
      }

    } else if (pattern[p] == Q_1M) {
      p -= 1;
      match.push(qmatch);
      if (stack[s].tag == pattern[p]) {
        while (s - ds >= 0 && stack[s - ds].tag == pattern[p]) {
          qmatch.push(stack[s - ds]);
          ds += 1;
          match.matchlength += 1;
        }
      } else {
        return [];
      }

    } else if (stack[s].tag == pattern[p]) {
      match.push(stack[s]);
      ds += 1;
      match.matchlength += 1;

    } else {
      return [];
    }

    reverseInplace(qmatch);
    qmatch.expr = mapExpr(qmatch, function(m) { return m.expr; });
  }

  reverseInplace(match);

  if (p == -1) {
    return match;

  } else {
    return [];
  }
}

function xpathTokenPrecedence(tag) {
  return tag.prec || 2;
}

function xpathGrammarPrecedence(frame) {
  var ret = 0;

  if (frame.rule) { /* normal reduce */
    if (frame.rule.length >= 3 && frame.rule[2] >= 0) {
      ret = frame.rule[2];

    } else {
      for (var i = 0; i < frame.rule[1].length; ++i) {
        var p = xpathTokenPrecedence(frame.rule[1][i]);
        ret = Math.max(ret, p);
      }
    }
  } else if (frame.tag) { /* TOKEN match */
    ret = xpathTokenPrecedence(frame.tag);

  } else if (frame.length) { /* Q_ match */
    for (var j = 0; j < frame.length; ++j) {
      var p = xpathGrammarPrecedence(frame[j]);
      ret = Math.max(ret, p);
    }
  }

  return ret;
}

function stackToString(stack) {
  var ret = '';
  for (var i = 0; i < stack.length; ++i) {
    if (ret) {
      ret += '\n';
    }
    ret += stack[i].tag.label;
  }
  return ret;
}


// XPath expression evaluation context. An XPath context consists of a
// DOM node, a list of DOM nodes that contains this node, a number
// that represents the position of the single node in the list, and a
// current set of variable bindings. (See XPath spec.)
//
// The interface of the expression context:
//
//   Constructor -- gets the node, its position, the node set it
//   belongs to, and a parent context as arguments. The parent context
//   is used to implement scoping rules for variables: if a variable
//   is not found in the current context, it is looked for in the
//   parent context, recursively. Except for node, all arguments have
//   default values: default position is 0, default node set is the
//   set that contains only the node, and the default parent is null.
//
//     Notice that position starts at 0 at the outside interface;
//     inside XPath expressions this shows up as position()=1.
//
//   clone() -- creates a new context with the current context as
//   parent. If passed as argument to clone(), the new context has a
//   different node, position, or node set. What is not passed is
//   inherited from the cloned context.
//
//   setVariable(name, expr) -- binds given XPath expression to the
//   name.
//
//   getVariable(name) -- what the name says.
//
//   setNode(position) -- sets the context to the node at the given
//   position. Needed to implement scoping rules for variables in
//   XPath. (A variable is visible to all subsequent siblings, not
//   only to its children.)

function ExprContext(node, opt_position, opt_nodelist, opt_parent) {
  this.node = node;
  this.position = opt_position || 0;
  this.nodelist = opt_nodelist || [ node ];
  this.variables = {};
  this.parent = opt_parent || null;
  if (opt_parent) {
    this.root = opt_parent.root;
  } else if (this.node.nodeType == DOM_DOCUMENT_NODE) {
    // NOTE(mesch): DOM Spec stipulates that the ownerDocument of a
    // document is null. Our root, however is the document that we are
    // processing, so the initial context is created from its document
    // node, which case we must handle here explcitly.
    this.root = node;
  } else {
    this.root = node.ownerDocument;
  }
}

ExprContext.prototype.clone = function(opt_node, opt_position, opt_nodelist) {
  return new ExprContext(
      opt_node || this.node,
      typeof opt_position != 'undefined' ? opt_position : this.position,
      opt_nodelist || this.nodelist, this);
};

ExprContext.prototype.setVariable = function(name, value) {
  this.variables[name] = value;
};

ExprContext.prototype.getVariable = function(name) {
  if (typeof this.variables[name] != 'undefined') {
    return this.variables[name];

  } else if (this.parent) {
    return this.parent.getVariable(name);

  } else {
    return null;
  }
};

ExprContext.prototype.setNode = function(position) {
  this.node = this.nodelist[position];
  this.position = position;
};

ExprContext.prototype.contextSize = function() {
  return this.nodelist.length;
};


// XPath expression values. They are what XPath expressions evaluate
// to. Strangely, the different value types are not specified in the
// XPath syntax, but only in the semantics, so they don't show up as
// nonterminals in the grammar. Yet, some expressions are required to
// evaluate to particular types, and not every type can be coerced
// into every other type. Although the types of XPath values are
// similar to the types present in JavaScript, the type coercion rules
// are a bit peculiar, so we explicitly model XPath types instead of
// mapping them onto JavaScript types. (See XPath spec.)
//
// The four types are:
//
//   StringValue
//
//   NumberValue
//
//   BooleanValue
//
//   NodeSetValue
//
// The common interface of the value classes consists of methods that
// implement the XPath type coercion rules:
//
//   stringValue() -- returns the value as a JavaScript String,
//
//   numberValue() -- returns the value as a JavaScript Number,
//
//   booleanValue() -- returns the value as a JavaScript Boolean,
//
//   nodeSetValue() -- returns the value as a JavaScript Array of DOM
//   Node objects.
//

function StringValue(value) {
  this.value = value;
  this.type = 'string';
}

StringValue.prototype.stringValue = function() {
  return this.value;
};

StringValue.prototype.booleanValue = function() {
  return this.value.length > 0;
};

StringValue.prototype.numberValue = function() {
  return this.value - 0;
};

StringValue.prototype.nodeSetValue = function() {
  throw this;
};

function BooleanValue(value) {
  this.value = value;
  this.type = 'boolean';
}

BooleanValue.prototype.stringValue = function() {
  return '' + this.value;
};

BooleanValue.prototype.booleanValue = function() {
  return this.value;
};

BooleanValue.prototype.numberValue = function() {
  return this.value ? 1 : 0;
};

BooleanValue.prototype.nodeSetValue = function() {
  throw this;
};

function NumberValue(value) {
  this.value = value;
  this.type = 'number';
}

NumberValue.prototype.stringValue = function() {
  return '' + this.value;
};

NumberValue.prototype.booleanValue = function() {
  return !!this.value;
};

NumberValue.prototype.numberValue = function() {
  return this.value - 0;
};

NumberValue.prototype.nodeSetValue = function() {
  throw this;
};

function NodeSetValue(value) {
  this.value = value;
  this.type = 'node-set';
}

NodeSetValue.prototype.stringValue = function() {
  if (this.value.length == 0) {
    return '';
  } else {
    return xmlValue(this.value[0]);
  }
};

NodeSetValue.prototype.booleanValue = function() {
  return this.value.length > 0;
};

NodeSetValue.prototype.numberValue = function() {
  return this.stringValue() - 0;
};

NodeSetValue.prototype.nodeSetValue = function() {
  return this.value;
};

// XPath expressions. They are used as nodes in the parse tree and
// possess an evaluate() method to compute an XPath value given an XPath
// context. Expressions are returned from the parser. Teh set of
// expression classes closely mirrors the set of non terminal symbols
// in the grammar. Every non trivial nonterminal symbol has a
// corresponding expression class.
//
// The common expression interface consists of the following methods:
//
// evaluate(context) -- evaluates the expression, returns a value.
//
// toString() -- returns the XPath text representation of the
// expression (defined in xsltdebug.js).
//
// parseTree(indent) -- returns a parse tree representation of the
// expression (defined in xsltdebug.js).

function TokenExpr(m) {
  this.value = m;
}

TokenExpr.prototype.evaluate = function() {
  return new StringValue(this.value);
};

function LocationExpr() {
  this.absolute = false;
  this.steps = [];
}

LocationExpr.prototype.appendStep = function(s) {
  this.steps.push(s);
};

LocationExpr.prototype.prependStep = function(s) {
  var steps0 = this.steps;
  this.steps = [ s ];
  for (var i = 0; i < steps0.length; ++i) {
    this.steps.push(steps0[i]);
  }
};

LocationExpr.prototype.evaluate = function(ctx) {
  var start;
  if (this.absolute) {
    start = ctx.root;

  } else {
    start = ctx.node;
  }

  var nodes = [];
  xPathStep(nodes, this.steps, 0, start, ctx);
  return new NodeSetValue(nodes);
};

function xPathStep(nodes, steps, step, input, ctx) {
  var s = steps[step];
  var ctx2 = ctx.clone(input);
  var nodelist = s.evaluate(ctx2).nodeSetValue();

  for (var i = 0; i < nodelist.length; ++i) {
    if (step == steps.length - 1) {
      nodes.push(nodelist[i]);
    } else {
      xPathStep(nodes, steps, step + 1, nodelist[i], ctx);
    }
  }
}

function StepExpr(axis, nodetest, opt_predicate) {
  this.axis = axis;
  this.nodetest = nodetest;
  this.predicate = opt_predicate || [];
}

StepExpr.prototype.appendPredicate = function(p) {
  this.predicate.push(p);
};

StepExpr.prototype.evaluate = function(ctx) {
  var input = ctx.node;
  var nodelist = [];

  // NOTE(mesch): When this was a switch() statement, it didn't work
  // in Safari/2.0. Not sure why though; it resulted in the JavaScript
  // console output "undefined" (without any line number or so).

  if (this.axis ==  xpathAxis.ANCESTOR_OR_SELF) {
    nodelist.push(input);
    for (var n = input.parentNode; n; n = n.parentNode) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.ANCESTOR) {
    for (var n = input.parentNode; n; n = n.parentNode) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.ATTRIBUTE) {
    copyArray(nodelist, input.attributes);

  } else if (this.axis == xpathAxis.CHILD) {
    copyArray(nodelist, input.childNodes);

  } else if (this.axis == xpathAxis.DESCENDANT_OR_SELF) {
    nodelist.push(input);
    xpathCollectDescendants(nodelist, input);

  } else if (this.axis == xpathAxis.DESCENDANT) {
    xpathCollectDescendants(nodelist, input);

  } else if (this.axis == xpathAxis.FOLLOWING) {
    for (var n = input; n; n = n.parentNode) {
      for (var nn = n.nextSibling; nn; nn = nn.nextSibling) {
        nodelist.push(nn);
        xpathCollectDescendants(nodelist, nn);
      }
    }

  } else if (this.axis == xpathAxis.FOLLOWING_SIBLING) {
    for (var n = input.nextSibling; n; n = n.nextSibling) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.NAMESPACE) {
    alert('not implemented: axis namespace');

  } else if (this.axis == xpathAxis.PARENT) {
    if (input.parentNode) {
      nodelist.push(input.parentNode);
    }

  } else if (this.axis == xpathAxis.PRECEDING) {
    for (var n = input; n; n = n.parentNode) {
      for (var nn = n.previousSibling; nn; nn = nn.previousSibling) {
        nodelist.push(nn);
        xpathCollectDescendantsReverse(nodelist, nn);
      }
    }

  } else if (this.axis == xpathAxis.PRECEDING_SIBLING) {
    for (var n = input.previousSibling; n; n = n.previousSibling) {
      nodelist.push(n);
    }

  } else if (this.axis == xpathAxis.SELF) {
    nodelist.push(input);

  } else {
    throw 'ERROR -- NO SUCH AXIS: ' + this.axis;
  }

  // process node test
  var nodelist0 = nodelist;
  nodelist = [];
  for (var i = 0; i < nodelist0.length; ++i) {
    var n = nodelist0[i];
    if (this.nodetest.evaluate(ctx.clone(n, i, nodelist0)).booleanValue()) {
      nodelist.push(n);
    }
  }

  // process predicates
  for (var i = 0; i < this.predicate.length; ++i) {
    var nodelist0 = nodelist;
    nodelist = [];
    for (var ii = 0; ii < nodelist0.length; ++ii) {
      var n = nodelist0[ii];
      if (this.predicate[i].evaluate(ctx.clone(n, ii, nodelist0)).booleanValue()) {
        nodelist.push(n);
      }
    }
  }

  return new NodeSetValue(nodelist);
};

function NodeTestAny() {
  this.value = new BooleanValue(true);
}

NodeTestAny.prototype.evaluate = function(ctx) {
  return this.value;
};

function NodeTestElementOrAttribute() {}

NodeTestElementOrAttribute.prototype.evaluate = function(ctx) {
  return new BooleanValue(
      ctx.node.nodeType == DOM_ELEMENT_NODE ||
      ctx.node.nodeType == DOM_ATTRIBUTE_NODE);
};

function NodeTestText() {}

NodeTestText.prototype.evaluate = function(ctx) {
  return new BooleanValue(ctx.node.nodeType == DOM_TEXT_NODE);
};

function NodeTestComment() {}

NodeTestComment.prototype.evaluate = function(ctx) {
  return new BooleanValue(ctx.node.nodeType == DOM_COMMENT_NODE);
};

function NodeTestPI(target) {
  this.target = target;
}

NodeTestPI.prototype.evaluate = function(ctx) {
  return new
  BooleanValue(ctx.node.nodeType == DOM_PROCESSING_INSTRUCTION_NODE &&
               (!this.target || ctx.node.nodeName == this.target));
};

function NodeTestNC(nsprefix) {
  this.regex = new RegExp("^" + nsprefix + ":");
  this.nsprefix = nsprefix;
}

NodeTestNC.prototype.evaluate = function(ctx) {
  var n = ctx.node;
  return new BooleanValue(this.regex.match(n.nodeName));
};

function NodeTestName(name) {
  this.name = name;
}

NodeTestName.prototype.evaluate = function(ctx) {
  var n = ctx.node;
  return new BooleanValue(n.nodeName == this.name);
};

function PredicateExpr(expr) {
  this.expr = expr;
}

PredicateExpr.prototype.evaluate = function(ctx) {
  var v = this.expr.evaluate(ctx);
  if (v.type == 'number') {
    // NOTE(mesch): Internally, position is represented starting with
    // 0, however in XPath position starts with 1. See functions
    // position() and last().
    return new BooleanValue(ctx.position == v.numberValue() - 1);
  } else {
    return new BooleanValue(v.booleanValue());
  }
};

function FunctionCallExpr(name) {
  this.name = name;
  this.args = [];
}

FunctionCallExpr.prototype.appendArg = function(arg) {
  this.args.push(arg);
};

FunctionCallExpr.prototype.evaluate = function(ctx) {
  var fn = '' + this.name.value;
  var f = this.xpathfunctions[fn];
  if (f) {
    return f.call(this, ctx);
  } else {
    xpathLog('XPath NO SUCH FUNCTION ' + fn);
    return new BooleanValue(false);
  }
};

FunctionCallExpr.prototype.xpathfunctions = {
  'last': function(ctx) {
    assert(this.args.length == 0);
    // NOTE(mesch): XPath position starts at 1.
    return new NumberValue(ctx.contextSize());
  },

  'position': function(ctx) {
    assert(this.args.length == 0);
    // NOTE(mesch): XPath position starts at 1.
    return new NumberValue(ctx.position + 1);
  },

  'count': function(ctx) {
    assert(this.args.length == 1);
    var v = this.args[0].evaluate(ctx);
    return new NumberValue(v.nodeSetValue().length);
  },

  'id': function(ctx) {
    assert(this.args.length == 1);
    var e = this.args[0].evaluate(ctx);
    var ret = [];
    var ids;
    if (e.type == 'node-set') {
      ids = [];
      var en = e.nodeSetValue();
      for (var i = 0; i < en.length; ++i) {
        var v = xmlValue(en[i]).split(/\s+/);
        for (var ii = 0; ii < v.length; ++ii) {
          ids.push(v[ii]);
        }
      }
    } else {
      ids = e.stringValue().split(/\s+/);
    }
    var d = ctx.node.ownerDocument;
    for (var i = 0; i < ids.length; ++i) {
      var n = d.getElementById(ids[i]);
      if (n) {
        ret.push(n);
      }
    }
    return new NodeSetValue(ret);
  },

  'local-name': function(ctx) {
    alert('not implmented yet: XPath function local-name()');
  },

  'namespace-uri': function(ctx) {
    alert('not implmented yet: XPath function namespace-uri()');
  },

  'name': function(ctx) {
    assert(this.args.length == 1 || this.args.length == 0);
    var n;
    if (this.args.length == 0) {
      n = [ ctx.node ];
    } else {
      n = this.args[0].evaluate(ctx).nodeSetValue();
    }

    if (n.length == 0) {
      return new StringValue('');
    } else {
      return new StringValue(n[0].nodeName);
    }
  },

  'string':  function(ctx) {
    assert(this.args.length == 1 || this.args.length == 0);
    if (this.args.length == 0) {
      return new StringValue(new NodeSetValue([ ctx.node ]).stringValue());
    } else {
      return new StringValue(this.args[0].evaluate(ctx).stringValue());
    }
  },

  'concat': function(ctx) {
    var ret = '';
    for (var i = 0; i < this.args.length; ++i) {
      ret += this.args[i].evaluate(ctx).stringValue();
    }
    return new StringValue(ret);
  },

  'starts-with': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    return new BooleanValue(s0.indexOf(s1) == 0);
  },

  'contains': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    return new BooleanValue(s0.indexOf(s1) != -1);
  },

  'substring-before': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    var i = s0.indexOf(s1);
    var ret;
    if (i == -1) {
      ret = '';
    } else {
      ret = s0.substr(0,i);
    }
    return new StringValue(ret);
  },

  'substring-after': function(ctx) {
    assert(this.args.length == 2);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    var i = s0.indexOf(s1);
    var ret;
    if (i == -1) {
      ret = '';
    } else {
      ret = s0.substr(i + s1.length);
    }
    return new StringValue(ret);
  },

  'substring': function(ctx) {
    // NOTE: XPath defines the position of the first character in a
    // string to be 1, in JavaScript this is 0 ([XPATH] Section 4.2).
    assert(this.args.length == 2 || this.args.length == 3);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).numberValue();
    var ret;
    if (this.args.length == 2) {
      var i1 = Math.max(0, Math.round(s1) - 1);
      ret = s0.substr(i1);

    } else {
      var s2 = this.args[2].evaluate(ctx).numberValue();
      var i0 = Math.round(s1) - 1;
      var i1 = Math.max(0, i0);
      var i2 = Math.round(s2) - Math.max(0, -i0);
      ret = s0.substr(i1, i2);
    }
    return new StringValue(ret);
  },

  'string-length': function(ctx) {
    var s;
    if (this.args.length > 0) {
      s = this.args[0].evaluate(ctx).stringValue();
    } else {
      s = new NodeSetValue([ ctx.node ]).stringValue();
    }
    return new NumberValue(s.length);
  },

  'normalize-space': function(ctx) {
    var s;
    if (this.args.length > 0) {
      s = this.args[0].evaluate(ctx).stringValue();
    } else {
      s = new NodeSetValue([ ctx.node ]).stringValue();
    }
    s = s.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s+/g, ' ');
    return new StringValue(s);
  },

  'translate': function(ctx) {
    assert(this.args.length == 3);
    var s0 = this.args[0].evaluate(ctx).stringValue();
    var s1 = this.args[1].evaluate(ctx).stringValue();
    var s2 = this.args[2].evaluate(ctx).stringValue();

    for (var i = 0; i < s1.length; ++i) {
      s0 = s0.replace(new RegExp(s1.charAt(i), 'g'), s2.charAt(i));
    }
    return new StringValue(s0);
  },

  'boolean': function(ctx) {
    assert(this.args.length == 1);
    return new BooleanValue(this.args[0].evaluate(ctx).booleanValue());
  },

  'not': function(ctx) {
    assert(this.args.length == 1);
    var ret = !this.args[0].evaluate(ctx).booleanValue();
    return new BooleanValue(ret);
  },

  'true': function(ctx) {
    assert(this.args.length == 0);
    return new BooleanValue(true);
  },

  'false': function(ctx) {
    assert(this.args.length == 0);
    return new BooleanValue(false);
  },

  'lang': function(ctx) {
    assert(this.args.length == 1);
    var lang = this.args[0].evaluate(ctx).stringValue();
    var xmllang;
    var n = ctx.node;
    while (n && n != n.parentNode /* just in case ... */) {
      xmllang = n.getAttribute('xml:lang');
      if (xmllang) {
        break;
      }
      n = n.parentNode;
    }
    if (!xmllang) {
      return new BooleanValue(false);
    } else {
      var re = new RegExp('^' + lang + '$', 'i');
      return new BooleanValue(xmllang.match(re) ||
                              xmllang.replace(/_.*$/,'').match(re));
    }
  },

  'number': function(ctx) {
    assert(this.args.length == 1 || this.args.length == 0);

    if (this.args.length == 1) {
      return new NumberValue(this.args[0].evaluate(ctx).numberValue());
    } else {
      return new NumberValue(new NodeSetValue([ ctx.node ]).numberValue());
    }
  },

  'sum': function(ctx) {
    assert(this.args.length == 1);
    var n = this.args[0].evaluate(ctx).nodeSetValue();
    var sum = 0;
    for (var i = 0; i < n.length; ++i) {
      sum += xmlValue(n[i]) - 0;
    }
    return new NumberValue(sum);
  },

  'floor': function(ctx) {
    assert(this.args.length == 1);
    var num = this.args[0].evaluate(ctx).numberValue();
    return new NumberValue(Math.floor(num));
  },

  'ceiling': function(ctx) {
    assert(this.args.length == 1);
    var num = this.args[0].evaluate(ctx).numberValue();
    return new NumberValue(Math.ceil(num));
  },

  'round': function(ctx) {
    assert(this.args.length == 1);
    var num = this.args[0].evaluate(ctx).numberValue();
    return new NumberValue(Math.round(num));
  },

  // TODO(mesch): The following functions are custom. There is a
  // standard that defines how to add functions, which should be
  // applied here.

  'ext-join': function(ctx) {
    assert(this.args.length == 2);
    var nodes = this.args[0].evaluate(ctx).nodeSetValue();
    var delim = this.args[1].evaluate(ctx).stringValue();
    var ret = '';
    for (var i = 0; i < nodes.length; ++i) {
      if (ret) {
        ret += delim;
      }
      ret += xmlValue(nodes[i]);
    }
    return new StringValue(ret);
  },

  // ext-if() evaluates and returns its second argument, if the
  // boolean value of its first argument is true, otherwise it
  // evaluates and returns its third argument.

  'ext-if': function(ctx) {
    assert(this.args.length == 3);
    if (this.args[0].evaluate(ctx).booleanValue()) {
      return this.args[1].evaluate(ctx);
    } else {
      return this.args[2].evaluate(ctx);
    }
  },

  // ext-cardinal() evaluates its single argument as a number, and
  // returns the current node that many times. It can be used in the
  // select attribute to iterate over an integer range.

  'ext-cardinal': function(ctx) {
    assert(this.args.length >= 1);
    var c = this.args[0].evaluate(ctx).numberValue();
    var ret = [];
    for (var i = 0; i < c; ++i) {
      ret.push(ctx.node);
    }
    return new NodeSetValue(ret);
  }
};

function UnionExpr(expr1, expr2) {
  this.expr1 = expr1;
  this.expr2 = expr2;
}

UnionExpr.prototype.evaluate = function(ctx) {
  var nodes1 = this.expr1.evaluate(ctx).nodeSetValue();
  var nodes2 = this.expr2.evaluate(ctx).nodeSetValue();
  var I1 = nodes1.length;
  for (var i2 = 0; i2 < nodes2.length; ++i2) {
    var n = nodes2[i2];
    var inBoth = false;
    for (var i1 = 0; i1 < I1; ++i1) {
      if (nodes1[i1] == n) {
        inBoth = true;
        i1 = I1; // break inner loop
      }
    }
    if (!inBoth) {
      nodes1.push(n);
    }
  }
  return new NodeSetValue(nodes1);
};

function PathExpr(filter, rel) {
  this.filter = filter;
  this.rel = rel;
}

PathExpr.prototype.evaluate = function(ctx) {
  var nodes = this.filter.evaluate(ctx).nodeSetValue();
  var nodes1 = [];
  for (var i = 0; i < nodes.length; ++i) {
    var nodes0 = this.rel.evaluate(ctx.clone(nodes[i], i, nodes)).nodeSetValue();
    for (var ii = 0; ii < nodes0.length; ++ii) {
      nodes1.push(nodes0[ii]);
    }
  }
  return new NodeSetValue(nodes1);
};

function FilterExpr(expr, predicate) {
  this.expr = expr;
  this.predicate = predicate;
}

FilterExpr.prototype.evaluate = function(ctx) {
  var nodes = this.expr.evaluate(ctx).nodeSetValue();
  for (var i = 0; i < this.predicate.length; ++i) {
    var nodes0 = nodes;
    nodes = [];
    for (var j = 0; j < nodes0.length; ++j) {
      var n = nodes0[j];
      if (this.predicate[i].evaluate(ctx.clone(n, j, nodes0)).booleanValue()) {
        nodes.push(n);
      }
    }
  }

  return new NodeSetValue(nodes);
};

function UnaryMinusExpr(expr) {
  this.expr = expr;
}

UnaryMinusExpr.prototype.evaluate = function(ctx) {
  return new NumberValue(-this.expr.evaluate(ctx).numberValue());
};

function BinaryExpr(expr1, op, expr2) {
  this.expr1 = expr1;
  this.expr2 = expr2;
  this.op = op;
}

BinaryExpr.prototype.evaluate = function(ctx) {
  var ret;
  switch (this.op.value) {
    case 'or':
      ret = new BooleanValue(this.expr1.evaluate(ctx).booleanValue() ||
                             this.expr2.evaluate(ctx).booleanValue());
      break;

    case 'and':
      ret = new BooleanValue(this.expr1.evaluate(ctx).booleanValue() &&
                             this.expr2.evaluate(ctx).booleanValue());
      break;

    case '+':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() +
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case '-':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() -
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case '*':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() *
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case 'mod':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() %
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case 'div':
      ret = new NumberValue(this.expr1.evaluate(ctx).numberValue() /
                            this.expr2.evaluate(ctx).numberValue());
      break;

    case '=':
      ret = this.compare(ctx, function(x1, x2) { return x1 == x2; });
      break;

    case '!=':
      ret = this.compare(ctx, function(x1, x2) { return x1 != x2; });
      break;

    case '<':
      ret = this.compare(ctx, function(x1, x2) { return x1 < x2; });
      break;

    case '<=':
      ret = this.compare(ctx, function(x1, x2) { return x1 <= x2; });
      break;

    case '>':
      ret = this.compare(ctx, function(x1, x2) { return x1 > x2; });
      break;

    case '>=':
      ret = this.compare(ctx, function(x1, x2) { return x1 >= x2; });
      break;

    default:
      alert('BinaryExpr.evaluate: ' + this.op.value);
  }
  return ret;
};

BinaryExpr.prototype.compare = function(ctx, cmp) {
  var v1 = this.expr1.evaluate(ctx);
  var v2 = this.expr2.evaluate(ctx);

  var ret;
  if (v1.type == 'node-set' && v2.type == 'node-set') {
    var n1 = v1.nodeSetValue();
    var n2 = v2.nodeSetValue();
    ret = false;
    for (var i1 = 0; i1 < n1.length; ++i1) {
      for (var i2 = 0; i2 < n2.length; ++i2) {
        if (cmp(xmlValue(n1[i1]), xmlValue(n2[i2]))) {
          ret = true;
          // Break outer loop. Labels confuse the jscompiler and we
          // don't use them.
          i2 = n2.length;
          i1 = n1.length;
        }
      }
    }

  } else if (v1.type == 'node-set' || v2.type == 'node-set') {

    if (v1.type == 'number') {
      var s = v1.numberValue();
      var n = v2.nodeSetValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]) - 0;
        if (cmp(s, nn)) {
          ret = true;
          break;
        }
      }

    } else if (v2.type == 'number') {
      var n = v1.nodeSetValue();
      var s = v2.numberValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]) - 0;
        if (cmp(nn, s)) {
          ret = true;
          break;
        }
      }

    } else if (v1.type == 'string') {
      var s = v1.stringValue();
      var n = v2.nodeSetValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]);
        if (cmp(s, nn)) {
          ret = true;
          break;
        }
      }

    } else if (v2.type == 'string') {
      var n = v1.nodeSetValue();
      var s = v2.stringValue();

      ret = false;
      for (var i = 0;  i < n.length; ++i) {
        var nn = xmlValue(n[i]);
        if (cmp(nn, s)) {
          ret = true;
          break;
        }
      }

    } else {
      ret = cmp(v1.booleanValue(), v2.booleanValue());
    }

  } else if (v1.type == 'boolean' || v2.type == 'boolean') {
    ret = cmp(v1.booleanValue(), v2.booleanValue());

  } else if (v1.type == 'number' || v2.type == 'number') {
    ret = cmp(v1.numberValue(), v2.numberValue());

  } else {
    ret = cmp(v1.stringValue(), v2.stringValue());
  }

  return new BooleanValue(ret);
};

function LiteralExpr(value) {
  this.value = value;
}

LiteralExpr.prototype.evaluate = function(ctx) {
  return new StringValue(this.value);
};

function NumberExpr(value) {
  this.value = value;
}

NumberExpr.prototype.evaluate = function(ctx) {
  return new NumberValue(this.value);
};

function VariableExpr(name) {
  this.name = name;
}

VariableExpr.prototype.evaluate = function(ctx) {
  return ctx.getVariable(this.name);
};

// Factory functions for semantic values (i.e. Expressions) of the
// productions in the grammar. When a production is matched to reduce
// the current parse state stack, the function is called with the
// semantic values of the matched elements as arguments, and returns
// another semantic value. The semantic value is a node of the parse
// tree, an expression object with an evaluate() method that evaluates the
// expression in an actual context. These factory functions are used
// in the specification of the grammar rules, below.

function makeTokenExpr(m) {
  return new TokenExpr(m);
}

function passExpr(e) {
  return e;
}

function makeLocationExpr1(slash, rel) {
  rel.absolute = true;
  return rel;
}

function makeLocationExpr2(dslash, rel) {
  rel.absolute = true;
  rel.prependStep(makeAbbrevStep(dslash.value));
  return rel;
}

function makeLocationExpr3(slash) {
  var ret = new LocationExpr();
  ret.appendStep(makeAbbrevStep('.'));
  ret.absolute = true;
  return ret;
}

function makeLocationExpr4(dslash) {
  var ret = new LocationExpr();
  ret.absolute = true;
  ret.appendStep(makeAbbrevStep(dslash.value));
  return ret;
}

function makeLocationExpr5(step) {
  var ret = new LocationExpr();
  ret.appendStep(step);
  return ret;
}

function makeLocationExpr6(rel, slash, step) {
  rel.appendStep(step);
  return rel;
}

function makeLocationExpr7(rel, dslash, step) {
  rel.appendStep(makeAbbrevStep(dslash.value));
  return rel;
}

function makeStepExpr1(dot) {
  return makeAbbrevStep(dot.value);
}

function makeStepExpr2(ddot) {
  return makeAbbrevStep(ddot.value);
}

function makeStepExpr3(axisname, axis, nodetest) {
  return new StepExpr(axisname.value, nodetest);
}

function makeStepExpr4(at, nodetest) {
  return new StepExpr('attribute', nodetest);
}

function makeStepExpr5(nodetest) {
  return new StepExpr('child', nodetest);
}

function makeStepExpr6(step, predicate) {
  step.appendPredicate(predicate);
  return step;
}

function makeAbbrevStep(abbrev) {
  switch (abbrev) {
  case '//':
    return new StepExpr('descendant-or-self', new NodeTestAny);

  case '.':
    return new StepExpr('self', new NodeTestAny);

  case '..':
    return new StepExpr('parent', new NodeTestAny);
  }
}

function makeNodeTestExpr1(asterisk) {
  return new NodeTestElementOrAttribute;
}

function makeNodeTestExpr2(ncname, colon, asterisk) {
  return new NodeTestNC(ncname.value);
}

function makeNodeTestExpr3(qname) {
  return new NodeTestName(qname.value);
}

function makeNodeTestExpr4(typeo, parenc) {
  var type = typeo.value.replace(/\s*\($/, '');
  switch(type) {
  case 'node':
    return new NodeTestAny;

  case 'text':
    return new NodeTestText;

  case 'comment':
    return new NodeTestComment;

  case 'processing-instruction':
    return new NodeTestPI('');
  }
}

function makeNodeTestExpr5(typeo, target, parenc) {
  var type = typeo.replace(/\s*\($/, '');
  if (type != 'processing-instruction') {
    throw type;
  }
  return new NodeTestPI(target.value);
}

function makePredicateExpr(pareno, expr, parenc) {
  return new PredicateExpr(expr);
}

function makePrimaryExpr(pareno, expr, parenc) {
  return expr;
}

function makeFunctionCallExpr1(name, pareno, parenc) {
  return new FunctionCallExpr(name);
}

function makeFunctionCallExpr2(name, pareno, arg1, args, parenc) {
  var ret = new FunctionCallExpr(name);
  ret.appendArg(arg1);
  for (var i = 0; i < args.length; ++i) {
    ret.appendArg(args[i]);
  }
  return ret;
}

function makeArgumentExpr(comma, expr) {
  return expr;
}

function makeUnionExpr(expr1, pipe, expr2) {
  return new UnionExpr(expr1, expr2);
}

function makePathExpr1(filter, slash, rel) {
  return new PathExpr(filter, rel);
}

function makePathExpr2(filter, dslash, rel) {
  rel.prependStep(makeAbbrevStep(dslash.value));
  return new PathExpr(filter, rel);
}

function makeFilterExpr(expr, predicates) {
  if (predicates.length > 0) {
    return new FilterExpr(expr, predicates);
  } else {
    return expr;
  }
}

function makeUnaryMinusExpr(minus, expr) {
  return new UnaryMinusExpr(expr);
}

function makeBinaryExpr(expr1, op, expr2) {
  return new BinaryExpr(expr1, op, expr2);
}

function makeLiteralExpr(token) {
  // remove quotes from the parsed value:
  var value = token.value.substring(1, token.value.length - 1);
  return new LiteralExpr(value);
}

function makeNumberExpr(token) {
  return new NumberExpr(token.value);
}

function makeVariableReference(dollar, name) {
  return new VariableExpr(name.value);
}

// Used before parsing for optimization of common simple cases. See
// the begin of xpathParse() for which they are.
function makeSimpleExpr(expr) {
  if (expr.charAt(0) == '$') {
    return new VariableExpr(expr.substr(1));
  } else if (expr.charAt(0) == '@') {
    var a = new NodeTestName(expr.substr(1));
    var b = new StepExpr('attribute', a);
    var c = new LocationExpr();
    c.appendStep(b);
    return c;
  } else if (expr.match(/^[0-9]+$/)) {
    return new NumberExpr(expr);
  } else {
    var a = new NodeTestName(expr);
    var b = new StepExpr('child', a);
    var c = new LocationExpr();
    c.appendStep(b);
    return c;
  }
}

function makeSimpleExpr2(expr) {
  var steps = stringSplit(expr, '/');
  var c = new LocationExpr();
  for (var i = 0; i < steps.length; ++i) {
    var a = new NodeTestName(steps[i]);
    var b = new StepExpr('child', a);
    c.appendStep(b);
  }
  return c;
}

// The axes of XPath expressions.

var xpathAxis = {
  ANCESTOR_OR_SELF: 'ancestor-or-self',
  ANCESTOR: 'ancestor',
  ATTRIBUTE: 'attribute',
  CHILD: 'child',
  DESCENDANT_OR_SELF: 'descendant-or-self',
  DESCENDANT: 'descendant',
  FOLLOWING_SIBLING: 'following-sibling',
  FOLLOWING: 'following',
  NAMESPACE: 'namespace',
  PARENT: 'parent',
  PRECEDING_SIBLING: 'preceding-sibling',
  PRECEDING: 'preceding',
  SELF: 'self'
};

var xpathAxesRe = [
    xpathAxis.ANCESTOR_OR_SELF,
    xpathAxis.ANCESTOR,
    xpathAxis.ATTRIBUTE,
    xpathAxis.CHILD,
    xpathAxis.DESCENDANT_OR_SELF,
    xpathAxis.DESCENDANT,
    xpathAxis.FOLLOWING_SIBLING,
    xpathAxis.FOLLOWING,
    xpathAxis.NAMESPACE,
    xpathAxis.PARENT,
    xpathAxis.PRECEDING_SIBLING,
    xpathAxis.PRECEDING,
    xpathAxis.SELF
].join('|');


// The tokens of the language. The label property is just used for
// generating debug output. The prec property is the precedence used
// for shift/reduce resolution. Default precedence is 0 as a lookahead
// token and 2 on the stack. TODO(mesch): this is certainly not
// necessary and too complicated. Simplify this!

// NOTE: tabular formatting is the big exception, but here it should
// be OK.

var TOK_PIPE =   { label: "|",   prec:   17, re: new RegExp("^\\|") };
var TOK_DSLASH = { label: "//",  prec:   19, re: new RegExp("^//")  };
var TOK_SLASH =  { label: "/",   prec:   30, re: new RegExp("^/")   };
var TOK_AXIS =   { label: "::",  prec:   20, re: new RegExp("^::")  };
var TOK_COLON =  { label: ":",   prec: 1000, re: new RegExp("^:")  };
var TOK_AXISNAME = { label: "[axis]", re: new RegExp('^(' + xpathAxesRe + ')') };
var TOK_PARENO = { label: "(",   prec:   34, re: new RegExp("^\\(") };
var TOK_PARENC = { label: ")",               re: new RegExp("^\\)") };
var TOK_DDOT =   { label: "..",  prec:   34, re: new RegExp("^\\.\\.") };
var TOK_DOT =    { label: ".",   prec:   34, re: new RegExp("^\\.") };
var TOK_AT =     { label: "@",   prec:   34, re: new RegExp("^@")   };

var TOK_COMMA =  { label: ",",               re: new RegExp("^,") };

var TOK_OR =     { label: "or",  prec:   10, re: new RegExp("^or\\b") };
var TOK_AND =    { label: "and", prec:   11, re: new RegExp("^and\\b") };
var TOK_EQ =     { label: "=",   prec:   12, re: new RegExp("^=")   };
var TOK_NEQ =    { label: "!=",  prec:   12, re: new RegExp("^!=")  };
var TOK_GE =     { label: ">=",  prec:   13, re: new RegExp("^>=")  };
var TOK_GT =     { label: ">",   prec:   13, re: new RegExp("^>")   };
var TOK_LE =     { label: "<=",  prec:   13, re: new RegExp("^<=")  };
var TOK_LT =     { label: "<",   prec:   13, re: new RegExp("^<")   };
var TOK_PLUS =   { label: "+",   prec:   14, re: new RegExp("^\\+"), left: true };
var TOK_MINUS =  { label: "-",   prec:   14, re: new RegExp("^\\-"), left: true };
var TOK_DIV =    { label: "div", prec:   15, re: new RegExp("^div\\b"), left: true };
var TOK_MOD =    { label: "mod", prec:   15, re: new RegExp("^mod\\b"), left: true };

var TOK_BRACKO = { label: "[",   prec:   32, re: new RegExp("^\\[") };
var TOK_BRACKC = { label: "]",               re: new RegExp("^\\]") };
var TOK_DOLLAR = { label: "$",               re: new RegExp("^\\$") };

var TOK_NCNAME = { label: "[ncname]", re: new RegExp('^' + XML_NC_NAME) };

var TOK_ASTERISK = { label: "*", prec: 15, re: new RegExp("^\\*"), left: true };
var TOK_LITERALQ = { label: "[litq]", prec: 20, re: new RegExp("^'[^\\']*'") };
var TOK_LITERALQQ = {
  label: "[litqq]",
  prec: 20,
  re: new RegExp('^"[^\\"]*"')
};

var TOK_NUMBER  = {
  label: "[number]",
  prec: 35,
  re: new RegExp('^\\d+(\\.\\d*)?') };

var TOK_QNAME = {
  label: "[qname]",
  re: new RegExp('^(' + XML_NC_NAME + ':)?' + XML_NC_NAME)
};

var TOK_NODEO = {
  label: "[nodetest-start]",
  re: new RegExp('^(processing-instruction|comment|text|node)\\(')
};

// The table of the tokens of our grammar, used by the lexer: first
// column the tag, second column a regexp to recognize it in the
// input, third column the precedence of the token, fourth column a
// factory function for the semantic value of the token.
//
// NOTE: order of this list is important, because the first match
// counts. Cf. DDOT and DOT, and AXIS and COLON.

var xpathTokenRules = [
    TOK_DSLASH,
    TOK_SLASH,
    TOK_DDOT,
    TOK_DOT,
    TOK_AXIS,
    TOK_COLON,
    TOK_AXISNAME,
    TOK_NODEO,
    TOK_PARENO,
    TOK_PARENC,
    TOK_BRACKO,
    TOK_BRACKC,
    TOK_AT,
    TOK_COMMA,
    TOK_OR,
    TOK_AND,
    TOK_NEQ,
    TOK_EQ,
    TOK_GE,
    TOK_GT,
    TOK_LE,
    TOK_LT,
    TOK_PLUS,
    TOK_MINUS,
    TOK_ASTERISK,
    TOK_PIPE,
    TOK_MOD,
    TOK_DIV,
    TOK_LITERALQ,
    TOK_LITERALQQ,
    TOK_NUMBER,
    TOK_QNAME,
    TOK_NCNAME,
    TOK_DOLLAR
];

// All the nonterminals of the grammar. The nonterminal objects are
// identified by object identity; the labels are used in the debug
// output only.
var XPathLocationPath = { label: "LocationPath" };
var XPathRelativeLocationPath = { label: "RelativeLocationPath" };
var XPathAbsoluteLocationPath = { label: "AbsoluteLocationPath" };
var XPathStep = { label: "Step" };
var XPathNodeTest = { label: "NodeTest" };
var XPathPredicate = { label: "Predicate" };
var XPathLiteral = { label: "Literal" };
var XPathExpr = { label: "Expr" };
var XPathPrimaryExpr = { label: "PrimaryExpr" };
var XPathVariableReference = { label: "Variablereference" };
var XPathNumber = { label: "Number" };
var XPathFunctionCall = { label: "FunctionCall" };
var XPathArgumentRemainder = { label: "ArgumentRemainder" };
var XPathPathExpr = { label: "PathExpr" };
var XPathUnionExpr = { label: "UnionExpr" };
var XPathFilterExpr = { label: "FilterExpr" };
var XPathDigits = { label: "Digits" };

var xpathNonTerminals = [
    XPathLocationPath,
    XPathRelativeLocationPath,
    XPathAbsoluteLocationPath,
    XPathStep,
    XPathNodeTest,
    XPathPredicate,
    XPathLiteral,
    XPathExpr,
    XPathPrimaryExpr,
    XPathVariableReference,
    XPathNumber,
    XPathFunctionCall,
    XPathArgumentRemainder,
    XPathPathExpr,
    XPathUnionExpr,
    XPathFilterExpr,
    XPathDigits
];

// Quantifiers that are used in the productions of the grammar.
var Q_01 = { label: "?" };
var Q_MM = { label: "*" };
var Q_1M = { label: "+" };

// Tag for left associativity (right assoc is implied by undefined).
var ASSOC_LEFT = true;

// The productions of the grammar. Columns of the table:
//
// - target nonterminal,
// - pattern,
// - precedence,
// - semantic value factory
//
// The semantic value factory is a function that receives parse tree
// nodes from the stack frames of the matched symbols as arguments and
// returns an a node of the parse tree. The node is stored in the top
// stack frame along with the target object of the rule. The node in
// the parse tree is an expression object that has an evaluate() method
// and thus evaluates XPath expressions.
//
// The precedence is used to decide between reducing and shifting by
// comparing the precendence of the rule that is candidate for
// reducing with the precedence of the look ahead token. Precedence of
// -1 means that the precedence of the tokens in the pattern is used
// instead. TODO: It shouldn't be necessary to explicitly assign
// precedences to rules.

var xpathGrammarRules =
  [
   [ XPathLocationPath, [ XPathRelativeLocationPath ], 18,
     passExpr ],
   [ XPathLocationPath, [ XPathAbsoluteLocationPath ], 18,
     passExpr ],

   [ XPathAbsoluteLocationPath, [ TOK_SLASH, XPathRelativeLocationPath ], 18,
     makeLocationExpr1 ],
   [ XPathAbsoluteLocationPath, [ TOK_DSLASH, XPathRelativeLocationPath ], 18,
     makeLocationExpr2 ],

   [ XPathAbsoluteLocationPath, [ TOK_SLASH ], 0,
     makeLocationExpr3 ],
   [ XPathAbsoluteLocationPath, [ TOK_DSLASH ], 0,
     makeLocationExpr4 ],

   [ XPathRelativeLocationPath, [ XPathStep ], 31,
     makeLocationExpr5 ],
   [ XPathRelativeLocationPath,
     [ XPathRelativeLocationPath, TOK_SLASH, XPathStep ], 31,
     makeLocationExpr6 ],
   [ XPathRelativeLocationPath,
     [ XPathRelativeLocationPath, TOK_DSLASH, XPathStep ], 31,
     makeLocationExpr7 ],

   [ XPathStep, [ TOK_DOT ], 33,
     makeStepExpr1 ],
   [ XPathStep, [ TOK_DDOT ], 33,
     makeStepExpr2 ],
   [ XPathStep,
     [ TOK_AXISNAME, TOK_AXIS, XPathNodeTest ], 33,
     makeStepExpr3 ],
   [ XPathStep, [ TOK_AT, XPathNodeTest ], 33,
     makeStepExpr4 ],
   [ XPathStep, [ XPathNodeTest ], 33,
     makeStepExpr5 ],
   [ XPathStep, [ XPathStep, XPathPredicate ], 33,
     makeStepExpr6 ],

   [ XPathNodeTest, [ TOK_ASTERISK ], 33,
     makeNodeTestExpr1 ],
   [ XPathNodeTest, [ TOK_NCNAME, TOK_COLON, TOK_ASTERISK ], 33,
     makeNodeTestExpr2 ],
   [ XPathNodeTest, [ TOK_QNAME ], 33,
     makeNodeTestExpr3 ],
   [ XPathNodeTest, [ TOK_NODEO, TOK_PARENC ], 33,
     makeNodeTestExpr4 ],
   [ XPathNodeTest, [ TOK_NODEO, XPathLiteral, TOK_PARENC ], 33,
     makeNodeTestExpr5 ],

   [ XPathPredicate, [ TOK_BRACKO, XPathExpr, TOK_BRACKC ], 33,
     makePredicateExpr ],

   [ XPathPrimaryExpr, [ XPathVariableReference ], 33,
     passExpr ],
   [ XPathPrimaryExpr, [ TOK_PARENO, XPathExpr, TOK_PARENC ], 33,
     makePrimaryExpr ],
   [ XPathPrimaryExpr, [ XPathLiteral ], 30,
     passExpr ],
   [ XPathPrimaryExpr, [ XPathNumber ], 30,
     passExpr ],
   [ XPathPrimaryExpr, [ XPathFunctionCall ], 30,
     passExpr ],

   [ XPathFunctionCall, [ TOK_QNAME, TOK_PARENO, TOK_PARENC ], -1,
     makeFunctionCallExpr1 ],
   [ XPathFunctionCall,
     [ TOK_QNAME, TOK_PARENO, XPathExpr, XPathArgumentRemainder, Q_MM,
       TOK_PARENC ], -1,
     makeFunctionCallExpr2 ],
   [ XPathArgumentRemainder, [ TOK_COMMA, XPathExpr ], -1,
     makeArgumentExpr ],

   [ XPathUnionExpr, [ XPathPathExpr ], 20,
     passExpr ],
   [ XPathUnionExpr, [ XPathUnionExpr, TOK_PIPE, XPathPathExpr ], 20,
     makeUnionExpr ],

   [ XPathPathExpr, [ XPathLocationPath ], 20,
     passExpr ],
   [ XPathPathExpr, [ XPathFilterExpr ], 19,
     passExpr ],
   [ XPathPathExpr,
     [ XPathFilterExpr, TOK_SLASH, XPathRelativeLocationPath ], 20,
     makePathExpr1 ],
   [ XPathPathExpr,
     [ XPathFilterExpr, TOK_DSLASH, XPathRelativeLocationPath ], 20,
     makePathExpr2 ],

   [ XPathFilterExpr, [ XPathPrimaryExpr, XPathPredicate, Q_MM ], 20,
     makeFilterExpr ],

   [ XPathExpr, [ XPathPrimaryExpr ], 16,
     passExpr ],
   [ XPathExpr, [ XPathUnionExpr ], 16,
     passExpr ],

   [ XPathExpr, [ TOK_MINUS, XPathExpr ], -1,
     makeUnaryMinusExpr ],

   [ XPathExpr, [ XPathExpr, TOK_OR, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_AND, XPathExpr ], -1,
     makeBinaryExpr ],

   [ XPathExpr, [ XPathExpr, TOK_EQ, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_NEQ, XPathExpr ], -1,
     makeBinaryExpr ],

   [ XPathExpr, [ XPathExpr, TOK_LT, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_LE, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_GT, XPathExpr ], -1,
     makeBinaryExpr ],
   [ XPathExpr, [ XPathExpr, TOK_GE, XPathExpr ], -1,
     makeBinaryExpr ],

   [ XPathExpr, [ XPathExpr, TOK_PLUS, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],
   [ XPathExpr, [ XPathExpr, TOK_MINUS, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],

   [ XPathExpr, [ XPathExpr, TOK_ASTERISK, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],
   [ XPathExpr, [ XPathExpr, TOK_DIV, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],
   [ XPathExpr, [ XPathExpr, TOK_MOD, XPathExpr ], -1,
     makeBinaryExpr, ASSOC_LEFT ],

   [ XPathLiteral, [ TOK_LITERALQ ], -1,
     makeLiteralExpr ],
   [ XPathLiteral, [ TOK_LITERALQQ ], -1,
     makeLiteralExpr ],

   [ XPathNumber, [ TOK_NUMBER ], -1,
     makeNumberExpr ],

   [ XPathVariableReference, [ TOK_DOLLAR, TOK_QNAME ], 200,
     makeVariableReference ]
   ];

// That function computes some optimizations of the above data
// structures and will be called right here. It merely takes the
// counter variables out of the global scope.

var xpathRules = [];

function xpathParseInit() {
  if (xpathRules.length) {
    return;
  }

  // Some simple optimizations for the xpath expression parser: sort
  // grammar rules descending by length, so that the longest match is
  // first found.

  xpathGrammarRules.sort(function(a,b) {
    var la = a[1].length;
    var lb = b[1].length;
    if (la < lb) {
      return 1;
    } else if (la > lb) {
      return -1;
    } else {
      return 0;
    }
  });

  var k = 1;
  for (var i = 0; i < xpathNonTerminals.length; ++i) {
    xpathNonTerminals[i].key = k++;
  }

  for (i = 0; i < xpathTokenRules.length; ++i) {
    xpathTokenRules[i].key = k++;
  }

  xpathLog('XPath parse INIT: ' + k + ' rules');

  // Another slight optimization: sort the rules into bins according
  // to the last element (observing quantifiers), so we can restrict
  // the match against the stack to the subest of rules that match the
  // top of the stack.
  //
  // TODO(mesch): What we actually want is to compute states as in
  // bison, so that we don't have to do any explicit and iterated
  // match against the stack.

  function push_(array, position, element) {
    if (!array[position]) {
      array[position] = [];
    }
    array[position].push(element);
  }

  for (i = 0; i < xpathGrammarRules.length; ++i) {
    var rule = xpathGrammarRules[i];
    var pattern = rule[1];

    for (var j = pattern.length - 1; j >= 0; --j) {
      if (pattern[j] == Q_1M) {
        push_(xpathRules, pattern[j-1].key, rule);
        break;

      } else if (pattern[j] == Q_MM || pattern[j] == Q_01) {
        push_(xpathRules, pattern[j-1].key, rule);
        --j;

      } else {
        push_(xpathRules, pattern[j].key, rule);
        break;
      }
    }
  }

  xpathLog('XPath parse INIT: ' + xpathRules.length + ' rule bins');

  var sum = 0;
  mapExec(xpathRules, function(i) {
    if (i) {
      sum += i.length;
    }
  });

  xpathLog('XPath parse INIT: ' + (sum / xpathRules.length) +
           ' average bin size');
}

// Local utility functions that are used by the lexer or parser.

function xpathCollectDescendants(nodelist, node) {
  for (var n = node.firstChild; n; n = n.nextSibling) {
    nodelist.push(n);
    arguments.callee(nodelist, n);
  }
}

function xpathCollectDescendantsReverse(nodelist, node) {
  for (var n = node.lastChild; n; n = n.previousSibling) {
    nodelist.push(n);
    arguments.callee(nodelist, n);
  }
}


// The entry point for the library: match an expression against a DOM
// node. Returns an XPath value.
function xpathDomEval(expr, node) {
  var expr1 = xpathParse(expr);
  var ret = expr1.evaluate(new ExprContext(node));
  return ret;
}

// Utility function to sort a list of nodes. Used by xsltSort() and
// nxslSelect().
function xpathSort(input, sort) {
  if (sort.length == 0) {
    return;
  }

  var sortlist = [];

  for (var i = 0; i < input.contextSize(); ++i) {
    var node = input.nodelist[i];
    var sortitem = { node: node, key: [] };
    var context = input.clone(node, 0, [ node ]);

    for (var j = 0; j < sort.length; ++j) {
      var s = sort[j];
      var value = s.expr.evaluate(context);

      var evalue;
      if (s.type == 'text') {
        evalue = value.stringValue();
      } else if (s.type == 'number') {
        evalue = value.numberValue();
      }
      sortitem.key.push({ value: evalue, order: s.order });
    }

    // Make the sort stable by adding a lowest priority sort by
    // id. This is very convenient and furthermore required by the
    // spec ([XSLT] - Section 10 Sorting).
    sortitem.key.push({ value: i, order: 'ascending' });

    sortlist.push(sortitem);
  }

  sortlist.sort(xpathSortByKey);

  var nodes = [];
  for (var i = 0; i < sortlist.length; ++i) {
    nodes.push(sortlist[i].node);
  }
  input.nodelist = nodes;
  input.setNode(0);
}


// Sorts by all order criteria defined. According to the JavaScript
// spec ([ECMA] Section 11.8.5), the compare operators compare strings
// as strings and numbers as numbers.
//
// NOTE: In browsers which do not follow the spec, this breaks only in
// the case that numbers should be sorted as strings, which is very
// uncommon.
function xpathSortByKey(v1, v2) {
  // NOTE: Sort key vectors of different length never occur in
  // xsltSort.

  for (var i = 0; i < v1.key.length; ++i) {
    var o = v1.key[i].order == 'descending' ? -1 : 1;
    if (v1.key[i].value > v2.key[i].value) {
      return +1 * o;
    } else if (v1.key[i].value < v2.key[i].value) {
      return -1 * o;
    }
  }

  return 0;
}


// Parses and then evaluates the given XPath expression in the given
// input context. Notice that parsed xpath expressions are cached.
function xpathEval(select, context) {
  var expr = xpathParse(select);
  var ret = expr.evaluate(context);
  return ret;
}
