/* 
FLSE 2.0 210721
Developed and engineered for the sites of tomorrow.
Edge Channel
*/

const flsedetec = { v: "2", channel: "edge" };
const settings = {};
var imports = {};
var flsestrings = {};
flseBootstrap();

function flseBootstrap() {
  const bodyRemovalCSS = document.createElement("style");
  bodyRemovalCSS.innerHTML = `
        body, flseimport, flsedefine {
            display: none;
        }
        `;
  bodyRemovalCSS.setAttribute("id", "flseBodyDry");
  document.body.appendChild(bodyRemovalCSS);
  gatherImports(1);
}

function gatherImports(ft = 0) {
  var ebimports = document.getElementsByTagName("flseimport");
  var ebdefine = document.getElementsByTagName("flsedefine");
  window["importStats"] = {
    max: ebimports.length + ebdefine.length,
    current: 0,
  };

  for (const importDec of ebimports) {
    if (
      importDec.getAttribute("registered") == "registered" ||
      importDec.getAttribute("registered") == "registering" ||
      importDec.getAttribute("registered") == "failed"
    ) {
      continue;
    } else {
      const importID = btoa(Math.random());
      const type = importDec.getAttribute("type");
      const name = importDec.getAttribute("name");
      const src = importDec.getAttribute("src");
      importDec.setAttribute("ranID", importID);

      if (type == null) {
        console.error(
          `FLSE: The import for "${importID}" could not be completed.\nThere is no type.`
        );
        continue;
      }
      if (src == null) {
        console.error(
          `FLSE: The import for "${importID}" could not be completed.\nThere is no source location.`
        );
        continue;
      }

      if (type == "component") {
        fetch(src).then((response) => {
          var statusCode = response.status.toString();
          if (statusCode.startsWith("2")) {
            response.text().then((data) => {
              imports[name] = {
                type: type,
                contents: data,
              };
              incrementGotCounter(ft);
            });
          } else {
            console.error(
              `FLSE: The import for "${importID}" could not be completed.\nThe server responded with ${statusCode}.`
            );
          }
        });
      }

      if (type == "module") {
        fetch(src).then((response) => {
          var statusCode = response.status.toString();
          if (statusCode.startsWith("2")) {
            response.text().then((data) => {
              imports[name] = {
                type: type,
                contents: new Function("element", data),
              };
              incrementGotCounter(ft);
            });
          } else {
            console.error(
              `FLSE: The import for "${importID}" could not be completed.\nThe server responded with ${statusCode}.`
            );
          }
        });
      }
    }
  }

  for (const importDec of ebdefine) {
    if (
      importDec.getAttribute("registered") == "registered" ||
      importDec.getAttribute("registered") == "registering" ||
      importDec.getAttribute("registered") == "failed"
    ) {
      continue;
    } else {
      const importID = btoa(Math.random());
      const type = importDec.getAttribute("type");
      const name = importDec.getAttribute("name");
      importDec.setAttribute("ranID", importID);

      if (type == null) {
        console.error(
          `FLSE: The import for "${importID}" could not be completed.\nThere is no type.`
        );
        continue;
      }

      if (type == "component") {
        imports[name] = {
          type: type,
          contents: importDec.innerHTML,
        };
        incrementGotCounter(ft);
      }

      if (type == "module") {
        imports[name] = {
          type: type,
          contents: new Function("element", importDec.innerText),
        };
        incrementGotCounter(ft);
      }
    }
  }
}

function incrementGotCounter(ft = 0) {
  window["importStats"]["current"] += 1;
  console.log(window["importStats"]);
  if (window["importStats"]["current"] == window["importStats"]["max"]) {
    placeElems(ft);
  }
}

function placeElems(ft = 0) {
  var everyElem = document.getElementsByTagName("*");
  window["everyElemStats"] = {
    max: everyElem.length,
    current: 1,
  };

  for (const elem of everyElem) {
    const tagName = elem.tagName.toLowerCase();
    if (tagName in imports) {
      if (imports[tagName]["type"] == "module") {
        elem.outerHTML = imports[tagName]["contents"](elem);
      }
    }
    incrementElemCounter(ft);
  }
}

function incrementElemCounter(ft = 0) {
  window["everyElemStats"]["current"] += 1;
  console.log(window["everyElemStats"]);
  if (window["everyElemStats"]["current"] == window["everyElemStats"]["max"]) {
    if (ft == 1) {
      document.getElementById("flseBodyDry").innerHTML = `
      flseimport, flsedefine {
        display: none;
      }
    `;
    }
  }
}
