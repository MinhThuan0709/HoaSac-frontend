// Global products array (will be populated from API)
let globalProducts = [];

// Đặt biến BASE_BACKEND_URL ở đây
// THAY THẾ 'https://your-hoasac-api.onrender.com' BẰNG URL THỰC TẾ CỦA BACKEND CỦA BẠN TỪ RENDER.COM
const BASE_BACKEND_URL = 'https://hoasac.onrender.com'; 

const MAX_SAKURA = 20;
const MAX_COINS = 10;
const SCROLL_AMOUNT = 300;
const AUTO_SCROLL_INTERVAL = 3000;
const SEARCH_HISTORY_KEY = 'userWebsiteSearchHistory';
const MAX_SEARCH_HISTORY = 7;

function getSearchHistory() {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

function addToSearchHistory(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return;
    let history = getSearchHistory();
    history = history.filter(item => item.toLowerCase() !== searchTerm.toLowerCase());
    history.unshift(searchTerm);
    if (history.length > MAX_SEARCH_HISTORY) {
        history = history.slice(0, MAX_SEARCH_HISTORY);
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

function displaySearchHistory(container) {
    if (!container) return;
    const history = getSearchHistory();
    container.innerHTML = '';

    if (history.length === 0) {
        container.style.maxHeight = '0';
        container.style.opacity = '0';
        return;
    }

    history.forEach(term => {
        const itemLink = document.createElement('a');
        itemLink.classList.add('hot-search-item');
        itemLink.href = `/search?query=${encodeURIComponent(term)}`;
        itemLink.addEventListener('click', function(e) {
            e.preventDefault();
            const searchInputField = document.querySelector('.search-input-field');
            if (searchInputField) {
                searchInputField.value = term;
            }
            window.location.href = this.href;
        });
        itemLink.innerHTML = `
            <i class="fas fa-history hot-search-icon"></i>
            <span class="hot-search-text">${term}</span>
        `;
        container.appendChild(itemLink);
    });
    if (document.querySelector('.navbar').classList.contains('search-active') &&
        document.querySelector('.search-input-field') === document.activeElement) {
        container.style.maxHeight = '300px';
        container.style.opacity = '1';
    }
}

function initializeThemeToggle() {
  const modeToggleButtons = document.querySelectorAll('#mode-toggle');
  const body = document.body;

  modeToggleButtons.forEach(modeToggle => {
    if (!modeToggle) return;
    const icon = modeToggle.querySelector('i');
    if (!icon) return;

    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    modeToggle.addEventListener('click', () => {
      icon.classList.add('fade-out');
      setTimeout(() => {
        body.classList.toggle('dark-mode');
        document.querySelectorAll('#mode-toggle i').forEach(i => {
            i.classList.remove('fade-out', 'fa-sun', 'fa-moon');
            i.classList.add(body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon', 'fade-in');
            setTimeout(() => i.classList.remove('fade-in'), 500);
        });
      }, 300);
    });
  });

  const seasonIcons = document.querySelectorAll('.season-icons i');
  if (seasonIcons.length > 0) {
    seasonIcons.forEach(icon => {
        icon.addEventListener('click', () => {
        body.classList.remove('theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter');
        const season = icon.classList[0];
        if (season) body.classList.add(`theme-${season}`);
        });
    });
  }
}

function initializeNavbarScroll() {
  const navbar = document.querySelector('body > header > .navbar');
  if (!navbar) return;
  let lastScrollTop = 0;
  const delta = 5;
  const navbarHeight = navbar.offsetHeight;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - currentScroll) <= delta) return;
    if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
      navbar.classList.add('hide');
    } else {
      if (currentScroll + window.innerHeight < document.documentElement.scrollHeight) {
        navbar.classList.remove('hide');
      }
    }
    lastScrollTop = Math.max(0, currentScroll);
  }, false);
}

