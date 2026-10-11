/* =========================================================
   OPPORTUNITY KENYA HUB
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", function () {

            if (window.scrollY > 30) {
                navbar.classList.add("navbar-scrolled");
            } else {
                navbar.classList.remove("navbar-scrolled");
            }

        });
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput = document.querySelector(".search-input input");
    const searchButton = document.querySelector(".search-btn");

    if (searchInput && searchButton) {

        function performSearch() {

            const query = searchInput.value.trim();

            if (query === "") {
                searchInput.focus();
                return;
            }

            console.log("Searching for:", query);

            /*
             * Backend search will be connected later.
             *
             * For now we simply show that the search
             * interaction is working.
             */

            alert(`Searching for "${query}"...`);
        }

        searchButton.addEventListener("click", performSearch);

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }

        });
    }


    /* =====================================================
       SAVE OPPORTUNITY
    ===================================================== */

    const saveButtons = document.querySelectorAll(".save-btn");

    saveButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const icon = button.querySelector("i");

            if (!icon) return;

            const isSaved = button.classList.toggle("saved");

            if (isSaved) {

                icon.classList.remove("bi-bookmark");
                icon.classList.add("bi-bookmark-fill");

                button.setAttribute(
                    "aria-label",
                    "Remove from saved opportunities"
                );

            } else {

                icon.classList.remove("bi-bookmark-fill");
                icon.classList.add("bi-bookmark");

                button.setAttribute(
                    "aria-label",
                    "Save opportunity"
                );

            }

        });

    });


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    const scrollLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    scrollLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".category-card, .opportunity-card, .section-heading"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.1
            }
        );

        revealElements.forEach(function (element) {

            element.classList.add("reveal");

            observer.observe(element);

        });

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElement = document.querySelector(
        "[data-current-year]"
    );

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       MOBILE NAVBAR
    ===================================================== */

    const navLinks = document.querySelectorAll(
        ".navbar-nav .nav-link"
    );

    const navbarCollapse = document.querySelector(
        ".navbar-collapse"
    );

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                window.innerWidth < 992 &&
                navbarCollapse &&
                navbarCollapse.classList.contains("show")
            ) {

                const collapseInstance =
                    bootstrap.Collapse.getInstance(
                        navbarCollapse
                    );

                if (collapseInstance) {
                    collapseInstance.hide();
                }

            }

        });

    });


    /* =====================================================
       BUTTON LOADING STATE
    ===================================================== */

    const actionButtons = document.querySelectorAll(
        "[data-loading-button]"
    );

    actionButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            if (button.dataset.loadingButton === "true") {

                const originalText =
                    button.innerHTML;

                button.dataset.originalText =
                    originalText;

                button.innerHTML = `
                    <span
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true">
                    </span>
                    Loading...
                `;

                button.disabled = true;

                setTimeout(function () {

                    button.innerHTML =
                        button.dataset.originalText;

                    button.disabled = false;

                }, 1500);

            }

        });

    });


    /* =====================================================
       CONSOLE MESSAGE
    ===================================================== */

    console.log(
        "%cOpportunity Kenya Hub",
        "font-size: 20px; font-weight: bold; color: #2563eb;"
    );

    console.log(
        "Frontend JavaScript loaded successfully 🚀"
    );

});