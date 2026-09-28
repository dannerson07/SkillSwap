/* =========================================
   API CONFIGURATION
========================================= */

const API_BASE_URL = "/api";


/* =========================================
   GLOBAL STATE
========================================= */

let currentMemberId = null;


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupForms();
    setupSectionLinks();

    loadDashboard();
    loadMembers();
    loadSkills();
    loadSessions();
});


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const sectionName = item.dataset.section;

            showSection(sectionName);
        });
    });
}


function showSection(sectionName) {

    // Hide all sections
    document.querySelectorAll(".content-section")
        .forEach(section => {
            section.classList.remove("active");
        });

    // Remove active state from navigation
    document.querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    // Show selected section
    const selectedSection =
        document.getElementById(`${sectionName}-section`);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Activate matching navigation button
    const selectedNav =
        document.querySelector(
            `.nav-item[data-section="${sectionName}"]`
        );

    if (selectedNav) {
        selectedNav.classList.add("active");
    }

    // Load fresh data when opening sections
    if (sectionName === "members") {
        loadMembers();
    }

    if (sectionName === "skills") {
        loadSkills();
    }

    if (sectionName === "sessions") {
        loadSessions();
    }
}


/* =========================================
   SECTION LINKS
========================================= */

function setupSectionLinks() {

    const links =
        document.querySelectorAll("[data-section-link]");

    links.forEach(link => {

        link.addEventListener("click", () => {

            const sectionName =
                link.dataset.sectionLink;

            showSection(sectionName);
        });
    });
}


/* =========================================
   FORM SETUP
========================================= */

function setupForms() {

    const memberForm =
        document.getElementById("member-form");

    const skillForm =
        document.getElementById("skill-form");

    const sessionForm =
        document.getElementById("session-form");

    const ledgerButton =
        document.getElementById("load-ledger-button");


    if (memberForm) {
        memberForm.addEventListener(
            "submit",
            handleMemberSubmit
        );
    }

    if (skillForm) {
        skillForm.addEventListener(
            "submit",
            handleSkillSubmit
        );
    }

    if (sessionForm) {
        sessionForm.addEventListener(
            "submit",
            handleSessionSubmit
        );
    }

    if (ledgerButton) {
        ledgerButton.addEventListener(
            "click",
            handleLedgerLoad
        );
    }
}


/* =========================================
   DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        const skills = await fetchData(
            `${API_BASE_URL}/skill-offers`
        );

        const sessions = await fetchData(
            `${API_BASE_URL}/sessions`
        );

        updateDashboardCounts(
            skills,
            sessions
        );

        displayDashboardSkills(skills);

        if (currentMemberId) {
            await loadCurrentMemberCredits();
        }

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}


function updateDashboardCounts(
    skills,
    sessions
) {

    const skillCount =
        document.getElementById(
            "dashboard-skill-count"
        );

    const sessionCount =
        document.getElementById(
            "dashboard-session-count"
        );

    if (skillCount) {
        skillCount.textContent = skills.length;
    }

    if (sessionCount) {

        if (currentMemberId) {

            const mySessions =
                sessions.filter(session =>
                    session.requester?.id === currentMemberId
                    ||
                    session.skillOffer?.provider?.id === currentMemberId
                );

            sessionCount.textContent =
                mySessions.length;

        } else {

            sessionCount.textContent =
                sessions.length;
        }
    }
}


function displayDashboardSkills(skills) {

    const container =
        document.getElementById(
            "dashboard-skills"
        );

    if (!container) {
        return;
    }

    if (skills.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No skills available yet.</p>
            </div>
        `;

        return;
    }

    const limitedSkills =
        skills.slice(0, 4);

    container.innerHTML =
        limitedSkills
            .map(createSkillCard)
            .join("");
}


/* =========================================
   MEMBERS
========================================= */

async function loadMembers() {

    const container =
        document.getElementById(
            "members-list"
        );

    if (!container) {
        return;
    }

    try {

        const members = await fetchData(
            `${API_BASE_URL}/members`
        );

        displayMembers(members);

    } catch (error) {

        displayError(
            container,
            "Unable to load members."
        );
    }
}


