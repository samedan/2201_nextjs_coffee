import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
// import coffeeStoreData from "../../data/coffee-stores.json";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "./../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { useContext, useState, useEffect } from "react";
import { isEmpty } from "../../utils";
import useSwr from "swr";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  console.log("params");
  console.log(params);

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id; //dynamic [id]
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  console.log("STep getStaticPaths");
  const coffeeStores = await fetchCoffeeStores();
  // console.log(coffeeStores);
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.fsq_id.toString() },
    };
  });
  return {
    // paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    paths,
    // no 404 page
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const fsq_id = router.query.id;
  console.log({ fsq_id });

  // get props from intialProps and the found ones

  // console.log({ coffeeStore });

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const [votingCount, setVotingCount] = useState(1);

  const handleUpvoteButton = () => {
    console.log("upvoted");
    let count = votingCount + 1;
    setVotingCount(count);
  };

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      console.log("coffeeStore");
      console.log(coffeeStore);
      const { fsq_id, name, voting, location, imgUrl, neighborhood, address } =
        coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `${fsq_id}`,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighborhood || "",
          address: location.formatted_address || "",
        }),
      });
      const dbCoffeeStore = await response.json();
      console.log("dbCoffeeStore");
      console.log(dbCoffeeStore);
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    // console.log("STep useEffect");
    // console.log("initialProps.coffeeStore");
    // console.log(initialProps.coffeeStore);
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        console.log("true, more stores found");
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          // if (coffeeStore.fsq_id.toString() === fsq_id) {
          //   console.log("found fsq_id", fsq_id);
          //   console.log("coffee store 97", coffeeStore);
          // }

          return coffeeStore.fsq_id.toString() === fsq_id; //dynamic [id]
        });

        // return {
        //   props: {
        //     coffeeStore: coffeeStoreFromContext ? coffeeStoreFromContext : {},
        //   },
        // };
        if (coffeeStoreFromContext) {
          // console.log(coffeeStoreFromContext);
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSR - Server Side Rendering
      // the Stores loaded as default (without searching)
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [fsq_id, initialProps, initialProps.coffeeStore]);

  // SWR
  const { data, error } = useSwr(`/api/getCoffeeStoreById?id=${fsq_id}`);
  console.log({ data });

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data from SWR");
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>Smth went wrong retrievineg coffee store page</div>;
  }

  if (router.isFallback === true) {
    return <div>Loading...</div>;
  }

  if (coffeeStore) {
    const { address, location, name, imgUrl } = coffeeStore;
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">
                <a>
                  ←{" "}
                  <span style={{ textDecoration: "underline" }}>
                    Back to Home
                  </span>
                </a>
              </Link>
            </div>
            <div className={styles.nameWrapper}>
              <h1>{name}</h1>
            </div>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name}
            />
          </div>
          {/* Col 2 */}
          <div className={cls("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width={24}
                height={24}
                alt="Icon"
              />
              <p className={styles.text}>{location?.address || address}</p>
            </div>
            {location?.neighborhood && (
              <div className={styles.iconWrapper}>
                <Image
                  src="/static/icons/nearMe.svg"
                  width={24}
                  height={24}
                  alt="Icon"
                />
                <p className={styles.text}>{location?.neighborhood}</p>
              </div>
            )}

            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/star.svg"
                width={24}
                height={24}
                alt="Icon"
              />
              <p className={styles.text}>{votingCount}</p>
            </div>
            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
            >
              Upvote
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">
                <a>
                  ←{" "}
                  <span style={{ textDecoration: "underline" }}>
                    Back to Home
                  </span>
                </a>
              </Link>
            </div>
          </div>
          {/* Col 2 */}
        </div>
      </div>
    );
  }
};

export default CoffeeStore;
