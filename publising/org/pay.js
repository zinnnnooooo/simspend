(() => {
  const form = document.querySelector('#purchaseForm');
  const priceInput = document.querySelector('#price');
  const finalPrice = document.querySelector('#finalPrice');
  const memo = document.querySelector('#memo');
  const memoCount = document.querySelector('#memoCount');
  const toast = document.querySelector('#toast');
  const backButton = document.querySelector('#backButton');
  const colorOptions = document.querySelectorAll('.color-option');

  const onlyDigits = (value) => value.replace(/[^0-9]/g, '');
  const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR');

  function updatePrice() {
    const raw = onlyDigits(priceInput.value);
    priceInput.value = formatNumber(raw);
    finalPrice.textContent = `₩${formatNumber(raw)}`;
  }

  priceInput.addEventListener('input', updatePrice);

  memo.addEventListener('input', () => {
    memoCount.textContent = memo.value.length;
  });

  colorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      colorOptions.forEach((item) => item.classList.remove('is-selected'));
      option.classList.add('is-selected');
    });
  });

  backButton.addEventListener('click', () => {
    if (history.length > 1) history.back();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedColor = form.querySelector('input[name="color"]:checked');
    const purchase = {
      id: `virtual-${Date.now()}`,
      productName: form.productName.value.trim(),
      category: form.category.value,
      brand: form.brand.value.trim(),
      color: selectedColor ? selectedColor.value : '',
      price: Number(onlyDigits(form.price.value)),
      memo: form.memo.value.trim(),
      status: 'payment_pending',
      createdAt: new Date().toISOString()
    };

    const purchases = JSON.parse(localStorage.getItem('simspendVirtualPurchases') || '[]');
    purchases.unshift(purchase);
    localStorage.setItem('simspendVirtualPurchases', JSON.stringify(purchases));

    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 1800);
  });

  updatePrice();
})();
