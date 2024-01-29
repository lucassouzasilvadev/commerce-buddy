drop table commercebuddy.product;
drop table commercebuddy.coupon;
drop table commercebuddy.order;
drop table commercebuddy.item;
drop schema commercebuddy;
create schema commercebuddy;


create table commercebuddy.product(
    id_product integer,
    description text,
    price numeric,
    width integer,
    height integer,
    length integer,
    weight numeric,
    currency text
);

insert into commercebuddy.product (id_product, description, price, width, height, length, weight, currency) values (1, 'A', 1000, 100, 30, 10, 3, 'BRL');
insert into commercebuddy.product (id_product, description, price, width, height, length, weight, currency) values (2, 'B', 5000, 50, 50, 50, 22, 'BRL');
insert into commercebuddy.product (id_product, description, price, width, height, length, weight, currency) values (3, 'C', 30, 10, 10, 10, 0.9, 'BRL');
insert into commercebuddy.product (id_product, description, price, width, height, length, weight, currency) values (4, 'D', 30, -10, 10, 10, 0.9, 'BRL');
insert into commercebuddy.product (id_product, description, price, width, height, length, weight, currency) values (5, 'E', 1000, 100, 30, 10, 3, 'USD');

create table commercebuddy.coupon(
    code text,
    percentage numeric,
    expire_date timestamp
);

insert into commercebuddy.coupon (code, percentage, expire_date) values ('VALE20', 20, '2024-12-01T10:00:00');
insert into commercebuddy.coupon (code, percentage, expire_date) values ('VALE10', 10, '2024-01-01T10:00:00');

create table commercebuddy.order(
    id_order text,
    code text,
    cpf  text,
    total numeric,
    freight numeric
);

create table commercebuddy.item(
    id_order text,
    id_product integer,
    price numeric,
    quantity integer
);