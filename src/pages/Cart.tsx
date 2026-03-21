import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">QA Ecommerce</h1>
        <button
          data-testid="btn-back-products"
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:underline"
        >
          ← Continuar comprando
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Carrinho</h2>

        {items.length === 0 ? (
          <p data-testid="empty-cart" className="text-gray-500 text-center py-12">
            Seu carrinho está vazio.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  data-testid="cart-item"
                  className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 data-testid="cart-item-name" className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p data-testid="cart-item-price" className="text-blue-600 font-bold">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="btn-decrease"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span data-testid="cart-item-quantity" className="w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      data-testid="btn-increase"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    data-testid="btn-remove"
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-4 mt-6 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span data-testid="cart-total" className="text-2xl font-bold text-blue-600">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <button
              data-testid="btn-checkout"
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Finalizar Compra
            </button>
          </>
        )}
      </div>
    </div>
  )
}