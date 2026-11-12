// ---------- flyToTarget ----------
// Animates an emoji flying from one element to another (e.g. from a card's ♥ to the
// Favorites tab), so the user sees where the favorite went.
// It's a one-off visual effect, so it's created directly in the DOM instead of React state.
// Resolves when the animation ends, so the caller can chain the next effect.
export function flyToTarget(from: Element, to: Element, emoji = '❤️'): Promise<void> {
  // Respect users who asked their OS for less motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

  // Centers of both elements, in viewport coordinates
  const start = from.getBoundingClientRect();
  const end = to.getBoundingClientRect();
  const startX = start.left + start.width / 2;
  const startY = start.top + start.height / 2;
  const dx = end.left + end.width / 2 - startX;
  const dy = end.top + end.height / 2 - startY;

  // Temporary element, positioned (fixed) on top of everything at the start point
  const el = document.createElement('span');
  el.className = 'fly-heart';
  el.textContent = emoji;
  el.setAttribute('aria-hidden', 'true');
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  document.body.append(el);

  // Web Animations API: grows and lifts a bit first (an arc), then shrinks into the target
  const animation = el.animate(
    [
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      {
        transform: `translate(calc(-50% + ${dx * 0.4}px), calc(-50% + ${dy * 0.4 - 60}px)) scale(1.5)`,
        opacity: 1,
        offset: 0.4,
      },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.4)`, opacity: 0.7 },
    ],
    { duration: 750, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' }
  );

  // Remove the element whether the animation finishes or gets cancelled
  return animation.finished.then(
    () => el.remove(),
    () => el.remove()
  );
}
