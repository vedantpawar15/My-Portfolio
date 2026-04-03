/**
 * Cricket delivery: click pitch or Space → ball trajectory → stump hit → reset.
 */
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pitchStage = document.getElementById('pitchStage');
    const pitchHitArea = document.getElementById('pitchHitArea');
    const wicketsScene = document.getElementById('wicketsScene');
    const cricketBall = document.getElementById('cricketBall');
    const statusLive = document.getElementById('statusLive');
    const stageHint = document.getElementById('stageHint');

    if (!pitchStage || !pitchHitArea || !wicketsScene || !cricketBall) return;

    let bowling = false;
    let safetyTimer = null;

    function setStatus(text) {
        if (statusLive) statusLive.textContent = text || '';
    }

    function finishSequence() {
        if (safetyTimer) {
            clearTimeout(safetyTimer);
            safetyTimer = null;
        }
        cricketBall.classList.remove('is-delivering', 'is-delivering-reduced');
        wicketsScene.classList.remove('is-hit');
        pitchStage.classList.remove('is-bowling');
        void cricketBall.offsetWidth;
        bowling = false;
        setStatus('');
        if (stageHint) stageHint.hidden = false;
    }

    function triggerHit() {
        wicketsScene.classList.add('is-hit');
        setStatus('Bowled! Stumps hit.');
    }

    function bowl() {
        if (bowling) return;
        bowling = true;
        if (stageHint) stageHint.hidden = true;
        pitchStage.classList.add('is-bowling');
        setStatus('Delivery…');

        safetyTimer = setTimeout(finishSequence, 5000);

        if (prefersReducedMotion) {
            cricketBall.classList.add('is-delivering-reduced');
            setTimeout(triggerHit, 280);
            cricketBall.addEventListener(
                'animationend',
                function onReduced(e) {
                    if (!e.animationName || !e.animationName.includes('ball-delivery-reduced')) return;
                    cricketBall.removeEventListener('animationend', onReduced);
                    setTimeout(finishSequence, 550);
                }
            );
            return;
        }

        cricketBall.classList.add('is-delivering');
        setTimeout(triggerHit, 850);
        cricketBall.addEventListener(
            'animationend',
            function onDelivery(e) {
                if (!e.animationName || !e.animationName.includes('ball-delivery')) return;
                cricketBall.removeEventListener('animationend', onDelivery);
                setTimeout(finishSequence, 780);
            }
        );
    }

    function activateBowl(e) {
        if (e) e.preventDefault();
        bowl();
    }

    pitchHitArea.addEventListener('click', activateBowl);

    pitchHitArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            activateBowl(e);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code !== 'Space' && e.key !== ' ') return;
        if (e.target.closest('a') || e.target.closest('.pitch')) return;
        e.preventDefault();
        bowl();
    });
});
