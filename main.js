// main.js - Professional Redesign Interactive Elements

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
            autoplay: 2500,
            animationDuration: 800,
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
        loanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const privacyAgree = document.getElementById('privacy_agree');
            if(!privacyAgree.checked) {
                alert('개인정보 수집 및 이용에 동의해주세요.');
                return;
            }

            // In a real scenario, you would send FormData via fetch/axios here.
            // const formData = new FormData(loanForm);
            // fetch('/api/submit', { method: 'POST', body: formData }) ...

            // Simulate loading and success state
            const submitBtn = loanForm.querySelector('.btn-submit');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> <span>제출 중...</span>';
            
            setTimeout(() => {
                loanForm.style.display = 'none';
                successMsg.style.display = 'block';
                
                // Add success animation
                successMsg.style.animation = 'fadeIn 0.5s ease-out forwards';
            }, 1500);
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
        miniSubmitBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('mini-name').value.trim();
            const phoneInput = document.getElementById('mini-phone').value.trim();
            const privacyCheck = document.getElementById('mini-privacy').checked;
            
            if (!nameInput || !phoneInput) {
                alert('이름과 연락처를 모두 입력해주세요.');
                return;
            }
            if (!privacyCheck) {
                alert('개인정보 수집 및 이용에 동의해주세요.');
                return;
            }
            
            // Simulate API request
            const originalText = miniSubmitBtn.innerText;
            miniSubmitBtn.disabled = true;
            miniSubmitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> 전송 중...';
            
            setTimeout(() => {
                // Hide form, show success state
                document.getElementById('mini-form-container').style.display = 'none';
                
                const title = document.querySelector('#valuation-result-overlay h4');
                const p = document.querySelector('#valuation-result-overlay p:first-of-type');
                if(title) title.style.display = 'none';
                if(p) p.style.display = 'none';
                
                const successState = document.getElementById('mini-success-state');
                successState.style.display = 'flex';
                successState.style.animation = 'fadeIn 0.5s ease-out forwards';
                
            }, 1200);
        });
    }

    // 8. Sticky Bottom Bar visibility & submission
    const stickyBar = document.getElementById('sticky-bottom-bar');
    if (stickyBar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        });

        const stickyForm = document.getElementById('sticky-loan-form');
        if (stickyForm) {
            stickyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const privacyCheck = document.getElementById('s-privacy').checked;
                if (!privacyCheck) {
                    alert('개인정보 수집 및 이용에 동의해주세요.');
                    return;
                }
                
                const btn = stickyForm.querySelector('.s-submit-btn');
                const originalHtml = btn.innerHTML;
                
                btn.disabled = true;
                btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> 접수 중...';
                
                setTimeout(() => {
                    alert('신청이 완료되었습니다. 전문 상담원이 곧 연락드리겠습니다.');
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                    stickyForm.reset();
                }, 1200);
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
