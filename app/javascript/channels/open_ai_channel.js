import consumer from "channels/consumer"

const conversationList = document.getElementById("conversation2");
const button_post = document.getElementById('button_post');
const formText = document.getElementById("user_input");
let aiMessageContainer;

if (conversationList) {
  const appRoom = consumer.subscriptions.create("OpenAiChannel", {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("OpenAiChannelに接続しました");
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      console.log("OpenAiChannelから切断されました");
    },

    received(data) {
      // chunkごとに何が返ってきているのか確認できる
      console.log(data.chunk);

      if (!data.message) {
        return;
      }

      // 初回時のみ、AIの吹き出しを作成
      if (!document.getElementById(`message-${data.message_id}`)) {
        const responseHTML = this.createAiMessage(data)
        conversationList.insertAdjacentHTML("beforeend", responseHTML);
        conversationList.scrollTop = conversationList.scrollHeight;
        
        // テキストを挿入する要素を取得
        aiMessageContainer = document.getElementById(`ai_message_text-${data.message_id}`);
      }
  
      // AIのメッセージを吹き出しの末尾に追加し続ける
      aiMessageContainer.textContent += data.message;
      conversationList.scrollTop = conversationList.scrollHeight;
    },

    createAiMessage(data) {
      return `
        <div id="message-${data.message_id}" class="text-left flex items-start space-x-2">
          <div class="icon-container w-8 h-8 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-full h-full">
              <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/>
            </svg>
          </div>
          <div id="ai_message_text-${data.message_id}" class="chat-bubble inline-block bg-gray-100 px-4 py-2 rounded-lg max-w-3/4 break-words"></div>
        </div>
      `
    },

    createUserMessage(data) {
      return `
        <div class="text-right flex items-end justify-end space-x-2">
          <div class="chat-bubble inline-block bg-blue-100 px-4 py-2 rounded-lg max-w-3/4 break-words">
            <span>${data}</span>
          </div>
          <div class="icon-container w-8 h-8 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-full h-full"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
          </div>
        </div>
      `
    },
  });
  
  // 送信されたときの処理
  button_post.addEventListener('click', function(event) {
    event.preventDefault();

    // 入力が空白なら処理を終了
    if (formText.value.trim() === "") {
      return;
    }

    // ユーザの入力をチャット欄に反映
    const inputHTML = appRoom.createUserMessage(formText.value);
    conversationList.insertAdjacentHTML("beforeend", inputHTML);

    // ユーザーの入力をサーバに送信
    appRoom.perform("chat_gpt", { message: user_input.value });

    // フォームから入力を削除
    formText.value = "";
  });
}
