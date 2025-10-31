export const hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello World from AWS Lambda!",
      },
      null,
      2
    ),
  };
};

export const register = async (event) => {
  const requestBody = JSON.parse(event.body);
  const username = requestBody.username;
  const email = requestBody.email;

  // Here you would typically add logic to store the user data in a database
  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: `User ${username} registered successfully with email ${email}!`,
      },
      null,
      2
    ),
  };
};