function initializePopup() {
  const popup = document.getElementById('popup-ad');
  const popupCloseBtn = document.getElementById('popup-close');
  if (!popup || !popupCloseBtn) return;

  popup.classList.add('active');
  const sakuraInterval = startSakuraEffect();
  const coinElements = startCoinEffect();

  const closePopup = () => {
    popup.classList.add('hide');
    if (sakuraInterval) clearInterval(sakuraInterval);
    stopCoinEffect(coinElements);
  };

  popupCloseBtn.addEventListener('click', closePopup);
  if (popup.classList.contains('active')) {
    setTimeout(closePopup, 10000);
  }
}

function startSakuraEffect() {
  const container = document.getElementById('sakura-container');
  if (!container) return null;
  const img = new Image(); img.src = 'images/sakura.png'; let imageLoaded = false;
  img.onload = () => { imageLoaded = true; };
  return setInterval(() => {
    if (container.children.length >= MAX_SAKURA) return;
    const sakura = document.createElement('div'); sakura.classList.add('sakura');
    sakura.style.left = `${Math.random() * 100}vw`;
    sakura.style.animationDuration = `${Math.random() * 3 + 3}s`;
    if (!imageLoaded) { sakura.style.backgroundColor = '#ffb6c1'; sakura.style.borderRadius = '50%'; sakura.style.width = '24px'; sakura.style.height = '24px'; }
    container.appendChild(sakura);
    setTimeout(() => { if (sakura.parentNode === container) container.removeChild(sakura); }, parseFloat(sakura.style.animationDuration) * 1000 + 1000);
  }, 300);
}

function startCoinEffect() {
  const container = document.getElementById('coin-container');
  if (!container) return [];
  const img = new Image(); img.src = 'images/coin.gif'; let imageLoaded = false;
  img.onload = () => { imageLoaded = true; };
  const coins = [];
  for (let i = 0; i < MAX_COINS; i++) {
    const coin = document.createElement('div'); coin.classList.add('coin');
    coin.style.left = `${Math.random() * 90}vw`; coin.style.top = `${Math.random() * 70 + 10}vh`;
    if (!imageLoaded) { coin.style.backgroundColor = '#ffd700'; coin.style.borderRadius = '50%'; coin.style.width = '24px'; coin.style.height = '24px'; }
    container.appendChild(coin); coins.push(coin);
  }
  return coins;
}

function stopCoinEffect(coins) {
  coins.forEach(coin => { if (coin.parentNode) coin.parentNode.removeChild(coin); });
}

function updateAnalogClock() {
  const secondHand = document.getElementById('second-hand');
  const minuteHand = document.getElementById('minute-hand');
  const hourHand = document.getElementById('hour-hand');
  const dateDisplay = document.getElementById('date-display');
  if (!secondHand || !minuteHand || !hourHand || !dateDisplay) return;
  const now = new Date();
  const secondsDeg = (now.getSeconds() / 60) * 360 + 90;
  const minutesDeg = (now.getMinutes() / 60) * 360 + (now.getSeconds() / 60) * 6 + 90;
  const hoursDeg = ((now.getHours() % 12) / 12) * 360 + (now.getMinutes() / 60) * 30 + 90;
  secondHand.style.transform = `rotate(${secondsDeg}deg)`;
  minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
  hourHand.style.transform = `rotate(${hoursDeg}deg)`;
  dateDisplay.textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function initializeProductScroll() {
  const container = document.getElementById('product-container');
  const btnLeft = document.getElementById('scroll-left');
  const btnRight = document.getElementById('scroll-right');
  if (!container || !btnLeft || !btnRight) return;
  let autoScrollInterval;
  const startAutoScroll = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else { container.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' }); }
    }, AUTO_SCROLL_INTERVAL);
  };
  const stopAutoScroll = () => { clearInterval(autoScrollInterval); };
  btnLeft.addEventListener('click', () => { stopAutoScroll(); container.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' }); });
  btnRight.addEventListener('click', () => { stopAutoScroll(); container.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' }); });
  container.addEventListener('mouseenter', stopAutoScroll);
  container.addEventListener('mouseleave', startAutoScroll);
  const checkScrollButtons = () => {
    if (!container.parentElement) return;
    btnLeft.style.display = container.scrollLeft > 0 ? 'block' : 'none';
    btnRight.style.display = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5) ? 'block' : 'none';
  };
  container.addEventListener('scroll', checkScrollButtons);
  window.addEventListener('resize', checkScrollButtons);
  checkScrollButtons(); startAutoScroll();
}

function initializeBannerEffect() {
  document.querySelectorAll('.banner').forEach(banner => {
    const btn = banner.querySelector('.btn-detail');
    if (!btn) return;
    btn.addEventListener('mouseenter', () => banner.classList.add('hovered'));
    btn.addEventListener('mouseleave', () => banner.classList.remove('hovered'));
  });
}

function initializeFullscreenBanner() {
    const bannerContainer = document.getElementById('fullscreen-banner');
    if (!bannerContainer) return;
    const slides = bannerContainer.querySelectorAll('.banner-slide');
    if (slides.length <= 1) {
        if (slides.length === 1 && !slides[0].classList.contains('active')) {
             slides[0].classList.add('active');
        }
        return;
    }
    let currentSlideIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) currentSlideIndex = index;
        else slide.classList.remove('active');
    });
    if (!slides[currentSlideIndex].classList.contains('active')) {
        slides[0].classList.add('active');
        currentSlideIndex = 0;
    }
    const intervalTime = 3000;
    function nextSlide() {
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }
    setInterval(nextSlide, intervalTime);
}

