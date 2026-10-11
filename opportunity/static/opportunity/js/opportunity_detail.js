document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // SAVE OPPORTUNITY
    // ==============================

    const saveButton = document.querySelector(".detail-save-btn");

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const icon = saveButton.querySelector("i");
            const text = saveButton.querySelector("span");

            saveButton.classList.toggle("saved");

            if (saveButton.classList.contains("saved")) {
                icon.classList.remove("bi-bookmark");
                icon.classList.add("bi-bookmark-fill");
                text.textContent = "Saved";
            } else {
                icon.classList.remove("bi-bookmark-fill");
                icon.classList.add("bi-bookmark");
                text.textContent = "Save";
            }
        });
    }


    // ==============================
    // SHARE OPPORTUNITY
    // ==============================

    const shareButtons = document.querySelectorAll(".share-buttons button");

    shareButtons.forEach(function (button, index) {

        button.addEventListener("click", function () {

            const currentUrl = window.location.href;
            const pageTitle = document.title;

            // Facebook
            if (index === 0) {
                const facebookUrl =
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

                window.open(
                    facebookUrl,
                    "_blank",
                    "width=600,height=500"
                );
            }

            // LinkedIn
            if (index === 1) {
                const linkedInUrl =
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

                window.open(
                    linkedInUrl,
                    "_blank",
                    "width=600,height=500"
                );
            }

            // WhatsApp
            if (index === 2) {
                const whatsappUrl =
                    `https://wa.me/?text=${encodeURIComponent(
                        pageTitle + " - " + currentUrl
                    )}`;

                window.open(
                    whatsappUrl,
                    "_blank"
                );
            }

            // Copy link
            if (index === 3) {

                navigator.clipboard.writeText(currentUrl)
                    .then(function () {

                        const icon = button.querySelector("i");

                        icon.classList.remove("bi-link-45deg");
                        icon.classList.add("bi-check-lg");

                        setTimeout(function () {
                            icon.classList.remove("bi-check-lg");
                            icon.classList.add("bi-link-45deg");
                        }, 2000);

                    })
                    .catch(function () {
                        alert("Unable to copy the link.");
                    });
            }

        });

    });


    // ==============================
    // APPLY BUTTON LOADING STATE
    // ==============================

    const applyButtons = document.querySelectorAll(
        ".detail-actions .btn, .detail-apply-box .btn"
    );

    applyButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            // Don't activate loading for placeholder links
            if (button.getAttribute("href") === "#") {
                event.preventDefault();

                const originalHTML = button.innerHTML;

                button.innerHTML =
                    '<span class="spinner-border spinner-border-sm me-2"></span>Opening...';

                button.disabled = true;

                setTimeout(function () {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 1200);
            }

        });

    });


    // ==============================
    // CONSOLE MESSAGE
    // ==============================

    console.log("Opportunity Kenya — Opportunity details loaded successfully.");

});