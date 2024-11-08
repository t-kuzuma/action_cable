import consumer from "channels/consumer"

const messageForm = document.getElementById('messageForm');

if (messageForm) {
  const appRoom = consumer.subscriptions.create("RoomChannel", {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("RoomChannelに接続しました");
    },
  
    disconnected() {
      // Called when the subscription has been terminated by the server
      console.log("RoomChannelから切断されました");
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
      // return alert(data['message']);
      const messages = document.getElementById('messages');
      const html = this.createLine(data);
      messages.insertAdjacentHTML('beforeend', html);
    },

    speak: function(message) {
      return this.perform('speak', {message: message});
    },

    createLine(data) {
      return `
        <div class="message">
          <p>${data['message']}</p>
        </div>
      `
    }
  });

  document.getElementById('messageForm').onsubmit = function(event) {
    event.preventDefault();
    const inputField = document.getElementById('messageInput');
    const message = inputField.value;
    appRoom.speak(message);
    inputField.value = '';
  }
}
