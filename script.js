const cards = Array.from(document.querySelectorAll(".card"));
const finaleCard = document.querySelector('[data-page="4"]');

const defaultRomanceConfig = {
    topName: "Person 1",
    bottomName: "Person 2",
    heart: "❤",
    loveLabel: "Person 1 loves Person 2",
};

async function loadRomanceConfig() {
    try {
        const response = await fetch("config.json", { cache: "no-store" });
        if (!response.ok) {
            return defaultRomanceConfig;
        }

        const config = await response.json();
        return { ...defaultRomanceConfig, ...config };
    } catch {
        return defaultRomanceConfig;
    }
}

function applyRomanceConfig(config) {
    const topName = document.querySelector('[data-name-slot="top"]');
    const bottomName = document.querySelector('[data-name-slot="bottom"]');
    const heart = document.querySelector('[data-name-slot="heart"]');
    const promise = document.querySelector(".name-promise");

    if (topName) {
        topName.textContent = config.topName;
    }

    if (bottomName) {
        bottomName.textContent = config.bottomName;
    }

    if (heart) {
        heart.textContent = config.heart;
    }

    if (promise) {
        promise.setAttribute("aria-label", config.loveLabel);
    }
}

function showPage(pageNumber) {
    cards.forEach((card) => {
        card.classList.toggle("is-active", Number(card.dataset.page) === pageNumber);
    });

    if (finaleCard instanceof HTMLElement) {
        finaleCard.classList.toggle("is-celebrating", pageNumber === 4);
    }
}

loadRomanceConfig().then(applyRomanceConfig);

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function moveRunawayButton(button) {
    const area = button.parentElement;
    if (!area) {
        return;
    }

    const buttonRect = button.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();
    const maxLeft = Math.max(0, areaRect.width - buttonRect.width);
    const maxTop = Math.max(0, areaRect.height - buttonRect.height);
    const left = randomBetween(0, maxLeft);
    const top = randomBetween(0, maxTop);

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
}

document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
        return;
    }

    const nextPage = Number(target.dataset.next);
    if (nextPage) {
        showPage(nextPage);
        return;
    }

    if (target.dataset.finish === "true") {
        showPage(4);
        return;
    }

    if (target.dataset.reset === "true") {
        document.querySelectorAll(".answer-no").forEach((button) => {
            button.classList.remove("is-hidden", "is-tiny");
            button.removeAttribute("style");
            button.textContent = "No";
        });
        showPage(1);
    }
});

const firstNoButton = document.querySelector('[data-page="1"] .answer-no');
const firstButtonRow = document.querySelector('[data-page="1"] .button-row');
if (firstNoButton instanceof HTMLButtonElement && firstButtonRow instanceof HTMLDivElement) {
    firstNoButton.addEventListener("mouseenter", () => {
        firstNoButton.classList.add("is-hidden");
    });

    firstButtonRow.addEventListener("mouseleave", () => {
        firstNoButton.classList.remove("is-hidden");
    });
}

const runawayButton = document.querySelector('[data-page="2"] .is-runaway');
if (runawayButton instanceof HTMLButtonElement) {
    const escape = () => moveRunawayButton(runawayButton);
    runawayButton.addEventListener("mouseenter", escape);
    runawayButton.addEventListener("focus", escape);
    window.addEventListener("resize", () => runawayButton.removeAttribute("style"));
}

const finalNoButton = document.querySelector('[data-page="3"] .is-shy');
const finalYesButton = document.querySelector('[data-page="3"] .is-grand');
if (finalNoButton instanceof HTMLButtonElement && finalYesButton instanceof HTMLButtonElement) {
    let noAttempts = 0;

    finalNoButton.addEventListener("mouseenter", () => {
        noAttempts += 1;
        finalNoButton.classList.add("is-tiny");

        if (noAttempts >= 2) {
            finalNoButton.textContent = "Still no?";
        }

        if (noAttempts >= 4) {
            finalNoButton.textContent = "Okay, maybe yes";
            finalYesButton.textContent = "Yes, absolutely forever";
        }
    });

    finalNoButton.addEventListener("click", () => {
        finalYesButton.textContent = "You meant yes";
        finalNoButton.classList.add("is-tiny");
    });
}