// Scroll reveal: elements fade in as they enter the screen
document.documentElement.classList.add("js");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--i", el.classList.contains("entry") ? 1 : (el.dataset.i || 0));
    revealObserver.observe(el);
});

// Typing effect in the hero
const words = ["a Data Scientist", "a Lab Assistant", "a Content Writer", "a Film Lover", "an Optimist"];
const el = document.getElementById("typing");
let w = 0, c = 0, deleting = false;

function type() {
    const word = words[w];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 50 : 110;
    if (!deleting && c === word.length) { deleting = true; delay = 1500; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
    setTimeout(type, delay);
}
type();

// Highlight the nav link of the section in view
const links = document.querySelectorAll("nav a");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));

// Contact form: open the visitor's email app with the message filled in
document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const subject = encodeURIComponent("Portfolio message from " + f.get("name"));
    const body = encodeURIComponent(f.get("message") + "\n\n" + f.get("name") + " (" + f.get("email") + ")");
    window.location.href = "mailto:adamkevin514@gmail.com?subject=" + subject + "&body=" + body;
});

// Photo: try common file names so a renamed picture still loads
const photo = document.getElementById("photo");
const names = ["adam.jpg", "adam.jpeg", "adam.png", "adam.jprg"];
let n = 0;
function nextPhoto() { if (++n < names.length) photo.src = names[n]; }
photo.addEventListener("error", nextPhoto);
if (photo.complete && photo.naturalWidth === 0) nextPhoto();

// Scroll progress bar + header blur
const bar = document.getElementById("progress");
const header = document.querySelector("header");
function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    header.classList.toggle("scrolled", scrollY > 30);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Spotlight follows the cursor on cards
document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
    });
});

// Count-up numbers
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const b = entry.target.querySelector("b");
        const target = +b.dataset.count;
        const start = performance.now();
        (function step(t) {
            const p = Math.min((t - start) / 1200, 1);
            b.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        })(start);
        countObserver.unobserve(entry.target);
    });
}, { threshold: 0.6 });
document.querySelectorAll(".stat").forEach((s) => countObserver.observe(s));

// Burger menu (mobile)
const burger = document.getElementById("burger");
function setMenu(open) {
    header.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!header.classList.contains("open")));
document.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 995) setMenu(false); });
