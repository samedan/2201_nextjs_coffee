import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import coffeeStoreData from "../../data/coffee-stores.json";

export function getStaticProps(staticProps) {
  const params = staticProps.params;
  console.log("params", params);
  return {
    props: {
      coffeeStore: coffeeStoreData.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id; //dynamic [id]
      }),
    },
  };
}

export function getStaticPaths() {
  const paths = coffeeStoreData.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id.toString() },
    };
  });
  return {
    // paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();

  if (router.isFallback === true) {
    return <div>Loading...</div>;
  }

  const { address, name, neighbourhood } = props.coffeeStore;

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      Coffee Page on {router.query.id}
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeeStore;
