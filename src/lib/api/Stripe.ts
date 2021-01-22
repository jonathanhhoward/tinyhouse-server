import { Stripe as StripeApi } from "stripe";

const stripe = new StripeApi(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

export class Stripe {
  static async connect(code: string): Promise<StripeApi.OAuthToken> {
    return await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });
  }

  static async charge(
    amount: number,
    source: string,
    stripeAccount: string
  ): Promise<void> {
    const res = await stripe.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripe_account: stripeAccount,
      }
    );

    if (res.status !== "succeeded") {
      throw new Error("failed to create charge with Stripe");
    }
  }
}
