const DATA_options = {
    "use-emoji": {
        name: "USE EMOJI",
        type: "checkbox",
        value: false,
    },
};

const resetStyledElement = async () => {
    await chrome.storage.sync.set({ gitlabStylerResetElement: true });
};

const savingOption = () => {
    const toSaveOption = {};
    Object.entries(DATA_options).forEach((item) => {
        const [key] = item;
        const target = document.querySelector(`#option-${key}`);
        const value = target.checked;
        toSaveOption[key] = value;
    });
    chrome.storage.sync.set({ gitlabStylerOptions: toSaveOption });
};

const el_optionpanel = document.querySelector(".option-panel");
const el_savebutton = document.querySelector(".save-button");

const setupRenderElements = () => {
    const DOMstring = Object.entries(DATA_options)
        .map((item, idx) => {
            const [key, option] = item;
            return `
            <label class="label-${option.type}">
                <input type="${option.type}" id="option-${key}" ${
                option.value ? "checked" : ""
            }>
                <span>${option.name}</span>
            </label>
        `;
        })
        .join("");

    el_optionpanel.innerHTML = DOMstring;
};

const setupBindEvents = () => {
    el_savebutton &&
        el_savebutton.addEventListener("click", () => {
            resetStyledElement();
            savingOption();
        });
};

const setupSyncStorage = () => {
    return new Promise(async (resolve) => {
        const { gitlabStylerOptions } = await chrome.storage.sync.get(
            "gitlabStylerOptions"
        );

        if (!gitlabStylerOptions) {
            resolve();
            return;
        }

        Object.entries(gitlabStylerOptions).forEach(([k, v]) => {
            DATA_options[k].value = v;
        });

        resolve();
    });
};

const initPopup = async () => {
    if (!chrome.storage) {
        return;
    }
    await setupSyncStorage();
    setupRenderElements();
    setupBindEvents();
    savingOption();
};

initPopup();
