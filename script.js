const cards = Array.from(document.querySelectorAll(".card"));
const finaleCard = document.querySelector('[data-page="4"]');

const defaultConfig = {
    siteTitle: "For My Favorite Person",
    pages: [
        {
            label: "Page 1 of 3",
            question: "Will you go on a date with me?",
            description: "I can plan the snacks, playlist, and awkwardly perfect conversation.",
            yes: "Yes",
            no: "No",
        },
        {
            label: "Page 2 of 3",
            question: "Will you marry me?",
            description: "I am very serious about building a beautiful life with you.",
            yes: "Yes",
            no: "No",
        },
        {
            label: "Final page",
            question: "Will you love me forever?",
            description: "If yes, press the obvious choice. If no... the page may disagree.",
            yes: "Yes, forever",
            no: "No",
        },
    ],
    finale: {
        label: "Approved outcome",
        title: "You just made me the luckiest person alive.",
        description: "Every version of my future looks brighter, softer, and sweeter with you in it.",
        topName: "Person 1",
        bottomName: "Person 2",
        heart: "❤",
    },
    interactions: {
        finalNoAfterTwoAttempts: "Still no?",
        finalNoAfterFourAttempts: "Okay, maybe yes",
        finalYesAfterFourAttempts: "Yes, absolutely forever",
        finalYesWhenNoClicked: "You meant yes",
    },
};

let config = defaultConfig;

function mergeStringSettings(defaults, overrides, sectionName) {
    if (overrides === undefined) {
        return defaults;
    }

    if (overrides === null || typeof overrides !== "object" || Array.isArray(overrides)) {
        throw new Error(`"${sectionName}" in config.json must be an object.`);
    }

    const merged = { ...defaults };
    for (const [key, value] of Object.entries(overrides)) {
        if (!Object.prototype.hasOwnProperty.call(defaults, key)) {
            throw new Error(`Unknown "${sectionName}" setting in config.json: "${key}".`);
        }
        if (typeof value !== "string") {
            throw new Error(`"${sectionName}.${key}" in config.json must be a string.`);
        }
        merged[key] = value;
    }

    return merged;
}

function mergeConfig(overrides) {
    if (overrides === null || typeof overrides !== "object" || Array.isArray(overrides)) {
        throw new Error("config.json must contain a JSON object.");
    }

    const allowedKeys = ["siteTitle", "pages", "finale", "interactions"];
    for (const key of Object.keys(overrides)) {
        if (!allowedKeys.includes(key)) {
            throw new Error(`Unknown config.json setting: "${key}".`);
        }
    }

    const merged = {
        ...defaultConfig,
        siteTitle: mergeStringSettings(
            { siteTitle: defaultConfig.siteTitle },
            overrides.siteTitle === undefined ? undefined : { siteTitle: overrides.siteTitle },
            "config",
        ).siteTitle,
        finale: mergeStringSettings(defaultConfig.finale, overrides.finale, "finale"),
        interactions: mergeStringSettings(defaultConfig.interactions, overrides.interactions, "interactions"),
    };

    if (overrides.pages !== undefined && !Array.isArray(overrides.pages)) {
        throw new Error('"pages" in config.json must be an array.');
    }

    if (overrides.pages && overrides.pages.length > defaultConfig.pages.length) {
        throw new Error(`"pages" in config.json can contain at most ${defaultConfig.pages.length} entries.`);
    }

    merged.pages = defaultConfig.pages.map((page, index) =>
        mergeStringSettings(page, overrides.pages?.[index], `pages[${index}]`),
    );

    return merged;
}

async function loadConfig() {
    const response = await fetch("config.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Could not load config.json (${response.status} ${response.statusText}).`);
    }

    return mergeConfig(await response.json());
}

function applyConfig(settings) {
    document.title = settings.siteTitle;
    document.querySelectorAll("[data-config]").forEach((element) => {
        const value = element.dataset.config.split(".").reduce((current, key) => current[key], settings);
        element.textContent = value;
    });

    document.querySelector(".name-promise")?.setAttribute(
        "aria-label",
        `${settings.finale.topName} loves ${settings.finale.bottomName}`,
    );
}

function showPage(pageNumber) {
    cards.forEach((card) => {
        card.classList.toggle("is-active", Number(card.dataset.page) === pageNumber);
    });

    if (finaleCard instanceof HTMLElement) {
        finaleCard.classList.toggle("is-celebrating", pageNumber === 4);
    }
}

loadConfig()
    .then((loadedConfig) => {
        config = loadedConfig;
        applyConfig(config);
    })
    .catch((error) => {
        console.error("Could not apply site configuration. The default page content will be used.", error);
    });

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
            const pageNumber = Number(button.closest("[data-page]")?.dataset.page);
            button.textContent = config.pages[pageNumber - 1]?.no ?? defaultConfig.pages[0].no;
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
            finalNoButton.textContent = config.interactions.finalNoAfterTwoAttempts;
        }

        if (noAttempts >= 4) {
            finalNoButton.textContent = config.interactions.finalNoAfterFourAttempts;
            finalYesButton.textContent = config.interactions.finalYesAfterFourAttempts;
        }
    });

    finalNoButton.addEventListener("click", () => {
        finalYesButton.textContent = config.interactions.finalYesWhenNoClicked;
        finalNoButton.classList.add("is-tiny");
    });
}