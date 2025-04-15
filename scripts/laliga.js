const apiKey = "a936db4e4ae9412bbdc64a84dccd2d92";
    const league = "La Liga OR Real Madrid OR FC Barcelona OR Atletico Madrid";
    let page = 1; // Start on the first page
    let isLoading = false; // Track if a request is already in progress

    // Fetch the news articles
    async function fetchNews() {
      if (isLoading) return; // Prevent multiple requests at once
      isLoading = true;

      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(league)}&language=en&sortBy=publishedAt&pageSize=5&page=${page}&apiKey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        const container = document.getElementById("news-container");
        const loadingMessage = document.getElementById("loading");

        if (!data.articles.length) {
          container.innerHTML = "<p>No news found.</p>";
          return;
        }

        // Show loading message while fetching
        loadingMessage.style.display = "block";

        // Append articles to the existing list
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

        // Hide loading message after content loads
        loadingMessage.style.display = "none";
        isLoading = false; // Allow further requests
        page++; // Move to the next page for the next fetch
      } catch (err) {
        document.getElementById("news-container").innerHTML = "<p>Failed to load news.</p>";
        console.error("Error fetching news:", err);
      }
    }

    // Check if the user has reached the bottom of the page
    function checkScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;
      if (scrollHeight - scrollPosition <= 1) {
        fetchNews(); // Load more news
      }
    }

    // Event listener for scroll
    window.addEventListener('scroll', checkScroll);

    // Initially load the news
    fetchNews();