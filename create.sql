drop table commercebuddy.product;
drop table commercebuddy.coupon;
drop schema commercebuddy;
create schema commercebuddy;


create table commercebuddy.product(
    id_product integer,
    description text,
    price numeric,
    width integer,
    height integer,
    length integer,
    weight numeric
);

insert into commercebuddy.product (id_product, description, price, width, height, length, weight) values (1, 'A', 1000, 100, 30, 10, 3);
insert into commercebuddy.product (id_product, description, price, width, height, length, weight) values (2, 'B', 5000, 50, 50, 50, 22);
insert into commercebuddy.product (id_product, description, price, width, height, length, weight) values (3, 'C', 30, 10, 10, 10, 0.9);
insert into commercebuddy.product (id_product, description, price, width, height, length, weight) values (4, 'D', 30, -10, 10, 10, 0.9);


create table commercebuddy.coupon(
    code text,
    percentage numeric,
    expire_date timestamp
);

insert into commercebuddy.coupon (code, percentage, expire_date) values ('VALE20', 20, '2024-12-01T10:00:00');
insert into commercebuddy.coupon (code, percentage, expire_date) values ('VALE10', 10, '2024-01-01T10:00:00');