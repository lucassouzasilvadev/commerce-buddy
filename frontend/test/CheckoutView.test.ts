import { mount } from "@vue/test-utils"
import CheckoutViewVue from "../src/views/CheckoutView.vue";
import Product from "../src/entities/Product";
import CheckoutGateway from "../src/gateway/CheckoutGateway";
import Order from "../src/entities/Order";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Deve testar a tela de checkout", async function(){
    const checkoutGateway: CheckoutGateway = {
        async getProducts (): Promise<Product[]> {
            return [
                new Product(1, "A", 1000),
                new Product(2, "B", 5000),
                new Product(3, "C", 30),
            ]
        },
        async checkout (order: Order): Promise<any> {
            return {
                total: 6090,
                freight: 280
            }
        }
    }
    const wrapper = mount(CheckoutViewVue, {
        global: {
            provide: {
                checkoutGateway
            }
        }
    });
    expect(wrapper.get(".title-name").text()).toBe("Checkout");
    await sleep(200);
    expect(wrapper.findAll(".product")).toHaveLength(3);
    expect(wrapper.findAll(".product-description")[0]?.text()).toBe("A");
    expect(wrapper.findAll(".product-price")[0]?.text()).toBe("1000");

    expect(wrapper.findAll(".product-description")[1]?.text()).toBe("B");
    expect(wrapper.findAll(".product-price")[1]?.text()).toBe("5000");

    expect(wrapper.findAll(".product-description")[2]?.text()).toBe("C");
    expect(wrapper.findAll(".product-price")[2]?.text()).toBe("30");
    expect(wrapper.get(".total").text()).toBe("0");
    await wrapper.findAll(".product-add")[0]?.trigger("click");
    await wrapper.findAll(".product-add")[1]?.trigger("click");
    await wrapper.findAll(".product-add")[2]?.trigger("click");
    await wrapper.findAll(".product-add")[2]?.trigger("click");
    await wrapper.findAll(".product-add")[2]?.trigger("click");
    expect(wrapper.get(".total").text()).toBe("6090");
    expect(wrapper.findAll(".order-item")).toHaveLength(3);
    expect(wrapper.findAll(".order-item")[0]?.text()).toBe("1 1");
    expect(wrapper.findAll(".order-item")[1]?.text()).toBe("2 1");
    expect(wrapper.findAll(".order-item")[2]?.text()).toBe("3 3");
    await wrapper.get(".checkout").trigger("click");
    await sleep(200);

    expect(wrapper.get(".output-total").text()).toBe("6090");
    expect(wrapper.get(".output-freight").text()).toBe("280");
});