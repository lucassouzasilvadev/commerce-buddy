import axios from "axios"

axios.defaults.validateStatus = function() {
    return true;
}

test("não deve aceitar um pedido com cpf inválido", async function(){
    const input = {
        cpf: "429.875.898-25",
        items: []
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid cpf");

});


test("deve criar um pedido vazio com cpf válido", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: []
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(0)
});


test("deve criar um pedido com 3 produtos", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ]
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090)
});

test("deve criar um pedido vazio com 3 produtos com cupom de desconto", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE20"
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(4872);
});

test("não deve aplicar um cupom de desconto expirado", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE10"
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090);
});

test("não deve criar um pedido com quantidade negativa", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:-1}        
        ],
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid quantity");
});

test("não deve criar um pedido com item duplicado", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 1, quantity:1}             
        ],
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Duplicated item");
});

test("deve criar um pedido com 1 produto calculando o frete", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:3}
        ],
        from: "123456",
        to: "1234534"
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toBe(90);
    expect(output.total).toBe(3090);
});


test("não deve criar um pedido se o produto tiver alguma dimensao negativa", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 4, quantity:1}
        ]
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid dimension");
});


test("deve criar um pedido com 1 produto calculando o frete", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 3, quantity:1}
        ],
        from: "123456",
        to: "1234534"
    }
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toBe(10);
    expect(output.total).toBe(40);
});

