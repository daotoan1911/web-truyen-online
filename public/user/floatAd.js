// Floating Ad Widget — tự load từ /ads, hiện icon + popup
(async function () {
    let ads = {};
    try {
        const res = await fetch('/ads');
        if (res.ok) ads = await res.json();
    } catch { }

    // Dùng slot float_ad riêng (fallback: custom_1 -> shopee)
    const ad = ads.float_ad || ads.custom_1 || ads.shopee || null;

    // Nếu không có ad nào được cấu hình thì không hiện widget
    if (!ad || !ad.url) return;

    // Tạo wrapper
    const wrap = document.createElement('div');
    wrap.className = 'float-ad-wrap';
    wrap.id = 'floatAdWrap';

    // Banner popup (ẩn mặc định)
    const banner = document.createElement('div');
    banner.className = 'float-ad-banner';
    banner.id = 'floatAdBanner';
    banner.style.display = 'none';

    const adUrl = ad?.url || '#';
    const adImg = ad?.imageUrl || '';
    const adLabel = ad?.label || 'Quảng cáo';

    banner.innerHTML = `
    <div class="float-ad-banner-head">
      <span>📢 ${adLabel}</span>
      <button class="float-ad-close" onclick="document.getElementById('floatAdBanner').style.display='none'" title="Đóng">✕</button>
    </div>
    <div class="float-ad-banner-body">
      <a href="${adUrl}" target="_blank" rel="noopener sponsored">
        ${adImg
            ? `<img src="${adImg}" alt="${adLabel}">`
            : `<div class="float-ad-text-link">🛒 ${adLabel} — Nhấn để xem</div>`}
      </a>
    </div>`;

    // Icon nhỏ — click toggle banner, href cũng ra link
    const icon = document.createElement('a');
    icon.className = 'float-ad-icon';
    icon.href = adUrl;
    icon.target = '_blank';
    icon.rel = 'noopener sponsored';
    icon.title = adLabel;
    icon.innerHTML = adImg ? `<img src="${adImg}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : '📢';

    // Click icon: nếu có URL thì mở link, đồng thời toggle banner
    icon.addEventListener('click', (e) => {
        const b = document.getElementById('floatAdBanner');
        if (b.style.display === 'none') {
            b.style.display = 'block';
        } else {
            b.style.display = 'none';
        }
        // Vẫn cho mở link bình thường
    });

    wrap.appendChild(banner);
    wrap.appendChild(icon);
    document.body.appendChild(wrap);

    // Tự đóng banner sau 8 giây
    setTimeout(() => {
        const b = document.getElementById('floatAdBanner');
        if (b) b.style.display = 'none';
    }, 8000);
})();
