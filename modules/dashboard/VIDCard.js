import React, {useState} from "react";
import QRCode from "qrcode.react";
import Modal from 'react-modal';
import Lottie from 'react-lottie';

const VIDCard = ({ vid, vhash }) => {
    const [isOpen, setOpen] = useState(false);

    return (<div id="VID-Card" className="card-shadow">
        <h4>My Vidyut ID</h4>
        <p>Your VID is unique, and please mention it whenever we need to identify you</p>
        <div className="vid">
            {vid}
            <div onClick={() => setOpen(true)}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: require('../../images/animations/qr-scanning'),
                    }}
                    width={45}
                />
            </div>
            <Modal
                isOpen={isOpen}
                contentLabel="My Vidyut QR"
                onRequestClose={() => setOpen(false)}
                className="qr-modal"
                overlayClassName="qr-overlay"
            >
                <h4>My Vidyut QR</h4>
                <div>ID: {vid}</div>
                <QRCode value={vhash} size={256} />
                <sub>{vhash}</sub>
            </Modal>
        </div>
    </div>)
};

export default VIDCard;