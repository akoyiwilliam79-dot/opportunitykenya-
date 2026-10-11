document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SECTION TABS
    ===================================================== */

    const tabs = document.querySelectorAll(".applications-tab");
    const sections = document.querySelectorAll(".applications-section");

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const target = this.dataset.section;

            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            sections.forEach(function (section) {
                section.classList.remove("active");
            });

            this.classList.add("active");

            const targetSection = document.getElementById(
                `${target}-section`
            );

            if (targetSection) {
                targetSection.classList.add("active");
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

    });


    /* =====================================================
       APPLICATION SEARCH + FILTER
    ===================================================== */

    const searchInput = document.getElementById("applicationSearch");
    const statusFilter = document.getElementById("applicationStatusFilter");
    const applicationCards =
        document.querySelectorAll(".application-card");
    const emptyState =
        document.getElementById("applicationsEmpty");
    const clearFilters =
        document.getElementById("clearApplicationFilters");


    function filterApplications() {

        const searchTerm =
            searchInput.value.toLowerCase().trim();

        const selectedStatus =
            statusFilter.value;

        let visibleCount = 0;


        applicationCards.forEach(function (card) {

            const name =
                card.dataset.name.toLowerCase();

            const status =
                card.dataset.status;

            const matchesSearch =
                name.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


            if (matchesSearch && matchesStatus) {

                card.style.display = "";

                setTimeout(function () {
                    card.classList.remove("application-hidden");
                }, 10);

                visibleCount++;

            } else {

                card.classList.add("application-hidden");

                setTimeout(function () {
                    card.style.display = "none";
                }, 200);
            }

        });


        if (emptyState) {
            emptyState.classList.toggle(
                "show",
                visibleCount === 0
            );
        }
    }


    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterApplications
        );
    }


    if (statusFilter) {
        statusFilter.addEventListener(
            "change",
            filterApplications
        );
    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            function () {

                searchInput.value = "";
                statusFilter.value = "all";

                filterApplications();
            }
        );
    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const notificationItems =
        document.querySelectorAll(".hub-notification");

    const notificationCount =
        document.querySelector(".notification-count");

    const markAllRead =
        document.getElementById("markAllRead");


    function updateNotificationCount() {

        const unread =
            document.querySelectorAll(
                ".hub-notification.unread"
            ).length;

        if (notificationCount) {

            notificationCount.textContent = unread;

            notificationCount.style.display =
                unread === 0 ? "none" : "inline-flex";
        }
    }


    notificationItems.forEach(function (notification) {

        const button =
            notification.querySelector(".notification-read");

        if (!button) return;


        button.addEventListener(
            "click",
            function () {

                notification.classList.toggle("unread");

                const icon =
                    button.querySelector("i");

                if (notification.classList.contains("unread")) {

                    icon.classList.remove("bi-circle");
                    icon.classList.add("bi-circle-fill");

                    button.title = "Mark as read";

                } else {

                    icon.classList.remove("bi-circle-fill");
                    icon.classList.add("bi-circle");

                    button.title = "Mark as unread";
                }

                updateNotificationCount();
            }
        );

    });


    if (markAllRead) {

        markAllRead.addEventListener(
            "click",
            function () {

                notificationItems.forEach(
                    function (notification) {

                        notification.classList.remove(
                            "unread"
                        );

                        const icon =
                            notification.querySelector(
                                ".notification-read i"
                            );

                        if (icon) {

                            icon.classList.remove(
                                "bi-circle-fill"
                            );

                            icon.classList.add(
                                "bi-circle"
                            );
                        }

                    }
                );

                updateNotificationCount();

                this.innerHTML =
                    '<i class="bi bi-check2-all me-1"></i> All caught up';

            }
        );
    }


    updateNotificationCount();


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        const question =
            item.querySelector(".faq-question");

        question.addEventListener(
            "click",
            function () {

                const isOpen =
                    item.classList.contains("open");


                faqItems.forEach(function (otherItem) {

                    otherItem.classList.remove("open");

                    const otherIcon =
                        otherItem.querySelector(
                            ".faq-question i"
                        );

                    if (otherIcon) {
                        otherIcon.className =
                            "bi bi-plus-lg";
                    }

                });


                if (!isOpen) {

                    item.classList.add("open");

                    const icon =
                        question.querySelector("i");

                    if (icon) {
                        icon.className =
                            "bi bi-dash-lg";
                    }
                }

            }
        );

    });


    /* =====================================================
       FAQ SEARCH
    ===================================================== */

    const faqSearch =
        document.getElementById("faqSearch");

    if (faqSearch) {

        faqSearch.addEventListener(
            "input",
            function () {

                const term =
                    this.value.toLowerCase().trim();

                faqItems.forEach(function (item) {

                    const text =
                        item.textContent.toLowerCase();

                    item.style.display =
                        text.includes(term)
                            ? ""
                            : "none";
                });

            }
        );
    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById(
            "supportContactForm"
        );

    const contactSuccess =
        document.getElementById(
            "contactSuccess"
        );

    const sendAnother =
        document.getElementById(
            "sendAnotherMessage"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const submitButton =
                    contactForm.querySelector(
                        ".contact-submit"
                    );

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.innerHTML =
                        '<span class="spinner-border spinner-border-sm me-2"></span> Sending...';
                }


                setTimeout(function () {

                    contactForm.style.display =
                        "none";

                    contactSuccess.classList.add(
                        "show"
                    );

                }, 900);

            }
        );
    }


    if (sendAnother) {

        sendAnother.addEventListener(
            "click",
            function () {

                contactSuccess.classList.remove(
                    "show"
                );

                contactForm.reset();

                contactForm.style.display =
                    "block";

                const submitButton =
                    contactForm.querySelector(
                        ".contact-submit"
                    );

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        '<i class="bi bi-send me-1"></i> Send Message';
                }

            }
        );
    }

});