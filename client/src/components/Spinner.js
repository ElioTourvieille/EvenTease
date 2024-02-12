import {ThreeCircles} from "react-loader-spinner";

const Spinner = () => {
    return (
        <ThreeCircles
            visible={true}
            height="150"
            width="150"
            color="#4fa94d"
            ariaLabel="three-circles-loading"
            innerCircleColor="#0080FF"
            middleCircleColor="#E02AFF"
            outerCircleColor="#E02AFF"
        />
    );
};

export default Spinner;