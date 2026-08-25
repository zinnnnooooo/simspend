/**
 * SimSPEND · store-category.js
 * URL의 ?c= 파라미터로 카테고리를 읽어 탭/타이틀/매장 리스트를 렌더링합니다.
 */

(function () {
  function getCategoryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('c') || '치킨';
  }

  function renderTabs(activeCategory) {
    var categories = window.SimSpendData.getCategoryList();
    var container = document.getElementById('categoryTabs');
    container.innerHTML = categories
      .map(function (c) {
        return (
          '<a href="store-category.html?c=' + encodeURIComponent(c) + '" class="sc-tab' +
          (c === activeCategory ? ' is-active' : '') + '">' + c + '</a>'
        );
      })
      .join('');
  }

  function renderStoreCard(store) {
    return (
      '<a href="store-detail.html?id=' + store.id + '" class="card sc-store-card">' +
      '<div class="sc-store-card__top">' +
      '<div class="sc-store-card__thumb">' +
      (store.badge ? '<span class="sc-store-card__badge">' + store.badge + '</span>' : '') +
      store.emoji +
      '</div>' +
      '<div class="sc-store-card__info">' +
      '<p class="sc-store-card__name">' + store.name + '</p>' +
      '<p class="sc-store-card__rating">' +
      '<svg viewBox="0 0 24 24" fill="#FFAE00"><path d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5-5.9-3.3-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.7Z"/></svg>' +
      store.rating + ' <span>(' + store.reviewCount.toLocaleString('ko-KR') + ')</span>' +
      '</p>' +
      '<p class="sc-store-card__tags">' + store.menuTags.join(' · ') + '</p>' +
      '<p class="sc-store-card__meta">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round"/></svg>' +
      store.etaLabel + ' · 배달비 <span class="is-free">' + store.deliveryFee + '</span>' +
      '</p>' +
      '</div>' +
      '</div>' +
      '<p class="sc-store-card__min-order">최소주문 ' + store.minOrder.toLocaleString('ko-KR') + '원</p>' +
      '</a>'
    );
  }

  function renderStoreList(category) {
    var stores = window.SimSpendData.getStoresByCategory(category);
    var container = document.getElementById('storeList');

    var html = stores.map(renderStoreCard).join('');

    // 프로모 배너: 두 번째 카드 뒤에 삽입 (매장이 1개뿐이면 리스트 끝에 삽입)
    var promo =
      '<div class="card sc-promo">' +
      '<p class="sc-promo__title">오늘 가장 인기 있는 ' + category + ' 맛집</p>' +
      '<p class="sc-promo__subtitle">가장 많은 사용자가 둘러본 음식점</p>' +
      '<span class="sc-promo__mascot" aria-hidden="true">🐣</span>' +
      '</div>';

    var emptyCard =
      '<div class="card sc-empty-card">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round"/></svg>' +
      '<p class="sc-empty-card__text">새로운 가게 준비 중</p>' +
      '</div>';

    if (!stores.length) {
      container.innerHTML = promo + emptyCard;
      return;
    }

    if (stores.length === 1) {
      container.innerHTML = stores.map(renderStoreCard).join('') + promo + emptyCard;
      return;
    }

    var first = renderStoreCard(stores[0]);
    var rest = stores.slice(1).map(renderStoreCard).join('');
    container.innerHTML = first + promo + rest + emptyCard;
  }

  function setupSortChips() {
    var group = document.getElementById('sortChips');
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.sc-filter-chip');
      if (!chip) return;
      Array.prototype.forEach.call(group.children, function (c) {
        c.classList.toggle('is-active', c === chip);
      });
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    var category = getCategoryFromUrl();
    document.getElementById('pageTitle').textContent = category;
    renderTabs(category);
    renderStoreList(category);
    setupSortChips();
  });
})();
