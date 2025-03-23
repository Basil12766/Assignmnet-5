document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript loaded ✅");

   
    const searchInput = document.getElementById("search-sites");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            console.log("Searching for:", searchTerm);

            document.querySelectorAll(".site-card").forEach(card => {
                const siteName = card.querySelector(".site-name").textContent.toLowerCase();
                
          
                if (siteName.includes(searchTerm)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none"; 
                }
            });
        });
    } else {
        console.error("Search input field not found ");
    }
});
