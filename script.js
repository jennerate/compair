var familyNames = [];
var fontFamilyToVariant = {};

$(document).ready(function() {
    $.getJSON('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDpaGbLfNra9QThWuy1_D6BUdSC6k_fIFg', function(response) {
        $.each(response, function(key, value) {
            if (key === "items") {
                for(var i = 0; i < value.length; i++) {
                    var fontInformation = value[i];
                    var fontFamily = fontInformation["family"];
                    familyNames.push(fontFamily);
                    var variants = fontInformation['variants'];
                    var variantsParsed = [];
                    for (let i=0; i < variants.length; i++) {
                        let variant = variants[i];
                        let parts = variant.match(/([0-9]*)([A-Za-z]*)/);
                        let variantParsed = new Variant(parts[1], parts[2]);
                        variantsParsed.push(variantParsed);
                    }
                    fontFamilyToVariant[fontFamily] = variantsParsed;
                }
            };
        });
    });
});

var variants = [];


function autocomplete(inp, familyNames) {
    inp.addEventListener("input", function() {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < familyNames.length; i++) {
          if (familyNames[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + familyNames[i].substr(0, val.length) + "</strong>";
            b.innerHTML += familyNames[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + familyNames[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                loadFont(inp.value);
                if (inp ===  document.getElementById("myInput")) {
                    var fontStyling = document.getElementById('font-writing');
                } else {
                    var fontStyling = document.getElementById('font-writing-second');
                }
                var fontFamily = inp.value;
                fontStyling.setAttribute("style", "font-family:" + fontFamily + ";");
                updateVariants(fontFamilyToVariant[fontFamily], inp);
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });

    function closeAllLists() {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
  
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


function loadFont(val) {
    WebFont.load({
        google: {
        families: [val]
        }
    });
}

function updateStyles(textSize, fontWriting) {
    textSize.addEventListener("input", function() {
        var styling = textSize.value;
        var element = fontWriting;
        element.style.fontSize = styling + "px";
    })
}

function updateVariants(variants, inp) {
    if (inp ===  document.getElementById("myInput")) {
        var variantList = document.getElementById("variants-list");
        variantList.onclick = updateTextVariant;
    } else {
        var variantList = document.getElementById("variants-list-two");
        variantList.onclick = updateTextVariantSecond;
    }
    var variantOptions = variantList.childNodes;
    for (var i = 0; i < variantOptions.length; i++) {
        variantList.removeChild(variantOptions[i]);
    }

    for (var i = 0 ; i < variants.length ; i++ ) {
        var node = document.createElement("DIV");
        node.className = 'variant';
        node["variant"] = variants[i];
        var variantOption = document.createTextNode(variants[i].weight + " " + variants[i].style);
        variantOption.className += "variant-options";
        node.appendChild(variantOption);
        variantList.appendChild(node);
    }
}

function updateTextVariant(target) {
    var text = document.getElementById("font-writing");
    var variant = target.target.variant;
    text.style.fontWeight = variant.weight;
    text.style.fontStyle = variant.style;
}

function updateTextVariantSecond(target) {
    var text = document.getElementById("font-writing-second");
    var variant = target.target.variant;
    text.style.fontWeight = variant.weight;
    text.style.fontStyle = variant.style;

}
 
class Variant {
    constructor(fontWeight, fontStyle) {
        this.weight = fontWeight;
        this.style = fontStyle;
    }
}