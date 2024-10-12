const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();

    cartModal.style.display = "flex"
})

// Fechar o modal do carrinho (parte de fora do modal)
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Fechar o modal do carrinho (botão Fechar)
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

// Função para pegar name e price do produto
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart")
    
    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        // se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    }else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between mt-2">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-1">${
                            item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })
                        }
                    </p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name  === name);

    if(index !== -1) {
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

// Endereço
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function() {
    
    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        
        // Toastify é uma biblioteca de notificação (alert)
        Toastify({
            text: "Ops, a hamburgueria está fechada no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar pedido para API do WhatsApp
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} (${item.quantity}) - Preço: R$ ${(item.quantity * item.price).toFixed(2)} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "98981881271"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

// Verificar o horário e manipular o card
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")

const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}