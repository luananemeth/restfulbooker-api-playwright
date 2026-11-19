import { test, expect } from "@playwright/test";
import { request } from "http";

var token;

test("Consultando as reservas cadastradas", async ({ request }) => {
  // Fazendo uma requisição GET para a API para obter os detalhes das reservas
  const response = await request.get("/booking");
  // Imprimindo os detalhes da reserva no console
  console.log(await response.json());
  // Verificando se a resposta da API foi bem-sucedida (status 200)
  expect(response.ok()).toBeTruthy();
  // Verificando se o status da resposta é 200 (OK)
  expect(response.status()).toBe(200);
});

test("Consultando uma reserva específica", async ({ request }) => {
  const response = await request.get("/booking/312");

  //transforma a resposta em JSON
  const responseBody = await response.json();
  console.log(responseBody);

  //Verificando se a resposta da API está OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  //Verificando se os dados da reserva estão corretos
  expect(responseBody.firstname).toBe("Josh");
  expect(responseBody.lastname).toBe("Allen");
  expect(responseBody.totalprice).toBe(111);
  expect(responseBody.depositpaid).toBeTruthy;
  expect(responseBody.bookingdates.checkin).toBe("2018-01-01");
  expect(responseBody.bookingdates.checkout).toBe("2019-01-01");
  expect(responseBody.additionalneeds).toBe("super bowls");
});

test("Validando apenas os campos da reserva", async ({ request }) => {
  const response = await request.get("/booking/312");
  const responseBody = await response.json();
  console.log(responseBody);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  //Verificando se os campos estão presentes na resposta da API

  expect(responseBody).toHaveProperty("firstname");
  expect(responseBody).toHaveProperty("lastname");
  expect(responseBody).toHaveProperty("totalprice");
  expect(responseBody).toHaveProperty("depositpaid");
  expect(responseBody).toHaveProperty("bookingdates");
  expect(responseBody).toHaveProperty("additionalneeds");
});

test("Cadastrando uma reserva", async ({ request }) => {
  const response = await request.post("/booking", {
    data: {
      firstname: "Lulu",
      lastname: "Mil Grau",
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: "2026-11-18",
        checkout: "2026-12-18",
      },
      additionalneeds: "Lunch",
    },
  });
  const responseBody = await response.json();
  console.log(responseBody);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  // Validado os dados de Retorno

  expect(responseBody.booking).toHaveProperty("firstname", "Lulu");
  expect(responseBody.booking).toHaveProperty("lastname", "Mil Grau");
  expect(responseBody.booking).toHaveProperty("totalprice", 100);
  expect(responseBody.booking).toHaveProperty("depositpaid", true);
  expect(responseBody.booking).toHaveProperty("bookingdates");
  expect(responseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2026-11-18",
  );
  expect(responseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    "2026-12-18",
  );
  expect(responseBody.booking).toHaveProperty("additionalneeds", "Lunch");
});

test("Gerando um token", async ({ request }) => {
  const response = await request.post("/auth", {
    data: {
      username: "admin",
      password: "password123",
    },
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);

  expect(responseBody).toHaveProperty("token");
  expect(responseBody.token).toBeTruthy();

  token = responseBody.token;
  console.log("Seu token é: " + token);
});

test("Atualizando parcialmente uma reserva", async ({ request }) => {
  // gerando o token
  const response = await request.post("/auth", {
    data: {
      username: "admin",
      password: "password123",
    },
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("token");
  expect(responseBody.token).toBeTruthy();

  token = responseBody.token;

  // Atualizando os dados da reserva

  const partialUpdateRequest = await request.patch("/booking/198", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `token=${token}`,
    },

    data: {
      firstname: "Luluzinha",
      lastname: "Lulinha",
    },
  });

  console.log(await partialUpdateRequest.json());

  expect(partialUpdateRequest.status()).toBe(200);

  const partialUpdateResponseBody = await partialUpdateRequest.json();

  expect(partialUpdateResponseBody).toHaveProperty("firstname", "Luluzinha");
  expect(partialUpdateResponseBody).toHaveProperty("lastname", "Lulinha");
});
