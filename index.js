jQuery(() => {
    // ป้องกันการโหลดซ้ำ
    if ($('#mobile-fullscreen-drawer').length) return;

    // ==========================================
    // 1. MODULE: FULLSCREEN LOGIC
    // ==========================================
    const toggleFullscreen = () => {
        const doc = window.document;
        const docEl = doc.documentElement;

        const requestFS = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        const exitFS = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;

        const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

        if (!isFullscreen) {
            if (requestFS) {
                requestFS.call(docEl).catch(err => {
                    alert(`ไม่สามารถเปิดเต็มหน้าจอได้: ${err.message}`);
                });
            } else {
                alert("อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับ Fullscreen API (สำหรับ iOS/Safari แนะนำให้ใช้เมนู 'Add to Home Screen')");
            }
        } else {
            if (exitFS) {
                exitFS.call(doc);
            }
        }
    };

    // อัปเดตข้อความและสีของปุ่มตามสถานะหน้าจอ
    const updateButtonState = () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        const $btn = $('#mobile-fullscreen-btn');
        if ($btn.length) {
            if (isFullscreen) {
                $btn.html('❐ ออกจากเต็มหน้าจอ (Exit Fullscreen)');
                $btn.css('background-color', '#dc3545');
            } else {
                $btn.html('⛶ เปิดเต็มหน้าจอ (Enter Fullscreen)');
                $btn.css('background-color', '#28a745');
            }
        }
    };

    // ==========================================
    // 2. MODULE: EXTENSION DRAWER INJECTION
    // ==========================================
    const initExtensionDrawer = () => {
        if ($('#mobile-fullscreen-drawer').length) return;

        const drawerHTML = `
            <div class="inline-drawer" id="mobile-fullscreen-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>📱 Mobile Fullscreen Toggle</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content" style="display: none;">
                    <div style="padding: 10px; text-align: center;">
                        <button id="mobile-fullscreen-btn" class="menu_button" style="width: 100%; padding: 12px; font-weight: bold; border-radius: 6px; border: none; color: #fff; cursor: pointer; transition: background 0.2s;">
                            ⛶ เปิดเต็มหน้าจอ (Enter Fullscreen)
                        </button>
                    </div>
                </div>
            </div>
        `;

        const $targetPanel = $('#extensions_settings');
        if ($targetPanel.length) {
            $targetPanel.append(drawerHTML);
            updateButtonState();
        }
    };

    // เรียกทำงานทันที และใช้ Timer เพื่อรอให้ DOM ของ SillyTavern โหลดสำเร็จ
    initExtensionDrawer();
    const drawerTimer = setInterval(() => {
        if ($('#extensions_settings').length) {
            initExtensionDrawer();
            if ($('#mobile-fullscreen-drawer').length) clearInterval(drawerTimer);
        }
    }, 500);

    // ==========================================
    // 3. EVENT LISTENERS
    // ==========================================
    $(document).on('click', '#mobile-fullscreen-btn', function () {
        toggleFullscreen();
    });

    // ตรวจจับการสลับสถานะ Fullscreen เพื่อเปลี่ยนข้อความบนปุ่มแบบเรียลไทม์
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
        document.addEventListener(evt, updateButtonState);
    });
});