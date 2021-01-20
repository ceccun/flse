/* Fast Layout and Substratum Engine
* Developed by Ejaz Ali @ Stella Group
* Version 0.1
* Saving Developers Time and Effort
* Open Sourced Web Development ♥ */

var settings = {};var gvar = {};var editedelems = {};var registered={};
setTimeout(bootstrapFLSE(), 0);

function bootstrapFLSE(){
    settings["firstInitOc"] = 0;
    var flseworkarea = document.createElement('FLSE');
    flseworkarea.innerHTML = "<link href='https://stella.hs.vc/flse/flse.css' rel='stylesheet'/>";
    document.body.appendChild(flseworkarea);
    var publicflseworkarea = document.createElement('publicFLSE');
    document.body.appendChild(publicflseworkarea);
    setTimeout(function (){ window.setInterval(checkPage, 50)}, 1);
}



function checkPage(){
    if (gvar["pagecontents"] != document.getElementsByTagName("html")[0].innerHTML){
        console.log("change");
        refreshFLSESettings();
    }
    if (gvar["width"] != window.innerWidth){
        console.log("repo");
        rePositionPage();
    }
    gvar["width"] = window.innerWidth;
    gvar["pagecontents"] = document.getElementsByTagName("html")[0].innerHTML;
}

function refreshFLSESettings(){
    if (document.getElementsByTagName('locale')[0] != undefined){
        settings["locale"] = document.getElementsByTagName('locale')[0].getAttribute("value");
    } else{
        settings["locale"] = navigator.language;
    }
    var target = document.getElementsByTagName('publicFLSE')[0];
    var cservices = document.getElementsByTagName("cservice");
    for (const item of cservices) {
        if (item.getAttribute("content") == 'script'){
            if(document.getElementById('flseS_' + item.getAttribute('url')) == undefined){
            var cservicescript = document.createElement('script');
            cservicescript.setAttribute("src", item.getAttribute('url'));
            cservicescript.setAttribute("id", 'flseS_' + item.getAttribute('url'));
            target.appendChild(cservicescript);
            }
        }
        if (item.getAttribute("content") == 'theme'){
            if(document.getElementById('flseT_' + item.getAttribute('url')) == undefined){
            var cservicetheme = document.createElement('link');
            cservicetheme.setAttribute("href", item.getAttribute('url'));
            cservicetheme.setAttribute("href", item.getAttribute('url'));
            cservicetheme.setAttribute("id", 'flseT_' + item.getAttribute('url'));
            cservicetheme.setAttribute("rel", 'stylesheet');
            target.appendChild(cservicetheme);
            }
        }
      }
      var customstringelements = document.querySelectorAll("[flsestring]");
      var language = settings["locale"].split("-")[0];
      var languagewlocale = settings["locale"];
      customstringelements.forEach(function (item, index){
          var stlf = item.getAttribute("flsestring");
          try{
          if (flsestrings != undefined){
              if (flsestrings[stlf][language] != undefined){
              item.innerHTML = flsestrings[stlf][language];
              } else{
                  item.innerHTML = flsestrings[stlf]["default"];
              }
              if (flsestrings[stlf][languagewlocale] != undefined){
                item.innerHTML = flsestrings[stlf][languagewlocale];
            }
          }
        } catch(error){
            console.error("FLSE: \"" + item.getAttribute("flsestring") + "\" or \"" + language + "\" and \"default\" is not defined.");
        }
      });
      var components = document.getElementsByTagName("flsehtmlcomponent");
      for(var item of components){
          if (item.getAttribute("registered") == null){
              fetch(item.getAttribute("src")).then((response)=>{ if(response.status.toString().startsWith("2")){ response.text().then((text)=>{ item.insertAdjacentHTML('beforeend', text); item.setAttribute("registered", ""); })}else{console.error("FLSE: Could not load HTMLComponent \"" + item.getAttribute("src") + "\: The result came back as a " + response.status);}});
          }
      }
      rePositionPage();
}

function rePositionPage(){
    gvar["mobile"] = Math.min(window.innerWidth, window.innerWidth) < 768;
    if (gvar["mobile"] == true){
        var mobileonly = document.getElementsByTagName("flsemobileonly");
        var mobilehide = document.getElementsByTagName("flsemobilehide");
        for (const item of mobileonly){
            item.setAttribute("style","");
        }
        for (const item of mobilehide){
            item.setAttribute("style","display: none;");
        }
    } else{
        var mobileonly = document.getElementsByTagName("flsemobileonly");
        var mobilehide = document.getElementsByTagName("flsemobilehide");
        for (const item of mobileonly){
            item.setAttribute("style","display: none;");
        }
        for (const item of mobilehide){
            item.setAttribute("style","");
        }
    }
    var customstylesheetelements = document.querySelectorAll("[flsedynstylesheet]");
    customstylesheetelements.forEach((item, index) => {
        const linkwithdash = item.getAttribute("href");
        const linkwithoutdash = linkwithdash.split("-")[0];
        if (window.innerWidth > 768){
            item.setAttribute("href", linkwithoutdash + "-d.css");
        } else{
            item.setAttribute("href", linkwithoutdash + "-m.css");
        }
    });
    if (settings["firstInitOc"] == 0){
        try{ flseLoadcall() }catch(error){}
        settings["firstInitOc"] = 1;
    }
}