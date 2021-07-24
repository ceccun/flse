/* 
FLSE 2.0 210721
Developed and engineered for the sites of tomorrow.
Edge Channel
*/

const flsedetec = { v: "2", channel: "edge" };
const settings = {};
var imports = {};
try {
  flsestrings;
} catch (error) {
  var flsestrings = {};
}
flseBootstrap();

function flseBootstrap() {
  settings["longLan"] = navigator.language.replace("-", "_");
  if (settings["longLan"].includes("_")) {
    settings["shortLan"] = settings["longLan"].split("_")[0];
  }

  const bodyRemovalCSS = document.createElement("style");
  bodyRemovalCSS.innerHTML = `
        body, flseimport, flsedefine {
            display: none;
        }
        `;
  bodyRemovalCSS.setAttribute("id", "flseBodyDry");
  document.body.appendChild(bodyRemovalCSS);
  settings["cssVar"] = true;
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
      importDec.setAttribute("registered", "registering");

      if (type == null) {
        console.error(
          `FLSE: The import for "${importID}" could not be completed.\nThere is no type.`
        );
        importDec.setAttribute("registered", "failed");
        continue;
      }
      if (src == null) {
        console.error(
          `FLSE: The import for "${importID}" could not be completed.\nThere is no source location.`
        );
        importDec.setAttribute("registered", "failed");
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
              importDec.setAttribute("registered", "registered");
              incrementGotCounter(ft);
            });
          } else {
            console.error(
              `FLSE: The import for "${importID}" could not be completed.\nThe server responded with ${statusCode}.`
            );
            importDec.setAttribute("registered", "failed");
            incrementGotCounter(ft);
          }
        });
      }

      if (type == "components") {
        fetch(src).then((response) => {
          var statusCode = response.status.toString();
          if (statusCode.startsWith("2")) {
            response.text().then((data) => {
              try {
                var dataParsed = JSON.parse(data);
                for (const arrElement of dataParsed) {
                  imports[arrElement["tag"]] = {
                    type: "component",
                    contents: arrElement["value"],
                  };
                }
                importDec.setAttribute("registered", "registered");
              } catch (error) {
                importDec.setAttribute("registered", "failed");
                console.error(
                  `FLSE: The import for "${importID}" could not be completed.\nThe source file is not encoded correctly.`
                );
              }
              incrementGotCounter(ft);
            });
          } else {
            console.error(
              `FLSE: The import for "${importID}" could not be completed.\nThe server responded with ${statusCode}.`
            );
            importDec.setAttribute("registered", "failed");
            incrementGotCounter(ft);
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
              importDec.setAttribute("registered", "registered");
              incrementGotCounter(ft);
            });
          } else {
            console.error(
              `FLSE: The import for "${importID}" could not be completed.\nThe server responded with ${statusCode}.`
            );
            importDec.setAttribute("registered", "failed");
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
        importDec.setAttribute("registered", "failed");
        continue;
      }

      if (type == "component") {
        imports[name] = {
          type: type,
          contents: importDec.innerHTML,
        };
        importDec.setAttribute("registered", "registered");
        incrementGotCounter(ft);
      }

      if (type == "module") {
        imports[name] = {
          type: type,
          contents: new Function("element", importDec.innerHTML),
        };
        importDec.setAttribute("registered", "registered");
        incrementGotCounter(ft);
      }
    }
  }

  if (window["importStats"]["max"] == 0 || ft == 0) {
    incrementGotCounter(ft, false);
  }
}

function incrementGotCounter(ft = 0, increment = true) {
  if (increment == true) {
    window["importStats"]["current"] += 1;
  }

  if (
    window["importStats"]["current"] == window["importStats"]["max"] ||
    ft == 0
  ) {
    languages(ft);
  }
}

function placeLang() {}

function languages(ft = 0) {
  var legacyLanElem = document.querySelectorAll("[flsestring]");
  for (const item of legacyLanElem) {
    var targetLan = item.getAttribute("flsestring");
    if (item.getAttribute("registered") != "registered") {
      item.setAttribute("registered", "registered");
      if (flsestrings[targetLan]["default"] != null) {
        item.innerHTML = flsestrings[targetLan]["default"];
      }
      if (flsestrings[targetLan][settings["longLan"]] != null) {
        item.innerHTML = flsestrings[targetLan][settings["longLan"]];
      }
      if (settings["shortLan"] != null) {
        if (flsestrings[targetLan][settings["shortLan"]] != null) {
          item.innerHTML = flsestrings[targetLan][settings["shortLan"]];
        }
      }
    }
  }
  placeElems(ft);
}

function placeElems(ft = 0) {
  var everyElem = document.getElementsByTagName("*");
  window["everyElemStats"] = {
    max: everyElem.length,
    current: 1,
  };
  for (const elem of everyElem) {
    setTimeout(() => {
      const tagName = elem.tagName.toLowerCase();
      if (tagName in imports) {
        if (imports[tagName]["type"] == "module") {
          elem.outerHTML = imports[tagName]["contents"](elem);
        }
        if (imports[tagName]["type"] == "component") {
          elem.outerHTML = imports[tagName]["contents"];
        }
      }
      if (settings["cssVar"] == true) {
        incrementElemCounter(1);
      } else {
        incrementElemCounter(ft);
      }
    }, 0);
  }
  if (window["everyElemStats"]["max"] == 0) {
    incrementElemCounter(ft, false);
  }
}

function incrementElemCounter(ft = 0, increment = true) {
  if (increment == true) {
    window["everyElemStats"]["current"] += 1;
  }
  if (
    window["everyElemStats"]["current"] == window["everyElemStats"]["max"] ||
    ft == 0
  ) {
    if (ft == 1) {
      document.getElementById("flseBodyDry").innerHTML = `
      flseimport, flsedefine {
        display: none;
        transition: none;
        animation: none;
      }
      `;
      addTriggers(ft);
    }
  }
}

function addTriggers(ft) {
  console.log("d");
  settings["cssVar"] = false;
  setInterval(() => {
    if (ft == 1) {
      settings["lastHTML"] = document.body.innerHTML;
      ft = 0;
      placeElems(0);
    } else {
      if (settings["lastHTML"] != document.body.innerHTML) {
        gatherImports(0);
        console.log("JHDIOH");
      }
      settings["lastHTML"] = document.body.innerHTML;
    }
  }, 10);
}
