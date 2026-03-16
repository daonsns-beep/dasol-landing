// main.js - Professional Redesign Interactive Elements

// Supabase Configuration
const SUPABASE_URL = 'https://afeocdpxhpmmspovabru.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZW9jZHB4aHBtbXNwb3ZhYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzAxNTcsImV4cCI6MjA4NzEwNjE1N30.Q6uq1v_xp1001TOdSSPhNbdggC2RGUDQdN5HWwvfMLY';

// Helper: Detect device type
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

// Helper: Get KST ISO string
function getKSTISOString() {
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kst = new Date(now.getTime() + kstOffset);
    return kst.toISOString().replace('Z', '');
}

// Helper: Strip hyphens from phone for DB storage
function stripPhone(phone) {
    return phone.replace(/-/g, '');
}

// Submit lead to Supabase via REST API
async function submitLeadToSupabase(leadData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/lead`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase 오류: ${response.status} - ${errorText}`);
    }
    return true;
}

// n8n Webhook URL
const N8N_WEBHOOK_URL = 'https://daon1019.com/webhook/addscapcokr';

// Send lead notification to n8n webhook (for Telegram alert)
async function sendWebhookNotification(data) {
    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (err) {
        // 웹훅 실패해도 Supabase INSERT는 이미 완료되었으므로 무시
        console.warn('n8n 웹훅 전송 실패 (무시):', err);
    }
}

// Custom Toast Modal (replaces browser alert)
const TOAST_ICONS = {
    success: 'ph-check-circle',
    error: 'ph-x-circle',
    warning: 'ph-warning'
};
function showToast(type, title, message) {
    const overlay = document.getElementById('toast-overlay');
    const iconWrap = document.getElementById('toast-icon-wrap');
    const icon = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-message');
    const btn = document.getElementById('toast-close-btn');

    iconWrap.className = 'toast-icon-wrap ' + type;
    icon.className = 'ph-bold ' + TOAST_ICONS[type];
    titleEl.textContent = title;
    msgEl.textContent = message;
    btn.className = 'toast-btn ' + type;
    overlay.classList.add('show');

    const close = () => overlay.classList.remove('show');
    btn.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
}

