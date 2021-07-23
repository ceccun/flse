const title = element.getAttribute("title");

return `
    <div>
        <h1>${title}</h1>
        <p>${element.innerText}</p>
    </div>
`;
