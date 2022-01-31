import Head from "next/head";
import { useRouter } from "next/router";

const DynamicRoute = () => {
  const router = useRouter();
  const query = router.query.dynamic;

  return (
    <div>
      <Head>
        <title>{query}</title>
      </Head>
      Dynamic Route with query: {query}
    </div>
  );
};

export default DynamicRoute;
