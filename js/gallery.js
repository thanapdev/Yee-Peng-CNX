/* =====================================================
   YI PENG FESTIVAL — GALLERY SPECIFIC LOGIC
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Global Scripts (if needed)
  window.initGallery?.();
  window.initReveal?.();

  // Cinematic Lightbox Logic
  const modal = document.getElementById('gal-modal');
  const modalImg = document.getElementById('modal-img');
  const modalWrap = document.getElementById('modal-img-wrap');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTitleArea = document.getElementById('modal-title-area');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');
  const galCards = Array.from(document.querySelectorAll('.gal-card'));
  let currentIndex = 0;
  let isZoomed = false;

  if (modal && galCards.length > 0) {
    function updateModalContent(index) {
      const card = galCards[index];
      const img = card.querySelector('img');
      const title = card.querySelector('h3').textContent;
      const desc = card.querySelector('p').textContent;

      modalImg.src = img.src;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      currentIndex = index;

      // Reset zoom state
      modalImg.style.maxWidth = '90vw';
      modalImg.style.maxHeight = '80vh';
      modalImg.style.cursor = 'zoom-in';
      modalWrap.style.transform = 'scale(1)';
      isZoomed = false;
    }

    function openModal(index) {
      updateModalContent(index);
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => { 
        modal.style.opacity = '1'; 
        modalWrap.style.transform = 'scale(1)';
        modalTitleArea.style.opacity = '1';
        modalTitleArea.style.transform = 'translateX(0)';
      }, 50);
    }

    function closeModal() {
      modal.style.opacity = '0';
      modalWrap.style.transform = 'scale(0.9)';
      modalTitleArea.style.opacity = '0';
      modalTitleArea.style.transform = 'translateX(-20px)';
      setTimeout(() => { modal.style.display = 'none'; }, 400);
      document.body.style.overflow = 'auto';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galCards.length;
      updateModalContent(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galCards.length) % galCards.length;
      updateModalContent(currentIndex);
    }

    // Add click listeners to cards
    galCards.forEach((card, index) => {
      card.style.cursor = 'zoom-in';
      card.addEventListener('click', () => openModal(index));
    });

    // Carousel items (Slideshow) can also open modal
    const carouselImgs = document.querySelectorAll('.gal-carousel-item img');
    carouselImgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        // Since slideshow images aren't in the main cards array for prev/next, 
        // we just open them as standalone if needed, or we could find a matching card.
        // For now, let's just show the image.
        modalImg.src = img.src;
        modalTitle.textContent = "FEATURED MOMENT";
        modalDesc.textContent = "Yee Peng Festival Highlight";
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
      });
    });

    // Next/Prev Events
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    
    // Zoom Toggle
    modalImg?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isZoomed) {
        modalImg.style.maxWidth = 'none';
        modalImg.style.maxHeight = 'none';
        modalImg.style.cursor = 'zoom-out';
        isZoomed = true;
      } else {
        modalImg.style.maxWidth = '90vw';
        modalImg.style.maxHeight = '80vh';
        modalImg.style.cursor = 'zoom-in';
        isZoomed = false;
      }
    });

    // Close Events
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target === modalWrap) closeModal(); });
    
    // Key Support
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });

    // Hover interactions for UI
    [prevBtn, nextBtn].forEach(btn => {
      if (btn) {
        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.3';
      }
    });

    if (closeBtn) {
      closeBtn.onmouseenter = () => closeBtn.style.transform = 'rotate(90deg) scale(1.2)';
      closeBtn.onmouseleave = () => closeBtn.style.transform = 'rotate(0) scale(1)';
    }
  }
});
