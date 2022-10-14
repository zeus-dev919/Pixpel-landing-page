import { useState } from "react";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../../../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import { FullscreenLoader } from "../../../components/loader";
import { faqList } from "./faqlist";
import "../../../App.scss";
import ContactNFT from "../../../assets/images/contact-image.png";
import * as emailjs from "emailjs-com";
import "react-toastify/dist/ReactToastify.css";
import frame from "../../../assets/background/contact-sub-background.png";

const SERVICE_ID: string = String(process.env.REACT_APP_SERVICE_ID);
const TEMPLATE_ID: string = String(process.env.REACT_APP_TEMPLATE_ID);
const PUBLIC_KEY: string = String(process.env.REACT_APP_PUBLIC_KEY);

declare type FapProps = {
  question: string;
  answer: string;
  id: number;
  handleFaqClicked: any;
};

const FaqItem = (props: FapProps) => {
  const context = useAppContext();

  return (
    <div className="flex flex-row text-white">
      <div
        className="flex flex-col p-2 py-4 cursor-pointer w-full"
        onClick={() => {
          props.handleFaqClicked(props.id);
        }}
      >
        <div className="flex justify-between items-center text-base2 font-semibold py-2 rounded-lg border-app-blue faqitem-bg px-2">
          {props.question}
        </div>
        {context.faqStatus[props.id] && (
          <>
            <div
              className={`show mt-2 text-black flex openitem-bg text-base font-light py-2 px-2 rounded-lg`}
            >
              {props.answer}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function Faq() {
  const context = useAppContext();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    from_name: "",
    message: "",
  });

  const handleFaqClicked = (id: number) => {
    let _faqStatus: boolean[] = [false, false, false, false];
    for (let i = 0; i < context.faqStatus.length; i++) {
      if (id === i) {
        _faqStatus[i] = !context.faqStatus[i];
      }
    }

    context.setFaqStatus(_faqStatus);
  };

  const ValidateEmail = (mail: any) => {
    let mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (mail.match(mailformat)) return true;
    else return false;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (values.message === "") {
      toast.error("Please fill the message.");
      return;
    }

    if (!ValidateEmail(values.from_name)) {
      toast.warning("Incorrect email.");
      return;
    }

    setLoading(true);

    emailjs.send(SERVICE_ID, TEMPLATE_ID, values, PUBLIC_KEY).then(
      function (response) {
        console.log(
          "email send response >>>>>>",
          response.status,
          response.text
        );
        setLoading(false);
        toast.success("Successfully submitted.");
      },
      function (err) {
        console.log("email send error >>>>>>", err);
        setLoading(false);
        toast.error("Error connection");
      }
    );
  };

  const handleChange = (e: any) => {
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <ToastContainer />
      {loading === true && <FullscreenLoader msg="Loading" />}
      <div className="" id="faq">
        {context.clickedContact ? (
          <div className="contact-bg min-h-screen">
            <div className="show flex flex-col-reverse md:flex-row mx-auto w-full gap-8 py-28 px-4 md:px-8 lg:px-12 xl:px-24 2xl:px-36 3xl:px-48">
              <div className="w-full md:w-2/5">
                <div className="flex flex-col gap-8 mx-auto my-auto">
                  <div className="text-white text-6xl font-semibold">
                    We´d love to hear from you
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-white h-9 px-2">
                    <input
                      placeholder="Email"
                      type="text"
                      onChange={(e) => handleChange(e)}
                      value={values.from_name}
                      name="from_name"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg bg-white h-36 px-2">
                    <textarea
                      placeholder="Your message"
                      onChange={(e) => handleChange(e)}
                      cols={100}
                      className="h-32"
                      name="message"
                      value={values.message}
                    ></textarea>
                  </div>
                  <div className="flex flex-col tiny:flex-row gap-4">
                    <button
                      className="w-full subscribe-btn text-white h-12 mx-auto"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Send
                    </button>
                    <button
                      className="w-full subscribe-btn text-white h-12 mx-auto"
                      onClick={() => context.setClickedContact(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/5">
                <img
                  src={ContactNFT}
                  alt="contact_nft"
                  className="w-full mx-auto"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="faq-bg min-h-screen">
            <div className="flex flex-col px-4 md:px-8 lg:px-12 xl:px-24 2xl:px-36 3xl:px-48 py-12 items-center justify-center text-white">
              <div className="flex flex-col lg:flex-row gap-8 w-full mb-8">
                <div className="flex items-center w-full lg:w-2/5">
                  <div className="flex font-semibold text-5xl">
                    Have more questions?
                  </div>
                </div>
                <div className="flex flex-col w-full lg:w-3/5">
                  {faqList.map((dt, idx) => {
                    return (
                      <FaqItem
                        {...dt}
                        key={idx}
                        id={idx}
                        handleFaqClicked={handleFaqClicked}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 flex flex-col lg:flex-row gap-4 items-center justify-center w-full lg:w-3/4 hr-gradient">
                <div className="flex flex-col gap-2 w-full lg:w-2/5">
                  <div className="text-self-xl font-semibold">
                    Are you a GAMER?
                  </div>
                  <div className="text-base2 font-normal lg:w-5/6 w-full">
                    Enter your email and subscribe to get the latest news!
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row w-full lg:w-3/5 justify-center gap-5">
                  <div className="gradient-border-bg py-3 sm:px-16 px-4 w-max">Enter your email address</div>
                  <button className="subscribe-btn w-48 h-12 mx-auto hover:cursor-pointer">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col lg:flex-row gap-4 items-center justify-center w-full lg:w-3/4 hr-gradient">
                <div className="flex flex-col gap-2 w-full lg:w-1/2">
                  <div className="text-self-xl font-semibold">
                    Are you a DEVELOPER?
                  </div>
                  <div className="text-base2 font-normal">
                    Get in touch with us!
                  </div>
                </div>
                <div className="flex gap-2 w-full lg:w-1/2">
                  <button
                    className="subscribe-btn text-white w-48 h-12 mx-auto"
                    onClick={() => context.setClickedContact(true)}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Faq;
