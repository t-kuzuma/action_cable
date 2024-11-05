class OpenAiChannel < ApplicationCable::Channel
  def subscribed
    stream_from "open_ai_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def chat_gpt(data)
    client = OpenAI::Client.new
    message_id = SecureRandom.uuid

    client.chat(
      parameters: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "" },
          { role: "user", content: data['message'] }
        ],
        stream: proc do |chunk, _bytesize|
          generated_text = chunk.dig("choices", 0, "delta", "content")
          ActionCable.server.broadcast("open_ai_channel", { message_id: message_id, message: generated_text, chunk: chunk })
        end
      }
    )
  end
end
