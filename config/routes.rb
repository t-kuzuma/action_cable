Rails.application.routes.draw do
  root to: 'rooms#show'

  get 'openai', to: 'openai#chat_gpt'
  get 'openai/show', to: 'openai#show'

  mount ActionCable.server => '/cable'
end
