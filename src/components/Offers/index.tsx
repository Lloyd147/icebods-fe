"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "@/lib/constants";
import TabCard, { Offer } from "../TabCards";
import InfiniteScroll from "react-infinite-scroll-component";
import Toggle from "../Toggle";
import Footer from "../Footer/index";
import { findItemByKey } from "@/lib/utils";

interface OffersProps {
  initialOffers: Offer[];
}

export type PriceRanges = {
  barrels: string;
  portables: string;
  tubs: string;
};

const defaultPriceRanges = ["70-100", "500-1500", "1000-20000"];

const apiCategories = {
  basic: "portables",
  ["mid-tier"]: "barrels",
  luxury: "tubs",
};

const Offers = ({ initialOffers }: OffersProps) => {
  const [offers, setOffers] = useState(initialOffers);
  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState("basic");
  const [priceRanges, setPriceRanges] = useState(defaultPriceRanges);
  const [hasMore, setHasMore] = useState(initialOffers?.length >= 99);
  const pageSize = 100;

  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    if (pageNumber > 1)
      axios
        .get(`${API_ENDPOINT}/${(apiCategories as any)[category]}`, {
          params: {
            pageNumber: 1,
            pageSize,
          },
        })
        .then((response: { data: { offers: Offer[] } }) => {
          const newOffers = response?.data?.offers;

          if (newOffers.length === 0) {
            setHasMore(false);
          } else {
            setOffers([...offers, ...newOffers] as any);
          }
        })
        .catch((error: any) => {
          console.error("Error fetching offers:", error);
        });
  }, [pageNumber]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/${(apiCategories as any)[category]}`, {
        params: {
          pageNumber,
          pageSize,
        },
      })
      .then((response: { data: { offers: Offer[] } }) => {
        const newOffers = response?.data?.offers;
        setOffers(newOffers);
      })
      .catch((error: any) => {
        console.error("Error fetching offers:", error);
      });
  }, [category]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/price-range`)
      .then((response: { data: PriceRanges }) => {
        const ranges = response?.data;

        const rangeOptions = [
          ranges?.portables ?? "70-100",
          ranges?.barrels ?? "500-1500",
          ranges?.tubs ?? "1000-20000",
        ];
        setPriceRanges(rangeOptions);
      })
      .catch((error: any) => {
        console.log("price-range error: ", error);
      });
  }, []);

  const [footers, setFooters] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/footer/footers`)
      .then((response: { data: any }) => {
        const footers = response?.data;
        //  dispatch(setOdds(odds));
        setFooters(footers);
      })
      .catch((error: any) => {
        console.log("Odds error: ", error);
      });
    const blogs = JSON.parse(localStorage.getItem("blogs")!);
  }, []);

  const item = findItemByKey(footers, "name", "Odds footer");
  const itemAllFooters = findItemByKey(footers, "name", "Set All Footers");

  return (
    <>
      <Toggle
        active={category}
        setActive={setCategory}
        items={["Basic", "Mid-Tier", "Luxury"]}
        subItems={priceRanges}
      />
      <InfiniteScroll
        dataLength={offers.length}
        next={loadMoreOffers}
        hasMore={hasMore}
        loader={
          <div className="loader-gif">
            <img src="/images/loading.gif" alt="" />
          </div>
        }
      >
        {offers?.length > 0 &&
          offers?.map((data, index) => (
            <TabCard data={data} key={index} data-index={index} />
          ))}

        {item?.status == "active" ? (
          <Footer data={item} />
        ) : itemAllFooters?.status == "active" ? (
          <Footer data={itemAllFooters} />
        ) : null}
      </InfiniteScroll>
    </>
  );
};

export default Offers;
