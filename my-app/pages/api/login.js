import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async (req, res) => {
    const { username } = await req.body;

    console.log(username);

    req.session.user = {
      address: "2i424235o-020",
    };

    await req.session.save();

    res.send({ address: "2i424235o-020" });
  },
  {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
