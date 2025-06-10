(function () {
    function screenshotHD(element, scale = 4, filename = 'card.png') {
        if (!element) {
            console.error('未找到元素:', element);
            return;
        }
        domtoimage.toPng(element, {
            quality: 1.0,
            width: element.clientWidth * scale,
            height: element.clientHeight * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
            }
        }).then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
            console.log(`✅ 高清截图完成(${scale}x):`, filename);
        });
    }
    function downloadCard() {
        let element = document.querySelector('.item-box');
        if (element) {
            element.style.backgroundColor = 'white';
            screenshotHD(element);
        }
    }
    // 检查是否已经加载
    if (window.domtoimage) {
        console.log('dom-to-image-more 已经加载');
        downloadCard();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/dom-to-image-more@2.8.0/dist/dom-to-image-more.min.js';
    script.onload = function () {
        downloadCard();
    };
    document.head.appendChild(script);
})();