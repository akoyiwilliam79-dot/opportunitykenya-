document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SAVE / UNSAVE OPPORTUNITIES
    ========================================= */

    const saveButtons = document.querySelectorAll(".save-opportunity");

    saveButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const icon = button.querySelector("i");

            const isSaved = button.classList.contains("saved");

            if (isSaved) {

                button.classList.remove("saved");

                if (icon) {
                    icon.classList.remove("bi-bookmark-fill");
                    icon.classList.add("bi-bookmark");
                }

                button.setAttribute(
                    "aria-label",
                    "Save opportunity"
                );

            } else {

                button.classList.add("saved");

                if (icon) {
                    icon.classList.remove("bi-bookmark");
                    icon.classList.add("bi-bookmark-fill");
                }

                button.setAttribute(
                    "aria-label",
                    "Remove saved opportunity"
                );

            }

        });

    });


    /* =========================================
       DASHBOARD CARD ENTRANCE ANIMATION
    ========================================= */

    const dashboardCards =
        document.querySelectorAll(
            ".dashboard-card, .stat-card, .opportunity-card"
        );

    dashboardCards.forEach(function (card, index) {

        card.style.opacity = "0";
        card.style.transform = "translateY(15px)";

        setTimeout(function () {

            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 100 + (index * 80));

    });


    /* =========================================
       PROFILE BUTTON
    ========================================= */

    const profileButtons =
        document.querySelectorAll(
            '[data-action="profile"]'
        );

    profileButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "/profile/";

        });

    });


    /* =========================================
       QUICK ACTIONS
    ========================================= */

    const opportunityButtons =
        document.querySelectorAll(
            '[data-action="opportunities"]'
        );

    opportunityButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "/opportunities/";

        });

    });


    const savedButtons =
        document.querySelectorAll(
            '[data-action="saved"]'
        );

    savedButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "/saved/";

        });

    });


    const applicationsButtons =
        document.querySelectorAll(
            '[data-action="applications"]'
        );

    applicationsButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "/my-applications/";

        });

    });


    /* =========================================
       DASHBOARD SEARCH
    ========================================= */

    const dashboardSearch =
        document.getElementById("dashboardSearch");

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keypress",
            function (event) {

                if (event.key === "Enter") {

                    const query =
                        dashboardSearch.value.trim();

                    if (query) {

                        window.location.href =
                            "/opportunities/?search=" +
                            encodeURIComponent(query);

                    } else {

                        window.location.href =
                            "/opportunities/";

                    }

                }

            }
        );

    }


    /* =========================================
       MARK NOTIFICATION AS READ
    ========================================= */

    const notificationItems =
        document.querySelectorAll(
            ".notification-item"
        );

    notificationItems.forEach(function (notification) {

        notification.addEventListener(
            "click",
            function () {

                notification.classList.remove("unread");

                const badge =
                    notification.querySelector(
                        ".notification-dot"
                    );

                if (badge) {
                    badge.style.display = "none";
                }

            }
        );

    });


    /* =========================================
       NOTIFICATION COUNT
    ========================================= */

    const notificationBadge =
        document.querySelector(
            ".notification-count"
        );

    const unreadNotifications =
        document.querySelectorAll(
            ".notification-item.unread"
        );

    if (
        notificationBadge &&
        unreadNotifications.length >= 0
    ) {

        notificationBadge.textContent =
            unreadNotifications.length;

        if (unreadNotifications.length === 0) {
            notificationBadge.style.display = "none";
        }

    }


    /* =========================================
       CURRENT YEAR
    ========================================= */

    const yearElement =
        document.getElementById("currentYear");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    const mobileMenuButton =
        document.querySelector(".navbar-toggler");

    const navbarCollapse =
        document.querySelector(".navbar-collapse");

    if (
        mobileMenuButton &&
        navbarCollapse
    ) {

        const mobileLinks =
            navbarCollapse.querySelectorAll("a");

        mobileLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        navbarCollapse.classList.contains(
                            "show"
                        )
                    ) {

                        mobileMenuButton.click();

                    }

                }
            );

        });

    }


    /* =========================================
       LOGOUT CONFIRMATION
    ========================================= */

    const logoutLinks =
        document.querySelectorAll(
            'a[href*="/logout/"]'
        );

    logoutLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const confirmed =
                    confirm(
                        "Are you sure you want to log out?"
                    );

                if (!confirmed) {
                    event.preventDefault();
                }

            }
        );

    });


    /* =========================================
       DASHBOARD READY
    ========================================= */

    console.log(
        "Opportunity Kenya dashboard loaded successfully."
    );

});