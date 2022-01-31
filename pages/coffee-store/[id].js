import Link from "next/link";
import { useRouter } from "next/router";

const CoffeeStore = () => {
  const router = useRouter();
  console.log(router);
  return (
    <div>
      Coffee Page on {router.query.id}
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <Link href="/coffee-store/ihiuhyio">
        <a>LINK</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
