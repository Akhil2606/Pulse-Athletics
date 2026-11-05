document.addEventListener("DOMContentLoaded", () => {
  // PRELOADER
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("loading-counter");
  const status = document.getElementById("loading-status");
  const progressBar = document.querySelector(".loader-progress");
  const progressFill = document.getElementById("loading-progress");

  const loadingPhrases = [
    "IGNITING SYSTEMS...",
    "LOADING ATHLETES...",
    "PREPARING ARENA...",
    "BUILDING STRENGTH...",
    "GET READY...",
  ];

  if (preloader) {
    let progress = 0;

    const interval = setInterval(() => {
      progress = Math.min(progress + Math.floor(Math.random() * 12) + 6, 100);

      if (counter) counter.textContent = `${progress}%`;
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressBar)
        progressBar.setAttribute("aria-valuenow", String(progress));

      if (status && progress < 100) {
        const index = Math.floor((progress / 100) * loadingPhrases.length);
        status.textContent =
          loadingPhrases[Math.min(index, loadingPhrases.length - 1)];
      }

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => preloader.classList.add("fade-out"), 500);
      }
    }, 100);
  }

  // HEADER SCROLL EFFECT
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
  });

  // MOBILE NAVIGATION
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    const toggleNavigation = () => {
      const isOpen = navLinks.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    };

    hamburger.setAttribute("role", "button");
    hamburger.setAttribute("tabindex", "0");
    hamburger.setAttribute("aria-label", "Toggle navigation");
    hamburger.setAttribute("aria-expanded", "false");

    hamburger.addEventListener("click", toggleNavigation);

    hamburger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleNavigation();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // FOOTER YEAR
  const footerYear = document.getElementById("footer-year");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // NAVIGATION SEARCH
  const searchForms = document.querySelectorAll(".nav-search");

  searchForms.forEach((form) => {
    const searchInput = form.querySelector('input[type="search"]');
    const searchStatus = form.querySelector(".nav-search-status");

    if (!searchInput) return;

    const clearMatches = () => {
      document.querySelectorAll(".search-match").forEach((item) => {
        item.classList.remove("search-match");
      });

      if (searchStatus) searchStatus.textContent = "";
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const term = searchInput.value.trim().toLocaleLowerCase();

      clearMatches();

      if (!term) {
        if (searchStatus) searchStatus.textContent = "Enter a search term.";
        return;
      }

      const matches = Array.from(
        document.querySelectorAll(
          "h1, h2, h3, h4, p, .card, .program-card, .sport-card, .trainer-card",
        ),
      ).filter((item) => item.textContent.toLocaleLowerCase().includes(term));

      matches.forEach((item) => item.classList.add("search-match"));

      if (searchStatus) {
        searchStatus.textContent = matches.length
          ? `${matches.length} matching sections found.`
          : "No matches found on this page.";
      }

      if (matches[0]) {
        matches[0].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    searchInput.addEventListener("input", () => {
      if (!searchInput.value.trim()) clearMatches();
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        searchInput.value = "";
        clearMatches();
      }
    });
  });

  // PUBLIC MEMBERSHIP FAQ ACCORDION
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      if (!item) return;

      const isActive = item.classList.toggle("active");
      question.setAttribute("aria-expanded", String(isActive));
    });
  });

  // AUTHENTICATION STORAGE
  const accountKey = "pulse-athletics-accounts";
  const sessionKey = "pulse-athletics-session";
  const profileKey = "pulse-athletics-profile";

  function getAccounts() {
    try {
      const accounts = JSON.parse(localStorage.getItem(accountKey) || "[]");
      return Array.isArray(accounts) ? accounts : [];
    } catch (error) {
      console.error("Unable to read registered accounts.", error);
      return [];
    }
  }

  function showAuthMessage(form, message, success = false) {
    let notice = form.querySelector(".auth-message");

    if (!notice) {
      notice = document.createElement("p");
      notice.className = "auth-message";
      notice.style.marginTop = "1rem";
      notice.style.textAlign = "center";
      notice.style.fontSize = "0.9rem";
      form.appendChild(notice);
    }

    notice.textContent = message;
    notice.style.color = success ? "#aaff00" : "#ff6b6b";
  }

  // SIGNUP
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputs = signupForm.querySelectorAll("input");

      const firstName = inputs[0]?.value.trim() || "";
      const lastName = inputs[1]?.value.trim() || "";
      const email = inputs[2]?.value.trim().toLowerCase() || "";
      const password = inputs[3]?.value || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Member";

      if (!email.includes("@")) {
        showAuthMessage(
          signupForm,
          "Please enter an email address containing @.",
        );
        return;
      }

      const selectedPlan =
        new URLSearchParams(window.location.search).get("plan") || "Pro";

      const newAccount = {
        name: fullName,
        email,
        password,
        plan: selectedPlan,
      };

      const accounts = getAccounts();
      accounts.push(newAccount);

      try {
        localStorage.setItem(accountKey, JSON.stringify(accounts));
        localStorage.removeItem(sessionKey);

        showAuthMessage(
          signupForm,
          "Registration successful! Redirecting to login...",
          true,
        );

        setTimeout(() => {
          window.location.href = "login.html?registered=true";
        }, 1000);
      } catch (error) {
        console.error("Account registration failed.", error);
        showAuthMessage(
          signupForm,
          "Unable to complete registration. Please try again.",
        );
      }
    });
  }

  // LOGIN
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    const params = new URLSearchParams(window.location.search);

    if (params.get("registered") === "true") {
      showAuthMessage(
        loginForm,
        "Registration successful! Please log in.",
        true,
      );
    }

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = loginForm.querySelector('input[type="email"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');

      const email = emailInput?.value.trim().toLowerCase() || "";
      const password = passwordInput?.value || "";

      if (!email.includes("@")) {
        showAuthMessage(
          loginForm,
          "Please enter an email address containing @.",
        );
        return;
      }

      const accounts = getAccounts();

      const account = accounts.find(
        (item) => item.email.toLowerCase() === email,
      );

      const memberName = account?.name || email.split("@")[0] || "Member";
      const memberPlan = account?.plan || "Pro";

      const memberSession = {
        name: memberName,
        email,
        plan: memberPlan,
      };

      const memberProfile = {
        name: memberName,
        email,
        weight: 72,
        height: 175,
        goal: "Build strength",
        plan: memberPlan,
      };

      try {
        localStorage.setItem(sessionKey, JSON.stringify(memberSession));
        localStorage.setItem(profileKey, JSON.stringify(memberProfile));

        showAuthMessage(loginForm, "Login successful! Redirecting...", true);

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 700);
      } catch (error) {
        console.error("Login failed.", error);
        showAuthMessage(
          loginForm,
          "Unable to start your session. Please try again.",
        );
      }
    });
  }
});
