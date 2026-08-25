/**
 * SimSPEND · delivery-home.js
 * 인기 가상 맛집 리스트와 절약 배달비를 렌더링합니다.
 */

(function () {
  function renderDeliveryFeeSaved() {
    var saved = window.SimSpendData.getDeliveryFeeSaved();
    document.getElementById('deliveryFeeSaved').textContent = saved.toLocaleString('ko-KR');
  }

  function renderStores() {
    var stores = window.SimSpendData.getVirtualRestaurants();
    var container = document.getElementById('storeScroll');

    container.innerHTML = stores
      .map(function (store) {
        return (
          '<a href="store-detail.html?id=' + store.id + '" class="dh-store-card">' +
          '<div class="dh-store-card__thumb">' +
          store.emoji +
          '<span class="dh-store-card__rating">' +
          '<svg viewBox="0 0 24 24" fill="#FFAE00"><path d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5-5.9-3.3-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.7Z"/></svg>' +
          store.rating +
          '</span>' +
          '</div>' +
          '<p class="dh-store-card__name">' + store.name + '</p>' +
          '<p class="dh-store-card__eta">' + store.etaLabel + '</p>' +
          '<div class="dh-store-card__price-row">' +
          '<span class="dh-store-card__price">' + store.price.toLocaleString('ko-KR') + '원</span>' +
          '<span class="dh-store-card__saving">' + store.savingLabel + '</span>' +
          '</div>' +
          '</a>'
        );
      })
      .join('');
  }

  window.addEventListener('DOMContentLoaded', function () {
    renderDeliveryFeeSaved();
    renderStores();
  });
})();
