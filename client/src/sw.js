if ('workbox' in self) {
	workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
}

self.addEventListener('push', event => {
	const message = JSON.parse(event.data.text())
	const { title } = message
	const { url } = message
	const options = {
		body: message.body,
		icon: message.icon,
		badge: message.badge,
		data: url
	}
	event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
	event.notification.close()
	event.waitUntil(clients.openWindow(event.notification.data))
})