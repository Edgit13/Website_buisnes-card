// Show header only while initial animations run, then reveal main content.
(function () {
    // mark loading state immediately
    document.documentElement.classList.add('is-loading');

    function finishLoading() {
        if (!document.documentElement.classList.contains('is-loading')) return;
        document.documentElement.classList.remove('is-loading');
    }

    // Remove loading state after the first meaningful animation on .card finishes,
    // fallback to timeout in case animationend doesn't fire.
    document.addEventListener('DOMContentLoaded', () => {
        const card = document.querySelector('.card');
        if (card) {
            card.addEventListener('animationend', finishLoading, { once: true });
        }
        // Safety fallback: reveal after 1500ms
        setTimeout(finishLoading, 1500);
    });
})();