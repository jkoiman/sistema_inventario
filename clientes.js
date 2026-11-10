"use strict";

const formularioCliente = document.querySelector("#formulario-cliente");
const listaClientes = document.querySelector("#lista-clientes");
const mensajeClientes = document.querySelector("#mensaje-clientes");
const claveAlmacenamiento = "joiman-clientes";

function obtenerClientes() {
  try {
    const clientesGuardados = JSON.parse(localStorage.getItem(claveAlmacenamiento) || "[]");
    return Array.isArray(clientesGuardados) ? clientesGuardados : [];
  } catch {
    return [];
  }
}

let clientes = obtenerClientes();

function guardarClientes() {
  localStorage.setItem(claveAlmacenamiento, JSON.stringify(clientes));
}

function mostrarClientes() {
  listaClientes.replaceChildren();

  if (clientes.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 5;
    celda.textContent = "No hay clientes registrados.";
    fila.append(celda);
    listaClientes.append(fila);
    return;
  }

  for (const cliente of clientes) {
    const fila = document.createElement("tr");

    for (const valor of [cliente.nombre, cliente.documento, cliente.telefono, cliente.correo]) {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.append(celda);
    }

    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.dataset.documento = cliente.documento;
    botonEliminar.textContent = "Eliminar";
    celdaAcciones.append(botonEliminar);
    fila.append(celdaAcciones);
    listaClientes.append(fila);
  }
}

formularioCliente.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = new FormData(formularioCliente);
  const cliente = {
    nombre: datos.get("nombre").trim(),
    documento: datos.get("documento").trim(),
    telefono: datos.get("telefono").trim(),
    correo: datos.get("correo").trim(),
  };

  if (clientes.some((existente) => existente.documento.toLowerCase() === cliente.documento.toLowerCase())) {
    mensajeClientes.textContent = "Ya existe un cliente con ese documento.";
    return;
  }

  clientes.push(cliente);

  try {
    guardarClientes();
  } catch {
    clientes.pop();
    mensajeClientes.textContent = "No se pudo guardar el cliente en este navegador.";
    return;
  }

  mostrarClientes();
  formularioCliente.reset();
  mensajeClientes.textContent = "Cliente registrado correctamente.";
});

listaClientes.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-documento]");
  if (!boton) return;

  clientes = clientes.filter((cliente) => cliente.documento !== boton.dataset.documento);

  try {
    guardarClientes();
    mostrarClientes();
    mensajeClientes.textContent = "Cliente eliminado.";
  } catch {
    clientes = obtenerClientes();
    mostrarClientes();
    mensajeClientes.textContent = "No se pudo actualizar la lista en este navegador.";
  }
});

mostrarClientes();