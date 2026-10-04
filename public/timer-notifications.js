self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const page = clients.find((client) => client.url.startsWith(self.location.origin));
    if (page) await page.focus();
    else {
      const path = event.notification.data?.url;
      let target = new URL('/tools/online-timer/', self.location.origin).href;
      try { const candidate = new URL(path, self.location.origin); if (candidate.origin === self.location.origin) target = candidate.href; } catch {}
      await self.clients.openWindow(target);
    }
  })());
});
