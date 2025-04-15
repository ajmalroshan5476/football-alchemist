const apiKey = "a936db4e4ae9412bbdc64a84dccd2d92"; 
const league = "Premier League";
let page = 1; 
let isLoading = false; 


async function fetchNews() {
    if (isLoading) return; 
    isLoading = true;

    try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(league)}&language=en&sortBy=publishedAt&pageSize=5&page=${page}&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        const container = document.getElementById("news-container");
        const loadingMessage = document.getElementById("loading");

        
        loadingMessage.style.display = "block";

        if (!data.articles.length) {
            container.innerHTML = "<p>No news found.</p>";
            return;
        }

        
        data.articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "news-card";
            card.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description || "No description available."}</p>
                ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image">` : ""}
                <a href="${article.url}" target="_blank">Read full article</a>
            `;
            container.appendChild(card);
        });

        
        loadingMessage.style.display = "none";
        isLoading = false;
        page++; 
    } catch (err) {
        document.getElementById("news-container").innerHTML = "<p>Failed to load news.</p>";
        console.error("Error fetching news:", err);
    }
}


function checkScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.innerHeight + window.scrollY;
    if (scrollHeight - scrollPosition <= 1) {
        fetchNews(); // Load more news
    }
}


window.addEventListener('scroll', checkScroll);


fetchNews();