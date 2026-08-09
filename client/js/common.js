'use strict';

/**
 * Pustakalaya shared frontend helpers: fetch wrapper, toasts, inline field
 * errors, mobile nav toggle, and session helpers. Loaded by every page.
 */
window.Pustakalaya = (function () {
  const API = '/api';

  /** fetch wrapper that parses JSON and throws structured errors. */
  async function request(path, options = {}) {
    const res = await fetch(API + path, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    let body = null;
    try {
      body = await res.json();
    } catch (e) {
      body = null;
    }
    if (res.ok) return body;
    const err = new Error('Request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Dark-academia toast; types: success | error | info. */
  function toast(message, type = 'success') {
    const icons = { success: 'verified', error: 'warning', info: 'auto_stories' };
    const colors = { success: 'bg-[#1b3022]', error: 'bg-[#630a10]', info: 'bg-[#735c00]' };
    const el = document.createElement('div');
    el.className =
      'fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-5 py-3 rounded-md shadow-2xl ' +
      (colors[type] || colors.info) +
      ' text-[#fff9ed] text-xs uppercase tracking-widest font-bold border border-[#b4cdb8] ' +
      'translate-y-2 opacity-0 transition-all duration-300';
    el.innerHTML =
      '<span class="material-symbols-outlined text-base">' + (icons[type] || icons.info) + '</span><span></span>';
    el.lastChild.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.classList.remove('translate-y-2', 'opacity-0');
    });
    setTimeout(() => {
      el.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => el.remove(), 350);
    }, 4000);
  }

  /** Show a field-specific error below an input and tint its ledger line. */
  function setFieldError(input, message) {
    if (!input) return;
    clearFieldError(input);
    input.classList.add('input-error');
    const err = document.createElement('p');
    err.className = 'field-error';
    err.dataset.fieldError = 'true';
    err.textContent = message;
    input.insertAdjacentElement('afterend', err);
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('input-error');
    if (input.parentElement) {
      input.parentElement.querySelectorAll('.field-error').forEach((el) => el.remove());
    }
  }

  function clearFormErrors(form) {
    if (!form) return;
    form.querySelectorAll('.input-error').forEach((el) => el.classList.remove('input-error'));
    form.querySelectorAll('.field-error').forEach((el) => el.remove());
  }

  /**
   * Render server validation errors near their inputs.
   * @param {HTMLFormElement} form
   * @param {Array<{field:string,message:string}>} errors
   * @param {Object<string,string>} fieldMap server field name -> CSS selector
   */
  function applyFieldErrors(form, errors, fieldMap) {
    let shown = 0;
    (errors || []).forEach(({ field, message }) => {
      const selector = fieldMap[field];
      if (!selector) return;
      const input = form.querySelector(selector);
      if (!input) return;
      setFieldError(input, message);
      shown += 1;
    });
    return shown;
  }

  function toggleMenu(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
  }

  async function currentUser() {
    try {
      const body = await request('/auth/me');
      return body.user;
    } catch (e) {
      return null;
    }
  }

  /** Redirect to login when unauthenticated; resolves to the user otherwise. */
  async function requireAuth() {
    const user = await currentUser();
    if (!user) {
      window.location.href = './login.html';
      return null;
    }
    return user;
  }

  async function logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (e) {
      /* ignore — always navigate home */
    }
    window.location.href = './index.html';
  }

  return {
    request,
    escapeHtml,
    toast,
    setFieldError,
    clearFieldError,
    clearFormErrors,
    applyFieldErrors,
    toggleMenu,
    currentUser,
    requireAuth,
    logout,
    API,
  };
})();
