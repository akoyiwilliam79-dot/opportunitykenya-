document.addEventListener("DOMContentLoaded", function () {
    const savedList = document.getElementById("savedList");
    const savedTotal = document.getElementById("savedTotal");
    const savedSummaryText = document.getElementById("savedSummaryText");
    const savedEmpty = document.getElementById("savedEmpty");

    // Remove a saved opportunity
    document.querySelectorAll(".remove-saved").forEach(button => {
        button.addEventListener("click", async function () {
            const card = this.closest(".saved-full-card");

            if (!card) return;

            const saveUrl = card.dataset.saveUrl;

            if (!saveUrl) {
                console.error("Save URL is missing from this opportunity card.");
                alert("Unable to remove this opportunity. Please refresh the page.");
                return;
            }

            if (this.disabled) return;

            this.disabled = true;

            try {
                const response = await fetch(saveUrl, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });

                if (response.status === 403) {
                    throw new Error("Your session may have expired. Refresh the page and log in again.");
                }

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to remove this opportunity.");
                }

                if (data.saved) {
                    throw new Error("The opportunity is still saved. Please try again.");
                }

                // Remove the card from the page
                card.remove();

                // Update the total count
                updateSavedCount();

            } catch (error) {
                console.error("Remove saved opportunity error:", error);
                alert(error.message || "Something went wrong. Please try again.");
            } finally {
                this.disabled = false;
            }
        });
    });

    function updateSavedCount() {
        const remainingCards = document.querySelectorAll(
            "#savedList .saved-full-card"
        );

        const count = remainingCards.length;

        if (savedTotal) {
            savedTotal.textContent =
                `${count} saved opportunit${count === 1 ? "y" : "ies"}`;
        }

        if (savedSummaryText) {
            savedSummaryText.textContent =
                `You're keeping track of ${count} opportunit${count === 1 ? "y" : "ies"}.`;
        }

        // Update the All filter count
        const allFilter = document.querySelector(
            '.saved-filter[data-filter="all"]'
        );

        if (allFilter) {
            const countElement = allFilter.querySelector("span");

            if (countElement) {
                countElement.textContent = count;
            }
        }

        // Show the empty state when no cards remain
        if (count === 0 && savedEmpty) {
            savedEmpty.style.display = "block";
        }
    }

    function getCookie(name) {
        const cookies = document.cookie
            ? document.cookie.split(";")
            : [];

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(name + "=")) {
                return decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
            }
        }

        return null;
    }


        // ========================================
    // FILTER SAVED OPPORTUNITIES BY CATEGORY
    // ========================================

    const filterButtons = document.querySelectorAll(".saved-filter");
    const savedCards = document.querySelectorAll(".saved-full-card");
    const savedSort = document.getElementById("savedSort");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Update active filter button
            filterButtons.forEach(filter => {
                filter.classList.remove("active");
            });

            this.classList.add("active");

            const selectedFilter = this.dataset.filter.toLowerCase();

            savedCards.forEach(card => {
                const category = (
                    card.dataset.category || ""
                ).toLowerCase();

                const matchesFilter =
                    selectedFilter === "all" ||
                    category === selectedFilter;

                card.style.display = matchesFilter ? "" : "none";
            });

            updateEmptyState();
        });
    });


    // ========================================
    // SORT SAVED OPPORTUNITIES
    // ========================================

    if (savedSort && savedList) {
        savedSort.addEventListener("change", function () {
            const cards = Array.from(
                savedList.querySelectorAll(".saved-full-card")
            );

            const sortBy = this.value;

            cards.sort((a, b) => {
                if (sortBy === "title") {
                    return (a.dataset.title || "").localeCompare(
                        b.dataset.title || ""
                    );
                }

                if (sortBy === "deadline") {
                    return (a.dataset.deadline || "9999-12-31").localeCompare(
                        b.dataset.deadline || "9999-12-31"
                    );
                }

                // Default: recently saved first
                return Number(b.dataset.saved || 0) -
                       Number(a.dataset.saved || 0);
            });

            cards.forEach(card => savedList.appendChild(card));
        });
    }


    // ========================================
    // EMPTY STATE
    // ========================================

    function updateEmptyState() {
        if (!savedEmpty) return;

        const visibleCards = Array.from(
            document.querySelectorAll("#savedList .saved-full-card")
        ).filter(card => card.style.display !== "none");

        savedEmpty.style.display =
            visibleCards.length === 0 ? "block" : "none";
    }


    // ========================================
    // CLEAR FILTERS
    // ========================================

    const clearFiltersButton = document.getElementById("clearSavedFilters");

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", function () {
            const allFilter = document.querySelector(
                '.saved-filter[data-filter="all"]'
            );

            if (allFilter) {
                allFilter.click();
            }
        });
    }
});