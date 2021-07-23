const num = element.getAttribute("s");
const random = btoa(Math.random());

fetch("https://api.github.com/repos/stel-la/flse/releases").then((response) => {
  if (response.status == 200) {
    response.json().then((data) => {
      document.getElementById(random).innerHTML = `
                <h1>${data[num]["tag_name"]}</h1>
                <p>${data[num]["target_commitish"]}</p>
            `;
    });
  } else {
    document
      .getElementById("latest-releases")
      .setAttribute("style", "display: none");
  }
});

return `
    <div id="${random}">
        <div class="skel" style="width: 30%; height: 40px;"></div>
        <div class="skel" style="width: 20%; height: 20px; margin-top: 20px;"></div>
    </div>
`;