function displayMembers(members) {

    const container =
        document.getElementById(
            "members-list"
        );

    if (members.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No members found.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        members
            .map(member => `
                <div class="member-card">

                    <h3>
                        ${escapeHtml(member.name)}
                    </h3>

                    <p class="member-email">
                        ${escapeHtml(member.email)}
                    </p>

                    <p class="member-credits">
                        ${formatNumber(member.creditBalance)}
                        time credits
                    </p>

                    <p>
                        Member ID:
                        ${member.id}
                    </p>

                </div>
            `)
            .join("");
}


/* =========================================
   CREATE MEMBER
========================================= */

async function handleMemberSubmit(event) {

    event.preventDefault();

    const name =
        document.getElementById(
            "member-name"
        ).value.trim();

    const email =
        document.getElementById(
            "member-email"
        ).value.trim();

    if (!name || !email) {
        showNotification(
            "Please fill in all fields.",
            "error"
        );

        return;
    }

    try {

        const member =
            await fetchData(
                `${API_BASE_URL}/members`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email
                    })
                }
            );

        showNotification(
            `Member ${member.name} created successfully!`,
            "success"
        );

        event.target.reset();

        loadMembers();

        loadDashboard();

    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================
   SKILLS
========================================= */

async function loadSkills() {

    const container =
        document.getElementById(
            "skills-list"
        );

    if (!container) {
        return;
    }

    try {

        const skills = await fetchData(
            `${API_BASE_URL}/skill-offers`
        );

        displaySkills(skills);

    } catch (error) {

        displayError(
            container,
            "Unable to load skills."
        );
    }
}


