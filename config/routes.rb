Rails.application.routes.draw do
  root to: 'rooms#show'
  get 'rooms/show'

  mount ActionCable.server => '/cable'
end
