// Optional extras: header shadow, active nav link, scroll reveal.
// Menu toggle and form notice stay in your existing inline script.

document.documentElement.classList.add("js");

// Header shadow after scrolling
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Highlight the nav link for the section in view
const links = document.querySelectorAll(".navbar a");
const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                links.forEach((a) =>
                    a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
                );
            }
        });
    },
    { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

// Reveal cards as they scroll into view
const revealTargets = document.querySelectorAll(
    ".service-card, .deposit-card, .loan-item, .contact-box, .contact-form, .feature, .section-heading"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    revealObserver.observe(el);
});