// Global phone formatter: 010-1234-1234 format
function formatPhone(input) {
    // Get cursor position before formatting
    const cursorPos = input.selectionStart;
    const prevLen = input.value.length;
    
    // Strip non-digits
    let digits = input.value.replace(/[^0-9]/g, '');
    
    // Ensure starts with 010
    if (!digits.startsWith('010')) {
        digits = '010';
    }
    
    // Cap at 11 digits (010 + 8)
    if (digits.length > 11) {
        digits = digits.substring(0, 11);
    }
    
    // Format: 010-XXXX-XXXX
    let formatted = '';
    if (digits.length <= 3) {
        formatted = digits + '-';
    } else if (digits.length <= 7) {
        formatted = digits.substring(0, 3) + '-' + digits.substring(3);
    } else {
        formatted = digits.substring(0, 3) + '-' + digits.substring(3, 7) + '-' + digits.substring(7);
    }
    
    input.value = formatted;
    
    // Adjust cursor position
    const newLen = formatted.length;
    const diff = newLen - prevLen;
    const newCursorPos = Math.max(4, cursorPos + diff); // Never before '010-'
    input.setSelectionRange(newCursorPos, newCursorPos);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach((el) => {
        observer.observe(el);
    });

    // 4. Initialize Glide.js Carousel for Testimonials
    if (document.querySelector('.testimonials-slider')) {
        new Glide('.testimonials-slider', {
            type: 'carousel',
            startAt: 0,
            perView: 3,
            gap: 24,
            autoplay: 3800,
            animationDuration: 1000,
            hoverpause: true,
            breakpoints: {
                1024: {
                    perView: 2
                },
                768: {
                    perView: 1,
                    gap: 16
                }
            }
        }).mount();
    }

    // 5. Form Handling & Simulation
    const loanForm = document.getElementById('loan-application-form');
    const successMsg = document.getElementById('form-success-msg');

    if (loanForm) {
        loanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const privacyAgree = document.getElementById('privacy_agree');
            if(!privacyAgree.checked) {
                showToast('warning', '동의 필요', '개인정보 수집 및 이용에 동의해주세요.');
                return;
            }

            const submitBtn = loanForm.querySelector('.btn-submit');
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> <span>제출 중...</span>';

            // Gather form data
            const name = document.getElementById('name').value.trim();
            const phone = stripPhone(document.getElementById('phone').value.trim());
            const propertyType = document.getElementById('property_type').value || '';
            const loanAmount = document.getElementById('loan_amount').value.trim();
            const purposeEl = document.querySelector('input[name="purpose"]:checked');
            const purpose = purposeEl ? purposeEl.value : '';

            // Build memo
            const memoParts = [];
            if (propertyType) memoParts.push(`담보: ${propertyType}`);
            if (loanAmount) memoParts.push(`희망금액: ${loanAmount}`);
            if (purpose) memoParts.push(`용도: ${purpose}`);

            try {
                await submitLeadToSupabase({
                    name,
                    phone,
                    source: '다솔랜딩',
                    status: '신규',
                    home: propertyType || null,
                    memo: memoParts.join(' / ') || null,
                    form_variant: 'main_form',
                    device_type: getDeviceType(),
                    landing_url: window.location.href,
                    referrer: document.referrer || null,
                    created_at: getKSTISOString()
                });

                // n8n 웹훅으로 텔레그램 알림 전송
                const phoneFormatted = document.getElementById('phone').value.trim();
                sendWebhookNotification({
                    name,
                    phone: phoneFormatted,
                    source: '다솔(병수랜딩)',
                    status: 'New',
                    inquiry_form: memoParts.join(' / ') || '',
                    sort: propertyType || '',
                    created_at: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(' ', 'T') + '+09:00'
                });

                loanForm.style.display = 'none';
                successMsg.style.display = 'block';
                successMsg.style.animation = 'fadeIn 0.5s ease-out forwards';
            } catch (err) {
                console.error('Lead 등록 오류:', err);
                showToast('error', '오류 발생', '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.innerHTML = '<span>예상 한도/금리 확인하기</span> <i class="ph-bold ph-arrow-right"></i>';
            }
        });
    }

    // 6. Interactive Valuation (Daum Postcode API)
    const addressSearchBtn = document.getElementById('address-search-btn');
    if (addressSearchBtn) {
        addressSearchBtn.addEventListener('click', () => {
            new daum.Postcode({
                oncomplete: function(data) {
                    const addrInfo = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                    const fullAddr = addrInfo + (data.buildingName ? ` (${data.buildingName})` : '');
                    processAddress(fullAddr);
                }
            }).open();
        });
    }

    function processAddress(address) {
        document.getElementById('address-text').innerText = address;
        document.getElementById('address-text').style.color = 'var(--text-main)';
        document.getElementById('address-text').style.fontWeight = '600';
        
        // Show detailed address input instead of starting analysis
        const detailedGroup = document.getElementById('detailed-address-group');
        if (detailedGroup) {
            detailedGroup.style.display = 'block';
            document.getElementById('detailed-address-input').focus();
        }
    }

    // Attach listener to Start Simulation button
    const startSimBtn = document.getElementById('start-simulation-btn');
    if (startSimBtn) {
        startSimBtn.addEventListener('click', () => {
            const detailInput = document.getElementById('detailed-address-input').value.trim();
            if (detailInput) {
                const currentAddr = document.getElementById('address-text').innerText;
                document.getElementById('address-text').innerText = currentAddr + ' ' + detailInput;
            }
            startValuationAnalysis();
        });
    }

    function startValuationAnalysis() {
        const loadingOverlay = document.getElementById('valuation-loading');
        const resultOverlay = document.getElementById('valuation-result-overlay');
        const barGov = document.getElementById('bar-gov');
        const barAi = document.getElementById('bar-ai');
        const barLimit = document.getElementById('bar-limit');
        
        // Reset state
        resultOverlay.style.display = 'none';
        loadingOverlay.style.display = 'flex';
        barGov.style.width = '0%';
        barAi.style.width = '0%';
        barLimit.style.width = '0%';
        barLimit.parentElement.classList.remove('filled');
        
        // Animate loading text
        const loadingText = document.getElementById('loading-text');
        
        // Stage 1: Load Gov Price
        setTimeout(() => {
            loadingText.innerText = '국토부 실거래가 연동 중...';
            barGov.style.width = '85%';
        }, 500);
        
        // Stage 2: Load AI estimation
        setTimeout(() => {
            loadingText.innerText = 'AI 적정 시세 산출 중...';
            barAi.style.width = '75%';
        }, 1500);
        
        // Stage 3: Load Expected Limit
        setTimeout(() => {
            loadingText.innerText = '최대 가능 한도 계산 중...';
            barLimit.style.width = '90%';
            barLimit.parentElement.classList.add('filled');
        }, 2500);
        
        // Stage 4: Finish and show result overlay (Lead Capture)
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            
            // Hide previous contents perfectly so the form neatly takes the space
            document.getElementById('address-input-container').style.display = 'none';
            document.querySelector('.mock-chart-container').style.display = 'none';
            const footerText = document.getElementById('valuation-footer-text');
            if (footerText) footerText.style.display = 'none';
            
            document.getElementById('valuation-title').innerText = '가치 평가 분석 결과';
            
            resultOverlay.style.display = 'flex';
            resultOverlay.style.animation = 'fadeIn 0.4s ease-out forwards';
        }, 3600);
    }
    
    // 7. Handle Mini Form Submission
    const miniSubmitBtn = document.getElementById('mini-submit-btn');
    if (miniSubmitBtn) {
        miniSubmitBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('mini-name').value.trim();
            const phoneInput = document.getElementById('mini-phone').value.trim();
            const privacyCheck = document.getElementById('mini-privacy').checked;
            
            if (!nameInput || !phoneInput || phoneInput === '010-') {
                showToast('warning', '입력 필요', '이름과 연락처를 모두 입력해주세요.');
                return;
            }
            if (!privacyCheck) {
                showToast('warning', '동의 필요', '개인정보 수집 및 이용에 동의해주세요.');
                return;
            }
            
            miniSubmitBtn.disabled = true;
            miniSubmitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> 전송 중...';

            // Get address from simulation if available
            const addressEl = document.getElementById('address-text');
            const address = addressEl ? addressEl.innerText : '';
            const isDefaultAddr = address === '주소 또는 아파트명 검색하기';

            try {
                await submitLeadToSupabase({
                    name: nameInput,
                    phone: stripPhone(phoneInput),
                    source: '다솔랜딩',
                    status: '신규',
                    memo: !isDefaultAddr && address ? `시뮬레이션 주소: ${address}` : null,
                    form_variant: 'hero_mini',
                    device_type: getDeviceType(),
                    landing_url: window.location.href,
                    referrer: document.referrer || null,
                    created_at: getKSTISOString()
                });

                // n8n 웹훅으로 텔레그램 알림 전송
                sendWebhookNotification({
                    name: nameInput,
                    phone: phoneInput,
                    source: '다솔(병수랜딩)',
                    status: 'New',
                    inquiry_form: !isDefaultAddr && address ? `시뮬 주소: ${address}` : '',
                    sort: '시뮬레이션',
                    created_at: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(' ', 'T') + '+09:00'
                });

                document.getElementById('mini-form-container').style.display = 'none';
                const title = document.querySelector('#valuation-result-overlay h4');
                const p = document.querySelector('#valuation-result-overlay p:first-of-type');
                if(title) title.style.display = 'none';
                if(p) p.style.display = 'none';
                
                const successState = document.getElementById('mini-success-state');
                successState.style.display = 'flex';
                successState.style.animation = 'fadeIn 0.5s ease-out forwards';
            } catch (err) {
                console.error('Lead 등록 오류:', err);
                showToast('error', '오류 발생', '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                miniSubmitBtn.disabled = false;
                miniSubmitBtn.innerHTML = '결과 톡/문자로 받기';
            }
        });
    }

    // 8. Sticky Bottom Bar submission
    const stickyBar = document.getElementById('sticky-bottom-bar');
    if (stickyBar) {
        const stickyForm = document.getElementById('sticky-loan-form');
        if (stickyForm) {
            stickyForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const privacyCheck = document.getElementById('s-privacy').checked;
                if (!privacyCheck) {
                    showToast('warning', '동의 필요', '개인정보 수집 및 이용에 동의해주세요.');
                    return;
                }
                
                const btn = stickyForm.querySelector('.s-submit-btn');
                const originalHtml = btn.innerHTML;
                const sName = document.getElementById('s-name').value.trim();
                const sPhone = stripPhone(document.getElementById('s-phone').value.trim());
                const sProperty = document.getElementById('s-property').value || '';

                if (!sName || !sPhone || sPhone === '010') {
                    showToast('warning', '입력 필요', '이름과 연락처를 입력해주세요.');
                    return;
                }
                
                btn.disabled = true;
                btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> 접수 중...';
                
                try {
                    await submitLeadToSupabase({
                        name: sName,
                        phone: sPhone,
                        source: '다솔랜딩',
                        status: '신규',
                        home: sProperty || null,
                        memo: sProperty ? `담보: ${sProperty}` : null,
                        form_variant: 'sticky_bar',
                        device_type: getDeviceType(),
                        landing_url: window.location.href,
                        referrer: document.referrer || null,
                        created_at: getKSTISOString()
                    });

                    // n8n 웹훅으로 텔레그램 알림 전송
                    const sPhoneFormatted = document.getElementById('s-phone').value.trim();
                    sendWebhookNotification({
                        name: sName,
                        phone: sPhoneFormatted,
                        source: '다솔(병수랜딩)',
                        status: 'New',
                        inquiry_form: sProperty ? `담보: ${sProperty}` : '',
                        sort: sProperty || '',
                        created_at: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(' ', 'T') + '+09:00'
                    });

                    showToast('success', '신청 완료', '전문 상담원이 곧 연락드리겠습니다.');
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                    stickyForm.reset();
                    document.getElementById('s-phone').value = '010-';
                } catch (err) {
                    console.error('Lead 등록 오류:', err);
                    showToast('error', '오류 발생', '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                }
            });
        }
    }

    // 9. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if(btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all others
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 10. Number Counter Animation for Trust Banner
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // The lower the slower
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +(counter.innerText.replace(/,/g, ''));
                    const inc = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc).toLocaleString();
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 11. Promotional Trust Modal Logic
    const promoModal = document.getElementById('promo-modal');
    const btnPromoCloseBtn = document.getElementById('promo-close-btn');
    const btnPromo24h = document.getElementById('promo-close-24h');
    const btnPromoNow = document.getElementById('promo-close-now');

    function showPromo() {
        const hidePromoUntil = localStorage.getItem('hidePromoUntil');
        if (hidePromoUntil) {
            const now = new Date().getTime();
            if (now < parseInt(hidePromoUntil)) {
                return; // Suppress showing if within 24 hours
            }
        }
        
        if (promoModal) {
            promoModal.classList.add('show');
        }
    }

    function closePromo() {
        if (promoModal) {
            promoModal.classList.remove('show');
        }
    }

    if (promoModal) {
        // Show after 2.5 seconds
        setTimeout(showPromo, 2500);

        // Close actions
        if (btnPromoCloseBtn) btnPromoCloseBtn.addEventListener('click', closePromo);
        if (btnPromoNow) btnPromoNow.addEventListener('click', closePromo);

        if (btnPromo24h) {
            btnPromo24h.addEventListener('click', () => {
                // Set expiry to 24 hours from now
                const expires = new Date().getTime() + 24 * 60 * 60 * 1000;
                localStorage.setItem('hidePromoUntil', expires.toString());
                closePromo();
            });
        }
    }
});
