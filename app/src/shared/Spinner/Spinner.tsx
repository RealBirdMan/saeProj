import React from "react";

import "./Spinner.scss"

interface Props {

}

const Spinner: React.FC<Props> = props => <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>


export default Spinner