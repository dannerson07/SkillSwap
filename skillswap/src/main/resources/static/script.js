/* =========================================
   SKILLSWAP - FRONTEND JAVASCRIPT
========================================= */

const API_BASE_URL = "/api";

let currentMemberId = null;


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();

    setupQuickActions();

    setupForms();

    loadDashboard();

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

    /* -----------------------------
       Update sidebar
    ----------------------------- */

    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionName) {
            item.classList.add("active");
        }

    });


    /* -----------------------------
       Hide all sections
    ----------------------------- */

    document.querySelectorAll(".content-section").forEach(section => {

        section.classList.remove("active");

    });


    /* -----------------------------
       Show selected section
    ----------------------------- */

    const selectedSection =
        document.getElementById(`${sectionName}-section`);

    if (selectedSection) {

        selectedSection.classList.add("active");

    }


    /* -----------------------------
       Load section data
    ----------------------------- */

    switch (sectionName) {

        case "dashboard":
            loadDashboard();
            break;

        case "members":
            loadMembers();
            break;

        case "skills":
            loadSkills();
            break;

        case "sessions":
            loadSessions();
            break;

        case "ledger":

            if (currentMemberId) {
                loadLedger(currentMemberId);
            }

            break;

    }

}


/* =========================================
   DASHBOARD QUICK ACTIONS
========================================= */

function setupQuickActions() {

    document
        .querySelectorAll("[data-section-link]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const targetSection =
                    button.dataset.sectionLink;

                const navItem =
                    document.querySelector(
                        `.nav-item[data-section="${targetSection}"]`
                    );

                if (navItem) {

                    navItem.click();

                }

            });

        });

}


/* =========================================
   FORM SETUP
========================================= */

function setupForms() {

    /* Member form */

    const memberForm =
        document.getElementById("member-form");

    if (memberForm) {

        memberForm.addEventListener(
            "submit",
            createMember
        );

    }


    /* Skill form */

    const skillForm =
        document.getElementById("skill-form");

    if (skillForm) {

        skillForm.addEventListener(
            "submit",
            createSkill
        );

    }


    /* Session form */

    const sessionForm =
        document.getElementById("session-form");

    if (sessionForm) {

        sessionForm.addEventListener(
            "submit",
            createSession
        );

    }


    /* Ledger button */

    const ledgerButton =
        document.getElementById("load-ledger-button");

    if (ledgerButton) {

        ledgerButton.addEventListener(
            "click",
            loadLedgerFromForm
        );

    }

}


/* =========================================
   DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        const members =
            await fetchData("/members");

        const skills =
            await fetchData("/skill-offers");

        const sessions =
            await fetchData("/sessions");


        /* --------------------------------
           Skill count
        -------------------------------- */

        const skillCount =
            document.getElementById(
                "dashboard-skill-count"
            );

        if (skillCount) {

            skillCount.textContent =
                skills.length;

        }


        /* --------------------------------
           Session count
        -------------------------------- */

        const sessionCount =
            document.getElementById(
                "dashboard-session-count"
            );

        if (sessionCount) {

            sessionCount.textContent =
                sessions.length;

        }


        /* --------------------------------
           Determine current member
        -------------------------------- */

        if (!currentMemberId && members.length > 0) {

            currentMemberId =
                members[members.length - 1].id;

        }


        /* --------------------------------
           Load current member credits
        -------------------------------- */

        if (currentMemberId) {

            await updateCreditBalance(
                currentMemberId
            );

        }


        /* --------------------------------
           Dashboard skills
        -------------------------------- */

        displayDashboardSkills(skills);

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


/* =========================================
   CREDIT BALANCE
========================================= */

async function updateCreditBalance(memberId) {

    try {

        const balance =
            await fetchData(
                `/members/${memberId}/credits`
            );


        /* Header */

        const headerBalance =
            document.getElementById(
                "header-credit-balance"
            );

        if (headerBalance) {

            headerBalance.textContent =
                Number(balance).toFixed(1);

        }


        /* Dashboard */

        const dashboardBalance =
            document.getElementById(
                "dashboard-credit-balance"
            );

        if (dashboardBalance) {

            dashboardBalance.textContent =
                Number(balance).toFixed(1);

        }

    }

    catch (error) {

        console.error(
            "Credit balance error:",
            error
        );

    }

}


