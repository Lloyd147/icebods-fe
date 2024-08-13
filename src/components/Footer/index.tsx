import React from "react";
import Accordians from "./Accordians";
import { useRouter } from "next/navigation";

function Footer({ data }: { data: any }) {
  const { push } = useRouter();

  return (
    <>
      <div className="footer-header">
        <img src="/images/svg/Logo.png" className="logo-footer" alt="" />
      </div>
      <div className="footer">
        <div className="followus">
          <div className="follow-detail">
            <div>Follow us</div>
            <img src="/images/svg/flag.svg" alt="" />
          </div>
          <div className="follow-icons">
            {data?.followUs.map((item: any) => (
              <a target="_blank" href={item?.link} rel="noopener noreferrer">
                <img
                  className="follow-icon"
                  src={item?.icon?.imageUrl}
                  onClick={() => push("/admin/login")}
                  alt=""
                />
              </a>
            ))}
          </div>
        </div>
        <div className="page-links">
          {data?.pageLinks.map((item: any) => (
            <a
              target="_blank"
              className="fifty-per"
              href={item?.link}
              rel="noopener noreferrer"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div>{data?.accordians[0]?.mainTitle}</div>
        {data?.accordians[0]?.items.map(
          ({ title, text }: { title: string; text: string }) => (
            <Accordians title={title} text={text} />
          )
        )}

        {data?.otherText.map((item: any) => (
          <div className="other-products">
            <div className="other-product">
              <img
                className="other-text-icon"
                src={item?.icon?.imageUrl}
                alt=""
              />
              <div>{item?.title}</div>
            </div>
            <div className="detail">{item?.text}</div>
          </div>
        ))}

        <div className="powered">POWERED BY ICEBODS</div>
      </div>
    </>
  );
}

export default Footer;
