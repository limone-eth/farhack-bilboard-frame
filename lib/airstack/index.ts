import { GetNftQueryQuery } from "./types";
import { fetchQuery, init } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY) {
  throw new Error("AIRSTACK_API_KEY is missing");
}

init(process.env.AIRSTACK_API_KEY!);

const query = /* GraphQL */ `
  query GetNFTQuery($address: Address!) {
    Tokens(
      input: { filter: { address: { _eq: $address } }, blockchain: base }
    ) {
      Token {
        name
        symbol
        contractMetaDataURI
        address
        tokenNfts(input: { order: { tokenId: ASC } }) {
          tokenId
          rawMetaData
          type
          tokenBalances {
            owner {
              identity
            }
          }
        }
      }
    }
  }
`;

interface QueryResponse {
  data: GetNftQueryQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchNFTData = async (address: string) => {
  const { data, error }: QueryResponse = await fetchQuery(query, { address });
  if (
    error ||
    !data ||
    !data.Tokens ||
    !data.Tokens.Token ||
    data.Tokens.Token?.length === 0
  ) {
    return false;
  }
  return data.Tokens.Token[0];
};
