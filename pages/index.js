import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Banner from "../components/banner";
import Card from "../components/card";
import useTrackLocation from "../hooks/use-track-location";
import styles from "../styles/Home.module.css";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  // console.log(coffeeStores);

  // Fetch data
  return {
    props: { coffeeStores: coffeeStores },
  }; // will be passed to the page as props
}

export default function Home(props) {
  // console.log(props);

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    // async function fetchData() {
    //   // You can await here
    //   const response = await MyAPI.getData(someId);
    //   // ...
    // }
    // fetchData();

    if (latLong) {
      try {
        async function fetchData() {
          const fetchedCoffeeStores = await fetch(
            `/api/getCoffeStoresByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await fetchedCoffeeStores.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: coffeeStores,
            },
          });
          setCoffeeStoresError("");
        }
        fetchData();
      } catch (error) {
        // set error
        console.log({ error });
        setCoffeeStoresError(error.message);
      }
    }
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    console.log("Clicked");
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connaisseur</title>
        <meta
          name="description"
          content="Allows you to discover nice coffee places"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View Stores Nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            alt="image"
            src="/static/hero-image-F.png"
            width={700}
            height={400}
          />
          {/* {console.log(props.coffeeStores.length)} */}
          {props.coffeeStores.length > 0 && (
            <>
              <div className={styles.sectionWrapper}>
                <h2 className={styles.heading2}>Toronto stores</h2>
                <div className={styles.cardLayout}>
                  {/* CArds */}
                  {props.coffeeStores.map((coffeeStore) => {
                    return (
                      <Card
                        key={coffeeStore.fsq_id}
                        name={coffeeStore.name}
                        imgUrl={
                          coffeeStore.imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${coffeeStore.fsq_id}`}
                        className={styles.card}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {coffeeStores.length > 0 && (
            <>
              <div className={styles.sectionWrapper}>
                <h2 className={styles.heading2}>Stores near me</h2>
                <div className={styles.cardLayout}>
                  {/* CArds */}
                  {coffeeStores.map((coffeeStore) => {
                    return (
                      <Card
                        key={coffeeStore.fsq_id}
                        name={coffeeStore.name}
                        imgUrl={
                          coffeeStore.imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${coffeeStore.fsq_id}`}
                        className={styles.card}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}
