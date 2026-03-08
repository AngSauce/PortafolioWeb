export function enableHorizontalScroll() {
  const container = document.getElementById("projects");

  if (!container) return;

  container.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      container.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
}