/* =========================================
   DASHBOARD SKILLS
========================================= */

function displayDashboardSkills(skills) {

    const container =
        document.getElementById(
            "dashboard-skills"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!skills || skills.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ✦
                </div>

                <strong>
                    No skills available yet
                </strong>

                <p>
                    Be the first member to offer a skill.
                </p>

            </div>
        `;

        return;

    }


    /* Show maximum 4 skills on dashboard */

    skills.slice(0, 4).forEach(skill => {

        const provider =
            skill.provider
                ? skill.provider.name
                : "Community member";


        const card =
            document.createElement("div");

        card.className = "skill-card";


        card.innerHTML = `

            <h4>
                ${escapeHtml(skill.skillName)}
            </h4>

            <p>
                ${escapeHtml(
                    skill.description ||
                    "No description provided."
                )}
            </p>

            <div class="skill-provider">
                Offered by
                <strong>
                    ${escapeHtml(provider)}
                </strong>
            </div>

            <div class="skill-hours">
                ${skill.availableHours} hours available
            </div>

            <button
                class="primary-button full-width"
                onclick="goToSkills()"
            >
                Request This Skill
            </button>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   GO TO SKILLS
========================================= */

function goToSkills() {

    const navItem =
        document.querySelector(
            '.nav-item[data-section="skills"]'
        );

    if (navItem) {

        navItem.click();

    }

}


/* =========================================
   MEMBERS
========================================= */

async function loadMembers() {

    try {

        const members =
            await fetchData("/members");

        displayMembers(members);

    }

    catch (error) {

        console.error(
            "Member loading error:",
            error
        );

    }

}


function displayMembers(members) {

    const container =
        document.getElementById(
            "members-list"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!members || members.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ◉
                </div>

                <strong>
                    No members yet
                </strong>

                <p>
                    Create the first SkillSwap member.
                </p>

            </div>
        `;

        return;

    }


    members.forEach(member => {

        const card =
            document.createElement("div");

        card.className = "member-card";


        const initial =
            member.name
                ? member.name.charAt(0).toUpperCase()
                : "?";


        card.innerHTML = `

            <div class="member-avatar">
                ${escapeHtml(initial)}
            </div>

            <div>

                <h4>
                    ${escapeHtml(member.name)}
                </h4>

                <p>
                    ${escapeHtml(member.email)}
                </p>

                <p>
                    ${Number(
                        member.creditBalance || 0
                    ).toFixed(1)}
                    learning hours available
                </p>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   CREATE MEMBER
========================================= */

async function createMember(event) {

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
            "Please enter your name and email."
        );

        return;

    }


    try {

        const member =
            await fetchData(
                "/members",
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


        currentMemberId =
            member.id;


        document
            .getElementById("member-form")
            .reset();


        showNotification(
            `Welcome to SkillSwap, ${member.name}!`
        );


        await loadMembers();

        await updateCreditBalance(
            currentMemberId
        );

        await loadDashboard();

    }

    catch (error) {

        showNotification(
            error.message
        );

    }

}


/* =========================================
   SKILLS
========================================= */

async function loadSkills() {

    try {

        const skills =
            await fetchData(
                "/skill-offers"
            );

        displaySkills(skills);

    }

    catch (error) {

        console.error(
            "Skill loading error:",
            error
        );

    }

}


function displaySkills(skills) {

    const container =
        document.getElementById(
            "skills-list"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!skills || skills.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ✦
                </div>

                <strong>
                    No skills available
                </strong>

                <p>
                    Offer your first skill to the community.
                </p>

            </div>
        `;

        return;

    }


    skills.forEach(skill => {

        const provider =
            skill.provider
                ? skill.provider.name
                : "Community member";


        const card =
            document.createElement("div");

        card.className = "skill-card";


        card.innerHTML = `

            <h4>
                ${escapeHtml(skill.skillName)}
            </h4>

            <p>
                ${escapeHtml(
                    skill.description ||
                    "No description provided."
                )}
            </p>

            <div class="skill-provider">

                Offered by
                <strong>
                    ${escapeHtml(provider)}
                </strong>

            </div>

            <div class="skill-hours">

                ${skill.availableHours}
                hours available

            </div>

            <button
                class="primary-button full-width"
                onclick="prepareSessionRequest(${skill.id})"
            >
                Request This Skill
            </button>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   PREPARE SESSION REQUEST
========================================= */

function prepareSessionRequest(skillId) {

    const skillInput =
        document.getElementById(
            "session-skill"
        );


    if (skillInput) {

        skillInput.value =
            skillId;

    }


    const requesterInput =
        document.getElementById(
            "session-requester"
        );


    if (
        requesterInput &&
        currentMemberId
    ) {

        requesterInput.value =
            currentMemberId;

    }


    const navItem =
        document.querySelector(
            '.nav-item[data-section="sessions"]'
        );


    if (navItem) {

        navItem.click();

    }


    showNotification(
        "Skill selected. Enter the learning hours you need."
    );

}


/* =========================================
   CREATE SKILL
========================================= */

async function createSkill(event) {

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
            "Please complete all required skill fields."
        );

        return;

    }


    try {

        await fetchData(
            "/skill-offers",
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


        document
            .getElementById("skill-form")
            .reset();


        showNotification(
            "Skill successfully offered!"
        );


        await loadSkills();

        await loadDashboard();

    }

    catch (error) {

        showNotification(
            error.message
        );

    }

}


/* =========================================
   SESSIONS
========================================= */

async function loadSessions() {

    try {

        const sessions =
            await fetchData(
                "/sessions"
            );

        displaySessions(sessions);

    }

    catch (error) {

        console.error(
            "Session loading error:",
            error
        );

    }

}


function displaySessions(sessions) {

    const container =
        document.getElementById(
            "sessions-list"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!sessions || sessions.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ◷
                </div>

                <strong>
                    No learning sessions yet
                </strong>

                <p>
                    Request a skill to start learning.
                </p>

            </div>
        `;

        return;

    }


    sessions.forEach(session => {

        const card =
            document.createElement("div");

        card.className =
            "session-card";


        const skillName =
            session.skillOffer
                ? session.skillOffer.skillName
                : "Skill session";


        const requesterName =
            session.requester
                ? session.requester.name
                : "Unknown";


        const status =
            session.status || "REQUESTED";


        const statusClass =
            `status-${status.toLowerCase()}`;


        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:15px;
            ">

                <div>

                    <h4>
                        ${escapeHtml(skillName)}
                    </h4>

                    <p>
                        Requested by
                        ${escapeHtml(requesterName)}
                    </p>

                    <p>
                        Requested:
                        ${session.requestedHours}
                        hours
                    </p>

                    ${
                        session.actualHours
                            ? `
                                <p>
                                    Completed:
                                    ${session.actualHours}
                                    hours
                                </p>
                            `
                            : ""
                    }

                </div>

                <span class="status-badge ${statusClass}">
                    ${escapeHtml(status)}
                </span>

            </div>

            <div class="session-actions">

                ${createSessionActions(session)}

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   SESSION ACTIONS
========================================= */

function createSessionActions(session) {

    let html = "";


    /* Requested */

    if (
        session.status === "REQUESTED"
    ) {

        const providerId =
            session.skillOffer &&
            session.skillOffer.provider
                ? session.skillOffer.provider.id
                : null;


        if (providerId) {

            html += `

                <button
                    class="primary-button"
                    onclick="
                        confirmSession(
                            ${session.id},
                            ${providerId}
                        )
                    "
                >
                    Confirm
                </button>

                <button
                    class="secondary-button"
                    onclick="
                        rejectSession(
                            ${session.id},
                            ${providerId}
                        )
                    "
                >
                    Reject
                </button>

            `;

        }

    }


    /* Confirmed */

    if (
        session.status === "CONFIRMED"
    ) {

        html += `

            <button
                class="primary-button"
                onclick="
                    completeSession(
                        ${session.id}
                    )
                "
            >
                Complete Session
            </button>

        `;

    }


    return html;

}


/* =========================================
   CREATE SESSION
========================================= */

async function createSession(event) {

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
            "Please complete all session fields."
        );

        return;

    }


    try {

        await fetchData(
            "/sessions",
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


        document
            .getElementById("session-form")
            .reset();


        showNotification(
            "Learning session requested!"
        );


        await loadSessions();

        await loadDashboard();

    }

    catch (error) {

        showNotification(
            error.message
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
            `/sessions/${sessionId}/confirm/${providerId}`,
            {
                method: "PUT"
            }
        );


        showNotification(
            "Session confirmed!"
        );


        await loadSessions();

        await loadDashboard();

    }

    catch (error) {

        showNotification(
            error.message
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
            `/sessions/${sessionId}/reject/${providerId}`,
            {
                method: "PUT"
            }
        );


        showNotification(
            "Session rejected."
        );


        await loadSessions();

        await loadDashboard();

    }

    catch (error) {

        showNotification(
            error.message
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
            "Enter the actual learning hours completed:"
        );


    if (
        actualHours === null
    ) {

        return;

    }


    const hours =
        Number(actualHours);


    if (
        !hours ||
        hours <= 0
    ) {

        showNotification(
            "Please enter a valid number of hours."
        );

        return;

    }


    try {

        await fetchData(
            `/sessions/${sessionId}/complete`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    actualHours:
                        hours

                })

            }
        );


        showNotification(
            "Session completed and credits transferred!"
        );


        await loadSessions();

        await loadDashboard();

    }

    catch (error) {

        showNotification(
            error.message
        );

    }

}


/* =========================================
   CREDIT LEDGER
========================================= */

async function loadLedgerFromForm() {

    const memberId =
        Number(
            document.getElementById(
                "ledger-member"
            ).value
        );


    if (!memberId) {

        showNotification(
            "Please enter a member ID."
        );

        return;

    }


    currentMemberId =
        memberId;


    await loadLedger(
        memberId
    );


    await updateCreditBalance(
        memberId
    );

}


async function loadLedger(memberId) {

    try {

        const entries =
            await fetchData(
                `/ledger/member/${memberId}`
            );

        displayLedger(entries);

    }

    catch (error) {

        showNotification(
            error.message
        );

    }

}


function displayLedger(entries) {

    const container =
        document.getElementById(
            "ledger-list"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !entries ||
        entries.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ↔
                </div>

                <strong>
                    No credit transactions yet
                </strong>

                <p>
                    Completed sessions will appear here.
                </p>

            </div>
        `;

        return;

    }


    entries.forEach(entry => {

        const item =
            document.createElement("div");

        item.className =
            "ledger-item";


        const isCredit =
            entry.transactionType === "CREDIT";


        const sign =
            isCredit
                ? "+"
                : "-";


        const amountClass =
            isCredit
                ? "ledger-credit"
                : "ledger-debit";


        const label =
            isCredit
                ? "Credits earned"
                : "Credits used";


        item.innerHTML = `

            <div>

                <strong>
                    ${label}
                </strong>

                <small>
                    Session #${entry.sessionRequestId ||
                    (entry.sessionRequest
                        ? entry.sessionRequest.id
                        : "-")}
                </small>

            </div>

            <strong class="${amountClass}">
                ${sign}${entry.amount} hrs
            </strong>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   GENERIC FETCH FUNCTION
========================================= */

async function fetchData(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            options
        );


    let data = null;


    try {

        data =
            await response.json();

    }

    catch {

        data = null;

    }


    if (!response.ok) {

        let message =
            "Something went wrong.";


        if (data) {

            if (data.message) {

                message =
                    data.message;

            }

            else {

                const errors =
                    Object.values(data);

                if (errors.length > 0) {

                    message =
                        errors.join(", ");

                }

            }

        }


        throw new Error(
            message
        );

    }


    return data;

}


/* =========================================
   NOTIFICATIONS
========================================= */

function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );


    if (!notification) {
        return;
    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 3500);

}


/* =========================================
   HTML SAFETY
========================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}