function displaySkills(skills) {

    const container =
        document.getElementById(
            "skills-list"
        );

    if (skills.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No skills available yet.</p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        skills
            .map(createSkillCard)
            .join("");
}


function createSkillCard(skill) {

    const providerName =
        skill.provider?.name || "Unknown member";

    const providerId =
        skill.provider?.id || "-";

    return `
        <div class="skill-card">

            <h3>
                ${escapeHtml(skill.skillName)}
            </h3>

            <p>
                ${escapeHtml(
                    skill.description ||
                    "No description provided."
                )}
            </p>

            <p class="skill-provider">
                Offered by:
                <strong>
                    ${escapeHtml(providerName)}
                </strong>
                (ID: ${providerId})
            </p>

            <p class="skill-hours">
                ${formatNumber(skill.availableHours)}
                hours available
            </p>

        </div>
    `;
}


/* =========================================
   CREATE SKILL
========================================= */

async function handleSkillSubmit(event) {

    event.preventDefault();

    const skillName =
        document.getElementById(
            "skill-name"
        ).value.trim();

    const description =
        document.getElementById(
            "skill-description"
        ).value.trim();

    const availableHours =
        Number(
            document.getElementById(
                "skill-hours"
            ).value
        );

    const providerId =
        Number(
            document.getElementById(
                "skill-provider"
            ).value
        );


    if (
        !skillName ||
        !availableHours ||
        !providerId
    ) {

        showNotification(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }


    try {

        await fetchData(
            `${API_BASE_URL}/skill-offers`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    skillName:
                        skillName,

                    description:
                        description,

                    availableHours:
                        availableHours,

                    providerId:
                        providerId
                })
            }
        );


        showNotification(
            "Skill offer created successfully!",
            "success"
        );


        event.target.reset();

        loadSkills();

        loadDashboard();


    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================
   SESSIONS
========================================= */

async function loadSessions() {

    const container =
        document.getElementById(
            "sessions-list"
        );

    if (!container) {
        return;
    }

    try {

        const sessions =
            await fetchData(
                `${API_BASE_URL}/sessions`
            );

        displaySessions(sessions);

    } catch (error) {

        displayError(
            container,
            "Unable to load sessions."
        );
    }
}


function displaySessions(sessions) {

    const container =
        document.getElementById(
            "sessions-list"
        );

    if (sessions.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No sessions found.</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        sessions
            .map(createSessionCard)
            .join("");
}


function createSessionCard(session) {

    const skillName =
        session.skillOffer?.skillName ||
        "Unknown skill";

    const requesterName =
        session.requester?.name ||
        "Unknown requester";

    const providerName =
        session.skillOffer?.provider?.name ||
        "Unknown provider";


    const statusClass =
        `status-${String(
            session.status
        ).toLowerCase()}`;


    let actions = "";


    /*
       Provider can confirm/reject
       a REQUESTED session.
    */

    if (
        session.status === "REQUESTED" &&
        session.skillOffer?.provider?.id
    ) {

        const providerId =
            session.skillOffer.provider.id;

        actions = `
            <div class="action-buttons">

                <button
                    class="confirm-button"
                    onclick="confirmSession(
                        ${session.id},
                        ${providerId}
                    )">

                    Confirm

                </button>

                <button
                    class="reject-button"
                    onclick="rejectSession(
                        ${session.id},
                        ${providerId}
                    )">

                    Reject

                </button>

            </div>
        `;
    }


    /*
       Confirmed sessions can be completed.
    */

    if (session.status === "CONFIRMED") {

        actions = `
            <div class="action-buttons">

                <button
                    class="complete-button"
                    onclick="completeSession(
                        ${session.id}
                    )">

                    Complete Session

                </button>

            </div>
        `;
    }


    return `
        <div class="session-card">

            <h3>
                ${escapeHtml(skillName)}
            </h3>

            <div class="session-info">

                <span>
                    Requester:
                    <strong>
                        ${escapeHtml(requesterName)}
                    </strong>
                </span>

                <span>
                    Provider:
                    <strong>
                        ${escapeHtml(providerName)}
                    </strong>
                </span>

                <span>
                    Requested:
                    ${formatNumber(
                        session.requestedHours
                    )}
                    hours
                </span>

                <span>
                    Actual:
                    ${formatNumber(
                        session.actualHours
                    )}
                    hours
                </span>

            </div>

            <span
                class="status-badge
                ${statusClass}">
                ${session.status}
            </span>

            ${actions}

        </div>
    `;
}


/* =========================================
   CREATE SESSION REQUEST
========================================= */

async function handleSessionSubmit(event) {

    event.preventDefault();


    const skillOfferId =
        Number(
            document.getElementById(
                "session-skill"
            ).value
        );


    const requesterId =
        Number(
            document.getElementById(
                "session-requester"
            ).value
        );


    const requestedHours =
        Number(
            document.getElementById(
                "session-hours"
            ).value
        );


    if (
        !skillOfferId ||
        !requesterId ||
        !requestedHours
    ) {

        showNotification(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }


    try {

        await fetchData(
            `${API_BASE_URL}/sessions`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    skillOfferId:
                        skillOfferId,

                    requesterId:
                        requesterId,

                    requestedHours:
                        requestedHours
                })
            }
        );


        showNotification(
            "Session request created!",
            "success"
        );


        event.target.reset();

        loadSessions();

        loadDashboard();


    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================
   CONFIRM SESSION
========================================= */

async function confirmSession(
    sessionId,
    providerId
) {

    try {

        await fetchData(
            `${API_BASE_URL}/sessions/${sessionId}/confirm/${providerId}`,
            {
                method: "PUT"
            }
        );


        showNotification(
            "Session confirmed!",
            "success"
        );


        loadSessions();


    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================
   REJECT SESSION
========================================= */

async function rejectSession(
    sessionId,
    providerId
) {

    try {

        await fetchData(
            `${API_BASE_URL}/sessions/${sessionId}/reject/${providerId}`,
            {
                method: "PUT"
            }
        );


        showNotification(
            "Session rejected.",
            "success"
        );


        loadSessions();


    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================
   COMPLETE SESSION
========================================= */

async function completeSession(
    sessionId
) {

    const actualHours =
        prompt(
            "Enter actual hours completed:"
        );


    if (actualHours === null) {
        return;
    }


    const hours =
        Number(actualHours);


    if (!hours || hours <= 0) {

        showNotification(
            "Please enter a valid number of hours.",
            "error"
        );

        return;
    }


    try {

        await fetchData(
            `${API_BASE_URL}/sessions/${sessionId}/complete`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    actualHours: hours
                })
            }
        );


        showNotification(
            "Session completed and credits transferred!",
            "success"
        );


        loadSessions();

        loadSkills();

        loadDashboard();


    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


/* =========================================
   LEDGER
========================================= */

async function handleLedgerLoad() {

    const memberId =
        Number(
            document.getElementById(
                "ledger-member"
            ).value
        );


    if (!memberId) {

        showNotification(
            "Please enter a member ID.",
            "error"
        );

        return;
    }


    currentMemberId = memberId;


    try {

        await loadLedger(memberId);

        await loadCurrentMemberCredits();

        await loadDashboard();


    } catch (error) {

        showNotification(
            error.message,
            "error"
        );
    }
}


async function loadLedger(memberId) {

    const container =
        document.getElementById(
            "ledger-list"
        );


    try {

        const ledger =
            await fetchData(
                `${API_BASE_URL}/ledger/member/${memberId}`
            );


        displayLedger(ledger);


    } catch (error) {

        displayError(
            container,
            "Unable to load ledger."
        );

        throw error;
    }
}


function displayLedger(entries) {

    const container =
        document.getElementById(
            "ledger-list"
        );


    if (entries.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>
                    No credit transactions found.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        entries
            .map(entry => {

                const isCredit =
                    entry.transactionType ===
                    "CREDIT";


                const cssClass =
                    isCredit
                        ? "ledger-credit"
                        : "ledger-debit";


                const symbol =
                    isCredit
                        ? "+"
                        : "-";


                return `
                    <div class="ledger-entry">

                        <div>

                            <strong>
                                ${entry.transactionType}
                            </strong>

                            <p>
                                Session #${entry.sessionRequest?.id || "-"}
                            </p>

                        </div>

                        <span class="${cssClass}">
                            ${symbol}
                            ${formatNumber(
                                entry.amount
                            )}
                            credits
                        </span>

                    </div>
                `;

            })
            .join("");
}


/* =========================================
   MEMBER CREDIT BALANCE
========================================= */

async function loadCurrentMemberCredits() {

    if (!currentMemberId) {
        return;
    }


    try {

        const balance =
            await fetchData(
                `${API_BASE_URL}/members/${currentMemberId}/credits`
            );


        updateCreditDisplays(balance);


    } catch (error) {

        console.error(
            "Unable to load credit balance:",
            error
        );
    }
}


function updateCreditDisplays(balance) {

    const headerBalance =
        document.getElementById(
            "header-credit-balance"
        );


    const dashboardBalance =
        document.getElementById(
            "dashboard-credit-balance"
        );


    const formatted =
        formatNumber(balance);


    if (headerBalance) {
        headerBalance.textContent =
            formatted;
    }


    if (dashboardBalance) {
        dashboardBalance.textContent =
            formatted;
    }
}


/* =========================================
   GENERIC API FUNCTION
========================================= */

async function fetchData(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            options
        );


    /*
       If the backend returns an error,
       try to read its JSON message.
    */

    if (!response.ok) {

        let errorMessage =
            "Something went wrong.";


        try {

            const errorData =
                await response.json();


            if (errorData.message) {

                errorMessage =
                    errorData.message;

            } else {

                const firstError =
                    Object.values(errorData)[0];

                if (firstError) {
                    errorMessage =
                        firstError;
                }
            }

        } catch (error) {

            errorMessage =
                `Request failed with status ${response.status}`;
        }


        throw new Error(
            errorMessage
        );
    }


    /*
       Some successful requests may return
       no content, such as DELETE.
    */

    if (response.status === 204) {
        return null;
    }


    return response.json();
}


/* =========================================
   NOTIFICATIONS
========================================= */

function showNotification(
    message,
    type = "success"
) {

    const notification =
        document.getElementById(
            "notification"
        );


    if (!notification) {
        return;
    }


    notification.textContent =
        message;


    notification.className =
        `notification show ${type}`;


    setTimeout(() => {

        notification.className =
            "notification";

    }, 3500);
}


/* =========================================
   ERROR DISPLAY
========================================= */

function displayError(
    container,
    message
) {

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="empty-state">
            <p>
                ${escapeHtml(message)}
            </p>
        </div>
    `;
}


/* =========================================
   FORMATTING HELPERS
========================================= */

function formatNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "0.0";
    }


    return Number(value)
        .toFixed(1);
}


/*
   Prevent API-provided text from being
   interpreted as HTML.
*/

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}