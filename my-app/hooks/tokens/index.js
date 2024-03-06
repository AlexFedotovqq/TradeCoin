import { useQuery } from "@tanstack/react-query";

import { fetchTokensPage } from "./queries";

export const useTokensPage = (id) => {
  return useQuery({
    queryKey: [id],
    queryFn: () => fetchTokensPage(id),
  });
};
