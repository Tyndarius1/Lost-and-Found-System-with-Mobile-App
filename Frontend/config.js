/**
 * Frontend configuration.
 * Override API_BASE_URL at deploy time (e.g. via script or build) or leave default for local dev.
 */
window.APP_CONFIG = {
    apiBaseUrl: window.API_BASE_URL || "https://backend.test/api",
};
