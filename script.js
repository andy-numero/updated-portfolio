(function () {
    const root = document.documentElement;
    const themeButton = document.getElementById("theme-toggle");
    const themeLabel = document.getElementById("theme-label");

    // Get the saved theme or use the visitor's device preference.
    function getPreferredTheme() {
        try {
            const savedTheme = localStorage.getItem("portfolio-theme");
            if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
        } catch (error) {
            // Continue with the device preference if storage is unavailable.
        }

        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    // Apply the selected theme.
    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);

        if (themeLabel) {
            themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
        }

        if (themeButton) {
            themeButton.setAttribute("aria-label", theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode");
            themeButton.setAttribute("aria-pressed", String(theme === "dark"));
        }
    }

    applyTheme(getPreferredTheme());

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            const currentTheme = root.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(newTheme);

            try {
                localStorage.setItem("portfolio-theme", newTheme);
            } catch (error) {
                // Theme still changes for this visit even if storage is unavailable.
            }
        });
    }

    // Replace unavailable brand images with a neat text fallback.
    document.querySelectorAll(".tool-icon img").forEach(function (img) {
        img.addEventListener("error", function () {
            if (img.dataset.fallbackShown === "true") return;
            img.dataset.fallbackShown = "true";

            const fallback = document.createElement("span");
            fallback.className = "tool-icon-fallback";
            fallback.setAttribute("aria-hidden", "true");
            fallback.textContent = (img.alt || "IT").split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase();
            img.replaceWith(fallback);
        }, { once: true });
    });

    // Mark the navigation item for the section currently in view.
    const navLinks = Array.from(document.querySelectorAll('.topbar nav a[href^="#"]'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
                    link.classList.toggle("active", isCurrent);
                    if (isCurrent) link.setAttribute("aria-current", "location");
                    else link.removeAttribute("aria-current");
                });
            });
        }, {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }
})();
