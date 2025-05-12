self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'simulate-push') {
    const data = event.data.payload;
    self.registration.showNotification(data.title, {
      body: data.body,
    });
  }
});