// This file makes the app configurable in a DevOps way without recompiling
// Create your own copy of the file, and use it to replace this template on your production system.

(function (window) {
    window.__env = window.__env || {};
    // base URL for REST API calls to backend
    window.__env.backendBaseUrl = '/rest/';
  
  }(this));