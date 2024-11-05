class OpenaiController < ApplicationController
  def show
  end

  def chat_gpt
    user_input = params[:user_input]

    if user_input.present?
      client = OpenAI::Client.new
      response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: user_input }
          ]
        }
      )

      render json:{text: response.dig("choices", 0, "message", "content")}
    end
  end
end
