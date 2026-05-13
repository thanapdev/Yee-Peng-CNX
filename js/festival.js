/* Festival Page Logic */
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
});

function initTimeline() {
    const items = [
        { time: '17:00', event: 'ตลาดโคมและงานศิลปะพื้นบ้านเปิด' },
        { time: '18:30', event: 'พิธีสวดมนต์และจุดเทียนที่วัด' },
        { time: '19:30', event: 'ขบวนแห่แสงไฟและโคมแขวน' },
        { time: '20:30', event: 'ปล่อยโคมลอยพร้อมกันหมื่นดวง' },
        { time: '21:30', event: 'ลอยกระทงในแม่น้ำปิง' },
        { time: 'ตลอดคืน', event: 'ดนตรีพื้นเมือง อาหารเชียงใหม่ เทศกาลแสง' },
    ];
    
    const container = document.getElementById('tl-items');
    if (container) {
        container.innerHTML = '';
        items.forEach((item) => {
            container.innerHTML += `
                <div class="reveal timeline-item">
                    <div class="timeline-time">
                        <span style="font-family:var(--font-display);color:#E8925C;font-weight:600;font-size:1.1rem;">${item.time}</span>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-dot"></div>
                        <p style="color:rgba(255,248,231,0.85);font-size:.95rem;line-height:1.6;">${item.event}</p>
                    </div>
                </div>`;
        });
    }
    
    // Initialize reveal animations if the function exists
    if (window.initReveal) {
        window.initReveal();
    }
}
