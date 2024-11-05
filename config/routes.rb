Rails.application.routes.draw do
  root to: 'rooms#show'

  get 'openai', to: 'openai#chat_gpt'
  get 'openai/show', to: 'openai#show'

  get 'openai2', to: 'openai2#chat_gpt'
  get 'openai2/show', to: 'openai2#show'

  mount ActionCable.server => '/cable'
end
