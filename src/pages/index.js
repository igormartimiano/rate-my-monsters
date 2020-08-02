import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Home = ({ monsters }) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/mhw");
  }, []);

  return <></>;
};

export default Home;
