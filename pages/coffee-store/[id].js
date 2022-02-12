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

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

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

const handleUpvoteButton = () => {
  console.log("upvoted");
};

const CoffeeStore = (initialProps) => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    console.log("initialProps.coffeeStore");
    console.log(initialProps.coffeeStore);
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        console.log("true, more stores found");
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === fsq_id; //dynamic [id]
        });
        setCoffeeStore(findCoffeeStoreById);
        // return {
        //   props: {
        //     coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
        //   },
        // };
      }
    }
  }, [coffeeStores, initialProps]);

  const router = useRouter();

  if (router.isFallback === true) {
    return <div>Loading...</div>;
  }

  const fsq_id = router.query.id;
  console.log({ fsq_id });

  // get props from intialProps and the found ones

  console.log({ coffeeStore });

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
              <p className={styles.text}>{location?.address}</p>
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
              <p className={styles.text}>{1}</p>
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
