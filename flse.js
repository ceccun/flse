/* 
FLSE 2.0.4 240921
Developed and engineered for the sites of tomorrow.
Stable Channel
*/

const flsedetec = { v: "2.0.3", channel: "stable" };
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
              checkModule(data, name);
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
  settings["cssVar"] = false;
  setInterval(() => {
    try {
      flseUpdate();
    } catch (e) {}
    if (ft == 1) {
      settings["lastHTML"] = document.body.innerHTML;
      ft = 0;
      try {
        flseLoadcall();
      } catch (e) {}
      placeElems(0);
    } else {
      if (settings["lastHTML"] != document.body.innerHTML) {
        gatherImports(0);
      }
      settings["lastHTML"] = document.body.innerHTML;
    }
  }, 10);
}

function checkModule(moduleData, moduleName) {
  var safe = 1;
  const dataLower = moduleData.toLowerCase();
  if (dataLower.includes("eval")) {
    console.warn(
      `FLSE: The module "${moduleName}" may contain potentially harmful code that may pose security risks to this page and any data transferred between it.
      Details: Real-time translation (eval).`
    );
    safe = 0;
  }
  if (
    dataLower.includes(".getelementbyid") ||
    dataLower.includes(".getelementsbyclassname") ||
    dataLower.includes(".getelementsbytagname")
  ) {
    console.warn(
      `FLSE: The module "${moduleName}" contains a direct reference to an element that could potentially be used to phish data outbound this page.
      Details: Target elements via IDs, class names, tag names. (getElem)`
    );
    safe = 0;
  }
  if (
    (dataLower.includes("script") && dataLower.includes("createelement")) ||
    dataLower.includes("<script>") ||
    dataLower.includes("</script>")
  ) {
    console.warn(
      `FLSE: The module "${moduleName}" contains an injection to inline or external scripts that could be used to potentially phish data outbound this page.
      Details: Script Injection`
    );
    safe = 0;
  }
  if (dataLower.includes("fetch") || dataLower.includes("xmlhttprequest")) {
    console.warn(
      `FLSE: The module "${moduleName}" may make requests to external sources, which could be used to phish data outbound this page.
      Details: External network requests. (fetch, XMLHttpRequest)`
    );
    safe = 0;
  }

  if (safe == 0) {
    console.error(
      "FLSE: There are critical messages being displayed in the Warnings log."
    );
  }
}
