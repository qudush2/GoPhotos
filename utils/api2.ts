import { Account, Asset, Photographer} from "./types";

export async function getPhotographers(
  eventType?: string
): Promise<Photographer[]> {
  const queryParams = eventType ? `?eventType=${eventType}` : "";
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/photographers${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SERVER_SECRET}`,
      },
      cache: "no-cache",
    }
  ).then((res) => res.json());

  return data;
}

export async function getAccount(accountId: string): Promise<Account> {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/accounts/${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SERVER_SECRET}`,
      },
    }
  ).then((res) => res.json());

  return data;
}

export async function getAssets(accountId: string): Promise<Asset[]> {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/assets?accountId=${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SERVER_SECRET}`,
      },
    }
  ).then((res) => res.json());

  return data;
}

export async function getAccountDetailsByName(name: string): Promise<Account> {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/accounts`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SERVER_SECRET}`,
      },
    }
  ).then((res) => res.json());

  const account = data.find((account: Account) => account.fullName === name);

  return account;
}

export async function getPhotographer(
  accountId: string
): Promise<Photographer> {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/photographers`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SERVER_SECRET}`,
      },
    }
  ).then((res) => res.json());

  const photographer = data.find((photographer: Photographer) => photographer.accountId === accountId);

  return photographer;
}