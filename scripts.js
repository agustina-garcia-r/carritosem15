// Inicializa el carrito
const carrito = [];
let productos = []; // Declara productos como una variable global

// Función para cargar los productos desde el archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        productos = data; // Asigna los productos a la variable global
        mostrarProductos(); // Llama a esta función para mostrar los productos en la interfaz
        return data;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
}

// Restablece la lista de productos en la interfaz
function mostrarProductos() {
    const productosDiv = document.querySelector(".productos");
    productosDiv.innerHTML = "";

    productos.forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.innerHTML = `
            <p>${producto.nombre}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Costo: $${producto.costo.toFixed(2)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (producto) {
        if (producto.cantidad > 0) {
            const productoExistente = carrito.find(p => p.id === id);

            if (productoExistente) {
                if (productoExistente.cantidad < producto.cantidad) {
                    productoExistente.cantidad++;
                    producto.cantidad--;
                } else {
                    alert("No hay suficiente stock disponible.");
                }
            } else {
                carrito.push({ ...producto, cantidad: 1 });
                producto.cantidad--;
            }

            mostrarProductos(); // Actualiza la lista de productos en la interfaz
            mostrarCarrito();
        }
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    const productoEnCarrito = carrito.find(p => p.id === id);
    if (productoEnCarrito) {
        const producto = productos.find(p => p.id === id);

        if (productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad--;
            producto.cantidad++;
        } else {
            const index = carrito.indexOf(productoEnCarrito);
            if (index !== -1) {
                carrito.splice(index, 1);
                producto.cantidad++;
            }
        }

        mostrarProductos(); // Actualiza la lista de productos en la interfaz
        mostrarCarrito();
    }
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const carritoDiv = document.querySelector(".carrito");
    carritoDiv.innerHTML = "";

    carrito.forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.innerHTML = `
            <p>${producto.nombre} (Cantidad: ${producto.cantidad})</p>
            <p>Costo: $${(producto.costo * producto.cantidad).toFixed(2)}</p>
            <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        `;
        carritoDiv.appendChild(productoDiv);
    });
}

// Función para calcular el total de la compra
function calcularTotalCompra() {
    let total = carrito.reduce((acc, producto) => acc + (producto.costo * producto.cantidad), 0);
    const metodoPago = prompt("¿Método de pago? (efectivo, crédito, débito)");

    if (metodoPago === "efectivo") {
        total *= 0.9; // Aplica un 10% de descuento
    } else if (metodoPago === "crédito") {
        total *= 1.07; // Aplica un 7% de aumento
    }

    alert(`Total de la compra: $${total.toFixed(2)}`);
}

// Inicialización de la aplicación
cargarProductos();

// Asigna la función calcularTotalCompra al botón "COMPRAR"
const comprarBtn = document.getElementById("comprarBtn");
comprarBtn.addEventListener("click", calcularTotalCompra);

