import { Stripe } from "stripe";

const stripe = new Stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

async function connect(code: string): Promise<Stripe.OAuthToken> {
  return await stripe.oauth.token({
    grant_type: "authorization_code",
    code,
  });
}

export const StripeApi = {
  connect,
};
