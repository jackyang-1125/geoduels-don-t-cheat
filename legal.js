(function () {
  const AGREEMENT_KEY = "geoduels_legal_accepted_v1";

  function mountLegalAgreement() {
    if (localStorage.getItem(AGREEMENT_KEY) === "true") {
      return;
    }
    if (document.getElementById("legal-agreement-modal")) {
      return;
    }

    const modal = document.createElement("div");
    modal.id = "legal-agreement-modal";
    modal.style.cssText = `
      position: fixed !important;
      inset: 0px !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.96) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      color: #e0e0e0 !important;
      user-select: none !important;
    `;

    modal.innerHTML = `
      <div style="
        width: 90%;
        max-width: 720px;
        max-height: 85vh;
        background: #111;
        border: 2px solid #8b0000;
        box-shadow: 0 0 35px rgba(255, 0, 0, 0.4);
        border-radius: 8px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      ">
        <div style="border-bottom: 2px solid #8b0000; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="color: #ff3333; margin: 0; font-size: 19px; letter-spacing: 0.5px;">
            ANTI-CHEAT EXTENSION END-USER LICENSE & ABSOLUTE LIABILITY WAIVER
          </h2>
          <p style="color: #888; font-size: 11px; margin: 4px 0 0 0;">
            DOCUMENT REF: EXT-LEGAL-ANTIBREACH-2026 // BROWSER EXTENSION COMPLIANCE PROTOCOL
          </p>
        </div>

        <div style="
          flex: 1;
          overflow-y: auto;
          background: #080808;
          border: 1px solid #222;
          padding: 16px;
          font-size: 12.5px;
          line-height: 1.7;
          color: #bbb;
          text-align: justify;
        ">
          <p style="color: #ff6666; font-weight: bold; margin-top: 0;">
            [PREAMBLE & SCOPE OF SERVICE]<br>
            This Agreement strictly governs the installation, background execution, telemetry surveillance, and enforcement protocols of this browser extension ("the Extension" or "the Service"). The third-party platform (geoduels.io) is an independent entity. By installing, enabling, or permitting the Extension to execute, the User acknowledges full legal capacity and unconditionally agrees to be bound by the terms herein.
          </p>

          <h4 style="color: #fff; margin: 12px 0 4px 0;">SECTION 1: EXTENSION TELEMETRY & IRREBUTTABLE PRESUMPTION OF CHEATING</h4>
          <p>
            The User expressly authorizes the Extension to execute real-time local monitoring of browser state changes, including tab switching, background process activations, and the creation of external search queries (such as Google, mapping databases, or related resources). Any departure from the primary game viewport while the Extension is active shall establish an irrebuttable, conclusive presumption of illicit external assistance.
          </p>

          <h4 style="color: #fff; margin: 12px 0 4px 0;">SECTION 2: AUTOMATED DEPLOYMENT OF DETERRENT PROTOCOLS</h4>
          <p>
            Upon detecting any departure or unauthorized navigation, the Extension is pre-authorized by the User to immediately hijack the active browser viewport, enforce full-screen shock visual overlays, trigger interface oscillation, and execute continuous maximum-output (100% volume) acoustic deterrent loops without further confirmation or manual override capabilities.
          </p>

          <h4 style="color: #fff; margin: 12px 0 4px 0;">SECTION 3: ASSUMPTION OF AUDITORY, VISUAL, AND HARDWARE RISKS</h4>
          <p>
            The User warrants that they are physically and psychologically fit to operate the Extension and do not suffer from photosensitive epilepsy, severe cardiovascular conditions, or acute auditory sensitivities. The User assumes 100% sole responsibility for any startle responses, psychological distress, bodily injury, or peripheral hardware damage (including dropped headphones, damaged monitors, or acoustic discomfort) resulting from the Extension's deterrent actions.
          </p>

          <h4 style="color: #fff; margin: 12px 0 4px 0;">SECTION 4: COMPLETE INDEMNIFICATION & WAIVER OF CLAIMS</h4>
          <p>
            The User hereby unconditionally and irrevocably releases, discharges, and holds harmless the developers, authors, and maintainers of this Extension from any and all legal liabilities, tort actions, consumer complaints, or financial claims arising directly or indirectly from the operation, false positives, or sensory consequences of this Extension.
          </p>

          <h4 style="color: #fff; margin: 12px 0 4px 0;">SECTION 5: ABSOLUTE DISCLAIMER OF DATA LOSS AND SYSTEM IMPAIRMENT</h4>
          <p>
            The User expressly acknowledges and agrees that the Extension, its authors, developers, and maintainers shall bear absolutely zero liability, financial obligation, or legal responsibility for any data loss, file corruption, session state destruction, storage erasure, browser profile reset, hardware malfunction, or system impairment arising directly or indirectly from the operation, tab termination, extension enforcement, or background execution of this Extension.
          </p>
        </div>

        <div style="margin-top: 16px; border-top: 1px solid #222; padding-top: 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 12px; color: #fff;">
            <input type="checkbox" id="legal-agree-checkbox" style="margin-right: 8px; cursor: pointer; accent-color: #ff0000;">
            I acknowledge that this Extension enforces anti-cheat measures and I assume all associated risks and waivers.
          </label>
          <button id="legal-submit-btn" disabled style="
            margin-top: 12px;
            width: 100%;
            padding: 12px;
            background: #333;
            color: #777;
            border: 1px solid #444;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            cursor: not-allowed;
            transition: all 0.2s;
          ">
            PLEASE ACCEPT THE AGREEMENT TO PROCEED
          </button>
        </div>
      </div>
    `;

    (document.documentElement || document.body).appendChild(modal);

    const checkbox = document.getElementById("legal-agree-checkbox");
    const submitBtn = document.getElementById("legal-submit-btn");

    if (checkbox && submitBtn) {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          submitBtn.disabled = false;
          submitBtn.style.background = "#8b0000";
          submitBtn.style.color = "#fff";
          submitBtn.style.border = "1px solid #ff0000";
          submitBtn.style.cursor = "pointer";
          submitBtn.innerText = "AUTHORIZE EXTENSION & ENTER GEODUELS";
        } else {
          submitBtn.disabled = true;
          submitBtn.style.background = "#333";
          submitBtn.style.color = "#777";
          submitBtn.style.border = "1px solid #444";
          submitBtn.style.cursor = "not-allowed";
          submitBtn.innerText = "PLEASE ACCEPT THE AGREEMENT TO PROCEED";
        }
      });

      submitBtn.addEventListener("click", function () {
        if (!checkbox.checked) return;

        localStorage.setItem(AGREEMENT_KEY, "true");
        modal.remove();

        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            ctx.resume();
          }
        } catch (e) {}
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountLegalAgreement);
  } else {
    mountLegalAgreement();
  }
})();