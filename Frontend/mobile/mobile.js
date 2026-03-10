import { API, api } from "/core/api.js";
import { getToken, getUser, setAuth, clearAuth } from "/core/auth.js";
import { toast } from "/components/toast.js";

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const content = document.getElementById("content");
const hello = document.getElementById("hello");
const roleEl = document.getElementById("role");

let currentTab = "feed";

function setActiveTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tabbar button").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  render();
}

function showLogin() {
  loginView.classList.remove("hidden");
  appView.classList.add("hidden");
}

function showApp() {
  const user = getUser();
  hello.textContent = `Hi, ${user?.name ?? "User"}`;
  roleEl.textContent = `Role: ${user?.role ?? "-"}`;
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
  render();
}

async function login(email, password, remember) {
  const res = await fetch(`${API.baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Login failed");

  setAuth(data.token, data.user, remember);
}

function cardItem(item, claimButton = false) {
  return `
    <article class="item">
      <div><strong>${item.title ?? "Untitled item"}</strong></div>
      <div class="meta">${item.type ?? "-"} • ${item.location ?? "Unknown location"}</div>
      <div><span class="pill ${item.status}">${item.status ?? "pending"}</span></div>
      ${claimButton ? `<button data-claim-item="${item.id}">Claim this item</button>` : ""}
    </article>
  `;
}

function claimItemCard(claim, withActions = false) {
  return `
    <article class="item">
      <div><strong>${claim.item?.title ?? `Item #${claim.item_id}`}</strong></div>
      <div class="meta">Claimer: ${claim.claimer?.name ?? "You"}</div>
      <div><span class="pill ${claim.status}">${claim.status}</span></div>
      <div class="meta">Proof: ${claim.proof_details ?? "(none)"}</div>
      ${withActions && claim.status === "pending" ? `
        <div class="row">
          <button class="secondary" data-approve="${claim.id}">Approve</button>
          <button class="warn" data-deny="${claim.id}">Deny</button>
        </div>
      ` : ""}
    </article>
  `;
}

async function renderFeed() {
  content.innerHTML = `
    <section class="card">
      <label>Search</label>
      <input id="q" placeholder="title, description, location" />
      <div class="row">
        <select id="type">
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select id="status">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="matched">Matched</option>
          <option value="claimed">Claimed</option>
        </select>
      </div>
      <button id="loadFeed">Load Items</button>
    </section>
    <section id="feedList"></section>
  `;

  const load = async () => {
    const params = new URLSearchParams({ per_page: "20" });
    const q = document.getElementById("q").value.trim();
    const type = document.getElementById("type").value;
    const status = document.getElementById("status").value;
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (status) params.set("status", status);

    const payload = await api.get(`/items?${params.toString()}`);
    const rows = payload?.data ?? [];

    const list = document.getElementById("feedList");
    if (!rows.length) {
      list.innerHTML = `<div class="item">No items found.</div>`;
      return;
    }

    list.innerHTML = rows.map((it) => cardItem(it, true)).join("");

    list.querySelectorAll("[data-claim-item]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const proof = prompt("Enter proof details (required):");
        if (!proof || !proof.trim()) {
          toast("Proof details required", "warn");
          return;
        }

        try {
          await api.post("/claims", { item_id: Number(btn.dataset.claimItem), proof_details: proof.trim() });
          toast("Claim submitted", "success");
        } catch {
          // handled by api toast
        }
      });
    });
  };

  document.getElementById("loadFeed").addEventListener("click", load);
  await load();
}

async function renderMyClaims() {
  const payload = await api.get("/my/claims?per_page=20");
  const rows = payload?.data ?? [];

  content.innerHTML = rows.length
    ? rows.map((c) => claimItemCard(c)).join("")
    : `<div class="item">No claims yet.</div>`;
}

async function renderReviewClaims() {
  const user = getUser();

  if (user?.role !== "user" && user?.role !== "staff" && user?.role !== "admin") {
    content.innerHTML = `<div class="item">No access.</div>`;
    return;
  }

  const endpoint = user.role === "user" ? "/my/item-claims?per_page=20" : "/claims?per_page=20";
  const payload = await api.get(endpoint);
  const rows = payload?.data ?? [];

  if (!rows.length) {
    content.innerHTML = `<div class="item">No review items.</div>`;
    return;
  }

  content.innerHTML = rows.map((c) => claimItemCard(c, true)).join("");

  content.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await api.put(`/claims/${btn.dataset.approve}/approve`, { review_notes: "Approved in mobile app" });
        toast("Claim approved", "success");
        renderReviewClaims();
      } catch {
        // api handles toast
      }
    });
  });

  content.querySelectorAll("[data-deny]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reason = prompt("Reason for denial (required):");
      if (!reason || !reason.trim()) {
        toast("Denial reason required", "warn");
        return;
      }
      try {
        await api.put(`/claims/${btn.dataset.deny}/deny`, { review_notes: reason.trim() });
        toast("Claim denied", "success");
        renderReviewClaims();
      } catch {
        // api handles toast
      }
    });
  });
}

async function render() {
  try {
    if (currentTab === "feed") return await renderFeed();
    if (currentTab === "claims") return await renderMyClaims();
    return await renderReviewClaims();
  } catch {
    content.innerHTML = `<div class="item">Failed to load data.</div>`;
  }
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  try {
    await login(email, password, remember);
    toast("Login successful", "success");
    showApp();
  } catch (err) {
    toast(err.message || "Login failed", "danger");
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  clearAuth();
  showLogin();
});

document.querySelectorAll(".tabbar button").forEach((btn) => {
  btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
});

if (getToken()) {
  showApp();
} else {
  showLogin();
}
