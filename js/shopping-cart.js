const jsonURL = "json/productos.json";
const crearProductoJson = () => {
    $.get(jsonURL, function (respuesta, estado) {
        console.log(respuesta);
        console.log(estado);
        if (estado === "success") {
            for (const parteSuperior of respuesta) {
            $(".listado-productos").append(`<div id="producto-${parteSuperior.id}" class="producto"> 
                                        <div class="imgProducto">
                                                <img src=${parteSuperior.foto} width="100px"/>
                                        </div>
                                        <div class="descripcionProducto">
                                            <h2>${parteSuperior.nombre}</h2>
                                            <p>Art. ${parteSuperior.id}</p>
                                            <p>Color: ${parteSuperior.color}</p>
                                            <p>Talle: ${parteSuperior.talle}</p>
                                        </div>
                                        <div class="qUnidades">
                                            <p class="precio">$${parteSuperior.precio}</p>
                                        </div>
                                        <div class="botonAgregar">
                                        <button id="boton-agregar-${parteSuperior.id}" class="boton">Agregar al carrito</button>
                                        </div>
                                    </div>`);
            
            $(`#boton-agregar-${parteSuperior.id}`).on('click', function () {sumarItem(parteSuperior)});

            }

            //Párrafo Descuento
            $(`#producto-1 .qUnidades`).prepend(`<p class="oferta-descuento-1">¡Solo por hoy, 20% de descuento con cualquier medio de pago!</p>
            `);

            $("#producto-1").on("mouseenter", function () {
                console.log("Evento mouseenter en Producto 1");
                $(`.oferta-descuento-1`).slideDown(2000)
                                    .css("line-height", "15px");
            });

            $("#producto-1").on("mouseleave", function () {
                console.log("Evento mouseleave en Producto 1");
                $(`.oferta-descuento-1`).slideUp(1000);
            });

            $(`#producto-3 .qUnidades`).prepend(`<p class="oferta-descuento-2">¡Solo por hoy, 20% de descuento con cualquier medio de pago!</p>
            `);

            $("#producto-3").on("mouseenter", function () {
                console.log("Evento mouseenter en Producto 1");
                $(`.oferta-descuento-2`).slideDown(2000)
                                    .css("line-height", "15px");
            });

            $("#producto-3").on("mouseleave", function () {
                console.log("Evento mouseleave en Producto 1");
                $(`.oferta-descuento-2`).slideUp(1000);
            });


        }
    });
};

const nuevoCarrito = [];

const sumarItem = (parteSuperior) => {
    if ($(`#fila-${parteSuperior.id}`).length === 0) {
        $(".filaItemTabla").prepend( `<tr id="fila-${parteSuperior.id}">
                                            <td>${parteSuperior.id}</td>
                                            <td>${parteSuperior.nombre}</td>
                                            <td>${parteSuperior.color}</td>
                                            <td id="fila-${parteSuperior.id}-cantidad">${parteSuperior.cantidad}</td>
                                            <td>${parteSuperior.precio}</td>
                                            <td><button id="boton-quitar-${parteSuperior.id}" class="boton quitar">Quitar del carrito</button></td>
                                        </tr>
                                    `)
                                    $(`#boton-quitar-${parteSuperior.id}`).on("click", function () {
                                        quitarFila(parteSuperior);});
        nuevoCarrito.push(parteSuperior);
        const cambioCantidad = parseInt($(`#fila-${parteSuperior.id}-cantidad`).html()) + 1;
        const i = nuevoCarrito.findIndex(producto => parseInt(producto.id) === parseInt(parteSuperior.id))
        nuevoCarrito[i] = { ...nuevoCarrito[i], cantidad: cambioCantidad };
        $(`#fila-${parteSuperior.id}-cantidad`).html(cambioCantidad)
    } else {
        const cambioCantidad = parseInt($(`#fila-${parteSuperior.id}-cantidad`).html()) + 1;
        const i = nuevoCarrito.findIndex(producto => parseInt(producto.id) === parseInt(parteSuperior.id))
        nuevoCarrito[i] = { ...nuevoCarrito[i], cantidad: cambioCantidad };
        $(`#fila-${parteSuperior.id}-cantidad`).html(cambioCantidad)
    }
    sumaCarrito();                             
}

const quitarFila = (parteSuperior) => {
    $(`#fila-${parteSuperior.id}`).remove();
    const eliminarDeCarrito = nuevoCarrito.findIndex(producto => parseInt(parteSuperior.id) === parseInt(producto.id));
    nuevoCarrito.splice(eliminarDeCarrito, 1);
    sumaCarrito();
};

const sumaCarrito = () => {
    let precioTotal = 0;
    let cantidadTotal = 0;
    for (const parteSuperior of nuevoCarrito) {
        precioTotal = precioTotal + (parteSuperior.precio * parteSuperior.cantidad);
        cantidadTotal = cantidadTotal + (parteSuperior.cantidad);
    }
    const cambioPrecioTotal = precioTotal;
    $(`#precio-total`).html(cambioPrecioTotal)
    const cambioCantidadTotal = cantidadTotal;
    $(`#cantidad-total`).html(cambioCantidadTotal);
    localStorage.setItem("cantidadTotal", cambioCantidadTotal);
    localStorage.setItem("precioTotal", cambioPrecioTotal);
}

// let modalContainer = $(`#modalContainer`);
$(`#botonConfirmar`).on("click", function () {
    mostrarModal();
});

const mostrarModal = () => {
    $(`#modalContainer`).css("display", "block");
    let cantidadTotal = localStorage.getItem("cantidadTotal");
    let precioTotal = localStorage.getItem("precioTotal");
    $(`#modal-cantidad`).html(`Cantidad total de productos: ${cantidadTotal}`);
    $(`#modal-precio`).html(`Monto total a abonar: ${precioTotal}`);    
};

$(`.close`).on("click", function () {
    ocultarModal();
});

const ocultarModal = () => {
    $(`#modalContainer`).css("display", "none");
};

crearProductoJson ();
