import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Typography from "@material-ui/core/Typography";

import { profileInterface } from "../../../util/interface/profileInterface";
import { useHttpClient } from "../../../util/hooks/http-hook";
import Modal from "../../../shared/Modals/Modal";
import ProfilePopups from "./ProfilePopups";
import ProfileForm from "./ProfileForm";
import "./Profile.scss";

interface Props { }

const Profile: React.FC<Props> = props => {
  const formStateValue: profileInterface = {
    id: "",
    companyName: "",
    street: "",
    postal: "",
    city: "",
    tel: "",
    taxNumber: "",
    taxId: "",
    firstName: "",
    lastName: "",
    iban: "DE",
    bic: "",
    defaultText: "",
  };

  const { httpState, sendRequest, clearError } = useHttpClient();

  const [initialFormstate, setInitialFormstate] = useState<{ checkedProfile: boolean, value: null | profileInterface }>({ checkedProfile: false, value: null });

  useEffect(() => {
    (async function () {
      const response = await sendRequest("/api/dashboard/profile");
      setInitialFormstate({ checkedProfile: true, value: response.data });
      clearError();
    })();
  }, [sendRequest, clearError]);

  return (
    <motion.div
      className='profile__container'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: "-100vw" }}
      transition={{ ease: "easeInOut" }}
    >
      <Modal>
        <Typography component='h1' variant='h2' color='textPrimary'>
          Profile:
        </Typography>
        <hr />
        {initialFormstate.checkedProfile && (
          <ProfileForm
            httpState={httpState}
            sendRequest={sendRequest}
            initialFormstate={initialFormstate.value ? initialFormstate.value : formStateValue}
            requestData={initialFormstate.value ? { url: `/api/dashboard/profile/${initialFormstate.value.id}`, method: "PATCH" } : { url: "/api/dashboard/profile", method: "POST" }}
          />
        )}
        <ProfilePopups httpState={httpState} clearError={clearError} />
      </Modal>
    </motion.div>
  );
};

export default Profile;
