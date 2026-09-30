async (page) => {
  const count = await page.evaluate(() => {
    return window.CatalogProvider ? window.CatalogProvider.getAll().length : 0;
  });
  return { status: 'success', count };
}
