import { test, expect } from '@playwright/test';

// Ajusta la ruta según tu estructura de rutas en Astro
const url = 'http://localhost:3000';

test.describe('Componente Proyectos', () => {
  test('debe mostrar las tarjetas del carrusel', async ({ page }) => {
    await page.goto(url);
    const slider = page.locator('#slider');
    await expect(slider).toBeVisible();
    const cards = slider.locator('article[data-card]');
    await expect(cards).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      await expect(card).toBeVisible();
      await expect(card.locator('[data-card-carousel]')).toBeVisible();
    }
  });
});
