const title = element.getAttribute("title");
const style = element.getAttribute("style");

return `
    <div style="${style}">
        <h1>${title}</h1>
        <p>${element.innerText}</p>
    </div>
`;
