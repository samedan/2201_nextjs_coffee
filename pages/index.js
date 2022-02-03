import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";
import styles from "../styles/Home.module.css";
import { fetchCoffeeStores } from "./../lib/coffee-store";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  console.log(coffeeStores);

  // Fetch data
  return {
    props: { coffeeStores: coffeeStores },
  }; // will be passed to the page as props
}

export default function Home(props) {
  console.log(props);
  const handleOnBannerBtnClick = () => {
    console.log("Clicked");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connaisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View Stores Nearby"
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image
            alt="image"
            src="/static/hero-image-F.png"
            width={700}
            height={400}
          />
          {console.log(props.coffeeStores.results.length)}
          {props.coffeeStores.results.length > 0 && (
            <>
              <h2 className={styles.heading2}>Toronto stores</h2>
              <div className={styles.cardLayout}>
                {/* CArds */}
                {props.coffeeStores.results.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.name}
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
            </>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
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
      </footer>
    </div>
  );
}
