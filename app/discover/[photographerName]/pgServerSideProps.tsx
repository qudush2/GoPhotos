import { GetServerSideProps } from "next";
import {
  getAccountDetailsByName,
  getPhotographer,
  getAssets,
} from "@/utils/api2";
import { ParsedUrlQuery } from "querystring";

interface IParams extends ParsedUrlQuery {
    photographerName: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params as IParams;
  const photographerName = params.photographerName;
  console.log(photographerName)
  const decodedName = decodeURIComponent('Qudus%20Shittu');
  // const decodedName = decodeURIComponent(photographerName);

  console.log('this is a test to make sure the photographer name is being decoded', decodedName);

  const account = await getAccountDetailsByName(decodedName);
  const photographer = await getPhotographer(account.id);
  const assets = await getAssets(photographer.accountId);

  if (!photographer) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      photographer,
      account,
      assets,
    },
  };
};
