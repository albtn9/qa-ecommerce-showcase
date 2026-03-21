import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import { useState } from "react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<"cartao" | "pix" | "">("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });
  const [card, setCard] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const processOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setLoading(true);

    try {
      await createOrder({
        userId: user.id,
        products: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        total,
        createdAt: new Date().toISOString(),
      });

      clearCart();
      alert("✅ Pedido realizado com sucesso!");
      navigate("/products");
    } catch {
      alert("Erro ao confirmar pedido. Verifique se a API está ativa.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!payment) return alert("Selecione um meio de pagamento");
    if (!items.length) return alert("Seu carrinho está vazio");
    if (
      payment === "cartao" &&
      (!card.number || !card.holder || !card.expiry || !card.cvv)
    ) {
      return alert("Preencha os dados do cartão");
    }
    await processOrder();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Processando seu pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">QA Ecommerce</h1>
        <button
          data-testid="btn-back-cart"
          onClick={() => navigate("/cart")}
          className="text-blue-600 hover:underline"
        >
          ← Voltar ao carrinho
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Finalizar Compra
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Dados de entrega</h3>
            <input
              data-testid="input-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nome completo"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              data-testid="input-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Endereço"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              data-testid="input-city"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Cidade"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              data-testid="input-zip"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              required
              placeholder="CEP"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Meio de pagamento
            </h3>
            <div className="flex gap-4">
              <button
                type="button"
                data-testid="btn-payment-cartao"
                onClick={() => setPayment("cartao")}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                  payment === "cartao"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                Cartão
              </button>
              <button
                type="button"
                data-testid="btn-payment-pix"
                onClick={() => setPayment("pix")}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                  payment === "pix"
                    ? "border-green-600 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-600 hover:border-green-300"
                }`}
              >
                Pix
              </button>
            </div>

            {payment === "cartao" && (
              <div className="mt-4 space-y-3">
                <input
                  data-testid="input-card-number"
                  name="number"
                  value={card.number}
                  onChange={handleCardChange}
                  placeholder="Número do cartão"
                  maxLength={19}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  data-testid="input-card-holder"
                  name="holder"
                  value={card.holder}
                  onChange={handleCardChange}
                  placeholder="Nome no cartão"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <input
                    data-testid="input-card-expiry"
                    name="expiry"
                    value={card.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    data-testid="input-card-cvv"
                    name="cvv"
                    value={card.cvv}
                    onChange={handleCardChange}
                    placeholder="CVV"
                    maxLength={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {payment === "pix" && (
              <p className="text-xs text-gray-400 mt-2">
                ⚡ Pix selecionado — pagamento instantâneo
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Resumo do pedido
            </h3>
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex justify-between text-sm text-gray-600 mb-2"
              >
                <span data-testid="order-item-name">
                  {product.name} x{quantity}
                </span>
                <span>R$ {(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-bold">
              <span>Total</span>
              <span data-testid="order-total" className="text-blue-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            data-testid="btn-confirm-order"
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 disabled:bg-green-300 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
          >
            {loading ? "Confirmando..." : "Confirmar Pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
