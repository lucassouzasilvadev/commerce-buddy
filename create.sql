drop table commercebuddy.product;
drop table commercebuddy.coupon;
drop schema commercebuddy;
create schema commercebuddy;


create table commercebuddy.product(
    id_product integer,
    description text,
    price numeric
);

insert into commercebuddy.product (id_product, description, price) values (2, 'B', 5000);
insert into commercebuddy.product (id_product, description, price) values (1, 'A', 1000);
insert into commercebuddy.product (id_product, description, price) values (3, 'C', 30);

create table commercebuddy.coupon(
    code text,
    percentage numeric,
    expire_date timestamp
);

insert into commercebuddy.coupon (code, percentage, expire_date) values ('VALE20', 20, '2024-12-01T10:00:00');
insert into commercebuddy.coupon (code, percentage, expire_date) values ('VALE10', 10, '2024-01-01T10:00:00');