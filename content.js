// Script runs automatically when user visits LinkedIn or Indeed
console.log("Ghost Job Scanner is active!");

const applyWarning = (el, message, color) => {
    // Ensure that the same thing doesnt get tagged twice
    if (!el.innerText.includes("GHOST") && !el.innerText.includes("PIPELINE")) {
        el.style.backgroundColor = color;
        el.style.color = 'white';
        el.style.padding = '2px 5px';
        el.style.borderRadius = '4px';
        el.style.fontWeight = 'bold';
        el.innerText = message + ": " + el.innerText;
        console.log("Found a match:" , el.innerText);
    }
}

// --- JOB TRACKER STORAGE ---
const getJobID = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('currentJobId') // LinkedIn specific URL Parameter
};

const saveJobToHistory = (jobTitle, companyName) => {
    // Create a unique key for the job
    const key = `${jobTitle}-${companyName}`.toLowerCase().replace(/\s/g, '');

     // Check if the job is seen and then save it
    chrome.storage.local.get([key], (result) => {
        if (!result[key]) {
            const jobInfo = {
                title:jobTitle,
                company: companyName,
                firstSeen: new Date().toLocaleDateString(),
                repostCount: 0
            };

                chrome.storage.local.set({ [key]: jobInfo }, () => {
                console.log(`📝 Logged new job signature: ${key}`);
            });
         } else {
            // logic for incrementing repost cound could go here
        }
    });
}

const checkForReposts = (jobTitle, companyName) => {
    const currentID = getJobID();
     if (!currentID) return;

    // Pull history from the browser's local memory
    chrome.storage.local.get(['jobHistory'], (result) => {
        let history = result.jobHistory || {};

        const key = `${jobTitle}-${companyName}`.toLowerCase().replace(/\s/g, '');

        if (history[key]) {
            // We have seen this Title/Company before!
            if (history[key].id !== currentID) {
                console.log ("🚨 REPOST DETECTED: This is a new ID for an old job title.");
                // Trigger a 'repost warning on the UI'
            } else {
                // Fisrt time seeing this job, save it
                history[key] = {id: currentID, date: Date.now() };
                chrome.storage.local.set({ jobHistory: history });
            }
        }
    });
}

const scanForGhosts = () => {


    // Target elements 'li' and 'div' where LinkedIn hides job info
    const elements = document.querySelectorAll('span, li, div, strong, small, h1, h2');

    elements.forEach(el => {
        // Check if element has text and no children (to avoid highlighting the whole page)
        if (el.innerText && el.innerText.length < 100) {
            const content = el.innerText.toLowerCase(); // Convert to lowercase to get around case sensitivity

            // --- RED FLAGS ---
            const isOld = content.includes('30+ days') || 
                          content.includes('posted 30+') ||
                          content.includes('1 month') ||
                          content.includes('4 weeks ago');
            const isReposted = content.includes('reposted');

            // --- ORANGE FLAGS ---
            const isPromoted = content.includes('promoted');            
            const isPipeline = content.includes('actively recruiting') || 
                               content.includes('talent pool') ||
                               content.includes('ongoing recruitment');

            // Black list (Red Text)
            
            if (isOld || isReposted || isPromoted || isPipeline) {
                // 1. Capture the "Clean" text BEFORE we add the warning
                const cleanText = el.innerText; 
    
                // 2. Decide the warning level
                const isHighRisk = isOld || isReposted;
                const msg = isHighRisk ? "🚫 GHOST/REPOSTED" : "⚠️ PIPELINE/AD";
                const color = isHighRisk ? "red" : "orange";

                // 3. Save the CLEAN text to history
                saveJobToHistory(cleanText.substring(0, 30), "CompanySearch");

                // 4. Apply the visual warning to the screen
                applyWarning(el, msg, color);
            }
        }
    });
};

// Use a small delay (debounce) so the browser doesn't crash
let timeout = null;
// Observer watches the page and runs the scanner whenever something changes
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(scanForGhosts, 250); // Wait 200ms for content to settle
});

// Start watching the 'body' of the website
// Adding 'characterData: true' watches for text updates inside elements
observer.observe(document.body, {
    childList: true, 
    subtree: true,
    characterData: true 
});
// Run it once on load just incase
scanForGhosts();

// DEBUG BRIDGE: Listen for a custom message to show stored data
window.addEventListener("message", (event) => {
    if (event.data.type === "SHOW_GHOST_DATA") {
        chrome.storage.local.get(null, (items) => {
            console.log("📂 DATABASE DUMP:", items);
        });
    }
});