function initializeInteractiveSearch() {
    const navbar = document.querySelector('body > header > .navbar');
    const searchInteractionArea = navbar ? navbar.querySelector('.search-interaction-area') : null;
    const expandableSearchContent = document.getElementById('expandable-search-content');
    const searchInputField = expandableSearchContent ? expandableSearchContent.querySelector('.search-input-field') : null;
    const hotSearchesContainer = expandableSearchContent ? expandableSearchContent.querySelector('.hot-searches-container') : null;
    const searchSubmitButton = expandableSearchContent ? expandableSearchContent.querySelector('.search-submit-btn-original') : null;

    if (!navbar || !searchInteractionArea || !expandableSearchContent || !searchInputField || !hotSearchesContainer) return;

    let mouseLeaveTimeout;
    const activateSearch = () => {
        clearTimeout(mouseLeaveTimeout);
        navbar.classList.add('search-active');
        if (searchInputField) {
            setTimeout(() => searchInputField.focus(), 500);
        }
    };
    const deactivateSearch = (forceClose = false) => {
        mouseLeaveTimeout = setTimeout(() => {
            const isSearchInputFocused = document.activeElement === searchInputField;
            if (forceClose || (!searchInteractionArea.matches(':hover') && !isSearchInputFocused)) {
                navbar.classList.remove('search-active');
            }
        }, forceClose ? 0 : 300);
    };

    searchInteractionArea.addEventListener('mouseenter', activateSearch);
    searchInteractionArea.addEventListener('mouseleave', deactivateSearch);
    searchInputField.addEventListener('focus', () => {
        clearTimeout(mouseLeaveTimeout);
        navbar.classList.add('search-active');
        displaySearchHistory(hotSearchesContainer);
    });
    searchInputField.addEventListener('blur', () => {
        setTimeout(() => {
            if (!hotSearchesContainer.matches(':hover') && document.activeElement !== searchInputField) {
                 deactivateSearch(true);
            }
        }, 200);
    });
    hotSearchesContainer.addEventListener('mouseenter', () => clearTimeout(mouseLeaveTimeout));
    hotSearchesContainer.addEventListener('mouseleave', () => { if (document.activeElement !== searchInputField) deactivateSearch(); });

    document.addEventListener('click', function(event) {
        if (navbar.classList.contains('search-active') && !navbar.contains(event.target) && !searchInteractionArea.contains(event.target)) {
            navbar.classList.remove('search-active');
        }
    });

    const handleSearchSubmission = () => {
        if (searchInputField && searchInputField.value) {
            const searchTerm = searchInputField.value.trim();
            addToSearchHistory(searchTerm);
            alert(`Đang tìm kiếm: ${searchTerm}`);
        }
    };
    if (searchSubmitButton) searchSubmitButton.addEventListener('click', handleSearchSubmission);
    searchInputField.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); handleSearchSubmission(); }});

    const hamburgerBtn = navbar ? navbar.querySelector('.hamburger-btn') : null;
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => navbar.classList.toggle('mobile-menu-active'));
    }
}

