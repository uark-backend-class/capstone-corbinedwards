async function reqRecipe(url, data = {}) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

function buildQuery(params) {
    const url = "https://api.spoonacular.com/food/menuItems/search?apiKey=e5b0e8bc2dd944a8aa33366f95b2fc6d&query=Big%20Mac%20Burger%20from%20McDonald's&number=5"

    url += "apiKey=" + params.apiKey;
    url += "&query=" + params.name.replace(" ", "%");
    url += "&number=" + params.number;

    Object.keys(params).forEach(key => {})
}

reqRecipe("/app", {query: "Big Mac Burger from McDonald's", number: 10})
.then((data) => console.log(data))
.catch((err) => console.log(err));