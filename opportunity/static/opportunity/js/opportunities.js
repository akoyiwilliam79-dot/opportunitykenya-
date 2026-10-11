/* =========================================================
   OPPORTUNITY KENYA HUB
   Opportunities Page JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const filterForm =
        document.getElementById("opportunityFilterForm");

    const clearFilters =
        document.getElementById("clearFilters");

    const sortSelect =
        document.getElementById("sortSelect");

    const saveButtons =
        document.querySelectorAll(".save-btn");

    const opportunityItems =
        document.querySelectorAll(".opportunity-item");


    /* =====================================================
       FILTER FORM
       Django handles the actual filtering.
    ===================================================== */

    if (filterForm) {

        filterForm.addEventListener("submit", function () {

            const submitButton =
                filterForm.querySelector(
                    'button[type="submit"]'
                );

            if (!submitButton) {
                return;
            }

            submitButton.disabled = true;

            const originalText =
                submitButton.innerHTML;

            submitButton.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>' +
                "Applying...";

            /*
             * The browser will submit the form normally.
             * Django will process:
             *
             * q
             * category
             * location
             * deadline
             * type
             *
             * and return the filtered results.
             */

        });

    }


    /* =====================================================
       SORT
       Django handles the actual sorting.
    ===================================================== */

    if (sortSelect && filterForm) {

        sortSelect.addEventListener(
            "change",
            function () {

                /*
                 * The sort select belongs to the filter form
                 * through the HTML "form" attribute.
                 *
                 * Django receives:
                 *
                 * ?sort=latest
                 * ?sort=oldest
                 * ?sort=deadline
                 * ?sort=title
                 */

                filterForm.submit();

            }
        );

    }


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                /*
                 * Return to the clean opportunities page.
                 *
                 * This removes:
                 * - Search
                 * - Category
                 * - Location
                 * - Deadline
                 * - Type
                 * - Sort
                 * - Page
                 */

                window.location.href =
                    "/opportunities/";

            }
        );

    }


   /* =====================================================
   SAVE BUTTONS
   Connects to Django SavedOpportunity backend.
   ===================================================== */

      document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", async function (event) {
        event.preventDefault();
        event.stopPropagation();

        const opportunityId = this.dataset.opportunityId;

        if (!opportunityId) {
            console.error("Opportunity ID is missing.");
            return;
        }

        if (this.disabled) return;
        this.disabled = true;

        try {
            const response = await fetch(
                `/opportunities/${opportunityId}/save/`,
                {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
            );

            if (response.status === 403) {
                window.location.href = "/login/?next=/opportunities/";
                return;
            }

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not save opportunity.");
            }

            const icon = this.querySelector("i");

            if (data.saved) {
                this.classList.add("saved");
                icon.classList.replace("bi-bookmark", "bi-bookmark-fill");
                this.title = "Remove from saved opportunities";
            } else {
                this.classList.remove("saved");
                icon.classList.replace("bi-bookmark-fill", "bi-bookmark");
                this.title = "Save opportunity";
            }
        } catch (error) {
            console.error("Bookmark error:", error);
            alert("Unable to save this opportunity. Please try again.");
        } finally {
            this.disabled = false;
        }
    });
});

function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }

    return null;
}

    /* =====================================================
       OPPORTUNITY CARD ANIMATION
    ===================================================== */

    opportunityItems.forEach(function (item, index) {

        item.style.opacity = "0";
        item.style.transform = "translateY(10px)";

        setTimeout(function () {

            item.style.transition =
                "opacity 0.4s ease, transform 0.4s ease";

            item.style.opacity = "1";
            item.style.transform = "translateY(0)";

        }, index * 50);

    });




        /* =====================================================
        CSRF COOKIE
        ===================================================== */

        function getCookie(name) {

            let cookieValue = null;

            if (document.cookie && document.cookie !== "") {

                const cookies =
                    document.cookie.split(";");

                for (let cookie of cookies) {

                    cookie = cookie.trim();

                    if (
                        cookie.substring(
                            0,
                            name.length + 1
                        ) === name + "="
                    ) {

                        cookieValue =
                            decodeURIComponent(
                                cookie.substring(
                                    name.length + 1
                                )
                            );

                        break;
                    }
                }
            }

            return cookieValue;
        }


    /* =====================================================
       IMPORTANT
       
       Search, filtering, sorting and pagination are now
       handled by Django.

       DO NOT add client-side filtering here because it
       would conflict with the backend results.
    ===================================================== */


    console.log(
        "%cOpportunity Kenya Hub — Opportunities loaded 🚀",
        "font-size: 16px; font-weight: bold;"
    );

});