async function populateSuggestedProducts() {
  const productListContainer = document.getElementById("product-list");
  if (!productListContainer) return;

  try {
      const response = await fetch(`${BASE_BACKEND_URL}/api/products`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      globalProducts = await response.json();

      productListContainer.innerHTML = '';

      if (globalProducts.length === 0) {
        productListContainer.innerHTML = '<p style="text-align:center; color: var(--hover-color);">Chưa có sản phẩm gợi ý nào.</p>';
        return;
      }

      globalProducts.forEach(p => {
        let finalImageUrl = p.image;
        // Cloudinary trả về URL đầy đủ, không cần ghép tiền tố
        // Chỉ dùng placeholder nếu p.image rỗng hoặc không phải URL Cloudinary hợp lệ
        if (!finalImageUrl || !finalImageUrl.startsWith('https://')) {
             finalImageUrl = 'images/product_placeholder.png';
        }

        const oldPriceHTML = p.priceOld ? `<span class="old">${p.priceOld}</span>` : "";
        const badgeHTML = p.badge ? `<div class="badge ${p.badgeColor}">${p.badge}</div>` : '';
        const notesHTML = p.notes ? `<p class="product-item-notes">${p.notes}</p>` : '';

        const productHtml = `
          <div class="product-item">
            ${badgeHTML}
            <img src="${finalImageUrl}" alt="${p.name}" style="max-height: 180px; object-fit: cover;" />
            <h3>${p.name}</h3>
            <p class="price">
              <span class="new">${p.priceNew}</span>
              ${oldPriceHTML}
            </p>
            ${notesHTML}
            <a href="#" class="buy-btn">Mua ngay</a>
            <button class="delete-btn" data-id="${p._id}" style=" /* CHÚ Ý: DÙNG p._id từ MongoDB */
                background-color: #dc3545; /* Màu đỏ cho nút xóa */
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
                margin-top: 10px;
                margin-left: 10px; /* Khoảng cách với nút mua ngay */
                font-size: 0.9em;
                font-weight: 600;
                transition: background-color 0.2s ease, transform 0.2s ease;
            ">
                <i class="fas fa-trash-alt"></i> Xóa
            </button>
          </div>`;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = productHtml;
        const productElement = tempDiv.firstElementChild;

        const deleteButton = productElement.querySelector('.delete-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                const productIdToDelete = deleteButton.dataset.id;
                if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}"?`)) {
                    try {
                        const response = await fetch(`${BASE_BACKEND_URL}/api/products/${productIdToDelete}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(`Failed to delete product: ${errorData.message || response.statusText}`);
                        }

                        alert(`Sản phẩm "${p.name}" đã được xóa thành công.`);
                        populateSuggestedProducts();
                    } catch (error) {
                        console.error("Lỗi khi xóa sản phẩm:", error);
                        alert(`Lỗi khi xóa sản phẩm: ${error.message}`);
                    }
                }
            });
        }

        productListContainer.appendChild(productElement);
      });
  } catch (error) {
      console.error("Lỗi khi tải sản phẩm từ API:", error);
      productListContainer.innerHTML = '<p style="text-align:center; color: red;">Không thể tải sản phẩm. Vui lòng kiểm tra kết nối server.</p>';
  }
}

function initializeAddProductModal() {
    const addProductBtn = document.getElementById('floating-add-product-btn');
    const modalOverlay = document.getElementById('add-product-modal');
    const closeModalBtn = modalOverlay ? modalOverlay.querySelector('.close-modal-btn') : null;
    const addProductForm = document.getElementById('add-product-form');
    const imageDropZone = document.getElementById('product-image-dropzone');
    const imageInput = document.getElementById('product-image-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');

    if (!addProductBtn || !modalOverlay || !closeModalBtn || !addProductForm || !imageDropZone || !imageInput || !imagePreviewContainer) return;

    const openModal = () => { modalOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeModal = () => { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; resetAddProductForm(); };

    addProductBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) closeModal(); });
    modalOverlay.querySelector('.modal-content').addEventListener('click', (event) => event.stopPropagation());

    imageDropZone.addEventListener('click', () => imageInput.click());
    imageDropZone.addEventListener('dragover', (event) => { event.preventDefault(); imageDropZone.classList.add('drag-over'); });
    imageDropZone.addEventListener('dragleave', () => imageDropZone.classList.remove('drag-over'));
    imageDropZone.addEventListener('drop', (event) => {
        event.preventDefault(); imageDropZone.classList.remove('drag-over');
        if (event.dataTransfer.files.length > 0) { imageInput.files = event.dataTransfer.files; handleImageFiles(event.dataTransfer.files); }
    });
    imageInput.addEventListener('change', (event) => handleImageFiles(event.target.files));

    function handleImageFiles(files) {
        imagePreviewContainer.innerHTML = '';
        const pElement = imageDropZone.querySelector('p');
        if (pElement) pElement.style.display = files.length > 0 ? 'none' : 'block';
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => { const img = document.createElement('img'); img.src = e.target.result; imagePreviewContainer.appendChild(img); }
                reader.readAsDataURL(file);
            }
        }
    }

    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('name', addProductForm.elements['productName'].value || "Sản phẩm không tên");
        const rawPrice = parseFloat(addProductForm.elements['productPrice'].value);
        formData.append('priceNew', rawPrice ? `${rawPrice.toLocaleString('vi-VN')}đ` : "0đ");

        const customBadgeText = addProductForm.elements['product-badge-text'].value?.trim();
        const customBadgeColorInput = addProductForm.elements['product-badge-color'].value?.trim().toLowerCase();
        const salePercentage = parseFloat(addProductForm.elements['product-sale-percentage'].value);

        let finalBadgeText = "";
        let finalBadgeColorClass = "";

        if (customBadgeText) {
            finalBadgeText = customBadgeText;
            finalBadgeColorClass = customBadgeColorInput || "grey";
        } else if (salePercentage > 0) {
            finalBadgeText = `-${salePercentage}%`;
            finalBadgeColorClass = "red";
        }
        formData.append('badge', finalBadgeText);
        formData.append('badgeColor', finalBadgeColorClass);
        formData.append('notes', addProductForm.elements['productNotes'].value || "");

        if (imageInput.files.length > 0) {
            formData.append('productImage', imageInput.files[0]);
        }

        try {
            const response = await fetch(`${BASE_BACKEND_URL}/api/products`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to add product: ${errorData.message || response.statusText}`);
            }

            const addedProduct = await response.json();
            console.log("Sản phẩm mới đã được thêm thành công:", addedProduct);
            alert(`Đã thêm: ${addedProduct.name} (ID: ${addedProduct._id})`);

            populateSuggestedProducts();
            closeModal();
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert(`Lỗi khi thêm sản phẩm: ${error.message}`);
        }
    });

    function resetAddProductForm() {
        addProductForm.reset();
        imagePreviewContainer.innerHTML = '';
        const pElement = imageDropZone.querySelector('p');
        if (pElement) pElement.style.display = 'block';
    }
}

function initializeProductImageSwitcher() {
  const thumbnails = document.querySelectorAll('.left-thumbnails img');
  const mainImage = document.getElementById('main-image');
  if (!mainImage || thumbnails.length === 0) return;
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active-thumb'));
      thumb.classList.add('active-thumb');
      const newSrc = thumb.getAttribute('data-full');
      if (newSrc) mainImage.setAttribute('src', newSrc);
    });
  });
  if (thumbnails.length > 0) thumbnails[0].classList.add('active-thumb');
}

document.addEventListener('DOMContentLoaded', () => {
  initializeThemeToggle();
  initializeNavbarScroll();
  initializePopup();
  initializeProductScroll();
  initializeBannerEffect();
  initializeFullscreenBanner();
  initializeInteractiveSearch();
  initializeAddProductModal();

  const analogClockSecondHand = document.getElementById('second-hand');
  if (analogClockSecondHand) {
    setInterval(updateAnalogClock, 1000);
    updateAnalogClock();
  }

  // Logic for product1.html
  if (document.getElementById('main-image') && document.getElementById('product-list')) {
    initializeProductImageSwitcher();
    populateSuggestedProducts();
  }
});