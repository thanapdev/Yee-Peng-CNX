/* Festival Page Logic */
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
});

function initTimeline() {
    const items = [
        { t: 'fest_tl1_time', e: 'fest_tl1_ev' },
        { t: 'fest_tl2_time', e: 'fest_tl2_ev' },
        { t: 'fest_tl3_time', e: 'fest_tl3_ev' },
        { t: 'fest_tl4_time', e: 'fest_tl4_ev' },
        { t: 'fest_tl5_time', e: 'fest_tl5_ev' },
        { t: 'fest_tl6_time', e: 'fest_tl6_ev' },
    ];
    
    const container = document.getElementById('tl-items');
    if (container) {
        container.innerHTML = ''; // Clear container
        items.forEach((item) => {
            container.innerHTML += `
                <div class="reveal timeline-item">
                    <div class="timeline-time">
                        <span data-i18n="${item.t}" style="font-family:var(--font-display);color:#E8925C;font-weight:600;font-size:1.1rem;"></span>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-dot"></div>
                        <p data-i18n="${item.e}" style="color:rgba(255,248,231,0.85);font-size:.95rem;line-height:1.6;"></p>
                    </div>
                </div>`;
        });
    }
    
    // Re-apply language to fill the new elements
    if (window.applyLang) {
        window.applyLang(window.currentLang || 'th');
    }
    
    // Initialize reveal animations if the function exists
    if (window.initReveal) {
        window.initReveal();
    }
}
